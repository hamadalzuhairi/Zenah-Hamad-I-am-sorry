import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { Flower } from '../types';

const FLOWERS: Flower[] = [
  {
    id: 'red-rose',
    name: 'جوري أحمر',
    color: '#E11D48',
    meaning: 'الحب العميق الأبدي والصدق التام.',
    symbol: '🌹',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'pink-tulip',
    name: 'توليب وردي',
    color: '#EC4899',
    meaning: 'العاطفة العميقة، الاهتمام، والسعادة المثالية.',
    symbol: '🌷',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'sunflower',
    name: 'دوار الشمس',
    color: '#EAB308',
    meaning: 'الوفاء، الدفء، وإدخال النور إلى أيامي المظلمة.',
    symbol: '🌻',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'white-daisy',
    name: 'أقحوان أبيض',
    color: '#D1D5DB',
    meaning: 'النقاء، البدايات الجديدة، والولاء المتبادل.',
    symbol: '🌼',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'lavender',
    name: 'خزامى (لافندر)',
    color: '#8B5CF6',
    meaning: 'الرقة، التفاني، الهدوء، وشفاء القلوب الحزينة.',
    symbol: '🪻',
    textColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'hibiscus',
    name: 'كركديه ناعم',
    color: '#F43F5E',
    meaning: 'الجمال الرقيق، الدفء، والشغف اللطيف.',
    symbol: '🌺',
    textColor: 'text-rose-500',
    bgColor: 'bg-rose-50/50',
  },
];

interface BouquetBuilderProps {
  partnerName: string;
  selectedFlowers: { id: string; timestamp: number }[];
  setSelectedFlowers: (flowers: { id: string; timestamp: number }[] | ((prev: { id: string; timestamp: number }[]) => { id: string; timestamp: number }[])) => void;
  wrappingColor: 'pink' | 'lavender' | 'kraft';
  setWrappingColor: (color: 'pink' | 'lavender' | 'kraft') => void;
  bouquetGifted: boolean;
  setBouquetGifted: (gifted: boolean) => void;
  ribbonMessage: string;
  setRibbonMessage: (msg: string) => void;
}

