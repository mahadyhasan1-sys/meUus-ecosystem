import React, { useState, useEffect, useRef } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Camera,
  Sparkles, 
  Download, 
  Eye, 
  Layers, 
  Compass, 
  Heart, 
  BookOpen, 
  Sun, 
  Trees, 
  Building, 
  Users, 
  Flame, 
  Laptop,
  UploadCloud,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Trash2,
  Filter,
  Maximize2,
  FolderHeart,
  Grid3X3,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface PhotoItem {
  id: string;
  title: string;
  url: string;
  category: string;
  themeId: string;
  resolution: string;
  aspectRatio: '16:9' | '9:16' | '21:9' | '4:3' | '1:1';
  tag: string;
  location?: string;
  author?: string;
  isUserUpload?: boolean;
}

interface ThemeCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  bgGradient: string;
  accent: string;
  quote: string;
}

const CURATED_PHOTOS: PhotoItem[] = [
  // Laptop Preserved Journey & Workstation Captures
  {
    id: 'ph-lp-1',
    title: 'Founder Workstation Multi-Agent IDE & Dev Architecture',
    url: '/preserved/journey/lasthermeswork.png',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Desktop · 1920x1080',
    aspectRatio: '16:9',
    tag: 'Workstation Screen',
    location: 'Founder Laptop · Client #001',
    author: 'Md. Mahady Hasan'
  },
  {
    id: 'ph-lp-2',
    title: 'Ecosystem Build & Architecture Milestone Capture',
    url: '/preserved/journey/screenshot_20260704.png',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Desktop · 1920x1080',
    aspectRatio: '16:9',
    tag: 'Milestone Build',
    location: 'Founder Workstation',
    author: 'Md. Mahady Hasan'
  },
  {
    id: 'ph-lp-3',
    title: 'Founder Archival Portrait #A01 (Md. Mahady Hasan)',
    url: '/founder-a01.jpeg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Portrait · HD',
    aspectRatio: '1:1',
    tag: 'Founder Archive',
    location: 'Cumilla / Dhaka, Bangladesh',
    author: 'Md. Mahady Hasan'
  },
  {
    id: 'ph-lp-4',
    title: 'Founder Living Archive (August 2026)',
    url: '/preserved/journey/founder_photo_20260802.jpeg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Portrait · HD',
    aspectRatio: '1:1',
    tag: 'Founder Archive',
    location: 'Dhaka, Bangladesh',
    author: 'Md. Mahady Hasan'
  },
  {
    id: 'ph-lp-5',
    title: 'meUus Canonical Ecosystem Vision Master Render',
    url: '/preserved/img_hero_ecosystem.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Ecosystem Render',
    location: 'meUus Studio 3D',
    author: 'meUus Design Core'
  },
  {
    id: 'ph-lp-6',
    title: 'Guided Human Reflection Pilot Visual Master',
    url: '/preserved/img_human_growth_video.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Reflection Pilot',
    location: 'meUus Soul Sanctuary',
    author: 'meUus Design Core'
  },
  {
    id: 'ph-lp-7',
    title: 'meUus Soul Academy Curriculum & Skill Mastery',
    url: '/preserved/img_learning_academy.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Academy Visual',
    location: 'Education Pillar',
    author: 'meUus Learning Engine'
  },
  {
    id: 'ph-lp-8',
    title: 'meUus Sovereign Brand Identity & Core Seal',
    url: '/preserved/img_meuus_brand_logo.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: '4K · 3840x2160',
    aspectRatio: '1:1',
    tag: 'Brand Seal',
    location: 'Sovereign Brand Archive',
    author: 'meUus Identity Lab'
  },
  {
    id: 'ph-lp-9',
    title: 'Preserved Desktop Surface: Home Portal Baseline',
    url: '/preserved/desktop-home.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Desktop · HD',
    aspectRatio: '16:9',
    tag: 'Desktop Audit',
    location: 'Laptop Archive AU1-AU7',
    author: 'Client #001 Preservation'
  },
  {
    id: 'ph-lp-10',
    title: 'Preserved Desktop Surface: DLAS Longitudinal Engine',
    url: '/preserved/desktop-dlas.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Desktop · HD',
    aspectRatio: '16:9',
    tag: 'DLAS Audit',
    location: 'Laptop Archive AU1-AU7',
    author: 'Client #001 Preservation'
  },
  {
    id: 'ph-lp-11',
    title: 'Preserved Desktop Surface: Foundational Principles & Covenant',
    url: '/preserved/desktop-principles.jpg',
    category: 'laptop-preserved',
    themeId: 'laptop-preserved',
    resolution: 'Desktop · HD',
    aspectRatio: '16:9',
    tag: 'Constitutional Audit',
    location: 'Laptop Archive AU1-AU7',
    author: 'Client #001 Preservation'
  },

  // Green Bangladesh & Nature
  {
    id: 'ph-bd-1',
    title: 'Lush Tea Terraces of Sreemangal',
    url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80',
    category: 'environment',
    themeId: 'environment',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Sylhet, Bangladesh',
    author: 'Serene Nature Archive'
  },
  {
    id: 'ph-bd-2',
    title: 'Sundarbans Mangrove Dawn',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
    category: 'environment',
    themeId: 'environment',
    resolution: 'QHD · 2560x1440',
    aspectRatio: '16:9',
    tag: 'Desktop',
    location: 'Khulna, Bangladesh',
    author: 'Delta Horizons'
  },
  {
    id: 'ph-bd-3',
    title: 'Emerald River Pathways of Bengal',
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    category: 'nature',
    themeId: 'nature',
    resolution: 'Portrait · 1080x2400',
    aspectRatio: '9:16',
    tag: 'Mobile AMOLED',
    location: 'Barisal, Bangladesh',
    author: 'Riverine Solitude'
  },
  {
    id: 'ph-bd-4',
    title: 'Golden Sunset at Inani Coral Beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    category: 'sunrise',
    themeId: 'sunrise',
    resolution: 'Ultrawide · 3440x1440',
    aspectRatio: '21:9',
    tag: 'Ultrawide',
    location: "Cox's Bazar, Bangladesh",
    author: 'Bay of Bengal Horizon'
  },

  // Mountains & Summits
  {
    id: 'ph-mt-1',
    title: 'The Silent Mist of Keokradong',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    category: 'mountains',
    themeId: 'mountains',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Bandarban Hill Tracts',
    author: 'Highland Serenity'
  },
  {
    id: 'ph-mt-2',
    title: 'Himalayan Ridge at First Light',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80',
    category: 'mountains',
    themeId: 'mountains',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Kanchenjunga Vista, North Bengal',
    author: 'Alpine Focus'
  },
  {
    id: 'ph-mt-3',
    title: 'Pine Forest Ascent in Fog',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'mountains',
    themeId: 'mountains',
    resolution: 'Mobile · 1080x2400',
    aspectRatio: '9:16',
    tag: 'Mobile 9:16',
    location: 'Sajek Valley',
    author: 'Cloud Mountain Sanctuary'
  },

  // Sunrise & Dawn
  {
    id: 'ph-sn-1',
    title: 'Morning Awakening Over Calm Waters',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=80',
    category: 'sunrise',
    themeId: 'sunrise',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Haor Basin, Sunamganj',
    author: 'Dawn Radiance'
  },
  {
    id: 'ph-sn-2',
    title: 'First Ray Through Canopy',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    category: 'sunrise',
    themeId: 'sunrise',
    resolution: 'Ultrawide · 3440x1440',
    aspectRatio: '21:9',
    tag: 'Ultrawide',
    location: 'Lawachara Rainforest',
    author: 'Solitary Stride'
  },

  // Islamic Heritage & Architecture
  {
    id: 'ph-hr-1',
    title: 'Sixty Dome Mosque Geometry & Peace',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80',
    category: 'heritage',
    themeId: 'heritage',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Bagerhat UNESCO Heritage Site',
    author: 'Historic Bengal Stones'
  },
  {
    id: 'ph-hr-2',
    title: 'Illuminated Quranic Calligraphy Manuscript',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=80',
    category: 'heritage',
    themeId: 'heritage',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'High Fidelity',
    location: 'Master Scriptorium',
    author: 'Sacred Words'
  },
  {
    id: 'ph-hr-3',
    title: 'Courtyard Archway & Golden Hour Light',
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    category: 'heritage',
    themeId: 'heritage',
    resolution: 'Mobile · 1080x2400',
    aspectRatio: '9:16',
    tag: 'Mobile 9:16',
    location: 'Old Dhaka Heritage Walk',
    author: 'Arched Shadows'
  },

  // Learning, Books & Knowledge
  {
    id: 'ph-lr-1',
    title: 'Scholar Desk with Open Lexicon',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80',
    category: 'learning',
    themeId: 'learning',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Deep Study Chamber',
    author: 'Knowledge Pursuits'
  },
  {
    id: 'ph-lr-2',
    title: 'Library of Human Wisdom and Records',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
    category: 'learning',
    themeId: 'learning',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Curated',
    location: 'Heritage Library',
    author: 'Archival Light'
  },

  // Work, Craft & Productivity
  {
    id: 'ph-pr-1',
    title: 'Clean Minimalist Focused Workstation',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    category: 'productivity',
    themeId: 'productivity',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Desktop 4K',
    location: 'Dhaka Tech Hub',
    author: 'Developer Flow'
  },
  {
    id: 'ph-pr-2',
    title: 'Artisan Woodcraft Workshop & Tools',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    category: 'productivity',
    themeId: 'productivity',
    resolution: 'QHD · 2560x1440',
    aspectRatio: '16:9',
    tag: 'Craftsmanship',
    location: 'Local Guild, Narayanganj',
    author: 'Honest Labor'
  },

  // Community & People
  {
    id: 'ph-cm-1',
    title: 'Harvest Gathering in Rural Village',
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80',
    category: 'community',
    themeId: 'community',
    resolution: '4K · 3840x2160',
    aspectRatio: '16:9',
    tag: 'Community',
    location: 'Bogra Agro Collective',
    author: 'Mutual Aid Circle'
  },
  {
    id: 'ph-cm-2',
    title: 'Hands Sowing Future Seeds Together',
    url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=1600&q=80',
    category: 'community',
    themeId: 'community',
    resolution: 'QHD · 2560x1440',
    aspectRatio: '16:9',
    tag: 'Solidarity',
    location: 'Organic Composting Initiative',
    author: 'Community Roots'
  }
];

