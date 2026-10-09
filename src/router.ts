import { useEffect, useState } from "react";

// Hash routing ("#/projects/potato") keeps the site fully static:
// it works on Vercel, GitHub Pages or any host without server rewrites.
export function go(path: string) {
  window.location.hash = path.startsWith("/") ? path : `/${path}`;
}

export function scrollToSection(id: string) {
  if (window.location.hash.startsWith("#/")) {
    history.pushState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

export function useRoute() {
  const read = () => (window.location.hash.startsWith("#/") ? window.location.hash.slice(1) : "/");
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    window.addEventListener("popstate", on);
    return () => {
      window.removeEventListener("hashchange", on);
      window.removeEventListener("popstate", on);
    };
  }, []);
  return route;
}
