import { Separator } from "@/components/ui/separator.tsx";
import CroissantageCreationForm from "@/components/croissantage-creation-form.tsx";
import { croissantageRpcListAtom } from "@/store/form-store.ts";
import { useAtom } from "jotai";
import type { Croissantage } from "@/types.ts";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import CroissantageList from "@/components/croissantage-list.tsx";
import CroissantageModalEdit from "@/components/croissantage-modal-edit.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, NotebookPen, Pencil, Send, Trash2 } from "lucide-react";
import CroissantageModalLogNote from "@/components/croissantage-modal-log-note.tsx";
import {
	sendMailNotification,
	deleteCroissantage as deleteCroissantageRecord,
} from "@/lib/odoo.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";

export default function CroissantageAdministration() {
	const [{ data: croissantages, refetch: refetchCroissantages }] = useAtom(
		croissantageRpcListAtom,
	);
	const { t } = useTranslation();

	const croissantageMailNotificationMutation = useMutation({
		mutationFn: sendMailNotification,
		onSuccess: () => {
			toast.success(t("EMAIL_SUCCESSFULLY_SENT", { ns: "croissantage" }));
		},
	});

	const deleteCroissantageMutation = useMutation({
		mutationFn: deleteCroissantageRecord,
		onSuccess: () => {
			toast.success(
				t("CROISSANTAGE_SUCCESSFULLY_REMOVED", { ns: "croissantage" }),
			);
			refetchCroissantages().catch(console.error);
		},
	});

	const sendNotificationMail = async (croissantageId: number) => {
		croissantageMailNotificationMutation.mutate(croissantageId);
	};

	const deleteCroissantage = async (croissantageId: number) => {
		deleteCroissantageMutation.mutate(croissantageId);
	};

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Gestion des croissantages</h1>
			<h2 className="text-xl font-bold mb-2">Listing des croissantages</h2>
			<CroissantageList>
				{croissantages?.map((croissantage: Croissantage) => (
					<TableRow key={croissantage.id}>
						<TableCell className="font-medium">{croissantage.id}</TableCell>
						<TableCell>{croissantage.name}</TableCell>
						<TableCell>{croissantage.partner_id.display_name}</TableCell>
						<TableCell>{croissantage.partner_ids.join(", ")}</TableCell>
						<TableCell className="flex gap-2">
							<CroissantageModalEdit croissantage={croissantage}>
								<Button variant="outline">
									<Pencil /> Éditer
								</Button>
							</CroissantageModalEdit>
							<Button
								variant="outline"
								onClick={() => sendNotificationMail(croissantage.id)}
							>
								<Send /> Notifier
							</Button>
							<CroissantageModalLogNote croissantage={croissantage}>
								<Button variant="outline">
									<NotebookPen /> Log Note
								</Button>
							</CroissantageModalLogNote>
							<Button
								variant="outline"
								onClick={() => deleteCroissantage(croissantage.id)}
							>
								<Trash2 /> Supprimer
							</Button>
						</TableCell>
					</TableRow>
				))}
			</CroissantageList>
			<Separator className="my-5" />
			<Collapsible>
				<CollapsibleTrigger asChild>
					<div className="flex items-center justify-between cursor-pointer select-none">
						<h2 className="text-xl font-bold mb-2">
							Enregistrer un croissantage
						</h2>{" "}
						<ChevronDown className="h-4 w-4" />
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CroissantageCreationForm />
				</CollapsibleContent>
			</Collapsible>
		</>
	);
}
