import { useState, useEffect } from 'react';
import { Save, Phone, CreditCard, Truck, ExternalLink } from 'lucide-react';
import {
  useAdminSettings,
  useUpdateSettings,
  SiteSettings,
} from '@/hooks/admin/useAdminSettings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DEFAULT_SETTINGS: SiteSettings = {
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
  whatsappNumber: '',
  deliveryFee: 1500,
  freeDeliveryThreshold: 15000,
};

export default function SettingsPage() {
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate: saveSettings, isPending: isSaving } = useUpdateSettings();

  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
      setDirty(false);
    }
  }, [settings]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    saveSettings(form, { onSuccess: () => setDirty(false) });
  };

  if (isLoading) return <LoadingSpinner />;

  const waPreview = form.whatsappNumber
    ? `https://wa.me/${form.whatsappNumber}`
    : null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-brown font-semibold">Site Settings</h1>
        <p className="text-brown/40 text-sm mt-1">
          Update payment details, contact info, and shipping rules.
        </p>
      </div>

      <div className="space-y-5">
        {/* ── Bank Transfer ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-terracotta/10 rounded-xl">
              <CreditCard className="h-5 w-5 text-terracotta" />
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-brown">Bank Transfer Details</h2>
              <p className="text-xs text-brown/40">Shown to customers after checkout</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => set('bankName', e.target.value)}
                placeholder="e.g. First Bank Nigeria"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Account Name</label>
              <input
                type="text"
                value={form.bankAccountName}
                onChange={(e) => set('bankAccountName', e.target.value)}
                placeholder="e.g. Blossom Natural Ltd"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Account Number</label>
              <input
                type="text"
                value={form.bankAccountNumber}
                onChange={(e) => set('bankAccountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0000000000"
                className="input font-mono tracking-widest"
                maxLength={10}
              />
            </div>
          </div>
        </section>

        {/* ── WhatsApp ──────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-green-100 rounded-xl">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-brown">WhatsApp Contact</h2>
              <p className="text-xs text-brown/40">Used for the floating chat button and order follow-ups</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => set('whatsappNumber', e.target.value.replace(/[^\d]/g, ''))}
              placeholder="2348012345678"
              className="input font-mono"
            />
            <p className="text-xs text-brown/40 mt-1">
              Include country code, no spaces or + sign. Example: 2348012345678
            </p>
            {waPreview && (
              <a
                href={waPreview}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:underline mt-2"
              >
                <ExternalLink className="h-3 w-3" />
                Test link: {waPreview}
              </a>
            )}
          </div>
        </section>

        {/* ── Delivery ──────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 bg-sage/20 rounded-xl">
              <Truck className="h-5 w-5 text-sage-dark" />
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-brown">Delivery Settings</h2>
              <p className="text-xs text-brown/40">Applied to all orders at checkout</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Delivery Fee (₦)</label>
              <input
                type="number"
                value={form.deliveryFee}
                onChange={(e) => set('deliveryFee', Math.max(0, Number(e.target.value)))}
                min={0}
                step={100}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Free Delivery Above (₦)</label>
              <input
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={(e) => set('freeDeliveryThreshold', Math.max(0, Number(e.target.value)))}
                min={0}
                step={500}
                className="input"
              />
              <p className="text-xs text-brown/40 mt-1">
                Orders above this amount qualify for free delivery
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-3 bg-cream rounded-xl text-sm text-brown/60">
            Orders under <span className="font-semibold text-brown">₦{form.freeDeliveryThreshold.toLocaleString()}</span>{' '}
            pay <span className="font-semibold text-brown">₦{form.deliveryFee.toLocaleString()}</span> delivery.{' '}
            Orders at or above that amount get free delivery.
          </div>
        </section>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || !dirty}
        className="btn-primary mt-6 w-full flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving…' : dirty ? 'Save Settings' : 'No Changes'}
      </button>
    </div>
  );
}
