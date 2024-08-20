"use client";

import Form from "./Components/Form";
import Title from "./Components/Title";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-green-100  shadow-md">
        <Title/>
        <Form/>
      </div>
    </main>
  )
}
