import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { useState } from "react";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import WebhookList from "@/components/webhook-list.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { LoaderCircle } from "lucide-react";
import { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";
import { useTranslation } from "react-i18next";

export default function Webhook() {
	const [receivedWebhooks, setReceivedWebhooks] = useState<
		WebhookReceivedMessage[]
	>([]);
	const [sentWebhooks, setSentWebhooks] = useState<WebhookSentMessage[]>([]);
	const odooConfiguration = store.get(odooConfigurationAtom);
	const { t } = useTranslation();

	useWebSocket(import.meta.env.VITE_WEBSOCKET_URL, {
		onMessage: (message) => {
			const parsedMessage = JSON.parse(message.data) as WebhookReceivedMessage;
			setReceivedWebhooks((prev) => [
				...prev,
				{
					...parsedMessage,
					type: "received",
				},
			]);
			toast.info(t("NEW_CROISSANTAGE_TOAST_TITLE", { ns: "croissantage" }), {
				description: t("NEW_CROISSANTAGE_TOAST_DESCRIPTION", {
					ns: "croissantage",
					id: parsedMessage.id,
					name: parsedMessage.name,
				}),
				action: {
					label: t("GO_TO_LABEL"),
					onClick: () => {
						window.open(
							`${odooConfiguration.url}:${odooConfiguration.port}/odoo/croissantage/${parsedMessage.id}`,
							"_blank",
						);
					},
				},
			});
		},
	});

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">
				{t("WEBHOOK_PAGE_TITLE", { ns: "pages" })}
			</h1>
			{!receivedWebhooks.length && !sentWebhooks.length ? (
				<div className="flex justify-center items-center gap-3">
					<h2 className="flex gap-2 text-md">
						{t("WEBHOOK_PAGE_WAITING_FOR_WEBHOOK", { ns: "pages" })}
						<pre>http://localhost:3000/webhook</pre>
					</h2>
					<LoaderCircle className="animate-spin" />
				</div>
			) : null}

			{receivedWebhooks.length ? (
				<>
					<h2 className="text-xl font-bold mb-2">
						{t("WEBHOOK_RECEIVED_MESSAGE_LABEL", { ns: "pages" })}
					</h2>
					<WebhookList
						webhooks={receivedWebhooks}
						setSentWebhooks={(data: WebhookSentMessage) =>
							setSentWebhooks((prev) => [...prev, data])
						}
					/>
				</>
			) : null}

			{sentWebhooks.length ? (
				<>
					<Separator className="my-5" />
					<h2 className="text-xl font-bold mb-2">
						{t("WEBHOOK_SENT_MESSAGE_LABEL", { ns: "pages" })}
					</h2>
					<WebhookList webhooks={sentWebhooks} />
				</>
			) : null}
		</>
	);
}
