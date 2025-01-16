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
		throw new Error("Erreur lors de l'envoi du webhook");
	}
	return response.json();
};

const WebhookModalSimpleAction: FC<WebhookModalSimpleActionProps> = ({
	webhook,
	callback,
}) => {
	const [webhookUrl, setWebhookUrl] = useState("");
	const [open, setOpen] = useState(false);
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
			toast.success("Webhook envoyé avec succès !");
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
				<Button>Action simple</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Déclencher une action pour "{webhook.name}"</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Ceci va déclencher une action définie dans le webhook Odoo
				</DialogDescription>
				<Input
					placeholder="URL du Webhook"
					value={webhookUrl}
					onChange={(e) => setWebhookUrl(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleSendWebhook}>Envoyer</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default WebhookModalSimpleAction;
