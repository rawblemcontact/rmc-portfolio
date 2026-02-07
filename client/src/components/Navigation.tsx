import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Star, Heart, Zap, User, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { id: "profile", label: "Phantom Profile", icon: User, color: "bg-red-600" },
  { id: "projects", label: "Palace Projects", icon: Zap, color: "bg-yellow-400" },
  { id: "experience", label: "Confidant Exp", icon: Star, color: "bg-blue-600" },
  { id: "social", label: "Social Link", icon: Heart, color: "bg-pink-500" },
  { id: "skills", label: "Skill Arsenal", icon: Briefcase, color: "bg-green-600" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-50 mix-blend-difference">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon"
          className="rounded-full w-16 h-16 bg-white text-black hover:bg-red-600 hover:text-white transition-all duration-300 border-4 border-black p-0 overflow-hidden group"
        >
          <div className="relative w-full h-full flex items-center justify-center">
             <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
             >
                {isOpen ? <X size={32} strokeWidth={3} /> : <Menu size={32} strokeWidth={3} />}
             </motion.div>
          </div>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", skewX: -20 }}
            animate={{ x: "0%", skewX: 0 }}
            exit={{ x: "100%", skewX: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-black/95 z-40 border-l-8 border-red-600 flex flex-col justify-center p-8 shadow-2xl"
          >
            <div className="flex flex-col space-y-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="group w-full text-left relative overflow-hidden p-4 transform hover:-skew-x-6 transition-transform duration-200"
                  >
                    <div className={`absolute inset-0 ${item.color} transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-10`} />
                    <div className="flex items-center space-x-4">
                      <item.icon className="w-8 h-8 text-white group-hover:text-black transition-colors" strokeWidth={2.5} />
                      <span className="text-3xl font-display text-white group-hover:text-black tracking-wider uppercase drop-shadow-md group-hover:drop-shadow-none">
                        {item.label}
                      </span>
                    </div>
                  </button>
                  <div className="h-0.5 bg-zinc-800 w-full mt-2" />
                </motion.div>
              ))}
            </div>
            
            <div className="absolute bottom-8 left-8 text-zinc-500 font-mono text-sm">
              <p>ROBBIE MCLAUGHLIN // PORTFOLIO</p>
              <p>LAST LOGIN: TODAY</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
