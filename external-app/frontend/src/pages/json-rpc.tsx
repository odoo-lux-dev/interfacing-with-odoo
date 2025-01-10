import { getOdooJSONRpcClient } from "@/lib/odoo";
import { useState } from "react";
import { toast } from "sonner";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import CroissantageForm from "@/components/croissantage-form.tsx";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function JSONRpc() {
	const [selectedPartner, setSelectedPartner] = useState<null | number>(null);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [debouncedInputValue, setDebouncedInputValue] = useState("");
	const odooConfiguration = store.get(odooConfigurationAtom);
	const { data: statuses } = useQuery({
		queryKey: ["croissantageStatuses"],
		queryFn: async () => {
			const odooRpcClient = await getOdooJSONRpcClient();
			return odooRpcClient.call_kw("croissantage", "fields_get", ["state"], {
				attributes: ["selection"],
			});
		},
		placeholderData: { state: { selection: [] } },
	});
	const { data: partners, isFetching: isFetchingPartners } = useQuery({
		queryKey: ["partners", debouncedInputValue],
		queryFn: async () => {
			const odooRpcClient = await getOdooJSONRpcClient();
			if (debouncedInputValue === "" || !odooRpcClient) return [];
			return await odooRpcClient.call_kw("res.partner", "search_read", [
				[
					["name", "ilike", `%${debouncedInputValue}%`],
					["type", "=", "contact"],
				],
				["name", "id"],
			]);
		},
		placeholderData: [],
	});

	const croissantageCreationMutation = useMutation({
		mutationFn: async (croissantageValues: {
			name: string;
			partner_id: number | null;
			state: string;
		}) => {
			const odooRpcClient = await getOdooJSONRpcClient();
			return odooRpcClient.call_kw("croissantage", "create", [
				croissantageValues,
			]);
		},
		onSuccess: (recordId) => {
			toast.success("Croissantage créé avec succès", {
				description: `ID: ${recordId}`,
				action: {
					label: "Voir",
					onClick: () => {
						window.open(
							`${odooConfiguration.url}:${odooConfiguration.port}/odoo/croissantage/${recordId}`,
							"_blank",
						);
					},
				},
			});
		},
	});

	const onSubmit = () => {
		const croissantageValues = {
			name: "Croissantage créé par RPC",
			partner_id: selectedPartner,
			state: selectedStatus,
		};
		croissantageCreationMutation.mutate(croissantageValues);
	};

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">S'interfacer via JSON-RPC</h1>
			<h2 className="text-xl font-bold mb-2">Créer un croissantage</h2>
			<CroissantageForm
				debouncedInputValue={debouncedInputValue}
				selectedPartner={selectedPartner}
				setSelectedPartner={setSelectedPartner}
				partners={partners}
				setDebouncedInputValue={setDebouncedInputValue}
				statuses={statuses}
				setSelectedStatus={setSelectedStatus}
				onSubmit={onSubmit}
				isFetchingPartners={isFetchingPartners}
			/>
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
							{debouncedInputValue !== "" ? `%${debouncedInputValue}%` : ""}"],
							["type", "=", "contact"]], ["name", "id"]])
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(partners, null, 2)}</code>
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
	partner_id: selectedPartner,
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
