// src/App.jsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Intro from "./components/Intro.jsx";
import MainApp from "./MainApp.jsx";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#2a0a0a] to-[#0a0a0a] text-amber-100 overflow-hidden">
      <AnimatePresence mode="wait">
        {!introComplete ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Intro onFinish={() => setTimeout(() => setIntroComplete(true), 800)} />
          </motion.div>
        ) : (
          <motion.div
            key="mainapp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <MainApp />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
