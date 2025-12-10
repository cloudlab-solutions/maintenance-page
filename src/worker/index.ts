import { Hono } from "hono";

// Add your IP address here to bypass maintenance mode
const ALLOWED_IPS = [
	"82.77.245.190", // Replace with your actual IP
	// Add more IPs as needed
];

const app = new Hono<{ Bindings: Env }>();

// Middleware to check if maintenance mode should be bypassed
app.use("*", async (c, next) => {
	const clientIP = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For");
	
	// If IP is in allowed list, bypass maintenance and serve normally
	if (clientIP && ALLOWED_IPS.includes(clientIP)) {
		c.set("bypassMaintenance", true);
	}
	
	await next();
});

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
