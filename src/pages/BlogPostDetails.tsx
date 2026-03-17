import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useDynamicTranslation } from '../hooks/useDynamicTranslation';
import Markdown from 'react-markdown';

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

const BlogPostDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, 'blog'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setPost({ id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost);
        } else {
          navigate('/blog');
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const { translatedText: title } = useDynamicTranslation(post?.title || '');
  const { translatedText: content } = useDynamicTranslation(post?.content || '');
  const { translatedText: category } = useDynamicTranslation(post?.category || '');

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t('loadingBlog')}</div>;
  if (!post) return null;

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={post.imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 px-6">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={16} /> {t('backToBlog')}
            </Link>
            <div className="space-y-4">
              <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {category}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <User size={16} className="text-blue-400" /> {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" /> 
                  {post.publishedAt?.toDate().toLocaleDateString() || 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-slate max-w-none">
              <div className="markdown-body">
                <Markdown>{content}</Markdown>
              </div>
            </div>
            
            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('sharePost')}</span>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all">
                    <Facebook size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-400 hover:text-white transition-all">
                    <Twitter size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-700 hover:text-white transition-all">
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('aboutAuthor')}</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {post.author[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{post.author}</p>
                  <p className="text-sm text-slate-500">Expert Web Developer</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dedicated to helping small businesses grow through professional web solutions and digital strategies.
              </p>
            </div>

            <div className="bg-blue-600 p-8 rounded-[2rem] text-white space-y-6">
              <h3 className="text-2xl font-bold">{t('needAWebsite')}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {t('needCustomSolutionSub')}
              </p>
              <Link
                to="/contact"
                className="block w-full py-4 bg-white text-blue-600 rounded-xl font-bold text-center hover:bg-blue-50 transition-colors"
              >
                {t('getStarted')}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogPostDetails;
