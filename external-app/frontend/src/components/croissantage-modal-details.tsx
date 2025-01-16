import type { FC, ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useQuery } from "@tanstack/react-query";
import { odooFetch } from "@/lib/odoo.ts";
import { Separator } from "@/components/ui/separator.tsx";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";

interface CroissantageModalDetailsProps {
	children: ReactNode;
	id: number;
}

const CroissantageModalDetails: FC<CroissantageModalDetailsProps> = ({
	children,
	id,
}) => {
	const { data } = useQuery({
		queryKey: [`croissantage-details-${id}`],
		queryFn: () => odooFetch("/json/1/croissantage/1"),
	});

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Détail de "{data?.name}"</DialogTitle>
				</DialogHeader>
				<div>
					<p>
						<strong>ID:</strong> {data?.id}
					</p>
					<p>
						<strong>État:</strong> {data?.state}
					</p>
					<p>
						<strong>Nom:</strong> {data?.name}
					</p>
					<p>
						<strong>Ville:</strong> {data?.city}
					</p>
					<p>
						<strong>Date de début:</strong> {data?.date_begin}
					</p>
					<p>
						<strong>Date de fin:</strong>{" "}
						{data?.date_end ? data.date_end : "N/A"}
					</p>
					<p>
						<strong>Durée:</strong> {data?.duration}
					</p>
					<p>
						<strong>Croissanté:</strong> {data?.partner_id.id}
					</p>
					<p>
						<strong>Croissanteur(s):</strong> {data?.partner_id.display_name}
					</p>
				</div>
				<Separator className="my-5" />
				<DataCollapsible title="Retour de l'API">
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(data, null, 2)}</code>
					</pre>
				</DataCollapsible>
			</DialogContent>
		</Dialog>
	);
};

export default CroissantageModalDetails;
