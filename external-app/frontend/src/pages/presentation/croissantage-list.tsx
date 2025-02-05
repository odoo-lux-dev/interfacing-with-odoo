import { useQuery } from "@tanstack/react-query";
import CroissantageList from "@/components/croissantage-list";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw, Search } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import CroissantageModalDetails from "@/components/croissantage-modal-details.tsx";
import type { Croissantage } from "@/types.ts";
import { fetchCroissantages } from "@/lib/odoo.ts";

export default function CroissantageListPage() {
	const { data, refetch } = useQuery({
		queryKey: ["croissantageList"],
		queryFn: fetchCroissantages,
	});

	return (
		<>
			<div className="flex items-center justify-between space-x-4">
				<h1 className="text-2xl font-bold mb-4">Liste des croissantages</h1>
				<Button variant="outline" onClick={() => refetch()}>
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
			</div>
		</>
	);
}
