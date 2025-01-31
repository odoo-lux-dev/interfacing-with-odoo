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
import { useMutation } from "@tanstack/react-query";
import { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";
import { useTranslation } from "react-i18next";

interface WebhookModalSimpleActionProps {
	webhook: WebhookReceivedMessage;
	callback: (data: Partial<WebhookSentMessage>) => void;
}

const sendWebhook = async ({ recordId, webhookUrl }) => {
	const webhookBody = {
		_id: recordId,
		_model: "croissantage",
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

const WebhookModalSimpleAction: FC<WebhookModalSimpleActionProps> = ({
	webhook,
	callback,
}) => {
	const [webhookUrl, setWebhookUrl] = useState("");
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
				},
				complexity: "simple",
				name: webhookUrl,
			});
			setOpen(false);
			toast.success(t("WEBHOOK_SUCCESSFULLY_SENT", { ns: "croissantage" }));
		},
	});

	const handleSendWebhook = () => {
		mutation.mutate({
			recordId: webhook.id,
			webhookUrl,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>{t("SIMPLE_ACTION_LABEL", { ns: "croissantage" })}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("ACTION_TRIGGER_MODAL_TITLE", { name: webhook.name })}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{t("SIMPLE_ACTION_TRIGGER_MODAL_DESCRIPTION", { ns: "croissantage" })}
				</DialogDescription>
				<Input
					placeholder="URL Webhook"
					value={webhookUrl}
					onChange={(e) => setWebhookUrl(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleSendWebhook}>{t("SEND_LABEL")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default WebhookModalSimpleAction;
