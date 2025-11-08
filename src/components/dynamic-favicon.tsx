import { useEffect } from "react";

export function useDynamicFavicon(imageUrl?: string) {
  useEffect(() => {
    if (!imageUrl) return;

    let link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = imageUrl;
  }, [imageUrl]);
}
