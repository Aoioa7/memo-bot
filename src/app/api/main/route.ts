import { db } from '@vercel/postgres';
import * as line from "@line/bot-sdk";

const config = {
	channelAccessToken: "M9JmwBsAI+yLEjjRh/YTiU6J8/5KbL4zC4+NupuOd1C8z/d+Hs4Mdj3iRVrNsc1B/EXdz+Z8pgGvXl1il4Ncxd8gyY+dewGV916He+2RxmRmb7KqknBzZ5b31QTWPG+QIMJJ8N/IS98XPNCDRGyn9gdB04t89/1O/w1cDnyilFU=",
	channelSecret: "a9bcb9bdc652fe28c1f1384325031b59",
};
const client = new line.Client(config);

export async function POST(request: Request) {
	//webhook->follow
	const req = await request.json();
	const e = req.events[0]

	if (1) {
		//初回の処理内容(webhookのuserIDをuserInfoテーブルに登録)
		client.replyMessage(e.replyToken, {
			type: 'text',
			text: e.message+"|"+e.message.text+"|"+e.message["text"]
	});
		
	}
	//webhook->send
	else if (1) {
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
	return  Response.json({ id: 1, name: 'Mike' });
}

//フォーマットのエラーハンドリング忘れない

//四つの分岐それぞれで別の処理が行われ、それに応じたリクエストがMesssagingAPIで行われる