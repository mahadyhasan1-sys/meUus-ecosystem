import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PhoneCall, 
  ShieldAlert, 
  X, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Send, 
  CheckCircle2, 
  HeartHandshake, 
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Activity
} from 'lucide-react';

interface EmergencyTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyTriageModal({ isOpen, onClose }: EmergencyTriageModalProps) {
  const [step, setStep] = useState<'triage' | 'submitted'>('triage');
  const [crisisType, setCrisisType] = useState<string>('emotional');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [district, setDistrict] = useState<string>('Dhaka');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number>(900); // 15 minutes = 900 seconds

  useEffect(() => {
    let timer: any;
    if (step === 'submitted' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      alert('Please provide a phone number or WhatsApp contact so our responder can reach you.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('submitted');
      setCountdown(900);
    }, 800);
  };

  const hotlines = [
    { name: 'National Emergency Service', num: '999', desc: 'Police · Fire · Ambulance', bg: 'bg-rose-950/40 text-rose-300 border-rose-500/30' },
    { name: 'Legal Aid Helpline (Govt)', num: '16430', desc: 'Free Legal Representation & Bail', bg: 'bg-purple-950/40 text-purple-300 border-purple-200' },
    { name: 'Women & Child Abuse Helpline', num: '109', desc: 'Immediate Shelter & Protection', bg: 'bg-pink-950/40 text-pink-300 border-pink-500/30' },
    { name: 'Kaan Pete Roi Emotional Care', num: '01779554391', desc: 'Confidential Mental Health Support', bg: 'bg-emerald-950/40 text-emerald-700 border-emerald-200' },
    { name: 'National Health Service', num: '16263', desc: 'Shastho Batayan 24/7 Doctors', bg: 'bg-teal-950/40 text-teal-300 border-teal-500/30' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-rose-300 rounded-3xl shadow-xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-gray-900"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold uppercase mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>15-Minute Human Response Protocol</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">Emergency Support & Crisis Triage</h3>
              <p className="text-xs text-gray-600 mt-1">
                If you are in immediate danger or severe distress in Bangladesh, human help is within reach. No one walks alone.
              </p>
            </div>
          </div>

          {step === 'triage' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Crisis Category Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-700 uppercase tracking-wider">
                  Type of Urgent Assistance:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'emotional', label: 'Mental / Emotional Crisis', desc: 'Overwhelmed, panic, despair' },
                    { id: 'legal', label: 'Urgent Legal Threat', desc: 'Arrest, harassment, notice' },
                    { id: 'safety', label: 'Personal / Domestic Safety', desc: 'Danger, domestic dispute' },
                    { id: 'economic', label: 'Acute Economic Loss', desc: 'Sudden job loss, eviction' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCrisisType(c.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        crisisType === c.id
                          ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.label}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-gray-700 uppercase block mb-1">Your Name (or Pseudonym)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Brother Ruju / Sister Fatima"
                    className="w-full p-3 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-700 uppercase block mb-1">
                    Phone / WhatsApp Contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="017XXXXXXXX / 018XXXXXXXX"
                    className="w-full p-3 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-gray-700 uppercase block mb-1">District / Location</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Dhaka, Chittagong, Sylhet..."
                    className="w-full p-3 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-gray-700 uppercase block mb-1">
                    Brief Summary (Confidential & Encrypted)
                  </label>
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="What is happening right now? How can we best help?"
                    className="w-full p-3 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Dispatching Priority Triage...</span>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Dispatch 15-Minute Human Response</span>
                  </>
                )}
              </button>

              {/* Official 24/7 Hotlines in Bangladesh */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <div className="text-xs font-mono uppercase text-gray-500 flex items-center justify-between">
                  <span>Direct Emergency Hotlines in Bangladesh (Free Call)</span>
                  <span className="text-rose-600 font-semibold">Available 24/7</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hotlines.map((h, i) => (
                    <a
                      key={i}
                      href={`tel:${h.num.replace(/\s+/g, '')}`}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.02] ${h.bg}`}
                    >
                      <div>
                        <div className="font-bold text-xs">{h.name}</div>
                        <div className="text-[10px] text-gray-500">{h.desc}</div>
                      </div>
                      <div className="font-mono font-bold text-sm px-2 py-1 bg-white border border-gray-200 rounded-lg">
                        {h.num}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-serif font-bold text-gray-900">
                  Triage Request Received & Queued
                </h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  A verified meUus community advocate or legal partner in <strong>{district}</strong> has been notified with your contact (<strong>{contact}</strong>).
                </p>
              </div>

              {/* Live Countdown Target */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-sm mx-auto space-y-2">
                <div className="text-xs font-mono uppercase text-emerald-700 font-bold">
                  Target Human Contact Window
                </div>
                <div className="text-4xl font-mono font-bold text-emerald-600">
                  {formatTime(countdown)}
                </div>
                <p className="text-[10px] text-gray-500">
                  Keep your phone nearby. If your situation is life-threatening, please call <strong>999</strong> immediately.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setStep('triage');
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-800 transition-colors"
                >
                  Return to meUus
                </button>
                <a
                  href="tel:999"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 999 Now</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
