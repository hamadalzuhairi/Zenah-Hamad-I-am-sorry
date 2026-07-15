import React, { useState } from 'react';
import { 
  Heart, 
  LogOut, 
  Trash2, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  Ticket, 
  Gift, 
  Clock, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { LoveCoupon } from '../types';

interface ActivityLog {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
  icon: string;
}

interface HamadDashboardProps {
  partnerName: string;
  senderName: string;
  isForgiven: boolean;
  selectedFlowers: { id: string; timestamp: number }[];
  wrappingColor: 'pink' | 'lavender' | 'kraft';
  ribbonMessage: string;
  bouquetGifted: boolean;
  coupons: LoveCoupon[];
  activityLogs: ActivityLog[];
  onLogout: () => void;
  onRefresh: () => void;
  onClearLogs: () => void;
  onSendTestEmail: () => void;
  emailStatus: 'idle' | 'sending' | 'success' | 'error';
  emailErrorMsg: string;
}

const FLOWERS_MAP: { [key: string]: { name: string; symbol: string; meaning: string } } = {
  'red-rose': { name: 'جوري أحمر', symbol: '🌹', meaning: 'الحب العميق الأبدي والصدق التام.' },
  'pink-tulip': { name: 'توليب وردي', symbol: '🌷', meaning: 'العاطفة العميقة، الاهتمام، والسعادة المثالية.' },
  'sunflower': { name: 'دوار الشمس', symbol: '🌻', meaning: 'الوفاء، الدفء، وإدخال النور إلى أيامي المظلمة.' },
  'white-daisy': { name: 'أقحوان أبيض', symbol: '🌼', meaning: 'النقاء، البدايات الجديدة، والولاء المتبادل.' },
  'lavender': { name: 'خزامى (لافندر)', symbol: '🪻', meaning: 'الرقة، التفاني، الهدوء، وشفاء القلوب الحزينة.' },
  'hibiscus': { name: 'كركديه ناعم', symbol: '🌺', meaning: 'الجمال الرقيق، الدفء، والشغف اللطيف.' },
};

export default function HamadDashboard({
  partnerName,
  senderName,
  isForgiven,
  selectedFlowers,
  wrappingColor,
  ribbonMessage,
  bouquetGifted,
  coupons,
  activityLogs,
  onLogout,
  onRefresh,
  onClearLogs,
  onSendTestEmail,
  emailStatus,
  emailErrorMsg
}: HamadDashboardProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Stats
  const totalCoupons = coupons.length;
  const redeemedCoupons = coupons.filter(c => c.isRedeemed).length;
  const customCoupons = coupons.filter(c => !['1', '2', '3', '4', '5', '6'].includes(c.id)).length;

  const getWrappingColorText = (color: string) => {
    switch (color) {
      case 'pink': return 'وردي رقيق 🌸';
      case 'lavender': return 'خزامى هادئ 🪻';
      case 'kraft': return 'ورق كرافت كلاسيكي 🤎';
      default: return 'تغليف خاص ✨';
    }
  };

  const getWrappingBg = (color: string) => {
    switch (color) {
      case 'pink': return 'bg-pink-50 border-pink-200 text-pink-700';
      case 'lavender': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'kraft': return 'bg-amber-50/60 border-amber-200 text-amber-800';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div dir="rtl" className="space-y-8 text-right max-w-4xl mx-auto">
      {/* Dashboard Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full filter blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 fill-current" />
              <span>بوابة الشريك والتحكم الآمنة 👑</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white leading-normal">
              لوحة متابعة ردود {partnerName} 💖
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 leading-relaxed">
              هنا يمكنك رؤية كل ما تفعله {partnerName} في الوقت الفعلي ومتابعة تفاعلاتها فوراً حتى لو حظر البريد الإلكتروني الإشعارات!
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={onRefresh}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer border border-white/5"
              title="تحديث البيانات فوراً"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-rose-500/30 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج آمن</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Forgiveness Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full filter blur-2xl opacity-50"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">حالة الرضا والصلح</span>
              <Heart className={`w-5 h-5 ${isForgiven ? 'fill-current text-pink-500 animate-pulse' : 'text-slate-300'}`} />
            </div>
            
            <div className="mt-4">
              <span className="text-xs text-slate-500 font-medium block">القرار الحالي:</span>
              <span className={`text-xl font-bold block mt-1 ${isForgiven ? 'text-emerald-600' : 'text-amber-500'}`}>
                {isForgiven ? 'سامحتك بكل حب! 💖' : 'قيد الانتظار والدلال 🥺'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-3 border-t border-slate-50 text-xs text-slate-500 leading-relaxed">
            {isForgiven ? (
              <p className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 font-medium">
                🎉 تمت المصالحة بنجاح وعقد الأمان موقع ومحفوظ بالكامل!
              </p>
            ) : (
              <p className="bg-slate-50 text-slate-600 p-2.5 rounded-xl border border-slate-100">
                ما زالت تتصفح الحديقة وتلعب لعبة الرضا لتهدئة خاطرها الجميل.
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Flower Bouquet Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full filter blur-2xl opacity-50"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">باقة الورد المنسقة</span>
              <Gift className="w-5 h-5 text-pink-500" />
            </div>
            
            <div className="mt-4">
              <span className="text-xs text-slate-500 font-medium block">حالة الباقة:</span>
              <span className={`text-xl font-bold block mt-1 ${bouquetGifted ? 'text-pink-600' : 'text-slate-400'}`}>
                {bouquetGifted ? 'تم التنسيق والإرسال! 💐' : 'لم تنسق باقة بعد 🥀'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-3 border-t border-slate-50 text-xs text-slate-500">
            {bouquetGifted ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex justify-between items-center bg-pink-50/50 p-1.5 rounded-lg border border-pink-100/40 text-[11px]">
                    <span>عدد الوردات:</span>
                    <span className="font-bold text-pink-600">{selectedFlowers.length} وردات</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg text-[11px]">
                    <span>لون التغليف:</span>
                    <span className="font-semibold text-slate-700">{getWrappingColorText(wrappingColor)}</span>
                  </div>
                </div>
                <div className="bg-pink-50/20 p-2 rounded-lg border border-pink-100/20 text-[11px]">
                  <span className="font-semibold block text-slate-400 mb-0.5">رسالة الشريط:</span>
                  <span className="font-bold text-slate-700 italic">"{ribbonMessage}"</span>
                </div>

                {/* Detailed flowers list with scrollbar for clean presentation */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="font-bold text-[10px] text-slate-400 block mb-1">تفاصيل أنواع الورد ومعانيها:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {Object.entries(
                      selectedFlowers.reduce((acc, f) => {
                        acc[f.id] = (acc[f.id] || 0) + 1;
                        return acc;
                      }, {} as { [key: string]: number })
                    ).map(([id, count]) => {
                      const info = FLOWERS_MAP[id] || { name: 'زهرة مجهولة', symbol: '🌸', meaning: 'جمال خاص' };
                      return (
                        <div key={id} className="flex flex-col gap-0.5 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="text-base">{info.symbol}</span>
                              <span>{info.name}</span>
                            </span>
                            <span className="bg-pink-100 text-pink-700 font-extrabold px-2 py-0.5 rounded-md text-[10px]">
                              {count} {count > 1 && count < 11 ? 'وردات' : 'وردة'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 leading-relaxed font-serif">
                            المعنى: {info.meaning}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="bg-slate-50 text-slate-500 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                ستظهر هنا تفاصيل الباقة والرسالة بمجرد قيامها بقطف وتنسيق الورد المفضل لديها.
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Coupons Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full filter blur-2xl opacity-50"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">إحصائيات القسائم والمستندات</span>
              <Ticket className="w-5 h-5 text-indigo-500" />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">القسائم الكلية</span>
                <span className="text-lg font-extrabold text-slate-700">{totalCoupons}</span>
              </div>
              <div className="bg-pink-50/40 p-2 rounded-xl border border-pink-100/30">
                <span className="text-[10px] text-pink-400 font-bold block">قسائم مستخدمة</span>
                <span className="text-lg font-extrabold text-pink-600">{redeemedCoupons}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-3 border-t border-slate-50 text-xs text-slate-500">
            <div className="flex justify-between items-center bg-indigo-50/30 p-2 rounded-lg border border-indigo-100/30 text-[11px] font-medium text-indigo-800">
              <span>القسائم المخصصة التي صممتها زينة:</span>
              <span className="font-bold bg-indigo-100 px-2 py-0.5 rounded-md">{customCoupons}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Interactions Log Timeline */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-5 h-5 text-indigo-500" />
          <span>سجل التفاعلات اللحظية (تحديث مباشر) ⚡</span>
        </h3>

        {activityLogs.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-sm">لا توجد تفاعلات مسجلة في السجل حتى الآن.</p>
            <p className="text-xs max-w-sm mx-auto">
              بمجرد قيام زينة بقبول الصلح، استخدام أي قسيمة، تصميم قسيمة جديدة، أو إرسال باقة ورد؛ ستظهر الخطوة هنا فوراً بالوقت والتفاصيل الدقيقة!
            </p>
          </div>
        ) : (
          <div className="relative pr-4 border-r-2 border-slate-100 space-y-6 mr-2">
            {activityLogs.map((log) => (
              <div key={log.id} className="relative pr-6">
                {/* Timeline dot */}
                <div className="absolute -right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white ring-4 ring-indigo-50/80"></div>
                
                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{log.icon || '📝'}</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{log.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-100">
                      {log.timestamp}
                    </span>
                  </div>
                  {log.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pr-7">
                      {log.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupons redeemed & created detail list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sub-block 1: Redeemed coupons tracking */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5 text-sm">
            <Ticket className="w-4 h-4 text-pink-500" />
            <span>قسائم الحب المستردة من قِبل زينة</span>
          </h4>
          
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {coupons.filter(c => c.isRedeemed).length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                لم تقم زينة باستخدام أي قسيمة حب حتى الآن 🎟️
              </p>
            ) : (
              coupons.filter(c => c.isRedeemed).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-pink-50/30 rounded-2xl border border-pink-100/40">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl bg-white p-1.5 rounded-xl border border-pink-100/20 shadow-sm">{c.icon}</span>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs">{c.title}</h5>
                      <span className="text-[9px] text-slate-400 font-mono">الرمز: {c.code}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100 font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    <span>مستردة</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sub-block 2: Custom coupons designed by Zeina */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5 text-sm">
            <Gift className="w-4 h-4 text-indigo-500" />
            <span>القسائم المخصصة التي صممتها زينة بنفسها</span>
          </h4>
          
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {coupons.filter(c => !['1', '2', '3', '4', '5', '6'].includes(c.id)).length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">
                لم تقم زينة بتصميم أي قسيمة حب مخصصة بعد 🎁
              </p>
            ) : (
              coupons.filter(c => !['1', '2', '3', '4', '5', '6'].includes(c.id)).map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.icon}</span>
                      <h5 className="font-bold text-slate-800 text-xs">{c.title}</h5>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${c.isRedeemed ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>
                      {c.isRedeemed ? 'مستردة' : 'متاحة للاستخدام'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pr-6">
                    {c.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Advanced Debugging & Notification Test Actions */}
      <div className="bg-slate-100/70 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-5">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">إدارة النظام والتحكم بالبيانات ⚙️</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            استخدم هذه الخيارات لمسح سجل التفاعلات والبدء من جديد مع زينة، أو إرسال إشعار تجريبي للتأكد من اتصال النظام.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-1">
          {/* Reset/Clear activity logs */}
          {showClearConfirm ? (
            <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-rose-50 border border-rose-200 p-2.5 rounded-2xl animate-fade-in text-right">
              <span className="text-[11px] text-rose-700 font-extrabold">⚠️ هل أنت متأكد تماماً؟ سيتم حذف كافة قسائم زينة، وسجل التفاعلات، وباقة الورد، وكل البيانات نهائياً بلا رجعة!</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClearLogs();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-700 transition-all active:scale-95 shadow-sm"
                >
                  نعم، احذف كل شيء بلا رجعة
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-300 transition-all"
                >
                  تراجع وإلغاء
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-5 py-3 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>تصفير كامل لقاعدة البيانات بلا رجعة ⚠️</span>
            </button>
          )}

          {/* Test email notification button */}
          <button
            onClick={onSendTestEmail}
            disabled={emailStatus === 'sending'}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-slate-500" />
            <span>{emailStatus === 'sending' ? 'جاري إرسال التجربة...' : 'إرسال إشعار تجريبي للتأكد ✉'}</span>
          </button>
        </div>

        {/* Status indicator feedback */}
        {emailStatus === 'sending' && (
          <p className="text-xs text-indigo-600 font-semibold animate-pulse">
            ⌛ جاري الاتصال بخدمة الإشعارات المزدوجة للتأكد من جاهزية الإرسال لـ alzuhairi10@gmail.com...
          </p>
        )}
        {emailStatus === 'success' && (
          <p className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            ✅ تم إرسال الإشعار التجريبي بنجاح! تفقد بريدك الجديد للتأكد من وصوله.
          </p>
        )}
        {emailStatus === 'error' && (
          <p className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 p-3 rounded-xl">
            ❌ فشل إرسال البريد التجريبي: {emailErrorMsg || 'حدث خطأ في الاتصال.'}
          </p>
        )}
      </div>
    </div>
  );
}
