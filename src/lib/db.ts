import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteField,
  serverTimestamp,
  query,
  where,
  getCountFromServer
} from "firebase/firestore";
import { db } from "./firebase";
import { eventsData } from "./data";

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
}

// Collection References
const EVENTS_COLLECTION = "events";
const BOOKINGS_COLLECTION = "bookings";

// Function to seed initial data + cleanup structure
export const seedEventsIfEmpty = async () => {
  console.log("Checking/Seeding events...");
  
  for (const event of eventsData) {
    const eventRef = doc(db, EVENTS_COLLECTION, event.id);
    const eventSnap = await getDoc(eventRef);

    // Static config - no 'booked' counter here
    const tablesConfig = {
      regular: { total: 125, price: 50 },
      wall: { total: 50, price: 60 },
      premium: { total: 25, price: 70 }
    };

    if (!eventSnap.exists()) {
       console.log(`Seeding missing event: ${event.id}`);
       const eventWithTables = {
        ...event,
        tables: tablesConfig,
        createdAt: serverTimestamp()
      };
      await setDoc(eventRef, eventWithTables);
    } else {
        // Migration: Remove 'seats' and remove 'booked' from tables
        await updateDoc(eventRef, {
             "tables": tablesConfig,
             "seats": deleteField() // Permanently delete the old field
        });
        console.log(`Schema Cleanup: Removed 'booked' counters & 'seats' field for event: ${event.id}`);
    }
  }
};

// Get a single event
export const getEventDetails = async (eventId: string) => {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return eventsData.find(e => e.id === eventId);
  }
};

// Create a booking: Counts existing bookings to check availability instead of updating event doc
export const createBooking = async (bookingData: Booking) => {
  try {
    // 1. Get Event Configuration (Capacities)
    const eventRef = doc(db, EVENTS_COLLECTION, bookingData.eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) throw new Error("Event not found");
    
    // Lazy creation fallback handled by seed function usually, but check just in case
    const tablesConfig = eventDoc.data().tables || {
       regular: { total: 125, price: 50 },
       wall: { total: 50, price: 60 },
       premium: { total: 25, price: 70 }
    };
    
    const limit = tablesConfig[bookingData.tableType].total;

    // 2. Count existing confirmed bookings for this type
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("eventId", "==", bookingData.eventId),
      where("tableType", "==", bookingData.tableType)
    );
    
    const snapshot = await getCountFromServer(q);
    const currentBookedCount = snapshot.data().count;

    // 3. Validate
    if (currentBookedCount + bookingData.quantity > limit) {
       throw new Error(`Not enough tables. ${limit - currentBookedCount} left.`);
    }

    // 4. Create Receipt (The Booking)
    await addDoc(collection(db, BOOKINGS_COLLECTION), {
       ...bookingData,
       createdAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (e: any) {
    console.error("Booking failed: ", e);
    return { success: false, error: e.message };
  }
};

// For Admin Dashboard: Get all bookings
export const getAllBookings = async () => {
  const q = query(collection(db, BOOKINGS_COLLECTION));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};
