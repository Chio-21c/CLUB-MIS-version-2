import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/clubs";

const ClubRegisterForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clubs, setClubs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchClubs = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${page}&limit=${ITEMS_PER_PAGE}`);
      setClubs(res.data.clubs || res.data);
      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
      } else {
        setTotalPages(Math.ceil((res.data.length || res.data.length) / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error("Error fetching clubs", err);
      setFormError("Failed to load clubs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadClubs = async () => {
      await fetchClubs(1);
    };
    loadClubs();
  }, []);

  const validateForm = () => {
    if (!name.trim()) return "Club name is required";
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
        await axios.put(`${API_URL}/${editingId}`, { name, description });
        alert("Club updated successfully");
      } else {
        await axios.post(API_URL, { name, description });
        alert("Club created successfully");
      }
      resetForm();
      closeModal();
      fetchClubs(currentPage);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to save club");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Club deleted successfully");
      const newTotal = clubs.length - 1;
      if (newTotal === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        await fetchClubs(currentPage - 1);
      } else {
        await fetchClubs(currentPage);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete club");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (club) => {
    setEditingId(club.id);
    setName(club.name);
    setDescription(club.description || "");
    setIsModalOpen(true);
    setFormError("");
  };

  const resetForm = () => {
    setName("");
    setDescription("");
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
    fetchClubs(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredClubs = clubs.filter(
    (club) =>
      club.name?.toLowerCase().includes(search.toLowerCase()) ||
      club.description?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedClubs = filteredClubs.slice(0, ITEMS_PER_PAGE);
  const clientSideTotalPages = Math.ceil(filteredClubs.length / ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const total = totalPages || clientSideTotalPages;
    const delta = window.innerWidth < 640 ? 1 : 2;
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Club Management
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
              className="hidden sm:flex items-center gap-2 bg-linear-to-r from-emerald-500 to-cyan-600 
                hover:from-emerald-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl 
                font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all 
                transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Club
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-white/10">
              <button
                onClick={openModal}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-cyan-600 
                  hover:from-emerald-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl 
                  font-semibold shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Club
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
                    {editingId ? "Edit Club" : "Add New Club"}
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
                      Club Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                        focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent
                        placeholder-white/40 backdrop-blur-sm transition"
                      placeholder="Enter club name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                        focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent
                        placeholder-white/40 backdrop-blur-sm transition resize-none"
                      placeholder="Enter club description (optional)"
                      disabled={isLoading}
                    />
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
                      className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-600 
                        hover:from-emerald-600 hover:to-cyan-700 text-white font-medium 
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

        {/* Clubs List with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <div className="p-4 sm:p-6">
            {/* Search and Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="text-sm text-white/60 order-2 sm:order-1">
                Total Clubs: <span className="font-semibold text-emerald-400">{filteredClubs.length}</span>
              </div>
              <div className="w-full sm:w-64 order-1 sm:order-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent
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
                        <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {isLoading ? (
                        <tr>
                          <td colSpan="3" className="px-4 sm:px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <div className="w-8 h-8 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin"></div>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedClubs.length > 0 ? (
                        paginatedClubs.map((club) => (
                          <tr key={club.id} className="hover:bg-white/5 transition">
                            <td className="px-4 sm:px-6 py-4 text-sm text-white font-medium">{club.name}</td>
                            <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">
                              {club.description || (
                                <span className="text-white/40 italic">No description</span>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => handleEdit(club)}
                                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 
                                    px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                    transform hover:scale-105 border border-yellow-500/30"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(club.id)}
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
                          <td colSpan="3" className="px-4 sm:px-6 py-8 text-center text-white/40">
                            {search ? "No clubs match your search" : "No clubs found"}
                          </td>
                        </tr>
                      )}

                      {/* Mobile description row for small screens */}
                      {!isLoading && paginatedClubs.length > 0 && (
                        <tr className="sm:hidden">
                          <td colSpan="3" className="px-4 py-2">
                            {paginatedClubs.map((club) => (
                              <div key={`mobile-desc-${club.id}`} className="text-xs text-white/60 border-t border-white/10 pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                                <span className="font-medium text-white/80">Description: </span>
                                {club.description || (
                                  <span className="text-white/40 italic">No description</span>
                                )}
                              </div>
                            ))}
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
                            ? "bg-linear-to-r from-emerald-500 to-cyan-600 text-white"
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

export default ClubRegisterForm;