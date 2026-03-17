import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Zap, Star, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingFeature {
  featureText: string;
  isIncluded: boolean;
  sortOrder: number;
}

interface PricingPlan {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: string;
  currency: string;
  pricingType: 'monthly' | 'one-time' | 'custom';
  customPriceLabel: string;
  badge: string;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  buttonText: string;
  buttonLink: string;
  deliveryTime: string;
  category: string;
  features: PricingFeature[];
}

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(
      collection(db, 'pricing'), 
      orderBy('sortOrder', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const allPlans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingPlan));
      setPlans(allPlans.filter(p => p.isActive));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-slate-600">Loading Pricing Plans...</p>
      </div>
    </div>
  );

  return (
    <div className="pb-24 bg-slate-50/50">
      {/* Header */}
      <section className="py-24 px-6 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
        >
          {t('pricing')}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold text-slate-900 tracking-tight"
        >
          {t('pricingHeroTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          {t('pricingHeroSub')}
        </motion.p>
      </section>

      {/* Plans Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative p-10 rounded-[3rem] flex flex-col shadow-2xl transition-all hover:-translate-y-4 duration-500",
                plan.isPopular 
                  ? "bg-slate-900 text-white scale-105 z-10" 
                  : "bg-white text-slate-900 border border-slate-100"
              )}
            >
              {(plan.badge || plan.isPopular) && (
                <div className={cn(
                  "absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg",
                  plan.isPopular ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
                )}>
                  {plan.badge || t('mostPopular')}
                </div>
              )}

              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    plan.isPopular ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                  )}>
                    {plan.category === 'Ecommerce' ? <Shield size={32} /> : plan.isPopular ? <Star size={32} /> : <Zap size={32} />}
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-3 py-1 rounded-full",
                    plan.isPopular ? "bg-white/10 text-blue-200" : "bg-slate-100 text-slate-500"
                  )}>
                    {plan.category}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold mb-3 tracking-tight">{plan.title}</h3>
                <p className={cn(
                  "text-sm mb-8 leading-relaxed",
                  plan.isPopular ? "text-slate-400" : "text-slate-500"
                )}>{plan.shortDescription}</p>
                
                <div className="flex flex-col gap-1">
                  {plan.customPriceLabel && (
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      plan.isPopular ? "text-blue-400" : "text-blue-600"
                    )}>{plan.customPriceLabel}</span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold opacity-60">{plan.currency}</span>
                    <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      plan.isPopular ? "text-slate-500" : "text-slate-400"
                    )}>
                      {plan.pricingType === 'monthly' ? t('perMonth') : t('perProject')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-10">
                <p className={cn(
                  "text-xs font-bold uppercase tracking-widest mb-4",
                  plan.isPopular ? "text-slate-500" : "text-slate-400"
                )}>{t('whatsIncluded')}</p>
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                      !feature.isIncluded 
                        ? "bg-slate-100 text-slate-400" 
                        : plan.isPopular ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                    )}>
                      {feature.isIncluded ? <Check size={12} strokeWidth={3} /> : <X size={10} />}
                    </div>
                    <span className={cn(
                      "font-medium text-sm",
                      !feature.isIncluded && "text-slate-400 line-through"
                    )}>{feature.featureText}</span>
                  </div>
                ))}
                {plan.deliveryTime && (
                  <div className="pt-4 mt-4 border-t border-slate-100/10 flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
                    <Zap size={14} /> {plan.deliveryTime} {t('delivery')}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to={plan.buttonLink || "/contact"}
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 shadow-lg",
                    plan.isPopular 
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20" 
                      : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-900/10"
                  )}
                >
                  {plan.buttonText || `Choose ${plan.title}`} <ArrowRight size={20} />
                </Link>
                <a
                  href={`https://wa.me/94770205124?text=I'm interested in the ${plan.title} plan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 border-2",
                    plan.isPopular
                      ? "border-white/10 text-white hover:bg-white/5"
                      : "border-green-500 text-green-600 hover:bg-green-50"
                  )}
                >
                  {t('orderViaWhatsApp')}
                </a>
              </div>
            </motion.div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="max-w-xs mx-auto space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Zap size={32} />
                </div>
                <p className="text-slate-500 font-medium">{t('noPricingPlans')}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{t('faqTitle')}</h3>
          <p className="text-slate-600">{t('faqSub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: t('faq1Q'), a: t('faq1A') },
            { q: t('faq2Q'), a: t('faq2A') },
            { q: t('faq3Q'), a: t('faq3A') },
            { q: t('faq4Q'), a: t('faq4A') },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-bold text-slate-900 mb-4">{faq.q}</h4>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
