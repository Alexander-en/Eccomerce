"use client";


export default function Unauthorized(){
    return (
        <section className="bg-black min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
            <h1 className="text-red-500 text-3xl tracking-wide font-bold">You don't have access to view this page!</h1>
        </div>
        </section>
    );
}