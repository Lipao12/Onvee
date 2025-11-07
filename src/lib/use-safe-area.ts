import { useEffect, useState } from "react";

export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    if (isIOS) {
      setInsets({ top: 44, bottom: 4 }); 
    } else if (isAndroid) {
      setInsets({ top: 0, bottom: 16 });
    } else {
      setInsets({ top: 0, bottom: 0 });
    }
  }, []);

  return insets;
}
