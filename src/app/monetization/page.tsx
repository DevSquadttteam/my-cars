"use client";
import { useState, useEffect } from "react";
import { Car, getCars, updateCarPayment } from "@/api/carsApi";

export default function Monetization() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [usdRate, setUsdRate] = useState(0);

  // Получаем машины в рассрочке
  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await getCars();
      // фильтруем только те машины, которые в рассрочке
      setCars(data.filter(c => c.status === "rented"));
    } finally {
      setLoading(false);
    }
  };

  // Получаем актуальный курс USD → UZS
  const fetchRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=UZS");
      const data = await res.json();
      setUsdRate(data.rates?.UZS || 0);
    } catch {
      setUsdRate(0);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchRate();
  }, []);

  // Оплата конкретного месяца
  const handlePay = async (carId: string, month: string) => {
    const amountUSD = Number(prompt("Сумма оплаты (USD)"));
    if (!amountUSD || amountUSD <= 0) return;

    try {
      const updated = await updateCarPayment(carId, { month, amountUSD, rateAtPayment: usdRate });
      setCars(prev => prev.map(c => c._id === updated._id ? updated : c));
    } catch (err) {
      console.error("Ошибка при оплате:", err);
      alert("Не удалось сохранить платёж");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Монетизация и график платежей</h1>

      {loading && <div>Загрузка...</div>}
      {!loading && cars.length === 0 && <div>Нет машин в рассрочке</div>}

      {cars.map(car => (
        <div key={car._id} className="p-4 bg-slate-700 rounded space-y-2">
          <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
          <p>Продано: {car.soldTo || "Не указано"} | Месячный платёж: {car.monthlyPayment} USD</p>

          <div className="grid grid-cols-3 gap-2">
            {(car.payments || []).map(p => (
              <button
                key={p.month}
                className={`p-2 rounded ${
                  p.paid ? "bg-green-500" : p.due ? "bg-yellow-500" : "bg-red-500"
                }`}
                onClick={() => !p.paid && handlePay(car._id!, p.month)}
              >
                {p.month} {p.paid ? "✓" : ""}
              </button>
            ))}
          </div>

          <p>Оплачено: {car.paidMonths}/{car.totalMonths}</p>
        </div>
      ))}
    </div>
  );
}
