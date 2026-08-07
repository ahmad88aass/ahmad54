import type { ServiceDef } from './types';

export const SERVICES: ServiceDef[] = [
  {
    key: 'whatsapp_numbers',
    name: 'أرقام واتساب افتراضية',
    category: 'whatsapp',
    tagline: 'سيرفر 1 — دول الخليج',
    description:
      'أرقام واتساب افتراضية جاهزة للتفعيل. بعد الشراء يصبح الطلب بحالة "انتظار الكود" ويتم إرسال كود التفعيل يدوياً من الإدارة خلال وقت قصير.',
    plans: [
      { id: 'wa_sy', label: 'سوريا — سيرفر 1', price: 1.5 },
      { id: 'wa_sa', label: 'السعودية', price: 3.5 },
      { id: 'wa_ae', label: 'الإمارات', price: 3.5 },
      { id: 'wa_kw', label: 'الكويت', price: 3.0 },
      { id: 'wa_qa', label: 'قطر', price: 3.5 },
      { id: 'wa_bh', label: 'البحرين', price: 3.0 },
      { id: 'wa_om', label: 'عُمان', price: 3.0 },
    ],
    inputLabel: 'ملاحظات إضافية (اختياري)',
    inputPlaceholder: 'اكتب أي تفاصيل تريد إضافتها للطلب',
    inputType: 'text',
    cardCta: 'شراء رقم',
    waitForCode: true,
  },
  {
    key: 'telegram_premium',
    name: 'تيليجرام بريميوم',
    category: 'telegram',
    tagline: 'اشتراك مميز بتكلفة منخفضة',
    description:
      'تفعيل اشتراك تيليجرام بريميوم على حسابك مع جميع المزايا. أدخل اسم المستخدم الخاص بك.',
    plans: [
      { id: 'tg_1m', label: 'شهر واحد', price: 8 },
      { id: 'tg_3m', label: '3 أشهر', price: 12 },
    ],
    inputLabel: 'اسم المستخدم في تيليجرام',
    inputPlaceholder: '@username',
    inputType: 'username',
    cardCta: 'اشترك الآن',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
  },
  {
    key: 'instagram_verify',
    name: 'توثيق انستغرام',
    category: 'instagram',
    tagline: 'علامة التوثيق الزرقاء',
    description:
      'الحصول على علامة التوثيق على حساب انستغرام الخاص بك. أدخل اسم المستخدم وسيتم التواصل معك.',
    plans: [
      { id: 'ig_1m', label: 'شهر واحد', price: 5 },
      { id: 'ig_3m', label: '3 أشهر', price: 18 },
    ],
    inputLabel: 'اسم المستخدم في انستغرام',
    inputPlaceholder: '@username',
    inputType: 'username',
    cardCta: 'اطلب التوثيق',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
  },
  {
    key: 'telegram_verify',
    name: 'توثيق تيليجرام',
    category: 'telegram',
    tagline: 'علامة الزرقاء على حسابك',
    description:
      'الحصول على علامة التوثيق على حساب تيليجرام الخاص بك. أدخل اسم المستخدم.',
    inputLabel: 'اسم المستخدم في تيليجرام',
    inputPlaceholder: '@username',
    inputType: 'username',
    cardCta: 'اطلب التوثيق',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
    presetPlan: 'توثيق تيليجرام',
    price: 15,
  },
  {
    key: 'instagram_nurture',
    name: 'تربية حسابات انستغرام',
    category: 'instagram',
    tagline: 'تنمية وتحضين آمن للحساب',
    description:
      'خدمة تربية وتحضين حسابات انستغرام لزيادة الثقة والمتابعين بشكل آمن. أدخل تفاصيل الحساب.',
    inputLabel: 'تفاصيل الحساب / اسم المستخدم',
    inputPlaceholder: 'اكتب اسم المستخدم وأي تفاصيل مطلوبة',
    inputType: 'textarea',
    cardCta: 'ابدأ التربية',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
    presetPlan: 'تربية انستغرام',
    price: 10,
  },
  {
    key: 'whatsapp_nurture',
    name: 'تربية حسابات واتساب',
    category: 'whatsapp',
    tagline: 'تحضين الرقم لتجنب الحظر',
    description:
      'خدمة تربية وتحضين أرقام وحسابات واتساب لتجنب الحظر ورفع الثقة. أدخل رقم الهاتف والتفاصيل.',
    inputLabel: 'رقم الهاتف / التفاصيل',
    inputPlaceholder: '+963 9XX XXX XXX مع أي تفاصيل',
    inputType: 'phone',
    cardCta: 'ابدأ التربية',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
    presetPlan: 'تربية واتساب',
    price: 10,
  },
  {
    key: 'whatsapp_unban',
    name: 'فك حظر واتساب',
    category: 'whatsapp',
    tagline: 'استعادة الرقم المحظور',
    description:
      'خدمة فك حظر أرقام وحسابات واتساب المحظورة والمساعدة في استعادة الوصول.',
    inputLabel: 'رقم الهاتف المحظور',
    inputPlaceholder: '+963 9XX XXX XXX',
    inputType: 'phone',
    cardCta: 'اطلب فك الحظر',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
    presetPlan: 'فك حظر واتساب',
    price: 12,
  },
  {
    key: 'instagram_unban',
    name: 'فك حظر انستغرام',
    category: 'instagram',
    tagline: 'استعادة الحساب المعطّل',
    description:
      'خدمة فك حظر حسابات انستغرام المعطّلة والمساعدة في استعادة الوصول إليها.',
    inputLabel: 'اسم المستخدم / رابط الحساب',
    inputPlaceholder: '@username أو رابط الحساب',
    inputType: 'text',
    cardCta: 'اطلب فك الحظر',
    flowMessage: 'سيتم معالجة طلبك خلال 24 ساعة',
    presetPlan: 'فك حظر انستغرام',
    price: 12,
  },
];

export const TELEGRAM_AGENT = 'ahmad88_m';
export const TICKER_TEXT =
  'أهلاً وسهلاً بكم في متجرنا الرقمي | التواصل مع القيادة العامة: +963984335910';
export const SUPPORT_PHONE = '+963984335910';

export function getService(key: string): ServiceDef | undefined {
  return SERVICES.find((s) => s.key === key);
}
