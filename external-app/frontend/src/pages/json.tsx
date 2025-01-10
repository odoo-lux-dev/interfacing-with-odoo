import { useQuery } from "@tanstack/react-query";
import { odooFetch } from "@/lib/odoo";
import CroissantageList from "@/components/croissantage-list";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button.tsx";
import { RefreshCcw } from "lucide-react";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";

export default function JSONPage() {
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
				<CroissantageList croissantages={data?.records} />
				<Separator className="my-5" />
				<DataCollapsible title="Retour de l'API">
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>{JSON.stringify(data, null, 2)}</code>
					</pre>
				</DataCollapsible>
			</div>
		</>
	);
}
