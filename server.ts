import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to ensure database directory and file exist with initial state
function ensureDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const defaultState = {
    partnerName: 'زينة رشاد',
    senderName: 'حمد',
    selectedReason: 'مزاجيتي بالأمس 🥺',
    customReason: '',
    isForgiven: false,
    activeTab: 'letter',
    customLetterDraft: '',
    letterSincerity: 'sweet',
    letterOpened: false,
    bouquet: {
      selectedFlowers: [],
      wrappingColor: 'pink',
      ribbonMessage: 'من كل قلبي',
      bouquetGifted: false,
    },
    activityLogs: [],
    coupons: [
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
    ],
    memories: [
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
    ],
    reasons: [
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
    ],
  };

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf-8');
  }
}

async function startServer() {
  ensureDatabase();

  const app = express();
  app.use(express.json());

  // API Endpoints
  app.get('/api/state', (req, res) => {
    try {
      ensureDatabase();
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      res.json(data);
    } catch (err: any) {
      console.error('Error reading state:', err);
      res.status(500).json({ error: 'Failed to load apology state.' });
    }
  });

  app.post('/api/state', (req, res) => {
    try {
      ensureDatabase();
      const updatedState = req.body;
      
      // Let's validate we received an object
      if (!updatedState || typeof updatedState !== 'object') {
        return res.status(400).json({ error: 'Invalid state object.' });
      }

      // To prevent client autosaves from wiping out activityLogs written by server-side endpoints
      try {
        if (fs.existsSync(DB_FILE)) {
          const rawCurrent = fs.readFileSync(DB_FILE, 'utf-8');
          const currentData = JSON.parse(rawCurrent);
          
          const serverLogs = currentData.activityLogs || [];
          const clientLogs = updatedState.activityLogs || [];
          
          const logMap = new Map();
          // Merge client-provided logs and server logs, de-duplicating by unique item ID
          [...clientLogs, ...serverLogs].forEach((log: any) => {
            if (log && log.id) {
              logMap.set(log.id, log);
            }
          });
          
          updatedState.activityLogs = Array.from(logMap.values())
            .sort((a: any, b: any) => Number(b.id) - Number(a.id));
        } else {
          updatedState.activityLogs = updatedState.activityLogs || [];
        }
      } catch (err) {
        console.error('Error merging activity logs on POST state:', err);
      }

      fs.writeFileSync(DB_FILE, JSON.stringify(updatedState, null, 2), 'utf-8');
      res.json({ success: true, state: updatedState });
    } catch (err: any) {
      console.error('Error writing state:', err);
      res.status(500).json({ error: 'Failed to save apology state.' });
    }
  });

  app.post('/api/clear-logs', (req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        fs.unlinkSync(DB_FILE);
      }
      ensureDatabase();
      res.json({ success: true, reset: true });
    } catch (err: any) {
      console.error('Error completely resetting database:', err);
      res.status(500).json({ error: 'Failed to completely reset database.' });
    }
  });

  // Dedicated email notification routing via formsubmit.co
  app.post('/api/notify-email', async (req, res) => {
    const { type, details } = req.body;
    const targetEmail = 'alzuhairi10@gmail.com';

    let subject = 'تحديث جديد من حديقة الاعتذار 💖';
    let message = '';

    if (type === 'forgive') {
      subject = '🎉 زينة قبلت الاعتذار وسامحتك! 💖';
      message = `بشرى سارة يا حمد! 😍\n\nلقد ضغطت زينة رشاد على زر "نعم، سامحتك! 💖" وقبلت اعتذارك الصادق.\n\nتاريخ ووقت القبول: ${new Date().toLocaleString('ar-EG')}\n\nعادت المياه إلى مجاريها! حافظ على هذه الابتسامة الرائعة ولا تزعلها مجدداً. 😉`;
    } else if (type === 'coupon') {
      const { title, description, code } = details || {};
      subject = `🎫 زينة استخدمت قسيمة حب: ${title}`;
      message = `مرحباً حمد،\n\nلقد قامت زينة رشاد باستخدام قسيمة حب من القسائم المهداة إليها!\n\nتفاصيل القسيمة المستخدمة:\n- الاسم: ${title}\n- الوصف: ${description}\n- الرمز التفعيلي: ${code}\n\nحان الوقت لتنفيذ الوعد وإسعادها بالكامل! 🧸✨`;
    } else if (type === 'custom_coupon') {
      const { title, description, icon } = details || {};
      subject = `🎁 زينة صممت قسيمتها الخاصة: ${title}`;
      message = `مرحباً حمد،\n\nلقد قامت زينة رشاد بتصميم قسيمة حب مخصصة جديدة لتضاف لمجموعتها!\n\nتفاصيل القسيمة الجديدة:\n- الأيقونة: ${icon}\n- العنوان: ${title}\n- الوصف: ${description}\n\nالقسيمة جاهزة للاستخدام في أي وقت! 🥰`;
    } else if (type === 'bouquet') {
      const { flowerCount, wrappingColor, ribbonMessage } = details || {};
      subject = '💐 زينة أرسلت باقة الورد المنسقة!';
      message = `مرحباً حمد،\n\nلقد انتهت زينة من تنسيق باقة الورد الرائعة وأرسلتها إليك بنجاح!\n\nتفاصيل الباقة المنسقة:\n- عدد الورد الجوري: ${flowerCount} وردة\n- لون الغلاف المميز: ${wrappingColor === 'pink' ? 'وردي رقيق' : wrappingColor === 'lavender' ? 'خزامى هادئ' : 'ورق كرافت كلاسيكي'}\n- الرسالة المكتوبة على شريط الباقة: "${ribbonMessage}"\n\nتبدو باقة دافئة وحالمة تعكس جمال قلبها! 🌸`;
    } else if (type === 'test') {
      subject = '🌸 تفعيل إشعارات حديقة الاعتذار لحمد وزينة';
      message = `مرحباً حمد،\n\nهذه رسالة تجريبية لتفعيل نظام الإشعارات الفورية على بريدك الإلكتروني بنجاح.\n\nالآن، عند قيام زينة رشاد بأي تفاعل مثل:\n1. قبول الاعتذار والرضا والمسامحة 💖\n2. استخدام قسائم الحب 🎫\n3. تصميم قسيمة جديدة خاصة بها 🎁\n4. إرسال باقة ورد جوري مخصصة 💐\n\nستصلك التفاصيل كاملة فوراً على هذا الإيميل.\n\nيسعدنا جداً اهتمامك الرائع بزينة وحرصك على رضاها الجميل! 🥰`;
    } else {
      message = `تفاصيل مجهولة: ${JSON.stringify(req.body)}`;
    }

    try {
      // Save to server-side activity log
      try {
        if (fs.existsSync(DB_FILE)) {
          const raw = fs.readFileSync(DB_FILE, 'utf-8');
          const dbData = JSON.parse(raw);
          if (!dbData.activityLogs) {
            dbData.activityLogs = [];
          }
          
          let logTitle = '';
          let logDesc = '';
          let logIcon = '📝';
          
          if (type === 'forgive') {
            logTitle = 'قبلت الاعتذار وسامحتك! 💖';
            logDesc = 'لقد ضغطت زينة على زر الرضا والمسامحة وعادت المياه لمجاريها!';
            logIcon = '💖';
          } else if (type === 'coupon') {
            const { title, code } = details || {};
            logTitle = `استخدمت قسيمة: ${title}`;
            logDesc = `الرمز التفعيلي: ${code}`;
            logIcon = '🎫';
          } else if (type === 'custom_coupon') {
            const { title, description, icon } = details || {};
            logTitle = `صممت قسيمة جديدة: ${title}`;
            logDesc = description || '';
            logIcon = icon || '🎁';
          } else if (type === 'bouquet') {
            const { flowerCount, wrappingColor, ribbonMessage } = details || {};
            const wrapText = wrappingColor === 'pink' ? 'وردي رقيق' : wrappingColor === 'lavender' ? 'خزامى هادئ' : 'ورق كرافت كلاسيكي';
            logTitle = 'أرسلت باقة الورد المنسقة 💐';
            logDesc = `باقة تحتوي على ${flowerCount} وردات جورية مغلفة بـ (${wrapText}). الرسالة: "${ribbonMessage}"`;
            logIcon = '💐';
          } else if (type === 'test') {
            logTitle = 'رسالة تجريبية لتفعيل النظام ⚙️';
            logDesc = 'تم إرسال إشعار تجريبي بنجاح لتأكيد التفعيل.';
            logIcon = '⚙️';
          }
          
          if (logTitle) {
            dbData.activityLogs.unshift({
              id: Date.now().toString(),
              timestamp: new Date().toLocaleString('ar-EG', { hour12: true }),
              type,
              title: logTitle,
              description: logDesc,
              icon: logIcon
            });
            fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
          }
        }
      } catch (logErr) {
        console.error('Failed to append server-side activity log:', logErr);
      }

      // 1. Send via FormSubmit.co
      let formSubmitSuccess = false;
      let formSubmitResult = null;
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: subject,
            name: 'حديقة اعتذار حمد وزينة 🌸',
            message: message,
          }),
        });
        if (response.ok) {
          formSubmitResult = await response.json();
          formSubmitSuccess = true;
        } else {
          console.error('FormSubmit response not ok:', response.status);
        }
      } catch (err) {
        console.error('FormSubmit fetch failed:', err);
      }

      // 2. Dual Delivery Fallback via ntfy.sh (No activation needed, direct delivery)
      let ntfySuccess = false;
      try {
        const ntfyResponse = await fetch('https://ntfy.sh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: 'hamad-zeina-apology-garden-2026',
            title: subject,
            message: message,
            email: targetEmail,
          }),
        });
        if (ntfyResponse.ok) {
          ntfySuccess = true;
        } else {
          console.error('ntfy response not ok:', ntfyResponse.status);
        }
      } catch (err) {
        console.error('ntfy fetch failed:', err);
      }

      res.json({
        success: formSubmitSuccess || ntfySuccess,
        formSubmit: { success: formSubmitSuccess, result: formSubmitResult },
        ntfy: { success: ntfySuccess }
      });
    } catch (error: any) {
      console.error('Error sending email notification:', error);
      res.status(500).json({ error: 'Failed to send email notification.' });
    }
  });

  // Handle Vite Asset Server and Routing
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
