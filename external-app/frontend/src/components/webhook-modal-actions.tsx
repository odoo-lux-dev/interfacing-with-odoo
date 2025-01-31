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
import WebhookModalSimpleAction from "@/components/webhook-modal-simple-action.tsx";
import WebhookModalComplexAction from "@/components/webhook-modal-complex-action.tsx";
import { WebhookReceivedMessage, WebhookSentMessage } from "@/types.ts";
import { Hammer } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WebhookModalActionsProps {
	webhook: WebhookReceivedMessage;
	setSentWebhooks: (data: WebhookSentMessage) => void;
}

const WebhookModalActions: FC<WebhookModalActionsProps> = ({
	webhook,
	setSentWebhooks,
}) => {
	const actionCallback = (data) => {
		setSentWebhooks({
			type: "sent",
			...data,
		});
	};
	const { t } = useTranslation();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Hammer /> Actions
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t("ACTIONS_MODAL_TITLE", {
							ns: "croissantage",
							name: webhook.name,
						})}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{t("ACTIONS_MODAL_DESCRIPTION", { ns: "croissantage" })}
				</DialogDescription>
				<div className="flex gap-2">
					<WebhookModalSimpleAction
						webhook={webhook}
						callback={actionCallback}
					/>
					<WebhookModalComplexAction
						webhook={webhook}
						callback={actionCallback}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default WebhookModalActions;
