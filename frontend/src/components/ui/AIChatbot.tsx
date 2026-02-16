import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  ChevronDown,
  RotateCcw,
  FileText,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { sendMessage, resetConversation, QUICK_SUGGESTIONS, type ChatMessage } from '../../lib/gemini';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm June, Daniel's AI hiring assistant. 👋\n\nLooking to hire a GenAI/ML Engineer? I can help you evaluate Daniel's fit for your team. Ask me about his technical skills, project experience, availability, or anything else you'd like to know!",
      timestamp: Date.now(),
      feedback: null,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (message?: string) => {
    const text = message || inputValue.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await sendMessage(text);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Oops! Something went wrong on my end. Please try again! 🙏",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    resetConversation();
    setMessages([
      {
        role: 'assistant',
        content: "Hey there! I'm June, Daniel's AI assistant! 👋 Ask me anything about his skills, projects, or experience - I'm here to help!",
        timestamp: Date.now(),
        feedback: null,
      },
    ]);
    setShowSuggestions(true);
  };

  // Handle message feedback (thumbs up/down)
  const handleFeedback = (messageIndex: number, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, feedback } : msg
    ));
    
    // Store feedback in localStorage for analytics
    const feedbackData = {
      messageIndex,
      feedback,
      messageContent: messages[messageIndex].content.substring(0, 100), // First 100 chars
      timestamp: Date.now(),
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('june_feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('june_feedback', JSON.stringify(existingFeedback));
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan shadow-lg shadow-primary-500/25 flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with June"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle size={24} />
              <Sparkles size={12} className="absolute -top-1 -right-1 text-accent-cyan" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating indicator when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 bg-dark-800/90 backdrop-blur-sm border border-dark-700 rounded-xl px-4 py-2 shadow-xl"
          >
            <p className="text-sm text-dark-200 flex items-center gap-2">
              <Bot size={16} className="text-accent-cyan" />
              Chat with June!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-dark-900/95 backdrop-blur-xl border border-dark-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-dark-700 bg-dark-800/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-dark-100 flex items-center gap-2">
                  June
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan font-normal">
                    RAG
                  </span>
                </h3>
                <p className="text-xs text-dark-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                  Daniel's AI Assistant
                </p>
              </div>
              <button
                onClick={handleResetChat}
                className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-accent-cyan transition-colors"
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant' 
                      ? 'bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 text-accent-cyan' 
                      : 'bg-dark-700 text-dark-300'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  
                  {/* Message Bubble with Feedback */}
                  <div className={`max-w-[80%] ${msg.role === 'assistant' ? 'flex flex-col' : ''}`}>
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      msg.role === 'assistant'
                        ? 'bg-dark-800 text-dark-200 rounded-tl-md'
                        : 'bg-gradient-to-r from-primary-500 to-accent-cyan text-white rounded-tr-md'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    
                    {/* Feedback Buttons for Assistant Messages */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-1 ml-1">
                        {msg.feedback === null || msg.feedback === undefined ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFeedback(index, 'positive')}
                              className="p-1 rounded-md text-dark-500 hover:text-accent-green hover:bg-accent-green/10 transition-colors"
                              title="Helpful response"
                            >
                              <ThumbsUp size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFeedback(index, 'negative')}
                              className="p-1 rounded-md text-dark-500 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown size={14} />
                            </motion.button>
                          </>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              msg.feedback === 'positive'
                                ? 'bg-accent-green/20 text-accent-green'
                                : 'bg-accent-red/20 text-accent-red'
                            }`}
                          >
                            {msg.feedback === 'positive' ? '✓ Helpful' : '✓ Feedback received'}
                          </motion.span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                    <Bot size={16} />
                  </div>
                  <div className="bg-dark-800 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-accent-cyan" />
                      <span className="text-sm text-dark-400">June is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <AnimatePresence>
              {showSuggestions && messages.length <= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 pb-2"
                >
                  <div className="flex gap-2 mb-3">
                    <motion.a
                      href="https://www.daniel-portfolio.in/Daniel_Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/30 transition-all text-sm"
                    >
                      <FileText size={16} />
                      <span>View Resume</span>
                    </motion.a>
                    <motion.a
                      href="https://calendar.app.google/F7aLphveqQ7rNZm58"
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green/30 transition-all text-sm"
                    >
                      <Calendar size={16} />
                      <span>Schedule Call</span>
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Suggestions */}
            <AnimatePresence>
              {showSuggestions && messages.length <= 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2"
                >
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSend(suggestion)}
                        className="px-3 py-1.5 text-xs rounded-full bg-dark-800 text-dark-300 hover:bg-primary-500/20 hover:text-primary-400 border border-dark-700 hover:border-primary-500/50 transition-all"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 border-t border-dark-700 bg-dark-800/30">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask June anything..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-700 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all disabled:opacity-50"
                />
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary-500 to-accent-cyan text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
