import type { FC } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useMutation } from "@tanstack/react-query";
import { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import { useTranslation } from "react-i18next";

interface WebhookModalComplexActionProps {
	webhook: WebhookReceivedMessage;
	callback: (data: Partial<WebhookSentMessage>) => void;
}

const sendWebhook = async ({ recordId, webhookMessage, webhookUrl }) => {
	const webhookBody = {
		_id: recordId,
		_model: "croissantage",
		message: webhookMessage,
	};
	const response = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(webhookBody),
	});
	if (!response.ok) {
		throw new Error("Error w/ webhook");
	}
	return response.json();
};

const WebhookModalComplexAction: FC<WebhookModalComplexActionProps> = ({
	webhook,
	callback,
}) => {
	const odooConfiguration = store.get(odooConfigurationAtom);
	const [webhookUrl, setWebhookUrl] = useState(
		`${odooConfiguration.url}:${odooConfiguration.port}/web/hook/add_log_note`,
	);
	const [webhookMessage, setWebhookMessage] = useState("");
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const mutation = useMutation({
		mutationFn: sendWebhook,
		onSuccess: () => {
			callback({
				id: webhook.id,
				completeBody: {
					_id: webhook.id,
					_model: "croissantage",
					message: webhookMessage,
				},
				complexity: "complex",
				name: webhookUrl,
			});
			setOpen(false);
			toast.success(t("WEBHOOK_SUCCESSFULLY_SENT", { ns: "croissantage" }));
		},
	});

	const handleSendWebhook = () => {
		mutation.mutate({
			recordId: webhook.id,
			webhookMessage,
			webhookUrl,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>{t("COMPLEX_ACTION_LABEL", { ns: "croissantage" })}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("ACTION_TRIGGER_MODAL_TITLE", {
							ns: "croissantage",
							name: webhook.name,
						})}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{t("COMPLEX_ACTION_TRIGGER_MODAL_DESCRIPTION", {
						ns: "croissantage",
					})}
				</DialogDescription>
				<Input
					placeholder="URL Webhook"
					value={webhookUrl}
					onChange={(e) => setWebhookUrl(e.target.value)}
				/>
				<Textarea
					placeholder={t("POST_LOG_NOTE_PLACEHOLDER", { ns: "croissantage" })}
					value={webhookMessage}
					onChange={(e) => setWebhookMessage(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleSendWebhook}>Envoyer</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default WebhookModalComplexAction;
