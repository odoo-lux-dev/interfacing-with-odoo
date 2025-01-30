import type { FC, ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { Croissantage } from "@/types.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getOdooJSONRpcClient } from "@/lib/odoo.ts";
import { toast } from "sonner";
import { croissantageRpcListAtom } from "@/store/form-store.ts";
import { useAtom } from "jotai";

interface CroissantageModalEditProps {
	children: ReactNode;
	croissantage: Croissantage;
}

const CroissantageModalEdit: FC<CroissantageModalEditProps> = ({
	children,
	croissantage,
}) => {
	const [croissantageName, setCroissantageName] = useState(croissantage.name);
	const [{ refetch: refetchCroissantageList }] = useAtom(
		croissantageRpcListAtom,
	);

	const croissantageEditMutation = useMutation({
		mutationFn: async (croissantageValues: {
			id: number;
			options: any;
		}) => {
			const odooRpcClient = await getOdooJSONRpcClient();
			// call_kw is a wrapper of Odoo's execute_kw
			// It prevents to pass redundant parameters for each call : db, uid, password
			return odooRpcClient.call_kw("croissantage", "write", [
				[croissantageValues.id],
				croissantageValues.options,
			]);
		},
		onSuccess: () => {
			toast.success("Croissantage mis à jour avec succès");
			refetchCroissantageList().catch(console.error);
		},
	});

	const handleEditCroissantage = async () => {
		const croissantageValues = {
			name: croissantageName,
		};
		croissantageEditMutation.mutate({
			id: croissantage.id,
			options: croissantageValues,
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="min-w-[80%]">
				<DialogHeader>
					<DialogTitle>Éditer "{croissantage?.name}"</DialogTitle>
				</DialogHeader>
				<Input
					placeholder="Nom du croissantage"
					value={croissantageName}
					onChange={(e) => setCroissantageName(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleEditCroissantage}>Sauvegarder</Button>
				</DialogFooter>
				<Separator className="my-5" />
				<DataCollapsible title="Détail du call RPC">
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`const croissantageValues = ${JSON.stringify(
								{
									name: croissantageName,
								},
								null,
								2,
							)}

odooJSONRpcClient.call_kw("croissantage", "write", [
	[${croissantage.id}], // ID du record
	croissantageValues, // Dict. avec les données à update
])
`}
						</code>
					</pre>
				</DataCollapsible>
			</DialogContent>
		</Dialog>
	);
};

export default CroissantageModalEdit;
