  import Header from "@/components/Header";
  import Footer from "@/components/Footer";
  import Cars from "@/components/CarList"; // <— Правильный путь
import Link from "next/link";

  export default function Home() {
    return (
      <div className="flex h-screen flex-col overflow-x-hidden overflow-y-auto hide-scrollbar">
        <header>
          <Header />
        </header>

        <main className="flex-1">
          <Cars />
          <Link href="/add-car" className="hover:text-blue-400">
  Добавить машину
</Link>

        </main>

        <footer className="w-screen">
          <Footer />
        </footer>
      </div>
    );
  }
