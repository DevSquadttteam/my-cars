import AddCar from "@/components/Addcar";
import { getCars } from "@/api/carsApi";

export default async function CarsPage() {
    const cars = await getCars();

    return (
        <div className="p-4">
            <AddCar onCarAdded={() => {}} />

            <h1 className="text-2xl font-bold mt-6">Все машины</h1>

            <ul className="mt-4 space-y-2">
                {cars.map((c) => (
                    <li key={c._id} className="bg-slate-700 p-3 rounded">
                        {c.make} {c.model} — {c.year}
                    </li>
                ))}
            </ul>
        </div>
    );
}
  