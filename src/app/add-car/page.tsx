"use client";

import AddCar from "@/components/Addcar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AddCarPage() {
  return (
    <div className="flex h-screen flex-col overflow-x-hidden overflow-y-auto hide-scrollbar">
      <header>
        <Header />
      </header>

      <main className="flex-1 px-4 py-6 flex justify-center">
        <div className="w-full max-w-xl">
          <AddCar onCarAdded={() => alert("Машина добавлена!")} />
        </div>
      </main>

      <footer className="w-screen">
        <Footer />
      </footer>
    </div>
  );
}
