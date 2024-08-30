import { db } from '@vercel/postgres';
import * as line from "@line/bot-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
	channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

export async function POST(request: Request) {
	const req = await request.json();
	const e = req.events[0];
	const id = e.source.userID;

	const db_client =  await db.connect();
	client.replyMessage(e.replyToken, {
		type: 'text',
		text: "post"
	});
	//初回の処理内容(webhookのuserIDをuserInfoテーブルに登録)
	await db_client.sql`INSERT INTO userInfo (userID,userMode) VALUES (${id},-1) WHERE NOT EXISTS (SELECT userID FROM userInfo WHERE userID=${id});`
	const userMode = await db_client.sql`SELECT userMode FROM userInfo WHERE userID=${id};`
	client.replyMessage(e.replyToken, {
		type: 'text',
		text: "post"
	});

	if (1) {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
		const model = genAI.getGenerativeModel({ model: "gemini-pro"});
		const result = await model.generateContentStream(e.message.text);
		const response = await result.response
		
		client.replyMessage(e.replyToken, {
			type: 'text',
			text: userMode+" "+e.message.text+" -> "+response.text(),
		});
		//
		
	}
	else if (e.message == "@memo-mode") {
		client.replyMessage(e.replyToken, {
			type: 'text',
			text: "メモモード開始"
		})
	}
	//webhook->send
	if (1) {
		//AIチャットモード(適当なチャット/@memo-mode)

		//@memo-mode分岐

		//関数->chat

	}
	else if (1) {
		//メモ操作モード(create タイトル/delete メモID/memo/@chat-mode)

		//@chat-mode分岐
		

		//関数->creatememo/deletememo/memolist

	}
	else if (1) {
		//メモ内容登録モード(メモ内容)

		//関数->write
	}
	else if(1) {
		//リマインド登録モード(何日後にリマインドするか)、
		//ここまでのinsert(memoID,userID)->update(content)->update(remindCount)の流れで3チャットひとまとまり

		//関数->count
	}
	//response
	return  Response.json({ status: 'OK' });
}

//フォーマットのエラーハンドリング忘れない

//四つの分岐それぞれで別の処理が行われ、それに応じたリクエストがMesssagingAPIで行われる