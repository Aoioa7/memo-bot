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
	const id = e.source.userId;
	//初回はwebhookのuserIDをuserInfoテーブルに登録
	const db_client =  await db.connect();
	await db_client.sql`INSERT INTO userInfo (userID) SELECT ${id} WHERE NOT EXISTS (SELECT 1 FROM userInfo WHERE userID=${id});`
	const db_response = await db_client.sql`SELECT userMode FROM userInfo WHERE userID=${id}`
	const mode = await db_response.rows[0].usermode
	//先に例外的処理を伐採
	if (e.type != "message") {return Response.json({ status: 'not message' });}
	if (e.message.text == "/manual") {
		client.replyMessage(e.replyToken, {
			type: 'text',
			text: "操作説明(コマンドについてetc)を記載",
		});
		return Response.json({ status: 'manual' });}
	//チャット
	if (mode == -1 && e.message.text != "@memo-mode") {
		//

		//
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
		const model = genAI.getGenerativeModel({ model: "gemini-pro"});
		const result = await model.generateContentStream(e.message.text);
		const response = await result.response
		
		client.replyMessage(e.replyToken, {
			type: 'text',
			text: id+" "+mode+" "+e.message.text+" -> "+response.text(),
		});
	}
	else if (mode == -1 && e.message.text == "@memo-mode") {
		//
		
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