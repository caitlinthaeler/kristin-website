/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		switch (request.method) {
		// case "PUT":
		// 	await env.MY_BUCKET.put(key, request.body);
		// 	return new Response(`Put ${key} successfully!`);
		case "GET":
			const object = await env.KRISTIN_BUCKET.get(key);

			if (object === null) {
				return new Response("Object Not Found", { status: 404 });
			}

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set("etag", object.httpEtag);

			// Add CORS headers here: (add back if necessary)
			// headers.set("Access-Control-Allow-Origin", "*"); // or your domain like "https://kristinthaeler.com"
			// headers.set("Access-Control-Allow-Methods", "GET");
			// headers.set("Access-Control-Allow-Headers", "Content-Type");


			return new Response(object.body, {
				headers,
			});
		// case "DELETE":
		// 	await env.MY_BUCKET.delete(key);
		// 	return new Response("Deleted!");

		default:
			return new Response("Method Not Allowed", {
				status: 405,
				headers: {
					Allow: "GET",
				},
			});
		}
	},
};
