import { useState, useEffect } from "react";

export default function AdminReports() {
  const [membersPerClub, setMembersPerClub] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [activeTab, setActiveTab] = useState("club-summary");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchReports = async () => {
      setLoading(true);
      try {
        const [clubRes, membersRes, patronsRes] = await Promise.all([
          fetch("http://localhost:4000/api/reports/members-per-club", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:4000/api/reports/all-members", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:4000/api/patrons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const clubData = await clubRes.json();
        const membersData = await membersRes.json();
        const patronsData = await patronsRes.json();

        if (clubRes.ok) setMembersPerClub(Array.isArray(clubData) ? clubData : []);
        else setError(clubData.message || "Failed to load club report");

        if (membersRes.ok) setAllMembers(Array.isArray(membersData) ? membersData : []);
        else setError(membersData.message || "Failed to load members report");

        if (patronsRes.ok) setPatrons(Array.isArray(patronsData) ? patronsData : []);
        else setError("Failed to load patrons data");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const patronMap = patrons.reduce((acc, patron) => {
    if (patron.clubId) acc[patron.clubId] = patron.name;
    return acc;
  }, {});

  const filteredMembers = allMembers.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.className?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClub = selectedClub === "" || m.Club?.name === selectedClub;

    return matchesSearch && matchesClub;
  });

  const downloadCSV = (data, filename) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const getUniqueClubs = () => {
    return [...new Set(allMembers.map((m) => m.Club?.name))].filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with glassmorphism */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Reports
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 backdrop-blur-lg bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab("club-summary")}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all backdrop-blur-lg border ${
              activeTab === "club-summary"
                ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg"
                : "bg-white/5 text-white/70 hover:text-white border-white/10 hover:bg-white/10"
            }`}
          >
            Club Summary
          </button>
          <button
            onClick={() => setActiveTab("member-details")}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all backdrop-blur-lg border ${
              activeTab === "member-details"
                ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg"
                : "bg-white/5 text-white/70 hover:text-white border-white/10 hover:bg-white/10"
            }`}
          >
            Member Details
          </button>
        </div>

        {loading ? (
          <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-xl p-12">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Club Summary Tab */}
            {activeTab === "club-summary" && (
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-indigo-400 to-purple-400 rounded-full"></span>
                      Members per Club
                    </h2>
                    <button
                      onClick={() => {
                        const csvData = membersPerClub.map((row) => ({
                          clubName: row.clubName,
                          clubId: row.clubId,
                          totalMembers: row.totalMembers,
                          patronName: patronMap[row.clubId] || "N/A",
                        }));
                        downloadCSV(csvData, "members-per-club.csv");
                      }}
                      disabled={membersPerClub.length === 0}
                      className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 
                        hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg 
                        transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-white/10 rounded-xl">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead className="bg-white/5">
                            <tr>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Club Name
                              </th>
                              <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Club ID
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Members
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Patron
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {membersPerClub.length > 0 ? (
                              membersPerClub.map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition">
                                  <td className="px-4 sm:px-6 py-4 text-sm text-white">{row.clubName}</td>
                                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-white/60 font-mono">{row.clubId}</td>
                                  <td className="px-4 sm:px-6 py-4 text-sm">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                      {row.totalMembers}
                                    </span>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-white/80">
                                    {patronMap[row.clubId] || (
                                      <span className="text-white/40 italic">No patron</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="px-4 sm:px-6 py-8 text-center text-white/40">
                                  No club data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Mobile club IDs */}
                  {membersPerClub.length > 0 && (
                    <div className="sm:hidden mt-4 space-y-2">
                      {membersPerClub.map((row, i) => (
                        <div key={`mobile-${i}`} className="text-xs text-white/60 bg-white/5 p-2 rounded-lg">
                          <span className="font-medium text-white/80">Club ID:</span> {row.clubId}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Member Details Tab */}
            {activeTab === "member-details" && (
              <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-indigo-400 to-purple-400 rounded-full"></span>
                      All Members with Clubs
                    </h2>
                    <button
                      onClick={() => downloadCSV(filteredMembers, "filtered-members.csv")}
                      disabled={filteredMembers.length === 0}
                      className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 
                        hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg 
                        transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download CSV
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, admission no, or class"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 text-white border border-white/20 
                          focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent
                          placeholder-white/40 backdrop-blur-sm transition"
                      />
                      <svg className="absolute left-3 top-3.5 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <select
                      value={selectedClub}
                      onChange={(e) => setSelectedClub(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                        focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent
                        backdrop-blur-sm transition appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option value="" className="bg-slate-800">All Clubs</option>
                      {getUniqueClubs().map((club, i) => (
                        <option key={i} value={club} className="bg-slate-800">
                          {club}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="backdrop-blur-lg bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                      <span className="text-xs text-white/60">Total Members</span>
                      <p className="text-xl font-semibold text-white">{filteredMembers.length}</p>
                    </div>
                    <div className="backdrop-blur-lg bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                      <span className="text-xs text-white/60">Active Clubs</span>
                      <p className="text-xl font-semibold text-white">{getUniqueClubs().length}</p>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-white/10 rounded-xl">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead className="bg-white/5">
                            <tr>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Adm No
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Class
                              </th>
                              <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Gender
                              </th>
                              <th scope="col" className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Club
                              </th>
                              <th scope="col" className="hidden xl:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                                Club ID
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {filteredMembers.length > 0 ? (
                              filteredMembers.map((m, i) => (
                                <tr key={i} className="hover:bg-white/5 transition">
                                  <td className="px-4 sm:px-6 py-4 text-sm text-white/80 font-mono">{m.admissionNo}</td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-white">{m.name}</td>
                                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">{m.className}</td>
                                  <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-white/80 capitalize">{m.gender}</td>
                                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                      m.status === 'approved' 
                                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                        : m.status === 'rejected'
                                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                    }`}>
                                      {m.status}
                                    </span>
                                  </td>
                                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-white/80">{m.Club?.name}</td>
                                  <td className="hidden xl:table-cell px-4 sm:px-6 py-4 text-sm text-white/60 font-mono">{m.Club?.id}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="px-4 sm:px-6 py-8 text-center text-white/40">
                                  No matching records found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Mobile details for hidden columns */}
                  {filteredMembers.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {/* Class and Gender for small screens */}
                      <div className="sm:hidden space-y-2">
                        {filteredMembers.map((m, i) => (
                          <div key={`mobile-${i}`} className="text-xs bg-white/5 p-2 rounded-lg">
                            <div><span className="font-medium text-white/80">Class:</span> {m.className}</div>
                            <div><span className="font-medium text-white/80">Gender:</span> {m.gender}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Status and Club for medium screens */}
                      <div className="hidden sm:block md:hidden space-y-2">
                        {filteredMembers.map((m, i) => (
                          <div key={`mobile2-${i}`} className="text-xs bg-white/5 p-2 rounded-lg">
                            <div><span className="font-medium text-white/80">Status:</span> {m.status}</div>
                            <div><span className="font-medium text-white/80">Club:</span> {m.Club?.name}</div>
                          </div>
                        ))}
                      </div>

                      {/* Club ID for large screens */}
                      <div className="hidden lg:block xl:hidden space-y-2">
                        {filteredMembers.map((m, i) => (
                          <div key={`mobile3-${i}`} className="text-xs bg-white/5 p-2 rounded-lg">
                            <div><span className="font-medium text-white/80">Club ID:</span> {m.Club?.id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
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