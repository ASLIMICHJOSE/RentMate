import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertyCard } from '../components/property/PropertyCard';
import { SearchBar } from '../components/property/SearchBar';
import { AppStore } from '../services/store';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatCurrency, getInitials } from '../utils/format';

const CITIES = ['Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai'];

const CHAPTERS = [
  { id: 'chapter-1', num: '01', title: 'The Sanctuary', tag: 'Prologue' },
  { id: 'chapter-2', num: '02', title: 'Direct Protocol', tag: 'Zero Brokerage' },
  { id: 'chapter-3', num: '03', title: 'Compatibility Lab', tag: 'Roommate Matrix' },
  { id: 'chapter-4', num: '04', title: 'The Collection', tag: 'Curated Homes' },
  { id: 'chapter-5', num: '05', title: 'Key Handover', tag: 'Private Walkthroughs' },
  { id: 'chapter-6', num: '06', title: 'Campus Arenas', tag: 'Metro Map' },
  { id: 'chapter-7', num: '07', title: 'Your Journey', tag: 'Resident Portals' },
];

const LENSES = [
  {
    id: 'study' as const,
    name: '01 · Study Nook',
    spec: 'South-Facing · 480 sq ft Studio · Daylight 98%',
    image: '/images/editorial/hero.jpg',
    badge: 'Natural Light Sanctuary',
    location: 'Guindy Campus Lofts · Chennai',
  },
  {
    id: 'courtyard' as const,
    name: '02 · Courtyard Gardens',
    spec: 'Communal Terraces · Olive Trees · Ambient Twilight',
    image: '/images/editorial/residence.jpg',
    badge: 'Botanical Courtyard',
    location: 'Koramangala Residences · Bengaluru',
  },
  {
    id: 'social' as const,
    name: '03 · Shared Living',
    spec: 'Scandinavian Dining · Dual Workstations',
    image: '/images/editorial/roommates.jpg',
    badge: 'Academic Co-Living',
    location: 'HITEC Scholars Hub · Hyderabad',
  },
];

