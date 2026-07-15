import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Gift, Mail, Calendar, Ticket, User, MessageCircle, HelpCircle, HeartHandshake, RefreshCw, Star, Lock, ShieldAlert } from 'lucide-react';
import { SincerityLevel, LoveCoupon, Memory, LoveReason } from './types';
import ApologyLetter from './components/ApologyLetter';
import ForgivenessGame from './components/ForgivenessGame';
import BouquetBuilder from './components/BouquetBuilder';
import LoveCoupons from './components/LoveCoupons';
import MemoryTimeline from './components/MemoryTimeline';
import LoveReasons from './components/LoveReasons';
import HamadDashboard from './components/HamadDashboard';

interface HeartParticle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export default function App() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Global personalization state
  const [partnerName, setPartnerName] = useState('زينة رشاد');
  const [senderName, setSenderName] = useState('حمد');
  const [selectedReason, setSelectedReason] = useState('مزاجيتي بالأمس 🥺');
  const [customReason, setCustomReason] = useState('');
  const [isForgiven, setIsForgiven] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'game' | 'flowers' | 'coupons' | 'memories' | 'reasons'>('letter');
  
  // Setup panel visible state
  const [showSetup, setShowSetup] = useState(true);
  // Dashboard panel visible state (collapsible)
  const [showDashboard, setShowDashboard] = useState(true);

  // Lifted states from components
  const [selectedFlowers, setSelectedFlowers] = useState<{ id: string; timestamp: number }[]>([]);
  const [wrappingColor, setWrappingColor] = useState<'pink' | 'lavender' | 'kraft'>('pink');
  const [bouquetGifted, setBouquetGifted] = useState(false);
  const [ribbonMessage, setRibbonMessage] = useState('من كل قلبي');

  const [coupons, setCoupons] = useState<LoveCoupon[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [reasons, setReasons] = useState<LoveReason[]>([]);

  // Activity logs from backend
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Hamad login state (persisted to localStorage)
  const [isHamadLoggedIn, setIsHamadLoggedIn] = useState(() => localStorage.getItem('isHamadLoggedIn') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Background floating hearts
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  // Email test sending state
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  // Ref to track last synced state to prevent loops
  const lastFetchedStateRef = useRef<string>('');
  const lastSavedTimeRef = useRef<number>(0);

  // Reusable fetch function
  const fetchState = (force = false) => {
    if (!force && Date.now() - lastSavedTimeRef.current < 6000) {
      return Promise.resolve();
    }
    return fetch('/api/state')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (data) {
          const stringified = JSON.stringify(data);
          if (stringified === lastFetchedStateRef.current) {
            return;
          }
          lastFetchedStateRef.current = stringified;

          if (data.partnerName !== undefined) setPartnerName(data.partnerName);
          if (data.senderName !== undefined) setSenderName(data.senderName);
          if (data.selectedReason !== undefined) setSelectedReason(data.selectedReason);
          if (data.customReason !== undefined) setCustomReason(data.customReason);
          if (data.isForgiven !== undefined) setIsForgiven(data.isForgiven);
          if (data.activeTab !== undefined) setActiveTab(data.activeTab);
          
          if (data.bouquet) {
            if (data.bouquet.selectedFlowers !== undefined) setSelectedFlowers(data.bouquet.selectedFlowers);
            if (data.bouquet.wrappingColor !== undefined) setWrappingColor(data.bouquet.wrappingColor);
            if (data.bouquet.ribbonMessage !== undefined) setRibbonMessage(data.bouquet.ribbonMessage);
            if (data.bouquet.bouquetGifted !== undefined) setBouquetGifted(data.bouquet.bouquetGifted);
          }
          if (data.coupons !== undefined) setCoupons(data.coupons);
          if (data.memories !== undefined) setMemories(data.memories);
          if (data.reasons !== undefined) setReasons(data.reasons);
          if (data.activityLogs !== undefined) setActivityLogs(data.activityLogs);
        }
      });
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchState(true)
      .catch((err) => console.error('Error fetching initial state:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Poll state every 4 seconds for instant feel
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      fetchState().catch((err) => console.error('Error polling state:', err));
    }, 4000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Save state to server when states change
  useEffect(() => {
    if (isLoading) return;

    const fullState = {
      partnerName,
      senderName,
      selectedReason,
      customReason,
      isForgiven,
      activeTab,
      bouquet: {
        selectedFlowers,
        wrappingColor,
        ribbonMessage,
        bouquetGifted,
      },
      coupons,
      memories,
      reasons,
      activityLogs,
    };

    const stateStr = JSON.stringify(fullState);
    if (stateStr === lastFetchedStateRef.current) {
      return;
    }

    lastFetchedStateRef.current = stateStr;
    lastSavedTimeRef.current = Date.now();

    const controller = new AbortController();
    fetch('/api/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: stateStr,
      signal: controller.signal,
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Error saving state:', err);
      }
    });

    return () => {
      controller.abort();
    };
  }, [
    isLoading,
    partnerName,
    senderName,
    selectedReason,
    customReason,
    isForgiven,
    activeTab,
    selectedFlowers,
    wrappingColor,
    ribbonMessage,
    bouquetGifted,
    coupons,
    memories,
    reasons,
    activityLogs,
  ]);

  useEffect(() => {
    // Generate random floating hearts for atmospheric effect
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of screen width
      size: Math.min(Math.random() * 24 + 12, 32), // px size
      delay: Math.random() * 5, // start delay
      duration: Math.random() * 6 + 6, // float duration
    }));
    setHearts(newHearts);
  }, []);

  const handleForgiveSuccess = () => {
    setIsForgiven(true);
    // Auto-scroll to top to reveal celebration
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Send immediate email notification to Hamad
    fetch('/api/notify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'forgive',
      }),
    }).catch((err) => console.error('Error sending email notification:', err));
  };

  const resetApology = () => {
    setIsForgiven(false);
    setActiveTab('letter');
  };

  const handleSendTestEmail = () => {
    setEmailStatus('sending');
    setEmailErrorMsg('');
    fetch('/api/notify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'test',
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to reach backend API');
        return res.json();
      })
      .then(() => {
        setEmailStatus('success');
      })
      .catch((err) => {
        console.error('Error sending test email:', err);
        setEmailStatus('error');
        setEmailErrorMsg(err.message || 'حدث خطأ أثناء محاولة إرسال بريد التفعيل');
      });
  };

  const handleHamadLogout = () => {
    setIsHamadLoggedIn(false);
    localStorage.setItem('isHamadLoggedIn', 'false');
  };

  const handleClearLogs = () => {
    fetch('/api/clear-logs', {
      method: 'POST'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to clear database completely');
        return res.json();
      })
      .then(() => {
        // Reload page to fetch the clean default state
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error completely resetting database:', err);
      });
  };

  // Pre-configured typical reasons chosen by Zeina
  const PRESETS_REASONS = [
    'مزاجيتك وأسلوبك بالأمس 🥺',
    'تأخرك في الرد على رسائلي الجميلة 📱',
    'عدم استماعك بتركيز كافٍ أثناء حديثنا 💬',
    'أكلك لآخر قطعة طعام لذيذة في الثلاجة 🍕',
    'انشغالك الزائد بالألعاب أو الدراسة ونسيان الوقت 🎮',
    'other',
  ];

  const getDisplayReason = () => {
    if (selectedReason === 'other') {
      return customReason || 'ارتكاب خطأ سخيف';
    }
    const reasonMap: { [key: string]: string } = {
      'مزاجيتك وأسلوبك بالأمس 🥺': 'مزاجيتي وأسلوبي بالأمس 🥺',
      'تأخرك في الرد على رسائلي الجميلة 📱': 'تأخري في الرد على رسائلكِ الجميلة 📱',
      'عدم استماعك بتركيز كافٍ أثناء حديثنا 💬': 'عدم استماعي بتركيز كافٍ أثناء حديثنا 💬',
      'أكلك لآخر قطعة طعام لذيذة في الثلاجة 🍕': 'أكلي لآخر قطعة طعام لذيذة في الثلاجة 🍕',
      'انشغالك الزائد بالألعاب أو الدراسة ونسيان الوقت 🎮': 'انشغالي الزائد بالألعاب أو الدراسة ونسيان الوقت 🎮',
    };
    return reasonMap[selectedReason] || selectedReason;
  };

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#faf5f0] flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="text-pink-500 mb-4"
        >
          <Heart className="w-16 h-16 fill-current text-pink-500" />
        </motion.div>
        <p className="text-slate-500 font-serif font-bold text-lg animate-pulse">
          جاري تحميل حديقة الحب والتصالح... 💖
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#faf5f0] text-slate-800 relative overflow-x-hidden font-sans pb-16 selection:bg-pink-100 selection:text-pink-600">
      
      {/* Floating Hearts Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: '105vh', x: `${heart.x}vw`, opacity: 0, scale: 0.8 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.4, 0.4, 0],
              scale: [0.8, 1.1, 0.9, 1],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-pink-300/40 select-none"
            style={{ fontSize: `${heart.size}px` }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-10 relative z-10">
        
        {/* Safe Portal Entry bar */}
        <div className="flex justify-between items-center mb-6 border-b border-pink-100/30 pb-3" id="hamad-safe-portal-bar">
          <div className="text-xs text-slate-400 font-medium">
            {isHamadLoggedIn ? (
              <span className="flex items-center gap-1.5 text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 animate-pulse">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                لوحة تحكم حمد النشطة ⚡
              </span>
            ) : (
              <span>حديقة اعتذار مخصصة لزينة رشاد 🌸</span>
            )}
          </div>

          <div>
            {isHamadLoggedIn ? (
              <button
                onClick={handleHamadLogout}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-rose-100 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>إغلاق لوحة حمد</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setPasscodeInput('');
                  setLoginError('');
                  setShowLoginModal(true);
                }}
                className="px-3.5 py-1.5 bg-white/80 hover:bg-white text-slate-600 hover:text-indigo-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-slate-200/60 shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>🔑 لوحة متابعة حمد</span>
              </button>
            )}
          </div>
        </div>

        {/* Heartfelt Header */}
        <header className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-pink-500" />
            <span>باقة سلام تفاعلية للمصالحة 💝</span>
          </motion.div>

          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight leading-normal font-bold"
          >
            إلى {partnerName || 'حبيبتي الجميلة'} 🌸
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm md:text-base mt-3 leading-relaxed"
          >
            حديقة رقمية تفاعلية صُنعت خصيصاً لأعبر لكِ عن مدى أسفي واهتمامي، ولأعتذر عن {getDisplayReason()}، ولأذكركِ دائماً كم أنتِ غالية على قلبي.
          </motion.p>
        </header>

        {/* Global Personalizer Setup Panel (Collapsible) */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm overflow-hidden transition-all duration-300">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="w-full px-5 py-3.5 flex justify-between items-center text-right text-xs font-bold text-slate-600 hover:text-pink-600 bg-pink-50/20 hover:bg-pink-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                <span>💖 قسم زينة الخاص: لماذا أنتِ زعلانة من حمد اليوم؟ 🥺 (اضغطي للتحديد)</span>
              </div>
              <span className="text-pink-500">{showSetup ? 'إخفاء اللوحة ▲' : 'عرض اللوحة ▼'}</span>
            </button>

            <AnimatePresence>
              {showSetup && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100"
                >
                  <div className="p-5 md:p-6 space-y-6 text-sm">
                    {/* Header for Zeina's Zone */}
                    <div className="text-center md:text-right space-y-1 bg-pink-50/30 p-4 rounded-2xl border border-pink-100/40">
                      <h4 className="font-bold text-pink-700 flex items-center justify-center md:justify-start gap-1.5 text-sm">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        <span>مساحتكِ الخاصة يا زينة لتحديد سبب زعلكِ من حمد 🌸</span>
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        اختاري السبب الذي جعلكِ زعلانة من حمد من القائمة المجهزة بالأسفل، أو اكتبيه بنفسكِ، ليتغيّر محتوى حديقة الاعتذار بالكامل فوراً، ويتعلّم حمد من خطئه ويعتذر منكِ كما تستحقين! 😉
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                      {/* Left Block: Sweet display of names (ready for Zeina) */}
                      <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/80">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 text-xs">
                          <Heart className="w-4 h-4 text-pink-400 fill-current" />
                          <span>أطراف ميثاق المصالحة والصلح 📜</span>
                        </h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-400 font-medium">اسم الحبيبة (مستقبلة الاعتذار):</span>
                            <span className="font-extrabold text-pink-600">{partnerName} 👑</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-400 font-medium">اسم المرسل (مقدم الاعتذار):</span>
                            <span className="font-bold text-slate-700">{senderName} 💌</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Reason Select */}
                      <div className="space-y-4 bg-pink-50/10 p-4 rounded-2xl border border-pink-100/30">
                        <h3 className="font-bold text-pink-600 flex items-center gap-1.5 border-b border-pink-100/40 pb-1.5 text-xs">
                          <MessageCircle className="w-4 h-4 text-pink-500" />
                          <span>لماذا أنتِ زعلانة من حمد اليوم؟ 🥺</span>
                        </h3>
                        <div className="space-y-2">
                          <label className="text-[11px] text-slate-400 font-medium block">حددي سبب الزعل والضيق الرئيسي:</label>
                          <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs font-semibold cursor-pointer"
                          >
                            {PRESETS_REASONS.map((res) => (
                              <option key={res} value={res}>
                                {res === 'other' ? '✏️ سبب آخر (اكتبيه بنفسك بالأسفل)' : res}
                              </option>
                            ))}
                          </select>

                          {selectedReason === 'other' && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <input
                                type="text"
                                placeholder="اكتبي سبب زعلكِ بالتفصيل هنا ليعرفه حمد فوراً..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                maxLength={60}
                                className="w-full px-3 py-2.5 mt-1.5 bg-white rounded-xl border border-pink-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs font-semibold placeholder:text-slate-400"
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic State: HAMAD PARTNER HUB or NORMAL SCREEN */}
        {isHamadLoggedIn ? (
          <motion.div
            key="hamad-dashboard-main"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="z-10 relative"
          >
            <HamadDashboard
              partnerName={partnerName}
              senderName={senderName}
              isForgiven={isForgiven}
              selectedFlowers={selectedFlowers}
              wrappingColor={wrappingColor}
              ribbonMessage={ribbonMessage}
              bouquetGifted={bouquetGifted}
              coupons={coupons}
              activityLogs={activityLogs}
              onLogout={handleHamadLogout}
              onRefresh={() => fetchState(true)}
              onClearLogs={handleClearLogs}
              onSendTestEmail={handleSendTestEmail}
              emailStatus={emailStatus}
              emailErrorMsg={emailErrorMsg}
            />
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {isForgiven ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-3xl mx-auto bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 rounded-3xl p-1 md:p-1.5 shadow-2xl overflow-hidden relative"
              id="celebration-forgiven-box"
            >
              {/* Confetti sparkle backgrounds */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-4 left-6 text-3xl animate-bounce">✨</div>
                <div className="absolute top-12 right-12 text-4xl animate-pulse">🌟</div>
                <div className="absolute bottom-8 left-16 text-3xl animate-spin-slow">⭐</div>
                <div className="absolute bottom-16 right-8 text-4xl animate-bounce">✨</div>
              </div>

              <div className="bg-white rounded-[22px] p-8 md:p-12 text-center flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-7xl md:text-8xl mb-6 select-none"
                >
                  🎉
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight font-extrabold tracking-tight">
                  لقد سامحتِني! 💖
                </h2>

                <p className="text-pink-600 font-serif font-bold text-lg md:text-xl mt-3">
                  شكراً جزيلاً لكِ يا حبيبة قلبي {partnerName}!
                </p>

                <div className="h-0.5 w-32 bg-gradient-to-r from-pink-300 via-rose-400 to-amber-300 my-6"></div>

                <p className="text-slate-600 text-sm md:text-base max-w-lg leading-relaxed font-medium">
                  قلبكِ الكبير ولطفكِ اللامتناهي يعنيان لي الكون بأكمله. أعدكِ بأن أتعلم من أخطائي، وأن أستمع إليكِ دائماً، وأحترم مشاعركِ، وألا أعتبر وجودكِ الجميل والدافئ في حياتي أمراً بديهياً أبداً.
                </p>

                {/* Love Contract Certificate Visual */}
                <div className="mt-8 bg-pink-50/40 rounded-2xl border border-pink-100 p-6 max-w-md w-full text-center relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-200 rounded-full filter blur-xl opacity-40"></div>
                  <span className="text-xs font-mono font-bold text-pink-500 uppercase tracking-widest block mb-1">
                    💝 وثيقة المحبة الأبدية والوفاء 💝
                  </span>
                  <h4 className="font-serif font-extrabold text-slate-800 text-lg">
                    عقد السلام والوئام الأبدي
                  </h4>
                  <div className="h-px bg-pink-100 my-3"></div>
                  <p className="text-slate-500 text-xs italic px-4 leading-relaxed">
                    "تؤكد هذه الوثيقة أن {partnerName || 'زينة'} قد سامحت بكل لطف وعطف حبيبها {senderName || 'حمد'} على {getDisplayReason()}. وفي المقابل، يتعهد {senderName || 'حمد'} بتقديم عناق غير محدود، واهتمام دائم، وإخلاص تام مدى الحياة."
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-4 pt-2 border-t border-pink-100/60">
                    <span>توقيع الحبيبة: {partnerName || 'زينة'} ✍️</span>
                    <span>تاريخ المصالحة: {new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Interactive buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md">
                  <button
                    onClick={resetApology}
                    className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>تصفح حديقة الحب مجدداً</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsForgiven(false);
                      setActiveTab('coupons');
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                  >
                    <Ticket className="w-4 h-4 text-pink-500" />
                    <span>استخدمي قسائم الحب المجهزة 🎫</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // NORMAL DASHBOARD VIEW
            <div className="space-y-8">
              
              {/* Navigation Tabs bar */}
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/70 backdrop-blur border border-pink-100/80 rounded-3xl shadow-sm">
                  <button
                    onClick={() => setActiveTab('letter')}
                    className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'letter'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id="tab-letter"
                  >
                    <Mail className="w-4 h-4" />
                    <span>رسالتي لكِ 💌</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('game')}
                    className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'game'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id="tab-game"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>لعبة السماح والرضا 🎮</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('flowers')}
                    className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'flowers'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id="tab-flowers"
                  >
                    <Gift className="w-4 h-4" />
                    <span>صانع باقات الورد 💐</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('coupons')}
                    className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'coupons'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id="tab-coupons"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>قسائم الحب والمصالحة 🎫</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('memories')}
                    className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'memories'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id="tab-memories"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>شريط ذكرياتنا الجميلة ✨</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reasons')}
                    className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'reasons'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    id="tab-reasons"
                  >
                    <Star className="w-4 h-4" />
                    <span>لماذا أعشقكِ؟ 💖</span>
                  </button>
                </div>
              </div>

              {/* Central Active Component View */}
              <motion.main
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl mx-auto z-10 relative"
              >
                {activeTab === 'letter' && (
                  <ApologyLetter
                    partnerName={partnerName}
                    senderName={senderName}
                    reason={selectedReason}
                    customReason={customReason}
                  />
                )}

                {activeTab === 'game' && (
                  <ForgivenessGame
                    partnerName={partnerName}
                    senderName={senderName}
                    onForgiveSuccess={handleForgiveSuccess}
                  />
                )}

                {activeTab === 'flowers' && (
                  <BouquetBuilder
                    partnerName={partnerName}
                    selectedFlowers={selectedFlowers}
                    setSelectedFlowers={setSelectedFlowers}
                    wrappingColor={wrappingColor}
                    setWrappingColor={setWrappingColor}
                    bouquetGifted={bouquetGifted}
                    setBouquetGifted={setBouquetGifted}
                    ribbonMessage={ribbonMessage}
                    setRibbonMessage={setRibbonMessage}
                  />
                )}

                {activeTab === 'coupons' && (
                  <LoveCoupons
                    partnerName={partnerName}
                    coupons={coupons}
                    setCoupons={setCoupons}
                  />
                )}

                {activeTab === 'memories' && (
                  <MemoryTimeline
                    partnerName={partnerName}
                    memories={memories}
                    setMemories={setMemories}
                  />
                )}

                {activeTab === 'reasons' && (
                  <LoveReasons
                    partnerName={partnerName}
                    reasons={reasons}
                    setReasons={setReasons}
                  />
                )}
              </motion.main>
            </div>
          )}
        </AnimatePresence>
        )}

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-400 mt-16 max-w-md mx-auto select-none border-t border-slate-200/50 pt-4">
          <p className="font-serif italic text-slate-500 text-sm">
            "قد نختلف ونعبر بكلمات عشوائية أحياناً، ولكن نبضات قلبي باسمكِ لا تخطئ الطريق أبداً."
          </p>
          <div className="flex justify-center items-center gap-1.5 mt-2.5 font-mono text-[10px] text-pink-400 font-bold">
            <Heart className="w-3 h-3 fill-current text-pink-500 animate-pulse" />
            <span>بوابة الحب التفاعلية الأبدية v1.0</span>
          </div>
        </footer>

        {/* Passcode / PIN Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative"
              >
                <div className="absolute top-4 left-4">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="p-1 px-2.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer text-xs font-bold"
                  >
                    إغلاق ×
                  </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-extrabold text-slate-900 text-lg">بوابة شريك زينة رشاد 🔑</h4>
                    <p className="text-slate-400 text-xs mt-1 max-w-[240px] mx-auto leading-relaxed">
                      أهلاً بك يا حمد. الرجاء إدخال رمز المرور السري لاستعراض كافة التحديثات والنشاطات.
                    </p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const cleanInput = passcodeInput.trim().toLowerCase();
                  if (['hamad10', 'حمد١٠', 'hamad', 'حمد', '1234', '123'].includes(cleanInput)) {
                    setIsHamadLoggedIn(true);
                    localStorage.setItem('isHamadLoggedIn', 'true');
                    setShowLoginModal(false);
                    setPasscodeInput('');
                    setLoginError('');
                  } else {
                    setLoginError('رمز المرور غير صحيح. الرجاء المحاولة مرة أخرى.');
                  }
                }} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1 text-right">رمز المرور أو كلمة السر:</label>
                    <input
                      type="password"
                      placeholder="أدخل رمز المرور السري"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white text-center text-sm font-bold tracking-wider placeholder:text-slate-400 text-slate-800"
                      autoFocus
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs text-rose-600 font-semibold text-center flex items-center justify-center gap-1.5 bg-rose-50 border border-rose-100 p-2 rounded-xl">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{loginError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    تسجيل الدخول الآمن 🔑
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