export default function PhotoAlbumGallery() {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedAspect, setSelectedAspect] = useState<string>('all');
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const stored = localStorage.getItem('meuus_user_photos');
      if (stored) {
        const userPhotos = JSON.parse(stored);
        return [...userPhotos, ...CURATED_PHOTOS];
      }
    } catch (e) {
      console.warn('Failed to load user photos', e);
    }
    return CURATED_PHOTOS;
  });

  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themes: ThemeCategory[] = [
    {
      id: 'all',
      name: 'All Master Photos',
      subtitle: 'Complete Visual Suite',
      icon: Grid3X3,
      bgGradient: 'from-emerald-950/60 via-slate-900 to-slate-950',
      accent: 'emerald',
      quote: '“Visual beauty grounds the soul in gratitude and clarity of action.”'
    },
    {
      id: 'laptop-preserved',
      name: 'Laptop Preserved Journey',
      subtitle: 'Founder Workstation & Authentic Screenshots',
      icon: Laptop,
      bgGradient: 'from-emerald-950/60 via-slate-900 to-slate-950',
      accent: 'emerald',
      quote: '“Demonstrated engineering, verified workstation telemetry, and authentic evidence.”'
    },
    {
      id: 'uploads',
      name: 'My Uploaded Photos',
      subtitle: 'Your Personal Wallpapers & Archives',
      icon: FolderHeart,
      bgGradient: 'from-purple-950/60 via-slate-900 to-slate-950',
      accent: 'purple',
      quote: '“Your personal memories and evidence of growth deserve high-fidelity preservation.”'
    },
    {
      id: 'environment',
      name: 'Green Bangladesh',
      subtitle: 'Sustainability & Land',
      icon: Trees,
      bgGradient: 'from-green-950/60 via-slate-900 to-slate-950',
      accent: 'green',
      quote: '“Protect the soil, the rivers, and the living breath of our homeland.”'
    },
    {
      id: 'mountains',
      name: 'Mountains & Summits',
      subtitle: 'Growth & Strength',
      icon: Compass,
      bgGradient: 'from-cyan-950/60 via-slate-900 to-slate-950',
      accent: 'cyan',
      quote: '“The mountain does not yield to the storm; it stands patient and grounded.”'
    },
    {
      id: 'sunrise',
      name: 'Sunrise & Dawn',
      subtitle: 'New Beginnings',
      icon: Sun,
      bgGradient: 'from-amber-950/60 via-slate-900 to-slate-950',
      accent: 'amber',
      quote: '“Every morning is a renewal of your covenant to strive with honesty.”'
    },
    {
      id: 'heritage',
      name: 'Islamic Heritage',
      subtitle: 'Faith, Architecture & Identity',
      icon: BookOpen,
      bgGradient: 'from-teal-950/60 via-slate-900 to-slate-950',
      accent: 'teal',
      quote: '“Knowledge without compassion is burden; wisdom in action is light.”'
    },
    {
      id: 'learning',
      name: 'Learning & Books',
      subtitle: 'Deep Knowledge & Craft',
      icon: BookOpen,
      bgGradient: 'from-indigo-950/60 via-slate-900 to-slate-950',
      accent: 'indigo',
      quote: '“Consistent, honest study transforms potential into lasting service.”'
    },
    {
      id: 'productivity',
      name: 'Work & Productivity',
      subtitle: 'Focus, Discipline & Impact',
      icon: Laptop,
      bgGradient: 'from-slate-900 via-emerald-950/30 to-slate-950',
      accent: 'emerald',
      quote: '“Disciplined daily effort outperforms sporadic brilliance every time.”'
    },
    {
      id: 'community',
      name: 'Community & People',
      subtitle: 'Connection & Mutual Aid',
      icon: Users,
      bgGradient: 'from-blue-950/60 via-slate-900 to-slate-950',
      accent: 'blue',
      quote: '“No citizen of Bangladesh should walk the path of hardship alone.”'
    }
  ];

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];

  const filteredPhotos = photos.filter(photo => {
    if (selectedTheme === 'uploads' && !photo.isUserUpload) return false;
    if (selectedTheme !== 'all' && selectedTheme !== 'uploads' && photo.themeId !== selectedTheme && photo.category !== selectedTheme) return false;
    if (selectedAspect !== 'all' && photo.aspectRatio !== selectedAspect) return false;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems: PhotoItem[] = [];

    Array.from(files).forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        const newItem: PhotoItem = {
          id: `user-photo-${Date.now()}-${index}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
          url: resultUrl,
          category: 'uploads',
          themeId: 'uploads',
          resolution: 'High Resolution User Upload',
          aspectRatio: '16:9',
          tag: 'My Upload',
          location: 'Local Upload',
          author: 'Uploaded by You',
          isUserUpload: true
        };
        newItems.push(newItem);

        if (newItems.length === files.length) {
          const userOnly = [...newItems, ...photos.filter(p => p.isUserUpload)];
          try {
            localStorage.setItem('meuus_user_photos', JSON.stringify(userOnly));
          } catch (err) {
            console.warn('Storage limit reached for user photos in localStorage', err);
          }
          setPhotos(prev => [...newItems, ...prev]);
          setSelectedTheme('uploads');
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteUserPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    const userOnly = updated.filter(p => p.isUserUpload);
    try {
      localStorage.setItem('meuus_user_photos', JSON.stringify(userOnly));
    } catch (e) {
      console.warn(e);
    }
  };

  const copyUrl = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadPhoto = (photo: PhotoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const anchor = document.createElement('a');
    anchor.href = photo.url;
    anchor.download = `${photo.title.replace(/\s+/g, '_')}_meUus_Wallpaper.jpg`;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Camera size={18} />}
        title="Photo Gallery"
        subtitle="Preserved Photographic Archives, Founder Evidence, and Field History."
        badge="Archive"
        breadcrumb="Media"
      />
      <section id="photo-album" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      {/* Background subtle light ambient tint */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>meUus Visual Archives & Photo Suite</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
              Photo Album & <span className="text-emerald-600">Atmospheric Wallpapers</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Experience authentic high-definition photography of Bangladesh landscapes, Islamic heritage, and focused work environments, or upload and preserve your own personal photo archives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Your Photos</span>
            </Button>
            <div className="text-xs font-mono text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              {photos.length} Total Visual Assets
            </div>
          </div>
        </div>

        {/* Theme & Category Selectors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-600 font-bold">
              1. Select Photo Theme:
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Aspect Ratio:</span>
              <select 
                value={selectedAspect}
                aria-label="Filter photos by aspect ratio"
                onChange={(e) => setSelectedAspect(e.target.value)}
                className="bg-white border border-gray-300 text-gray-800 rounded-lg px-2 py-1 text-xs outline-none shadow-sm"
              >
                <option value="all">All Ratios</option>
                <option value="16:9">Desktop (16:9)</option>
                <option value="9:16">Mobile (9:16)</option>
                <option value="21:9">Ultrawide (21:9)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {themes.map(t => {
              const Icon = t.icon;
              const isSelected = selectedTheme === t.id;
              const count = t.id === 'all' 
                ? photos.length 
                : t.id === 'uploads' 
                  ? photos.filter(p => p.isUserUpload).length 
                  : photos.filter(p => p.themeId === t.id || p.category === t.id).length;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm scale-[1.03] ring-1 ring-emerald-500'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="text-xs font-bold truncate w-full">{t.name.split('&')[0]}</span>
                  <span className="text-[10px] font-mono opacity-60">{count} Shots</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Theme Highlight Banner */}
        <div className={`p-6 rounded-3xl bg-gradient-to-r ${currentTheme.bgGradient} border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-300">
              Active Showcase · {filteredPhotos.length} Photos Displayed
            </span>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
              {currentTheme.name}
            </h3>
            <p className="text-xs font-mono text-gray-800 mt-0.5">{currentTheme.subtitle}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/95 border border-gray-200 max-w-md text-xs italic text-gray-800 font-serif shadow-sm">
            {currentTheme.quote}
          </div>
        </div>

        {/* Main Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="p-12 rounded-3xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-200 text-gray-500 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-900">No photos in this category yet</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {selectedTheme === 'uploads' 
                  ? 'You haven’t uploaded any photos yet. Click "Upload Your Photos" above to add your images!'
                  : 'Try selecting another theme or resetting the aspect ratio filter.'}
              </p>
            </div>
            {selectedTheme === 'uploads' && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono"
              >
                Upload First Photo
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:border-emerald-500/60 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Photo Image Container */}
                <div 
                  onClick={() => setLightboxPhoto(photo)}
                  className="relative aspect-video w-full overflow-hidden cursor-pointer bg-gray-100"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <Badge variant="outline" className="text-[10px] font-mono font-bold bg-white/90 text-gray-900 border-gray-200 backdrop-blur-sm shadow-sm">
                      {photo.tag}
                    </Badge>
                    
                    {photo.isUserUpload && (
                      <button
                        onClick={(e) => handleDeleteUserPhoto(photo.id, e)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors border border-rose-200 shadow-sm"
                        title="Delete upload"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Quick Expand Button Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="p-3 rounded-2xl bg-white/95 text-gray-900 border border-gray-200 shadow-2xl flex items-center gap-2 text-xs font-mono font-bold">
                      <Maximize2 className="w-4 h-4 text-emerald-600" />
                      <span>Expand 4K Lightbox</span>
                    </div>
                  </div>
                </div>

                {/* Photo Details & Action Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                      <span>{photo.location || photo.resolution}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                    <span className="text-[10px] font-mono text-gray-500 truncate max-w-[120px]">
                      {photo.author || 'meUus Studio'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => copyUrl(photo.url, photo.id, e)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        title="Copy Photo URL"
                      >
                        {copiedId === photo.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => downloadPhoto(photo, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-mono font-bold text-[10px] flex items-center gap-1 transition-colors"
                        title="Download Asset"
                      >
                        <Download className="w-3 h-3" />
                        <span>Get</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setLightboxPhoto(null)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10" onClick={e => e.stopPropagation()}>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">{lightboxPhoto.title}</h3>
                <p className="text-xs font-mono text-emerald-400">{lightboxPhoto.location || lightboxPhoto.resolution}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => downloadPhoto(lightboxPhoto, e)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res</span>
                </button>
                <button
                  onClick={() => setLightboxPhoto(null)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central High-Res Photo View */}
            <div 
              className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
              />
            </div>

            {/* Bottom Metadata Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-500 bg-white/95 p-4 rounded-2xl border border-gray-200 shadow-md z-10" onClick={e => e.stopPropagation()}>
              <div>
                <span className="text-gray-800 font-bold">Specs: </span>
                <span>{lightboxPhoto.resolution} · {lightboxPhoto.aspectRatio} Ratio</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Curator: {lightboxPhoto.author || 'meUus Studio'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">100% Free for Reflection & Use</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
    </div>
  );
}
