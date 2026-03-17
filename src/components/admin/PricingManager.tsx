import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Pencil, Trash2, X, Check, Zap, Star, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PricingFeature {
  id?: string;
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
  createdAt?: any;
  updatedAt?: any;
}

const PricingManager = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPlan, setCurrentPlan] = useState<Partial<PricingPlan>>({
    title: '',
    slug: '',
    shortDescription: '',
    price: '',
    currency: 'LKR',
    pricingType: 'one-time',
    customPriceLabel: '',
    badge: '',
    isPopular: false,
    isActive: true,
    sortOrder: 0,
    buttonText: 'Choose Plan',
    buttonLink: '/contact',
    deliveryTime: '',
    category: 'Web Design',
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'pricing'), orderBy('sortOrder', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPlans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingPlan)));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...currentPlan,
        updatedAt: serverTimestamp(),
        slug: currentPlan.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || ''
      };

      if (currentPlan.isPopular) {
        // Unset popular from others (simplified)
        const popularPlans = plans.filter(p => p.isPopular && p.id !== currentPlan.id);
        for (const p of popularPlans) {
          await updateDoc(doc(db, 'pricing', p.id), { isPopular: false });
        }
      }

      if (currentPlan.id) {
        const { id, ...rest } = data;
        await updateDoc(doc(db, 'pricing', id), rest);
      } else {
        await addDoc(collection(db, 'pricing'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const resetForm = () => {
    setCurrentPlan({
      title: '', slug: '', shortDescription: '', price: '', currency: 'LKR',
      pricingType: 'one-time', customPriceLabel: '', badge: '', isPopular: false,
      isActive: true, sortOrder: plans.length, buttonText: 'Choose Plan',
      buttonLink: '/contact', deliveryTime: '', category: 'Web Design', features: []
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      const newFeature: PricingFeature = {
        featureText: featureInput.trim(),
        isIncluded: true,
        sortOrder: (currentPlan.features?.length || 0)
      };
      setCurrentPlan({
        ...currentPlan,
        features: [...(currentPlan.features || []), newFeature]
      });
      setFeatureInput('');
    }
  };

  const toggleFeatureInclusion = (index: number) => {
    const newFeatures = [...(currentPlan.features || [])];
    newFeatures[index].isIncluded = !newFeatures[index].isIncluded;
    setCurrentPlan({ ...currentPlan, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setCurrentPlan({
      ...currentPlan,
      features: currentPlan.features?.filter((_, i) => i !== index)
    });
  };

  const toggleActive = async (plan: PricingPlan) => {
    await updateDoc(doc(db, 'pricing', plan.id), { isActive: !plan.isActive });
  };

  const togglePopular = async (plan: PricingPlan) => {
    if (!plan.isPopular) {
      const popularPlans = plans.filter(p => p.isPopular);
      for (const p of popularPlans) {
        await updateDoc(doc(db, 'pricing', p.id), { isPopular: false });
      }
    }
    await updateDoc(doc(db, 'pricing', plan.id), { isPopular: !plan.isPopular });
  };

  const populateSampleData = async () => {
    const samplePlans = [
      {
        title: "Starter Website Package",
        price: "25000",
        currency: "LKR",
        pricingType: "one-time",
        shortDescription: "Perfect for small businesses starting their digital journey.",
        features: [
          { featureText: "1–3 pages website", isIncluded: true, sortOrder: 0 },
          { featureText: "Mobile responsive design", isIncluded: true, sortOrder: 1 },
          { featureText: "Contact form", isIncluded: true, sortOrder: 2 },
          { featureText: "WhatsApp button", isIncluded: true, sortOrder: 3 },
          { featureText: "Basic SEO setup", isIncluded: true, sortOrder: 4 },
          { featureText: "3 days delivery", isIncluded: true, sortOrder: 5 }
        ],
        isPopular: false,
        isActive: true,
        sortOrder: 0,
        deliveryTime: "3 days",
        category: "Web Design"
      },
      {
        title: "Business Website Package",
        price: "45000",
        currency: "LKR",
        pricingType: "one-time",
        badge: "Most Popular",
        shortDescription: "Our most popular package for established businesses.",
        features: [
          { featureText: "5–8 pages", isIncluded: true, sortOrder: 0 },
          { featureText: "Premium modern design", isIncluded: true, sortOrder: 1 },
          { featureText: "Basic admin panel", isIncluded: true, sortOrder: 2 },
          { featureText: "Google Analytics integration", isIncluded: true, sortOrder: 3 },
          { featureText: "Portfolio/gallery", isIncluded: true, sortOrder: 4 },
          { featureText: "Speed optimization", isIncluded: true, sortOrder: 5 },
          { featureText: "5–7 days delivery", isIncluded: true, sortOrder: 6 }
        ],
        isPopular: true,
        isActive: true,
        sortOrder: 1,
        deliveryTime: "5-7 days",
        category: "Web Design"
      },
      {
        title: "Ecommerce Starter Package",
        price: "65000",
        currency: "LKR",
        pricingType: "one-time",
        shortDescription: "Start selling online with ease.",
        features: [
          { featureText: "Product listing system", isIncluded: true, sortOrder: 0 },
          { featureText: "Shopping cart", isIncluded: true, sortOrder: 1 },
          { featureText: "WhatsApp ordering", isIncluded: true, sortOrder: 2 },
          { featureText: "Admin panel product management", isIncluded: true, sortOrder: 3 },
          { featureText: "Mobile optimized", isIncluded: true, sortOrder: 4 },
          { featureText: "Manual/COD payment", isIncluded: true, sortOrder: 5 },
          { featureText: "7–10 days delivery", isIncluded: true, sortOrder: 6 }
        ],
        isPopular: false,
        isActive: true,
        sortOrder: 2,
        deliveryTime: "7-10 days",
        category: "Ecommerce"
      },
      {
        title: "Premium Ecommerce Package",
        price: "95000",
        currency: "LKR",
        pricingType: "one-time",
        shortDescription: "Advanced ecommerce features for growing stores.",
        features: [
          { featureText: "Full ecommerce system", isIncluded: true, sortOrder: 0 },
          { featureText: "Admin dashboard", isIncluded: true, sortOrder: 1 },
          { featureText: "Payment gateway integration", isIncluded: true, sortOrder: 2 },
          { featureText: "Analytics tracking", isIncluded: true, sortOrder: 3 },
          { featureText: "Customer management", isIncluded: true, sortOrder: 4 },
          { featureText: "Discount/coupon system", isIncluded: true, sortOrder: 5 },
          { featureText: "10–14 days delivery", isIncluded: true, sortOrder: 6 }
        ],
        isPopular: false,
        isActive: true,
        sortOrder: 3,
        deliveryTime: "10-14 days",
        category: "Ecommerce"
      },
      {
        title: "Custom Pro Business Solution",
        price: "120000",
        currency: "LKR",
        pricingType: "custom",
        customPriceLabel: "Starting from",
        shortDescription: "Tailored solutions for complex business needs.",
        features: [
          { featureText: "Fully custom website", isIncluded: true, sortOrder: 0 },
          { featureText: "Advanced admin panel", isIncluded: true, sortOrder: 1 },
          { featureText: "Custom features", isIncluded: true, sortOrder: 2 },
          { featureText: "Full analytics and tracking", isIncluded: true, sortOrder: 3 },
          { featureText: "SEO optimization", isIncluded: true, sortOrder: 4 },
          { featureText: "Priority support", isIncluded: true, sortOrder: 5 }
        ],
        isPopular: false,
        isActive: true,
        sortOrder: 4,
        deliveryTime: "Custom",
        category: "Custom"
      }
    ];

    for (const plan of samplePlans) {
      await addDoc(collection(db, 'pricing'), {
        ...plan,
        slug: plan.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    alert("Sample data populated!");
  };

  const filteredPlans = plans.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || (filterActive === 'active' ? p.isActive : !p.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pricing Manager</h2>
          <p className="text-slate-500">Manage your agency's service packages and pricing plans.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={populateSampleData}
            className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Populate Sample Data
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Add Plan
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <select
          value={filterActive}
          onChange={e => setFilterActive(e.target.value as any)}
          className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{currentPlan.id ? 'Edit Pricing Plan' : 'Create New Plan'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Plan Title *</label>
                <input
                  type="text"
                  required
                  value={currentPlan.title}
                  onChange={e => setCurrentPlan({ ...currentPlan, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. Business Package"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  value={currentPlan.category}
                  onChange={e => setCurrentPlan({ ...currentPlan, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. Web Design"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Badge / Label</label>
                <input
                  type="text"
                  value={currentPlan.badge}
                  onChange={e => setCurrentPlan({ ...currentPlan, badge: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. Most Popular"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Price *</label>
                <input
                  type="text"
                  required
                  value={currentPlan.price}
                  onChange={e => setCurrentPlan({ ...currentPlan, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. 45000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Price Label</label>
                <input
                  type="text"
                  value={currentPlan.customPriceLabel}
                  onChange={e => setCurrentPlan({ ...currentPlan, customPriceLabel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. Starting from"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Pricing Type</label>
                <select
                  value={currentPlan.pricingType}
                  onChange={e => setCurrentPlan({ ...currentPlan, pricingType: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Short Description</label>
              <textarea
                value={currentPlan.shortDescription}
                onChange={e => setCurrentPlan({ ...currentPlan, shortDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-24"
                placeholder="Briefly describe what this plan is for..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Delivery Time</label>
                <input
                  type="text"
                  value={currentPlan.deliveryTime}
                  onChange={e => setCurrentPlan({ ...currentPlan, deliveryTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="e.g. 5-7 days"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Button Text</label>
                <input
                  type="text"
                  value={currentPlan.buttonText}
                  onChange={e => setCurrentPlan({ ...currentPlan, buttonText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Button Link</label>
                <input
                  type="text"
                  value={currentPlan.buttonLink}
                  onChange={e => setCurrentPlan({ ...currentPlan, buttonLink: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Features List</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Add a feature (e.g. SEO Optimization)"
                />
                <button type="button" onClick={addFeature} className="bg-slate-900 text-white px-6 rounded-xl font-bold">Add</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                {currentPlan.features?.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleFeatureInclusion(i)}
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                          f.isIncluded ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-400"
                        )}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                      <span className={cn("font-medium", !f.isIncluded && "text-slate-400 line-through")}>{f.featureText}</span>
                    </div>
                    <button type="button" onClick={() => removeFeature(i)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  currentPlan.isActive ? "bg-blue-600" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    currentPlan.isActive ? "left-7" : "left-1"
                  )} />
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={currentPlan.isActive}
                  onChange={e => setCurrentPlan({ ...currentPlan, isActive: e.target.checked })}
                />
                <span className="font-bold text-slate-700">Active / Visible</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  currentPlan.isPopular ? "bg-orange-500" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    currentPlan.isPopular ? "left-7" : "left-1"
                  )} />
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={currentPlan.isPopular}
                  onChange={e => setCurrentPlan({ ...currentPlan, isPopular: e.target.checked })}
                />
                <span className="font-bold text-slate-700">Most Popular Highlight</span>
              </label>

              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-slate-700">Sort Order:</label>
                <input
                  type="number"
                  value={currentPlan.sortOrder}
                  onChange={e => setCurrentPlan({ ...currentPlan, sortOrder: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1 rounded-lg border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                {currentPlan.id ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Plan Details</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-400">#{plan.sortOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                          {plan.title}
                          {plan.isPopular && <Star size={14} className="text-orange-500 fill-orange-500" />}
                        </p>
                        <p className="text-xs text-slate-500">{plan.category} • {plan.features.length} features</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{plan.customPriceLabel} {plan.price} {plan.currency}</p>
                    <p className="text-xs text-slate-500 capitalize">{plan.pricingType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(plan)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                        plan.isActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {plan.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => togglePopular(plan)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          plan.isPopular ? "text-orange-500 bg-orange-50" : "text-slate-400 hover:bg-slate-100"
                        )}
                        title="Toggle Popular"
                      >
                        <Star size={18} fill={plan.isPopular ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPlan(plan);
                          setIsEditing(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this plan?')) {
                            deleteDoc(doc(db, 'pricing', plan.id));
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">
                    No pricing plans found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingManager;
