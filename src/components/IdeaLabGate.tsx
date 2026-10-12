import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from './PageHeader';

export default function IdeaLabGate() {
  const [step, setStep] = useState(0);
  
  const gates = [
    { title: 'Ethical Alignment', description: 'Does the idea align with human dignity and values?' },
    { title: 'Viability Check', description: 'Is there a clear path to sustainability in Bangladesh?' },
    { title: 'Impact Assessment', description: 'How many lives will this idea touch?' },
    { title: 'Final Review', description: 'Ready for seed funding and mentorship.' }
  ];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Lightbulb size={18} />}
        title="Idea Lab"
        subtitle="From Initial Spark to Scaled Execution — Human Intention Incubator."
        badge="Innovation"
        breadcrumb="Ecosystem"
      />
      <section className="py-8 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Idea Lab</Badge>
            <h2 className="text-4xl font-serif font-bold mb-6">The Gate-Review Process</h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Every Bangladesh success story starts with an idea. We make sure the idea has a home — and a rigorous path to reality.
            </p>
            <div className="space-y-4">
              {gates.map((gate, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${step === i ? 'bg-white shadow-md border border-yellow-100' : 'opacity-50'}`}>
                  <div className="mt-1">
                    {step > i ? <CheckCircle2 className="text-emerald-500" /> : <Circle className={step === i ? 'text-yellow-500' : 'text-gray-700'} />}
                  </div>
                  <div>
                    <h4 className="font-bold">{gate.title}</h4>
                    <p className="text-sm text-gray-400">{gate.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-2xl bg-white p-8">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto mb-4">
                <Lightbulb size={32} />
              </div>
              <CardTitle className="text-2xl">Submit Your Idea</CardTitle>
              <CardDescription>Start your journey through the Idea Lab gates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Idea Name</label>
                <input type="text" placeholder="e.g. Solar-powered irrigation" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Problem it Solves</label>
                <textarea placeholder="Describe the challenge..." className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]" />
              </div>
              <Button 
                onClick={() => setStep((s) => (s + 1) % 4)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-12 rounded-xl font-bold"
              >
                {step === 3 ? 'Restart Process' : 'Next Gate'} <ArrowRight className="ml-2" size={18} />
              </Button>
              <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
                Gate Review Fee: ৳500 (Waived for Tier 1)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    </div>
  );
}
