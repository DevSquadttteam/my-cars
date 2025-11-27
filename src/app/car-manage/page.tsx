"use client";

import { useState } from "react";
import AddCar from "@/components/Addcar";
import CarList from "@/components/CarList";

export default function CarManage() {
    const [reload, setReload] = useState(false);

    return (
        <div className="p-4 space-y-6">
            <AddCar onCarAdded ={() => setReload(!reload)} />

            <h1 className="text-2xl font-bold">Все машины</h1>

            {/* передаём reload как key чтобы обновить список */}
            <CarList key={reload.toString()} />
        </div>
    );
}
