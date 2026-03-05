import { useState, useEffect } from "react";
import axios from "axios";

const CLUB_API = "http://localhost:4000/api/clubs";
const MEMBERSHIP_API = "http://localhost:4000/api/memberships";

export default function MembershipForm({ onClose = () => {} }) {
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({
    admissionNo: "",
    name: "",
    className: "",
    gender: "",
    clubId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(CLUB_API);
        setClubs(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Failed to load clubs from server.");
      }
    };
    
    fetchClubs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(MEMBERSHIP_API, form);
      setSuccess(res.data.message || "Membership request submitted! Awaiting approval.");
      
      setForm({
        admissionNo: "",
        name: "",
        className: "",
        gender: "",
        clubId: "",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Membership submission error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit membership request. Check server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center p-2 xs:p-3 sm:p-4 z-50 overflow-y-auto">
      {/* Spacer for top margin on mobile */}
      <div className="w-full max-w-[95%] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl my-4 xs:my-6 sm:my-8 md:my-10 lg:my-12">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl xs:rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Responsive Header */}
          <div className="px-3 xs:px-4 sm:px-6 md:px-8 pt-5 xs:pt-6 sm:pt-7 md:pt-8 pb-1 xs:pb-2">
            <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-white leading-tight">
              Club Membership Form
            </h3>
            <p className="text-white/70 text-center text-[10px] xs:text-xs sm:text-sm md:text-base mt-0.5 xs:mt-1">
              Join your favorite club today
            </p>
          </div>

          {/* Responsive Alert Messages */}
          {error && (
            <div className="mx-3 xs:mx-4 sm:mx-6 md:mx-8 mb-2 xs:mb-3 mt-2 xs:mt-3 p-2 xs:p-2.5 sm:p-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-[10px] xs:text-xs sm:text-sm flex items-center gap-1.5 xs:gap-2">
                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1">{error}</span>
              </p>
            </div>
          )}

          {success && (
            <div className="mx-3 xs:mx-4 sm:mx-6 md:mx-8 mb-2 xs:mb-3 mt-2 xs:mt-3 p-2 xs:p-2.5 sm:p-3 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-[10px] xs:text-xs sm:text-sm flex items-center gap-1.5 xs:gap-2">
                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1">{success}</span>
              </p>
            </div>
          )}

          {/* Responsive Form Body */}
          <div className="px-3 xs:px-4 sm:px-6 md:px-8 pb-5 xs:pb-6 sm:pb-7 md:pb-8">
            <form onSubmit={handleSubmit} className="space-y-2.5 xs:space-y-3 sm:space-y-4 md:space-y-5">
              
              {/* Admission Number - Responsive */}
              <div>
                <label className="block text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium mb-0.5 xs:mb-1">
                  Admission Number <span className="text-red-300">*</span>
                </label>
                <input
                  type="text"
                  name="admissionNo"
                  value={form.admissionNo}
                  onChange={handleChange}
                  placeholder="e.g. ADM-2024-001"
                  required
                  className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2 sm:py-2.5 md:py-3 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-[10px] xs:text-xs sm:text-sm md:text-base"
                />
              </div>

              {/* Full Name - Responsive */}
              <div>
                <label className="block text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium mb-0.5 xs:mb-1">
                  Full Name <span className="text-red-300">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2 sm:py-2.5 md:py-3 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-[10px] xs:text-xs sm:text-sm md:text-base"
                />
              </div>

              {/* Class - Responsive */}
              <div>
                <label className="block text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium mb-0.5 xs:mb-1">
                  Class <span className="text-red-300">*</span>
                </label>
                <input
                  type="text"
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  placeholder="e.g. Form 2B, Grade 10"
                  required
                  className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2 sm:py-2.5 md:py-3 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-[10px] xs:text-xs sm:text-sm md:text-base"
                />
              </div>

              {/* Gender Dropdown - Responsive with fixed visibility */}
              <div>
                <label className="block text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium mb-0.5 xs:mb-1">
                  Gender <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2 sm:py-2.5 md:py-3 appearance-none bg-white/20 text-white border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-[10px] xs:text-xs sm:text-sm md:text-base cursor-pointer"
                    style={{ color: 'white' }}
                  >
                    <option value="" disabled className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base">
                      Select your gender
                    </option>
                    <option value="male" className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base">
                      Male
                    </option>
                    <option value="female" className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base">
                      Female
                    </option>
                    <option value="other" className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base">
                      Other
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 xs:px-2.5 sm:px-3 pointer-events-none">
                    <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Club Selection - Responsive with fixed visibility */}
              <div>
                <label className="block text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium mb-0.5 xs:mb-1">
                  Select Club <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <select
                    name="clubId"
                    value={form.clubId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2 sm:py-2.5 md:py-3 appearance-none bg-white/20 text-white border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-[10px] xs:text-xs sm:text-sm md:text-base cursor-pointer"
                    style={{ color: 'white' }}
                  >
                    <option value="" disabled className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base">
                      {clubs.length === 0 ? "Loading clubs..." : "Choose a club"}
                    </option>
                    {clubs.length > 0 ? (
                      clubs.map((club) => (
                        <option 
                          key={club.id || club._id} 
                          value={club.id || club._id}
                          className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base py-1 xs:py-1.5 sm:py-2"
                        >
                          {club.name}
                        </option>
                      ))
                    ) : (
                      <option disabled className="bg-gray-800 text-white text-[10px] xs:text-xs sm:text-sm md:text-base">
                        No clubs available
                      </option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 xs:px-2.5 sm:px-3 pointer-events-none">
                    <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {clubs.length === 0 && !error && (
                  <p className="text-white/50 text-[8px] xs:text-[10px] sm:text-xs mt-0.5 xs:mt-1 flex items-center gap-1">
                    <svg className="animate-spin h-2.5 w-2.5 xs:h-3 xs:w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading clubs...
                  </p>
                )}
              </div>

              {/* Responsive Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 sm:gap-3 pt-3 xs:pt-4 sm:pt-5 md:pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full xs:flex-1 bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm text-white font-semibold py-2.5 xs:py-2 sm:py-2.5 md:py-3 px-3 xs:px-3.5 sm:px-4 rounded-lg transition transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed text-[10px] xs:text-xs sm:text-sm md:text-base border border-white/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
                      <svg className="animate-spin h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="hidden xs:inline">Submitting...</span>
                      <span className="xs:hidden">...</span>
                    </span>
                  ) : (
                    <>
                      <span className="block xs:hidden">Submit</span>
                      <span className="hidden xs:block">Submit Request</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="w-full xs:flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 xs:py-2 sm:py-2.5 md:py-3 px-3 xs:px-3.5 sm:px-4 rounded-lg transition transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/30 disabled:opacity-50 text-[10px] xs:text-xs sm:text-sm md:text-base"
                >
                  <span className="block xs:hidden">Close</span>
                  <span className="hidden xs:block">Cancel</span>
                </button>
              </div>

              {/* Responsive Footer Note */}
              <p className="text-white/50 text-center text-[8px] xs:text-[10px] sm:text-xs md:text-sm mt-3 xs:mt-4 sm:mt-5">
                By submitting, you agree to the club's terms and conditions
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}