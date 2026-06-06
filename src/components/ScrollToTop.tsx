import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function jumpToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousBodyScrollBehavior = body.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    jumpToTop();
    const frame = window.requestAnimationFrame(jumpToTop);

    return () => {
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousScrollBehavior;
      body.style.scrollBehavior = previousBodyScrollBehavior;
    };
  }, [pathname]);

  return null;
}