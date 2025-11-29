// src/api/carsApi.ts
const API_URL = "https://server-0bof.onrender.com/api/cars";

export interface Car {
  _id?: string;
  make: string;
  model: string;
  year: number;
  pricePurchase: number;
  purchaseCurrency: string;
  boughtFrom?: string;
  priceSale?: number;
  saleCurrency?: string;
  soldTo?: string;
  saleType: "cash" | "monthly" | "monthlyWithDownPayment";
  downPayment?: number;
  monthlyPayment?: number;
  status: "available" | "sold" | "rented";
  paidMonths?: number;
  totalMonths?: number;
  startDate?: string;
  payments?: {
    month: string;
    due: boolean;
    paid: boolean;
    paidDate?: string;
    amountUSD?: number;
    amountUZS?: number;
    rateAtPayment?: number;
  }[];
}

export async function getCars(): Promise<Car[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json();
}

export async function addCar(data: Car, token?: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Ошибка при добавлении машины");
  return res.json();
}

export async function deleteCar(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Ошибка при удалении машины");
  return res.json();
}

export async function sellCar(id: string, data: Partial<Car>) {
  const res = await fetch(`${API_URL}/${id}/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ошибка при продаже машины");
  }
  return res.json();
}

export async function completePayment(id: string) {
  const res = await fetch(`${API_URL}/${id}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Ошибка при завершении рассрочки");
  return res.json();
}

// --- НОВАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ОПЛАТЫ ---
export async function updateCarPayment(id: string, data: { month: string; amountUSD: number; rateAtPayment: number }) {
  const res = await fetch(`${API_URL}/${id}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ошибка при оплате");
  }
  return res.json();
}