const HOTSPOTS = [
  {
    id: 1,
    top: '34%',
    left: '26%',
    title: '98% Daylight Factor',
    detail: 'Floor-to-ceiling double-glazed solar glass oriented towards lush campus tree canopies.',
    icon: '☀️',
  },
  {
    id: 2,
    top: '64%',
    left: '52%',
    title: 'Dedicated 1 Gbps Fiber',
    detail: 'Dual router UPS backup ensures zero connection drops during exams and research.',
    icon: '⚡',
  },
  {
    id: 3,
    top: '22%',
    left: '74%',
    title: '4-Min Campus Walk',
    detail: 'Direct tree-lined pedestrian avenue to Anna University Gate 2.',
    icon: '🎓',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Interactive Viewfinder Frame State
  const [activeLens, setActiveLens] = useState<'study' | 'courtyard' | 'social'>('study');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });

  function handleFrameMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 10; // -5 to +5 deg
    const rotateY = (x - 0.5) * 10; // -5 to +5 deg
    setTilt({ rotateX, rotateY, sheenX: x * 100, sheenY: y * 100 });
  }

  function handleFrameMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  }

  // Roommate Compatibility Laboratory State
  const [scouterSleep, setScouterSleep] = useState<'EARLY_BIRD' | 'FLEXIBLE' | 'NIGHT_OWL'>('EARLY_BIRD');
  const [scouterFood, setScouterFood] = useState<'VEGETARIAN' | 'EGGETARIAN' | 'NON_VEGETARIAN'>('VEGETARIAN');
  const [scouterBudget, setScouterBudget] = useState(14000);

  // Private Walkthrough Booking inside the page
  const [walkthroughDate, setWalkthroughDate] = useState('2026-10-30');
  const [walkthroughSlot, setWalkthroughSlot] = useState('Morning (9 AM - 12 PM)');
  const [isWalkthroughBooked, setIsWalkthroughBooked] = useState(false);

  // Scroll listener for progress bar and chapter tracking
  useEffect(() => {
    function handleScroll() {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleScouterChange(type: 'sleep' | 'food' | 'budget', value: any) {
    if (type === 'sleep') setScouterSleep(value);
    if (type === 'food') setScouterFood(value);
    if (type === 'budget') setScouterBudget(value);
  }

  async function handleQuickDemo(email: string) {
    const logged = await login({ email, password: 'Password123!' });
    showToast({
      variant: 'success',
      title: `Welcome, ${logged.name}`,
      description: `Viewing experience as ${logged.role}`,
    });
  }

  function handleWalkthroughSubmit(e: React.FormEvent) {
    e.preventDefault();
    AppStore.createVisit({
      propertyId: 'prop-1',
      propertyTitle: 'Sunlit 2BHK near Anna University & Guindy Metro',
      propertyAddress: '4th Cross Street, Guindy',
      propertyCity: 'Chennai',
      propertyImage: '/images/editorial/hero.jpg',
      rent: 18500,
      ownerId: 'owner-1',
      ownerName: 'Priya Raghavan',
      studentId: user?.id ?? 'user-101',
      studentName: user?.name ?? 'Aditya Sharma',
      studentEmail: user?.email ?? 'aditya.student@rentmate.dev',
      studentPhone: '+91 98412 34567',
      preferredDate: walkthroughDate,
      preferredSlot: walkthroughSlot as any,
      note: 'Scheduled via Architectural Walkthrough Terminal.',
    });
    setIsWalkthroughBooked(true);
    showToast({
      variant: 'success',
      title: 'Private Inspection Reserved',
      description: 'Your walkthrough slot has been coordinated directly with owner Priya Raghavan.',
    });
  }

  // Calculate dynamic scouter matches based on state
  const scouterMatches = AppStore.calculateRoommateMatches({
    sleepSchedule: scouterSleep,
    foodPreference: scouterFood,
    budgetMax: scouterBudget,
  }).slice(0, 3);

  const featuredProperties = AppStore.getProperties().filter((p) => p.status === 'PUBLISHED').slice(0, 3);
  const currentChapterIndex = Math.min(6, Math.max(0, Math.floor((scrollProgress / 100) * 7)));
  const currentChapter = CHAPTERS[currentChapterIndex];

  return (
    <div className="relative bg-[#fcfaf7] text-[#141a24] selection:bg-[#c8643c] selection:text-white">
      {/* Scroll Progress Bar at the Top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#e8e2d8]/60">
        <div
          className="h-full bg-gradient-to-r from-[#c8643c] via-[#d49954] to-[#2a5745] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Side Chapter Navigator Rail (Desktop) */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col gap-2.5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#7b8494] px-3 pb-1 border-b border-[#e8e2d8]">
          Chapters
        </div>
        {CHAPTERS.map((ch, idx) => {
          const isActive = currentChapterIndex === idx;
          return (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-300 ${
                isActive
                  ? 'bg-white shadow-md border border-[#e8e2d8] text-[#141a24] font-semibold translate-x-1.5'
                  : 'text-[#7b8494] hover:text-[#141a24] hover:bg-[#f2ede4]'
              }`}
            >
              <span className={`font-serif text-sm ${isActive ? 'text-[#c8643c] font-bold' : ''}`}>
                {ch.num}
              </span>
              <span className="truncate max-w-28 text-[11px] font-medium tracking-wide">
                {ch.title}
              </span>
            </a>
          );
        })}
      </aside>

      {/* Floating Chapter Status Indicator at Bottom Right */}
      <aside className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 border border-[#e8e2d8] shadow-lg text-xs">
          <span className="size-2 rounded-full bg-[#c8643c] animate-pulse" />
          <span className="font-serif font-bold text-[#141a24]">{currentChapter?.num}</span>
          <span className="text-[#7b8494]">·</span>
          <span className="font-medium text-[#5e6676]">{currentChapter?.title}</span>
        </div>
      </aside>

      {/* =========================================================================
          CHAPTER 01: PROLOGUE — WHERE STUDENT LIFE FINDS ITS SANCTUARY (100VH)
          ========================================================================= */}
      <section
        id="chapter-1"
        className="relative min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-4.5rem)] lg:max-h-[940px] flex flex-col justify-between border-b border-[#e8e2d8] px-4 sm:px-6 lg:px-8 py-3 lg:py-5 overflow-hidden bg-[#fcfaf7]"
      >
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 architectural-grid opacity-60 pointer-events-none" />

        {/* Ambient Warm Gradient Glow Behind the Frame */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 size-[450px] rounded-full bg-gradient-to-br from-[#c8643c]/10 to-[#2a5745]/10 blur-3xl pointer-events-none" />

        {/* Center Grid Content (100vh Fit) */}
        <div className="relative mx-auto max-w-7xl w-full grid gap-8 lg:grid-cols-12 lg:items-center flex-1 my-auto">
          {/* Left Content Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4 lg:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece3] border border-[#e5d9ca] text-xs font-semibold text-[#a84c27] uppercase tracking-wider">
              <span>✦ Chapter 01</span>
              <span>·</span>
              <span>The Architectural Living Protocol</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.2rem] leading-[1.05] tracking-tight text-[#141a24] font-medium">
              Where student life <br />
              finds its <span className="text-[#c8643c] italic font-normal">sanctuary.</span>
            </h1>

            <p className="max-w-lg text-sm sm:text-base text-[#5e6676] leading-relaxed">
              Curated campus residences inspected for natural solar illumination, fiber connectivity, and verified flatmate compatibility — zero broker commissions.
            </p>

            {/* Curated Search Terminal */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e8e2d8] shadow-[0_10px_30px_rgba(20,26,36,0.06)] max-w-lg">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search area or university (Guindy, Koramangala)..."
                onSubmit={(val) => navigate(val ? `/properties?q=${encodeURIComponent(val)}` : '/properties')}
              />
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#7b8494] mr-1">Metros:</span>
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => navigate(`/properties?city=${encodeURIComponent(c)}`)}
                    className="rounded-lg px-2 py-0.5 text-[11px] font-medium text-[#141a24] bg-[#f5f0e8] hover:bg-[#c8643c] hover:text-white transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Micro-Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-[#5e6676]">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-[#c8643c]">₹0</span>
                <span className="font-medium text-[#7b8494] leading-tight">Direct Owner<br />Brokerage Fee</span>
              </div>
              <div className="h-6 w-px bg-[#e8e2d8]" />
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-[#2a5745]">100%</span>
                <span className="font-medium text-[#7b8494] leading-tight">Physical Space<br />Verified Walkthroughs</span>
              </div>
              <div className="h-6 w-px bg-[#e8e2d8]" />
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-[#141a24]">48h</span>
                <span className="font-medium text-[#7b8494] leading-tight">Average Move-In<br />Confirmation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Architectural Viewfinder Frame (6 cols) */}
          <div className="lg:col-span-6 relative" style={{ perspective: '1200px' }}>
            {/* The 3D Responsive Tilt Frame */}
            <div
              onMouseMove={handleFrameMouseMove}
              onMouseLeave={handleFrameMouseLeave}
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative rounded-3xl bg-[#141a24] p-3 sm:p-4 border-2 border-[#303846] shadow-[0_24px_60px_-12px_rgba(20,26,36,0.35)] overflow-hidden group cursor-crosshair select-none"
            >
              {/* Dynamic Glass Specular Light Sheen */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                }}
              />

              {/* Top Viewfinder Metadata & Lens Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 px-1 border-b border-white/10 text-white">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase">
                    LIVE ARCHITECTURAL VIEWFINDER
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  LAT 13.0067° N · LON 80.2354° E
                </div>
              </div>

              {/* Three Interactive Lens Buttons */}
              <div className="grid grid-cols-3 gap-1.5 my-2">
                {LENSES.map((lens) => (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setActiveLens(lens.id)}
                    className={`rounded-xl py-1.5 px-2 text-[11px] font-semibold tracking-wide transition-all ${
                      activeLens === lens.id
                        ? 'bg-[#c8643c] text-white shadow-md'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    {lens.name}
                  </button>
                ))}
              </div>

              {/* Viewfinder Main Photographic Display */}
              <div className="relative rounded-2xl overflow-hidden h-[330px] sm:h-[370px] border border-white/15 bg-black">
                {/* Active Lens Image */}
                {LENSES.map((lens) => (
                  <img
                    key={lens.id}
                    src={lens.image}
                    alt={lens.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                      activeLens === lens.id ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                  />
                ))}

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Architectural Precision Corner Brackets */}
                <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
                <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
                <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

                {/* Center Viewfinder Reticle */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-40">
                  <div className="size-6 border border-white/60 rounded-full flex items-center justify-center">
                    <span className="size-1 bg-white rounded-full" />
                  </div>
                </div>

                {/* 3 Interactive Hotspot Pins */}
                {HOTSPOTS.map((spot) => {
                  const isSelected = activeHotspot === spot.id;
                  return (
                    <div
                      key={spot.id}
                      style={{ top: spot.top, left: spot.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(isSelected ? null : spot.id);
                        }}
                        className={`relative size-8 rounded-full border-2 grid place-items-center transition-all ${
                          isSelected
                            ? 'bg-[#c8643c] border-white scale-125 shadow-[0_0_15px_#c8643c]'
                            : 'bg-black/60 border-white/80 hover:scale-110 hover:bg-[#c8643c]'
                        }`}
                        title={spot.title}
                      >
                        <span className="text-xs">{spot.icon}</span>
                        {/* Pulsing ring */}
                        <span className="absolute -inset-1 rounded-full border border-white/60 animate-ping opacity-60" />
                      </button>

                      {/* Hotspot Detailed Tooltip Card */}
                      {isSelected && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-56 rounded-xl bg-[#141a24]/95 backdrop-blur-md p-3 border border-white/20 text-white shadow-2xl z-30 animate-fade-up">
                          <p className="font-serif text-xs font-semibold text-amber-300 flex items-center gap-1">
                            <span>✦</span> {spot.title}
                          </p>
                          <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                            {spot.detail}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bottom Overlay Info Banner */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-mono tracking-wider uppercase text-amber-300">
                      {LENSES.find((l) => l.id === activeLens)?.badge}
                    </span>
                    <p className="font-serif text-sm font-medium mt-1">
                      {LENSES.find((l) => l.id === activeLens)?.location}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-1 rounded">
                    FPS 60 · ISO 100
                  </span>
                </div>
              </div>

              {/* Bottom Frame Status Bar */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-300 px-1">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>2 of 4 suites available for Nov intake</span>
                </div>
                <a
                  href="#chapter-5"
                  className="text-amber-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  Schedule Walkthrough <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar within 100vh: Subtle Metadata & Scroll Trigger */}
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between pt-2 pb-1 text-xs text-[#7b8494] border-t border-[#e8e2d8]/60">
          <span className="hidden sm:inline">
            Autonomous Student Housing Protocol · 2026 Edition
          </span>
          <a
            href="#chapter-2"
            className="flex items-center gap-2 hover:text-[#c8643c] transition-colors ml-auto font-medium"
          >
            <span>Scroll to Chapter 02: The Direct Protocol</span>
            <span className="animate-bounce font-bold text-[#c8643c]">↓</span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02: THE DIRECT PROTOCOL — ZERO BROKERAGE, PURE TRUST
          ========================================================================= */}
      <section id="chapter-2" className="relative border-b border-[#e8e2d8] bg-[#f5f0e8] py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Campus Architectural Image (6 cols) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-[#e2d8cb] shadow-[0_16px_40px_rgba(20,26,36,0.08)]">
                <img
                  src="/images/editorial/residence.jpg"
                  alt="Contemporary brick and timber student residential community courtyard"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e8e2d8] text-xs font-semibold text-[#141a24]">
                  ✦ 100% Verified Community Standard
                </div>
              </div>
            </div>

            {/* Principles & Metric Stat Cards (6 cols) */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e2d8cb] text-xs font-semibold text-[#2a5745] uppercase tracking-wider">
                <span>Chapter 02</span>
                <span>·</span>
                <span>The Direct Protocol</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#141a24] font-medium leading-tight">
                No middlemen. <br />
                <span className="text-[#c8643c] italic font-normal">No hidden ransoms.</span>
              </h2>

              <p className="text-base text-[#5e6676] leading-relaxed">
                Why forfeit an entire month's rent just to receive an owner's phone number? RentMate establishes a transparent, direct bridge between university students and verified property owners.
              </p>

              {/* 3 Editorial Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl bg-white p-5 border border-[#e2d8cb] shadow-sm">
                  <p className="font-serif text-4xl font-semibold text-[#c8643c]">₹0</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#141a24] mt-1.5">Brokerage Fee</p>
                  <p className="text-xs text-[#7b8494] mt-1">Direct lease with verified owners</p>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#e2d8cb] shadow-sm">
                  <p className="font-serif text-4xl font-semibold text-[#2a5745]">100%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#141a24] mt-1.5">Inspected Spaces</p>
                  <p className="text-xs text-[#7b8494] mt-1">Verified physical walkthroughs</p>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#e2d8cb] shadow-sm">
                  <p className="font-serif text-4xl font-semibold text-[#141a24]">2,400+</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#141a24] mt-1.5">Student Beds</p>
                  <p className="text-xs text-[#7b8494] mt-1">Walking distance to campuses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03: THE COMPATIBILITY LABORATORY — ROOMMATE HARMONY
          ========================================================================= */}
      <section id="chapter-3" className="relative border-b border-[#e8e2d8] bg-[#fcfaf7] py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#e8e2d8] pb-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece3] border border-[#e5d9ca] text-xs font-semibold text-[#c8643c] uppercase tracking-wider mb-2">
                <span>Chapter 03</span>
                <span>·</span>
                <span>Compatibility Laboratory</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#141a24] font-medium tracking-tight">
                Deterministic roommate harmony.
              </h2>
              <p className="mt-2 text-sm text-[#5e6676] leading-relaxed">
                A mismatched flatmate can ruin an entire academic semester. Tune your lifestyle attributes below to see our deterministic algorithm recalculate real-time compatibility scores.
              </p>
            </div>
            <Link
              to="/roommates"
              className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#141a24] hover:bg-[#252f40] transition"
            >
              All Potential Roommates →
            </Link>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Attribute Tuner Terminal (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-white p-6 border border-[#e8e2d8] shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#f0ece4] pb-3">
                  <span className="font-serif text-lg font-semibold text-[#141a24]">Lifestyle Attributes</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eff5f1] text-[11px] font-semibold text-[#2a5745] uppercase">
                    Live Engine
                  </span>
                </div>

                {/* Sleep Schedule */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6676] mb-1.5">
                    Sleep Routine
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'EARLY_BIRD', label: 'Early Bird' },
                      { id: 'FLEXIBLE', label: 'Flexible' },
                      { id: 'NIGHT_OWL', label: 'Night Owl' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleScouterChange('sleep', item.id)}
                        className={`rounded-xl py-2 text-xs font-semibold transition border ${
                          scouterSleep === item.id
                            ? 'bg-[#141a24] text-white border-[#141a24]'
                            : 'bg-[#f5f0e8] text-[#141a24] border-[#e8e2d8] hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Preference */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e6676] mb-1.5">
                    Dietary Habit
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'VEGETARIAN', label: 'Pure Veg' },
                      { id: 'EGGETARIAN', label: 'Eggetarian' },
                      { id: 'NON_VEGETARIAN', label: 'Non-Veg' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleScouterChange('food', item.id)}
                        className={`rounded-xl py-2 text-xs font-semibold transition border ${
                          scouterFood === item.id
                            ? 'bg-[#141a24] text-white border-[#141a24]'
                            : 'bg-[#f5f0e8] text-[#141a24] border-[#e8e2d8] hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-[#5e6676]">
                    <span>Target Monthly Budget</span>
                    <span className="font-serif text-base font-bold text-[#c8643c]">
                      {formatCurrency(scouterBudget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="7000"
                    max="25000"
                    step="1000"
                    value={scouterBudget}
                    onChange={(e) => handleScouterChange('budget', Number(e.target.value))}
                    className="mt-2.5 w-full accent-[#c8643c] cursor-pointer"
                  />
                </div>
              </div>

              {/* Roommates Photo Card */}
              <div className="rounded-2xl overflow-hidden border border-[#e8e2d8] shadow-sm">
                <img
                  src="/images/editorial/roommates.jpg"
                  alt="Two friendly roommates happily studying together"
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 bg-white border-t border-[#f0ece4] flex items-center justify-between text-xs text-[#5e6676]">
                  <span className="font-medium">Curated Co-Living Synergy</span>
                  <span className="font-semibold text-[#2a5745]">Verified Academic Profiles</span>
                </div>
              </div>
            </div>

            {/* Matched Roommate Profiles (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#7b8494] px-1">
                <span>Top Calculated Compatibility Matches</span>
                <span>Sorted by Weighted Harmony</span>
              </div>

              {scouterMatches.map((m) => (
                <div
                  key={m.profile.id}
                  className="rounded-2xl bg-white p-6 border border-[#e8e2d8] shadow-[0_4px_20px_rgba(20,26,36,0.03)] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#fbf2ec] text-[#c8643c] font-serif text-xl font-bold border border-[#f3ddd0]">
                      {getInitials(m.profile.name)}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-serif text-xl font-medium text-[#141a24]">{m.profile.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#eff5f1] text-[#2a5745] font-semibold text-xs border border-[#d2e4d9]">
                          {m.score}% Match
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#5e6676]">
                        {m.profile.occupation} {m.profile.institute ? `· ${m.profile.institute}` : ''}
                      </p>
                      <p className="text-xs text-[#7b8494]">
                        📍 {m.profile.city} ({m.profile.preferredLocalities.slice(0, 2).join(', ')})
                      </p>
                      <p className="text-xs text-[#5e6676] italic pt-1 line-clamp-1">
                        "{m.profile.bio}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate('/roommates')}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-[#141a24] bg-[#f5f0e8] hover:bg-[#e8e2d8] transition"
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const conv = AppStore.getOrCreateConversation({
                          id: m.profile.userId,
                          name: m.profile.name,
                          role: 'Student',
                          avatarUrl: null,
                        });
                        navigate('/messages', { state: { activeConversationId: conv.id } });
                      }}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-white bg-[#c8643c] hover:bg-[#a84c27] transition shadow-xs"
                    >
                      Message 💬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04: THE ARCHITECTURAL COLLECTION — CURATED HOMES
          ========================================================================= */}
      <section id="chapter-4" className="relative border-b border-[#e8e2d8] bg-[#f5f0e8] py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#e2d8cb] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e2d8cb] text-xs font-semibold text-[#a84c27] uppercase tracking-wider mb-2">
                <span>Chapter 04</span>
                <span>·</span>
                <span>The Architectural Portfolio</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#141a24] font-medium tracking-tight">
                Curated residential portfolio.
              </h2>
              <p className="mt-2 text-sm text-[#5e6676]">
                Each home is vetted for quiet study zones, verified power backup, water supply, and campus walking times.
              </p>
            </div>
            <Link
              to="/properties"
              className="rounded-xl px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#141a24] hover:bg-[#252f40] transition"
            >
              Browse Complete Portfolio →
            </Link>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((prop) => (
              <div key={prop.id} className="transition-transform duration-300 hover:-translate-y-1">
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 05: THE KEY HANDOVER — PRIVATE PHYSICAL WALKTHROUGHS
          ========================================================================= */}
      <section id="chapter-5" className="relative border-b border-[#e8e2d8] bg-[#fcfaf7] py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Friendly Handover Photography (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-[#e8e2d8] shadow-[0_20px_50px_rgba(20,26,36,0.08)]">
                <img
                  src="/images/editorial/keys.jpg"
                  alt="Welcoming landlord handing apartment keys to happy student tenant"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] text-xs font-semibold text-[#141a24]">
                  ✦ Direct Walkthrough Verification
                </div>
              </div>
            </div>

            {/* Instant Walkthrough Booking Terminal (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece3] border border-[#e5d9ca] text-xs font-semibold text-[#c8643c] uppercase tracking-wider">
                <span>Chapter 05</span>
                <span>·</span>
                <span>Private Walkthrough Appointment</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl text-[#141a24] font-medium tracking-tight leading-tight">
                Inspect in person. <br />
                <span className="text-[#c8643c] italic font-normal">Decide with confidence.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#5e6676] leading-relaxed">
                Never sign a lease or send a deposit sight unseen. Pick a convenient time slot to walk through the property with the verified owner, inspect the balcony, and test Wi-Fi speeds.
              </p>

              {/* Interactive Booking Module */}
              <div className="rounded-2xl bg-white p-6 border border-[#e8e2d8] shadow-md">
                {isWalkthroughBooked ? (
                  <div className="text-center py-6 space-y-3">
                    <span className="size-12 mx-auto grid place-items-center rounded-full bg-[#eff5f1] text-[#2a5745] text-xl font-bold">
                      ✓
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-[#141a24]">Walkthrough Reserved</h3>
                    <p className="text-xs text-[#5e6676]">
                      Inspection slot on {walkthroughDate} ({walkthroughSlot}) has been registered with Priya Raghavan.
                    </p>
                    <Link
                      to="/requests"
                      className="inline-block mt-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white bg-[#141a24] hover:bg-[#252f40] transition"
                    >
                      View in My Visits →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleWalkthroughSubmit} className="space-y-4">
                    <div className="border-b border-[#f0ece4] pb-2.5">
                      <p className="font-serif text-base font-semibold text-[#141a24]">
                        Schedule Walkthrough: Sunlit 2BHK Guindy
                      </p>
                      <p className="text-xs text-[#7b8494] mt-0.5">
                        Direct with Owner: Priya Raghavan · Anna University vicinity
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#5e6676] mb-1">Preferred Date</label>
                        <input
                          type="date"
                          value={walkthroughDate}
                          onChange={(e) => setWalkthroughDate(e.target.value)}
                          className="w-full rounded-xl border border-[#e8e2d8] p-2.5 text-xs bg-[#fbfaf8] focus:bg-white focus:outline-[#c8643c]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#5e6676] mb-1">Time Window</label>
                        <select
                          value={walkthroughSlot}
                          onChange={(e) => setWalkthroughSlot(e.target.value)}
                          className="w-full rounded-xl border border-[#e8e2d8] p-2.5 text-xs bg-[#fbfaf8] focus:bg-white focus:outline-[#c8643c]"
                        >
                          <option>Morning (9 AM - 12 PM)</option>
                          <option>Afternoon (1 PM - 4 PM)</option>
                          <option>Evening (5 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#c8643c] hover:bg-[#a84c27] transition shadow-sm"
                    >
                      Confirm Private Walkthrough Slot
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 06: CAMPUS ARENAS — METRO LOCALITIES
          ========================================================================= */}
      <section id="chapter-6" className="relative border-b border-[#e8e2d8] bg-[#f5f0e8] py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e2d8cb] text-xs font-semibold text-[#7b8494] uppercase tracking-wider">
            <span>Chapter 06</span>
            <span>·</span>
            <span>University Arenas</span>
          </div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#141a24] font-medium tracking-tight">
            Curated across top academic hubs.
          </h2>
          <p className="mt-2 text-sm text-[#5e6676] max-w-lg mx-auto">
            Choose your university city to explore verified residences within walking or cycling distance of your department.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { city: 'Chennai', hub: 'Anna Univ & IIT-M', count: '14 Sanctuaries' },
              { city: 'Bengaluru', hub: 'Koramangala & Tech', count: '18 Sanctuaries' },
              { city: 'Hyderabad', hub: 'HITEC & IIIT-H', count: '12 Sanctuaries' },
              { city: 'Pune', hub: 'Fergusson & FC Rd', count: '9 Sanctuaries' },
              { city: 'Mumbai', hub: 'Powai & BKC', count: '11 Sanctuaries' },
            ].map((arena) => (
              <button
                key={arena.city}
                type="button"
                onClick={() => navigate(`/properties?city=${encodeURIComponent(arena.city)}`)}
                className="rounded-2xl bg-white p-5 text-center border border-[#e2d8cb] hover:border-[#c8643c] hover:shadow-md transition-all group cursor-pointer"
              >
                <p className="font-serif text-2xl font-medium text-[#141a24] group-hover:text-[#c8643c] transition-colors">
                  {arena.city}
                </p>
                <p className="text-xs text-[#7b8494] mt-1">{arena.hub}</p>
                <p className="text-[11px] font-semibold text-[#c8643c] mt-2 bg-[#fbf2ec] rounded-full py-0.5 px-2 inline-block">
                  {arena.count}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 07: CHOOSE YOUR JOURNEY — STUDENT & OWNER SANCTUARY
          ========================================================================= */}
      <section id="chapter-7" className="relative bg-[#fcfaf7] py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece3] border border-[#e5d9ca] text-xs font-semibold text-[#c8643c] uppercase tracking-wider mb-2">
              <span>Chapter 07</span>
              <span>·</span>
              <span>Your Next Chapter</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#141a24] font-medium tracking-tight">
              Begin your housing journey.
            </h2>
            <p className="mt-2 text-sm text-[#5e6676]">
              Select your role to explore live properties, roommate compatibility matchmaking, and owner dashboards.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Student Path Card */}
            <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#e8e2d8] shadow-sm hover:shadow-md transition-all space-y-5">
              <span className="px-3 py-1 rounded-full bg-[#fbf2ec] text-[#c8643c] text-xs font-semibold tracking-wider uppercase">
                Resident Portal
              </span>
              <h3 className="font-serif text-3xl font-medium text-[#141a24]">University Student</h3>
              <p className="text-sm text-[#5e6676] leading-relaxed">
                Discover budget-friendly flats, calculate 90%+ compatibility with roommates, chat in real time, and book physical walkthroughs directly with owners.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('aditya.student@rentmate.dev')}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white bg-[#141a24] hover:bg-[#252f40] transition"
                >
                  Enter as Aditya (Student)
                </button>
                <Link
                  to="/register"
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold text-[#141a24] bg-[#f5f0e8] hover:bg-[#e8e2d8] transition"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Landlord Path Card */}
            <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#e8e2d8] shadow-sm hover:shadow-md transition-all space-y-5">
              <span className="px-3 py-1 rounded-full bg-[#eff5f1] text-[#2a5745] text-xs font-semibold tracking-wider uppercase">
                Owner Portal
              </span>
              <h3 className="font-serif text-3xl font-medium text-[#141a24]">Verified Property Owner</h3>
              <p className="text-sm text-[#5e6676] leading-relaxed">
                Publish high-res residential listings, review student inspection requests, answer questions directly via chat, and manage your full rental portfolio.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('priya.owner@rentmate.dev')}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white bg-[#c8643c] hover:bg-[#a84c27] transition"
                >
                  Enter as Priya (Owner)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin@rentmate.dev')}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold text-[#5e6676] border border-[#e8e2d8] hover:bg-[#f5f0e8] hover:text-[#141a24] transition"
                >
                  Admin Moderator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
