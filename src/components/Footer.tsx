import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Globe size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Albecket <span className="text-blue-600">Web Studio</span>
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            {t('footerDesc')}
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">{t('quickLinks')}</h4>
          <ul className="space-y-4">
            {[
              { key: 'home', path: '/' },
              { key: 'about', path: '/about' },
              { key: 'services', path: '/services' },
              { key: 'pricing', path: '/pricing' },
              { key: 'portfolio', path: '/portfolio' },
              { key: 'blog', path: '/blog' },
              { key: 'contact', path: '/contact' }
            ].map((item) => (
              <li key={item.key}>
                <Link to={item.path} className="hover:text-blue-400 transition-colors">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">{t('ourServices')}</h4>
          <ul className="space-y-4">
            {[
              { key: 'businessWebsites', path: '/services' },
              { key: 'ecommerceDev', path: '/services' },
              { key: 'landingPages', path: '/services' },
              { key: 'seoOptimization', path: '/services' },
              { key: 'websiteMaintenance', path: '/services' },
              { key: 'customDashboards', path: '/services' }
            ].map((item) => (
              <li key={item.key}>
                <Link to={item.path} className="hover:text-blue-400 transition-colors">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">{t('contactInfo')}</h4>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin className="text-blue-500 shrink-0" size={20} />
              <span>15/2 Sri Piyathissa Pura Road Bambarakele Nuwaraeliya</span>
            </li>
            <li className="flex gap-3">
              <Phone className="text-blue-500 shrink-0" size={20} />
              <span>+94 77 020 5124</span>
            </li>
            <li className="flex gap-3">
              <Mail className="text-blue-500 shrink-0" size={20} />
              <span>nadunrosh@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <p>© {new Date().getFullYear()} Albecket Web Studio. {t('allRightsReserved')}</p>
          <Link to="/admin/login" className="opacity-0 hover:opacity-10 transition-opacity cursor-default">Admin</Link>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-white">{t('privacyPolicy')}</a>
          <a href="#" className="hover:text-white">{t('termsOfService')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
