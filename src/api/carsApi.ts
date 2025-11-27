const API_URL = "http://localhost:5000/api/cars";

export interface Car {
    _id?: string;
    make: string;
    model: string;
    year: number;
    pricePurchase: number;
    purchaseCurrency: string;
    boughtFrom?: string;

    priceSale?: number;
    saleCurrency?: string;
    soldTo?: string;

    saleType: string;
    downPayment?: number;
    monthlyPayment?: number;

    status: string;
}

export async function getCars(): Promise<Car[]> {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch cars");
    return res.json();
}

export async function addCar(data: Car, token?: string) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Ошибка при добавлении машины");
    return res.json();
}

export async function deleteCar(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Ошибка при удалении машины");
    return res.json();
}
