"use client";

import { useEffect, useState } from "react";
import { getCars, Car, deleteCar } from "@/api/carsApi";

export default function CarList() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const data = await getCars();
        setCars(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Удалить машину?")) return;

        await deleteCar(id);
        load(); // обновляем список
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="space-y-3">
            {cars.map(car => (
                <div key={car._id} className="bg-slate-800 p-4 rounded flex justify-between items-center">
                    <div>
                        <h3 className="text-lg">{car.make} {car.model}</h3>
                        <p>Год: {car.year}</p>
                        <p>Куплено: {car.pricePurchase} {car.purchaseCurrency}</p>
                        <p>Статус: {car.status}</p>
                    </div>

                    <button
                        onClick={() => handleDelete(car._id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                        Удалить
                    </button>
                </div>
            ))}
        </div>
    );
}
