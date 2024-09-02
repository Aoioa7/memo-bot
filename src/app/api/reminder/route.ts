import { db } from '@vercel/postgres';
import * as line from "@line/bot-sdk";

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
	channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

//GitHubActionsのscheduleのcronで毎日0-1時に1回呼び出されるAPIとして実装
//1日1回カウントダウンして、(チャットで設定した)n日後に通知
//リクエスト(GET)ごとに処理が走る
export async function GET (request: Request) {
	const db_client =  await db.connect();
	//memoinfo。remindcountがnullじゃない時、そのカラムを格納された数-1にupdate
	await db_client.sql`UPDATE memoInfo SET remindCount=remindCount-1 WHERE remindCount IS NOT NULL `
	//memoinfo。remindcountが0のレコード群をselect(初期値としての0は事前に弾く)
	const preMemos = await db_client.sql`SELECT * FROM memoInfo WHERE remindCount=0`
	const memos=preMemos.rows
	await db_client.sql`UPDATE memoInfo SET remindCount=NULL WHERE remindCount=0`
	//レコード群から順にリマインド送信。
	for (const m of memos) {
		//userIdごとに
		const message="メモIDは"+m.memoid+"\n"+m.title+"\n\n"+m.content+"\n"+"----------\n"
		await client.pushMessage(m.userid, {
			type: "text",
			text: message,
		  });
	}

	return Response.json({ status: "OK" }) 
}
