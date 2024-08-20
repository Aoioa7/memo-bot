import React, { useState } from 'react';
import List from "./List";

//setStorageValueの中ではローカルストレージとstatusの同期が行われている

export default function Form() {
	const key = "memo-list"
	const item = localStorage.getItem(key)
	let initValue = []
	if (item)
		initValue = JSON.parse(item)
	const [memoList, setValues] = useState<string[]>(initValue);




    const [text, setNewText] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'auto' 
		e.target.style.height = `${e.target.scrollHeight}px` 
        setNewText(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
