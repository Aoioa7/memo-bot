"use client";
import React, { useState } from 'react';
import { useEffect } from 'react';

import Form from "./Components/Form";
import Title from "./Components/Title";

export default function Home() {
	const [mounted, setMounted] = useState(false);
	//クライアント側か否かのフラグ管理
	useEffect(()=> {
	  setMounted(true);
	}, [])

	if (typeof window === 'undefined') {
		console.log('we are not  running on the client')
	}
	// クライアント側で処理したい
	if (mounted) {
		return (
			<main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
			  <div className="max-w-md mx-auto bg-green-100  shadow-md">
				<Title/>
				<Form/>
			  </div>
			</main>
		)
	}
}
