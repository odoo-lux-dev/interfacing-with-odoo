import { useMutation, useQuery } from "@tanstack/react-query";
import CroissantageList from "@/components/croissantage-list";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw, Search } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import CroissantageModalDetails from "@/components/croissantage-modal-details.tsx";
import type { Croissantage } from "@/types.ts";
import {
	deleteCroissantage as deleteCroissantageRecord,
	fetchCroissantages,
	sendMailNotification,
} from "@/lib/odoo.ts";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { ChevronDown, NotebookPen, Pencil, Send, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import CroissantageCreationForm from "@/components/croissantage-creation-form.tsx";
import CroissantageModalEdit from "@/components/croissantage-modal-edit.tsx";
import CroissantageModalLogNote from "@/components/croissantage-modal-log-note.tsx";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function PresentationHomepage() {
	const { data, refetch: refetchCroissantages } = useQuery({
		queryKey: ["croissantageList"],
		queryFn: fetchCroissantages,
	});
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
			<div className="flex items-center justify-between space-x-4">
				<h1 className="text-2xl font-bold mb-4">Liste des croissantages</h1>
				<Button variant="outline" onClick={() => refetchCroissantages()}>
					<RefreshCcw /> Rafraîchir
				</Button>
			</div>
			<div>
				<CroissantageList>
					{data?.records?.map((croissantage: Croissantage) => (
						<TableRow key={croissantage.id}>
							<TableCell className="font-medium">{croissantage.id}</TableCell>
							<TableCell>{croissantage.name}</TableCell>
							<TableCell>{croissantage.partner_id.display_name}</TableCell>
							<TableCell>
								{croissantage.partner_names?.join(", ") ||
									croissantage.partner_ids?.join(", ")}
							</TableCell>
							<TableCell>
								<CroissantageModalDetails id={croissantage.id}>
									<Button variant="outline">
										<Search /> Détails
									</Button>
								</CroissantageModalDetails>
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
							</h2>
							<ChevronDown className="h-4 w-4" />
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<CroissantageCreationForm />
					</CollapsibleContent>
				</Collapsible>
			</div>
		</>
	);
}
