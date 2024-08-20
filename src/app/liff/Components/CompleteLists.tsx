import React, { useState } from 'react';

interface Todo {
    task: string;
    isCompleted: boolean;
}

interface CompleteListProps {
    textList: Todo[];
    onDelete: (index: number) => void;
}

export default function CompleteList({ textList, onDelete }: CompleteListProps) {
    return (
        <ul className="mt-6 space-y-4">
        {textList.map((todo: Todo, index: number) => (
            <li key={index} className="bg-white border border-gray-300 px-4 py-2">
            <span className="break-words">{todo.task}</span>
            <p><button className="bg-red-600 text-white px-4 py-1 rounded-md" onClick={() => onDelete(index)}>delete</button></p>
            </li>
        ))}
        </ul>
    );
}
