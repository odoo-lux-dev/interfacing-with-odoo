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
import { useTranslation } from "react-i18next";

interface WebhookListProps {
	webhooks: WebhookReceivedMessage[] | WebhookSentMessage[];
	setSentWebhooks?: (data: WebhookSentMessage) => void;
}

const WebhookList: FC<WebhookListProps> = ({ webhooks, setSentWebhooks }) => {
	if (!webhooks.length) return null;
	const isReceived = webhooks.every((webhook) => webhook.type === "received");
	const { t } = useTranslation();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">ID Record</TableHead>
					{!isReceived ? (
						<TableHead>
							{" "}
							{t("ACTION_TYPE_LABEL", { ns: "croissantage" })}
						</TableHead>
					) : null}
					<TableHead>
						{isReceived ? t("RECORD_NAME_LABEL") : "URL Webhook"}
					</TableHead>
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
