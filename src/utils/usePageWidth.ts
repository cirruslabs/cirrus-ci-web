import { useState, useEffect } from 'react';

function usePageWidth() {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => {
      if (pageWidth === window.innerWidth) return;
      setPageWidth(window.innerWidth);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [pageWidth]);

  return pageWidth;
}

export default usePageWidth;
