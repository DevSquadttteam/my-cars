'use client'

import Link from "next/link"



export default function Header() {
    return (
        <div>
            <header className="bg-slate-900">
                <div className="container max-w-[80%] m-auto">
                    <nav className="flex justify-between items-center">
                        <a href="/">
                            <h1 className="text-3xl font-bold py-5">My Cars</h1>
                        </a>
                        <ul className="flex gap-10">
                            <li>
                                <Link href="#">Home</Link>
                            </li>
                            <li>
                                <Link href="#">About</Link>
                            </li>
                            <li>
                                <Link href="#">Contact</Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    )
}