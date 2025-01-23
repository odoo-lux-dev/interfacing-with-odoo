import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import CroissantageForm from "@/components/croissantage-form.tsx";
import {
	croissantageStatusesAtom,
	partnersVictimListAtom,
	searchInputValueVictimAtom,
} from "@/store/form-store.ts";
import { useAtom } from "jotai";

export default function JSONRpc() {
	const [searchInputValueVictim] = useAtom(searchInputValueVictimAtom);
	const [partnerListVictim] = useAtom(partnersVictimListAtom);
	const [{ data: statuses }] = useAtom(croissantageStatusesAtom);

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">S'interfacer via JSON-RPC</h1>
			<h2 className="text-xl font-bold mb-2">Créer un croissantage</h2>
			<CroissantageForm />
			<Separator className="my-5" />
			<DataCollapsible title="Détail des calls RPC">
				<>
					<h4 className="text-sm font-bold">
						Fetch du "Croissanté" (res.partner)
					</h4>
					<p className="py-3">
						<strong className="text-sm">Requête : </strong>
						<code className="bg-gray-100">
							call_kw("res.partner", "search_read", [[["name", "ilike", "
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
							{`call_kw("croissantage", "fields_get", ["state"], { "attributes": ["selection"]})`}
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(statuses, null, 2)}</code>
					</pre>
					<Separator className="my-3" />
					<h4 className="text-sm font-bold">
						Création du croissantage (croissantage)
					</h4>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`const croissantageValues = {
	name: "Croissantage créé par RPC",
	partner_id: selectedVictim[0],
	partner_ids: [[6, 0, selectedExecutioners]],
	state: selectedStatus,
};

odooJSONRpcClient.call_kw("croissantage", "create", [croissantageValues])
	.then((recordId) => {
		// L'ID du croissantage est retourné à la création
	})
`}
						</code>
					</pre>
				</>
			</DataCollapsible>
		</>
	);
}
