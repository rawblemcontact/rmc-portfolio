import { motion, useScroll, useTransform, useSpring, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
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
  Heart,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  LucideIcon,
  FileText,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const hoverScale: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.05, 
    rotate: -2,
    transition: { type: "spring", stiffness: 300, damping: 10 }
  }
};

// --- COMPONENTS ---

const SectionHeader = ({ title, subtitle, align = "left", color = "text-white" }: { title: string; subtitle?: string; align?: "left" | "center"; color?: string }) => (
  <div className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} mb-16 relative z-10`}>
    <motion.div 
      initial={{ scaleX: 0, originX: align === "center" ? 0.5 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      className="bg-red-600 h-2 w-24 mb-4 transform -skew-x-12"
    />
    <h2 className={`text-5xl md:text-7xl font-display ${color} leading-none tracking-tight drop-shadow-lg`}>
      {title}
    </h2>
    {subtitle && (
      <p className="font-heading text-lg md:text-xl mt-2 bg-black text-white px-2 py-1 transform -skew-x-6 inline-block tracking-wider">
        {subtitle}
      </p>
    )}
  </div>
);

const NextSectionButton = ({ targetId, label = "Next Section" }: { targetId: string, label?: string }) => (
  <div className="w-full flex justify-center mt-12">
    <Button
      variant="outline"
      className="group relative overflow-hidden bg-transparent border-2 border-current hover:bg-transparent text-current"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
    >
      <span className="relative z-10 flex items-center gap-2 font-heading uppercase tracking-widest">
        {label} <ChevronDown className="group-hover:translate-y-1 transition-transform" />
      </span>
    </Button>
  </div>
);

// --- HERO SECTION ---
const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center p-4">
      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center justify-center gap-8 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="font-heading text-xl md:text-2xl text-zinc-400 tracking-[0.2em] uppercase mb-2">
              Portfolio
            </p>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="relative mb-12">
            <span className="block font-display text-7xl md:text-9xl leading-none tracking-tighter text-white z-10 relative">
              ROBBIE
            </span>
            <span className="block font-display text-7xl md:text-9xl leading-none text-red-600 tracking-tighter">
              MCLAUGHLIN
            </span>
          </motion.h1>
          
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              className="bg-white hover:bg-zinc-200 text-black font-display text-2xl uppercase tracking-widest px-12 py-8 rounded-none transition-all border-4 border-transparent hover:border-red-600 group overflow-hidden relative"
              onClick={() => {
                const element = document.getElementById('profile');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="relative z-10 flex items-center gap-4">
                START <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- PROFILE (About) ---
const PhantomProfile = () => {
  return (
    <section id="profile" className="relative py-32 bg-white overflow-hidden text-black">
      {/* Angled Divider */}
      <div className="absolute top-0 left-0 w-full h-24 bg-black clip-path-polygon z-10"></div>
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
             <SectionHeader title="PROFESSIONAL PROFILE" subtitle="SUMMARY" color="text-black" />
             
             <div className="relative">
                <div className="absolute -left-4 top-4 w-full h-full bg-zinc-200 transform -rotate-1"></div>
                <div className="relative bg-white border-l-8 border-black p-8 shadow-xl">
                  <p className="font-body text-xl md:text-2xl leading-relaxed text-zinc-800 font-medium mb-6">
                    Communications-focused writer and digital media coordinator with a proven track record in interactive content creation and community management.
                  </p>
                  <p className="font-body text-lg text-zinc-600 leading-relaxed mb-8">
                    Expert in blending creative storytelling with analytical strategy to drive engagement. Demonstrated reliability and leadership in high-pressure service environments.
                  </p>
                  
                  <div className="flex gap-4">
                    <Badge icon={GraduationCap} label="B.A. Writing" sub="University of Victoria" />
                    <Badge icon={Trophy} label="Distinction" sub="Top Academic Performance" highlight />
                  </div>
                </div>
             </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 grid grid-cols-1 gap-6 mt-12 lg:mt-0"
          >
            {/* Stats/Attributes Card style */}
            <div className="bg-black text-white p-6 transform rotate-1 border-2 border-white shadow-xl">
              <h3 className="text-2xl font-heading text-red-500 mb-4 border-b border-zinc-800 pb-2">Core Attributes</h3>
              <div className="space-y-4 font-heading tracking-wider">
                <StatRow label="Creativity" value="High" />
                <StatRow label="Strategy" value="Advanced" />
                <StatRow label="Teamwork" value="Excellent" />
                <StatRow label="Adaptability" value="High" />
              </div>
            </div>
          </motion.div>
        </div>
        <NextSectionButton targetId="projects" />
      </div>
    </section>
  );
};

const Badge = ({ icon: Icon, label, sub, highlight = false }: { icon: LucideIcon; label: string; sub: string; highlight?: boolean }) => (
  <div className={`flex items-center gap-3 p-3 border-2 ${highlight ? 'bg-red-600 border-black text-white' : 'bg-white border-black text-black'} shadow-md`}>
    <Icon size={24} strokeWidth={2.5} />
    <div>
      <div className="font-heading leading-none text-lg">{label}</div>
      <div className="font-mono text-xs opacity-80">{sub}</div>
    </div>
  </div>
);

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center group border-b border-zinc-800 pb-2 last:border-0">
    <span className="text-zinc-400 group-hover:text-white transition-colors">{label}</span>
    <span className="text-red-500 uppercase">{value}</span>
  </div>
);

// --- PROJECTS ---
const PalaceProjects = () => {
  return (
    <section id="projects" className="relative py-32 bg-zinc-900 text-white overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-2/3 h-full bg-red-600/5 -skew-x-12 z-0 pointer-events-none"></div>

       <div className="container mx-auto px-6 relative z-10">
          <SectionHeader title="PROJECTS" subtitle="INDEPENDENT WORK" align="center" />
          
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-4">
                    <motion.div 
                      className="group relative bg-black border-4 border-red-600 shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)] h-full"
                    >
                      <div className="absolute top-0 right-0 bg-yellow-400 text-black font-bold px-6 py-2 z-20 font-heading text-xl shadow-md">
                        FEATURED
                      </div>
                      
                      <div className="grid md:grid-cols-5 h-full min-h-[400px]">
                        {/* Visual Side */}
                        <div className="md:col-span-2 bg-zinc-800 relative overflow-hidden border-r-4 border-red-600 min-h-[250px] md:min-h-full">
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
                           <div className="absolute inset-0 bg-red-600/30 mix-blend-overlay"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                             <div className="bg-black/80 p-4 rounded-full border-2 border-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                               <Video size={48} className="text-red-500" />
                             </div>
                           </div>
                        </div>
                        
                        {/* Content Side */}
                        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center bg-[url('/assets/noise.png')]">
                          <h3 className="text-4xl md:text-5xl font-display text-white mb-2 group-hover:text-red-500 transition-colors drop-shadow-md">
                            RAWBLEM
                          </h3>
                          <p className="text-zinc-400 font-heading text-xl uppercase tracking-wider mb-8 border-l-4 border-yellow-400 pl-4">
                            Independent Digital Content & Interactive Media
                          </p>
                          
                          <div className="space-y-4 mb-8">
                            <ProjectPoint text="Produced high-engagement TikTok interactive content focusing on narrative storytelling" />
                            <ProjectPoint text="Scripted, filmed, and edited short-form videos using CapCut and DaVinci Resolve" />
                            <ProjectPoint text="Analyzed engagement metrics (views, retention, shares) to iterate on content strategy and optimize for platform algorithms" />
                          </div>
                          
                          <div className="flex gap-3 flex-wrap">
                            {["TikTok", "CapCut", "Storytelling", "Analytics"].map(tag => (
                              <span key={tag} className="bg-white text-black px-3 py-1 font-bold font-heading text-sm uppercase transform hover:-skew-x-12 hover:bg-red-600 hover:text-white transition-all cursor-default border border-black">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
                {/* Placeholder for future projects */}
                <CarouselItem>
                  <div className="p-4 h-full">
                    <div className="bg-zinc-800/50 border-4 border-zinc-700 h-full min-h-[400px] flex items-center justify-center">
                      <p className="font-heading text-2xl text-zinc-500">More Projects Coming Soon</p>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4 md:-left-12 bg-black text-white border-2 border-white hover:bg-red-600 hover:text-white" />
              <CarouselNext className="right-4 md:-right-12 bg-black text-white border-2 border-white hover:bg-red-600 hover:text-white" />
            </Carousel>
          </div>
          <NextSectionButton targetId="experience" />
       </div>
    </section>
  );
};

const ProjectPoint = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0 fill-current" />
    <span className="font-body text-lg text-zinc-300">{text}</span>
  </div>
);

// --- EXPERIENCE ---
const ConfidantExperience = () => {
  return (
    <section id="experience" className="relative py-32 bg-red-600 overflow-hidden text-white">
       {/* Halftone Pattern */}
       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,black_2px,transparent_2px)] bg-[length:30px_30px]"></div>
       
       <div className="container mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/3 text-right md:text-left">
              <SectionHeader title="PROFESSIONAL EXPERIENCE" subtitle="CAREER HISTORY" color="text-white" />
            </div>
            
            <div className="w-full md:w-2/3 space-y-8">
              {/* Starbucks Card */}
              <motion.div 
                whileHover={{ x: -10, y: -5 }}
                className="bg-white p-8 relative shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black group transition-all text-black"
              >
                <div className="absolute -left-6 top-8 bg-black text-white p-3 border-2 border-white shadow-lg group-hover:rotate-12 transition-transform">
                  <Coffee size={32} />
                </div>
                
                <div className="md:pl-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b-2 border-zinc-200 pb-4">
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-black">STARBUCKS</h3>
                    <span className="bg-black text-white px-4 py-1 font-heading tracking-widest text-sm mt-2 md:mt-0 transform -skew-x-12">
                      2018 — PRESENT
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-red-600 font-heading text-2xl uppercase font-bold">Barista & Team Member</span>
                    <div className="h-px bg-red-600 flex-grow ml-4"></div>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      "Consistently recognized for 'Rank 10' reliability and teamwork in a high-volume, high-pressure environment.",
                      "Demonstrated strong communication skills and adaptability during peak service hours.",
                      "Maintained high standards of customer service and product quality."
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">▶</span>
                        <span className="font-body text-xl text-zinc-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
         </div>
         <div className="text-white">
            <NextSectionButton targetId="social" />
         </div>
       </div>
    </section>
  );
};

// --- INVOLVEMENT ---
const SocialLink = () => {
  return (
    <section id="social" className="relative py-32 bg-white text-black">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto border-l-[12px] border-black pl-8 md:pl-16 relative py-8">
          {/* Floating Icon */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-[38px] top-0 bg-red-600 text-white p-4 rounded-full border-4 border-white shadow-xl z-20"
          >
            <Heart size={32} fill="white" />
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-display text-black mb-12 relative z-10">
            INVOLVEMENT
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-50 p-8 border-b-8 border-red-600 group hover:bg-black hover:text-white transition-all duration-300 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gamepad2 size={120} />
              </div>
              
              <Gamepad2 size={48} className="mb-6 text-red-600 group-hover:text-yellow-400 transition-colors" />
              <h3 className="text-3xl font-heading mb-2">UVIC E-SPORTS</h3>
              <p className="font-marker text-xl text-zinc-500 group-hover:text-red-500 mb-4">Social Media Coordinator</p>
              
              <ul className="space-y-3 relative z-10">
                {[
                  "Managed social media channels to increase community engagement and event attendance.",
                  "Created and edited digital content for promotional campaigns.",
                  "Facilitated communication between players, organizers, and the broader university community."
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 group-hover:text-yellow-400 mt-1">★</span>
                    <span className="font-body text-lg leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-50 p-8 border-b-8 border-red-600 group hover:bg-black hover:text-white transition-all duration-300 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <PenTool size={120} />
              </div>
              
              <PenTool size={48} className="mb-6 text-red-600 group-hover:text-yellow-400 transition-colors" />
              <h3 className="text-3xl font-heading mb-2">SKILLS & TOOLS</h3>
              <p className="font-marker text-xl text-zinc-500 group-hover:text-red-500 mb-4">Technical Proficiency</p>
              
              <ul className="space-y-3 relative z-10">
                 {[
                  "Adobe Creative Suite", 
                  "DaVinci Resolve", 
                  "CapCut", 
                  "Hootsuite", 
                  "Canva", 
                  "Content Editing & Production",
                  "Social Media Operations"
                ].map((skill, i) => (
                  <li key={i} className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-red-600 group-hover:bg-yellow-400 rounded-full"></span>
                     <span className="font-body text-lg font-bold">{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <NextSectionButton targetId="skills" />
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
    { name: "Content Editing", level: 90 },
    { name: "Social Media Ops", level: 92 },
    { name: "Community Mgmt", level: 88 },
    { name: "Digital Strategy", level: 85 },
    { name: "Creative Writing", level: 95 }
  ];

  return (
    <section id="skills" className="relative py-32 bg-zinc-900 text-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader title="SKILLS & COMPETENCIES" subtitle="FULL ARSENAL" align="center" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="bg-black border-2 border-zinc-700 p-4 transform transition-all duration-300 group-hover:border-white group-hover:shadow-[0px_0px_20px_rgba(220,38,38,0.5)]">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-heading text-xl uppercase tracking-wider text-white group-hover:text-red-500 transition-colors">{skill.name}</span>
                  <span className="font-mono text-xs text-zinc-500">{skill.level}/100</span>
                </div>
                
                <div className="h-6 bg-zinc-800 w-full relative skew-x-[-15deg] overflow-hidden border border-zinc-600">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-red-600 relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3)_100%)] bg-[length:10px_10px]"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-40 text-center border-t border-zinc-800 pt-16 pb-8 bg-black relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 font-heading text-xl transform rotate-3 border-4 border-black">
          MISSION ACCOMPLISHED
        </div>
        
        <div className="flex justify-center gap-8 mb-12">
          {[Mail, Linkedin, Instagram].map((Icon, i) => (
            <motion.a 
              key={i}
              href={i === 1 ? "https://linkedin.com/in/robbie-mclaughlin" : "#"}
              target={i === 1 ? "_blank" : undefined}
              rel={i === 1 ? "noopener noreferrer" : undefined}
              whileHover={{ y: -5, backgroundColor: "#DC2626", color: "#fff" }}
              className="bg-zinc-800 p-4 rounded-full text-zinc-400 transition-all border-2 border-transparent hover:border-white"
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </div>
        
        <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
          © {new Date().getFullYear()} Robbie McLaughlin. 
          <span className="block mt-2 text-zinc-700">Digital Media Coordinator & Writer</span>
        </p>
      </footer>
    </section>
  );
};

// --- RESUME COMPONENT ---
const ResumeView = () => {
  return (
    <div className="bg-white min-h-screen text-black font-sans p-8 md:p-16 max-w-5xl mx-auto selection:bg-gray-200 selection:text-black">
      {/* Header */}
      <header className="border-b-2 border-black pb-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">Robbie McLaughlin</h1>
        <p className="text-xl text-gray-700 mb-4">Writer • Digital Media Coordinator • Content Creator</p>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <a href="mailto:robbie@example.com" className="flex items-center gap-2 hover:underline">
            <Mail size={16} /> robbie@example.com
          </a>
          <span className="flex items-center gap-2">
            <Linkedin size={16} /> <a href="https://linkedin.com/in/robbie-mclaughlin" className="hover:underline">linkedin.com/in/robbie-mclaughlin</a>
          </span>
          <span className="flex items-center gap-2">
            <GraduationCap size={16} /> B.A. Writing, University of Victoria (Distinction)
          </span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Professional Profile</h2>
        <p className="leading-relaxed text-gray-800">
          Communications-focused writer and digital media coordinator with a proven track record in interactive content creation and community management. Expert in blending creative storytelling with analytical strategy to drive engagement. Demonstrated reliability and leadership in high-pressure service environments.
        </p>
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Skills & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div>
            <h4 className="font-bold mb-2">Core Competencies</h4>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Content Editing & Production</li>
              <li>Social Media Operations</li>
              <li>Community Management</li>
              <li>Digital Strategy & Analytics</li>
              <li>Creative Writing & Storytelling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Technical Proficiency</h4>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Adobe Creative Suite</li>
              <li>DaVinci Resolve</li>
              <li>CapCut</li>
              <li>Hootsuite</li>
              <li>Canva</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Experience</h2>
        
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-bold">Starbucks</h3>
            <span className="text-gray-600 font-medium">2018 — Present</span>
          </div>
          <p className="italic text-gray-700 mb-3">Barista & Team Member</p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-800">
            <li>Consistently recognized for "Rank 10" reliability and teamwork in a high-volume, high-pressure environment.</li>
            <li>Demonstrated strong communication skills and adaptability during peak service hours.</li>
            <li>Maintained high standards of customer service and product quality.</li>
          </ul>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Projects</h2>
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-bold">RAWBLEM</h3>
            <span className="text-gray-600 font-medium">Independent Digital Content & Interactive Media</span>
          </div>
          <p className="italic text-gray-700 mb-3">TikTok-focused interactive content project</p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-800">
            <li>Produced high-engagement TikTok interactive content focusing on narrative storytelling.</li>
            <li>Scripted, filmed, and edited short-form videos using CapCut and DaVinci Resolve.</li>
            <li>Analyzed engagement metrics (views, retention, shares) to iterate on content strategy and optimize for platform algorithms.</li>
          </ul>
        </div>
      </section>

      {/* Involvement */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Involvement</h2>
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xl font-bold">University of Victoria E-Sports Community</h3>
            <span className="text-gray-600 font-medium">Volunteer</span>
          </div>
          <p className="italic text-gray-700 mb-3">Social Media Coordinator</p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-800">
            <li>Managed social media channels to increase community engagement and event attendance.</li>
            <li>Created and edited digital content for promotional campaigns.</li>
            <li>Facilitated communication between players, organizers, and the broader university community.</li>
          </ul>
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold uppercase border-b border-gray-300 pb-2 mb-4">Education</h2>
        <div>
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold">University of Victoria</h3>
            <span className="text-gray-600 font-medium">Distinction</span>
          </div>
          <p className="italic text-gray-700">Bachelor of Arts in Writing</p>
        </div>
      </section>
      
      <footer className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200">
        <p>Portfolio available at: [Portfolio URL]</p>
      </footer>
    </div>
  );
};

export default function Home() {
  const [isResumeMode, setIsResumeMode] = useState(false);

  return (
    <div className={`min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden transition-colors duration-500 ${isResumeMode ? 'bg-white' : 'bg-zinc-900'}`}>
      
      {/* Mode Toggle - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 mix-blend-difference">
        <span className="text-white text-xs font-mono uppercase tracking-widest bg-black px-2 py-1 mb-1 hidden md:block">
          Switch View
        </span>
        <Button 
          onClick={() => setIsResumeMode(!isResumeMode)}
          size="lg"
          className={`rounded-full shadow-xl border-4 transition-all duration-300 h-16 w-16 p-0 ${
            isResumeMode 
              ? "bg-black text-white border-black hover:bg-zinc-800" 
              : "bg-red-600 text-white border-white hover:bg-red-700 hover:scale-110"
          }`}
        >
          {isResumeMode ? <Zap size={28} /> : <FileText size={28} />}
        </Button>
      </div>

      {isResumeMode ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <ResumeView />
        </motion.div>
      ) : (
        <>
          <Navigation />
          <Hero />
          <PhantomProfile />
          <PalaceProjects />
          <ConfidantExperience />
          <SocialLink />
          <SkillArsenal />
        </>
      )}
    </div>
  );
}
