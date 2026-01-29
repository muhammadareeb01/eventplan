import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

/*
  Ensure you have added your Sanity Project ID and Dataset in .env.local
  NEXT_PUBLIC_SANITY_PROJECT_ID=...
  NEXT_PUBLIC_SANITY_DATASET=...
*/

async function getEvents() {
  const query = `*[_type == "event"] | order(date asc) {
    _id,
    name,
    slug,
    date,
    time,
    location,
    description,
    "imageUrl": image.asset->url,
    price
  }`;
  
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return [];
  }

  return await client.fetch(query);
}

export default async function EventsPage() {
  const events = await getEvents();

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
     return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center text-red-500">
           Please configure your .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
        </div>
     )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found. Add some in the Studio!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <div key={event._id} className="border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
              {event.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <p>{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'} {event.time ? `at ${event.time}` : ''}</p>
                  <p>{event.location}</p>
                </div>
                {event.price && (
                   <div className="font-semibold text-green-600 mb-2">${event.price}</div>
                )}
                {/* 
                  Description is PortableText, simplified here slightly or cut off.
                  For full description, we probably want a link to details page.
                */}
                <div className="mt-4">
                     {/* Placeholder for 'Read More' or similar */}
                     <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full">
                        View Details
                     </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
