
export async function POST(request: Request) {
	//webhook->follow
	if (-1) {
		//初回の処理内容(webhookのuserIDをuserInfoテーブルに登録)

	}
	//webhook->send
	if (0) {
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

		//関数->writememo
	}
	//response
	return Response.json({ status: "OK" }) 
}

//フォーマットのエラーハンドリング忘れない