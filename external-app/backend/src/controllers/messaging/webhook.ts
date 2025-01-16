import Elysia from "elysia";

export const webhookController = new Elysia().post("/webhook", async (ctx) => {
	ctx.server.publish("odoo-update", JSON.stringify({
		id: ctx.body.id,
		name: ctx.body.name,
		completeBody: ctx.body,
	}));
	return { status: "received" };
});
