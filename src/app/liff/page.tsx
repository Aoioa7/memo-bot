"use client";
import { useEffect } from 'react';

import Form from "./Components/Form";
import Title from "./Components/Title";

export default function Home() {
	if (typeof window === 'undefined') {
		console.log('we are not  running on the client')
	}
	let flag = false
	useEffect(()=> {
		flag = true
	  }, [])
	  if (!flag) {
		return
	  }
		return (
			<main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
			  <div className="max-w-md mx-auto bg-green-100  shadow-md">
				<Title/>
				<Form/>
			  </div>
			</main>
		  )
}
