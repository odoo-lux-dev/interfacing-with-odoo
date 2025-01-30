import { useQuery } from "@tanstack/react-query";
import { odooFetch } from "@/lib/odoo";
import CroissantageList from "@/components/croissantage-list";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw, Search } from "lucide-react";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import CroissantageModalDetails from "@/components/croissantage-modal-details.tsx";
import { Croissantage } from "@/types.ts";

export default function JSONPage() {
	const odooConfiguration = store.get(odooConfigurationAtom);

	const { data, refetch } = useQuery({
		queryKey: ["croissantage"],
		queryFn: () => odooFetch("/json/1/croissantage"),
	});

	return (
		<>
			<div className="flex items-center justify-between space-x-4">
				<h1 className="text-2xl font-bold mb-4">
					Lire des données via <code>/json</code>
				</h1>
				<Button variant="outline" onClick={() => refetch()}>
					<RefreshCcw /> Rafraîchir les données
				</Button>
			</div>
			<div>
				<CroissantageList>
					{data?.records?.map((croissantage: Croissantage) => (
						<TableRow key={croissantage.id}>
							<TableCell className="font-medium">{croissantage.id}</TableCell>
							<TableCell>{croissantage.name}</TableCell>
							<TableCell>{croissantage.partner_id.display_name}</TableCell>
							<TableCell>{croissantage.partner_ids.join(", ")}</TableCell>
							<TableCell>
								<CroissantageModalDetails id={croissantage.id}>
									<Button variant="outline">
										<Search /> Détails
									</Button>
								</CroissantageModalDetails>
							</TableCell>
						</TableRow>
					))}
				</CroissantageList>
				<Separator className="my-5" />
				<DataCollapsible title="Retour de l'API">
					<p className="py-3">
						<strong className="text-sm">Requête : </strong>
						<code className="bg-gray-100">
							{`${odooConfiguration.url}:${odooConfiguration.port}/json/1/croissantage`}
						</code>
					</p>
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(data, null, 2)}</code>
					</pre>
				</DataCollapsible>
			</div>
		</>
	);
}
