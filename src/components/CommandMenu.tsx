import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Copy, FileCode2, Github, Linkedin, Moon, Search, User } from "lucide-react";
import { profile, projects } from "../data/profile";
import { go, scrollToSection } from "../router";

type Item = { id: string; label: string; hint: string; icon: JSX.Element; run: () => void };

export default function CommandMenu({ open, setOpen, toggleTheme }: {
  open: boolean; setOpen: (v: boolean) => void; toggleTheme: () => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => [
    ...projects.map((p) => ({
      id: `p-${p.id}`, label: p.title, hint: "Project", icon: <FileCode2 size={16} />,
      run: () => go(`/projects/${p.id}`),
    })),
    { id: "about", label: "Experience", hint: "Section", icon: <User size={16} />, run: () => scrollToSection("experience") },
    { id: "skills", label: "Skills", hint: "Section", icon: <ArrowRight size={16} />, run: () => scrollToSection("skills") },
    { id: "contact", label: "Contact", hint: "Section", icon: <ArrowRight size={16} />, run: () => scrollToSection("contact") },
    {
      id: "copy", label: "Copy email address", hint: profile.email, icon: <Copy size={16} />,
      run: () => {
        navigator.clipboard?.writeText(profile.email).then(() => setToast("Email copied"), () => setToast(profile.email));
      },
    },
    { id: "gh", label: "Open GitHub", hint: "External", icon: <Github size={16} />, run: () => window.open(profile.github, "_blank", "noopener") },
    { id: "li", label: "Open LinkedIn", hint: "External", icon: <Linkedin size={16} />, run: () => window.open(profile.linkedin, "_blank", "noopener") },
    { id: "theme", label: "Toggle light / dark", hint: "Theme", icon: <Moon size={16} />, run: toggleTheme },
  ], [toggleTheme]);

  const filtered = items.filter((i) => (i.label + " " + i.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(!open); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) { setQ(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const choose = (i: Item) => { setOpen(false); i.run(); };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="backdrop top" onClick={() => setOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="cmdk" role="dialog" aria-label="Command menu" onClick={(e) => e.stopPropagation()}
              initial={{ y: -12, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <div className="cmdk-search">
                <Search size={17} />
                <label htmlFor="cmdk-input" className="sr-only">Search commands</label>
                <input id="cmdk-input" ref={inputRef} value={q} placeholder="Jump to a project, section or action…"
                  onChange={(e) => { setQ(e.target.value); setActive(0); }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
                    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                    if (e.key === "Enter" && filtered[active]) choose(filtered[active]);
                  }} />
                <kbd>esc</kbd>
              </div>
              <ul className="cmdk-list" role="listbox">
                {filtered.length === 0 && <li className="cmdk-empty">No matches for “{q}”</li>}
                {filtered.map((i, idx) => (
                  <li key={i.id} role="option" aria-selected={idx === active}
                    className={idx === active ? "on" : ""} onMouseEnter={() => setActive(idx)} onClick={() => choose(i)}>
                    {i.icon}<span>{i.label}</span><small>{i.hint}</small>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