export default function BouquetBuilder({
  partnerName,
  selectedFlowers,
  setSelectedFlowers,
  wrappingColor,
  setWrappingColor,
  bouquetGifted,
  setBouquetGifted,
  ribbonMessage,
  setRibbonMessage,
}: BouquetBuilderProps) {

  const addFlower = (id: string) => {
    if (selectedFlowers.length >= 12) return; // limit to 12 flowers
    setSelectedFlowers([...selectedFlowers, { id, timestamp: Date.now() }]);
  };

  const removeLastFlower = () => {
    if (selectedFlowers.length === 0) return;
    setSelectedFlowers(selectedFlowers.slice(0, -1));
  };

  const clearBouquet = () => {
    setSelectedFlowers([]);
    setBouquetGifted(false);
  };

  const getFlowerDetails = (id: string): Flower => {
    return FLOWERS.find((f) => f.id === id) || FLOWERS[0];
  };

  // Group flowers for summary
  const groupedFlowersCount = selectedFlowers.reduce((acc, current) => {
    acc[current.id] = (acc[current.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const wrappingClasses = {
    pink: 'bg-pink-100/90 border-pink-200 shadow-pink-200/50',
    lavender: 'bg-purple-100/90 border-purple-200 shadow-purple-200/50',
    kraft: 'bg-amber-100/90 border-amber-200/70 shadow-amber-200/30',
  };

  const wrapNames = {
    pink: 'وردي ناعم',
    lavender: 'لافندر هادئ',
    kraft: 'ورق كرافت',
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xl shadow-pink-50/50">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>متجر الزهور التفاعلي 💐</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight font-bold">
          نسّقي باقة الورد التي تفضلينها يا {partnerName || 'زينة'} لكي أشتريها لكِ كاعتذار مخلص 💐
        </h2>
        <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">
          اختاري من بين مجموعة من الزهور الجميلة ذات المعاني العميقة. قومي بلف الباقة المخصصة واكتبي رسالة دافئة على شريطها، لكي تصلني التفاصيل وأقوم بشرائها وتقديمها لكِ كعربون محبة واعتذار حقيقي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Flower Selection Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-pink-50/40 rounded-2xl p-5 border border-pink-100/50">
            <h3 className="font-serif text-lg text-slate-800 mb-4 font-bold text-right">
              1. اختاري الزهور ({selectedFlowers.length}/12)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {FLOWERS.map((flower) => {
                const count = selectedFlowers.filter((f) => f.id === flower.id).length;
                return (
                  <button
                    key={flower.id}
                    onClick={() => addFlower(flower.id)}
                    disabled={selectedFlowers.length >= 12 || bouquetGifted}
                    className="p-3 bg-white hover:bg-pink-50/50 border border-slate-100 hover:border-pink-300 rounded-xl transition-all duration-200 flex flex-col items-center text-center group cursor-pointer relative"
                    id={`flower-select-${flower.id}`}
                  >
                    {count > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm animate-scale-up">
                        {count}
                      </span>
                    )}
                    <span className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-200">
                      {flower.symbol}
                    </span>
                    <span className="font-bold text-xs text-slate-700">{flower.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 leading-relaxed italic px-1 max-h-12 overflow-hidden">
                      {flower.meaning}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-pink-50/40 rounded-2xl p-5 border border-pink-100/50">
            <h3 className="font-serif text-lg text-slate-800 mb-3 font-bold text-right">
              2. التغليف المخصص والشريطة
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-2 font-medium text-right">
                  اختاري لون ورق التغليف:
                </label>
                <div className="flex flex-wrap gap-2 justify-start">
                  {(['pink', 'lavender', 'kraft'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setWrappingColor(color)}
                      disabled={bouquetGifted}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        wrappingColor === color
                          ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {color === 'kraft' ? 'ورق كرافت كلاسيكي 🪵' : color === 'pink' ? 'وردي ناعم 🌸' : 'خزامى هادئ 🪻'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1.5 font-medium text-right">
                  رسالة على شريط الباقة:
                </label>
                <input
                  type="text"
                  placeholder="مثال: من كل قلبي، أحبكِ للأبد، سامحيني..."
                  value={ribbonMessage}
                  onChange={(e) => setRibbonMessage(e.target.value)}
                  disabled={bouquetGifted}
                  maxLength={40}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={removeLastFlower}
              disabled={selectedFlowers.length === 0 || bouquetGifted}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              تراجع عن وردة ↩️
            </button>
            <button
              onClick={clearBouquet}
              disabled={selectedFlowers.length === 0}
              className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-600 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              إفراغ الباقة 🗑️
            </button>
          </div>
        </div>

        {/* Bouquet Live Visualization Preview */}
        <div className="lg:col-span-7 bg-gradient-to-b from-rose-50/20 to-pink-50/10 rounded-2xl p-6 border border-pink-100/30 flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">
          {/* Bouquet Flowers Stage */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative">
            <AnimatePresence>
              {selectedFlowers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-slate-400 flex flex-col items-center p-8"
                >
                  <span className="text-5xl mb-3 animate-pulse">💐</span>
                  <p className="text-sm font-bold">باقة الورد التفاعلية فارغة</p>
                  <p className="text-xs text-slate-400 mt-1">اضغطي على الورود من اليمين للبدء في تجميع باقتكِ الجميلة</p>
                </motion.div>
              ) : (
                <div className="relative w-full h-[320px] flex items-center justify-center">
                  {/* Floating Flower Symbols */}
                  {selectedFlowers.map((flowerObj, idx) => {
                    const flower = getFlowerDetails(flowerObj.id);
                    // Standard deterministic spiral positions based on index
                    const angle = (idx * 137.5 * Math.PI) / 180;
                    const radius = Math.min(25 + idx * 7, 75);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius - 40; // shift up from wrapper

                    // Small scaling based on index
                    const scale = 1 + (idx % 3) * 0.08;

                    return (
                      <motion.div
                        key={`${flowerObj.id}-${flowerObj.timestamp}`}
                        initial={{ opacity: 0, scale: 0, y: 150 }}
                        animate={{ opacity: 1, scale, x, y }}
                        exit={{ opacity: 0, scale: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                        className="absolute text-5xl select-none filter drop-shadow"
                        style={{ zIndex: 10 + idx }}
                      >
                        {flower.symbol}
                      </motion.div>
                    );
                  })}

                  {/* Ribbon & Wrapping Visual Container */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 flex flex-col items-center z-40"
                  >
                    {/* The Wrap */}
                    <div
                      className={`w-36 h-36 border shadow-lg rounded-t-[50%] rounded-b-[40%] flex flex-col items-center justify-end pb-3 transition-colors duration-500 relative ${
                        wrappingClasses[wrappingColor]
                      }`}
                    >
                      {/* Wrapping paper details / fold representation */}
                      <div className="absolute inset-x-0 top-0 h-10 border-b border-white/30 bg-white/10 rounded-t-[50%] flex justify-center items-center">
                        <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase font-sans">
                          غلاف {wrapNames[wrappingColor]}
                        </span>
                      </div>

                      {/* The Bow / Ribbon */}
                      <motion.div
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-10 h-10 rounded-full bg-rose-500 border border-rose-600 flex items-center justify-center shadow z-50 -mb-6 relative"
                      >
                        <Heart className="w-5 h-5 fill-white text-white" />
                        <div className="absolute top-1/2 -left-6 w-6 h-3 bg-rose-500 rounded-l-full border-y border-l border-rose-600 origin-right -rotate-12"></div>
                        <div className="absolute top-1/2 -right-6 w-6 h-3 bg-rose-500 rounded-r-full border-y border-r border-rose-600 origin-left rotate-12"></div>
                      </motion.div>
                    </div>

                    {/* Ribbon Tag Message */}
                    <div className="bg-white/95 px-4 py-1.5 border border-pink-100 rounded-lg shadow-sm text-center max-w-[180px] truncate mt-4 z-50">
                      <p className="text-[10px] text-slate-400 font-serif italic uppercase tracking-wider">رسالة الشريط</p>
                      <p className="text-xs font-bold text-slate-800 tracking-tight">{ribbonMessage || 'أحبكِ'}</p>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer & Bouquet Description */}
          {selectedFlowers.length > 0 && (
            <div className="w-full border-t border-slate-100/80 pt-4 mt-2 flex flex-col items-center">
              <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                {Object.entries(groupedFlowersCount).map(([id, count]) => {
                  const flower = getFlowerDetails(id);
                  return (
                    <span
                      key={id}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${flower.bgColor} ${flower.textColor}`}
                    >
                      <span>{flower.symbol}</span>
                      <span>
                        {flower.name} x{count}
                      </span>
                    </span>
                  );
                })}
              </div>

              {!bouquetGifted ? (
                <button
                  onClick={() => {
                    setBouquetGifted(true);
                    // Send email notification to Hamad
                    fetch('/api/notify-email', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        type: 'bouquet',
                        details: {
                          flowerCount: selectedFlowers.length,
                          wrappingColor: wrappingColor,
                          ribbonMessage: ribbonMessage,
                        },
                      }),
                    }).catch((err) => console.error('Error sending email notification:', err));
                  }}
                  className="w-full max-w-sm py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md shadow-rose-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer text-sm"
                  id="gift-bouquet-btn"
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  <span>أرسلي الباقة المنسّقة إلى حمد لكي يشتريها لكِ فوراً 💐</span>
                </button>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-sm p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                    <CheckCircle className="w-4 h-4 fill-current" />
                    <span>تم إرسال باقتكِ المفضلة بنجاح! 😍</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    لقد وصلتني تفاصيل باقتكِ المنسّقة والجميلة. سأقوم بشرائها وتوصيلها لكِ في أقرب وقت لتزيّن عالمكِ الجميل، ولأعبر لكِ عن صدق أسفي ومحبتي الكبيرة لكِ! 💖
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
