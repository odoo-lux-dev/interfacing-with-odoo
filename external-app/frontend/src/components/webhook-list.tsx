import type { FC } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";
import WebhookModalDetails from "@/components/webhook-modal-details.tsx";
import WebhookModalActions from "@/components/webhook-modal-actions.tsx";
import { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";

interface WebhookListProps {
	webhooks: WebhookReceivedMessage[] | WebhookSentMessage[];
	setSentWebhooks?: (data: WebhookSentMessage) => void;
}

const WebhookList: FC<WebhookListProps> = ({ webhooks, setSentWebhooks }) => {
	if (!webhooks.length) return null;
	const isReceived = webhooks.every((webhook) => webhook.type === "received");

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">ID du record</TableHead>
					{!isReceived ? <TableHead> Type d'action</TableHead> : null}
					<TableHead>{isReceived ? "Nom du record" : "URL Webhook"}</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{webhooks.map((webhook, index) => (
					<TableRow key={isReceived ? webhook.id : `r-${webhook.id}-${index}`}>
						<TableCell className="font-medium">{webhook.id}</TableCell>
						{!isReceived ? (
							<TableCell className="capitalize">
								{webhook.complexity || "/"}
							</TableCell>
						) : null}
						<TableCell>{webhook.name}</TableCell>
						<TableCell className="flex gap-2">
							<WebhookModalDetails webhook={webhook} />
							{isReceived && setSentWebhooks ? (
								<WebhookModalActions
									webhook={webhook as WebhookReceivedMessage}
									setSentWebhooks={setSentWebhooks}
								/>
							) : null}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default WebhookList;
