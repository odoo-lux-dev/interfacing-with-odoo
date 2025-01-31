import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import CroissantageCreationForm from "@/components/croissantage-creation-form.tsx";
import {
	croissantageRpcListAtom,
	croissantageStatusesAtom,
	partnersVictimListAtom,
	searchInputValueVictimAtom,
	selectedExecutionerAtom,
	selectedStatusAtom,
	selectedVictimAtom,
} from "@/store/form-store.ts";
import { useAtom } from "jotai";
import { Croissantage } from "@/types.ts";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import CroissantageList from "@/components/croissantage-list.tsx";
import CroissantageModalEdit from "@/components/croissantage-modal-edit.tsx";
import { Button } from "@/components/ui/button.tsx";
import { NotebookPen, Pencil, Send, Trash2 } from "lucide-react";
import CroissantageModalLogNote from "@/components/croissantage-modal-log-note.tsx";
import { deleteRecord, sendMailNotification } from "@/lib/odoo.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function JSONRpc() {
	const [searchInputValueVictim] = useAtom(searchInputValueVictimAtom);
	const [partnerListVictim] = useAtom(partnersVictimListAtom);
	const [{ data: statuses }] = useAtom(croissantageStatusesAtom);
	const [selectedStatus] = useAtom(selectedStatusAtom);
	const [selectedVictim] = useAtom(selectedVictimAtom);
	const [selectedExecutioners] = useAtom(selectedExecutionerAtom);
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
		mutationFn: deleteRecord,
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
			<h1 className="text-2xl font-bold mb-4">
				{t("JSON_RPC_PAGE_TITLE", { ns: "pages" })}
			</h1>
			<h2 className="text-xl font-bold mb-2">
				{t("JSON_RPC_PAGE_CREATE_CROISSANTAGE", { ns: "pages" })}
			</h2>
			<CroissantageCreationForm />
			<Separator className="my-5" />
			<h2 className="text-xl font-bold mb-2">
				{t("JSON_RPC_PAGE_VIEW_EDIT_CROISSANTAGES", { ns: "pages" })}
			</h2>
			<Separator className="my-5" />
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
									<Pencil /> {t("EDIT_LABEL")}
								</Button>
							</CroissantageModalEdit>
							<Button
								variant="outline"
								onClick={() => sendNotificationMail(croissantage.id)}
							>
								<Send /> {t("NOTIFY_LABEL")}
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
								<Trash2 /> {t("DELETE_LABEL")}
							</Button>
						</TableCell>
					</TableRow>
				))}
			</CroissantageList>
			<Separator className="my-5" />
			<DataCollapsible title={t("RPC_CALL_DETAILS_LABEL")}>
				<>
					<h4 className="text-sm font-bold">
						{t("MODEL_FETCHING_LABEL", {
							displayName: "Croissanté",
							modelName: "res.partner",
						})}
					</h4>
					<p className="py-3">
						<strong className="text-sm">{t("REQUEST_LABEL")} : </strong>
						<code className="bg-gray-100">
							odooJSONRpcClient.call_kw("res.partner", "search_read", [[["name",
							"ilike", "
							{searchInputValueVictim !== ""
								? `%${searchInputValueVictim}%`
								: ""}
							"], ["type", "=", "contact"]], ["name", "id"]])
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(partnerListVictim, null, 2)}</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						{t("MODEL_FETCHING_LABEL", {
							displayName: "State",
							modelName: "croissantage",
						})}
					</h4>
					<p className="py-3">
						<strong className="text-sm">{t("REQUEST_LABEL")} : </strong>
						<code className="bg-gray-100">
							{`odooJSONRpcClient.call_kw("croissantage", "fields_get", ["state"], { "attributes": ["selection"]})`}
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(statuses, null, 2)}</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						{t("MODEL_FETCHING_LABEL", {
							displayName: "Croissantages",
							modelName: "croissantage",
						})}
					</h4>
					<p className="py-3">
						<strong className="text-sm">{t("REQUEST_LABEL")} : </strong>
						<code className="bg-gray-100">
							{`odooJSONRpcClient.call_kw("croissantage", "search_read", [[], ["id", "name", "partner_id", "partner_ids"]])`}
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(croissantages, null, 2)}</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						{t("MODEL_CREATION_LABEL", {
							modelName: "croissantage",
							displayName: "Croissantage",
						})}
					</h4>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`const croissantageValues = ${JSON.stringify(
								{
									name: t("CROISSANTAGE_CREATED_VIA_RPC", {
										ns: "croissantage",
									}),
									partner_id: selectedVictim[0],
									partner_ids: [[6, 0, selectedExecutioners]],
									state: selectedStatus,
								},
								null,
								2,
							)}

odooJSONRpcClient.call_kw("croissantage", "create", [croissantageValues])
	.then((recordId) => {
		// Croissantage ID is returned
	})
`}
						</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						{t("MODEL_SEND_NOTIFICATION_LABEL", { modelName: "croissantage" })}
					</h4>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`// We assume that we retrieve the croissantage ID in "croissantageId" - On part du principe que l'on recupère l'ID du croissantage dans "croissantageId"

// Retrieve the action to be performed to send the e-mail - On récupère l'action à effectuer pour envoyer le mail
const actionSendMail = await odooRpcClient.call_kw(
	"croissantage",
	"action_send_croissantage_mail",
	[croissantageId],
);

// We retrieve the context of the action - On récupère le contexte de l'action
const actionContext = actionSendMail.context;
const wizardArgs = [{}];
const wizardKwargs = { context: actionContext };

// We create the wizard to send the e-mail, using the context of the action - On crée le wizard pour envoyer le mail, en utilisant le contexte de l'action
const wizardId = await odooRpcClient.call_kw(
	"mail.compose.message",
	"create",
	wizardArgs,
	wizardKwargs,
);

// Validate the wizard to send the e-mail - Validation du wizard pour envoyer le mail
await odooRpcClient.call_kw("mail.compose.message", "action_send_mail", [
	wizardId,
]);
`}
						</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						{t("MODEL_DELETION_LABEL", {
							displayName: "Croissantage",
							modelName: "croissantage",
						})}
					</h4>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`odooRpcClient.call_kw("croissantage", "unlink", [recordId])`}
						</code>
					</pre>
				</>
			</DataCollapsible>
		</>
	);
}
