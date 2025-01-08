import Elysia from "elysia";

export const webhookController = new Elysia().post("/webhook", async (ctx) => {
	ctx.server.publish("odoo-update", "Un nouveau croissantage a été effectué !");
	return { status: "received" };
});
