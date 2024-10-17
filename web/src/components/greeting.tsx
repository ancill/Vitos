import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedGreeting({ username }: { username: string }) {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showGreeting && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4"
        >
          Hey {username} 👋
        </motion.div>
      )}
    </AnimatePresence>
  );
}
