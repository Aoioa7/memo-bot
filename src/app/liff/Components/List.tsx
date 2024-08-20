import React, { useState } from 'react';

interface ListProps {
    memoList: string[];
    onDelete: (index: number) => void;
}

export default function List({ memoList, onDelete }: ListProps) {
    return (
        <ul className="mt-6 space-y-4">
        {memoList.map((memo: string, index: number) => (
            <li key={index} className="bg-white border border-gray-300 px-4 py-2">
            <span className="break-words">{memo}</span>
            <p><button className="bg-red-600 text-white px-4 py-1 rounded-md" onClick={() => onDelete(index)}>delete</button></p>
            </li>
        ))}
        </ul>
    );
}
