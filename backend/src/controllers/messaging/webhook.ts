import Elysia from "elysia";

export const webhookController = new Elysia().get("/webhook", async (ctx) => {
	ctx.server.publish("odoo-update", "Un nouveau croissantage a été effectué !");
	return { status: "received" };
});
