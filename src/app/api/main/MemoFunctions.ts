import { db } from '@vercel/postgres';
import * as line from "@line/bot-sdk";

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
	channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

export async function ShowMemos(userId:string,token:string) {
	const db_client =  await db.connect();
	//memoinfo。userIdでselectして戻り値をいい感じに処理
	const preMemos = await db_client.sql`SELECT * FROM memoInfo WHERE userID=${userId}`
	const memos = preMemos.rows

	if (memos.length == 0) {
		client.replyMessage(token, {
			type: 'text',
			text: "メモは無し",
		});
		return
	}

	let stringMemos=""
	for(const m of memos) {
		stringMemos+="・メモID"+m.memoid+"\n"
		stringMemos+="・タイトル"+m.title+"\n\n"
		stringMemos+=m.content+"\n\n"
		stringMemos+="・リマインド"+m.remindcount+"日後\n"
		stringMemos+="----------\n"
	}

	client.replyMessage(token, {
		type: 'text',
		text: stringMemos,
	});
}

//削除
export async function DeleteMemo(userId:string,memoId:string,token:string) {
	const db_client =  await db.connect();
	//memoinfo。userIdとmemoIdでmemoInfoの該当レコードを削除
	await db_client.sql`DELETE FROM memoInfo WHERE userID=${userId} AND memoID=${memoId}`
	client.replyMessage(token, {
		type: 'text',
		text: "削除トライ完了",
	});
}

//メモ作成1
export async function CreateMemo(userId:string,memoId:string,title:string,token:string) {
	const db_client =  await db.connect();
	//memoinfo。useridやtitleだけまずinsert
	await db_client.sql`INSERT INTO memoInfo (memoID,title,userID) VALUES (${memoId},${title},${userId})`
	//userInfo。userIdが一致するレコードのusermodeカラム書き換え(1に)&現在扱っているmemoidをuserinfoに登録
	await db_client.sql`UPDATE userInfo SET userMode=1,memoID=${memoId} WHERE userID=${userId}`
	//次の情報入力へ
	client.replyMessage(token, {
		type: 'text',
		text: "メモ内容を入力",
	});
}
//メモ作成2
export async function WriteContent(userId:string,memoId:string,content:string,token:string) {
	const db_client =  await db.connect();
	//memoinfo。userIdとmemoIdから特定して、memonfoのcontentをupdate
	await db_client.sql`UPDATE memoInfo SET content=${content} WHERE userID=${userId} AND memoID=${memoId}`
	//userInfo。userIdが一致するレコードのusermodeカラム書き換え(2に)
	await db_client.sql`UPDATE userInfo SET userMode=2 WHERE userID=${userId}`
	//次の情報入力へ
	client.replyMessage(token, {
		type: 'text',
		text: "何日後にリマインドするか入力(1以上の整数)",
	});
}
//メモ作成3
export async function WriteRemindCount(userId:string,memoId:string,count:number,token:string) {
	const db_client =  await db.connect();
	//memoinfo。idで特定してremindcountをupdate
	await db_client.sql`UPDATE memoInfo SET remindCount=${count} WHERE userID=${userId} AND memoID=${memoId}`
	//userinfo。現在扱っているmemoidをヌルにする。usermodeを0にする
	await db_client.sql`UPDATE userInfo SET userMode=0,memoID=NULL WHERE userID=${userId}`
	//完了のメッセージを返す
	client.replyMessage(token, {
		type: 'text',
		text: "メモ作成完了",
	});
}
	
	
	
	