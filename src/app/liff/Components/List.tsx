
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

//素のテキスト->Markdown->HTMLという変換過程がうまくいくようにreplaceを多用している
export default function List({ memoList, onDelete }: ListProps) {
	let memoList2:string[] =[]
	for (const memo of memoList) {
		let pre_memo2=marked.parse(memo.replace(/(　)/g,'&nbsp;'))
		if (!(pre_memo2 instanceof Promise)) {
			pre_memo2=pre_memo2.replace(/(<ul>)|(<\/ul>)/g,'')
			.replace(/(<a href=".+">.+<\/a>)/g,'<strong><font color=”blue”>$1</font></strong>')
			memoList2.push('<ul style="list-style: disc; padding-left:13px;">'+pre_memo2.replace(/(\n)/g,'<br/>')+'</ul>')}
	}
    return (
        <ul className="mt-6 space-y-4">
        {memoList2.map((memo2: string, index: number) => (
            <li key={index} className="bg-white border border-gray-300 px-4 py-2">
			<span id="output" className="break-words ">{} 
				{parse(memo2.replace(/(<ul style="list-style: disc; padding-left:13px;"><br\/>)/g,'<ul style="list-style: disc; padding-left:13px;">')
				.replace(/(<br\/><\/ul>)/g,'</ul>')
				.replace(/(<br\/><\/li>)/g,'</li>').replace(/(<\/li><br\/>)/g,'</li>')
				.replace(/(<br\/><li>)/g,'<li>').replace(/(<li><br\/>)/g,'<li>'))}</span>
            <p><button className="bg-red-600 text-white px-4 py-1 rounded-md" onClick={() => onDelete(index)}>delete</button></p>
            </li>
        ))}
        </ul>
    );
}