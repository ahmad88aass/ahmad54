export type OrderStatus =
  | 'قيد المعالجة'
  | 'انتظار الكود'
  | 'مكتمل'
  | 'ملغي';

export interface Profile {
  id: string;
  user_id: string;
  user_code: string;
  email: string;
  balance: number;
  is_admin: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  service_key: string;
  service_name: string;
  plan: string | null;
  price: number;
  target_input: string | null;
  status: OrderStatus;
  activation_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { user_code: string; email: string } | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

export interface ServicePlan {
  id: string;
  label: string;
  price: number;
}

export type ServiceCategory = 'whatsapp' | 'telegram' | 'instagram';

export interface ServiceDef {
  key: string;
  name: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  emoji?: string;
  plans?: ServicePlan[];
  inputLabel?: string;
  inputPlaceholder?: string;
  inputType?: 'username' | 'phone' | 'text' | 'textarea';
  cardCta?: string;
  flowMessage?: string;
  waitForCode?: boolean;
  presetPlan?: string;
  price?: number;
}

export type Page = 'home' | 'orders' | 'wallet' | 'profile' | 'admin';
