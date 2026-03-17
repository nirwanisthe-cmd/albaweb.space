import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, Zap, Shield, BarChart3, Users, Globe, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: Record<string, any> = {
  Globe, Zap, BarChart3, Shield, ShoppingCart: Zap, Layout: Globe
};

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
  featured: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch featured projects
    const projectsQuery = query(
      collection(db, 'portfolio'), 
      where('featured', '==', true),
      limit(3)
    );
    const unsubscribeProjects = onSnapshot(projectsQuery, (snap) => {
      setFeaturedProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    // Fetch top services
    const servicesQuery = query(collection(db, 'services'), orderBy('order', 'asc'), limit(4));
    const unsubscribeServices = onSnapshot(servicesQuery, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    });

    return () => {
      unsubscribeProjects();
      unsubscribeServices();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 pt-20 pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-cyan-100/50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
              <Zap size={14} /> Albecket Web Studio
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              {t('heroSub')}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                {t('freeQuote')} <ArrowRight size={20} />
              </Link>
              <Link
                to="/pricing"
                className="bg-white text-slate-900 border-2 border-slate-100 px-8 py-4 rounded-full font-bold text-lg hover:border-blue-600 transition-all"
              >
                {t('viewPlans')}
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-500 font-medium">{t('trustedBy')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://picsum.photos/seed/studio/1200/800"
                alt="Web Design Showcase"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Conversion Rate</p>
                  <p className="text-xl font-bold text-slate-900">+124%</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Clients</p>
                  <p className="text-xl font-bold text-slate-900">150+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">{t('ourExpertise')}</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900">{t('compDigitalSolutions')}</h3>
            <p className="text-slate-600 text-lg">{t('compDigitalSolutionsSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                  <p className="text-slate-600 mb-6 line-clamp-2">{service.description}</p>
                  <Link to="/services" className="text-blue-600 font-bold flex items-center gap-2 group/link">
                    {t('learnMore')} <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/team/800/1000" alt="Our Team" className="w-full h-auto" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl p-6 text-center">
              <span className="text-5xl font-bold mb-2">10+</span>
              <span className="text-sm font-medium uppercase tracking-wider">{t('yearsExcellence')}</span>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">{t('whyChooseUs')}</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{t('successStoriesTitle')}</h3>
            <p className="text-slate-600 text-lg">
              {t('successStoriesSub')}
            </p>
            <div className="space-y-4">
              {[
                t('why1'),
                t('why2'),
                t('why3'),
                t('why4'),
                t('why5')
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg border-b-2 border-blue-600 pb-1 hover:gap-4 transition-all"
            >
              {t('discoverOurStory')} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Preview */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm">{t('ourPortfolio')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold">{t('featuredProjects')}</h3>
            </div>
            <Link
              to="/portfolio"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-colors flex items-center gap-2"
            >
              {t('viewAllProjects')} <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -10 }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <p className="text-blue-400 font-bold text-sm mb-2">{project.category}</p>
                  <h4 className="text-2xl font-bold mb-4">{project.title}</h4>
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center"
                  >
                    <ExternalLink size={24} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">{t('testimonials')}</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900">{t('whatClientsSay')}</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah Johnson', role: 'CEO, TechStart', content: 'Albecket Web Studio transformed our online presence. Our conversion rate increased by 40% within the first month of launching the new site.' },
            { name: 'Michael Chen', role: 'Founder, GreenEats', content: 'The team is professional, responsive, and truly understands modern web design. They delivered a beautiful ecommerce site ahead of schedule.' },
            { name: 'Emma Williams', role: 'Marketing Director, LuxeHome', content: 'Highly recommend! Their attention to detail and focus on performance is unmatched. Our site is now faster and more user-friendly than ever.' },
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
              <div className="flex text-yellow-400 mb-6">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={18} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 text-lg italic mb-8">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/client${i}/100/100`} alt={t.name} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">{t('readyToTransform')}</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('readyToTransformSub')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-50 transition-all shadow-xl"
              >
                {t('getStartedNow')}
              </Link>
              <Link
                to="/pricing"
                className="bg-blue-700 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-800 transition-all border border-blue-500"
              >
                {t('viewPricing')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
