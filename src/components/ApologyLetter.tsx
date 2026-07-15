import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Mail, Lock, Feather } from 'lucide-react';
import { SincerityLevel } from '../types';

interface ApologyLetterProps {
  partnerName: string;
  senderName: string;
  reason: string;
  customReason: string;
}

const TEMPLATES: Record<SincerityLevel, (partner: string, sender: string, reason: string) => string> = {
  sweet: (partner, sender, reason) => `حبيبتي الحلوة ${partner || 'حبيبة قلبي'}،

أردتُ أن أرسل لكِ هذه الرسالة الصغيرة لأقول لكِ كم أنا آسفٌ جداً على ${reason || 'غلطتي غير المقصودة'}.

أحياناً أتصرف بطريقة طفولية أو سخيفة، لكن أرجوكِ أن تعلمي أن قلبي مليء دائماً بالحب لكِ وحدكِ. أنتِ تستحقين الأفضل دائماً، وأعدكِ بأن أكون أكثر انتباهاً في المرات القادمة، وأن أحضر لكِ حلوتكِ المفضلة لنعوض هذا اليوم الجميل.

أنتِ شمسي المشرقة، وإنساني المفضل، وكل عالمي. هل يمكننا أن نتعانق ونتصالح؟ 🧸

مع كل حبي وحناني،
${sender || 'من يحبكِ بجنون'} 💖`,

  sincere: (partner, sender, reason) => `عزيزتي الغالية ${partner || 'حبيبة قلبي'}،

أكتب لكِ هذه الكلمات لأقدم لكِ اعتذاري الصادق والنابع من أعماق قلبي على ${reason || 'الخطأ الذي ارتكبته'}. لقد أخذت بعض الوقت لأفكر في الأمر، وأدركت تماماً كيف أثرت تصرفاتي عليكِ وعلى مشاعركِ الرقيقة.

مشاعركِ تعني لي كل شيء، ويؤلمني قلبي لمجرد التفكير في أنني كنت سبباً في أي قلق، حزن أو ضيق لكِ. أنتِ الشريكة الأكثر صبراً وحناناً ولطفاً التي يمكن لأي شخص أن يحلم بها في هذا العالم، ولا أريد أبداً أن أعتبر وجودكِ الدافئ أمراً مسلماً به.

أعدكِ بأن أستمع إليكِ بقلب مفتوح، وأتعلم من هذا الموقف، وأعمل جاهداً لأكون الشريك الذي تستحقينه حقاً. شكراً لرحابة صدركِ ولأنكِ تملأين حياتي بالسلام والدفء.

مع كامل حبي، احترامي وأسفي البالغ،
${sender || 'حبيبكِ المخلص'} 🌹`,

  melodramatic: (partner, sender, reason) => `آه يا ملكة قلبي المتوجة وساحرتي الغالية، ${partner || 'زينة'}،

أنا، الفاني الأكثر حماقة وغباءً في هذا الكون الفسيح، أكتب إليكِ من أعماق منفى حزني الأليم والظالم، باحثاً عن عفوكِ ورحمتكِ الكريمة التي لا تنضب. أنا آسفٌ جداً، وبشكل كارثي ومأساوي يفوق الوصف، على ${reason || 'غفلتي الكبرى التي لا تغتفر'}.

كيف أمكنني أن أكون بهذا العمى والجهل؟ لقد فقدت النجوم بريقها اللامع، وأصبح مذاق قهوتي الصباحية كالحنظل المر، وكفت العصافير عن الغناء منذ أن أخطأت في حقكِ. أنا الآن جاثٍ على ركبتي، غارق في بحر الندم، أتوسل لرضاكِ وعفوكِ الجميل.

أرجوكِ، أنقذي هذه الروح المسكينة واليائسة من زنازين الندم والضياع! أعدكِ بغسل الأطباق لمدة شهر كامل وكتابة ألف قصيدة غزل في عينيكِ الساحرتين.

معجبكِ الدرامي والباكي للأبد،
${sender || 'خادمكِ المطيع المطأطئ رأسه نادماً'} 🎭`,
};

