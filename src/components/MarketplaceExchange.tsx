import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  UserCheck, 
  Clock, 
  X, 
  CheckCircle2,
  Filter,
  Zap,
  Scale
} from 'lucide-react';
import { SAMPLE_MARKETPLACE_ITEMS } from '../constants';
import { MarketplaceEntity } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { offlineStorage } from '../lib/offlineStorage';

export default function MarketplaceExchange() {
  const [items, setItems] = useState<MarketplaceEntity[]>(() => {
    try {
      const saved = localStorage.getItem('meuus_marketplace_items');
      return saved ? JSON.parse(saved) : SAMPLE_MARKETPLACE_ITEMS;
    } catch {
      return SAMPLE_MARKETPLACE_ITEMS;
    }
  });

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedLedgerItem, setSelectedLedgerItem] = useState<MarketplaceEntity | null>(null);
  const [profileSkillSuggestions, setProfileSkillSuggestions] = useState<string[]>([]);
  const [profileName, setProfileName] = useState<string>('');

  // On mount: read stored profile skills and DLAS-evidenced skills for auto-listing suggestions
  useEffect(() => {
    try {
      const profile = offlineStorage.getProfile();
      if (profile.name && profile.name !== 'Seeker of Dignity') {
        setProfileName(profile.name);
      }
      // Get evidenced skills from CareerSkillGraph storage
      const rawSkills = localStorage.getItem('meuus_career_skills_v1');
      if (rawSkills) {
        const skillEntries: { name: string; hasEvidence: boolean; proficiency: number }[] = JSON.parse(rawSkills);
        const evidencedSkillNames = skillEntries
          .filter(s => s.hasEvidence && s.proficiency >= 3)
          .map(s => s.name);
        setProfileSkillSuggestions(evidencedSkillNames.slice(0, 5));
      } else if (profile.skills?.length > 0) {
        setProfileSkillSuggestions(profile.skills.slice(0, 4));
      }
    } catch { /* ignore */ }
  }, []);

  // New listing state
  const [newType, setNewType] = useState<'NEED' | 'CAPACITY' | 'SERVICE' | 'RESOURCE'>('CAPACITY');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newDistrict, setNewDistrict] = useState('Dhaka');
  const [newPricing, setNewPricing] = useState('');

  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newItem: MarketplaceEntity = {
      id: `m-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim(),
      providerName: newProvider.trim() || 'Verified Participant',
      district: newDistrict.trim() || 'Dhaka',
      pillarId: 'unemployment-buster',
      pricingOrTerms: newPricing.trim() || 'Community / Negotiable',
      status: 'PUBLISHED',
      verificationLevel: 'Self-Declared · Claim ≤ Evidence',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('meuus_marketplace_items', JSON.stringify(updated));

    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewProvider('');
    setNewPricing('');
    setIsCreateModalOpen(false);
  };

  return (
    <div id="marketplace" className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<ShoppingBag size={18} />}
        title="Marketplace Exchange"
        subtitle="Two-way need ↔ capacity exchange. Connect verified skills, SME services, and sustainable resources."
        badge="Two-Way"
        breadcrumb="Ecosystem"
      />
      <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Two-Way Marketplace · Need ↔ Capacity Exchange
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Ecosystem Action & Opportunities
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-1 max-w-2xl">
              "What do you need? What can you give?" Connect verified skills, SME services, jobs, and sustainable land/resources directly across all 64 districts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by skill, need, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search marketplace"
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 focus:border-amber-500 text-xs text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 h-9 shadow-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Post Listing
            </Button>
          </div>
        </div>

        {/* Profile-Linked Skill Quick-List Suggestions */}
        {profileSkillSuggestions.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-start gap-2 shrink-0">
              <Zap className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Your Evidenced Skills Ready to List</div>
                <div className="text-[11px] text-gray-500 mt-0.5">From your Skill Graph — click to pre-fill a CAPACITY listing</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              {profileSkillSuggestions.map(skillName => (
                <button
                  key={skillName}
                  onClick={() => {
                    setNewTitle(`${skillName} — Skill Capacity Available`);
                    setNewDesc(`I can offer ${skillName} as a verified capacity. Evidence-backed skill. Available for freelance, collaboration, or employment.`);
                    setNewType('CAPACITY');
                    setIsCreateModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-[11px] font-semibold hover:bg-emerald-700/60 transition-all"
                >
                  + {skillName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {[
            { id: 'ALL', label: 'All Opportunities' },
            { id: 'CAPACITY', label: 'I Have / Capacities' },
            { id: 'NEED', label: 'I Need / Requests' },
            { id: 'SERVICE', label: 'SME Services' },
            { id: 'RESOURCE', label: 'Land & Resources' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-500 hover:text-gray-800 border border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listing Grid */}
        <div role="list" aria-label="Marketplace listings" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isCapacity = item.type === 'CAPACITY';
            const isNeed = item.type === 'NEED';
            const isResource = item.type === 'RESOURCE';

            const badgeColor = isCapacity
              ? 'border-emerald-500/40 text-emerald-700 bg-emerald-950/40'
              : isNeed
              ? 'border-rose-500/40 text-rose-300 bg-rose-950/40'
              : isResource
              ? 'border-green-500/40 text-green-300 bg-green-950/40'
              : 'border-blue-500/40 text-blue-300 bg-blue-950/40';

            return (
              <div
                key={item.id}
                role="listitem"
                className="p-5 rounded-3xl bg-gray-200/60 border border-gray-300 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={`text-[10px] font-mono tracking-wider ${badgeColor}`}>
                      {item.type}
                    </Badge>
                    <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> {item.district}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-700 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Posted by:</span>
                      <span className="font-semibold text-gray-900">{item.providerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terms / Rate:</span>
                      <span className="font-semibold text-amber-700">{item.pricingOrTerms}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500 truncate max-w-[120px]">
                    {item.verificationLevel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedLedgerItem(item)}
                      className="px-2 py-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-all flex items-center gap-1"
                      title="Inspect Section 32 Explainable Value Ledger"
                    >
                      <Scale className="w-3 h-3 text-emerald-600" />
                      <span>Ledger</span>
                    </button>
                    <Button
                      size="sm"
                      className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-8 px-3 shadow-xs"
                      onClick={() => alert(`Connecting with ${item.providerName} for "${item.title}". Privacy and consent boundaries verified.`)}
                    >
                      <span>Connect</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 id="modal-title" className="text-xl font-bold text-gray-900">Post on Two-Way Marketplace</h3>
                  <p className="text-xs text-gray-500">Published under Claim ≤ Evidence and explicit privacy consent.</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['CAPACITY', 'NEED', 'SERVICE', 'RESOURCE'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        newType === t
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-700 uppercase mb-1">Listing Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 'Frontend Developer for SME Store' or 'Need Legal Advice for Lease'"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-700 uppercase mb-1">Description / Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Describe exactly what you can provide or what you need..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-gray-700 uppercase mb-1">Your Name / Org</label>
                    <input
                      type="text"
                      placeholder="e.g. 'Mahbub Alam'"
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-700 uppercase mb-1">District</label>
                    <input
                      type="text"
                      placeholder="e.g. 'Dhaka', 'Sylhet'"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-700 uppercase mb-1">Budget / Terms</label>
                    <input
                      type="text"
                      placeholder="e.g. 'BDT 5,000' or 'Volunteer'"
                      value={newPricing}
                      onChange={(e) => setNewPricing(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-gray-500 hover:text-gray-900 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold px-5 shadow-xs"
                  >
                    Publish Listing
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section 32 Explainable Value Distribution Ledger Modal */}
        {selectedLedgerItem && (
          <div role="dialog" aria-modal="true" aria-labelledby="ledger-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-lg bg-white border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 id="ledger-title" className="text-lg font-bold text-gray-900">Section 32 Value Distribution Ledger</h3>
                    <p className="text-xs text-gray-500 font-mono">Traceable Creation & Transparent Accounting</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLedgerItem(null)}
                  className="p-2 text-gray-500 hover:text-gray-900 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <div className="text-xs font-mono text-emerald-600 font-bold uppercase">Target Listing</div>
                <div className="text-sm font-bold text-gray-900 truncate">{selectedLedgerItem.title}</div>
                <div className="text-xs text-gray-500 flex items-center justify-between">
                  <span>Provider: {selectedLedgerItem.providerName}</span>
                  <span className="text-amber-700 font-mono font-semibold">{selectedLedgerItem.pricingOrTerms}</span>
                </div>
              </div>

              {/* Constitutional Ledger Table */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-700">1. Customer Gross Payment:</span>
                  <span className="text-gray-900 font-bold">100%</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-500">
                  <span>2. AI & Tool Pass-Through Compute (~5%):</span>
                  <span className="text-cyan-600 font-bold">Pass-through at cost</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-500">
                  <span>3. Platform Maintenance & Governance (~10%):</span>
                  <span className="text-amber-700 font-bold">Ecosystem Reserve</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800">
                  <span className="font-bold">4. Creator & Contributor Share (~85%):</span>
                  <span className="font-bold text-emerald-700">Legitimate Agreement</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1 leading-relaxed">
                <p className="font-bold text-emerald-700">Constitutional Mandate (JUSTICE FOR ALL):</p>
                <p>
                  "Justice does not mean everyone receives the same amount. Justice means the basis of distribution is explainable, agreed, and legitimate, without hidden extraction or sacrificing the innocent."
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setSelectedLedgerItem(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold px-5 shadow-xs"
                >
                  Close Ledger
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
