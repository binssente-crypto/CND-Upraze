import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Database, TrendingUp, Search, Filter, ShieldCheck, AlertTriangle, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
   const [users, setUsers] = useState([]);
   const [stats, setStats] = useState({ total_revenue: '0.00', active_clients: 0 });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const usersPerPage = 10;
   const [currentRole, setCurrentRole] = useState('user');

   // Custom Notification State
   const [notification, setNotification] = useState(null);
   const [confirmConfig, setConfirmConfig] = useState(null);

   useEffect(() => {
      fetchData();
      const interval = setInterval(fetchData, 10000); // Live poll every 10 seconds
      return () => clearInterval(interval);
   }, []);

   const showNotification = (message, type = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
   };

   const fetchData = async () => {
      try {
         const res = await fetch(`${API_URL}/admin/users`, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
               'Accept': 'application/json'
            }
         });
         const data = await res.json();
         if (res.ok) {
            setUsers(data.users || []);
            setStats(data.stats || { total_revenue: '0.00', active_clients: 0 });
            setCurrentRole(data.current_user_role || 'user');
         } else {
            setError(data.error || data.message || 'Identity Fetch Failure');
         }
      } catch (e) {
         console.error(e);
         setError(e.message);
      } finally {
         setLoading(false);
      }
   };

   const handleRoleUpdate = async (userId, newRole) => {
      setConfirmConfig({
         title: 'Confirm Role Change',
         message: `Are you sure you want to promote/demote this user to ${newRole}?`,
         onConfirm: async () => {
            try {
               const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                  method: 'PATCH',
                  headers: {
                     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                     'Content-Type': 'application/json',
                     'Accept': 'application/json'
                  },
                  body: JSON.stringify({ role: newRole })
               });

               if (res.ok) {
                  fetchData();
                  showNotification(`User role successfully updated to ${newRole}`);
               } else {
                  const data = await res.json();
                  showNotification(data.message || 'Role update failed', 'error');
               }
            } catch (e) {
               showNotification(e.message, 'error');
            }
            setConfirmConfig(null);
         }
      });
   };

   const handleStatusUpdate = async (userId, newStatus) => {
      setConfirmConfig({
         title: newStatus === 'suspended' ? 'Suspend Account' : 'Activate Account',
         message: `Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this user's access?`,
         onConfirm: async () => {
            try {
               const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                  method: 'PATCH',
                  headers: {
                     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                     'Content-Type': 'application/json',
                     'Accept': 'application/json'
                  },
                  body: JSON.stringify({ status: newStatus })
               });

               if (res.ok) {
                  fetchData();
                  showNotification(`User account is now ${newStatus}`);
               } else {
                  const data = await res.json();
                  showNotification(data.message || 'Status update failed', 'error');
               }
            } catch (e) {
               showNotification(e.message, 'error');
            }
            setConfirmConfig(null);
         }
      });
   };

   const filteredUsers = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   useEffect(() => {
      setCurrentPage(1);
   }, [searchTerm]);

   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
   const startIndex = (currentPage - 1) * usersPerPage;
   const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

   return (
      <div className="space-y-6">

         {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
               <AlertTriangle className="w-5 h-5 flex-shrink-0" />
               <div>
                  <p className="font-bold">System Error</p>
                  <p className="opacity-80">{error}</p>
               </div>
            </div>
         )}

         {/* Search & Filter Actions */}
         <div className="flex justify-end mb-4">
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                     type="text"
                     className="input-field pl-10 py-2 h-10 text-sm"
                     placeholder="Search name or email..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button className="p-2 border border-dark-border bg-[#0A0A0A] rounded-lg text-gray-400 hover:text-white transition-colors"><Filter className="w-5 h-5" /></button>
            </div>
         </div>

         {/* User Management Table */}
         <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto min-h-[300px]">
               {loading ? (
                  <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                     <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                     <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Loading Users...</p>
                  </div>
               ) : (
                  <table className="w-full text-left">
                     <thead className="bg-white/5 text-xs text-gray-500 uppercase font-bold tracking-widest">
                        <tr>
                           <th className="px-8 py-4">User</th>
                           <th className="px-8 py-4">Role</th>
                           <th className="px-8 py-4">Company</th>
                           <th className="px-8 py-4">Plan</th>
                           <th className="px-8 py-4">Status</th>
                           <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-dark-border">
                        {paginatedUsers.map((user) => (
                           <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-8 py-6">
                                 <p className="font-medium text-white">{user.name}</p>
                                 <p className="text-xs text-gray-500">{user.email}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    }`}>
                                    {user.role}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="px-2 py-1 bg-white/5 border border-dark-border rounded text-xs text-gray-400">
                                    {['admin', 'superadmin'].includes(user.role) ? 'CND Upraze' : (user.company || 'N/A')}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="px-2 py-1 bg-white/5 border border-dark-border rounded text-xs text-gray-400">{user.plan}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.account_status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                    <span className={`text-sm ${user.account_status === 'active' ? 'text-gray-300' : 'text-red-400 font-bold'}`}>
                                       {user.account_status === 'active' ? user.status : 'Suspended'}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right space-x-3">
                                 {currentRole === 'superadmin' && (
                                    <>
                                       {user.role === 'user' ? (
                                          <button
                                             onClick={() => handleRoleUpdate(user.id, 'admin')}
                                             className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
                                          >
                                             Promote
                                          </button>
                                       ) : (
                                          <button
                                             onClick={() => handleRoleUpdate(user.id, 'user')}
                                             className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                                          >
                                             Demote
                                          </button>
                                       )}
                                    </>
                                 )}
                                 <button
                                    onClick={() => handleStatusUpdate(user.id, user.account_status === 'active' ? 'suspended' : 'active')}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                      user.account_status === 'active' ? 'text-red-500 hover:text-red-400' : 'text-emerald-500 hover:text-emerald-400'
                                    }`}
                                 >
                                    {user.account_status === 'active' ? 'Suspend' : 'Activate'}
                                 </button>
                              </td>
                           </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                           <tr>
                              <td colSpan="6" className="px-8 py-12 text-center text-gray-500 text-sm">No users found.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               )}
            </div>
            
            {!loading && totalPages > 1 && (
               <div className="p-4 border-t border-dark-border flex items-center justify-between bg-black/20">
                  <span className="text-xs text-gray-500 font-medium">
                     Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </span>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-white/5 border border-dark-border text-gray-400 disabled:opacity-30 hover:text-white hover:bg-white/10 transition-colors"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>
                     <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-white/5 border border-dark-border text-gray-400 disabled:opacity-30 hover:text-white hover:bg-white/10 transition-colors"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* Custom Confirmation Modal */}
         <AnimatePresence>
            {confirmConfig && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-black/90 backdrop-blur-md"
                  />
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.9, opacity: 0, y: 20 }}
                     className="relative w-full max-w-md glass-card border-white/10 p-8 text-center"
                  >
                     <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">{confirmConfig.title}</h3>
                     <p className="text-gray-400 text-sm mb-8">{confirmConfig.message}</p>
                     <div className="flex gap-4">
                        <button
                           onClick={() => setConfirmConfig(null)}
                           className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={confirmConfig.onConfirm}
                           className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                        >
                           Confirm
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Toast Notifications */}
         <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-4">
            <AnimatePresence>
               {notification && (
                  <motion.div
                     initial={{ opacity: 0, x: 20, scale: 0.9 }}
                     animate={{ opacity: 1, x: 0, scale: 1 }}
                     exit={{ opacity: 0, x: 20, scale: 0.9 }}
                     className={`flex items-center gap-4 p-4 pr-6 rounded-2xl border shadow-2xl backdrop-blur-xl ${notification.type === 'error'
                           ? 'bg-red-500/10 border-red-500/20 text-red-500'
                           : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}
                  >
                     <div className={`p-2 rounded-lg ${notification.type === 'error' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                        {notification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                     </div>
                     <p className="text-sm font-bold">{notification.message}</p>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
};

// Activity component used in stats
const Activity = ({ className }) => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
   </svg>
)

export default AdminDashboard;
