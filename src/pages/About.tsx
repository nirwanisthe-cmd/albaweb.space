import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Target, Eye, Heart, Award, Users, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

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
            {t('aboutTitle')}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight"
          >
            {t('aboutHeroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('aboutHeroSub')}
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/office/800/1000" alt="Our Studio" className="w-full h-auto" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <Rocket size={60} />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{t('ourJourneyTitle')}</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('ourJourneyP1')}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('ourJourneyP2')}
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-bold text-blue-600 mb-1">6</p>
                <p className="text-slate-500 font-medium">{t('projectsCompleted')}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600 mb-1">98%</p>
                <p className="text-slate-500 font-medium">{t('clientSatisfaction')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[3rem] mx-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6 p-8 bg-white/5 rounded-3xl border border-white/10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Target size={32} />
            </div>
            <h4 className="text-3xl font-bold">{t('ourMission')}</h4>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t('ourMissionDesc')}
            </p>
          </div>
          <div className="space-y-6 p-8 bg-white/5 rounded-3xl border border-white/10">
            <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <Eye size={32} />
            </div>
            <h4 className="text-3xl font-bold">{t('ourVision')}</h4>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t('ourVisionDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h3 className="text-4xl font-bold text-slate-900">{t('valuesDriveUs')}</h3>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t('qualityFirst'), icon: Award, desc: t('qualityFirstDesc') },
            { title: t('clientCentric'), icon: Heart, desc: t('clientCentricDesc') },
            { title: t('innovation'), icon: Rocket, desc: t('innovationDesc') },
          ].map((value, i) => (
            <div key={i} className="p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <value.icon size={40} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">{value.title}</h4>
              <p className="text-slate-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
