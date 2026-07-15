import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, Trash2, Sparkles } from 'lucide-react';
import { LoveReason } from '../types';

const INITIAL_REASONS: LoveReason[] = [
  {
    id: '1',
    title: 'ابتسامتكِ الساحرة 🌟',
    description: 'تضيء عالمي بالكامل في ثانية واحدة، مهما كان يومي متعباً أو مليئاً بالضغوطات.',
    emoji: '✨',
  },
  {
    id: '2',
    title: 'عطفكِ وحنانكِ الدافئ 🌸',
    description: 'اهتمامكِ العميق بكل من حولكِ وطريقتكِ اللطيفة في جعل الجميع يشعرون بالحب والتقدير والراحة.',
    emoji: '🌸',
  },
  {
    id: '3',
    title: 'ضحكتكِ الجميلة 💖',
    description: 'هي صوتي المفضل على الإطلاق في هذا الكون الفسيح. سماع رنينها يملأ روحي بالفرحة والراحة الفورية.',
    emoji: '💖',
  },
  {
    id: '4',
    title: 'تفاصيلكِ الصغيرة اللطيفة 🧸',
    description: 'عاداتكِ العفوية والجميلة التي تجعلكِ فريدة ولا شبيه لكِ، مثل رقصتكِ الصغيرة اللطيفة عندما تتناولين طعاماً لذيذاً تفضلينه.',
    emoji: '🧸',
  },
  {
    id: '5',
    title: 'دعمكِ المستمر لي 💫',
    description: 'إيمانكِ بي وبقدراتي حتى عندما أجد صعوبة في تصديق نفسي. وجودكِ بقربي يدفعني دائماً لأكون شخصاً أفضل بكثير.',
    emoji: '💫',
  },
  {
    id: '6',
    title: 'صمتنا المشترك المريح 🏡',
    description: 'كيف يمكننا الجلوس معاً لساعات طويلة دون أن ننطق بكلمة واحدة، ومع ذلك نشعر بالأمان والترابط التام والعميق والراحة المطلقة.',
    emoji: '🏡',
  },
];

interface LoveReasonsProps {
  partnerName: string;
  reasons: LoveReason[];
  setReasons: (reasons: LoveReason[] | ((prev: LoveReason[]) => LoveReason[])) => void;
}

export default function LoveReasons({ partnerName, reasons, setReasons }: LoveReasonsProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmoji, setNewEmoji] = useState('💝');
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const emojis = ['💝', '✨', '🌸', '💖', '🧸', '💫', '🏡', '🥰', '🌹', '🍓', '🧁', '🌟'];

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newReason: LoveReason = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      emoji: newEmoji,
    };

    setReasons([newReason, ...reasons]);
    setNewTitle('');
    setNewDesc('');
    setNewEmoji('💝');
  };

  const handleDeleteReason = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flipping
    setReasons(reasons.filter((r) => r.id !== id));
  };

  const toggleFlip = (id: string) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xl shadow-pink-50/50">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-sm font-medium mb-3">
          <Heart className="w-4 h-4 fill-current animate-pulse" />
          <span>أسباب تجعلني أحبكِ 💖</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight font-bold">
          لماذا أنتِ شخصي المفضل في هذا العالم، يا {partnerName || 'حبيبتي'}
        </h2>
        <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">
          اضغطي على أي بطاقة لتكتشفي سراً صادقاً أو سبباً يجعل وجودكِ يعني لي الكون بأكمله ويدفعني للاعتذار والتمسك بكِ.
        </p>
      </div>

      {/* Grid of Love Reasons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-right" dir="rtl">
        <AnimatePresence mode="popLayout">
          {reasons.map((reason, index) => {
            const isFlipped = flippedCardId === reason.id;
            return (
              <motion.div
                key={reason.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="perspective-1000 h-48 cursor-pointer relative"
                onClick={() => toggleFlip(reason.id)}
                id={`love-reason-card-${reason.id}`}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Card Front */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-pink-50/90 to-rose-50/40 border border-pink-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-3xl" role="img" aria-label="emoji">
                        {reason.emoji}
                      </span>
                      {reasons.length > 3 && (
                        <button
                          onClick={(e) => handleDeleteReason(reason.id, e)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-full hover:bg-white/80 transition-colors"
                          title="حذف السبب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">
                        {reason.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-pink-400 text-xs mt-2 font-medium">
                        <Sparkles className="w-3 h-3 animate-spin-slow" />
                        <span>اضغطي لفتح البطاقة ✨</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="absolute inset-0 backface-hidden bg-rose-500 text-white rounded-2xl p-5 flex flex-col justify-between shadow-md rotateY-180 text-right">
                    <div className="overflow-y-auto max-h-32 scrollbar-none">
                      <p className="text-sm md:text-base leading-relaxed font-sans font-medium">
                        {reason.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-rose-400/30 pt-3 mt-1" dir="rtl">
                      <span className="text-xs font-serif italic text-rose-100">
                        دائماً وإلى الأبد
                      </span>
                      <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Custom Reason Form */}
      <div className="bg-rose-50/40 rounded-2xl p-5 border border-pink-100/50 max-w-2xl mx-auto text-right">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5 justify-start">
          <Plus className="w-4 h-4 text-pink-500" />
          <span>أضيفي سبباً مخصصاً لـ {partnerName || 'حبيبتي'}</span>
        </h4>
        <form onSubmit={handleAddReason} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="عنوان السبب (مثال: حنانكِ الاستثنائي، رحلتنا معاً...)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={45}
                className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-xs text-slate-500">الأيقونة:</span>
                <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-pink-200 max-h-9 overflow-x-auto">
                  {emojis.slice(0, 5).map((em) => (
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
          <div>
            <textarea
              placeholder="أخبريها لماذا يجعلها هذا السبب مميزة جداً في عينيكِ وقلبكِ..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              maxLength={200}
              className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTitle.trim() || !newDesc.trim()}
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:scale-102 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>إضافة هذا السبب 💖</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
