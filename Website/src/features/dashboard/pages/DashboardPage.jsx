import SEOManager from '../../../components/seo/SEOManager';

/**
 * DashboardPage
 * Central dashboard module for member profile highlights, reservations, and stats.
 */
export default function DashboardPage() {
  return (
    <>
      <SEOManager 
        title="Member Dashboard" 
        description="Access your SmashClub member dashboard. Track your court bookings, active training schedules, court passes, and peer challenges."
      />
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
          Member <span className="text-gradient-primary">Dashboard</span>
        </h1>
        <p className="text-gray-400">
          This is the core member dashboard portal. From here, members will manage their court reservations, review personal performance statistics, and view announcements.
        </p>
        
        <div className="glass-panel p-8 rounded-xl border border-border-dark flex items-center justify-center text-center py-16">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto font-bold text-lg">
              DB
            </div>
            <h3 className="text-lg font-bold text-white">Dashboard Portal Initialized</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              The dashboard component hierarchy is fully mapped and optimized for lazy-loading in our production-ready shell.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
