import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: 'How long does a typical website project take?', a: 'A standard business website usually takes 2-4 weeks from initial discovery to launch. More complex ecommerce or custom dashboard projects can take 6-10 weeks.' },
    { q: 'What information do I need to provide to get started?', a: 'We typically need your brand assets (logo, colors), content for your pages, and a clear idea of your business goals and target audience.' },
    { q: 'Do you offer ongoing maintenance and support?', a: 'Yes, we offer comprehensive maintenance plans that include security updates, regular backups, speed optimization, and priority support.' },
    { q: 'Will my website be mobile-friendly and SEO-optimized?', a: 'Absolutely! Every website we build is fully responsive and includes basic SEO setup as standard to ensure you rank well on search engines.' },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-slate-900 text-white py-24 px-6 rounded-b-[3rem]">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-400 font-bold uppercase tracking-widest text-sm"
          >
            {t('contact')}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            {t('contactHeroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            {t('contactHeroSub')}
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-slate-900">{t('getInTouch')}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('getInTouchSub')}
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: t('emailUs'), value: 'nadunrosh@gmail.com', sub: 'We respond quickly' },
                { icon: Phone, label: t('callUs'), value: '+94 77 020 5124', sub: 'Mon-Sun, 24/7 Support' },
                { icon: MapPin, label: t('visitUs'), value: '15/2 Sri Piyathissa Pura Road Bambarakele Nuwaraeliya', sub: 'By appointment only' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-slate-900">{item.value}</p>
                    <p className="text-sm text-slate-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white space-y-6 shadow-xl shadow-blue-200">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h4 className="text-2xl font-bold">{t('quickChatWhatsApp')}</h4>
              <p className="text-blue-100">{t('quickChatWhatsAppSub')}</p>
              <a
                href="https://wa.me/94770205124"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all"
              >
                {t('startChattingNow')}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{t('messageSent')}</h3>
                <p className="text-lg text-slate-600 max-w-sm">
                  {t('messageSentSub')}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  {t('sendAnotherMessage')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">{t('fullName')}</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">{t('emailAddress')}</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t('phoneNumber')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t('yourMessage')}</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-100"
                >
                  {isSubmitting ? t('sending') : t('sendMessage')} <Send size={24} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">FAQ</h2>
            <h3 className="text-4xl font-bold text-slate-900">{t('commonQuestions')}</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={cn("text-slate-400 transition-transform", activeFaq === i && "rotate-180")}
                    size={24}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-slate-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
