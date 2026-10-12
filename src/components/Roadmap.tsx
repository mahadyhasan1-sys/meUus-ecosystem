import React from 'react';
import PageHeader from './PageHeader';
import { motion } from 'motion/react';
import { ROADMAP } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Map, Compass } from 'lucide-react';

const STATUS_STYLES: Record<string, { color: string; icon: any; label: string }> = {
  COMPLETE: { color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, label: 'Verified Complete' },
  IN_PROGRESS: { color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Clock, label: 'In Progress' },
  PLANNED: { color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Map, label: 'Planned' },
  VISION: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Compass, label: 'Long-Term Vision' },
};

export default function Roadmap() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Compass size={18} />}
        title="Roadmap"
        subtitle="Discovery, Design, Pilot, and Production Milestones."
        badge="Horizon"
        breadcrumb="System"
      />
      <section id="roadmap" className="py-8 px-6 bg-white text-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <Badge className="mb-4 bg-emerald-600 text-white hover:bg-emerald-700">The Journey Ahead</Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Roadmap to 2030</h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl">
            We aren't just building an app; we're building the infrastructure for a nation's human development.
            Phase 01 is verified complete as of September 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {ROADMAP.map((phase: any, index: number) => {
            const statusKey = (phase.status || 'PLANNED') as string;
            const style = STATUS_STYLES[statusKey] || STATUS_STYLES['PLANNED'];
            const StatusIcon = style.icon;
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative z-10"
              >
                <Card className={`bg-white border-gray-200 text-gray-900 h-full shadow-sm hover:shadow-md transition-shadow ${statusKey === 'COMPLETE' ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-emerald-600 font-mono text-xs uppercase tracking-widest font-semibold">{phase.phase}</span>
                      <span className="text-gray-400 text-xs font-mono">{phase.period}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border mb-2 w-fit ${style.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {style.label}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {phase.items.map((item: string, i: number) => (
                        <li key={i} className={`text-xs flex gap-2 ${statusKey === 'COMPLETE' ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                          <span className="text-emerald-600 font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
    </div>
  );
}
