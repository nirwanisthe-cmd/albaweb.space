import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, ShoppingCart, Layout, RefreshCw, Search, Settings, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap: Record<string, any> = {
  Globe, ShoppingCart, Layout, RefreshCw, Search, Shield, Zap, Settings
};

interface Service {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  startingPrice: string;
  icon: string;
  order: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Services...</div>;

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
            {t('services')}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            {t('servicesHeroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            {t('servicesHeroSub')}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Globe;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{service.description}</p>
                
                <div className="space-y-3 mb-8">
                  {service.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle2 size={16} className="text-blue-600" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-blue-600 font-bold">{service.startingPrice}</span>
                  <Link to="/contact" className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
          {services.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              {t('noServices')}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-[3rem] p-12 md:p-20 text-center space-y-8 border border-slate-100">
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900">{t('needCustomSolution')}</h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('needCustomSolutionSub')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            {t('talkToExperts')} <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
