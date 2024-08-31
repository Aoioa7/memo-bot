
import React, { useState } from 'react';
import parse from 'html-react-parser';
import { marked } from "marked";

marked.setOptions({
    gfm: true,
    breaks: true,
  });

interface ListProps {
    memoList: string[];
    onDelete: (index: number) => void;
}

// 改行の反映('\n' -> <br/> -> parse)
export default function List({ memoList, onDelete }: ListProps) {
	let memoList2:string[] =[]
	for (const memo of memoList) {
		const memo2=marked.parse(memo)
		if (!(memo2 instanceof Promise)) {memoList2.push('<ul style="list-style: disc; padding-left:14px">'+memo2+'</ul>')}
	}
    return (
        <ul className="mt-6 space-y-4">
        {memoList2.map((memo2: string, index: number) => (
            <li key={index} className="bg-white border border-gray-300 px-4 py-2">
			<span id="output" className="break-words ">{parse(memo2.replace(/(<ul>)|(<\/ul>)/g,''))}</span>
            <p><button className="bg-red-600 text-white px-4 py-1 rounded-md" onClick={() => onDelete(index)}>delete</button></p>
            </li>
        ))}
        </ul>
    );
}//memo2.replace(/(<ul>)|(</ul>)/g,''))