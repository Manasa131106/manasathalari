/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { Typewriter } from 'react-simple-typewriter';
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
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  Code2,
  DraftingCompass,
  Brain,
  Lightbulb,
  Volume2,
  VolumeX,
  Sun,
  Moon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- Sound Effects ---
const SOUNDS = {
  CHIME: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
TICK: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
TAP: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
AMBIENT: 'https://www.soundjay.com/ambient/sounds/office-ambience-1.mp3',
SUCCESS: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
ERROR: 'https://www.soundjay.com/button/sounds/beep-07.mp3'
};

const useSound = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('isMuted');
    return saved ? JSON.parse(saved) : false;
  });
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload sounds
    Object.values(SOUNDS).forEach((url) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioRefs.current[url] = audio;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  const playSound = (soundUrl: string) => {
    if (isMuted) return;
    
    const MAX_VOLUME = 0.3;
    
    // Stop previous and fade out
    if (currentAudioRef.current) {
      const prevAudio = currentAudioRef.current;
      let volume = prevAudio.volume;
      const fadeOut = setInterval(() => {
        if (volume > 0.05) {
          volume -= 0.05;
          prevAudio.volume = Math.max(0, volume);
        } else {
          prevAudio.pause();
          prevAudio.currentTime = 0;
          clearInterval(fadeOut);
        }
      }, 20);
    }

    const audio = audioRefs.current[soundUrl];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0;
      currentAudioRef.current = audio;
      
      audio.play().then(() => {
        // Fade in to MAX_VOLUME
        let volume = 0;
        const fadeIn = setInterval(() => {
          if (volume < MAX_VOLUME - 0.05) {
            volume += 0.05;
            audio.volume = volume;
          } else {
            audio.volume = MAX_VOLUME;
            clearInterval(fadeIn);
          }
        }, 20);
      }).catch(err => console.warn("Playback failed", err));
    }
  };

  return { isMuted, setIsMuted, playSound };
};

// --- Validation Schema ---
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gold z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-gold pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: mousePos.x - 12,
        y: mousePos.y - 12,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(201, 163, 78, 0.2)' : 'transparent',
        boxShadow: isHovering ? '0 0 20px rgba(212, 169, 77, 0.4)' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

