import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

const categories = ['All', 'Corporate', 'Ecommerce', 'Landing Page', 'Web App'];

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
  featured: boolean;
  order: number;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetchedProjects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(fetchedProjects);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Portfolio...</div>;

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-bold uppercase tracking-widest text-sm"
          >
            {t('portfolio')}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900"
          >
            {t('portfolioHeroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            {t('portfolioHeroSub')}
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                activeCategory === cat 
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-600 hover:text-blue-600"
              )}
            >
              {cat === 'All' ? t('catAll') : 
               cat === 'Corporate' ? t('catCorporate') : 
               cat === 'Ecommerce' ? t('catEcommerce') : 
               cat === 'Landing Page' ? t('catLandingPage') : 
               cat === 'Web App' ? t('catWebApp') : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <ExternalLink size={24} />
                    </a>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{project.category}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{project.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 font-bold flex items-center gap-2 group/btn"
                  >
                    {t('visitWebsite')} <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              {t('noProjectsFound')}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8">
          <h3 className="text-3xl md:text-5xl font-bold">{t('haveProjectInMind')}</h3>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('haveProjectInMindSub')}
          </p>
          <button className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
            {t('startYourProject')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
