import type { FC } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button.tsx";
import { Search } from "lucide-react";
import CroissantageModalDetails from "@/components/croissantage-modal-details.tsx";
import { CroissantageListProps } from "@/types.ts";

const CroissantageList: FC<CroissantageListProps> = ({ croissantages }) => {
	return (
		<div className="w-full overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead>Nom</TableHead>
						<TableHead>Croissanté</TableHead>
						<TableHead>Croissanteur(s)</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{croissantages?.map((croissantage) => (
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
				</TableBody>
			</Table>
		</div>
	);
};

export default CroissantageList;
