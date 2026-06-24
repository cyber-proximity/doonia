"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, MapPin, Star } from "lucide-react";
import { Address } from "@/types";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/services/account";

const addressSchema = z.object({
  label:      z.string().min(1, "Label is required"),
  street:     z.string().min(3, "Street is required"),
  city:       z.string().min(2, "City is required"),
  state:      z.string().min(2, "Region is required"),
  postalCode: z.string().optional().nullable(),
  isDefault:  z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const ghanaRegions = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
  "Northern", "Upper East", "Upper West", "Volta", "Brong-Ahafo",
  "Oti", "Bono East", "Ahafo", "Western North", "North East", "Savannah",
];

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Address;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label:      initial?.label      ?? "",
      street:     initial?.street     ?? "",
      city:       initial?.city       ?? "",
      state:      initial?.state      ?? "",
      postalCode: initial?.postalCode ?? "",
      isDefault:  initial?.isDefault  ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Label</label>
          <input
            {...register("label")}
            placeholder="Home, Office, etc."
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
          <input
            {...register("street")}
            placeholder="House number, street name"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City / Town</label>
          <input
            {...register("city")}
            placeholder="Accra"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
          <select
            {...register("state")}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            <option value="">Select region…</option>
            {ghanaRegions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Digital Address <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            {...register("postalCode")}
            placeholder="GA-XXX-XXXX"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="flex items-center gap-2 self-end pb-1">
          <input
            {...register("isDefault")}
            type="checkbox"
            id="isDefault"
            className="w-4 h-4 rounded accent-primary-500"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {isSubmitting ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses]   = useState<Address[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Address | null>(null);
  const [deleting, setDeleting]     = useState<number | null>(null);

  async function load() {
    try {
      setAddresses(await getAddresses());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data: AddressFormData) {
    await createAddress({ ...data, postalCode: data.postalCode ?? null });
    await load();
    setShowForm(false);
  }

  async function handleUpdate(data: AddressFormData) {
    if (!editing) return;
    await updateAddress(editing.id, { ...data, postalCode: data.postalCode ?? null });
    await load();
    setEditing(null);
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      {[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Add / Edit form */}
      {(showForm || editing) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200">
          <h2 className="font-bold text-gray-900 text-base mb-5">
            {editing ? "Edit Address" : "New Address"}
          </h2>
          <AddressForm
            initial={editing ?? undefined}
            onSave={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center py-16">
          <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="font-semibold text-gray-700 mb-1">No saved addresses</p>
          <p className="text-sm text-gray-400 mb-5">Add an address for faster checkout.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Plus size={16} /> Add Address
          </button>
        </div>
      ) : (
        <>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="flex items-center gap-1 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">
                      <Star size={10} fill="currentColor" /> Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{addr.street}</p>
                <p className="text-sm text-gray-500">{addr.city}, {addr.state}</p>
                {addr.postalCode && <p className="text-xs text-gray-400 mt-0.5">{addr.postalCode}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setEditing(addr); setShowForm(false); }}
                  className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deleting === addr.id}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {!showForm && !editing && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              <Plus size={16} /> Add Another Address
            </button>
          )}
        </>
      )}
    </div>
  );
}
