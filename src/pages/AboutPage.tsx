import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Leaf, Heart, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const timeline = [
  { year: '2019', title: 'The Struggle', description: 'Our founder spent years searching for products that actually worked for her 4C hair. Nothing in the market truly delivered.' },
  { year: '2020', title: 'Kitchen Experiments', description: 'During lockdown, she began crafting her own formulas from organic ingredients sourced across Nigeria.' },
  { year: '2021', title: 'First 50 Bottles', description: 'She bottled her first batch and shared with friends. The results were undeniable — word spread fast.' },
  { year: '2022', title: 'Blossom Natural is Born', description: 'With 200+ happy customers and a name they trusted, Blossom Natural officially launched.' },
  { year: '2023', title: 'Going National', description: 'Products now shipped across Nigeria. A growing community of natural hair sisters.' },
  { year: '2024+', title: 'Rooted in Africa', description: 'Expanding to serve the entire African continent — because every textured hair deserves to Blossom.' },
];

const values = [
  { icon: Leaf, title: 'Clean Ingredients', desc: 'We use only organic, ethically sourced ingredients. No sulphates, no parabens, no shortcuts.' },
  { icon: Heart, title: 'Made with Love', desc: 'Every product is handcrafted in small batches. Quality over quantity, always.' },
  { icon: Users, title: 'Community First', desc: 'We are built by our community. Your feedback shapes every formula we create.' },
  { icon: Award, title: 'Real Results', desc: 'We don\'t promise miracles — we promise tested formulas that deliver consistent, visible results.' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Our Story — Blossom Natural</title>
        <meta name="description" content="Learn about the story behind Blossom Natural — a premium natural hair care brand born from one woman's journey with her 4C hair." />
      </Helmet>

      {/* Hero */}
      <section className="bg-sage/10 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-terracotta text-xs font-medium uppercase tracking-widest mb-3">Our Story</p>
              <h1 className="font-heading text-4xl md:text-5xl text-brown leading-tight mb-6">
                A brand born from a{' '}
                <em className="text-terracotta not-italic">personal hair journey</em>
              </h1>
              <p className="font-body text-brown/70 leading-relaxed text-lg">
                Blossom Natural exists because one woman refused to settle. When the market failed her hair,
                she created the solution herself — and now that solution is transforming thousands of natural
                hair journeys across Africa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-sage/20">
                <img
                  src={new URL('../assets/founder.jpg', import.meta.url).href}
                  alt="Blossom Natural Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-terracotta text-white rounded-2xl p-4 shadow-lg">
                <p className="font-heading text-2xl font-bold">5+</p>
                <p className="text-xs text-white/80">Years of Research</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Bio */}
      <section className="section bg-cream">
        <div className="container-custom max-w-3xl">
          <p className="text-terracotta text-xs font-medium uppercase tracking-widest mb-3">Meet the Founder</p>
          <h2 className="font-heading text-3xl md:text-4xl text-brown mb-6">
            {/* Placeholder — you will replace this with the real founder name */}
            Ogene Confidence, The Natural Hair Alchemist
          </h2>
          <div className="prose prose-brown max-w-none font-body text-brown/70 leading-loose text-base space-y-4">
            <p>
              {/* You will provide the full founder biography — paste it here */}
              [Founder biography coming soon. Please provide the full text and we will add it here.]
            </p>
            <p>
              Her mission is simple: every woman with textured, African, or curly hair deserves products that
              celebrate — not fight — their natural texture. Blossom Natural was built on that belief, and it
              remains the foundation of everything we create.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Goals */}
      <section className="section bg-brown">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                label: 'Our Mission',
                text: 'To provide premium, organic hair care products that empower African women to embrace their natural hair with confidence and pride.',
              },
              {
                icon: Eye,
                label: 'Our Vision',
                text: 'To become the most trusted natural hair care brand in Africa — a household name in every home where textured hair is celebrated.',
              },
              {
                icon: Leaf,
                label: 'Our Goal',
                text: 'To formulate and deliver clean, effective, and affordable solutions that solve real hair challenges faced by women across the continent.',
              },
            ].map(({ icon: Icon, label, text }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-sage/20 rounded-2xl mb-4">
                  <Icon className="h-6 w-6 text-sage" />
                </div>
                <h3 className="font-heading text-cream text-xl mb-3">{label}</h3>
                <p className="font-body text-cream/60 text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-terracotta text-xs font-medium uppercase tracking-widest mb-2">What We Stand For</p>
            <h2 className="font-heading text-3xl md:text-4xl text-brown">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-sage/20 rounded-2xl mb-4">
                  <Icon className="h-5 w-5 text-sage-dark" />
                </div>
                <h3 className="font-heading text-brown text-base font-semibold mb-2">{title}</h3>
                <p className="text-sm text-brown/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-sage/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-terracotta text-xs font-medium uppercase tracking-widest mb-2">Our Journey</p>
            <h2 className="font-heading text-3xl md:text-4xl text-brown">How Blossom Natural Started</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {timeline.map(({ year, title, description }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center font-body text-xs font-bold shrink-0">
                    {year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-terracotta/20 mt-2" />}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-bold text-terracotta uppercase tracking-wider">{year}</span>
                  <h3 className="font-heading text-lg text-brown mt-1 mb-1">{title}</h3>
                  <p className="text-sm text-brown/60 leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-terracotta py-16">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl text-white mb-4">Ready to Start Your Blossom Journey?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join thousands of women across Africa who have transformed their natural hair with Blossom Natural.
          </p>
          <Link to="/shop" className="btn bg-white text-terracotta hover:bg-cream">
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}
