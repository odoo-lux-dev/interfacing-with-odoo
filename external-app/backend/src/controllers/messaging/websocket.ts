import Elysia from "elysia";

export const websocketController = new Elysia().ws("/ws", {
	open(ws) {
		ws.subscribe("odoo-update");
	},
	close(ws) {
		ws.unsubscribe("odoo-update");
	},
});
