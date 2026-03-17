import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Pencil, Trash2, X, Calendar, User, Tag, FileText } from 'lucide-react';

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

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: 'Web Design',
    author: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = currentPost.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      if (currentPost.id) {
        const { id, ...data } = currentPost;
        await updateDoc(doc(db, 'blog', id), { ...data, slug });
      } else {
        await addDoc(collection(db, 'blog'), {
          ...currentPost,
          slug,
          publishedAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentPost({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', category: 'Web Design', author: '' });
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Blog Manager</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              const posts = [
                {
                  title: 'Podi Business Ekak Online Widiyata Patan Ganne Kohomada?',
                  category: 'Starting a Small Business Online',
                  slug: 'starting-small-business-online-sri-lanka',
                  excerpt: 'අද කාලේ පොඩි බිස්නස් එකක් වුණත් ඔන්ලයින් ගෙනියන එක අත්‍යවශ්‍යයි. මේ ලිපියෙන් අපි කතා කරන්නේ බිංදුවේ ඉඳන් ඔන්ලයින් බිස්නස් එකක් නිවැරදිව පටන් ගන්නා ආකාරය ගැනයි.',
                  content: `## හැඳින්වීම\nවර්තමානයේ ලෝකය වේගයෙන් ඩිජිටල්කරණය වෙමින් පවතිනවා. ඔබ කුඩා ව්‍යාපාරයක් කරන කෙනෙක් නම් හෝ අලුතින් ව්‍යාපාරයක් පටන් ගන්න ඉන්න කෙනෙක් නම්, "Online Presence" එකක් තිබීම දැන් තේරීමක් නෙවෙයි, එය අත්‍යවශ්‍ය දෙයක්. බොහෝ දෙනෙක් හිතන්නේ ඔන්ලයින් බිස්නස් එකක් පටන් ගන්න එක ගොඩක් අමාරු වැඩක් කියලා. නමුත් නිවැරදි පියවර අනුගමනය කළොත් මෙය ඉතාමත් ලාභදායී ගමනක් වෙන්න පුළුවන්.\n\n## 01. ඔබේ Niche එක සහ Target Audience එක හඳුනාගන්න\nඔන්ලයින් බිස්නස් එකක් පටන් ගන්න කලින් ඔබ මුලින්ම තීරණය කරන්න ඕනේ ඔබ විකුණන්නේ මොනවාද සහ ඒවා මිලදී ගන්නේ කවුද කියලා. උදාහරණයක් විදියට ඔබ අතින් සාදන ලද ආභරණ (Handmade Jewelry) විකුණනවා නම්, ඔබේ Target Audience එක වෙන්නේ විලාසිතා වලට කැමති තරුණ පිරිසයි.\n\n## 02. Branding සහ Social Media Setup\nඔබේ ව්‍යාපාරයට ආකර්ෂණීය නමක් (Business Name) සහ ලාංඡනයක් (Logo) නිර්මාණය කරගන්න. ඉන්පසු Facebook, Instagram සහ TikTok වැනි සමාජ මාධ්‍ය ජාල වල ඔබේ ව්‍යාපාරය වෙනුවෙන් පිටු ආරම්භ කරන්න. මෙහිදී මතක තබා ගත යුතු වැදගත්ම දේ තමයි "Consistency" එක. නිරන්තරයෙන් පාරිභෝගිකයින්ට වැදගත් වන දේවල් පෝස්ට් කරන්න.\n\n## 03. Professional Website එකක අවශ්‍යතාවය\nසමාජ මාධ්‍ය හරහා බිස්නස් එක පටන් ගත්තත්, දිගුකාලීනව සාර්ථක වෙන්න නම් ඔබටම කියලා වෙබ් අඩවියක් (Website) තිබීම ඉතාමත් වැදගත්. වෙබ් අඩවියක් හරහා:\n* පාරිභෝගිකයින්ගේ විශ්වාසය (Trust) දිනාගත හැකියි.\n* දවසේ පැය 24 පුරාම ඔබේ නිෂ්පාදන ප්‍රදර්ශනය කළ හැකියි.\n* සෘජුවම ඇණවුම් ලබාගත හැකියි (Ecommerce).\n\n## 04. Digital Marketing සහ SEO\nඔබේ වෙබ් අඩවියට මිනිස්සු ගෙන්න ගන්න නම් SEO (Search Engine Optimization) ගැන සැලකිලිමත් වෙන්න ඕනේ. ගූගල් එකේ කෙනෙක් යමක් සර්ච් කරද්දී ඔබේ බිස්නස් එක උඩට එන විදියට වෙබ් අඩවිය සකස් කරගන්න.\n\n## සමාප්තිය\nඔන්ලයින් බිස්නස් එකක් කියන්නේ එක රැයකින් සාර්ථක වෙන දෙයක් නෙවෙයි. ඒ සඳහා කැපවීම සහ නිවැරදි තාක්ෂණික සහය අවශ්‍යයි.\n\n**CTA:**\nඔබට business ekata galapena professional website ekak hadaganna nathnam danata thiyena website eka improve karaganna ona nam, Albecket Web Studio samaga sambandha wenna.`,
                  imageUrl: 'https://picsum.photos/seed/online-biz/1200/630',
                  author: 'Albecket Team',
                  published: true
                },
                {
                  title: 'Podi Business Walata Website Ekak One Wenne Ai?',
                  category: 'Why Every Small Business Needs a Website',
                  slug: 'why-small-business-needs-website',
                  excerpt: 'ෆේස්බුක් පේජ් එකක් තිබුණාම මදිද? කුඩා ව්‍යාපාරයකට වෘත්තීය වෙබ් අඩවියක් තිබීමෙන් ලැබෙන වාසි රැසක් මේ ලිපියෙන් දැනගන්න.',
                  content: `## හැඳින්වීම\nබොහෝ කුඩා ව්‍යාපාරිකයන් අසන ප්‍රශ්නයක් තමයි "මට Facebook පේජ් එකක් තියෙනවා, ඉතින් මට තවත් වෙබ් අඩවියක් ඕනෙද?" කියන එක. ඇත්තටම Facebook කියන්නේ හොඳ ආරම්භයක්. නමුත් ඔබේ ව්‍යාපාරය සැබෑ සන්නාමයක් (Brand) ලෙස ලෝකයට ගෙන යන්න නම් වෙබ් අඩවියක් තිබීම අනිවාර්යයි.\n\n## 01. වෘත්තීයභාවය සහ විශ්වාසය (Professionalism & Trust)\nඅද කාලේ පාරිභෝගිකයෙක් යම් සේවාවක් ලබාගන්න කලින් ගූගල් එකේ සර්ච් කරලා බලනවා. එහිදී ඔබේ ව්‍යාපාරයට නිල වෙබ් අඩවියක් තිබෙනවා දැකීමෙන් ඔවුන් තුළ ලොකු විශ්වාසයක් ඇති වෙනවා. වෙබ් අඩවියක් නැති ව්‍යාපාරයක් පාරිභෝගිකයා දකින්නේ "තාවකාලික" දෙයක් විදියටයි.\n\n## 02. ඔබ සතු දත්ත සහ පාලනය (Control Over Your Content)\nසමාජ මාධ්‍ය ජාල වල නීති රීති ඕනෑම වෙලාවක වෙනස් වෙන්න පුළුවන්. ඔබේ පේජ් එක අක්‍රිය වුණොත් ඔබට ඔබේ පාරිභෝගිකයින් අහිමි වෙනවා. නමුත් වෙබ් අඩවියක් කියන්නේ ඔබේම දේපලක්. එහි පාලනය සම්පූර්ණයෙන්ම ඇත්තේ ඔබ සතුවයි.\n\n## 03. දවසේ පැය 24 පුරාම විවෘතයි\nඔබ නිදාගෙන ඉන්න වෙලාවක වුණත් පාරිභෝගිකයෙකුට ඔබේ වෙබ් අඩවියට පිවිස භාණ්ඩ පරීක්ෂා කිරීමට හෝ ඇණවුම් කිරීමට හැකියාව තිබෙනවා. මෙය ඔබේ අලෙවිය (Sales) වැඩි කරගන්න ලැබෙන ලොකු අවස්ථාවක්.\n\n## 04. Google සෙවුම් ප්‍රතිඵල වල ඉහළට ඒම\nනිවැරදිව SEO කරපු වෙබ් අඩවියක් තිබීමෙන්, ඔබේ සේවාවන් සොයන අලුත් පාරිභෝගිකයින්ට ඔබව ඉතා පහසුවෙන් සොයාගත හැකියි. මෙය නොමිලේ ලැබෙන වෙළඳ දැන්වීමක් වැනියි.\n\n## සමාප්තිය\nවෙබ් අඩවියක් කියන්නේ වියදමක් නෙවෙයි, එය ඔබේ ව්‍යාපාරයේ අනාගතය වෙනුවෙන් කරන ආයෝජනයක්.\n\n**CTA:**\nඔබට business ekata galapena professional website ekak hadaganna nathnam danata thiyena website eka improve karaganna ona nam, Albecket Web Studio samaga sambandha wenna.`,
                  imageUrl: 'https://picsum.photos/seed/why-web/1200/630',
                  author: 'Albecket Team',
                  published: true
                },
                {
                  title: 'Danata Thiyena Website Ekak Thawath Professionally Improve Karaganne Kohomada?',
                  category: 'How to Improve an Existing Website',
                  slug: 'how-to-improve-existing-website-professionally',
                  excerpt: 'ඔබේ වෙබ් අඩවිය පරණ පෙනුමක් ගන්නවාද? පාරිභෝගිකයින් ආකර්ෂණය කරගන්නා අයුරින් ඔබේ වෙබ් අඩවිය අප්ඩේට් කරගන්නා ආකාරය මෙන්න.',
                  content: `## හැඳින්වීම\nඔබට දැනටමත් වෙබ් අඩවියක් තිබෙන්න පුළුවන්. නමුත් එයින් බලාපොරොත්තු වන ප්‍රතිඵල ලැබෙනවාද? තාක්ෂණය දිනෙන් දින වෙනස් වෙනවා. වසර දෙකකට කලින් හදපු වෙබ් අඩවියක් අද වන විට "Outdated" වෙන්න පුළුවන්. ඔබේ වෙබ් අඩවිය වෘත්තීය මට්ටමට ගෙන ඒමට කළ හැකි දේවල් කිහිපයක් මෙන්න.\n\n## 01. වෙබ් අඩවියේ වේගය (Loading Speed)\nවෙබ් අඩවියක් ලෝඩ් වෙන්න තත්පර 3කට වඩා යනවා නම්, පාරිභෝගිකයින් එයින් ඉවත් වෙනවා. අනවශ්‍ය පින්තූර සහ කේත ඉවත් කර ඔබේ වෙබ් අඩවියේ වේගය වැඩි කරගන්න.\n\n## 02. Mobile Responsiveness\nඅද කාලේ 80%කට වඩා පිරිස වෙබ් අඩවි බලන්නේ ජංගම දුරකථනයෙන්. ඔබේ වෙබ් අඩවිය ෆෝන් එකට ගැලපෙන විදියට (Mobile friendly) සකස් කර නොමැති නම් ඔබට විශාල පාරිභෝගික පිරිසක් අහිමි වෙනවා.\n\n## 03. User Experience (UX) දියුණු කිරීම\nපාරිභෝගිකයෙකුට අවශ්‍ය තොරතුරු ඉතා පහසුවෙන් සොයාගත හැකි විය යුතුයි. මෙනු එක සරල කරන්න. "Call to Action" බොත්තම් (උදා: Buy Now, Contact Us) පැහැදිලිව පෙනෙන්නට තබන්න.\n\n## 04. අලුත් තොරතුරු සහ Content\nවෙබ් අඩවියේ තොරතුරු නිතර අප්ඩේට් කරන්න. බ්ලොග් ලිපි එකතු කරන්න. පරණ පින්තූර වෙනුවට උසස් තත්ත්වයේ (High-quality) පින්තූර භාවිතා කරන්න.\n\n## සමාප්තිය\nවෙබ් අඩවියක් නිරන්තරයෙන් නඩත්තු කිරීම සහ දියුණු කිරීම මගින් ඔබේ ව්‍යාපාරයේ වර්ධනය ස්ථාවර කරගත හැකියි.\n\n**CTA:**\nඔබට business ekata galapena professional website ekak hadaganna nathnam danata thiyena website eka improve karaganna ona nam, Albecket Web Studio samaga sambandha wenna.`,
                  imageUrl: 'https://picsum.photos/seed/improve-web/1200/630',
                  author: 'Albecket Team',
                  published: true
                },
                {
                  title: 'Website Ekaka Sales Addu Karana Sadharana Waradi 7k',
                  category: 'Common Website Mistakes That Reduce Sales',
                  slug: 'website-mistakes-that-reduce-sales',
                  excerpt: 'ඔබේ වෙබ් අඩවියට මිනිස්සු ආවත් බඩු ගන්නේ නැද්ද? වෙබ් අඩවියක අලෙවිය අඩු කරන ප්‍රධාන වැරදි 7ක් සහ ඒවා නිවැරදි කරගන්නා ආකාරය මෙන්න.',
                  content: `## හැඳින්වීම\nවෙබ් අඩවියක් තිබූ පමණින්ම බිස්නස් එක සාර්ථක වෙන්නේ නැහැ. සමහර වෙලාවට වෙබ් අඩවියේ තියෙන පොඩි වැරදි නිසා පාරිභෝගිකයින් බඩු මිලදී නොගෙන ඉවත් වෙන්න පුළුවන්. අපි බලමු වෙබ් අඩවි වල දකින්න ලැබෙන පොදු වැරදි මොනවාද කියලා.\n\n## 01. පැහැදිලි Call to Action (CTA) එකක් නොමැති වීම\nපාරිභෝගිකයා වෙබ් අඩවියට ආවාට පස්සේ ඊළඟට කරන්න ඕනේ මොකක්ද කියලා ඔහුට පැහැදිලි වෙන්න ඕනේ. "දැන්ම ඇණවුම් කරන්න" හෝ "අපට කතා කරන්න" වැනි බොත්තම් පැහැදිලිව තිබිය යුතුයි.\n\n## 02. දුර්වල පින්තූර භාවිතය\nපාරිභෝගිකයා භාණ්ඩය දකින්නේ පින්තූරයෙන්. බොඳ වුණු හෝ පැහැදිලි නැති පින්තූර දැමීමෙන් ඔබේ ව්‍යාපාරයේ ගුණාත්මකභාවය ගැන සැකයක් ඇති වෙනවා.\n\n## 03. සංකීර්ණ Checkout Process එක\nභාණ්ඩයක් මිලදී ගන්න යන පියවර ගොඩක් වැඩි නම් පාරිභෝගිකයා අතරමගදී එය අත්හැර දමනවා. එය හැකිතාක් සරල කරන්න.\n\n## 04. Contact Information සොයා ගැනීමට අපහසු වීම\nපාරිභෝගිකයෙකුට ප්‍රශ්නයක් ආවොත් ඔබව සම්බන්ධ කරගන්නා ආකාරය පැහැදිලිව වෙබ් අඩවියේ තිබිය යුතුයි.\n\n## 05. Mobile Friendly නොවීම\nජංගම දුරකථනයෙන් වෙබ් අඩවිය හරියට පේන්නේ නැත්නම්, අද කාලේ බිස්නස් එකක් කරන එක හරිම අමාරුයි.\n\n## 06. SSL සහ ආරක්ෂාව නොමැති වීම\nවෙබ් අඩවිය "Not Secure" කියලා පෙන්නනවා නම් කවුරුත් තමන්ගේ කාඩ් විස්තර දෙන්න කැමති වෙන්නේ නැහැ.\n\n## 07. අනවශ්‍ය Pop-ups\nවෙබ් අඩවියට ආපු ගමන්ම Pop-ups ගොඩක් එනවා නම් එය පාරිභෝගිකයාට කරදරයක්.\n\n## සමාප්තිය\nමේ වැරදි නිවැරදි කරගැනීමෙන් ඔබේ වෙබ් අඩවියේ අලෙවිය සැලකිය යුතු ලෙස වැඩි කරගත හැකියි.\n\n**CTA:**\nඔබට business ekata galapena professional website ekak hadaganna nathnam danata thiyena website eka improve karaganna ona nam, Albecket Web Studio samaga sambandha wenna.`,
                  imageUrl: 'https://picsum.photos/seed/mistakes/1200/630',
                  author: 'Albecket Team',
                  published: true
                },
                {
                  title: 'Honda Website Ekak Business Ekata Vishwasa Ha Aluth Customers Genena Hati',
                  category: 'How a Good Website Builds Trust and Gets More Customers',
                  slug: 'how-good-website-builds-trust-customers',
                  excerpt: 'ඔන්ලයින් බිස්නස් එකක සාර්ථකත්වයේ රහස "විශ්වාසයයි". හොඳ වෙබ් අඩවියක් මගින් පාරිභෝගික විශ්වාසය ගොඩනගා ගන්නේ කෙසේදැයි ඉගෙන ගන්න.',
                  content: `## හැඳින්වීම\nඔන්ලයින් ලෝකයේදී පාරිභෝගිකයා ඔබව දකින්නේ නැහැ. ඔවුන් දකින්නේ ඔබේ වෙබ් අඩවිය පමණයි. ඒ නිසා ඔබේ වෙබ් අඩවිය ඔබේ ව්‍යාපාරයේ "මුහුණුවර" වැනියි. හොඳ වෙබ් අඩවියක් මගින් පාරිභෝගික විශ්වාසය ගොඩනගා ගන්නේ කොහොමද කියලා අපි බලමු.\n\n## 01. Professional Design එකක් තිබීම\nපිරිසිදු, නූතන (Modern) සහ පිළිවෙලකට ඇති වෙබ් අඩවියක් දුටු සැණින් පාරිභෝගිකයා තුළ පැහැදීමක් ඇති වෙනවා. එයින් හැඟවෙන්නේ ඔබ ඔබේ ව්‍යාපාරය ගැන සැලකිලිමත් වන බවයි.\n\n## 02. පාරිභෝගික අදහස් (Testimonials & Reviews)\nවෙනත් පාරිභෝගිකයින් ඔබේ සේවාව ගැන කියන දේවල් වෙබ් අඩවියේ ප්‍රදර්ශනය කරන්න. මෙය අලුත් පාරිභෝගිකයින්ට ඔබ ගැන විශ්වාසයක් ඇති කිරීමට ඇති හොඳම ක්‍රමයයි.\n\n## 03. පැහැදිලි තොරතුරු (Transparency)\nඔබේ සේවාවන්, මිල ගණන් සහ Return Policy වැනි දේවල් පැහැදිලිව සඳහන් කරන්න. කිසිවක් සඟවන්න එපා.\n\n## 04. උසස් තත්ත්වයේ අන්තර්ගතය (Quality Content)\nඔබේ ක්ෂේත්‍රය ගැන දැනුම ලබා දෙන බ්ලොග් ලිපි ලියන්න. එවිට පාරිභෝගිකයින් ඔබව එම ක්ෂේත්‍රයේ "Expert" කෙනෙක් ලෙස දකිනවා.\n\n## 05. ආරක්ෂිත ගෙවීම් ක්‍රම (Secure Payments)\nවිශ්වාසවන්ත Payment Gateways භාවිතා කිරීමෙන් පාරිභෝගිකයාට බියක් නැතිව ගනුදෙනු කළ හැකියි.\n\n## සමාප්තිය\nවිශ්වාසය ගොඩනැගීම කියන්නේ කාලය යන වැඩක්. නමුත් හොඳ වෙබ් අඩවියක් ඒ ගමන ඉක්මන් කරනවා.\n\n**CTA:**\nඔබට business ekata galapena professional website ekak hadaganna nathnam danata thiyena website eka improve karaganna ona nam, Albecket Web Studio samaga sambandha wenna.`,
                  imageUrl: 'https://picsum.photos/seed/trust/1200/630',
                  author: 'Albecket Team',
                  published: true
                }
              ];
              for (const p of posts) {
                await addDoc(collection(db, 'blog'), { ...p, createdAt: serverTimestamp(), publishedAt: serverTimestamp() });
              }
              alert('All 5 professional blog posts have been added successfully!');
            }}
            className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
          >
            Bulk Import Professional Posts
          </button>
          <button
            onClick={() => {
              setCurrentPost({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', category: 'Web Design', author: '' });
              setIsEditing(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
          >
            <Plus size={20} /> New Post
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{currentPost.id ? 'Edit Post' : 'New Post'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Post Title</label>
              <input
                type="text"
                required
                value={currentPost.title}
                onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select
                value={currentPost.category}
                onChange={e => setCurrentPost({ ...currentPost, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option>Web Design</option>
                <option>SEO</option>
                <option>Design Trends</option>
                <option>Digital Marketing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Author Name</label>
              <input
                type="text"
                required
                value={currentPost.author}
                onChange={e => setCurrentPost({ ...currentPost, author: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Excerpt (Short Summary)</label>
              <textarea
                required
                value={currentPost.excerpt}
                onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none min-h-[80px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Content (Markdown/HTML)</label>
              <textarea
                required
                value={currentPost.content}
                onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none min-h-[200px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Featured Image URL</label>
              <input
                type="url"
                required
                value={currentPost.imageUrl}
                onChange={e => setCurrentPost({ ...currentPost, imageUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="flex justify-end md:col-span-2 gap-4">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Publish Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                <Tag size={10} /> {post.category}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{post.title}</h4>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() : 'Draft'}</span>
                <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setCurrentPost(post);
                  setIsEditing(true);
                }} 
                className="w-10 h-10 bg-slate-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button 
                onClick={() => deleteDoc(doc(db, 'blog', post.id))} 
                className="w-10 h-10 bg-slate-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
