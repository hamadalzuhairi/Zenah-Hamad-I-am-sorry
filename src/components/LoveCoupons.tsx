import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Ticket, Heart, Plus, Trash2, Check, Award } from 'lucide-react';
import { LoveCoupon } from '../types';

const INITIAL_COUPONS: LoveCoupon[] = [
  {
    id: '1',
    title: 'عناق دافئ وعميق 🧸',
    description: 'صالح للحصول على عناق قوي ومستمر لإذابة أي توتر أو ضيق متراكم. قابل للاستخدام في أي وقت على الفور.',
    icon: '🧸',
    code: 'HUG-ULTIMATE-100',
    isRedeemed: false,
  },
  {
    id: '2',
    title: 'بطاقة الفوز بنقاش 🛡️',
    description: 'العبِي هذه البطاقة للفوز فوراً بأي نقاش أو قرار ودي بسيط بيننا. موافقة الشريك مضمونة وموقّعة مقدماً!',
    icon: '🛡️',
    code: 'WIN-DEBATE-FREE',
    isRedeemed: false,
  },
  {
    id: '3',
    title: 'فطور ملكي في السرير 🥞',
    description: 'بانكيك دافئ مُعد منزلياً مع القهوة الطازجة والعصير اللذيذ، يُقدم إليكِ في السرير بينما تسترخين بدفء.',
    icon: '🥞',
    code: 'BED-BREAKFAST-AM',
    isRedeemed: false,
  },
  {
    id: '4',
    title: 'التحكم التام بسهرة نتفلكس 📺',
    description: 'تحكم مطلق بنسبة 100% في اختيار الفيلم الذي سنشاهده وفي اختيار وجبة العشاء المفضلة دون أدنى اعتراض.',
    icon: '📺',
    code: 'REMOTE-CONTROL-99',
    isRedeemed: false,
  },
  {
    id: '5',
    title: 'جلسة تدليك استثنائية (20 دقيقة) 💆‍♀️',
    description: 'تتضمن موسيقى هادئة، زيوت عطرية دافئة، وتركيزاً كاملاً على راحتكِ واسترخائكِ التام.',
    icon: '💆‍♀️',
    code: 'SPA-MASSAGE-DELUXE',
    isRedeemed: false,
  },
  {
    id: '6',
    title: 'توصيل قهوتكِ المفضلة فوراً ☕',
    description: 'إحضار قهوتكِ أو شايكِ المفضل وتوصيله مباشرة إلى مكتبكِ أو غرفتكِ في أي وقت تطلبينه بلمح البصر.',
    icon: '☕',
    code: 'CAFFEINE-ON-DEMAND',
    isRedeemed: false,
  },
];

interface LoveCouponsProps {
  partnerName: string;
  coupons: LoveCoupon[];
  setCoupons: (coupons: LoveCoupon[] | ((prev: LoveCoupon[]) => LoveCoupon[])) => void;
}

