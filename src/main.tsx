import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from '@/lib/queryClient';
import ScrollToTop from '@/components/ScrollToTop';
import App from './App';
import '@/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#3F2A1E',
                color: '#F8F1E9',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
              },
              success: {
                iconTheme: { primary: '#A8CABA', secondary: '#3F2A1E' },
              },
              error: {
                iconTheme: { primary: '#C47C5D', secondary: '#F8F1E9' },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
