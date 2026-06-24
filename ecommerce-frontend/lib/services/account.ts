import api from "@/lib/api";
import { Address } from "@/types";

// --- Profile ---

export async function updateProfile(data: { name: string; phone?: string }) {
  const res = await api.put("/v1/auth/profile", data);
  return res.data.data;
}

export async function updatePassword(data: {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}) {
  await api.put("/v1/auth/password", {
    current_password:      data.currentPassword,
    password:              data.password,
    password_confirmation: data.passwordConfirmation,
  });
}

// --- Addresses ---

type RawAddress = {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string | null;
  is_default: boolean;
};

function toAddress(raw: RawAddress): Address {
  return {
    id:         raw.id,
    label:      raw.label,
    street:     raw.street,
    city:       raw.city,
    state:      raw.state,
    country:    raw.country,
    postalCode: raw.postal_code,
    isDefault:  raw.is_default,
  };
}

export async function getAddresses(): Promise<Address[]> {
  const res = await api.get("/v1/addresses");
  return (res.data.data as RawAddress[]).map(toAddress);
}

export async function createAddress(data: Omit<Address, "id" | "country">): Promise<Address> {
  const res = await api.post("/v1/addresses", {
    label:       data.label,
    street:      data.street,
    city:        data.city,
    state:       data.state,
    postal_code: data.postalCode,
    is_default:  data.isDefault,
  });
  return toAddress(res.data.data as RawAddress);
}

export async function updateAddress(id: number, data: Omit<Address, "id" | "country">): Promise<Address> {
  const res = await api.put(`/v1/addresses/${id}`, {
    label:       data.label,
    street:      data.street,
    city:        data.city,
    state:       data.state,
    postal_code: data.postalCode,
    is_default:  data.isDefault,
  });
  return toAddress(res.data.data as RawAddress);
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/v1/addresses/${id}`);
}
