import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { motion } from 'motion/react';
import { BookOpen, Compass, Sparkles, CheckCircle2, ChevronRight, Bookmark, Calendar, HeartHandshake, ShieldCheck, Sun, Star } from 'lucide-react';

interface DayLesson {
  day: number;
  title: string;
  surahOrTopic: string;
  theme: string;
  keyAyahOrHadith: string;
  actionableStep: string;
}

export default function QuranSeerahJourneys() {
  const [activeTab, setActiveTab] = useState<'quran' | 'seerah'>('quran');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3]);

  const quranDays: DayLesson[] = [
    {
      day: 1,
      title: 'The Opening: Purpose & Divine Compassion',
      surahOrTopic: 'Surah Al-Fatihah (1:1-7)',
      theme: 'Orientation, Gratitude, Seeking the Straight Path',
      keyAyahOrHadith: '“Guide us to the straight path - The path of those upon whom You have bestowed favor…” (1:6-7)',
      actionableStep: 'Before beginning any major task today, pause for 30 seconds to genuinely align your intention with truth and human service.'
    },
    {
      day: 2,
      title: 'Guidance for the Mindful & Conscious',
      surahOrTopic: 'Surah Al-Baqarah (2:1-5)',
      theme: 'Taqwa (Conscious Living), Believing in the Unseen, Steadfast Action',
      keyAyahOrHadith: '“This is the Book about which there is no doubt, a guidance for those conscious of Allah.” (2:2)',
      actionableStep: 'Identify one habitual doubt holding you back and replace it with disciplined, truthful action.'
    },
    {
      day: 23,
      title: 'Gratitude & Patience Through Trials',
      surahOrTopic: 'Surah Al-Baqarah (2:152-157)',
      theme: 'Sabr (Patience), Shukr (Gratitude), Inner Equilibrium',
      keyAyahOrHadith: '“So remember Me; I will remember you. And be grateful to Me and do not deny Me.” (2:152)',
      actionableStep: 'Write down 3 unmerited blessings in your life and share an encouraging word with someone struggling.'
    },
    {
      day: 114,
      title: 'The Sanctuary of Humankind & Community Shield',
      surahOrTopic: 'Surah An-Nas (114:1-6)',
      theme: 'Seeking Protection, Integrity of Heart, Collective Healing',
      keyAyahOrHadith: '“Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind…” (114:1-3)',
      actionableStep: 'Reflect on the full 114-day arc: Commit to protecting those vulnerable in your neighborhood.'
    }
  ];

  const seerahDays: DayLesson[] = [
    {
      day: 1,
      title: 'Al-Amin: Trustworthiness Before Status',
      surahOrTopic: 'Pre-Prophethood Era',
      theme: 'Integrity, Social Trust, The Hilf al-Fudul (Pact of the Virtuous)',
      keyAyahOrHadith: 'The Prophet (ﷺ) championed the oppressed in Mecca long before receiving revelation through the Pact of Justice.',
      actionableStep: 'Uphold an ethical promise or contract today even if it brings no immediate personal advantage.'
    },
    {
      day: 20,
      title: 'The Cave of Hira: Seeking Solitude & Deep Reflection',
      surahOrTopic: 'First Revelation (Iqra)',
      theme: 'Contemplation, Overcoming Fear, The Call to Read & Learn',
      keyAyahOrHadith: '“Read in the name of your Lord who created…” (96:1)',
      actionableStep: 'Spend 20 minutes without screens or notifications reflecting on your core life mission.'
    },
    {
      day: 45,
      title: 'The Constitution of Medina: Pluralism & Mutual Defense',
      surahOrTopic: 'Medinan Era Governance',
      theme: 'Civic Contract, Religious Freedom, Universal Protection',
      keyAyahOrHadith: 'The Medina Charter unified diverse tribes and faiths under a single civic covenant of justice and mutual aid.',
      actionableStep: 'Reach out to a peer of a different background or trade and identify a shared community project.'
    },
    {
      day: 80,
      title: 'The Farewell Address: Universal Human Equality',
      surahOrTopic: 'Hajjat al-Wada (Final Sermon)',
      theme: 'Human Rights, Abolition of Racism, Sacred Sanctity of Life & Wealth',
      keyAyahOrHadith: '“All mankind is from Adam and Eve. An Arab has no superiority over a non-Arab, nor a non-Arab over an Arab…”',
      actionableStep: 'Actively dismantle any subtle prejudice in your thoughts and promote fair wages/dignity for daily workers.'
    }
  ];

  const activeDays = activeTab === 'quran' ? quranDays : seerahDays;
  const currentLesson = activeDays.find(d => d.day === selectedDay) || activeDays[0];

  const toggleComplete = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(d => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Star size={18} />}
        title="Quran & Seerah Journeys"
        subtitle="114-Day Quran and 80-Day Seerah Longitudinal Learning Tracks with Citations."
        badge="Civic Foundation"
        breadcrumb="Knowledge"
      />
      <section id="soul-journeys" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      {/* Background Islamic Geometric & Starlight Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5" />
            <span>Islamic Ethical Foundations & Spiritual Grounding</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
            Quran & Seerah <span className="text-amber-400">Learning Journeys</span>
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-sans">
            Nourish your soul with structured, daily transformative reflection. Connecting eternal ethical wisdom (Knowledge · Wisdom · Truth · Compassion · Justice) with practical life progress in Bangladesh.
          </p>
        </div>

        {/* Tab Selector & Stats Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-gray-50 border border-gray-200 backdrop-blur-md">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('quran'); setSelectedDay(1); }}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'quran'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>114-Day Quran Journey</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/40">114 Lessons</span>
            </button>
            <button
              onClick={() => { setActiveTab('seerah'); setSelectedDay(1); }}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'seerah'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>80-Day Seerah Journey</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-400/40">80 Lessons</span>
            </button>
          </div>

          <div className="flex items-center gap-4 px-4 text-xs font-mono text-gray-500">
            <span>Completed: <strong className="text-emerald-600">{completedDays.length}</strong> / {activeTab === 'quran' ? '114' : '80'}</span>
            <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (completedDays.length / (activeTab === 'quran' ? 114 : 80)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Journey Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Day / Surah Selector Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 px-2 flex items-center justify-between">
              <span>Curated Milestones</span>
              <span className="text-[10px] text-emerald-600">Self-Paced Track</span>
            </h3>

            <div className="space-y-2.5">
              {activeDays.map((item) => {
                const isSelected = selectedDay === item.day;
                const isDone = completedDays.includes(item.day);
                return (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-1 ring-emerald-500/50 text-gray-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          Day {item.day}
                        </span>
                        <span className="text-xs font-semibold text-gray-900">{item.surahOrTopic}</span>
                      </div>
                      <p className="text-xs font-serif text-gray-600 line-clamp-1">{item.title}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Daily Commitment Reminder */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>The meUus Learning Covenant</span>
              </div>
              <p className="text-amber-900 leading-relaxed text-[11px]">
                "The most beloved of deeds to Allah are those that are most consistent, even if they are small." (Sahih al-Bukhari). Spend 10 intentional minutes daily.
              </p>
            </div>
          </div>

          {/* Active Lesson Deep Card */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              key={`${activeTab}-${currentLesson.day}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6 relative"
            >
              {/* Top Banner Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-semibold">
                    {activeTab === 'quran' ? '114-Day Quranic Transformation' : '80-Day Prophetic Seerah Journey'}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mt-1">
                    Day {currentLesson.day}: {currentLesson.title}
                  </h3>
                  <p className="text-xs font-mono text-amber-700 font-medium mt-0.5">{currentLesson.surahOrTopic}</p>
                </div>

                <button
                  onClick={() => toggleComplete(currentLesson.day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    completedDays.includes(currentLesson.day)
                      ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedDays.includes(currentLesson.day) ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>

              {/* Core Ayah / Hadith Display */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Core Foundational Text & Reflection</span>
                </div>
                <p className="text-base md:text-lg font-serif italic text-gray-800 leading-relaxed">
                  {currentLesson.keyAyahOrHadith}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-gray-500">
                  <span className="text-emerald-600 font-bold">Theme:</span>
                  <span>{currentLesson.theme}</span>
                </div>
              </div>

              {/* Practical Actionable Step */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold uppercase">
                  <Compass className="w-4 h-4" />
                  <span>Today's Actionable Life Step</span>
                </div>
                <p className="text-sm md:text-base text-gray-800 leading-relaxed font-sans">
                  {currentLesson.actionableStep}
                </p>
              </div>

              {/* Interactive Soul Reflection Scratchpad */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-500">
                  My Daily Soul Reflection & Invariant Check (Saved to Master Soul Profile):
                </label>
                <textarea
                  placeholder="What truth resonated with your life circumstances today? What honest action will you take tomorrow morning?"
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none shadow-xs"
                />
              </div>

              {/* Five Islamic Ethical Pillars Quick Matrix */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                  Five Invariant Pillars of Islamic Ethics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { name: 'Knowledge', desc: 'Ilm & Inquiry', color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800' },
                    { name: 'Wisdom', desc: 'Hikmah & Balance', color: 'border-teal-200 bg-teal-50/70 text-teal-800' },
                    { name: 'Truth', desc: 'Sidq & Honesty', color: 'border-blue-200 bg-blue-50/70 text-blue-800' },
                    { name: 'Compassion', desc: 'Rahmah & Care', color: 'border-amber-200 bg-amber-50/70 text-amber-800' },
                    { name: 'Justice', desc: 'Adl & Equity', color: 'border-purple-200 bg-purple-50/70 text-purple-800' },
                  ].map((p, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl border ${p.color}`}>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-[10px] text-gray-600 mt-0.5">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
