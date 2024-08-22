
export async function GET (request: Request) {
	//db(remindCount--)

	//process(dbでremindCountカラムが0になっていた場合NULLを埋めて、contentカラムを取り出す)

	//response
	return Response.json({ status: "OK" }) 
}

//GitHubActionsのschedule,cronで毎日0-1時に1回呼び出されるAPIとして実装