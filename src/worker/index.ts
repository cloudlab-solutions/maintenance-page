import { Hono } from "hono";

// Add your IP address here to bypass maintenance mode
const ALLOWED_IPS = [
	"82.77.245.190", // Replace with your actual IP
	// Add more IPs as needed
];

// Map domains to their site titles
const DOMAIN_TITLES: Record<string, string> = {
	"aesthetic-clinique.co.uk": "Aesthetic Clinique",
	"smart-vet.ro": "SmartVet",
	"cloudstack-solutions.eu": "Cloudstack Solutions"
};

type Variables = {
	bypassMaintenance?: boolean;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Check if IP should bypass maintenance
		const clientIP = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For");
		const bypassMaintenance = clientIP && ALLOWED_IPS.includes(clientIP);
		
		// Handle API routes through Hono
		if (new URL(request.url).pathname.startsWith("/api/")) {
			return app.fetch(request, env, ctx);
		}
		
		// Get the asset response from Cloudflare
		const response = await env.ASSETS.fetch(request);
		
		// Only modify HTML responses
		if (response.headers.get("content-type")?.includes("text/html")) {
			const hostname = new URL(request.url).hostname;
			const siteTitle = DOMAIN_TITLES[hostname] || env.SITE_TITLE || "Site";
			
			let html = await response.text();
			html = html.replace(/<title>.*?<\/title>/, `<title>${siteTitle}</title>`);
			
			// Return 503 for maintenance mode (except for bypassed IPs)
			if (!bypassMaintenance) {
				return new Response(html, {
					status: 503,
					statusText: "Service Unavailable",
					headers: {
						...Object.fromEntries(response.headers),
						"Retry-After": "3600",
						"Content-Type": "text/html; charset=utf-8"
					}
				});
			}
			
			return new Response(html, {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers
			});
		}
		
		return response;
	}
};
