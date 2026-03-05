import { useState, useEffect } from "react";
import axios from "axios";

const MEMBERSHIP_API = "http://localhost:4000/api/memberships";
const CLUB_API = "http://localhost:4000/api/clubs";

export default function AdminApprovals() {
  const [members, setMembers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editForm, setEditForm] = useState({
    name: "",
    admissionNo: "",
    className: "",
    gender: "",
    clubId: "",
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchMembers();
    fetchClubs();
  }, []);

  const fetchMembers = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${MEMBERSHIP_API}?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const allMembers = res.data.memberships || res.data || [];
      setMembers(allMembers);
      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
      } else {
        setTotalPages(Math.ceil(allMembers.length / ITEMS_PER_PAGE));
      }
    } catch {
      setError("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const res = await axios.get(CLUB_API);
      setClubs(res.data);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    }
  };

  const approveMember = async (id) => {
    try {
      await axios.patch(`${MEMBERSHIP_API}/${id}/approve`);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id || m._id === id ? { ...m, status: "approved" } : m,
        ),
      );
    } catch {
      setError("Failed to approve member.");
    }
  };

  const rejectMember = async (id) => {
    try {
      await axios.patch(`${MEMBERSHIP_API}/${id}/reject`);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id || m._id === id ? { ...m, status: "rejected" } : m,
        ),
      );
    } catch {
      setError("Failed to reject member.");
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`${MEMBERSHIP_API}/${id}`);
      setMembers((prev) => prev.filter((m) => m.id !== id && m._id !== id));
    } catch {
      setError("Failed to delete member.");
    }
  };

  const startEdit = (member) => {
    setEditingMember(member.id || member._id);
    setEditForm({
      name: member.name,
      admissionNo: member.admissionNo,
      className: member.className,
      gender: member.gender,
      clubId: member.Club?.id || member.clubId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${MEMBERSHIP_API}/${id}`, editForm);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id || m._id === id ? { ...m, ...res.data } : m,
        ),
      );
      setEditingMember(null);
    } catch {
      setError("Failed to update member.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchMembers(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(search.toLowerCase()) ||
      member.admissionNo?.toLowerCase().includes(search.toLowerCase()) ||
      member.className?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedMembers = filteredMembers.slice(0, ITEMS_PER_PAGE);
  const clientSideTotalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Admin Approvals
            </h1>
          </div>
        </div>

        {/* Members List with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <div className="p-4 sm:p-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-2 sm:order-1">
                <div className="text-sm text-white/60">
                  Total Members: <span className="font-semibold text-orange-400">{filteredMembers.length}</span>
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 
                    focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm backdrop-blur-sm"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="approved" className="bg-slate-800">Approved</option>
                  <option value="rejected" className="bg-slate-800">Rejected</option>
                </select>
              </div>

              {/* Search */}
              <div className="w-full sm:w-64 order-1 sm:order-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent
                      placeholder-white/40 backdrop-blur-sm transition"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 backdrop-blur-lg bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

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
                          Admission No
                        </th>
                        <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Gender
                        </th>
                        <th scope="col" className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Club
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="px-4 sm:px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <div className="w-8 h-8 border-4 border-white/20 border-t-orange-400 rounded-full animate-spin"></div>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedMembers.length > 0 ? (
                        paginatedMembers.map((member) => (
                          <tr key={member.id || member._id} className="hover:bg-white/5 transition">
                            <td className="px-4 sm:px-6 py-4 text-sm text-white">
                              {editingMember === (member.id || member._id) ? (
                                <input
                                  type="text"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm"
                                />
                              ) : (
                                member.name
                              )}
                            </td>
                            <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">
                              {editingMember === (member.id || member._id) ? (
                                <input
                                  type="text"
                                  name="admissionNo"
                                  value={editForm.admissionNo}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm"
                                />
                              ) : (
                                member.admissionNo
                              )}
                            </td>
                            <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">
                              {editingMember === (member.id || member._id) ? (
                                <input
                                  type="text"
                                  name="className"
                                  value={editForm.className}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm"
                                />
                              ) : (
                                member.className
                              )}
                            </td>
                            <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">
                              {editingMember === (member.id || member._id) ? (
                                <select
                                  name="gender"
                                  value={editForm.gender}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm"
                                >
                                  <option value="" className="bg-slate-800">Select</option>
                                  <option value="male" className="bg-slate-800">Male</option>
                                  <option value="female" className="bg-slate-800">Female</option>
                                </select>
                              ) : (
                                member.gender
                              )}
                            </td>
                            <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">
                              {editingMember === (member.id || member._id) ? (
                                <select
                                  name="clubId"
                                  value={editForm.clubId}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50 text-sm"
                                >
                                  <option value="" className="bg-slate-800">Select Club</option>
                                  {clubs.map((club) => (
                                    <option key={club.id} value={club.id} className="bg-slate-800">
                                      {club.name}
                                    </option>
                                  ))}
                                </select>
                              ) : member.Club ? (
                                member.Club.name
                              ) : (
                                member.club?.name || "—"
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(member.status)}`}>
                                {member.status || "pending"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              {editingMember === (member.id || member._id) ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => saveEdit(member.id || member._id)}
                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 
                                      px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                      transform hover:scale-105 border border-blue-500/30"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingMember(null)}
                                    className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 
                                      px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                      transform hover:scale-105 border border-gray-500/30"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {member.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => approveMember(member.id || member._id)}
                                        className="bg-green-500/20 hover:bg-green-500/30 text-green-300 
                                          px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                          transform hover:scale-105 border border-green-500/30"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => rejectMember(member.id || member._id)}
                                        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 
                                          px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                          transform hover:scale-105 border border-yellow-500/30"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => startEdit(member)}
                                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 
                                      px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                      transform hover:scale-105 border border-yellow-500/30"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteMember(member.id || member._id)}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 
                                      px-3 py-1.5 rounded-lg text-xs font-medium transition 
                                      transform hover:scale-105 border border-red-500/30"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 sm:px-6 py-8 text-center text-white/40">
                            {search || statusFilter !== "all" ? "No members match your filters" : "No members found"}
                          </td>
                        </tr>
                      )}

                      {/* Mobile details rows for hidden columns */}
                      {!loading && paginatedMembers.length > 0 && (
                        <>
                          {/* Admission No and Class for small screens */}
                          <tr className="sm:hidden">
                            <td colSpan="7" className="px-4 py-2">
                              {paginatedMembers.map((member) => (
                                <div key={`mobile-details-${member.id || member._id}`} className="text-xs text-white/60 border-t border-white/10 pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                                  <div><span className="font-medium text-white/80">Admission:</span> {member.admissionNo}</div>
                                  <div><span className="font-medium text-white/80">Class:</span> {member.className}</div>
                                </div>
                              ))}
                            </td>
                          </tr>
                          
                          {/* Gender and Club for medium screens */}
                          <tr className="md:hidden sm:table-row hidden">
                            <td colSpan="7" className="px-4 py-2">
                              {paginatedMembers.map((member) => (
                                <div key={`mobile-extras-${member.id || member._id}`} className="text-xs text-white/60 border-t border-white/10 pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                                  <div><span className="font-medium text-white/80">Gender:</span> {member.gender}</div>
                                  <div><span className="font-medium text-white/80">Club:</span> {member.Club?.name || member.club?.name || "—"}</div>
                                </div>
                              ))}
                            </td>
                          </tr>
                        </>
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
                    disabled={currentPage === 1 || loading}
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
                        disabled={page === "..." || loading}
                        className={`min-w-8 sm:min-w-10 h-8 sm:h-10 rounded-lg text-sm transition ${
                          currentPage === page
                            ? "bg-linear-to-r from-orange-500 to-amber-600 text-white"
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
                    disabled={currentPage === (totalPages || clientSideTotalPages) || loading}
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
}