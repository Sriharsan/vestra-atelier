import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: reduced ? 0 : 12, pointerEvents: "none" as const }
      }
      transition={{
        duration: reduced ? 0.15 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed bottom-6 right-6 z-30"
    >
      <Link to="/contact" className="btn-saffron shadow-fabric">
        Book a demo
      </Link>
    </motion.div>
  );
}