export default function ApologyLetter({ partnerName, senderName, reason, customReason }: ApologyLetterProps) {
  const [sincerity, setSincerity] = useState<SincerityLevel>('sweet');
  const [isOpened, setIsOpened] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const activeReason = reason === 'other' ? (customReason || 'ارتكاب خطأ سخيف') : reason;
  const generatedLetter = TEMPLATES[sincerity](partnerName, senderName, activeReason);

  const displayedLetter = isEditing ? customDraft : generatedLetter;

  const handleStartEdit = () => {
    setCustomDraft(displayedLetter);
    setIsEditing(true);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xl shadow-pink-50/50 flex flex-col items-center w-full">
      
      {/* Wax Seal / Envelope State */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-lg bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-8 border border-pink-200/60 shadow-lg text-center flex flex-col items-center justify-center min-h-[360px] relative cursor-pointer group"
            onClick={() => setIsOpened(true)}
            id="envelope-seal-container"
          >
            {/* Stamp decoration */}
            <div className="absolute top-4 left-4 w-12 h-14 bg-white/80 border border-dashed border-pink-300 rounded p-1 flex flex-col justify-between items-start">
              <span className="text-[8px] text-pink-400 uppercase tracking-widest font-mono">حب</span>
              <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
            </div>

            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md border border-pink-100 group-hover:scale-105 transition-transform duration-300">
              <Mail className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>

            <h3 className="font-serif text-xl md:text-2xl text-slate-800 font-bold mt-6 tracking-tight">
              رسالة خاصة ومختومة لأجل {partnerName || 'حبيبة قلبي'} 💌
            </h3>
            
            <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-xs leading-relaxed">
              هذه الرسالة تم ختمها بصدق خالص وبكثير من الحب. اضغطي على الختم الشمعي الأحمر بالأسفل لفتحها وقراءتها.
            </p>

            {/* Simulated Vintage Wax Seal */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpened(true);
              }}
              className="mt-8 px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center gap-2 shadow-md shadow-rose-300/50 border border-rose-700 font-serif font-bold relative group cursor-pointer"
              id="wax-seal-button"
            >
              <div className="absolute inset-0 rounded-full bg-rose-500 blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Lock className="w-4 h-4" />
              <span>افتحي الختم الشمعي 🔴</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            {/* Sincerity Level Selection Tabs */}
            <div className="w-full bg-slate-100/80 p-1.5 rounded-2xl flex gap-1 mb-6 border border-slate-200/50">
              {(['sweet', 'sincere', 'melodramatic'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSincerity(level);
                    setIsEditing(false);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    sincerity === level && !isEditing
                      ? 'bg-white text-pink-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {level === 'sweet' ? 'لطيف 🧸' : level === 'sincere' ? 'صادق 🌹' : 'درامي 🎭'}
                </button>
              ))}
              <button
                onClick={handleStartEdit}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isEditing ? 'bg-white text-pink-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                مسودة خاصة ✏️
              </button>
            </div>

            {/* Parchment Styled Paper Scroll */}
            <div className="w-full bg-[radial-gradient(#fbf8f3_60%,#f5ecd8_100%)] border-y border-x border-amber-100 shadow-inner rounded-2xl p-6 md:p-10 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Decorative paper line watermark */}
              <div className="absolute top-0 bottom-0 right-8 border-l border-red-200/30 w-px"></div>
              
              <div className="absolute top-4 left-6 flex items-center gap-1.5 text-amber-600/40 text-[10px] font-mono select-none">
                <Feather className="w-3.5 h-3.5" />
                <span>خُطّت بكل صدق ومحبة</span>
              </div>

              {/* Letter content text area / output */}
              <div className="flex-1 mt-4 z-10">
                {isEditing ? (
                  <textarea
                    value={customDraft}
                    onChange={(e) => setCustomDraft(e.target.value)}
                    rows={12}
                    className="w-full bg-transparent border-none text-slate-800 focus:outline-none focus:ring-0 font-serif leading-relaxed text-base resize-none text-right"
                    placeholder="اكتبي رسالتكِ أو عدلي النص مباشرة هنا..."
                  />
                ) : (
                  <p className="font-serif text-slate-800 leading-relaxed text-base md:text-lg whitespace-pre-wrap text-right">
                    {displayedLetter}
                  </p>
                )}
              </div>

              {/* Decorative footer details */}
              <div className="mt-8 flex justify-between items-end border-t border-amber-200/40 pt-4 z-10 select-none">
                <span className="text-[10px] font-serif italic text-amber-800/50">
                  تم فتح الرسالة في: {new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="flex items-center gap-1 text-pink-500">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                </div>
              </div>
            </div>

            {/* Letter controls */}
            <div className="w-full mt-4 flex justify-between items-center text-xs text-slate-500 px-1">
              <span>اضغطي على الأبواب بالأعلى لتغيير أسلوب الرسالة فوراً!</span>
              <button
                onClick={() => setIsOpened(false)}
                className="hover:text-pink-600 transition-colors underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>إعادة ختم الرسالة وحفظها 🔐</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
