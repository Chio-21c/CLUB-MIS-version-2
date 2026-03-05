import { useState, lazy, Suspense, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

// Lazy load the MembershipForm component
const MembershipForm = lazy(() => import("../components/membershipform"));

// Move static data outside component to prevent recreation
const CLUBS = [
  { 
    _id: 1, 
    name: "Science Club", 
    imageUrl: "/images/science-club.png",
    description: "Explore the wonders of science through experiments and innovations",
    members: "15+ Members",
    category: "STEM"
  },
  { 
    _id: 2, 
    name: "Drama Club", 
    imageUrl: "/images/drama-club.png",
    description: "Express yourself through theater, acting, and stage performances",
    members: "12+ Members",
    category: "Performing Arts"
  },
  { 
    _id: 3, 
    name: "Sports Club", 
    imageUrl: "/images/sports-club.png",
    description: "Stay active and competitive with various sporting activities",
    members: "18+ Members",
    category: "Athletics"
  },
  { 
    _id: 4, 
    name: "Music Club", 
    imageUrl: "/images/music-club.png",
    description: "Create beautiful melodies and harmonies with fellow musicians",
    members: "15+ Members",
    category: "Performing Arts"
  },
  { 
    _id: 5, 
    name: "Art Club", 
    imageUrl: "/images/art-club.png",
    description: "Unleash your creativity through painting, drawing, and design",
    members: "13+ Members",
    category: "Creative Arts"
  },
  { 
    _id: 6, 
    name: "Debate Club", 
    imageUrl: "/images/debate-club.png",
    description: "Sharpen your argumentation and public speaking skills",
    members: "21+ Members",
    category: "Academic"
  },
  { 
    _id: 7, 
    name: "Environment Club", 
    imageUrl: "/images/environment-club.png",
    description: "Make a difference by protecting our planet and promoting sustainability",
    members: "27+ Members",
    category: "Community"
  },
  { 
    _id: 8, 
    name: "Scouts Club", 
    imageUrl: "/images/scouts-club.png",
    description: "Build character, leadership, and outdoor survival skills",
    members: "22+ Members",
    category: "Leadership"
  },
];

// Move benefits data outside component
const BENEFITS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Skill Development",
    desc: "Learn new skills and develop talents outside the regular curriculum",
    gradient: "from-cyan-500 to-purple-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Friendship & Teamwork",
    desc: "Make lifelong friends and collaborate in exciting projects",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Confidence & Growth",
    desc: "Boost confidence, leadership skills, and personal development",
    gradient: "from-pink-500 to-orange-500"
  }
];

// Animation styles as a constant - moved to CSS module would be better
const ANIMATION_STYLES = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

// Loading component for lazy-loaded form
const FormLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
    <div className="relative bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white">Loading form...</p>
      </div>
    </div>
  </div>
);

