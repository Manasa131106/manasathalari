/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

const ScrollingText = ({ text }: { text: string }) => {
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-5 select-none z-0">
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap"
      >
        <span className="text-[25vw] font-black uppercase tracking-tighter leading-none pr-20">
          {text} {text} {text} {text}
        </span>
        <span className="text-[25vw] font-black uppercase tracking-tighter leading-none pr-20">
          {text} {text} {text} {text}
        </span>
      </motion.div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Hackathons', href: '#hackathons' },
    { name: 'Skills', href: '#skills' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-beige/80 backdrop-blur-md py-4 shadow-sm' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-xl font-black tracking-tighter">MANASA.</a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-12">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium uppercase tracking-widest hover:text-olive transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-beige shadow-xl md:hidden"
          >
            <div className="flex flex-col p-6 space-y-4 items-center text-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest border-b border-charcoal/10 pb-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center pt-20 overflow-hidden bg-olive text-beige">
      <ScrollingText text="MANASA THALARI" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 3, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex space-x-8 mb-8 text-xs font-bold uppercase tracking-[0.3em]"
          >
            <span>Data Analysis Learner</span>
            <span className="text-gold">•</span>
            <span>Working on Projects</span>
            <span className="text-gold">•</span>
            <span>Skills in Progress</span>
          </motion.div>

          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-huge font-black tracking-tighter mb-[-2vw] select-none relative z-20"
          >
            Manasa
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative w-full max-w-md h-auto overflow-hidden rounded-2xl shadow-2xl z-0"
          >
            <img 
              src="https://i.ibb.co/8g39vtqf/my-pic.jpg" 
              alt="Manasa Portrait" 
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const stats = [
    { label: 'Currently Building', value: ' Projects' },
    { label: 'Hands-on Learning', value: 'Works' },
    { label: 'Data Analysis Journey', value: '  Focus' },
  ];

  return (
    <section id="about" className="py-24 md:py-40 bg-beige">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">About </h2>
            <div className="space-y-6 text-lg md:text-xl text-charcoal/80 leading-relaxed max-w-xl">
              <p>
                I’m a B.Tech student beginning my journey in Data Analysis, learning to see beyond numbers and uncover the stories within data.
              </p>
              <p>
                I’m building my skills in Excel, SQL, and data visualization—focused on turning raw data into meaningful insights, while growing through curiosity and consistency every day.
              </p>
              <p>
                Currently, I’m an intern at EvolveXspaces, where I’m gaining hands-on experience and working with real-world data.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-10 lg:pt-0">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-t border-charcoal/20 pt-8"
              >
                <div className="text-3xl md:text-4xl font-black mb-2 leading-tight">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Hackathons = () => {
  const projects = [
    {
      title: "Anurag University Hackathon",
      category: "Problem Solving / Team Collaboration",
      image: "https://i.ibb.co/kVpbHggc/h-anurag.jpg",
      link: "#"
    },
    {
      title: "CMR Institute of Technology Hackathon",
      category: "Innovation / Rapid Development",
      image: "https://i.ibb.co/cSDVbfdK/h-cmrit.jpg",
      link: "#"
    }
  ];

  return (
    <section id="hackathons" className="py-24 md:py-40 bg-beige border-t border-charcoal/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Hackathons</h2>
            <p className="text-charcoal/60">I actively participate in hackathons to challenge my thinking, collaborate with others, and build solutions under pressure. These experiences help me learn faster, adapt quickly, and turn ideas into real outcomes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-charcoal/5">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-olive/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-beige text-charcoal p-4 rounded-full">
                    <ArrowUpRight size={32} />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-1">{project.title}</h3>
              <p className="text-sm font-bold uppercase tracking-widest text-charcoal/50">{project.category}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center max-w-3xl mx-auto">
          <p className="italic text-charcoal/60 leading-relaxed">
            "Each hackathon pushes me beyond my limits—shaping how I think, build, and solve problems in real-world situations."
          </p>
        </div>
      </div>
    </section>
  );
};

const Education = () => {
  const education = [
    {
      title: "Schooling",
      institution: "Indo English High School",
      location: "Miyapur, Hyderabad",
      period: "Year: 2022",
      description: "Completed my schooling with a strong academic foundation and discipline, building the base for my future learning journey.",
      image: "https://i.ibb.co/QVVc6Yk/e-schll.jpg",
      icon: "🎓"
    },
    {
      title: "Intermediate",
      institution: "Sri Chaitanya Junior Kalasala",
      location: "Kukatpally, Hyderabad",
      period: "Duration: 2022 – 2024",
      description: "Completed my Intermediate in MPC, focusing on mathematics and analytical thinking, which strengthened my problem-solving skills.",
      image: "https://i.ibb.co/B5Zg3RmT/e-mpc.jpg",
      icon: "🎓"
    },
    {
      title: "B.Tech",
      institution: "CMR Institute of Technology",
      location: "Kandlakoya, Hyderabad",
      period: "Expected Graduation: 2028",
      description: "Currently pursuing B.Tech in Computer Science (Data Science), developing skills in data analysis, programming, and real-world problem solving.",
      image: "https://i.ibb.co/vC78XX0M/e-cmrit.jpg",
      icon: "🎓"
    }
  ];

  return (
    <section id="education" className="py-24 md:py-40 bg-beige border-t border-charcoal/10">
      <div className="container mx-auto px-6">
        <div className="mb-24 max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">Education</h2>
          <p className="text-charcoal/60 text-lg">My academic journey has shaped my foundation in learning, discipline, and problem-solving, guiding me step by step toward my career in technology.</p>
        </div>

        <div className="space-y-32">
          {education.map((edu, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl group">
                  <img 
                    src={edu.image} 
                    alt={edu.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-olive/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-block px-4 py-2 bg-olive text-beige rounded-full text-sm font-bold uppercase tracking-widest">
                  {edu.icon} {edu.title}
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-black">{edu.institution}</h3>
                  <p className="text-lg font-bold text-olive/70">{edu.location}</p>
                </div>
                <div className="text-gold font-bold uppercase tracking-widest text-sm">{edu.period}</div>
                <p className="text-charcoal/70 text-lg leading-relaxed max-w-xl">{edu.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const technicalSkills = ["C", "Python", "CAD"];
  const specialSkills = ["Critical Thinking", "Creative Thinking"];

  return (
    <section id="skills" className="py-24 md:py-40 bg-olive text-beige">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Skills</h2>
          <div className="space-y-4 text-lg opacity-80 leading-relaxed">
            <p>I’m building a strong foundation in technical tools while continuously improving my ability to think, analyze, and solve problems effectively.</p>
            <p>Along with technical knowledge, I focus on developing personal skills that enhance creativity and decision-making.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Technical Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl border border-beige/10 bg-beige/5 space-y-8"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🔹</span>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Technical Skills</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {technicalSkills.map((skill, idx) => (
                <div key={idx} className="px-6 py-3 rounded-xl border border-beige/20 text-xl font-bold hover:bg-beige hover:text-olive transition-all cursor-default">
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Special Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl border border-beige/10 bg-beige/5 space-y-8"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🔹</span>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Special Skills</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {specialSkills.map((skill, idx) => (
                <div key={idx} className="px-6 py-3 rounded-xl border border-beige/20 text-xl font-bold hover:bg-beige hover:text-olive transition-all cursor-default">
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState<{ url: string; desc: string } | null>(null);

  const images = [
    {
      url: "https://i.ibb.co/m53tGRVS/g-in.jpg",
      desc: "IICT Industrial Tour (March 18, 2026)Stepping into Indian Institute of Chemical Technology felt like walking through ideas in motion—where innovation quietly takes shape.Through this opportunity from my college, I witnessed how concepts turn into real-world impact.."
    },
    {
      url: "https://i.ibb.co/N2WZtkys/g-volen.jpg",
      desc: "Women’s & Road Safety Awareness (March 14, 2026)Volunteering for the first time opened doors to meaningful connections and powerful conversations beyond classrooms.Interacting with officials and leaders taught me the value of awareness, observation, and truly understanding the world around me."
    },
    {
      url: "https://i.ibb.co/vxnXd4Wn/g-meet.jpg",
      desc: "EvolveXspaces Orientation (March 12, 2026)At EvolveXspaces, I experienced a new perspective—seeing peers transform into driven individuals with bold ideas.It pushed me out of my comfort zone and into a space where growth begins with showing up."
    },
    {
      url: "https://i.ibb.co/DH8DTcVC/g-st-tribe.jpg",
      desc: "ST. Tribe Workshop (July 26, 2025)My first step into ST. Tribe Workshop introduced me to the rhythm of the corporate world.It shifted my mindset—from learning in theory to understanding how things truly work beyond it."
    }
  ];

  return (
    <section id="gallery" className="py-24 md:py-40 bg-beige border-t border-charcoal/10">
      <div className="container mx-auto px-6">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Gallery</h2>
          <div className="space-y-4 text-charcoal/60 text-lg leading-relaxed">
            <p>A glimpse into my journey—capturing moments of learning, experiences, and growth beyond just academics.</p>
            <p>Each image reflects a story, a memory, or a step forward in my personal and professional development.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImg(img)}
              className="rounded-3xl overflow-hidden shadow-xl aspect-video cursor-pointer group relative"
            >
              <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-olive/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-beige text-charcoal px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs">View Details</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-beige rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedImg(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-charcoal text-beige rounded-full hover:bg-olive transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3 aspect-video lg:aspect-auto">
                  <img src={selectedImg.url} alt="Selected" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="lg:w-1/3 p-10 flex flex-col justify-center space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-olive">Moment Details</h4>
                  <p className="text-xl font-medium text-charcoal leading-relaxed">
                    {selectedImg.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Footer = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer id="contact" className="relative pt-24 md:pt-40 pb-12 bg-charcoal text-beige overflow-hidden">
      <ScrollingText text="MANASA THALARI" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                Every conversation starts with a simple hello...
              </h2>
              <p className="text-gold font-bold uppercase tracking-widest">—let’s start ours.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="mailto:manasa131106@gmail.com" className="p-4 rounded-full border border-beige/20 hover:bg-beige hover:text-charcoal transition-all">
                <Mail size={28} />
              </a>
              <a 
                href="https://www.linkedin.com/in/manasa-thalari-37015a329" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 rounded-full border border-beige/20 hover:bg-beige hover:text-charcoal transition-all"
              >
                <Linkedin size={28} />
              </a>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-beige/5 p-8 md:p-12 rounded-3xl border border-beige/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b border-beige/20 py-3 focus:border-gold outline-none transition-colors text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-b border-beige/20 py-3 focus:border-gold outline-none transition-colors text-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Ideas start small—type yours here…..."
                  className="w-full bg-transparent border-b border-beige/20 py-3 focus:border-gold outline-none transition-colors text-lg resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-beige text-charcoal font-black uppercase tracking-widest rounded-2xl hover:bg-gold transition-colors flex items-center justify-center space-x-3 group"
              >
                <span>Send Message</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-beige/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-beige/40">© Manasa All rights reserved</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"
          >
            <span>Back to top</span>
            <div className="p-2 rounded-full border border-beige/20 group-hover:bg-beige group-hover:text-charcoal transition-all">
              <ArrowUpRight size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Hackathons />
      <Skills />
      <Gallery />
      <Footer />
      
      {/* Scroll Progress Dot Nav (Optional but nice) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col space-y-4">
        {['home', 'about', 'education', 'hackathons', 'skills', 'gallery', 'contact'].map((id) => (
          <a 
            key={id} 
            href={`#${id}`} 
            className="w-2 h-2 rounded-full bg-charcoal/20 hover:bg-olive transition-all hover:scale-150"
            title={id}
          />
        ))}
      </div>
    </div>
  );
}
