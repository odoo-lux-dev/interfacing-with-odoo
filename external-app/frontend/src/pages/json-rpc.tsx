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

	const croissantageMailNotificationMutation = useMutation({
		mutationFn: sendMailNotification,
		onSuccess: () => {
			toast.success("Email envoyé avec succès");
		},
	});

	const deleteCroissantageMutation = useMutation({
		mutationFn: deleteRecord,
		onSuccess: () => {
			toast.success("Croissantage supprimé avec succès");
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
			<h1 className="text-2xl font-bold mb-4">S'interfacer via JSON-RPC</h1>
			<h2 className="text-xl font-bold mb-2">Créer un croissantage</h2>
			<CroissantageCreationForm />
			<Separator className="my-5" />
			<h2 className="text-xl font-bold mb-2">
				Listing et édition de croissantage
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
									<Pencil /> Éditer
								</Button>
							</CroissantageModalEdit>
							<Button
								variant="outline"
								onClick={() => sendNotificationMail(croissantage.id)}
							>
								<Send /> Notification
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
			<DataCollapsible title="Détail des calls RPC">
				<>
					<h4 className="text-sm font-bold">
						Fetch du "Croissanté" (res.partner)
					</h4>
					<p className="py-3">
						<strong className="text-sm">Requête : </strong>
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
						Fetch du "Statut" (croissantage)
					</h4>
					<p className="py-3">
						<strong className="text-sm">Requête : </strong>
						<code className="bg-gray-100">
							{`odooJSONRpcClient.call_kw("croissantage", "fields_get", ["state"], { "attributes": ["selection"]})`}
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(statuses, null, 2)}</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						Fetch des croissantages (croissantage)
					</h4>
					<p className="py-3">
						<strong className="text-sm">Requête : </strong>
						<code className="bg-gray-100">
							{`odooJSONRpcClient.call_kw("croissantage", "search_read", [[], ["id", "name", "partner_id", "partner_ids"]])`}
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(croissantages, null, 2)}</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						Création du croissantage (croissantage)
					</h4>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`const croissantageValues = ${JSON.stringify(
								{
									name: "Croissantage créé par RPC",
									partner_id: selectedVictim[0],
									partner_ids: [[6, 0, selectedExecutioners]],
									state: selectedStatus,
								},
								null,
								2,
							)}

odooJSONRpcClient.call_kw("croissantage", "create", [croissantageValues])
	.then((recordId) => {
		// L'ID du croissantage est retourné à la création
	})
`}
						</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						Envoi du mail de notifications (croissantage)
					</h4>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`// On part du principe que l'on recupère l'ID du croissantage dans "croissantageId"

// On récupère l'action à effectuer pour envoyer le mail
const actionSendMail = await odooRpcClient.call_kw(
	"croissantage",
	"action_send_croissantage_mail",
	[croissantageId],
);

// On récupère le contexte de l'action
const actionContext = actionSendMail.context;
const wizardArgs = [{}];
const wizardKwargs = { context: actionContext };

// On crée le wizard pour envoyer le mail, en utilisant le contexte de l'action
const wizardId = await odooRpcClient.call_kw(
	"mail.compose.message",
	"create",
	wizardArgs,
	wizardKwargs,
);

// Validation du wizard pour envoyer le mail
await odooRpcClient.call_kw("mail.compose.message", "action_send_mail", [
	wizardId,
]);
`}
						</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						Suppression du record (croissantage)
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
