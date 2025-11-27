"use client";

import { useState } from "react";
import { addCar } from "../api/carsApi";

interface AddCarProps {
    onCarAdded: () => void;
}

export default function AddCar({ onCarAdded }: AddCarProps) {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [pricePurchase, setPricePurchase] = useState("");
    const [purchaseCurrency, setPurchaseCurrency] = useState("USD");
    const [boughtFrom, setBoughtFrom] = useState("");

    const [priceSale, setPriceSale] = useState("");
    const [saleCurrency, setSaleCurrency] = useState("USD");
    const [soldTo, setSoldTo] = useState("");

    const [saleType, setSaleType] = useState("cash");
    const [downPayment, setDownPayment] = useState("");
    const [monthlyPayment, setMonthlyPayment] = useState("");

    const [status, setStatus] = useState("available");

    const validate = () => {
        if (!make.trim()) return "Укажи марку";
        if (!model.trim()) return "Укажи модель";

        const y = Number(year);
        const now = new Date().getFullYear();
        if (y < 1900 || y > now) return "Год указан неверно";

        if (Number(pricePurchase) <= 0) return "Цена покупки должна быть больше 0";

        if (saleType !== "cash" && Number(monthlyPayment) <= 0)
            return "Укажи месячный платёж";

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validate();
        if (error) {
            alert(error);
            return;
        }

        const token = localStorage.getItem("authToken") || undefined;

        try {
            await addCar(
                {
                    make,
                    model,
                    year: Number(year),

                    pricePurchase: Number(pricePurchase),
                    purchaseCurrency,
                    boughtFrom,

                    priceSale: Number(priceSale),
                    saleCurrency,
                    soldTo,

                    saleType,
                    downPayment: Number(downPayment),
                    monthlyPayment: Number(monthlyPayment),

                    status
                },
                token
            );

            onCarAdded();

            setMake("");
            setModel("");
            setYear("");
            setPricePurchase("");
            setPurchaseCurrency("USD");
            setBoughtFrom("");

            setPriceSale("");
            setSaleCurrency("USD");
            setSoldTo("");

            setSaleType("cash");
            setDownPayment("");
            setMonthlyPayment("");

            setStatus("available");
        } catch (err) {
            console.error(err);
            alert("Ошибка при добавлении");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded space-y-3">
            <h2 className="text-xl font-bold">Добавить машину</h2>

            <input
                className="w-full p-2 rounded bg-slate-700"
                placeholder="Марка"
                value={make}
                onChange={(e) => setMake(e.target.value)}
            />

            <input
                className="w-full p-2 rounded bg-slate-700"
                placeholder="Модель"
                value={model}
                onChange={(e) => setModel(e.target.value)}
            />

            <input
                className="w-full p-2 rounded bg-slate-700"
                placeholder="Год"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    className="p-2 rounded bg-slate-700"
                    placeholder="Цена покупки"
                    type="number"
                    value={pricePurchase}
                    onChange={(e) => setPricePurchase(e.target.value)}
                />

                <select
                    className="p-2 rounded bg-slate-700"
                    value={purchaseCurrency}
                    onChange={(e) => setPurchaseCurrency(e.target.value)}
                >
                    <option value="USD">USD</option>
                    <option value="UZS">UZS</option>
                </select>
            </div>

            <input
                className="w-full p-2 rounded bg-slate-700"
                placeholder="У кого куплено"
                value={boughtFrom}
                onChange={(e) => setBoughtFrom(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    className="p-2 rounded bg-slate-700"
                    placeholder="Цена продажи"
                    type="number"
                    value={priceSale}
                    onChange={(e) => setPriceSale(e.target.value)}
                />

                <select
                    className="p-2 rounded bg-slate-700"
                    value={saleCurrency}
                    onChange={(e) => setSaleCurrency(e.target.value)}
                >
                    <option value="USD">USD</option>
                    <option value="UZS">UZS</option>
                </select>
            </div>

            <input
                className="w-full p-2 rounded bg-slate-700"
                placeholder="Кому продано"
                value={soldTo}
                onChange={(e) => setSoldTo(e.target.value)}
            />

            <select
                className="w-full p-2 rounded bg-slate-700"
                value={saleType}
                onChange={(e) => setSaleType(e.target.value)}
            >
                <option value="cash">Наличные</option>
                <option value="monthly">Рассрочка</option>
                <option value="monthlyWithDownPayment">
                    Рассрочка с первым взносом
                </option>
            </select>

            {saleType !== "cash" && (
                <div className="grid grid-cols-2 gap-3">
                    <input
                        className="p-2 rounded bg-slate-700"
                        placeholder="Первоначальный взнос"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                    />

                    <input
                        className="p-2 rounded bg-slate-700"
                        placeholder="Месячный платёж"
                        type="number"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(e.target.value)}
                    />
                </div>
            )}

            <select
                className="w-full p-2 rounded bg-slate-700"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="available">Доступна</option>
                <option value="sold">Продана</option>
                <option value="rented">В аренде</option>
            </select>

            <button className="bg-green-600 w-full py-2 rounded">Добавить</button>
        </form>
    );
}
