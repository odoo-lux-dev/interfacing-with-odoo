import Elysia from "elysia";
import { messagingController } from "./controllers/messaging";

const app = new Elysia().use(messagingController).listen(3000);

console.log(
	`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