export default function StudentDashboard() {
  const [showMembershipForm, setShowMembershipForm] = useState(false);

  // Use useCallback for event handlers
  const handleOpenForm = useCallback(() => setShowMembershipForm(true), []);
  const handleCloseForm = useCallback(() => setShowMembershipForm(false), []);
  
  // Handle modal backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleCloseForm();
    }
  }, [handleCloseForm]);

  // Memoize clubs to prevent unnecessary re-renders
  const memoizedClubs = useMemo(() => CLUBS, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 font-sans text-gray-200">
      <style>{ANIMATION_STYLES}</style>
      
      {/* Fixed header with will-change for better performance */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg will-change-transform">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and School Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <span className="text-white font-bold text-lg sm:text-xl">G</span>
              </div>
              <div>
                <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-white leading-tight">
                  Gardens Estate Secondary
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">Club Membership System</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {['clubs', 'benefits', 'about', 'contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition relative group"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Admin Login Button */}
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-purple-700 transition shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Removed will-change from animated elements */}
      <section className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Animated Background - Simplified for better performance */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-linear-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 text-sm font-semibold rounded-full mb-6 border border-cyan-500/20">
              Discover Your Passion
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Explore, Learn, and{' '}
              <span className="bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Grow
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join a community of like-minded students. Develop new skills, make friends, and create unforgettable memories in our vibrant club ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOpenForm}
                className="px-8 py-4 bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transform hover:-translate-y-0.5"
              >
                Join a Club Today
              </button>
              <a
                href="#clubs"
                className="px-8 py-4 bg-gray-800/80 text-white font-semibold rounded-lg hover:bg-gray-700 transition shadow-lg border border-gray-700 backdrop-blur-sm"
              >
                Browse Clubs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Fixed gradient class */}
      <section id="about" className="py-20 sm:py-24 bg-linear-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-linear-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 text-sm font-semibold rounded-full mb-4 border border-cyan-500/20">
              About Us
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Shaping Tomorrow's{' '}
              <span className="bg-linear-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                Leaders
              </span>
            </h3>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              At Gardens Estate Secondary School, we believe in holistic education through extracurricular engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                {
                  gradient: "from-cyan-500 to-purple-600",
                  title: "Our Mission",
                  desc: "To provide a platform where students can discover and nurture their talents, build character, and develop essential life skills through diverse club activities.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  )
                },
                {
                  gradient: "from-purple-500 to-pink-600",
                  title: "Our Vision",
                  desc: "To create a vibrant community where every student finds their passion, develops leadership skills, and contributes meaningfully to society.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )
                },
                {
                  gradient: "from-pink-500 to-orange-600",
                  title: "Our Values",
                  desc: "Excellence, inclusivity, creativity, teamwork, and personal growth guide everything we do in our club programs.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm hover:border-cyan-500/50 transition group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-linear-to-r ${item.gradient} rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "8+", label: "Active Clubs", gradient: "from-cyan-400 to-purple-400" },
                { value: "90+", label: "Active Members", gradient: "from-purple-400 to-pink-400" },
                { value: "100%", label: "Satisfaction", gradient: "from-orange-400 to-cyan-400" }
              ].map((stat, idx) => (
                <div key={idx} className="p-6 bg-linear-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30 text-center backdrop-blur-sm">
                  <div className={`text-4xl font-bold bg-linear-to-r ${stat.gradient} text-transparent bg-clip-text mb-2`}>{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Showcase - Added loading="lazy" and proper image optimization */}
      <section id="clubs" className="py-20 sm:py-24 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-linear-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 text-sm font-semibold rounded-full mb-4 border border-cyan-500/20">
              Our Clubs
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Find Your{' '}
              <span className="bg-linear-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                Perfect Match
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from our diverse range of clubs designed to nurture talent and foster growth
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {memoizedClubs.map((club) => (
              <div
                key={club._id}
                className="group bg-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 border border-gray-700 hover:border-cyan-500/50 backdrop-blur-sm"
              >
                <div className="relative h-48 overflow-hidden bg-gray-700">
                  {/* Add loading="lazy" for images */}
                  <img
                    src={club.imageUrl}
                    alt={club.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-cyan-400 border border-cyan-500/30">
                    {club.members}
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-linear-to-r from-cyan-500/80 to-purple-500/80 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                    {club.category}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition">{club.name}</h4>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  <button
                    onClick={handleOpenForm}
                    className="w-full px-4 py-2 bg-linear-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-sm font-semibold rounded-lg hover:from-cyan-500 hover:to-purple-500 hover:text-white transition border border-cyan-500/30"
                  >
                    Join Club
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 sm:py-24 bg-linear-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-linear-to-r from-purple-500/10 to-pink-500/10 text-purple-400 text-sm font-semibold rounded-full mb-4 border border-purple-500/20">
              Why Join?
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Benefits of{' '}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Club Participation
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover how club participation can enhance your school experience and personal growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-all duration-300 border border-gray-700 hover:border-transparent group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-linear-to-r ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`w-14 h-14 bg-linear-to-r ${benefit.gradient} rounded-lg flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{benefit.title}</h4>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            Join a club today and discover new passions, make friends, and build skills for life.
          </p>
          <button
            onClick={handleOpenForm}
            className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.7)] transform hover:-translate-y-0.5"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-24 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-linear-to-r from-pink-500/10 to-orange-500/10 text-pink-400 text-sm font-semibold rounded-full mb-4 border border-pink-500/20">
              Contact Us
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get in{' '}
              <span className="bg-linear-to-r from-pink-400 to-orange-400 text-transparent bg-clip-text">
                Touch
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions? We're here to help you find the perfect club
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                gradient: "from-pink-500 to-orange-500",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                ),
                title: "Phone",
                value: "+254 700 000 000"
              },
              {
                gradient: "from-cyan-500 to-purple-500",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
                title: "Email",
                value: "info@gardensestate.edu"
              },
              {
                gradient: "from-purple-500 to-pink-500",
                icon: (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                ),
                title: "Location",
                value: "Gardens Estate, Nairobi"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 text-center group hover:border-pink-500/50 transition">
                <div className={`w-12 h-12 bg-linear-to-br ${item.gradient} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:scale-110 transition`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="text-white font-semibold">Gardens Estate</span>
              </div>
              <p className="text-sm text-gray-500">
                Nurturing talent, building character, and fostering community through club activities.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#clubs" className="text-gray-500 hover:text-cyan-400 transition">Our Clubs</a></li>
                <li><a href="#benefits" className="text-gray-500 hover:text-cyan-400 transition">Benefits</a></li>
                <li><a href="#about" className="text-gray-500 hover:text-cyan-400 transition">About Us</a></li>
                <li><Link to="/login" className="text-gray-500 hover:text-cyan-400 transition">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Gardens Estate, Nairobi</li>
                <li>info@gardensestate.edu</li>
                <li>+254 700 000 000</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-xl">📘</a>
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-xl">🐦</a>
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-xl">📷</a>
                <a href="#" className="text-gray-500 hover:text-cyan-400 transition text-xl">🎥</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
            <p>© 2026 Gardens Estate Secondary School | Developed by Chio. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Membership Form Modal - Lazy Loaded with improved click handling */}
      {showMembershipForm && (
        <Suspense fallback={<FormLoader />}>
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-auto"
            onClick={handleBackdropClick}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
            <div
              className="relative w-full max-w-lg mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <MembershipForm
                onClose={handleCloseForm}
                clubs={memoizedClubs}
              />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
}