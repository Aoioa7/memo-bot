import { db } from '@vercel/postgres';
import * as line from "@line/bot-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {ShowMemos, DeleteMemo, CreateMemo, WriteContent, WriteRemindCount} from './MemoFunctions';

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
	channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);

export async function POST(request: Request) {
	const req = await request.json();
	const e = req.events[0];
	const id = e.source.userId;
	//db接続。初回はwebhookのuserIDをuserInfoテーブルに登録
	const db_client =  await db.connect();
	await db_client.sql`INSERT INTO userInfo (userID) SELECT ${id} WHERE NOT EXISTS (SELECT 1 FROM userInfo WHERE userID=${id});`
	const preMode = await db_client.sql`SELECT userMode FROM userInfo WHERE userID=${id}`
	const mode = await preMode.rows[0].usermode
	//先に例外的処理を伐採(メッセージ以外の通知を無視)
	if (e.type != "message") { return Response.json({ status: 'not-message' }); }
	const token = e.replyToken
	const textMessage = e.message.text

	//いつでも(どのモードでも)マニュアル呼び出しが最優先で処理される
	if (e.message.text == "/manual") {
		client.replyMessage(token, {
			type: 'text',
			text: `\r現在のモードは${mode}(-1がお喋りモード、0がメモモード、1がメモ内容入力モード、2がリマインド設定モード)\n
			\r-1の時、『@memo-mode』でメモモードに移行(それ以外の入力はお喋りとみなされる)\n
			\r0の時、『@chat-mode』でお喋りモードに移行\n
			\r『/show』で現在のメモをリストアップ\n
			\r『/delete+空白+[メモのID(「/show」で見れる])』でメモを削除\n
			\r『/create+空白+[タイトル(20字以内)]』でメモを作成開始&1に移行\n
			\r1の時、送信したチャットはそのままメモの内容として登録される&2に移行\n
			\r2の時、1以上の数字を入力するとその日数が過ぎたときにメモについて通知される&0に移行\n
			\rちなみに、[x]を入力すれば未設定でスキップできる\n
			\r『/manual』はどのモードでも使える`,
		});
		return Response.json({ status: 'manual' });
	}

	//チャットモード
	if (mode == -1 && textMessage  != "@memo-mode") {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
		const model = genAI.getGenerativeModel({ model: "gemini-pro"});
		const result = await model.generateContentStream(e.message.text);
		const response = await result.response
		
		client.replyMessage(token, {
			type: 'text',
			text: textMessage +" -> "+response.text(),
		});
		return  Response.json({ status: 'chat-OK' });
	}
	//メモモードへ
	else if (mode == -1 && textMessage  == "@memo-mode") {
		//userInfo。該当するuserModeを0に書き換え
		await db_client.sql`UPDATE userInfo SET userMode=0 WHERE userID=${id}`
		client.replyMessage(token, {
			type: 'text',
			text: "メモモード開始"
		})
		return  Response.json({ status: 'memo-start-OK' });
	}

	//メモモード(中の処理を別ファイルの関数に分割)
	if (mode == 0) {
		//チャットモードへ
		if (textMessage  == "@chat-mode") {
			//userinfo。usermodeを-1に書き換え
			await db_client.sql`UPDATE userInfo SET userMode=-1 WHERE userID=${id}`
			client.replyMessage(token, {
				type: 'text',
				text: "チャットモード開始"
			})
			return  Response.json({ status: 'chat-start-OK' });
		}

		//閲覧
		if (textMessage == "/show") {
			ShowMemos(id,token)
			return  Response.json({ status: 'show-OK' });
		}

		//事前処理
		const command = textMessage.split(" ")
		if (!(command.length == 2 && (command[0] == "/delete" || command[0] == "/create"))) {
			client.replyMessage(token, {
				type: 'text',
				text: "入力フォーマットのエラー",
			});
			return  Response.json({ status: 'format-error' });
		}

		//削除
		if (command[0] == "/delete") {
			//チャットの後半だけ取得
			DeleteMemo(id,command[1],token)
			return  Response.json({ status: 'delete-OK' });
		}
		//作成
		else {
			//タイトルが20文字以内かチェック
			if (command[1].length > 20) { 
				client.replyMessage(token, {
					type: 'text',
					text: "タイトルは20文字以内",
				});
				return  Response.json({ status: 'format-error-too-big' });
			}
			//webhookの先頭だけ読み込むからメモのidと一対一対応にできるはず
			const memoId = e.webhookEventId
			CreateMemo(id,memoId,command[1],token)
			return  Response.json({ status: 'create-OK' });
		}
	}
	//メモの内容を記入
	else if (mode == 1) {
		//userInfo。memoIdを取得
		const preMemoId = await db_client.sql`SELECT memoID FROM userInfo WHERE userID=${id}`
		const memoId = await preMemoId.rows[0].memoid
		//メモに書き込み
		WriteContent(id,memoId,textMessage,token)
		return  Response.json({ status: 'write-OK' });
	}
	//メモのリマインドを設定or未設定
	else if(mode == 2) {
		//リマインド設定しない場合
		if (textMessage == "x") {
			client.replyMessage(token, {
				type: 'text',
				text: "メモ作成完了",
			});
			return  Response.json({ status: 'no-remind-OK' });
		}
		//数字かどうか検証
		const count = Number(textMessage)
		if (isNaN(count)) {
			client.replyMessage(token, {
				type: 'text',
				text: "入力は数字のみ",
			});
			return  Response.json({ status: 'format-error-not-number' });
		}
		//countについて、１以上の数字かxであるかなど検証
		if (count <= 0) { 
			client.replyMessage(token, {
				type: 'text',
				text: "数字は1以上",
			});
			return  Response.json({ status: 'format-error-too-small' }); 
		}
		//userInfo。memoIdをs取得
		const preMemoId = await db_client.sql`SELECT memoID FROM userInfo WHERE userID=${id}`
		const memoId = await preMemoId.rows[0].memoid
		//リマインド設定
		WriteRemindCount(id,memoId,count,token)
		return  Response.json({ status: 'remind-OK' });
	}
	
	return  Response.json({ status: 'NG' });
}
