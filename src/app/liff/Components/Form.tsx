import React, { useState } from 'react';
import CompleteList from "./CompleteLists";

interface Todo {
    task: string;
    isCompleted: boolean;
}

export default function Form() {
    const [todoText, setTodoText] = useState<string>('');
    const [textList, setTextList] = useState<Todo[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'auto' 
		e.target.style.height = `${e.target.scrollHeight}px` 
        setTodoText(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTodo: Todo = {
            task: todoText,
            isCompleted: false
        };
        setTextList(prevTextList => [...prevTextList, newTodo]);
        setTodoText('');
    };

    const handleDelete = (index: number) => {
        setTextList(prevTextList => {
            const updatedList = [...prevTextList];
            updatedList.splice(index, 1);
            return updatedList;
        });
    };

    return (
        <div className="px-4 py-4 sm:p-6">
            <div className="mb-4">
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-[300px] resize-none overflow-hidden border p-3 text-sm"
                        placeholder="メモを入力してください"
                        value={todoText}
                        onChange={handleInputChange}></textarea>
                    	<p><button className="bg-green-900 text-white px-8 py-2 rounded-md" type="submit">add</button></p>
                </form>
            </div>
            <CompleteList textList={textList} onDelete={handleDelete}/>
        </div>
    );
}
