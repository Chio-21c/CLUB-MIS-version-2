import React, { useState, useEffect } from "react";
import axios from "axios";

const CLUB_API = "http://localhost:4000/api/clubs";
const PATRON_API = "http://localhost:4000/api/patrons";

const PatronRegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clubId, setClubId] = useState("");
  const [clubs, setClubs] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchPatrons = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${PATRON_API}?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setPatrons(res.data.patrons || res.data);
      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
      } else {
        setTotalPages(Math.ceil((res.data.length || res.data.length) / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error("Error fetching patrons:", err);
      setFormError("Failed to load patrons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [clubsRes] = await Promise.all([
          axios.get(CLUB_API),
        ]);
        setClubs(clubsRes.data);
        await fetchPatrons(1);
      } catch (err) {
        console.error("Error loading clubs or patrons", err);
        setFormError("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
    if (!clubId) return "Please select a club";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      if (editingId) {
        await axios.put(`${PATRON_API}/${editingId}`, { name, email, clubId });
        alert("Patron updated successfully");
      } else {
        await axios.post(PATRON_API, { name, email, clubId });
        alert("Patron created successfully");
      }
      resetForm();
      closeModal();
      fetchPatrons(currentPage);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Error saving patron");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patron?")) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`${PATRON_API}/${id}`);
      alert("Patron deleted successfully");
      const newTotal = patrons.length - 1;
      if (newTotal === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        await fetchPatrons(currentPage - 1);
      } else {
        await fetchPatrons(currentPage);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting patron");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (patron) => {
    setEditingId(patron.id);
    setName(patron.name);
    setEmail(patron.email);
    setClubId(patron.clubId);
    setIsModalOpen(true);
    setFormError("");
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setClubId("");
    setEditingId(null);
    setFormError("");
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPatrons(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredPatrons = patrons.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedPatrons = filteredPatrons.slice(0, ITEMS_PER_PAGE);
  const clientSideTotalPages = Math.ceil(filteredPatrons.length / ITEMS_PER_PAGE);

  // Responsive pagination: show fewer page numbers on mobile
  const getPageNumbers = () => {
    const total = totalPages || clientSideTotalPages;
    const delta = window.innerWidth < 640 ? 1 : 2; // Show fewer pages on mobile
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Patron Management
              </h1>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden backdrop-blur-lg bg-white/10 p-2 rounded-lg border border-white/20"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop add button */}
            <button
              onClick={openModal}
              className="hidden sm:flex items-center gap-2 bg-linear-to-r from-cyan-500 to-purple-600 
                hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl 
                font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all 
                transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Patron
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-white/10">
              <button
                onClick={openModal}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-purple-600 
                  hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl 
                  font-semibold shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Patron
              </button>
            </div>
          )}
        </div>

        {/* Glassmorphism Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            {/* Backdrop with blur */}
            <div 
              className="absolute inset-0 backdrop-blur-md bg-black/30"
              onClick={closeModal}
            ></div>
            
            {/* Modal content with glassmorphism */}
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    {editingId ? "Edit Patron" : "Add New Patron"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-white/60 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 p-3 backdrop-blur-lg bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                        focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent
                        placeholder-white/40 backdrop-blur-sm transition"
                      placeholder="Enter patron name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                        focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent
                        placeholder-white/40 backdrop-blur-sm transition"
                      placeholder="patron@example.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Select Club *
                    </label>
                    <select
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                        focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent
                        backdrop-blur-sm transition appearance-none"
                      disabled={isLoading}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option value="" className="bg-slate-800">Choose a club</option>
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id} className="bg-slate-800">
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 
                        text-white font-medium transition backdrop-blur-sm border border-white/20"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 
                        hover:from-cyan-600 hover:to-purple-700 text-white font-medium 
                        transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        editingId ? "Update" : "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Patrons List with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <div className="p-4 sm:p-6">
            {/* Search and Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="text-sm text-white/60 order-2 sm:order-1">
                Total Patrons: <span className="font-semibold text-cyan-400">{filteredPatrons.length}</span>
              </div>
              <div className="w-full sm:w-64 order-1 sm:order-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patrons..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent
                      placeholder-white/40 backdrop-blur-sm transition"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table - Responsive */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-white/10 sm:rounded-xl">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Club
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {isLoading ? (
                        <tr>
                          <td colSpan="4" className="px-4 sm:px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <div className="w-8 h-8 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedPatrons.length > 0 ? (
                        paginatedPatrons.map((patron) => (
                          <tr key={patron.id} className="hover:bg-white/5 transition">
                            <td className="px-4 sm:px-6 py-4 text-sm text-white">{patron.name}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-white/80">{patron.email}</td>
                            <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">
                              {patron.Club?.name || "—"}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => handleEdit(patron)}
                                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 
                                    px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                    transform hover:scale-105 border border-yellow-500/30"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(patron.id)}
                                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 
                                    px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                    transform hover:scale-105 border border-red-500/30"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 sm:px-6 py-8 text-center text-white/40">
                            No patrons found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination - Responsive */}
            {(totalPages > 1 || clientSideTotalPages > 1) && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="text-sm text-white/40 order-2 sm:order-1">
                  Showing page {currentPage} of {totalPages || clientSideTotalPages}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 
                      disabled:cursor-not-allowed transition border border-white/10"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex gap-1">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                        disabled={page === "..." || isLoading}
                        className={`min-w-8 sm:min-w-10 h-8 sm:h-10 rounded-lg text-sm transition ${
                          currentPage === page
                            ? "bg-linear-to-r from-cyan-500 to-purple-600 text-white"
                            : page === "..."
                            ? "text-white/40 cursor-default"
                            : "bg-white/10 hover:bg-white/20 text-white/80"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === (totalPages || clientSideTotalPages) || isLoading}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 
                      disabled:cursor-not-allowed transition border border-white/10"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default PatronRegisterForm;