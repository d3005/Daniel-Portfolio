import { useRef, useState, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, CheckCircle, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';
import SectionHeader from '../ui/SectionHeader';
import type { Profile } from '../../types/portfolio';
import { ref, push } from 'firebase/database';
import { database } from '../../lib/firebase';

// Lazy load 3D canvas for better initial load
const ContactCanvas = lazy(() => 
  import('../3d/effects/SectionEnhancements').then(module => ({ 
    default: module.ContactCanvas 
  }))
);

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_v2va3ff';
const EMAILJS_TEMPLATE_ID = 'template_9gogsok'; 
const EMAILJS_PUBLIC_KEY = 'LQl5hPPuPyeTsuAwK';

// Animated input component with glow effects
function GlowInput({ 
  type = 'text', 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  rows,
}: {
  type?: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const InputComponent = rows ? 'textarea' : 'input';

  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-dark-300 mb-2">
        {label}
        {required && <span className="text-accent-cyan ml-1">*</span>}
      </label>
      <div className="relative">
        {/* Animated glow border */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-purple"
              style={{ filter: 'blur(4px)' }}
            />
          )}
        </AnimatePresence>
        
        <InputComponent
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`relative w-full px-4 py-3 rounded-xl bg-dark-800/70 border text-dark-100 placeholder-dark-500 focus:outline-none transition-all duration-300 ${
            isFocused 
              ? 'border-accent-cyan/50 shadow-lg shadow-accent-cyan/20' 
              : 'border-dark-700 hover:border-dark-600'
          } ${rows ? 'resize-none' : ''}`}
          placeholder={placeholder}
        />
        
        {/* Input corner accents when focused */}
        {isFocused && (
          <>
            <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-accent-cyan/60 rounded-tl" />
            <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-accent-cyan/60 rounded-tr" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-accent-cyan/60 rounded-bl" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-accent-cyan/60 rounded-br" />
          </>
        )}
      </div>
    </div>
  );
}

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const sectionRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let firebaseSuccess = false;
    let emailSuccess = false;

    // 1. Try to save to Firebase (backup storage)
    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        ...formData,
        timestamp: Date.now(),
        read: false
      });
      firebaseSuccess = true;
      console.log('✅ Message saved to Firebase');
    } catch (firebaseErr) {
      console.warn('⚠️ Firebase save failed:', firebaseErr);
    }

    // 2. Send email via EmailJS
    try {
      if (formRef.current) {
        const result = await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
          EMAILJS_PUBLIC_KEY
        );
        console.log('✅ EmailJS Response:', result);
        emailSuccess = true;
      }
    } catch (emailErr: any) {
      console.error('❌ EmailJS failed:', emailErr);
      console.error('EmailJS Error Details:', emailErr?.text || emailErr?.message || emailErr);
    }

    // 3. Handle results - prioritize email success
    if (emailSuccess) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } else if (firebaseSuccess) {
      // Email failed but Firebase worked - still show success but log warning
      console.warn('⚠️ Email not sent but message saved to Firebase');
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      setError('Failed to send message. Please try again or contact directly via email.');
      setTimeout(() => setError(null), 5000);
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    { icon: MapPin, label: 'Location', value: profile.location },
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
  ];

  const socialLinks = [
    { icon: Github, href: profile.social.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile.social.twitter, label: 'Twitter' },
    { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden" ref={sectionRef}>
      {/* 3D Background Canvas - Lazy loaded */}
      <Suspense fallback={null}>
        <ContactCanvas />
      </Suspense>
      
      {/* Semi-transparent content backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/80 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <SectionHeader
          title="Get In Touch"
          subtitle="Have a project in mind? Let's build something amazing together"
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="heading-3 text-dark-100 mb-6 flex items-center gap-2">
              Let's Connect
              <Sparkles className="w-5 h-5 text-accent-cyan" />
            </h3>
            <p className="body-large mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            {/* Contact details - enhanced */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="group"
                >
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="glass-card flex items-center gap-4 transition-all duration-300 hover:border-accent-cyan/50 relative overflow-hidden"
                    >
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center transition-all duration-300 relative"
                        whileHover={{ 
                          boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
                          backgroundColor: 'rgba(91, 108, 242, 0.2)',
                        }}
                      >
                        <item.icon size={20} className="text-primary-400 group-hover:text-accent-cyan transition-colors" />
                      </motion.div>
                      <div className="relative">
                        <p className="text-sm text-dark-400">{item.label}</p>
                        <p className="text-dark-100 group-hover:text-accent-cyan transition-colors font-medium">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="glass-card flex items-center gap-4 relative overflow-hidden">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center"
                        whileHover={{ boxShadow: '0 0 15px rgba(91, 108, 242, 0.4)' }}
                      >
                        <item.icon size={20} className="text-primary-400" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-dark-400">{item.label}</p>
                        <p className="text-dark-100">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social links - enhanced */}
            <div>
              <p className="text-sm text-dark-400 mb-4">Find me on social media</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    whileHover={{ 
                      y: -5, 
                      scale: 1.1,
                      boxShadow: '0 0 25px rgba(0, 245, 255, 0.4)',
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 glass-card rounded-xl text-dark-400 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Form glow background */}
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(91, 108, 242, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(0, 245, 255, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 100%, rgba(191, 0, 255, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(91, 108, 242, 0.3) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ filter: 'blur(40px)' }}
            />
            
            <form ref={formRef} onSubmit={handleSubmit} className="glass-card relative">
              {/* Animated top border */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-purple"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ transformOrigin: 'left' }}
              />
              
              <div className="space-y-6">
                {/* Name field */}
                <GlowInput
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />

                {/* Email field */}
                <GlowInput
                  type="email"
                  label="Your Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />

                {/* Message field */}
                <GlowInput
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                />

                {/* Hidden fields for EmailJS template */}
                <input type="hidden" name="to_email" value="dannyjoseph3007@outlook.com" />

                {/* Error message - animated */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button - enhanced with pulse effect */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: isSubmitted 
                      ? '0 0 30px rgba(0, 245, 127, 0.5)' 
                      : '0 0 30px rgba(0, 245, 255, 0.5), 0 0 60px rgba(91, 108, 242, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden ${
                    isSubmitted
                      ? 'bg-accent-green text-dark-950'
                      : error
                      ? 'bg-red-500 text-white'
                      : 'btn-primary'
                  }`}
                >
                  {/* Animated background sweep */}
                  {!isSubmitting && !isSubmitted && !error && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  )}
                  
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle size={20} />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-2 right-2 w-6 h-6">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-accent-cyan/40 to-transparent" />
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-accent-cyan/40 to-transparent" />
              </div>
              <div className="absolute bottom-2 left-2 w-6 h-6">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-cyan/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-accent-cyan/40 to-transparent" />
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
    </section>
  );
}
