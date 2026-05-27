import SEOManager from '../../../components/seo/SEOManager';

/**
 * MembersPage
 * Modular Memberships & Subscriptions page wrapper.
 */
export default function MembersPage() {
  return (
    <>
      <SEOManager 
        title="Club Memberships & Passes" 
        description="Choose a membership plan at SmashClub. Gain unlimited court play, discount bookings, free tournament entries, and professional training access."
      />
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
          Club <span className="text-gradient-primary">Memberships</span>
        </h1>
        <p className="text-gray-400">
          Find the membership plan that best fits your badminton frequency and professional aspirations. Unlocks unlimited court reservations and community privileges.
        </p>

        <div className="glass-panel p-8 rounded-xl border border-border-dark flex items-center justify-center text-center py-16">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto font-bold text-lg">
              MS
            </div>
            <h3 className="text-lg font-bold text-white">Memberships Portal Initialized</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              The subscriptions grid layout is prepared. Responsive columns are preset for absolute mobile and desktop responsiveness.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
