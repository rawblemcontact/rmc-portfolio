import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Instagram, 
  Linkedin, 
  Mail, 
  Star, 
  Coffee, 
  Video, 
  Gamepad2, 
  PenTool,
  Trophy,
  GraduationCap,
  Heart
} from "lucide-react";

// --- HERO SECTION ---
const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-900 flex items-center justify-center p-4">
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/assets/p5-hero-bg.png')] bg-cover bg-center opacity-60 mix-blend-luminosity md:mix-blend-normal"></div>
        <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay"></div>
        
        {/* Animated Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/10 rounded-full blur-3xl pointer-events-none"
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center md:items-start"
        >
          <div className="bg-black/80 p-2 transform -skew-x-12 mb-4 border-2 border-red-600 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]">
            <h2 className="text-white font-marker text-xl md:text-3xl px-4 py-1 transform skew-x-12">
              THE PHANTOM PORTFOLIO
            </h2>
          </div>
          
          <h1 className="font-display text-8xl md:text-[10rem] leading-[0.85] text-white tracking-tighter drop-shadow-2xl">
            <span className="block text-stroke-white text-transparent hover:text-white transition-colors duration-300">ROBBIE</span>
            <span className="block text-red-600 bg-white px-4 transform -skew-x-6 inline-block mt-2">MCLAUGHLIN</span>
          </h1>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center md:items-start font-heading">
            <div className="bg-black text-white px-6 py-3 text-2xl uppercase tracking-widest border border-white transform hover:scale-105 transition-transform cursor-default">
              Writer
            </div>
            <div className="bg-red-600 text-black px-6 py-3 text-2xl uppercase tracking-widest border border-black transform hover:scale-105 transition-transform cursor-default">
              Digital Media Coordinator
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white font-display text-xl tracking-widest"
      >
        SCROLL TO START
      </motion.div>
    </section>
  );
};

// --- PHANTOM PROFILE (About) ---
const PhantomProfile = () => {
  return (
    <section id="profile" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-zinc-900 transform -skew-y-2 origin-top-left -mt-10 z-10"></div>
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
             <div className="relative">
                <div className="absolute inset-0 bg-black transform translate-x-4 translate-y-4"></div>
                <div className="relative bg-zinc-100 border-4 border-black p-8 shadow-2xl">
                  <h2 className="text-6xl font-display text-black mb-6 transform -rotate-2">
                    PHANTOM <span className="text-red-600">PROFILE</span>
                  </h2>
                  <p className="font-body text-xl md:text-2xl leading-relaxed text-zinc-800 font-bold">
                    Robbie McLaughlin is a writer and digital media coordinator with a BA in Writing from the University of Victoria (Distinction). 
                    <br/><br/>
                    Like a Phantom Thief stealing hearts, he captures attention through compelling storytelling and interactive media.
                  </p>
                </div>
             </div>
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-black p-6 text-white transform hover:-translate-y-2 transition-transform duration-300 border-b-8 border-red-600">
               <GraduationCap size={40} className="mb-4 text-red-500" />
               <h3 className="text-2xl font-heading mb-2">EDUCATION</h3>
               <p className="font-body text-zinc-400">B.A. Writing</p>
               <p className="font-body text-zinc-500 text-sm">University of Victoria</p>
            </div>
            <div className="bg-red-600 p-6 text-white transform hover:-translate-y-2 transition-transform duration-300 border-b-8 border-black mt-8">
               <Trophy size={40} className="mb-4 text-black" />
               <h3 className="text-2xl font-heading mb-2">DISTINCTION</h3>
               <p className="font-body text-black font-bold">Graduated with Distinction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- PALACE PROJECTS ---
const PalaceProjects = () => {
  return (
    <section id="projects" className="relative py-32 bg-zinc-900 text-white clip-path-polygon">
       <div className="container mx-auto px-6">
          <h2 className="text-7xl md:text-9xl font-display text-center mb-16 text-transparent text-stroke-white opacity-80">
            PALACE PROJECTS
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative bg-black border-4 border-red-600 overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-yellow-400 text-black font-bold px-4 py-1 z-20 font-heading text-lg">
                FEATURED
              </div>
              
              <div className="grid md:grid-cols-2">
                <div className="bg-red-600/20 p-8 flex items-center justify-center min-h-[300px] relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0 duration-500"></div>
                   <Video size={80} className="relative z-10 text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-4xl font-display text-white mb-2 group-hover:text-red-500 transition-colors">
                    RAWBLEM
                  </h3>
                  <p className="text-zinc-400 font-heading uppercase tracking-wider mb-6">
                    Independent Digital Content & Interactive Media
                  </p>
                  
                  <ul className="space-y-3 font-body text-lg text-zinc-300 mb-8">
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      <span>Produced TikTok-focused interactive content</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      <span>Scripted & edited short-form video</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      <span>Analyzed engagement metrics for growth</span>
                    </li>
                  </ul>
                  
                  <div className="flex gap-2 flex-wrap">
                    {["TikTok", "CapCut", "Storytelling", "Analytics"].map(tag => (
                      <span key={tag} className="bg-white text-black px-3 py-1 font-bold font-heading text-sm uppercase transform hover:skew-x-12 transition-transform">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
       </div>
    </section>
  );
};

// --- CONFIDANT EXPERIENCE ---
const ConfidantExperience = () => {
  return (
    <section id="experience" className="relative py-24 bg-red-600 overflow-hidden">
       {/* Comic Halftone Overlay */}
       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:20px_20px]"></div>
       
       <div className="container mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="text-6xl font-display text-white leading-tight transform -rotate-3 text-shadow-lg">
                CONFIDANT<br/>
                <span className="text-black bg-white px-2">EXPERIENCE</span>
              </h2>
            </div>
            
            <div className="w-full md:w-2/3 space-y-8">
              {/* Starbucks Card */}
              <motion.div 
                whileHover={{ x: -10 }}
                className="bg-white p-6 relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
              >
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full border-2 border-white">
                  <Coffee size={24} />
                </div>
                
                <div className="ml-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-heading font-bold">STARBUCKS</h3>
                    <span className="bg-black text-white px-3 py-1 font-mono text-sm">2018 — PRESENT</span>
                  </div>
                  <h4 className="text-xl font-marker text-red-600 mb-4">Barista & Team Member</h4>
                  <p className="font-body text-lg text-zinc-700">
                    Mastered the art of high-pressure service and team coordination. Developed "Rank 10" reliability and communication skills in a fast-paced environment.
                  </p>
                </div>
              </motion.div>
            </div>
         </div>
       </div>
    </section>
  );
};

