import SEOManager from '../../../components/seo/SEOManager';

/**
 * ShopPage
 * Modular Shop and Equipment merchandise page wrapper.
 */
export default function ShopPage() {
  return (
    <>
      <SEOManager 
        title="Pro Shop - Professional Equipment" 
        description="Shop badminton rackets, high durability shuttlecocks, specialized grip tape, shoes, and athletic wear at the SmashClub Pro Shop."
      />
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
          Pro <span className="text-gradient-accent">Shop</span>
        </h1>
        <p className="text-gray-400">
          Professional grade rackets, shuttles, and training footwear handpicked by our expert coaches to optimize your swing power and court agility.
        </p>

        <div className="glass-panel p-8 rounded-xl border border-border-dark flex items-center justify-center text-center py-16">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto font-bold text-lg">
              PS
            </div>
            <h3 className="text-lg font-bold text-white">Pro Shop Portal Initialized</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              The e-commerce products grid layout is prepared. Ready to render customizable shopping carts and checkout gates.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
