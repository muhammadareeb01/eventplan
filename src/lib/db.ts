"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";

export interface Booking {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  tableType: 'regular' | 'wall' | 'premium';
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'confirmed';
  paymentId?: string;
}

// Function to seed initial data - No longer needed with Sanity
export const seedEventsIfEmpty = async () => {
  return;
};

// Lazy-create event - No longer needed with Sanity as we fetch directly
export const ensureEventExists = async (event: any) => {
  return true;
};

// Get a single event - Fetch from Sanity directly if needed, or rely on page props
export const getEventDetails = async (eventId: string) => {
   // This is a comprehensive query to fetch event details including table configuration if we add it later
   const query = `*[_type == "event" && _id == $eventId][0]`;
   return await client.fetch(query, { eventId });
};

export const getEventAvailability = async (eventId: string) => {
  // Fetch Table documents for this event
  const query = `{
    "tables": *[_type == "table" && event._ref == $eventId] { 
        _id,
        title, 
        price, 
        availableQuantity, 
        sold
    }
  }`;

  const { tables } = await client.fetch(query, { eventId });

  // Key by ID
  const availability: Record<string, { total: number; booked: number; remaining: number; price: number; label: string, tableDocId?: string }> = {};

  // If no tables defined, return empty to force configuration in CMS
  if (!tables || tables.length === 0) {
      console.warn(`No table configuration found for event ${eventId}`);
      return {};
  } else {
      tables.forEach((t: any) => {
          // Use _id as the unique key
          const key = t._id;
          const sold = t.sold || 0;
          availability[key] = {
              total: t.availableQuantity,
              booked: sold,
              remaining: Math.max(0, t.availableQuantity - sold),
              price: t.price,
              label: t.title,
              tableDocId: t._id
          };
      });
  }

  return availability;
};

// Create a booking: Check availability in Sanity, then Create Booking Doc
export const createBooking = async (bookingData: Booking) => {
  console.log("createBooking started:", JSON.stringify(bookingData));
  
  if (!process.env.SANITY_API_TOKEN) {
      console.error("Missing SANITY_API_TOKEN environment variable");
      return { success: false, error: "Server configuration error: Missing API Token" };
  }

  try {
    // 1. Get Event Configuration
    const query = `*[_type == "table" && _id == $tableId][0]`;
    
    // Safety check: ensure tableId is provided
    if (!bookingData.tableType) {
        throw new Error("No table selected");
    }

    const tableDoc = await client.fetch(query, { 
        tableId: bookingData.tableType 
    });

    console.log("Table document found:", tableDoc ? tableDoc._id : "None");

    let limit = 0;
    let tableDocId: string | null = null;
    let currentSold = 0;
    let tableLabel = "";

    if (tableDoc) {
        limit = tableDoc.availableQuantity;
        currentSold = tableDoc.sold || 0;
        tableDocId = tableDoc._id;
        tableLabel = tableDoc.title;
    } else {
        throw new Error(`The selected table is no longer available.`);
    }

    const requested = bookingData.quantity;

    // 2. Validate
    if (currentSold + requested > limit) {
       return { 
           success: false, 
           error: `Not enough tables. ${Math.max(0, limit - currentSold)} left.` 
       };
    }

    // 3. Create Receipt (The Booking) in Sanity
    const doc = {
        _type: 'booking',
        event: {
            _type: 'reference',
            _ref: bookingData.eventId
        },
        customerName: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        tableType: bookingData.tableType, // Storing ID now
        tableName: tableLabel, // Also store a snapshot of the name for readability
        quantity: bookingData.quantity,
        totalAmount: bookingData.totalAmount,
        status: bookingData.status,
        stripePaymentId: bookingData.paymentId,
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate Order Number
        createdAt: new Date().toISOString()
    };
    
    console.log("Creating booking document...");
    const createdBooking = await writeClient.create(doc);
    console.log("Booking created with ID:", createdBooking?._id);

    // 4. Update Table 'Sold' Counter (For Admin Visibility)
    // We update the specific 'table' document
    if (tableDocId) {
        try {
            console.log("Patching table doc:", tableDocId);
            await writeClient
              .patch(tableDocId)
              .inc({ sold: bookingData.quantity }) // Simple increment on top-level field
              .commit();
            console.log("Table sold count updated.");
        } catch (patchError) {
            console.error("Failed to update table sold counter:", patchError);
        }
    }
    
    return { success: true };
  } catch (e: any) {
    console.error("Booking failed: ", e);
    return { success: false, error: e.message };
  }
};

// For Admin Dashboard: Get all bookings
export const getAllBookings = async () => {
  const query = `*[_type == "booking"] | order(createdAt desc) {
      ...,
      event->{name, date}
  }`;
  return await client.fetch(query);
};

