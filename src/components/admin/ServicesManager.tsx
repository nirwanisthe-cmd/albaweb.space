import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Pencil, Trash2, X, Globe, ShoppingCart, Layout, RefreshCw, Search, Shield, Zap, Settings } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  startingPrice: string;
  icon: string;
  order: number;
}

const iconMap: Record<string, any> = {
  Globe, ShoppingCart, Layout, RefreshCw, Search, Shield, Zap, Settings
};

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({
    title: '',
    description: '',
    benefits: [],
    startingPrice: '',
    icon: 'Globe',
    order: 0
  });
  const [benefitInput, setBenefitInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentService.id) {
        const { id, ...data } = currentService;
        await updateDoc(doc(db, 'services', id), data);
      } else {
        await addDoc(collection(db, 'services'), {
          ...currentService,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentService({ title: '', description: '', benefits: [], startingPrice: '', icon: 'Globe', order: 0 });
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setCurrentService({
        ...currentService,
        benefits: [...(currentService.benefits || []), benefitInput.trim()]
      });
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setCurrentService({
      ...currentService,
      benefits: currentService.benefits?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Services Manager</h2>
        <button
          onClick={() => {
            setCurrentService({ title: '', description: '', benefits: [], startingPrice: '', icon: 'Globe', order: 0 });
            setIsEditing(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{currentService.id ? 'Edit Service' : 'New Service'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Service Title</label>
              <input
                type="text"
                required
                value={currentService.title}
                onChange={e => setCurrentService({ ...currentService, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Icon</label>
              <select
                value={currentService.icon}
                onChange={e => setCurrentService({ ...currentService, icon: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea
                required
                value={currentService.description}
                onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Starting Price</label>
              <input
                type="text"
                required
                value={currentService.startingPrice}
                onChange={e => setCurrentService({ ...currentService, startingPrice: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="e.g. Starting from $999"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Display Order</label>
              <input
                type="number"
                value={currentService.order}
                onChange={e => setCurrentService({ ...currentService, order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Benefits / Features</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={e => setBenefitInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Add a benefit..."
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="bg-slate-900 text-white px-6 rounded-xl font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentService.benefits?.map((benefit, i) => (
                  <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                    {benefit}
                    <button type="button" onClick={() => removeBenefit(i)} className="hover:text-red-600"><X size={14} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end md:col-span-2 gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                {currentService.id ? 'Update Service' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = iconMap[service.icon] || Globe;
          return (
            <div key={service.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Icon size={28} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-slate-900">{service.title}</h4>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentService(service);
                        setIsEditing(true);
                      }} 
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => deleteDoc(doc(db, 'services', service.id))} 
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.benefits.slice(0, 3).map((b, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-1 rounded">
                      {b}
                    </span>
                  ))}
                  {service.benefits.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{service.benefits.length - 3} more</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesManager;
