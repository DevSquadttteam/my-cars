"use client";
import { useState, useEffect } from "react";
import { Car, getCars, deleteCar, sellCar, completePayment } from "@/api/carsApi";
import SellModal from "./SellModal";

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [sellModalCar, setSellModalCar] = useState<Car | null>(null);

  const fetchCars = async () => {
    const data = await getCars();
    setCars(data);
  };

  useEffect(() => { fetchCars(); }, []);

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
    <div className="space-y-4">
      {cars.map(car => (
        <div key={car._id} className="flex justify-between p-4 bg-slate-700 rounded">
          <div>
            <h3>{car.make} {car.model} ({car.year})</h3>
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

          <div className="flex gap-2">
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
    </div>
  );
}
