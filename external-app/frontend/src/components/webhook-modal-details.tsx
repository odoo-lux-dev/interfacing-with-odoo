import type { FC } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Search } from "lucide-react";
import { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";

interface WebhookModalDetailsProps {
	webhook: WebhookReceivedMessage | WebhookSentMessage;
}

const WebhookModalDetails: FC<WebhookModalDetailsProps> = ({ webhook }) => {
	const isReceived = webhook.type === "received";

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Search /> Détail
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Détail de
						{isReceived ? ` "${webhook.name}"` : ` #${webhook.id}`}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{isReceived
						? "Message complet reçu via le webhook"
						: "Informations envoyées au webhook Odoo"}
				</DialogDescription>
				<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
					<code>{JSON.stringify(webhook.completeBody, null, 2)}</code>
				</pre>
			</DialogContent>
		</Dialog>
	);
};

export default WebhookModalDetails;
