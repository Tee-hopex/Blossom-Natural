import { Link } from 'react-router-dom';
import { Leaf, Instagram, Youtube, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Placeholder — wire to /api/newsletter in Phase 3
    await new Promise((r) => setTimeout(r, 800));
    toast.success('You\'re on the list! 🌸 Welcome to the Blossom family.');
    setEmail('');
    setLoading(false);
  };

  return (
    <footer className="bg-brown text-cream/80">
      <div className="container-custom py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-sage" />
              <span className="font-heading text-xl text-cream font-semibold">
                Blossom Natural
              </span>
            </Link>
            <p className="font-body text-sm leading-relaxed text-cream/60 mb-6">
              Handcrafted with love for your natural hair journey. Premium organic
              ingredients, real results.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-sage/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-sage/30 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-cream text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop All' },
                { to: '/about', label: 'Our Story' },
                { to: '/cart', label: 'My Cart' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm hover:text-sage transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-cream text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-sage shrink-0" />
                <a href="tel:+2348000000000" className="hover:text-sage transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-sage shrink-0" />
                <a
                  href="mailto:hello@blossomnatural.com"
                  className="hover:text-sage transition-colors"
                >
                  hello@blossomnatural.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-cream text-base mb-2">
              Join the Blossom Family
            </h4>
            <p className="text-xs text-cream/50 mb-4">
              Get hair care tips, new launches & exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-cream/10 border border-cream/20 text-cream placeholder-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-sage text-xs py-2.5 disabled:opacity-60"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Blossom Natural. All rights reserved.</p>
          <p className="italic font-heading text-cream/30">"Nourish. Grow. Blossom."</p>
        </div>
      </div>
    </footer>
  );
}
