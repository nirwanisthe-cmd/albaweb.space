import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Check, Globe, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

interface Settings {
  gaTrackingId: string;
  metaTitle: string;
  metaDescription: string;
  contactEmail: string;
  whatsappNumber: string;
  address: string;
}

const SettingsManager = () => {
  const [settings, setSettings] = useState<Settings>({
    gaTrackingId: '',
    metaTitle: '',
    metaDescription: '',
    contactEmail: '',
    whatsappNumber: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as Settings);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Site Settings</h2>
        {showSuccess && (
          <div className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
            <Check size={16} /> Settings Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO Settings */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">SEO & Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={e => setSettings({ ...settings, metaTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Albecket Web Studio | Premium Web Design"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Meta Description</label>
              <textarea
                value={settings.metaDescription}
                onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
                placeholder="Premium web design and digital services studio..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Google Analytics ID</label>
              <input
                type="text"
                value={settings.gaTrackingId}
                onChange={e => setSettings({ ...settings, gaTrackingId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Mail size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="hello@albecket.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">WhatsApp Number</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Office Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="15/2 Sri Piyathissa Pura Road Bambarakele Nuwaraeliya"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : <><Save size={20} /> Save All Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
