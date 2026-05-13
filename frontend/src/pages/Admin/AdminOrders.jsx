import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, AlertTriangle, Loader2, Filter, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    
    // Notification & Modal State
    const [notification, setNotification] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(data || []);
            } else {
                setError(data.message || 'Failed to fetch orders');
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/admin/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchOrders();
                showNotification(`Order status updated to ${newStatus}`);
                setSelectedOrder(null);
            } else {
                const data = await res.json();
                showNotification(data.message || 'Update failed', 'error');
            }
        } catch (e) {
            showNotification(e.message, 'error');
        }
    };

    const filteredOrders = orders.filter(order => 
        (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.plan_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        }
    };

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

            {/* Search & Filter */}
            <div className="flex justify-end mb-4">
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            className="input-field pl-10 py-2 h-10 text-sm"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Loading Orders...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-xs text-gray-500 uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Client</th>
                                    <th className="px-8 py-4">Plan / Package</th>
                                    <th className="px-8 py-4">Company</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {paginatedOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-medium text-white">{order.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2 py-1 bg-white/5 border border-dark-border rounded text-xs text-gray-300 font-bold">
                                                {order.plan_name || order.offer?.name || 'Custom'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm text-gray-400">
                                                {order.company_name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right space-x-3">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-500 text-sm">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-dark-border flex items-center justify-between bg-black/20">
                        <span className="text-xs text-gray-500 font-medium">
                            Showing {startIndex + 1} to {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl glass-card border-white/10 p-8 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white font-outfit uppercase">Order Details</h3>
                                    <p className="text-gray-400 text-sm">Placed by {selectedOrder.user?.name}</p>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Plan Requested</p>
                                        <p className="font-medium text-white">{selectedOrder.plan_name || selectedOrder.offer?.name || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Company</p>
                                        <p className="font-medium text-white">{selectedOrder.company_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Short Description</p>
                                    <div className="bg-[#050505] p-4 rounded-xl border border-dark-border text-sm text-gray-300">
                                        {selectedOrder.short_description || 'No description provided.'}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Design Preference</p>
                                    <div className="bg-[#050505] p-4 rounded-xl border border-dark-border text-sm text-gray-300">
                                        {selectedOrder.design_preference || 'No preferences provided.'}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Feature Options</p>
                                    <div className="bg-[#050505] p-4 rounded-xl border border-dark-border text-sm text-gray-300">
                                        {selectedOrder.feature_options || 'No extra features specified.'}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-dark-border flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    Update Status:
                                </div>
                                <div className="flex gap-2">
                                    {selectedOrder.status === 'pending' && (
                                        <button onClick={() => handleStatusUpdate(selectedOrder.id, 'approved')} className="px-4 py-2 bg-primary-500/10 text-primary-500 border border-primary-500/20 hover:bg-primary-500 hover:text-white rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                                            Approve & Send Invoice
                                        </button>
                                    )}
                                    <button onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')} className="px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded-lg text-xs font-bold transition-colors">
                                        Processing
                                    </button>
                                    <button onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-colors">
                                        Complete
                                    </button>
                                    <button onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={() => setSelectedOrder(null)} className="ml-2 px-4 py-2 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast */}
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
                            <p className="text-sm font-bold">{notification.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminOrders;