const FloatingShapes = ({ count = 6, color = "bg-gold/5" }: { count?: number, color?: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${color}`}
          style={{
            width: Math.random() * 200 + 50,
            height: Math.random() * 200 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      {/* Decorative Dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-gold/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
      {/* Decorative Lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-[1px] bg-gold/10"
          style={{
            width: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            rotate: `${Math.random() * 360}deg`,
          }}
          animate={{
            x: [0, 50, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const ParallaxWrapper = ({ children, offset = 20 }: { children: React.ReactNode, offset?: number }) => {
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPct = (e.clientX / innerWidth - 0.5) * offset;
      const yPct = (e.clientY / innerHeight - 0.5) * offset;
      x.set(xPct);
      y.set(yPct);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [offset, x, y, isTouchDevice]);

  if (isTouchDevice) return <>{children}</>;

  return (
    <motion.div style={{ x, y }}>
      {children}
    </motion.div>
  );
};

const SectionHeading = ({ title, subtitle, align = "left" }: { title: string, subtitle?: string, align?: "left" | "center" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`mb-16 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <div className="relative inline-block">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase relative z-10">
          {title}
        </h2>
        <motion.span 
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "100%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
          className="absolute bottom-2 left-0 h-4 bg-gold/30 -z-0"
        />
        <motion.span 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
          className="absolute -bottom-1 left-0 w-full h-[2px] bg-gold origin-left"
        />
      </div>
      {subtitle && <p className="opacity-60 text-lg mt-6 leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
};

const TiltWrapper = ({ children, intensity = 15 }: { children: React.ReactNode, intensity?: number }) => {
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (isTouchDevice) {
    return <div className="relative transition-shadow duration-300 hover:shadow-2xl hover:shadow-gold/10 rounded-2xl">{children}</div>;
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative transition-shadow duration-300 hover:shadow-2xl hover:shadow-gold/10 rounded-2xl"
    >
      {children}
    </motion.div>
  );
};

const ScrollingText = ({ text }: { text: string }) => {
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-5 select-none z-0">
      <ParallaxWrapper offset={-50}>
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
          <span className="text-[20vw] md:text-[25vw] font-black uppercase tracking-tighter leading-none pr-20">
            {text} {text} {text} {text}
          </span>
          <span className="text-[20vw] md:text-[25vw] font-black uppercase tracking-tighter leading-none pr-20">
            {text} {text} {text} {text}
          </span>
        </motion.div>
      </ParallaxWrapper>
    </div>
  );
};

const Navbar = ({ isMuted, setIsMuted, playSound, isDarkMode, setIsDarkMode }: { isMuted: boolean, setIsMuted: (v: boolean) => void, playSound: (s: string) => void, isDarkMode: boolean, setIsDarkMode: (v: boolean) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          
          // Update theme-color meta tag for mobile browser UI
          const themeColorMeta = document.querySelector('meta[name="theme-color"]');
          if (themeColorMeta) {
            let color = '#f8f6f2'; // Default beige
            
            if (sectionId === 'home') {
              color = isDarkMode ? '#A3B18A' : '#6B7A5E'; // Olive
            } else if (sectionId === 'contact') {
              color = isDarkMode ? '#f8f6f2' : '#1f1f1f'; // Charcoal (swaps in dark mode)
            } else {
              color = isDarkMode ? '#1a1a1a' : '#f8f6f2'; // Beige
            }
            
            themeColorMeta.setAttribute('content', color);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'about', 'education', 'hackathons', 'skills', 'gallery', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isDarkMode]);

  useEffect(() => {
    // Update theme-color meta tag whenever activeSection or isDarkMode changes
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      let color = '#f8f6f2'; // Default beige
      
      if (activeSection === 'home') {
        color = isDarkMode ? '#A3B18A' : '#6B7A5E'; // Olive
      } else if (activeSection === 'contact') {
        color = isDarkMode ? '#f8f6f2' : '#1f1f1f'; // Charcoal (swaps in dark mode)
      } else {
        color = isDarkMode ? '#1a1a1a' : '#f8f6f2'; // Beige
      }
      
      themeColorMeta.setAttribute('content', color);
    }
  }, [activeSection, isDarkMode]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Hackathons', href: '#hackathons' },
    { name: 'Skills', href: '#skills' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    playSound(SOUNDS.TAP);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-beige/80 backdrop-blur-md py-4 shadow-sm text-charcoal' : 'py-8 text-beige'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={() => playSound(SOUNDS.TAP)}
          onMouseEnter={() => playSound(SOUNDS.TICK)}
          className="text-xl font-black tracking-tighter hover:text-gold transition-colors"
        >
          MANASA.
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onMouseEnter={() => playSound(SOUNDS.TICK)}
              onClick={() => handleNavClick(link.href)}
              className={`relative text-sm font-medium uppercase tracking-widest transition-colors group ${activeSection === link.href.slice(1) ? (isScrolled ? 'text-olive' : 'text-gold') : (isScrolled ? 'hover:text-olive' : 'hover:text-gold')}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-300 ${activeSection === link.href.slice(1) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </a>
          ))}
          
            <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              onMouseEnter={() => playSound(SOUNDS.TICK)}
              className={`p-2 rounded-full border transition-all ${isScrolled ? 'border-charcoal/10 text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5' : 'border-beige/10 text-beige/60 hover:text-beige hover:bg-beige/5'}`}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setIsMuted(!isMuted)}
              onMouseEnter={() => playSound(SOUNDS.TICK)}
              className={`p-2 rounded-full border transition-all ${isScrolled ? 'border-charcoal/10 text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5' : 'border-beige/10 text-beige/60 hover:text-beige hover:bg-beige/5'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            onMouseEnter={() => playSound(SOUNDS.TICK)}
            className={`p-2 rounded-full border transition-all ${isScrolled ? 'border-charcoal/10 text-charcoal/60' : 'border-beige/10 text-beige/60'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            onMouseEnter={() => playSound(SOUNDS.TICK)}
            className={`p-2 rounded-full border transition-all ${isScrolled ? 'border-charcoal/10 text-charcoal/60' : 'border-beige/10 text-beige/60'}`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-charcoal/5' : 'hover:bg-beige/5'}`} 
            onMouseEnter={() => playSound(SOUNDS.TICK)}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              playSound(SOUNDS.TAP);
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-beige shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4 items-center text-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onMouseEnter={() => playSound(SOUNDS.TICK)}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-lg font-bold uppercase tracking-widest pb-2 transition-colors ${activeSection === link.href.slice(1) ? 'text-olive border-b-2 border-gold' : 'border-b border-charcoal/10'}`}
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

const HeroName = ({ playSound }: { playSound: (s: string) => void }) => {
  const defaultName = 'Manasa';
  const translations = ['మనసా', 'मनसा', 'மனசா', 'ಮನಸಾ', 'মনসা', 'मनसा', 'マナサ'];
  const [index, setIndex] = useState(-1); // -1 means default
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      setIndex(0);
      playSound(SOUNDS.CHIME);
      interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % translations.length);
        playSound(SOUNDS.CHIME);
      }, 800);
    } else {
      setIndex(-1);
    }
    return () => clearInterval(interval);
  }, [isHovered, playSound]);

  const currentName = index === -1 ? defaultName : translations[index];

  return (
    <motion.h1
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="text-huge font-black tracking-tighter select-none absolute top-0 left-1/2 -translate-x-1/2 z-20 cursor-default whitespace-nowrap text-white dark:text-gold transition-colors duration-300 pointer-events-auto"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentName}
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 1, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="inline-block"
        >
          {currentName}
        </motion.span>
      </AnimatePresence>
    </motion.h1>
  );
};

const Hero = ({ playSound }: { playSound: (s: string) => void }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center pt-20 overflow-hidden bg-olive text-beige">
      <ScrollingText text="MANASA THALARI" />
      <FloatingShapes />
      
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center relative">
          <ParallaxWrapper offset={30}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 text-xs font-bold uppercase tracking-[0.3em]"
            >
              <span className="text-gold">
                <Typewriter
                  words={['Data Analysis Learner', 'Working on Projects', 'Skills in Progress']}
                  loop={0}
                  cursor
                  cursorStyle='_'
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
            </motion.div>
          </ParallaxWrapper>

          <div className="relative w-full flex flex-col items-center">
            {/* Image Layer - Lower Z-Index */}
            <div className="relative z-0">
              <TiltWrapper intensity={10}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl group bg-charcoal/5 dark:bg-beige/5"
                >
                  <motion.img 
                    src="https://i.ibb.co/8g39vtqf/my-pic.jpg" 
                    alt="Manasa Portrait" 
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </TiltWrapper>
            </div>

            {/* "Manasa" Text Layer - Absolute with Higher Z-Index */}
            <div className="absolute top-[-5vw] md:top-[-4vw] left-0 w-full z-20">
              <ParallaxWrapper offset={15}>
                <div className="relative flex items-center justify-center">
                  <h1 className="text-huge font-black tracking-tighter invisible select-none whitespace-nowrap">Manasa</h1>
                  <HeroName playSound={playSound} />
                </div>
              </ParallaxWrapper>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex gap-6"
          >
            <motion.a 
              href="#hackathons"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 30px rgba(212, 169, 77, 0.6)",
                backgroundColor: "#e5b858"
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => playSound(SOUNDS.TICK)}
              onClick={() => playSound(SOUNDS.TAP)}
              className="px-8 py-4 bg-gold text-charcoal font-bold uppercase tracking-widest rounded-full shadow-lg transition-all"
            >
              View Projects
            </motion.a>
            <motion.a 
              href="#contact"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(248, 246, 242, 0.2)",
                boxShadow: "0 0 20px rgba(248, 246, 242, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => playSound(SOUNDS.TICK)}
              onClick={() => playSound(SOUNDS.TAP)}
              className="px-8 py-4 border border-beige/30 text-beige font-bold uppercase tracking-widest rounded-full transition-all"
            >
              Let's Talk
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-gold" />
        </motion.div>
      </motion.div>
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
    <section id="about" className="relative py-24 md:py-40 overflow-hidden bg-beige">
      <FloatingShapes count={4} color="bg-charcoal/5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading 
            title="About" 
            subtitle="I’m a B.Tech student beginning my journey in Data Analysis, learning to see beyond numbers and uncover the stories within data."
            align="center"
          />
          <div className="space-y-6 text-lg md:text-xl text-charcoal/80 leading-relaxed mt-12">
            <p>
              I’m building my skills in Excel, SQL, and data visualization—focused on turning raw data into meaningful insights, while growing through curiosity and consistency every day.
            </p>
            <p>
              Currently, I’m an intern at EvolveXspaces, where I’m gaining hands-on experience and working with real-world data.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-20">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
                whileHover={{ y: -5, color: '#d4a94d' }}
                className="border-t border-charcoal/20 pt-8 group cursor-default"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  className="text-3xl md:text-4xl font-black mb-2 leading-tight group-hover:scale-110 transition-transform origin-left"
                >
                  {stat.value}
                </motion.div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60 group-hover:text-gold transition-colors">{stat.label}</div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

const Hackathons = ({ playSound }: { playSound: (s: string) => void }) => {
  const hackathons = [
    {
      title: "Data Dynamo 2.0",
      location: "Anurag University",
      date: "Jan 30–31, 2026",
      duration: "24 hrs",
      role: "Frontend Developer",
      image: "https://i.ibb.co/kVpbHggc/h-anurag.jpg",
      description: "Developed the AI-powered Environmental Issue Portal, focusing on frontend design to create a smooth, interactive interface. Collaborated with teammates on planning and workflow to deliver a functional web solution in 24 hours.",
      tech: ["React", "Tailwind CSS", "Framer Motion", "AI Integration"]
    },
    {
      title: "Hackforge 2026",
      location: "Hackforge 2026, CMRIT Hyderabad",
      date: "Mar 5–7, 2026",
      duration: "48 hrs",
      role: "Dashboard, Poster & Presentation Designer",
      image: "https://i.ibb.co/cSDVbfdK/h-cmrit.jpg",
      description: "Designed dashboard visuals, posters, and presentation materials for a project enhancing transparency and accessibility in the MGNREGA system. Worked through all three hackathon rounds — Ideation, Prototype, Final Demo — to deliver an impactful solution.",
      tech: ["UI/UX Design", "Data Visualization", "Presentation Design", "Prototyping"]
    }
  ];

  return (
    <section id="hackathons" className="relative py-24 md:py-40 border-t border-charcoal/10 bg-beige overflow-hidden">
      <FloatingShapes count={3} color="bg-gold/5" />
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          title="Hackathons" 
          subtitle="I actively participate in hackathons to challenge my thinking, collaborate with others, and build solutions under pressure. These experiences help me learn faster, adapt quickly, and turn ideas into real outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {hackathons.map((hackathon, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="relative w-full group"
              style={{ perspective: '1500px' }}
              onMouseEnter={() => playSound(SOUNDS.TICK)}
              onClick={() => playSound(SOUNDS.TAP)}
            >
              <motion.div
                className="w-full relative transition-all duration-700"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ rotateY: 180 }}
              >
                {/* Front Side */}
                <div 
                  className="relative w-full rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xl flex flex-col border border-charcoal/5"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="relative overflow-hidden bg-charcoal/5 dark:bg-beige/5">
                    <img 
                      src={hackathon.image} 
                      alt={hackathon.title} 
                      className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest rounded">
                          {hackathon.duration}
                        </span>
                        <span className="text-beige/70 text-[10px] font-bold uppercase tracking-widest">
                          {hackathon.date}
                        </span>
                      </div>
                      <h3 className="text-beige text-3xl font-black leading-tight tracking-tighter">{hackathon.title}</h3>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center flex-grow text-left">
                    <p className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Role</p>
                    <p className="text-charcoal font-black text-xl leading-tight mb-2">{hackathon.role}</p>
                    <div className="flex items-center gap-2 text-charcoal/40">
                      <span className="w-4 h-[1px] bg-charcoal/20" />
                      <p className="text-xs font-bold uppercase tracking-widest">{hackathon.location}</p>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-olive p-10 flex flex-col justify-center text-beige shadow-2xl border border-white/10 text-left"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="mb-8">
                    <h3 className="text-3xl font-black mb-2 text-gold tracking-tighter">{hackathon.title}</h3>
                    <p className="text-gold/60 text-[10px] font-bold uppercase tracking-[0.2em]">{hackathon.location}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-gold/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Project & Contributions</p>
                      <p className="text-base leading-relaxed opacity-90 font-medium">{hackathon.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-gold/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Technologies Used</p>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tech.map((t, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold uppercase tracking-wider text-gold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Details</span>
                    <ArrowLeft size={16} className="text-gold/40" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center max-w-3xl mx-auto"
        >
          <p className="italic text-charcoal/60 leading-relaxed text-lg">
            "Each hackathon pushes me beyond my limits—shaping how I think, build, and solve problems in real-world situations."
          </p>
        </motion.div>
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
    <section id="education" className="relative py-24 md:py-40 border-t border-charcoal/10 bg-beige overflow-hidden">
      <FloatingShapes count={4} color="bg-olive/5" />
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          title="Education" 
          subtitle="My academic journey has shaped my foundation in learning, discipline, and problem-solving, guiding me step by step toward my career in technology."
        />

        <div className="space-y-24 md:space-y-32">
          {education.map((edu, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Side */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group bg-charcoal/5 dark:bg-beige/5">
                  <img 
                    src={edu.image} 
                    alt={edu.title} 
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-olive/5 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </motion.div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <motion.div 
                  initial={{ x: idx % 2 === 0 ? 20 : -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block px-4 py-2 bg-olive text-beige rounded-full text-sm font-bold uppercase tracking-widest shadow-lg"
                >
                  {edu.icon} {edu.title}
                </motion.div>
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
  const technicalSkills = [
    { name: "C", icon: <Code2 size={18} /> },
    { name: "Python", icon: <Terminal size={18} /> },
    { name: "Auto CAD", icon: <DraftingCompass size={18} /> }
  ];
  const specialSkills = [
    { name: "Critical Thinking", icon: <Brain size={18} /> },
    { name: "Creative Thinking", icon: <Lightbulb size={18} /> }
  ];

  return (
    <section id="skills" className="relative py-24 md:py-40 overflow-hidden bg-olive text-beige">
      <FloatingShapes count={5} color="bg-beige/5" />
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          title="Skills" 
          subtitle="I’m building a strong foundation in technical tools while continuously improving my ability to think, analyze, and solve problems effectively."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Technical Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -10 }}
            className="p-10 rounded-3xl border border-beige/20 bg-beige/10 space-y-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex items-center space-x-4">
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                🔹
              </motion.span>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Technical Skills</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {technicalSkills.map((skill, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.05 }}
                  className="px-5 py-3 rounded-xl border border-beige/20 text-lg font-bold transition-all cursor-default flex items-center gap-3 hover:bg-beige hover:text-olive"
                >
                  <span className="text-gold opacity-70">{skill.icon}</span>
                  {skill.name}
                  <span className="text-gold opacity-70">{skill.icon}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Special Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -10 }}
            className="p-10 rounded-3xl border border-beige/20 bg-beige/10 space-y-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex items-center space-x-4">
              <motion.span 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                🔹
              </motion.span>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Special Skills</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {specialSkills.map((skill, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.05 }}
                  className="px-5 py-3 rounded-xl border border-beige/20 text-lg font-bold transition-all cursor-default flex items-center gap-3 hover:bg-beige hover:text-olive"
                >
                  <span className="text-gold opacity-70">{skill.icon}</span>
                  {skill.name}
                  <span className="text-gold opacity-70">{skill.icon}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = ({ playSound }: { playSound: (s: string) => void }) => {
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

  const handleImageClick = (img: { url: string; desc: string }) => {
    setSelectedImg(img);
    playSound(SOUNDS.TAP);
  };

  return (
    <section id="gallery" className="relative py-24 md:py-40 border-t border-charcoal/10 overflow-hidden bg-beige">
      <FloatingShapes count={4} color="bg-charcoal/5" />
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          title="Gallery" 
          subtitle="A glimpse into my journey—capturing moments of learning, experiences, and growth beyond just academics."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {images.map((img, idx) => (
            <div key={idx}>
              <TiltWrapper intensity={idx === 0 ? 5 : 15}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  onMouseEnter={() => playSound(SOUNDS.TICK)}
                  onClick={() => handleImageClick(img)}
                  className="rounded-3xl overflow-hidden shadow-xl cursor-pointer group relative"
                >
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-auto object-contain bg-charcoal/5 dark:bg-beige/5 transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-olive/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-beige text-charcoal px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg">View Details</span>
                  </div>
                </motion.div>
              </TiltWrapper>
            </div>
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
            onClick={() => {
              setSelectedImg(null);
              playSound(SOUNDS.TAP);
            }}
            className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-beige rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onMouseEnter={() => playSound(SOUNDS.TICK)}
                onClick={() => {
                  setSelectedImg(null);
                  playSound(SOUNDS.TAP);
                }}
                className="absolute top-6 right-6 z-10 p-2 bg-charcoal text-beige rounded-full hover:bg-olive transition-colors shadow-lg"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3">
                  <img src={selectedImg.url} alt="Selected" className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
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

const Footer = ({ playSound }: { playSound: (s: string) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Using Formspree for real form submission
      // Replace 'mqeynwej' with your own Formspree ID if needed
      const response = await fetch('https://formspree.io/f/mqeynwej', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        playSound(SOUNDS.SUCCESS);
        reset();
      } else {
        setSubmitStatus('error');
        playSound(SOUNDS.ERROR);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      playSound(SOUNDS.ERROR);
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <footer id="contact" className="relative pt-24 md:pt-40 pb-12 overflow-hidden bg-charcoal text-beige">
      <ScrollingText text="MANASA THALARI" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                Every conversation starts with a simple hello...
              </h2>
              <p className="text-gold font-bold uppercase tracking-widest">—let’s start ours.</p>
            </div>
            
            <div className="flex space-x-6">
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => playSound(SOUNDS.TICK)}
                onClick={() => playSound(SOUNDS.TAP)}
                href="mailto:manasa131106@gmail.com" 
                className="p-4 rounded-full border border-beige/20 hover:bg-beige hover:text-charcoal transition-all shadow-lg hover:shadow-gold/20"
              >
                <Mail size={28} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => playSound(SOUNDS.TICK)}
                onClick={() => playSound(SOUNDS.TAP)}
                href="https://www.linkedin.com/in/manasa-thalari-37015a329" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 rounded-full border border-beige/20 hover:bg-beige hover:text-charcoal transition-all shadow-lg hover:shadow-gold/20"
              >
                <Linkedin size={28} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => playSound(SOUNDS.TICK)}
                onClick={() => playSound(SOUNDS.TAP)}
                href="https://github.com/Manasa131106" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 rounded-full border border-beige/20 hover:bg-beige hover:text-charcoal transition-all shadow-lg hover:shadow-gold/20"
              >
                <Github size={28} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-beige/5 p-8 md:p-12 rounded-3xl border border-beige/10 shadow-2xl relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Name</label>
                  <input 
                    {...register('name')}
                    type="text" 
                    placeholder="Your Name"
                    onFocus={() => playSound(SOUNDS.TICK)}
                    className={`w-full bg-transparent border-b py-3 outline-none transition-all text-lg ${errors.name ? 'border-red-500' : 'border-beige/20 focus:border-gold'}`}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Email</label>
                  <input 
                    {...register('email')}
                    type="email" 
                    placeholder="your@email.com"
                    onFocus={() => playSound(SOUNDS.TICK)}
                    className={`w-full bg-transparent border-b py-3 outline-none transition-all text-lg ${errors.email ? 'border-red-500' : 'border-beige/20 focus:border-gold'}`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Message</label>
                <textarea 
                  {...register('message')}
                  rows={4}
                  placeholder="Ideas start small—type yours here…..."
                  onFocus={() => playSound(SOUNDS.TICK)}
                  className={`w-full bg-transparent border-b py-3 outline-none transition-all text-lg resize-none ${errors.message ? 'border-red-500' : 'border-beige/20 focus:border-gold'}`}
                />
                {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.message.message}</p>}
              </div>

              <motion.button 
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, backgroundColor: '#d4a94d', color: '#1a1a1a', boxShadow: "0 0 20px rgba(212, 169, 77, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => playSound(SOUNDS.TICK)}
                onClick={() => playSound(SOUNDS.TAP)}
                className="w-full py-5 bg-beige/10 border border-beige/20 text-beige font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs"
                  >
                    <CheckCircle2 size={16} />
                    Message sent successfully!
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-2 text-red-400 font-bold uppercase tracking-widest text-xs"
                  >
                    <AlertCircle size={16} />
                    Something went wrong. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
        <div className="border-t border-beige/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-beige/40">© Manasa All rights reserved</p>
          <motion.button 
            whileHover={{ y: -5 }}
            onMouseEnter={() => playSound(SOUNDS.TICK)}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              playSound(SOUNDS.TAP);
            }}
            className="group flex items-center space-x-3 text-xs font-bold uppercase tracking-widest"
          >
            <span>Back to top</span>
            <div className="p-2 rounded-full border border-beige/20 group-hover:bg-beige group-hover:text-charcoal transition-all">
              <ArrowUpRight size={16} />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const { isMuted, setIsMuted, playSound } = useSound();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <div className="relative bg-beige text-charcoal selection:bg-gold selection:text-charcoal transition-colors duration-300">
      <ScrollProgress />
      <CustomCursor />
      <Navbar 
        isMuted={isMuted} 
        setIsMuted={setIsMuted} 
        playSound={playSound} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
      <Hero playSound={playSound} />
      <About />
      <Education />
      <Hackathons playSound={playSound} />
      <Skills />
      <Gallery playSound={playSound} />
      <Footer playSound={playSound} />
      
      {/* Scroll Progress Dot Nav */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col space-y-4">
        {['home', 'about', 'education', 'hackathons', 'skills', 'gallery', 'contact'].map((id) => (
          <motion.a 
            key={id} 
            href={`#${id}`} 
            whileHover={{ scale: 1.5 }}
            onMouseEnter={() => playSound(SOUNDS.TICK)}
            onClick={() => playSound(SOUNDS.TAP)}
            className="w-2 h-2 rounded-full bg-charcoal/20 hover:bg-gold transition-all"
            title={id}
          />
        ))}
      </div>
    </div>
  );
}