// --- SOCIAL LINK ---
const SocialLink = () => {
  return (
    <section id="social" className="relative py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto border-l-8 border-black pl-8 md:pl-16 relative">
          <div className="absolute left-[-24px] top-0 bg-red-600 text-white p-3 rounded-full border-4 border-white shadow-lg">
            <Heart size={32} fill="white" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-display text-black mb-8">
            SOCIAL LINK <span className="text-red-600">INVOLVEMENT</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-100 p-8 border-b-4 border-red-600 group hover:bg-black hover:text-white transition-colors duration-300">
              <Gamepad2 size={48} className="mb-4 text-red-600 group-hover:text-white transition-colors" />
              <h3 className="text-2xl font-heading mb-2">UVIC E-SPORTS COMMUNITY</h3>
              <p className="font-marker text-lg text-zinc-500 group-hover:text-red-500 mb-4">Social Media Coordinator</p>
              <p className="font-body text-lg leading-relaxed">
                Leveled up community engagement through strategic social content. Managed channels, created hype, and connected players across the university.
              </p>
            </div>
            
            <div className="bg-zinc-100 p-8 border-b-4 border-red-600 group hover:bg-black hover:text-white transition-colors duration-300">
              <PenTool size={48} className="mb-4 text-red-600 group-hover:text-white transition-colors" />
              <h3 className="text-2xl font-heading mb-2">CONTENT OPERATIONS</h3>
              <p className="font-marker text-lg text-zinc-500 group-hover:text-red-500 mb-4">Digital Strategy</p>
              <p className="font-body text-lg leading-relaxed">
                Executed social media operations, content editing, and community management. Turned casual followers into dedicated fans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SKILL ARSENAL ---
const SkillArsenal = () => {
  const skills = [
    { name: "Adobe Creative Suite", level: 90 },
    { name: "DaVinci Resolve", level: 85 },
    { name: "CapCut", level: 95 },
    { name: "Hootsuite", level: 80 },
    { name: "Canva", level: 85 },
    { name: "Social Media Ops", level: 90 },
  ];

  return (
    <section id="skills" className="relative py-24 bg-zinc-900 text-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-6xl font-display text-white text-center mb-16">
          SKILL <span className="text-red-600 text-stroke-white">ARSENAL</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="bg-black border-2 border-white p-2 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-red-600 text-white font-heading text-xl uppercase px-4 py-2 flex justify-between items-center">
                  <span>{skill.name}</span>
                  <span className="bg-black text-white text-xs px-2 py-1 rounded-full">{skill.level}%</span>
                </div>
                <div className="h-4 bg-black w-full mt-2 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#ccc_5px,#ccc_10px)]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-32 text-center border-t border-zinc-800 pt-12 pb-6">
        <p className="font-display text-2xl text-zinc-500 mb-4">TAKE YOUR HEART</p>
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="bg-white p-3 rounded-full text-black hover:bg-red-600 hover:text-white transition-colors"><Mail size={20} /></a>
          <a href="#" className="bg-white p-3 rounded-full text-black hover:bg-red-600 hover:text-white transition-colors"><Linkedin size={20} /></a>
          <a href="#" className="bg-white p-3 rounded-full text-black hover:bg-red-600 hover:text-white transition-colors"><Instagram size={20} /></a>
        </div>
        <p className="text-zinc-600 font-mono text-xs">
          © {new Date().getFullYear()} Robbie McLaughlin. A Persona 5 Inspired Portfolio.
        </p>
      </footer>
    </section>
  );
};

export default function Home() {
  return (
    <div className="bg-zinc-900 min-h-screen selection:bg-red-600 selection:text-white">
      <Navigation />
      <Hero />
      <PhantomProfile />
      <PalaceProjects />
      <ConfidantExperience />
      <SocialLink />
      <SkillArsenal />
    </div>
  );
}
