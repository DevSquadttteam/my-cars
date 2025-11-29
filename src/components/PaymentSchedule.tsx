"use client";

import { useState, useEffect } from "react";
import { Car, completePayment } from "@/api/carsApi";

interface PaymentScheduleProps {
  car: Car;
  onUpdate: (updatedCar: Car) => void;
}

export default function PaymentSchedule({ car, onUpdate }: PaymentScheduleProps) {
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState<number | null>(null);

  // Получаем актуальный курс USD → UZS
  const fetchRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=UZS");
      const data = await res.json();
      if (data.rates && data.rates.UZS) setRate(data.rates.UZS);
    } catch (err) {
      console.error("Не удалось получить курс:", err);
      setRate(null);
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  const handlePay = async (monthIndex: number) => {
    // Проверяем наличие payments
    if (!car.payments || !car.payments[monthIndex]) {
      alert("Ошибка: платежная информация недоступна");
      return;
    }

    if (!rate) {
      alert("Курс USD → UZS недоступен. Попробуйте позже.");
      return;
    }

    const payment = car.payments[monthIndex];
    if (payment.paid) return;

    const defaultUSD = car.monthlyPayment || 0;
    const defaultUZS = Number((defaultUSD * rate).toFixed(0));

    const confirmed = prompt(
      `Внести платёж за ${payment.month}?\nСумма: ${defaultUSD} USD ≈ ${defaultUZS} UZS\nВведите сумму, если отличается:`,
      defaultUSD.toString()
    );

    if (!confirmed) return;

    const paidAmount = Number(confirmed);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      alert("Некорректная сумма");
      return;
    }

    setLoading(true);
    try {
      // Создаем копию с гарантированным payments
      const updatedPayments = [...car.payments];
      updatedPayments[monthIndex] = {
        ...updatedPayments[monthIndex],
        paid: true,
        due: false,
        paidDate: new Date().toISOString().split("T")[0],
        amountUSD: paidAmount,
        amountUZS: Number((paidAmount * rate).toFixed(0)),
        rateAtPayment: rate
      };

      const updatedCar: Car = {
        ...car,
        payments: updatedPayments,
        paidMonths: (car.paidMonths || 0) + 1
      };

      // Завершение рассрочки
      if (updatedCar.paidMonths === updatedCar.totalMonths) {
        if (car._id) {
          await completePayment(car._id);
        }
        updatedCar.status = "sold";
      }

      onUpdate(updatedCar);
    } catch (err) {
      console.error("Ошибка при оплате:", err);
      alert("Ошибка при оплате");
    } finally {
      setLoading(false);
    }
  };

  // Проверка на случай, если payments не существует
  if (!car.payments || car.payments.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded">
        <p className="text-gray-500">График платежей отсутствует</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {car.payments.map((payment, index) => {
        const monthDate = new Date(payment.month + "-01");
        const today = new Date();
        const isOverdue = !payment.paid && monthDate < today;

        let bgClass = "bg-yellow-500";
        if (payment.paid) bgClass = "bg-green-500";
        else if (isOverdue) bgClass = "bg-red-500";

        return (
          <div
            key={index}
            className={`p-2 rounded text-center cursor-pointer text-white ${bgClass} ${
              loading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => handlePay(index)}
          >
            <div className="font-bold">{payment.month}</div>
            <div className="text-sm mt-1">
              {payment.paid ? `Оплачено ✅` : isOverdue ? `Просрочено ⚠️` : `Ожидание 💰`}
            </div>
            {payment.paid && (
              <div className="text-xs mt-1">
                {payment.amountUSD} USD {rate ? `≈ ${payment.amountUZS} UZS` : ""}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}