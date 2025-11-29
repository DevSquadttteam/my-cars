"use client";
import { useState, useEffect } from "react";
import { Car, updateCarPayment } from "@/api/carsApi";

interface Props {
  car: Car;
  onClose: () => void;
  onUpdate: (car: Car) => void;
}

export default function MonetizationModal({ car, onClose, onUpdate }: Props) {
  const [usdRate, setUsdRate] = useState(0);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=UZS");
        const data = await res.json();
        setUsdRate(data.rates.UZS || 0);
      } catch {
        setUsdRate(0);
      }
    };
    fetchRate();
  }, []);

  const handlePay = async (month: string) => {
    const amountUSD = Number(prompt("Сумма оплаты (USD)"));
    if (!amountUSD || amountUSD <= 0) return;

    const updated = await updateCarPayment(car._id!, { month, amountUSD, rateAtPayment: usdRate });
    onUpdate(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded w-[90%] max-w-2xl space-y-4">
        <h2 className="text-xl font-bold">{car.make} {car.model} - Монетизация</h2>
        <p>Продано: {car.soldTo}</p>
        <p>Месячный платёж: {car.monthlyPayment} USD</p>

        <div className="grid grid-cols-3 gap-2">
          {car.payments?.map(p => (
            <button
              key={p.month}
              className={`p-2 rounded ${p.paid ? "bg-green-500" : p.due ? "bg-yellow-500" : "bg-red-500"}`}
              onClick={() => !p.paid && handlePay(p.month)}
            >
              {p.month} {p.paid ? `✓ (${p.amountUSD} USD / ${p.amountUZS} UZS)` : ""}
            </button>
          ))}
        </div>

        <button className="mt-4 bg-red-600 px-4 py-2 rounded" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
