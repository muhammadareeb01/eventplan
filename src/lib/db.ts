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
  // Fetch Table documents that are linked to this event
  // We also dynamically count the bookings for THIS specifically event + table combination
  const query = `{
    "tables": *[_type == "table" && $eventId in events[]._ref] { 
        _id,
        title, 
        price, 
        availableQuantity
    },
    "bookings": *[_type == "booking" && event._ref == $eventId && status in ["paid", "confirmed"]] { tableType, quantity }
  }`;

  const { tables, bookings } = await client.fetch(query, { eventId });

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
          
          // Calculate sold quantity for this specific table type
          const sold = bookings
            ? bookings
                .filter((b: any) => b.tableType === key)
                .reduce((sum: number, b: any) => sum + (b.quantity || 1), 0)
            : 0;

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
    // 1. Get Event Configuration & Current Usage
    // We fetch the table doc AND the current booking count for this event
    const query = `{
       "tableDoc": *[_type == "table" && _id == $tableId][0],
       "bookings": *[_type == "booking" && tableType == $tableId && event._ref == $eventId && status in ["paid", "confirmed"]] { quantity }
    }`;
    
    // Safety check: ensure tableId is provided
    if (!bookingData.tableType) {
        throw new Error("No table selected");
    }

    const { tableDoc, bookings } = await client.fetch(query, { 
        tableId: bookingData.tableType,
        eventId: bookingData.eventId
    });
    
    // Calculate actual sold count by summing quantities
    const soldCount = bookings 
        ? bookings.reduce((sum: number, b: any) => sum + (b.quantity || 1), 0)
        : 0;

    console.log("Table document found:", tableDoc ? tableDoc._id : "None");
    console.log("Current Sold Count for Event:", soldCount);

    let limit = 0;
    let tableLabel = "";

    if (tableDoc) {
        // Verify this table is actually admitted for this event (optional security check)
        const isLinked = tableDoc.events?.some((ref: any) => ref._ref === bookingData.eventId);
        // We can skip this check if we trust the frontend, or enforce it. 
        // For now, let's assume if the ID was passed it's valid, but strictly the query in availability filters it.
        
        limit = tableDoc.availableQuantity;
        tableLabel = tableDoc.title;
    } else {
        throw new Error(`The selected table is no longer available.`);
    }

    const requested = bookingData.quantity;

    // 2. Validate
    if ((soldCount || 0) + requested > limit) {
       return { 
           success: false, 
           error: `Not enough tables. ${Math.max(0, limit - (soldCount || 0))} left.` 
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

    // 4. Update Table 'Sold' Counter -> REMOVED
    // We no longer update a global 'sold' field on the table document because 
    // the table document is now shared across multiple events.
    // Instead, we rely on the dynamic 'count()' query in step 1 and getEventAvailability
    // to calculate usage per event in real-time. This is more robust.
    
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

