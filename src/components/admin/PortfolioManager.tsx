import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Pencil, Trash2, X, Check, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';

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

const PortfolioManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    category: 'Corporate',
    description: '',
    imageUrl: '',
    link: '',
    featured: false,
    order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject.id) {
        const { id, ...data } = currentProject;
        await updateDoc(doc(db, 'portfolio', id), data);
      } else {
        await addDoc(collection(db, 'portfolio'), {
          ...currentProject,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentProject({ title: '', category: 'Corporate', description: '', imageUrl: '', link: '', featured: false, order: 0 });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'portfolio', id));
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Portfolio Manager</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              const newProjects = [
                { title: 'MyFun.lk', category: 'Web App', description: 'Sri Lanka\'s premier entertainment hub for event discovery, ticket bookings, and lifestyle experiences.', imageUrl: 'https://picsum.photos/seed/myfun/800/600', link: 'https://myfun.lk', featured: true, order: 10 },
                { title: 'Taro Vapes', category: 'Ecommerce', description: 'A high-performance ecommerce platform for premium vaping products, featuring a clean, conversion-focused design.', imageUrl: 'https://picsum.photos/seed/vape/800/600', link: 'https://tarovapes.store', featured: true, order: 11 },
                { title: 'Lumis LK', category: 'Ecommerce', description: 'A sophisticated online showroom for luxury lighting solutions, emphasizing visual aesthetics and product detail.', imageUrl: 'https://picsum.photos/seed/lumis/800/600', link: 'https://lumislk.com', featured: false, order: 12 },
                { title: 'CheapStay Online', category: 'Web App', description: 'A robust travel booking engine designed for finding the best deals on accommodations worldwide.', imageUrl: 'https://picsum.photos/seed/travel/800/600', link: 'https://cheapstay.online', featured: false, order: 13 },
                { title: 'SDGP Online', category: 'Corporate', description: 'A professional corporate portal dedicated to sustainable development goals and global partnership initiatives.', imageUrl: 'https://picsum.photos/seed/sdgp/800/600', link: 'https://sdgp.online', featured: false, order: 14 }
              ];
              for (const p of newProjects) {
                await addDoc(collection(db, 'portfolio'), { ...p, createdAt: serverTimestamp() });
              }
              alert('Requested projects have been added to your portfolio!');
            }}
            className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
          >
            Bulk Add Requested Sites
          </button>
          <button
            onClick={() => {
              setCurrentProject({ title: '', category: 'Corporate', description: '', imageUrl: '', link: '', featured: false, order: 0 });
              setIsEditing(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
          >
            <Plus size={20} /> Add Project
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{currentProject.id ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Project Title</label>
              <input
                type="text"
                required
                value={currentProject.title}
                onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select
                value={currentProject.category}
                onChange={e => setCurrentProject({ ...currentProject, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option>Corporate</option>
                <option>Ecommerce</option>
                <option>Landing Page</option>
                <option>Web App</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea
                required
                value={currentProject.description}
                onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Image URL</label>
              <input
                type="url"
                required
                value={currentProject.imageUrl}
                onChange={e => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Project Link</label>
              <input
                type="url"
                value={currentProject.link}
                onChange={e => setCurrentProject({ ...currentProject, link: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentProject.featured}
                  onChange={e => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm font-bold text-slate-700">Featured Project</span>
              </label>
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
                {currentProject.id ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(project)}
                  className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {project.featured && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Featured
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{project.category}</p>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h4>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{project.description}</p>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  View Live <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;
