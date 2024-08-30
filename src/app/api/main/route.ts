import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import * as line from "@line/bot-sdk";

const config = {
	channelAccessToken: "M9JmwBsAI+yLEjjRh/YTiU6J8/5KbL4zC4+NupuOd1C8z/d+Hs4Mdj3iRVrNsc1B/EXdz+Z8pgGvXl1il4Ncxd8gyY+dewGV916He+2RxmRmb7KqknBzZ5b31QTWPG+QIMJJ8N/IS98XPNCDRGyn9gdB04t89/1O/w1cDnyilFU=",
	channelSecret: "a9bcb9bdc652fe28c1f1384325031b59",
  };

const client = new line.Client(config);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
	//webhook->follow

	if (-1) {
		//初回の処理内容(webhookのuserIDをuserInfoテーブルに登録)
		try {
			const message = req.body.message;
		
			await client.pushMessage(req.body.source.userID, {
			  type: "text",
			  text: message,
			});
		
			res.status(200).json({ message: `${message}というメッセージが送信されました。` });
		  } catch (e) {
			res.status(500).json({ message: `error! ${e} ` });
		  }
		
	}
	//webhook->send
	else if (0) {
		//AIチャットモード(適当なチャット/@memo-mode)

		//@memo-mode分岐

		//関数->chat

	}
	else if (1) {
		//メモ操作モード(create タイトル/delete メモID/memo/@chat-mode)

		//@chat-mode分岐
		

		//関数->creatememo/deletememo/memolist

	}
	else if (2) {
		//メモ内容登録モード(メモ内容)

		//関数->write
	}
	else if(3) {
		//リマインド登録モード(何日後にリマインドするか)、
		//ここまでのinsert(memoID,userID)->update(content)->update(remindCount)の流れで3チャットひとまとまり

		//関数->count
	}
	//response
	return res.json({ status: "OK" }) 
}

//フォーマットのエラーハンドリング忘れない

//四つの分岐それぞれで別の処理が行われ、それに応じたリクエストがMesssagingAPIで行われる