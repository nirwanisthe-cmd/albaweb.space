import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: any;
}

const TranslatedPostCard = ({ post, index }: { post: BlogPost, index: number }) => {
  const { t } = useLanguage();
  const { translatedText: title } = useDynamicTranslation(post.title);
  const { translatedText: excerpt } = useDynamicTranslation(post.excerpt);
  const { translatedText: category } = useDynamicTranslation(post.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="rounded-[2rem] overflow-hidden mb-6 aspect-video relative">
          <img
            src={post.imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 uppercase tracking-widest shadow-sm">
            {category}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> 
              {post.publishedAt?.toDate().toLocaleDateString() || 'Recently'}
            </span>
            <span className="flex items-center gap-1">
              <User size={12} /> 
              {post.author}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
          <div className="pt-2">
            <span className="text-blue-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              {t('readMore')} <ArrowRight size={18} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t('loadingBlog')}</div>;

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
            {t('blogHeroSub')}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900"
          >
            {t('blogHeroTitle')}
          </motion.h1>
          
          <div className="max-w-xl mx-auto pt-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchArticles')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map((post, i) => (
            <TranslatedPostCard key={post.id} post={post} index={i} />
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              {t('noArticlesFound')}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
