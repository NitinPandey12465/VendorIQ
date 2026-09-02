import { useEffect, useState } from "react";

/** Read the current path from the hash, normalised to start with "/". */
function readPath(): string {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function navigate(path: string) {
  if (readPath() === path) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.location.hash = path;
  // scroll handled by the route change effect below
}

export function useRoute(): string {
  const [path, setPath] = useState<string>(() =>
    typeof window === "undefined" ? "/" : readPath(),
  );

  useEffect(() => {
    const onChange = () => {
      setPath(readPath());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return path;
}
