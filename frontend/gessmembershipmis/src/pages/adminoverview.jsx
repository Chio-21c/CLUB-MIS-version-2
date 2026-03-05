import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalMembers: 0,
    totalPatrons: 0,
    membersPerClub: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Handle window resize for responsive charts
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:4000/api/dashboard/overview",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();

        if (res.ok) {
          setStats({
            totalClubs: data.totalClubs || 0,
            totalMembers: data.totalMembers || 0,
            totalPatrons: data.totalPatrons || 0,
            membersPerClub: data.membersPerClub || [],
          });
        } else {
          setError(data.error || "Failed to load dashboard stats");
        }
      } catch {
        setError("Unable to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Professional color palette for dark theme with glass effects
  const colors = {
    primary: {
      main: "#38bdf8",
      light: "#7dd3fc",
      dark: "#0ea5e9",
      bg: "rgba(56, 189, 248, 0.15)",
      glass: "rgba(56, 189, 248, 0.1)"
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
      bg: "rgba(34, 197, 94, 0.15)",
      glass: "rgba(34, 197, 94, 0.1)"
    },
    warning: {
      main: "#f97316",
      light: "#fb923c",
      dark: "#ea580c",
      bg: "rgba(249, 115, 22, 0.15)",
      glass: "rgba(249, 115, 22, 0.1)"
    },
    purple: {
      main: "#a855f7",
      light: "#c084fc",
      dark: "#7e22ce",
      bg: "rgba(168, 85, 247, 0.15)"
    },
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    }
  };

  // Calculate max members for Y-axis scaling
  const maxMembers = Math.max(...stats.membersPerClub.map(c => c.totalMembers), 0);
  const yAxisMax = Math.max(30, Math.ceil(maxMembers / 5) * 5);

  // Responsive chart options
  const getBarOptions = () => {
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;
    
    return {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        legend: { display: false },
        tooltip: {
          ...chartDefaults.plugins.tooltip,
          callbacks: {
            label: function(context) {
              return `${context.raw} members`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { 
            color: colors.neutral[400],
            font: { 
              size: isMobile ? 9 : (isTablet ? 10 : 11),
              family: "'Inter', system-ui, -apple-system, sans-serif",
              weight: "500"
            },
            maxRotation: isMobile ? 45 : 35,
            minRotation: isMobile ? 45 : 35,
            maxTicksLimit: isMobile ? 5 : undefined
          },
          border: { color: colors.neutral[700] }
        },
        y: {
          beginAtZero: true,
          max: yAxisMax,
          grid: { color: colors.neutral[700] },
          ticks: { 
            stepSize: isMobile ? 10 : 5,
            color: colors.neutral[400],
            font: { 
              size: isMobile ? 9 : (isTablet ? 10 : 11),
              family: "'Inter', system-ui, -apple-system, sans-serif",
              weight: "500"
            },
            maxTicksLimit: isMobile ? 5 : 8
          },
          title: {
            display: !isMobile,
            text: 'Number of Members',
            color: colors.neutral[500],
            font: { size: 11 }
          }
        }
      }
    };
  };

  const getPieOptions = () => {
    const isMobile = windowWidth < 640;
    
    return {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        legend: {
          ...chartDefaults.plugins.legend,
          position: isMobile ? 'bottom' : 'bottom',
          labels: {
            ...chartDefaults.plugins.legend.labels,
            font: { 
              size: isMobile ? 10 : 12,
              family: "'Inter', system-ui, -apple-system, sans-serif",
              weight: "500"
            },
            boxWidth: isMobile ? 10 : 12,
            padding: isMobile ? 8 : 16
          }
        },
        tooltip: {
          ...chartDefaults.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  };

  // Chart configurations
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.neutral[300],
          font: { 
            size: 12, 
            family: "'Inter', system-ui, -apple-system, sans-serif",
            weight: "500"
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        },
        position: 'bottom',
        align: 'center'
      },
      tooltip: {
        backgroundColor: colors.neutral[800] + 'CC',
        titleColor: colors.neutral[100],
        bodyColor: colors.neutral[300],
        borderColor: colors.neutral[700],
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        backdropColor: colors.neutral[900] + '99'
      }
    }
  };

  const pieData = {
    labels: ["Clubs", "Members", "Patrons"],
    datasets: [
      {
        data: [stats.totalClubs, stats.totalMembers, stats.totalPatrons],
        backgroundColor: [
          colors.primary.main,
          colors.success.main,
          colors.warning.main,
        ],
        borderColor: colors.neutral[800],
        borderWidth: windowWidth < 640 ? 2 : 3,
        hoverOffset: 8
      },
    ],
  };

  const barData = {
    labels: stats.membersPerClub.map((c) => c.clubName),
    datasets: [
      {
        label: "Members",
        data: stats.membersPerClub.map((c) => c.totalMembers),
        backgroundColor: colors.primary.main,
        borderRadius: windowWidth < 640 ? 4 : 6,
        barPercentage: windowWidth < 640 ? 0.5 : 0.6,
        categoryPercentage: windowWidth < 640 ? 0.6 : 0.7,
        borderColor: colors.neutral[800],
        borderWidth: 1
      },
    ],
  };

  const StatCard = ({ title, value, color, icon, delay, trend = "+0%" }) => {
    const trendIsPositive = trend.startsWith('+');
    
    return (
      <div
        className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 
          border border-white/10 p-4 sm:p-5 md:p-6 transition-all duration-500 
          hover:scale-[1.02] sm:hover:scale-105 hover:border-white/20 hover:shadow-2xl"
        style={{ animation: `fadeInUp 0.5s ease-out ${delay}s both` }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/5 to-white/0 opacity-0 
          group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm font-medium text-white/40 uppercase tracking-wider">
              {title}
            </h3>
            <div 
              className="p-1.5 sm:p-2 md:p-2.5 rounded-xl backdrop-blur-md"
              style={{ backgroundColor: color + '20' }}
            >
              <span className="text-base sm:text-lg" style={{ color: color }}>{icon}</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p 
                className="text-2xl sm:text-3xl font-bold mb-1"
                style={{ color: color }}
              >
                {loading ? (
                  <span className="inline-block w-12 sm:w-16 h-6 sm:h-8 bg-white/10 rounded animate-pulse" />
                ) : (
                  new Intl.NumberFormat('en-US').format(value)
                )}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-white/30">
                  {loading ? 'Loading...' : 'Live'}
                </p>
              </div>
            </div>
            
            {trend && !loading && (
              <div className={`flex items-center space-x-1 text-xs ${
                trendIsPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                <span>{trend}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={trendIsPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <div 
            className="h-full transition-all duration-1000 rounded-full"
            style={{ 
              width: loading ? '0%' : '100%', 
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`
            }}
          />
        </div>
      </div>
    );
  };

  const ChartCard = ({ title, children, className = "", subtitle, action }) => {
    const isMobile = windowWidth < 640;
    
    return (
      <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 
        border border-white/10 p-4 sm:p-5 md:p-6 transition-all duration-500 
        hover:border-white/20 hover:shadow-2xl ${className}`}>
        
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {title}
              </h3>
              {subtitle && !isMobile && (
                <p className="text-xs sm:text-sm text-white/40 mt-1">{subtitle}</p>
              )}
            </div>
            {action && (
              <div className="flex items-center space-x-2">
                {action}
              </div>
            )}
          </div>
          
          <div className="h-50 sm:h-62.5 md:h-75">
            {children}
          </div>

          {!isMobile && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/30">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Updated just now
                </span>
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1" />
                  Real-time data
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8 rounded-lg">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-purple-400 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-white/60 animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8 rounded-lg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-purple-500 
                flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-xs sm:text-sm text-white/40 mt-1">
                  Real-time statistics and insights
                </p>
              </div>
            </div>
          </div>
          
          {/* Timeframe selector */}
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 
            rounded-xl border border-white/10 self-start sm:self-auto">
            {['day', 'week', 'month'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all capitalize
                  ${selectedTimeframe === timeframe 
                    ? 'bg-linear-to-r from-cyan-500 to-purple-600 text-white shadow-lg' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                {timeframe}
              </button>
            ))}
            <span className="w-px h-4 bg-white/10 mx-1" />
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-xs sm:text-sm text-white/40">Live</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 sm:p-4 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 flex items-center text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="wrap-break-word">{error}</span>
            </p>
          </div>
        )}
      </div>

      {/* Stat Cards - Responsive grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <StatCard 
          title="Total Clubs" 
          value={stats.totalClubs} 
          color={colors.primary.main}
          icon="🏛️"
          delay={0}
          trend="+2.5%"
        />
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          color={colors.success.main}
          icon="👥"
          delay={0.1}
          trend="+12.3%"
        />
        <StatCard 
          title="Total Patrons" 
          value={stats.totalPatrons} 
          color={colors.warning.main}
          icon="⭐"
          delay={0.2}
          trend="+0%"
        />
      </div>

      {/* Charts Section - Responsive grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard 
          title="Members per Club" 
          subtitle={`Scale: 0-${yAxisMax} • Max: ${maxMembers}`}
          action={
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          }
        >
          {stats.membersPerClub.length > 0 ? (
            <Bar data={barData} options={getBarOptions()} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-3">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">No club data available</p>
            </div>
          )}
        </ChartCard>

        <ChartCard 
          title="Distribution Overview"
          action={
            <div className="flex items-center space-x-1 text-xs text-white/40">
              <span>Total: {stats.totalClubs + stats.totalMembers + stats.totalPatrons}</span>
            </div>
          }
        >
          <Pie data={pieData} options={getPieOptions()} />
        </ChartCard>
      </div>

      {/* Summary Footer - Responsive grid */}
      {stats.membersPerClub.length > 0 && (
        <div className="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 
            transition-all duration-300 hover:border-white/20 hover:shadow-xl">
            <p className="text-xs text-white/40">Average</p>
            <p className="text-base sm:text-xl font-semibold text-cyan-400 mt-1">
              {(stats.totalMembers / stats.totalClubs).toFixed(1)}
            </p>
            <p className="text-[10px] text-white/20 mt-1">per club</p>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 
            transition-all duration-300 hover:border-white/20 hover:shadow-xl">
            <p className="text-xs text-white/40">Peak</p>
            <p className="text-base sm:text-xl font-semibold text-green-400 mt-1">
              {maxMembers}
            </p>
            <p className="text-[10px] text-white/20 mt-1">highest count</p>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 
            transition-all duration-300 hover:border-white/20 hover:shadow-xl col-span-2 lg:col-span-1">
            <p className="text-xs text-white/40">Most active</p>
            <p className="text-xs sm:text-sm font-semibold text-orange-400 mt-1 truncate">
              {stats.membersPerClub.reduce((max, club) => 
                club.totalMembers > max.totalMembers ? club : max
              ).clubName}
            </p>
            <p className="text-[10px] text-white/20 mt-1">club</p>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 
            transition-all duration-300 hover:border-white/20 hover:shadow-xl">
            <p className="text-xs text-white/40">Active</p>
            <p className="text-base sm:text-xl font-semibold text-blue-400 mt-1">
              {stats.membersPerClub.length}
            </p>
            <p className="text-[10px] text-white/20 mt-1">clubs with members</p>
          </div>
        </div>
      )}

      <style jsx>{`
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}