export default function LoveCoupons({ partnerName, coupons, setCoupons }: LoveCouponsProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('🎁');
  const [activeCertificate, setActiveCertificate] = useState<LoveCoupon | null>(null);

  const icons = ['🎁', '🧸', '🥞', '📺', '☕', '🎫', '🍿', '🕯️', '🍪', '✈️', '🍣', '🛍️'];

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newCoupon: LoveCoupon = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      icon: newIcon,
      code: `CUSTOM-${Math.random().toString(36).substring(3, 8).toUpperCase()}`,
      isRedeemed: false,
    };

    setCoupons([newCoupon, ...coupons]);

    // Send immediate email notification to Hamad
    fetch('/api/notify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'custom_coupon',
        details: {
          title: newCoupon.title,
          description: newCoupon.description,
          icon: newCoupon.icon,
        },
      }),
    }).catch((err) => console.error('Error sending email notification:', err));

    setNewTitle('');
    setNewDesc('');
    setNewIcon('🎁');
  };

  const handleRedeem = (coupon: LoveCoupon) => {
    if (coupon.isRedeemed) return;

    // Set coupon to redeemed
    const updated = coupons.map((c) => {
      if (c.id === coupon.id) {
        return {
          ...c,
          isRedeemed: true,
          redeemedAt: new Date().toLocaleDateString('ar-EG', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      }
      return c;
    });

    setCoupons(updated);
    setActiveCertificate({
      ...coupon,
      isRedeemed: true,
      redeemedAt: new Date().toLocaleDateString('ar-EG', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    // Send immediate email notification to Hamad
    fetch('/api/notify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'coupon',
        details: {
          title: coupon.title,
          description: coupon.description,
          code: coupon.code,
        },
      }),
    }).catch((err) => console.error('Error sending email notification:', err));
  };

  const handleDeleteCoupon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xl shadow-pink-50/50">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-sm font-medium mb-3">
          <Ticket className="w-4 h-4 text-pink-500 animate-pulse" />
          <span>قسائم الحب والمصالحة 🎫</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-slate-800 tracking-tight font-bold">
          قسائم اعتذار ومصالحة لـ {partnerName || 'حبيبة قلبي'}
        </h2>
        <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">
          تعد هذه القسائم بمثابة عقود عاطفية ملزمة تماماً! اضغطي على أي قسيمة واستخدميها لتوليد شهادة رسمية يجب عليّ تنفيذها ومصالحتكِ بها فوراً دون تردد.
        </p>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatePresence mode="popLayout">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className={`relative overflow-hidden rounded-2xl border flex flex-col md:flex-row shadow-sm transition-all duration-300 text-right ${
                coupon.isRedeemed
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : 'bg-gradient-to-br from-white to-pink-50/20 border-pink-100 hover:shadow-md hover:border-pink-300'
              }`}
              id={`love-coupon-card-${coupon.id}`}
            >
              {/* Ticket Left Section */}
              <div
                className={`p-5 flex flex-col justify-between items-center text-center md:border-l border-dashed w-full md:w-24 ${
                  coupon.isRedeemed ? 'border-slate-200 bg-slate-100' : 'border-pink-100 bg-pink-50/30'
                }`}
              >
                <span className="text-4xl" role="img" aria-label="coupon icon">
                  {coupon.icon}
                </span>
                <span
                  className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full mt-2 font-bold ${
                    coupon.isRedeemed ? 'bg-slate-200 text-slate-500' : 'bg-pink-100 text-pink-600'
                  }`}
                >
                  {coupon.isRedeemed ? 'تم استخدامها' : 'جاهزة للاستعمال'}
                </span>
              </div>

              {/* Ticket Main Section */}
              <div className="p-5 flex-1 flex flex-col justify-between relative">
                {/* Perforated ticket edges representation */}
                <div className="absolute top-0 bottom-0 -right-1 hidden md:flex flex-col justify-between py-2 z-10">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white/70 backdrop-blur border border-pink-100 rounded-full -mr-1"></div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className={`font-serif text-lg font-bold leading-tight ${
                        coupon.isRedeemed ? 'text-slate-500 line-through' : 'text-slate-800'
                      }`}
                    >
                      {coupon.title}
                    </h3>
                    {coupons.length > 3 && (
                      <button
                        onClick={(e) => handleDeleteCoupon(coupon.id, e)}
                        className="text-slate-300 hover:text-rose-500 p-0.5 rounded hover:bg-slate-100"
                        title="حذف القسيمة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                  <span className="text-[10px] font-mono text-slate-400">الرمز: {coupon.code}</span>
                  {!coupon.isRedeemed ? (
                    <button
                      onClick={() => handleRedeem(coupon)}
                      className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-pink-100" />
                      <span>استخدام القسيمة 🎫</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveCertificate(coupon)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-semibold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>عرض الوصل والشهادة</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Custom Coupon Section */}
      <div className="bg-pink-50/40 rounded-2xl p-5 border border-pink-100/50 max-w-2xl mx-auto">
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5 justify-start text-right">
          <Plus className="w-4 h-4 text-pink-500" />
          <span>صممي قسيمتكِ الخاصة للمصالحة والاهتمام</span>
        </h4>
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-right">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="اسم القسيمة المخصصة (مثال: عشاء سينمائي مخصص، يوم بلا أعذار...)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-xs text-slate-500">الأيقونة:</span>
                <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-pink-200 max-h-24 overflow-y-auto">
                  {icons.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setNewIcon(ic)}
                      className={`text-base p-1 rounded transition-transform ${
                        newIcon === ic ? 'bg-pink-100 scale-110 font-bold' : 'hover:scale-105'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <textarea
              placeholder="اكتبي وصفاً مختصراً يوضح ما تضمنه لكِ هذه القسيمة اللطيفة التي يجب عليّ تلبيتها بصدق..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              maxLength={150}
              className="w-full px-4 py-2 bg-white rounded-xl border border-pink-200 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTitle.trim() || !newDesc.trim()}
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>إنشاء القسيمة الخاصة</span>
            </button>
          </div>
        </form>
      </div>

      {/* Redemption Certificate Modal overlay */}
      <AnimatePresence>
        {activeCertificate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-pink-100 shadow-2xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden"
            >
              {/* Confetti Decorative Background Circles */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full filter blur-xl opacity-30 -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-full filter blur-xl opacity-30 -mr-10 -mb-10"></div>

              {/* Certificate Layout */}
              <div className="border-4 border-double border-pink-200 rounded-2xl p-6 text-center flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center mb-3 text-2xl">
                  {activeCertificate.icon}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-pink-500 font-bold tracking-widest uppercase mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>شهادة رسمية موثقة 🎖️</span>
                </div>
                <h3 className="font-serif text-2xl text-slate-800 leading-tight font-bold">
                  تم تفعيل القسيمة بنجاح!
                </h3>
                <div className="h-0.5 w-24 bg-pink-200 my-4"></div>

                <p className="text-slate-600 text-sm italic font-serif leading-relaxed px-2">
                  "تؤكد هذه الشهادة رسمياً وبكل صدق ومسؤولية أن حبيبتي {partnerName || 'زينة'} قد استخدمت قسيمة المصالحة والاهتمام المخصصة بعنوان:"
                </p>

                <p className="text-pink-600 text-xl font-bold font-serif my-3 tracking-tight">
                  {activeCertificate.title}
                </p>

                <p className="text-slate-500 text-xs leading-relaxed max-w-sm px-4">
                  {activeCertificate.description}
                </p>

                <div className="w-full grid grid-cols-2 gap-4 mt-6 border-t border-slate-100 pt-4 text-right">
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">تاريخ الاستخدام</p>
                    <p className="text-slate-700 text-xs font-semibold">{activeCertificate.redeemedAt}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">رمز العقد</p>
                    <p className="text-pink-500 text-xs font-mono font-bold">{activeCertificate.code}</p>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <button
                    onClick={() => setActiveCertificate(null)}
                    className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    إغلاق والاحتفاظ بالوصل 💖
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
