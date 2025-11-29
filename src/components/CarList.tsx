"use client";
import { useState, useEffect } from "react";
import { Car, getCars, deleteCar, sellCar, completePayment, updateCarPayment } from "@/api/carsApi";
import SellModal from "./SellModal";

interface MonetizationModalProps {
  car: Car;
  usdRate: number;
  onClose: () => void;
  onUpdate: (updatedCar: Car) => void;
}

function MonetizationModal({ car, usdRate, onClose, onUpdate }: MonetizationModalProps) {
  const handlePay = async (month: string) => {
    const amountUSD = Number(prompt("Сумма оплаты (USD)"));
    if (!amountUSD || amountUSD <= 0) return;

    try {
      const updated = await updateCarPayment(car._id!, { month, amountUSD, rateAtPayment: usdRate });
      onUpdate(updated);
    } catch (err) {
      console.error("Ошибка при оплате:", err);
      alert("Не удалось сохранить платёж");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">{car.make} {car.model} — график платежей</h2>

        <div className="grid grid-cols-3 gap-2">
          {(car.payments || []).map(p => (
            <button
              key={p.month}
              className={`p-2 rounded ${p.paid ? "bg-green-500" : p.due ? "bg-yellow-500" : "bg-red-500"}`}
              onClick={() => !p.paid && handlePay(p.month)}
            >
              {p.month} {p.paid ? "✓" : ""}
            </button>
          ))}
        </div>

        <p>Оплачено: {car.paidMonths}/{car.totalMonths}</p>

        <button className="mt-2 bg-red-600 px-4 py-2 rounded" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [sellModalCar, setSellModalCar] = useState<Car | null>(null);
  const [monetizationCar, setMonetizationCar] = useState<Car | null>(null);
  const [usdRate, setUsdRate] = useState(0);

  const fetchCars = async () => {
    const data = await getCars();
    setCars(data);
  };

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

  const handleDelete = async (id: string) => {
    await deleteCar(id);
    setCars(prev => prev.filter(c => c._id !== id));
  };

  const handleUpdate = (updatedCar: Car) => {
    setCars(prev => prev.map(c => c._id === updatedCar._id ? updatedCar : c));
  };

  const handleSell = async (data: Partial<Car>) => {
    if (!sellModalCar) return;
    const updated = await sellCar(sellModalCar._id!, data);
    handleUpdate(updated.car);
    setSellModalCar(null);
  };

  const handleCompletePayment = async (car: Car) => {
    await completePayment(car._id!);
    fetchCars();
  };

  return (
    <div className="space-y-4 p-4">
      {cars.map(car => (
        <div key={car._id} className="flex justify-between p-4 bg-slate-700 rounded items-start">
          <div>
            <h3 className="text-lg font-semibold">{car.make} {car.model} ({car.year})</h3>
            <p>
              Статус: <span className={`px-2 py-1 rounded ${
                car.status === "available" ? "bg-green-500" :
                car.status === "sold" ? "bg-blue-500" :
                "bg-yellow-500"
              }`}>
                {car.status === "rented" ? `В рассрочке (${car.paidMonths || 0}/${car.totalMonths || 0})` : car.status}
              </span>
            </p>
          </div>

          <div className="flex gap-2 flex-col sm:flex-row">
            {car.status === "available" && (
              <button className="bg-blue-600 px-3 py-1 rounded" onClick={() => setSellModalCar(car)}>Продать</button>
            )}

            {car.status === "rented" && (
              <button className="bg-yellow-600 px-3 py-1 rounded" onClick={() => handleCompletePayment(car)}>
                Завершить рассрочку
              </button>
            )}

            {(car.status === "available" || car.status === "sold") && (
              <button className="bg-red-600 px-3 py-1 rounded" onClick={() => handleDelete(car._id!)}>
                Удалить
              </button>
            )}

            {car.status === "rented" && (
              <button className="bg-purple-600 px-3 py-1 rounded" onClick={() => setMonetizationCar(car)}>
                Управление
              </button>
            )}
          </div>
        </div>
      ))}

      {sellModalCar && (
        <SellModal
          car={sellModalCar}
          onClose={() => setSellModalCar(null)}
          onSell={handleSell}
        />
      )}

      {monetizationCar && (
        <MonetizationModal
          car={monetizationCar}
          usdRate={usdRate}
          onClose={() => setMonetizationCar(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
