import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 840);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 840);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}