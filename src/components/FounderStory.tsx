import React from 'react';
import PageHeader from './PageHeader';
import { motion } from 'motion/react';
import { Quote, Sparkles, ShieldCheck, Heart, MapPin, Award, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FounderStory() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Heart size={18} />}
        title="Founder Story"
        subtitle="Md. Mahady Hasan (Rujbel / Ruju) — Client #001 and The Journey of meUus."
        badge="Client #001"
        breadcrumb="Transparency"
      />
      <section id="founder" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Portrait & Quoted Vision Frame (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative space-y-4"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-md border-2 border-emerald-500/40 relative bg-white group">
              <img 
                src="/founder-a01.jpeg" 
                alt="Md. Mahady Hasan — Rujbel / Ruju, Founder of meUus" 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <Badge variant="outline" className="border-emerald-500/60 text-emerald-700 text-[10px] font-mono bg-gray-50 backdrop-blur-md">
                  FOUNDER & CHIEF ARCHITECT · RUJBEL / RUJU
                </Badge>
                <h4 className="text-xl font-serif font-bold text-white">Md. Mahady Hasan</h4>
                <p className="text-xs text-emerald-600 font-mono">The Human Behind The Starting Point · Client #001</p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href="https://wa.me/8801756104026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <span>WhatsApp: +880 1756 104026</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quoted Callout Card */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm relative space-y-3">
              <Quote className="text-emerald-600" size={28} />
              <p className="text-sm font-serif italic text-gray-800 leading-relaxed">
                “In Bangladesh, people don't face one problem. They face everything at once: no job, no legal help, no mental support, and no direction. What if one system could support the whole human?”
              </p>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] font-mono text-emerald-600">
                <span>Swagda, Cumilla → Mirpur-2, Dhaka</span>
                <span>৳1 Lakh Initial Capital</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founder Narrative (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5" />
                <span>The Living Origin & Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
                The Story Behind <span className="text-emerald-600">meUus</span>
              </h2>
            </div>

            <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
              <p>
                My name is <strong>Md. Mahady Hasan</strong>. I was born in a small village called <em>Swagda</em> in Cumilla. Growing up, we weren't rich, but we had deep values. My father served honorably in the Bangladesh Navy; my mother held the family together quietly with patience, prayer, and unwavering strength.
              </p>
              <p>
                I studied Law, worked across businesses, and consulted with thousands of citizens throughout Bangladesh. What I saw was always the same heartbreak: people coming in asking for one small service, but carrying five heavier burdens underneath.
              </p>
              <p>
                A person seeking a trade licence was often drowning in unsecured debt, suffering from quiet emotional exhaustion, navigating family strain, and losing hope. Every existing institution touched only one isolated piece. <em>Never the whole human person.</em>
              </p>
              <p className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 font-medium text-emerald-900 font-serif">
                “meUus is not just an organisation or an app. It is an ecosystem. 'Me' — the individual starting point. 'U' — you, the human standing before us. 'Us' — the united community. Nine solutions, one ecosystem.”
              </p>
            </div>

            {/* Statistics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
                <p className="text-2xl font-bold font-mono text-emerald-600">৳1 Lakh</p>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Initial Capital</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
                <p className="text-2xl font-bold font-mono text-blue-600">Swagda</p>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Origin (Cumilla)</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
                <p className="text-2xl font-bold font-mono text-purple-600">Mirpur-2</p>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">First Work Hub</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
                <p className="text-2xl font-bold font-mono text-amber-600">9 Hubs</p>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Whole Human</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
