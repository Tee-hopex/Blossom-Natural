import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>Page Not Found — Blossom Natural</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center px-4"
        >
          <p className="font-heading text-8xl text-sage mb-4">404</p>
          <h1 className="font-heading text-3xl text-brown mb-3">Page Not Found</h1>
          <p className="font-body text-brown/60 mb-10 max-w-sm mx-auto">
            This page seems to have wandered off. Let's get you back to your natural hair
            journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-primary">
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <Link to="/shop" className="btn-secondary">
              <ShoppingBag className="h-4 w-4" /> Browse Shop
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
