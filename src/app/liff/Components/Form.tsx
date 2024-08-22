"use client";

import { useEffect } from 'react'
import React, { useState } from 'react';
import List from "./List";

export default function Form() {
	const key = "memo-list"
	const item = localStorage.getItem(key)
	let initValue = []
	if (item) {
		initValue = JSON.parse(item);
	}

	const [memoList, setValues] = useState<string[]>(initValue);
    const [text, setNewText] = useState<string>('');

	const callback = (e: StorageEvent) => {
		if (e.key === key) {
		  setValues(
			prevMemoList => {
				const updatedItem = localStorage.getItem(key)
				let updatedList = prevMemoList
				if (updatedItem) {
					updatedList =JSON.parse(updatedItem)
				}
				return updatedList
				}
		  );
		}
	};
	//別のタブやウィンドウのローカルストレージとの同期
	useEffect(() => {
		window.addEventListener('storage', callback);
		return () => {
		  window.removeEventListener('storage', callback);
		};
	}, []); 
	//入力文字数に応じて大きさ変化(useEffectを使わないとstate変化->レンダリング->値の更新となる、値の更新を先にやりたい)
	useEffect(() => {
		const target = document.getElementById("my_textarea");
		if (target) {
		target.style.height = 'auto' 
		target.style.height = `${target.scrollHeight}px`
		}
	  }, [text])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewText(e.target.value);
    };

	//stateとlocalStorageを同期したい
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
		if (!text) {
			alert("何か入力してね！(空白や改行でもOK)");
			return
		}
        const newMemo: string = text;
        setValues(prevMemoList => {
		const updatedList = [...prevMemoList, newMemo]
		localStorage.setItem(key, JSON.stringify(updatedList));
		return updatedList
		}
		);
		setNewText('');
    };

    const handleDelete = (index: number) => {
        setValues(prevMemoList => {
        const updatedList = [...prevMemoList];
        updatedList.splice(index, 1);
		localStorage.setItem(key, JSON.stringify(updatedList));
		return updatedList;
        });
    };

    return (
        <div className="px-4 py-4 sm:p-6">
			<List memoList={memoList} onDelete={handleDelete}/>
			<br></br>
			<div className="mb-1">
                <form onSubmit={handleSubmit}>
                    <textarea
						id = "my_textarea"
                        className="resize-none overflow-hidden border p-8 "
                        placeholder="メモを入力してください"
                        value={text}
                        onChange={handleInputChange}
					>
					</textarea>
                    	<p><button className="bg-green-900 text-white px-8 py-2 rounded-md" type="submit">add</button></p>
                </form>
            </div>
        </div>
    );
}
