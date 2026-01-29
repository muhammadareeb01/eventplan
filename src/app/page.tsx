import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import ClientSeeder from '@/components/ClientSeeder';
import { eventsData as staticEventsData } from '@/lib/data';
import { Star, Shield, Zap } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { defineQuery } from 'next-sanity';

const EVENTS_QUERY = defineQuery(`*[_type == "event"] | order(date asc) {
  _id,
  name,
  "description": pt::text(description),
  date,
  time,
  location,
  "imageUrl": image.asset->url,
  price
}`);

export default async function Home() {
  const eventsFromSanity = await client.fetch(EVENTS_QUERY);

  const events = eventsFromSanity.length > 0 ? eventsFromSanity.map((e: any) => {
    const rawDescription = e.description || "";
    const dateObj = new Date(e.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = e.time || "10:00 AM - 4:00 PM";

      return {
          id: e._id,
          title: e.name,
          description: rawDescription,
          date: dateStr,
          time: timeStr,
          locationName: e.location || "TBA",
          locationAddress: e.location || "", 
          locationCity: "",
          entryFee: e.price ? `$${e.price}` : "Free",
          imageUrl: e.imageUrl, // Added image URL
          featured: false 
      };
  }) : staticEventsData;

  return (
    <>
      <ClientSeeder />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section style={{ 
          padding: '8rem 0 4rem 0', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          {/* Background Glows - Gold */}
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: -1 }} />
          <div style={{ position: 'absolute', bottom: '0%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,230,202,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: -1 }} />

          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div className="animate-fade-in">
                <span style={{ 
                  display: 'inline-block', 
                  background: 'rgba(212,175,55,0.1)', 
                  color: 'var(--primary)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '999px', 
                  fontWeight: 600, 
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-highlight)'
                }}>
                  Please Join Us For The Next Big Event 🚀
                </span>
                <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
                  The Midwest's Premier <br />
                  <span className="text-gradient">Card & Collectibles Show</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '500px' }}>
                  Experience over 150 tables of pure nostalgia. From Pokemon to Sports Cards, we bring the best vendors and collectors together.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href="#events" className="btn btn-primary">
                    View Upcoming Shows
                  </a>
                </div>
              </div>

              <div className="animate-fade-in" style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'relative', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
                }}>
                  <Image 
                    src="/hero-image.png" 
                    alt="Premium Card Event" 
                    width={800} 
                    height={600} 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    priority
                  />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(5,5,17,0.8) 0%, transparent 50%)' 
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Trust */}
        <div className="container" style={{ margin: '2rem auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '2rem' 
          }}>
            {[
              { icon: Star, label: 'Premium Experience', desc: 'Curated vendors & high-end collectibles' },
              { icon: Shield, label: 'Secure Venue', desc: 'Safe environment for high-value trades' },
              { icon: Zap, label: 'Instant Booking', desc: 'Reserve your table in seconds' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--secondary)' }}>
                  <stat.icon size={24} />
                </div>
                <h4 style={{ marginBottom: '0.25rem' }}>{stat.label}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Events listing */}
        <section id="events" style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ marginBottom: '1rem' }}>Upcoming <span className="text-gradient">Events</span></h2>
                <p style={{ color: 'var(--text-muted)' }}>Don't miss out on our next big gathering.</p>
              </div>
              <button className="btn btn-outline" style={{ display: 'none' }}>View All</button>
            </div>

            <div className="grid-2">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '6rem 0' }}>
          <div className="container">
            <div style={{ 
              background: 'linear-gradient(135deg, #171717 0%, #000000 100%)', 
              borderRadius: '24px', 
              padding: '4rem', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--border-highlight)'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>Don't Miss The Action!</h2>
                <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                  Secure your spot at the biggest collecting event of the year. 
                  Tickets and tables are selling fast.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                   <a href="#events" className="btn" style={{ background: 'var(--primary)', color: 'white', fontWeight: 700 }}>
                    Reserve Your Spot
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

