"use client";

import { useEffect } from 'react'
import React, { useState } from 'react';
import List from "./List";

export default function Form() {
	const key = "memo-list"
	//ローカルストレージを使用してタブを消してもデータが残るようにした
	const item = localStorage.getItem(key)
	let initValue = []
	if (item) {
		initValue = JSON.parse(item);
	}
	//state使用(ライフサイクル内での変数保存)
	const [memoList, setValues] = useState<string[]>(initValue);
    const [text, setNewText] = useState<string>('');
	//初回マウント時に呼び出されるコールバック関数
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

	//入力に応じてstateの更新が起こるようにしている
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
	//JSONの変換
    const handleDelete = (index: number) => {
        setValues(prevMemoList => {
        const updatedList = [...prevMemoList];
        updatedList.splice(index, 1);
		localStorage.setItem(key, JSON.stringify(updatedList));
		return updatedList;
        });
    };
	//消しゴム機能
	const handleClean = () => {
			setNewText('');
	}
	//絵文字などにも対応した、コードポイントまで考慮した文字数取得
	const getJaTextLength = (inputText:string) => {
		const segmenter = new Intl.Segmenter('ja-JP', {
		  granularity: 'grapheme'
		});
	  
		return [ ...segmenter.segment(inputText) ].length;
	  }

    return (
        <div className="px-4 py-4 sm:px-8">
				<strong><div className="text-orange-600 sm:px-1 font-mono font-extrabold">メモ件数：{memoList.length}</div></strong>
			<List memoList={memoList} onDelete={handleDelete}/><br/>
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
                    	<p><button className="bg-green-700 text-white px-8 py-2 rounded-md sm:p-7" type="submit">add</button><>	</>
						<button className="bg-orange-300 text-white px-10 py-2 rounded-md sm:p-7" 
							type="button"
							onClick={handleClean}
						>clean</button></p>
                </form>
            </div><br/>
			<div className="bg-orange-500 text-white sm:px-1">入力文字数</div>
			<p>{getJaTextLength(text.replace(/( )|(　)|(\n)|(\r)/g,''))}</p>
			{/*絵文字(例えば👨🏻‍🦱)も対応可能、空白改行抜き、半角全角同等*/}
        </div>
    );
}
