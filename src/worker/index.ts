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

// Middleware to check if maintenance mode should be bypassed
app.use("*", async (c, next) => {
	const clientIP = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For");
	
	// If IP is in allowed list, bypass maintenance and serve normally
	if (clientIP && ALLOWED_IPS.includes(clientIP)) {
		c.set("bypassMaintenance", true);
	}
	
	await next();
	
	// Inject site title and set 503 status for maintenance page (except for bypassed IPs)
	if (c.res.headers.get("content-type")?.includes("text/html")) {
		const hostname = new URL(c.req.url).hostname;
		const siteTitle = DOMAIN_TITLES[hostname] || c.env.SITE_TITLE || "Site";
		
		let html = await c.res.text();
		html = html.replace(/<title>.*?<\/title>/, `<title>${siteTitle}</title>`);
		
		if (!c.get("bypassMaintenance")) {
			return new Response(html, {
				status: 503,
				statusText: "Service Unavailable",
				headers: {
					...Object.fromEntries(c.res.headers),
					"Retry-After": "3600" // Suggest retry after 1 hour
				}
			});
		}
		
		return new Response(html, {
			headers: c.res.headers
		});
	}
});

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
