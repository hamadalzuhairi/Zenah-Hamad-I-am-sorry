import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Plus, Trash2, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { Memory } from '../types';

const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'لقاؤنا الأول الساحر في الهاكاثون ✨',
    date: 'يوم اللقاء الأول الخالد',
    description: 'من أول مرة شفتك فيها في الهاكاثون وتكلمنا، حسيت بشعور ما أحسه مع كل الناس من أول لقاء. كان شعوراً مليئاً بالأمان والراحة، وكنت حاس إني مطمئن جداً وأنا أتكلم معك. ✨\n\nوفي اليوم الثاني لما شفتك، تمنيت إنك تزورين البوث اللي كنت فيه. كنت دايماً أتأملك وقتها من بعيد، وأدعي بقلبي إنك بس تجين لو لدقيقة وحدة. هذا الشعور بالاهتمام بشخص، ما حسيته إلا لك يا زينة. 💖\n\nلما كنتِ تتكلمين، كنت دايماً أتأملك وأناظر لعيونك. عيونك -ما شاء الله- كانت تجيب لي الراحة والسكينة، وابتسامتك كانت تسعدني وتنسيني أي ألم كنت أحس فيه. 🥰\n\nمن وقتها، عرفت إنك الشخص اللي أبغى أكون معاه، أعيش معاه، وأبني معاه أسرة. أوعدك إني دايماً بكون معك ودايماً بسعدك، لأنك صرتِ أولوية بحياتي. 💍\n\nزينة.. أحبك من كل قلبي. ❤️\n\n— من: حمد الزهيري 💌',
    emoji: '✨',
  },
  {
    id: '2',
    title: 'أول ضحكة حقيقية من القلب 😂',
    date: 'تلك الأمسية المليئة بالبهجة',
    description: 'عندما جعلتنا دعابة داخلية مضحكة نضحك بشدة حتى كدنا لا نستطيع التنفس. سماع ضحكتكِ الصادقة كان اللحظة التي وقعت فيها في حبكِ بالكامل.',
    emoji: '😂',
  },
  {
    id: '3',
    title: 'موعدنا المثالي الأول 🌹',
    date: 'مساء جمعة دافئ',
    description: 'فقدنا الإحساس بالوقت تماماً ونحن نتحدث عن كل شيء وعن لا شيء. شعرنا وكأننا نعرف بعضنا منذ دهور.',
    emoji: '🌹',
  },
  {
    id: '4',
    title: 'ذلك اليوم الماطر الهادئ 🌧️',
    date: 'أحد دافئ ومريح',
    description: 'ملتفين تحت غطاء دافئ، نشرب الشاي الساخن ونستمع إلى قطرات المطر وهي تلامس النافذة، غارقين في حبنا التام.',
    emoji: '🌧️',
  },
];

interface MemoryTimelineProps {
  partnerName: string;
  memories: Memory[];
  setMemories: (memories: Memory[] | ((prev: Memory[]) => Memory[])) => void;
}

export default function MemoryTimeline({ partnerName, memories, setMemories }: MemoryTimelineProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmoji, setNewEmoji] = useState('💕');

  const emojis = ['💕', '✨', '😂', '🌹', '🌧️', '✈️', '🍿', '🏡', '🎒', '🍣', '🍰', '🌊'];

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !newDate.trim()) return;

    const newMemory: Memory = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      date: newDate.trim(),
      description: newDesc.trim(),
      emoji: newEmoji,
    };

    // Sort or append to timeline
    setMemories([...memories, newMemory]);
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
    setNewEmoji('💕');
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xl shadow-pink-50/50">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4 text-pink-500 animate-pulse" />
          <span>رحلة حبنا الجميلة 💖</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight font-bold">
          شريط الذكريات: أوقاتنا السعيدة مع {partnerName || 'حبيبتي'}
        </h2>
        <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">
          مجموعة من أسعد اللحظات والمحطات التي عشناها معاً. لأننا حتى لو واجهنا بعض العقبات البسيطة، فإن أساسنا مبني على ذكريات رائعة تدوم للأبد وتجمعنا دائماً بصدق.
        </p>
      </div>

      {/* Memory Lane Timeline Display */}
      <div className="relative border-r-2 border-pink-100 mr-4 md:mr-8 pr-6 md:pr-10 space-y-8 mb-8 max-w-3xl mx-auto text-right">
        <AnimatePresence mode="popLayout">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative group animate-fade-in"
              id={`memory-timeline-item-${memory.id}`}
            >
              {/* Chronological Circle Node */}
              <div className="absolute -right-[39px] md:-right-[47px] top-1.5 w-6 h-6 rounded-full bg-pink-500 border-4 border-white shadow-sm flex items-center justify-center text-xs text-white z-10 group-hover:scale-110 transition-transform">
                <Heart className="w-2.5 h-2.5 fill-current" />
              </div>

              {/* Memory Card */}
              <div className="bg-gradient-to-br from-white to-pink-50/10 rounded-2xl p-5 border border-pink-100/60 shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 relative">
                {/* Delete button (only show if we have more than 3 memories) */}
                {memories.length > 3 && (
                  <button
                    onClick={() => handleDeleteMemory(memory.id)}
                    className="absolute top-4 left-4 text-slate-300 hover:text-rose-500 p-1 rounded-full hover:bg-slate-50 transition-colors"
                    title="حذف الذكرى"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-start gap-4">
                  {/* Emoji Block */}
                  <span className="text-4xl bg-pink-50/50 p-2.5 rounded-xl border border-pink-100/50 flex-shrink-0" role="img" aria-label="memory emoji">
                    {memory.emoji}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full uppercase">
                      <Calendar className="w-3 h-3" />
                      <span>{memory.date}</span>
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">
                      {memory.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-sans font-medium whitespace-pre-line">
                      {memory.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Custom Memory Block */}
      <div className="bg-pink-50/40 rounded-2xl p-5 border border-pink-100/50 max-w-2xl mx-auto text-right">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5 justify-start">
          <Plus className="w-4 h-4 text-pink-500" />
          <span>أضيفي ذكرى جميلة أخرى من ذكرياتنا المشتركة</span>
        </h4>
        <form onSubmit={handleAddMemory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="عنوان الذكرى (مثال: رحلتنا الأولى إلى البحر)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={40}
                required
                className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="التاريخ/الوقت (مثال: أكتوبر الماضي، صيف 2025)"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                maxLength={25}
                required
                className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="md:col-span-3">
              <textarea
                placeholder="اكتبي تذكيراً لطيفاً يصف ما حدث ولماذا تعد هذه الذكرى قريبة جداً من قلبكِ المشترك..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                maxLength={250}
                required
                className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 h-full pb-2 md:pb-0 justify-end">
                <span className="text-xs text-slate-500">الأيقونة:</span>
                <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-pink-200 max-h-16 overflow-y-auto">
                  {emojis.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setNewEmoji(em)}
                      className={`text-base p-0.5 rounded transition-transform ${
                        newEmoji === em ? 'bg-pink-100 scale-110' : 'hover:scale-105'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTitle.trim() || !newDesc.trim() || !newDate.trim()}
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>تسجيل الذكرى في شريطنا 💖</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
