import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface ForgivenessGameProps {
  partnerName: string;
  senderName: string;
  onForgiveSuccess: () => void;
}

const PLEADING_MESSAGES = [
  'لا 😢',
  'هل أنتِ متأكدة تماماً؟ 🥺',
  'ماذا لو صنعت لكِ بانكيك لذيذ؟ 🥞',
  'أرجوكِ من كل قلبي؟ 🍒',
  'سأقوم بتدليك كتفيكِ طوال اليوم! 💆‍♀️',
  'انظري لعيون الجرو الحزينة هذه... 🐶',
  'زر الـ "نعم" يبدو كبيراً وجميلاً جداً هنا بالأسفل! 👇',
  'حسناً، الضغط على هذا الزر بات شبه مستحيل الآن! 😂',
];

export default function ForgivenessGame({ partnerName, senderName, onForgiveSuccess }: ForgivenessGameProps) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isHoveredOverNo, setIsHoveredOverNo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoInteraction = () => {
    if (noCount >= PLEADING_MESSAGES.length - 1) {
      // Lock or completely run away
      teleportNoButton();
      setNoCount((prev) => prev + 1);
      return;
    }

    setNoCount((prev) => prev + 1);
    teleportNoButton();
  };

  const teleportNoButton = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate a random position inside the container bounds
    // Keep it within margins so it doesn't clip outside
    const buttonWidth = 140;
    const buttonHeight = 45;
    const padding = 20;

    const maxX = rect.width - buttonWidth - padding * 2;
    const maxY = rect.height - buttonHeight - padding * 2;

    const randomX = Math.floor(Math.random() * maxX) - maxX / 2;
    const randomY = Math.floor(Math.random() * maxY) - maxY / 2;

    setNoPosition({ x: randomX, y: randomY });
  };

  // Reset the game back to start
  const handleReset = () => {
    setNoCount(0);
    setNoPosition({ x: 0, y: 0 });
  };

  // Yes button scale factor (grows bigger with every 'No' clicked!)
  const yesScale = Math.min(1 + noCount * 0.2, 2.5);

  return (
    <div
      ref={containerRef}
      className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xl shadow-pink-50/50 min-h-[420px] flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sparkly decorative floating icons */}
      <div className="absolute top-4 left-6 text-pink-200 text-3xl select-none animate-bounce">💖</div>
      <div className="absolute bottom-6 right-8 text-pink-200 text-3xl select-none animate-pulse">🧸</div>

      <div className="text-center max-w-xl mx-auto my-auto flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={noCount}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            {/* Cute GIF-style Reaction Emojis based on No Count */}
            <span className="text-6xl md:text-7xl mb-4 animate-bounce">
              {noCount === 0
                ? '🥰'
                : noCount === 1
                ? '🥺'
                : noCount === 2
                ? '🥞'
                : noCount === 3
                ? '🍒'
                : noCount === 4
                ? '💆‍♀️'
                : noCount === 5
                ? '🐶'
                : noCount === 6
                ? '👉'
                : '🔒'}
            </span>

            <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight font-bold">
              هل سامحتِني يا {partnerName || 'زينة'}؟
            </h2>

            <p className="text-slate-500 mt-2 text-sm max-w-md text-center leading-relaxed">
              {noCount === 0
                ? "أنا آسف جداً ومن أعماق قلبي على خطئي، وأريد بشدة أن أصلح كل شيء بيننا. هل تمنحيني رضاكِ وسماحكِ؟"
                : noCount < PLEADING_MESSAGES.length
                ? `مستوى الرجاء والاعتذار ${noCount}: ${PLEADING_MESSAGES[noCount]}`
                : "حسناً، لقد قمت بتعطيل زر الـ 'لا' تماماً! خياركِ المنطقي الوحيد والجميل هو مسامحتي! 💖"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Buttons Grid */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 w-full min-h-[140px] relative">
          {/* YES BUTTON (Grows bigger!) */}
          <motion.button
            onClick={onForgiveSuccess}
            animate={{ scale: yesScale }}
            transition={{ type: 'spring', damping: 12 }}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all flex items-center gap-2 cursor-pointer z-20"
            id="forgive-yes-button"
          >
            <Heart className="w-5 h-5 fill-current animate-pulse text-white" />
            <span>نعم! لقد سامحتك! 💖</span>
          </motion.button>

          {/* NO BUTTON (Teleports!) */}
          {noCount < 10 ? (
            <motion.button
              type="button"
              onMouseEnter={handleNoInteraction}
              onClick={handleNoInteraction}
              animate={{
                x: noPosition.x,
                y: noPosition.y,
                scale: Math.max(1 - noCount * 0.08, 0.5),
                opacity: Math.max(1 - noCount * 0.05, 0.3),
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 18,
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-full text-sm border border-slate-200/50 shadow-sm hover:shadow transition-colors cursor-pointer select-none z-10"
              id="forgive-no-button"
            >
              <span>
                {noCount < PLEADING_MESSAGES.length
                  ? PLEADING_MESSAGES[noCount]
                  : 'انتظري، أعني نعم! 🌸'}
              </span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs text-rose-500 font-serif italic flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>لقد انتهت صلاحية زر الـ 'لا'. يرجى الضغط على زر الرضا الوردي البراق!</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer controls */}
      {noCount > 0 && (
        <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-slate-400 text-[11px] font-sans">
          <span>محاولات قول "لا" الفاشلة: {noCount}</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 hover:text-pink-500 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة تشغيل اللعبة 🔄</span>
          </button>
        </div>
      )}
    </div>
  );
}
