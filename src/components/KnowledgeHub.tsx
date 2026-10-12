import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { 
  BookOpen, 
  Search, 
  Clock, 
  FileCheck2, 
  ExternalLink, 
  Sparkles, 
  ChevronRight,
  BookMarked,
  Layers,
  X
} from 'lucide-react';
import { KNOWLEDGE_LIBRARY, CANONICAL_REVIEW_NOTE } from '../constants';
import { KnowledgeItem } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReviewNotice from './ReviewNotice';

export default function KnowledgeHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingItem, setReadingItem] = useState<KnowledgeItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'foundational', label: 'Foundational / Philosophy' },
    { id: 'quran', label: 'Qur\'an Reflections' },
    { id: 'seerah', label: 'Seerah Historical Studies' },
    { id: 'sme', label: 'SME & Economic Formalization' },
    { id: 'developmental', label: 'Emotional & Developmental' }
  ];

  const filteredItems = KNOWLEDGE_LIBRARY.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.authorOrSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="knowledge" className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<BookOpen size={18} />}
        title="Knowledge Library"
        subtitle="Preserved Civic Understanding, Source of Truth Archives, and Foundational Papers."
        badge="Archive"
        breadcrumb="Knowledge"
      />
      <div className="py-8 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              meuussoul.com · Learning & Reflection
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Knowledge Hub & Source Library
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl leading-relaxed">
              "Knowledge Before Action, Listen Before Knowledge." Access foundational texts, Qur'an & Seerah developmental readings, and practical SME/legal guides with full source transparency.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search knowledge by topic or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Global Banner Notice */}
        <div className="mb-6">
          <ReviewNotice 
            variant="banner"
            customContext="All knowledge materials are published for open learning, verification, and practical accessibility. Scholarly, legal, and professional peer reviews continue asynchronously."
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Knowledge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-[10px] font-mono tracking-wider border-emerald-200 bg-emerald-50 text-emerald-700">
                    {item.category.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                  {item.summary}
                </p>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 mb-4 space-y-1 text-[11px]">
                  <div className="text-gray-600">
                    <span className="font-semibold text-gray-800">Source:</span> {item.authorOrSource}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold text-gray-800">Evidence Level:</span> {item.evidenceLevel}
                  </div>
                </div>

                {item.reviewStatus === 'REVIEW_IN_PROGRESS' && (
                  <div className="mb-4">
                    <ReviewNotice variant="inline" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-mono font-medium text-emerald-600">
                  {item.reviewStatus}
                </span>
                <Button
                  size="sm"
                  onClick={() => setReadingItem(item)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-8 px-3.5 transition-colors"
                >
                  <span>Read Text</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Reading Modal */}
        {readingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-3xl max-h-[85vh] bg-white border border-gray-200 rounded-2xl p-6 md:p-8 overflow-y-auto shadow-xl space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-mono mb-2">
                    {readingItem.category.toUpperCase()} · {readingItem.readTime}
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {readingItem.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Source: {readingItem.authorOrSource} | Level: {readingItem.evidenceLevel}
                  </p>
                </div>
                <button
                  onClick={() => setReadingItem(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ReviewNotice 
                variant="card"
                topic={readingItem.title}
                customContext={readingItem.reviewNote}
              />

              <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {readingItem.content}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-mono">
                <span>meuussoul.com · Preserved in Canonical Library</span>
                <Button 
                  onClick={() => setReadingItem(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs"
                >
                  Close Reader
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
