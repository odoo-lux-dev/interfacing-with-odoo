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
import type { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";
import { useTranslation } from "react-i18next";

interface WebhookModalDetailsProps {
	webhook: WebhookReceivedMessage | WebhookSentMessage;
}

const WebhookModalDetails: FC<WebhookModalDetailsProps> = ({ webhook }) => {
	const isReceived = webhook.type === "received";
	const { t } = useTranslation();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Search /> {t("DETAILS_LABEL")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("DETAILS_MODAL_TITLE", {
							ns: "croissantage",
							name: isReceived ? webhook.name : `#${webhook.id}`,
						})}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{isReceived
						? t("WEBHOOK_RECEIVED_MESSAGE_LABEL", { ns: "croissantage" })
						: t("WEBHOOK_SENT_MESSAGE_LABEL", { ns: "croissantage" })}
				</DialogDescription>
				<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
					<code>{JSON.stringify(webhook.completeBody, null, 2)}</code>
				</pre>
			</DialogContent>
		</Dialog>
	);
};

export default WebhookModalDetails;
