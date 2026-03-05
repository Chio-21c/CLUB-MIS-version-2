import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaChartBar, 
  FaUserPlus, 
  FaUserTie, 
  FaSchool, 
  FaUsers, 
  FaFileAlt, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Get username once - memoized
  const userName = useMemo(() => 
    localStorage.getItem("username") || "Admin", 
  []);

  // Check mobile size with passive event - changed to 1024 to match layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    
    // Use passive for better performance
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    // Batch all storage operations
    requestAnimationFrame(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      sessionStorage.clear();
      navigate("/login");
    });
  }, [navigate]);

  // Toggle menu handler
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Close menu handler
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoize active path check
  const isActivePath = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Mobile menu button - always show when mobile
  if (isMobile) {
    return (
      <>
        {/* Menu button - positioned below status bar */}
        <button
          onClick={toggleMenu}
          className="fixed top-14 left-4 z-50 p-2.5 bg-slate-800 text-cyan-400 rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-150"
          aria-label="Toggle menu"
        >
          <FaBars size={18} />
        </button>
        
        {/* Mobile backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
            onClick={closeMenu}
          />
        )}

        {/* Mobile sidebar */}
        <aside className={`
          fixed top-0 left-0 h-full bg-slate-900 text-gray-200 
          flex flex-col shadow-xl border-r border-slate-800 z-50
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 pt-14 /* Add padding-top to clear status bar */
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 tracking-wide">
                Club MIS
              </h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            
            {/* Close button */}
            <button
              onClick={closeMenu}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              <SidebarLink 
                to="/admin-dashboard/overview" 
                icon={<FaChartBar />}
                isActive={isActivePath("/admin-dashboard/overview")}
                onClick={closeMenu}
              >
                Dashboard Overview
              </SidebarLink>

              <SidebarLink 
                to="/admin-dashboard/register-users" 
                icon={<FaUserPlus />}
                isActive={isActivePath("/admin-dashboard/register-users")}
                onClick={closeMenu}
              >
                Register Users
              </SidebarLink>

              <SidebarLink 
                to="/admin-dashboard/patrons" 
                icon={<FaUserTie />}
                isActive={isActivePath("/admin-dashboard/patrons")}
                onClick={closeMenu}
              >
                Manage Patrons
              </SidebarLink>

              <SidebarLink 
                to="/admin-dashboard/clubs" 
                icon={<FaSchool />}
                isActive={isActivePath("/admin-dashboard/clubs")}
                onClick={closeMenu}
              >
                Manage Clubs
              </SidebarLink>

              <SidebarLink 
                to="/admin-dashboard/manage-members" 
                icon={<FaUsers />}
                isActive={isActivePath("/admin-dashboard/manage-members")}
                onClick={closeMenu}
              >
                Manage Members
              </SidebarLink>

              <SidebarLink 
                to="/admin-dashboard/reports" 
                icon={<FaFileAlt />}
                isActive={isActivePath("/admin-dashboard/reports")}
                onClick={closeMenu}
              >
                Reports
              </SidebarLink>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 truncate max-w-25">
                👤 {userName}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md
                  bg-slate-800 text-red-400
                  transition-colors duration-150
                  hover:bg-red-600 hover:text-white
                  focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <FaSignOutAlt size={14} />
                <span className="text-xs">Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className="fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 text-gray-200 
      flex flex-col shadow-xl border-r border-slate-800">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-cyan-400 tracking-wide">
          Club MIS
        </h2>
        <p className="text-xs text-gray-400">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          <SidebarLink 
            to="/admin-dashboard/overview" 
            icon={<FaChartBar />}
            isActive={isActivePath("/admin-dashboard/overview")}
          >
            Dashboard Overview
          </SidebarLink>

          <SidebarLink 
            to="/admin-dashboard/register-users" 
            icon={<FaUserPlus />}
            isActive={isActivePath("/admin-dashboard/register-users")}
          >
            Register Users
          </SidebarLink>

          <SidebarLink 
            to="/admin-dashboard/patrons" 
            icon={<FaUserTie />}
            isActive={isActivePath("/admin-dashboard/patrons")}
          >
            Manage Patrons
          </SidebarLink>

          <SidebarLink 
            to="/admin-dashboard/clubs" 
            icon={<FaSchool />}
            isActive={isActivePath("/admin-dashboard/clubs")}
          >
            Manage Clubs
          </SidebarLink>

          <SidebarLink 
            to="/admin-dashboard/manage-members" 
            icon={<FaUsers />}
            isActive={isActivePath("/admin-dashboard/manage-members")}
          >
            Manage Members
          </SidebarLink>

          <SidebarLink 
            to="/admin-dashboard/reports" 
            icon={<FaFileAlt />}
            isActive={isActivePath("/admin-dashboard/reports")}
          >
            Reports
          </SidebarLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 truncate max-w-25">
            👤 {userName}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md
              bg-slate-800 text-red-400
              transition-colors duration-150
              hover:bg-red-600 hover:text-white
              focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <FaSignOutAlt size={14} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Optimized Sidebar Link ---------- */
function SidebarLink({ to, icon, children, isActive, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-md
        transition-colors duration-150
        ${isActive 
          ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400' 
          : 'text-gray-300 hover:bg-slate-800 hover:text-white'
        }
      `}
    >
      <span className="text-base">{icon}</span>
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}