"use client";
import { useState } from "react";
import { Car } from "@/api/carsApi";

interface SellModalProps {
  car: Car;
  onClose: () => void;
  onSell: (data: Partial<Car>) => void;
}

const SellModal: React.FC<SellModalProps> = ({ car, onClose, onSell }) => {
  const [soldTo, setSoldTo] = useState("");
  const [priceSale, setPriceSale] = useState("");
  const [saleType, setSaleType] = useState<"cash" | "monthly" | "monthlyWithDownPayment">("cash");
  const [downPayment, setDownPayment] = useState("");
  const [months, setMonths] = useState("");
  const [percent, setPercent] = useState("");

  const calcMonthly = () => {
    const price = Number(priceSale);
    const dp = Number(downPayment || 0);
    const m = Number(months || 1);
    const pct = Number(percent || 0);
    if (!price || !m) return 0;
    const remain = price - dp;
    const total = remain + remain * (pct / 100);
    return Number((total / m).toFixed(2));
  };

  const handleSubmit = () => {
    if (!soldTo || !priceSale) {
      alert("Заполните обязательные поля");
      return;
    }

    const data: Partial<Car> = {
      soldTo,
      priceSale: Number(priceSale),
      saleType,
      downPayment: saleType === "monthlyWithDownPayment" ? Number(downPayment || 0) : 0,
      monthlyPayment: saleType === "cash" ? 0 : calcMonthly(),
      saleCurrency: "USD",
      status: saleType === "cash" ? "sold" : "rented",
      paidMonths: 0,
      totalMonths: saleType === "cash" ? 0 : Number(months || 1)
    };

    onSell(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Продажа: {car.make} {car.model}</h2>

        <input
          className="w-full p-2 bg-slate-700 rounded"
          placeholder="Кому продаётся?"
          value={soldTo}
          onChange={(e) => setSoldTo(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-2 bg-slate-700 rounded"
          placeholder="Цена продажи"
          value={priceSale}
          onChange={(e) => setPriceSale(e.target.value)}
        />

        <select
          className="w-full p-2 bg-slate-700 rounded"
          value={saleType}
          onChange={(e) => setSaleType(e.target.value as any)}
        >
          <option value="cash">Наличные</option>
          <option value="monthly">Рассрочка</option>
          <option value="monthlyWithDownPayment">Рассрочка с предоплатой</option>
        </select>

        {(saleType !== "cash") && (
          <>
            {saleType === "monthlyWithDownPayment" && (
              <input
                type="number"
                className="w-full p-2 bg-slate-700 rounded"
                placeholder="Первоначальный взнос"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            )}

            <input
              type="number"
              className="w-full p-2 bg-slate-700 rounded"
              placeholder="Срок (месяцев)"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />

            <input
              type="number"
              className="w-full p-2 bg-slate-700 rounded"
              placeholder="Процент"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />

            <p className="text-green-400">
              Месячный платёж: {calcMonthly()} USD
            </p>
          </>
        )}

        <div className="flex gap-3">
          <button className="bg-gray-600 w-full py-2 rounded" onClick={onClose}>Отмена</button>
          <button className="bg-green-600 w-full py-2 rounded" onClick={handleSubmit}>Продать</button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;
