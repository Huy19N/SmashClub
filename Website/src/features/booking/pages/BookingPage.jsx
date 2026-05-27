import SEOManager from '../../../components/seo/SEOManager';

/**
 * BookingPage
 * Modular Court Booking page wrapper.
 */
export default function BookingPage() {
  return (
    <>
      <SEOManager 
        title="Court Booking & Schedules" 
        description="Book a badminton court online at SmashClub. View real-time court availability, book hourly slots, and reserve training facilities."
      />
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
          Court <span className="text-gradient-primary">Booking</span>
        </h1>
        <p className="text-gray-400">
          SmashClub features premium indoor courts with professional grade anti-slip wooden flooring and high-lux glare-free led lighting.
        </p>

        <div className="glass-panel p-8 rounded-xl border border-border-dark flex items-center justify-center text-center py-16">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto font-bold text-lg">
              CB
            </div>
            <h3 className="text-lg font-bold text-white">Court Booking Portal Initialized</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              The booking calendar grid will load here. Optimized for high-performance interaction states (zero layout shifts).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
