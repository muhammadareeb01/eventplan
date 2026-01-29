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

// Create a booking: Check availability in Sanity, then Create Booking Doc
export const createBooking = async (bookingData: Booking) => {
  try {
    // 1. Get Event Configuration (Capacities)
    // NOTE: Capacities are currently hardcoded, but you should move this to your Event schema in Sanity!
    const tablesConfig = {
       regular: { total: 125 },
       wall: { total: 50 },
       premium: { total: 25 }
    };
    
    const limit = tablesConfig[bookingData.tableType as keyof typeof tablesConfig].total;

    // 2. Count existing confirmed bookings for this type
    // Query Sanity for all bookings for this event, table type, and valid status
    const countQuery = `count(*[_type == "booking" && event._ref == $eventId && tableType == $tableType && status in ["paid", "confirmed"]])`;
    
    const currentBookedCount = await client.fetch(countQuery, { 
        eventId: bookingData.eventId,
        tableType: bookingData.tableType 
    });

    // 3. Validate
    if (currentBookedCount + bookingData.quantity > limit) {
       throw new Error(`Not enough tables. ${limit - currentBookedCount} left.`);
    }

    // 4. Create Receipt (The Booking) in Sanity
    const doc = {
        _type: 'booking',
        event: {
            _type: 'reference',
            _ref: bookingData.eventId
        },
        customerName: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        tableType: bookingData.tableType,
        quantity: bookingData.quantity,
        totalAmount: bookingData.totalAmount,
        status: bookingData.status,
        stripePaymentId: bookingData.paymentId,
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate Order Number
        createdAt: new Date().toISOString()
    };

    await writeClient.create(doc);
    
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

