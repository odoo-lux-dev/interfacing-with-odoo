import Elysia from "elysia";
import { websocketController } from "./websocket";
import { webhookController } from "./webhook";

export const messagingController = new Elysia()
	.use(websocketController)
	.use(webhookController);
