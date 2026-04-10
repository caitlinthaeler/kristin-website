/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Range",
	"Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
};

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		// CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		switch (request.method) {
			case "GET": {
				if (!key) {
					return new Response("Missing object key", { status: 400, headers: CORS_HEADERS });
				}

				// Get object from R2 using the full key as-is
				const object = await env.KRISTIN_BUCKET.get(key);

				if (object === null) {
					return new Response("Object Not Found", { status: 404, headers: CORS_HEADERS });
				}

				const headers = new Headers(CORS_HEADERS);
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);
				headers.set("Cache-Control", "public, max-age=31536000, immutable");

				// Guess and set Content-Type if missing
				if (!headers.has("Content-Type")) {
					const guessed = getMimeType(key);
					if (guessed) headers.set("Content-Type", guessed);
				}

				return new Response(object.body, { headers });
			}

			default:
				return new Response("Method Not Allowed", {
					status: 405,
					headers: { ...CORS_HEADERS, Allow: "GET, OPTIONS" },
				});
		}
	},
};

// Utility function to guess MIME type
function getMimeType(key) {
	const ext = key.split(".").pop().toLowerCase();
	switch (ext) {
		case "gif": return "image/gif";
		case "jpg":
		case "jpeg": return "image/jpeg";
		case "png": return "image/png";
		case "mp4": return "video/mp4";
		case "webm": return "video/webm";
		case "svg": return "image/svg+xml";
		default: return null;
	}
}
