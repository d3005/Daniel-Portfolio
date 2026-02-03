import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Mail, 
  Clock, 
  User, 
  MessageSquare, 
  Trash2, 
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Shield,
  Key
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { database } from '../../lib/firebase';
import { ref, onValue, remove, update } from 'firebase/database';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { logout, user, authMethod } = useAdminAuth();
  const navigate = useNavigate();

  // Fetch messages from Firebase
  useEffect(() => {
    if (!database) {
      setLoading(false);
      return () => {};
    }
    
    const messagesRef = ref(database, 'messages');
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Message, 'id'>)
        }));
        // Sort by timestamp (newest first)
        messagesArray.sort((a, b) => b.timestamp - a.timestamp);
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const markAsRead = async (id: string) => {
    if (!database) return;
    const messageRef = ref(database, `messages/${id}`);
    await update(messageRef, { read: true });
  };

  const markAsUnread = async (id: string) => {
    if (!database) return;
    const messageRef = ref(database, `messages/${id}`);
    await update(messageRef, { read: false });
  };

  const deleteMessage = async (id: string) => {
    if (!database) return;
    const messageRef = ref(database, `messages/${id}`);
    await remove(messageRef);
    setShowDeleteConfirm(null);
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !msg.read) ||
      (filterStatus === 'read' && msg.read);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-100">Admin Dashboard</h1>
                <p className="text-xs text-dark-400">Manage messages & activity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Auth Info Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700">
                {authMethod === 'firebase' ? (
                  <>
                    <Mail size={14} className="text-accent-cyan" />
                    <span className="text-xs text-dark-300">{user?.email}</span>
                  </>
                ) : (
                  <>
                    <Key size={14} className="text-accent-orange" />
                    <span className="text-xs text-dark-300">Password Auth</span>
                  </>
                )}
              </div>
              
              <a 
                href="/" 
                target="_blank"
                className="text-sm text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                View Site <ExternalLink size={14} />
              </a>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 text-dark-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <MessageSquare size={24} className="text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-100">{messages.length}</p>
              <p className="text-sm text-dark-400">Total Messages</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
              <Mail size={24} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-100">{unreadCount}</p>
              <p className="text-sm text-dark-400">Unread Messages</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
              <CheckCircle size={24} className="text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-100">{messages.length - unreadCount}</p>
              <p className="text-sm text-dark-400">Read Messages</p>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
              className="pl-10 pr-10 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-dark-100 focus:outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" />
          </div>
        </div>

        {/* Messages List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
              <Mail size={20} />
              Messages ({filteredMessages.length})
              {loading && <RefreshCw size={16} className="animate-spin text-primary-400" />}
            </h2>

            {loading ? (
              <div className="glass-card text-center py-12">
                <RefreshCw size={32} className="mx-auto animate-spin text-primary-400 mb-4" />
                <p className="text-dark-400">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="glass-card text-center py-12">
                <MessageSquare size={48} className="mx-auto text-dark-600 mb-4" />
                <p className="text-dark-400">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No messages match your search' 
                    : 'No messages yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {filteredMessages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.read) markAsRead(msg.id);
                      }}
                      className={`glass-card cursor-pointer transition-all hover:border-primary-500/50 ${
                        selectedMessage?.id === msg.id ? 'border-primary-500' : ''
                      } ${!msg.read ? 'border-l-4 border-l-accent-cyan' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User size={14} className="text-dark-500" />
                            <span className="font-medium text-dark-100 truncate">{msg.name}</span>
                            {!msg.read && (
                              <span className="px-2 py-0.5 rounded-full bg-accent-cyan/20 text-accent-cyan text-xs">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-dark-400 truncate">{msg.email}</p>
                          <p className="text-sm text-dark-300 mt-2 line-clamp-2">{msg.message}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-dark-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div>
            <h2 className="text-lg font-semibold text-dark-100 mb-4">Message Details</h2>
            
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-100">{selectedMessage.name}</h3>
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => selectedMessage.read ? markAsUnread(selectedMessage.id) : markAsRead(selectedMessage.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMessage.read 
                          ? 'bg-dark-700 text-dark-400 hover:text-accent-cyan' 
                          : 'bg-accent-cyan/20 text-accent-cyan'
                      }`}
                      title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      <CheckCircle size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowDeleteConfirm(selectedMessage.id)}
                      className="p-2 rounded-lg bg-dark-700 text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-dark-400 mb-4 pb-4 border-b border-dark-700">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(selectedMessage.timestamp)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedMessage.read 
                      ? 'bg-dark-700 text-dark-400' 
                      : 'bg-accent-cyan/20 text-accent-cyan'
                  }`}>
                    {selectedMessage.read ? 'Read' : 'Unread'}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-dark-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-700">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Contact&body=%0A%0A---%0AOriginal message from ${selectedMessage.name}:%0A${selectedMessage.message}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card text-center py-12">
                <Mail size={48} className="mx-auto text-dark-600 mb-4" />
                <p className="text-dark-400">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-dark-100 mb-2">Delete Message?</h3>
              <p className="text-dark-400 mb-6">
                This action cannot be undone. The message will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-xl bg-dark-700 text-dark-300 hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMessage(showDeleteConfirm)}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
