import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import PartnerSelect from "@/components/partner-select.tsx";
import {
	croissantageStatusesAtom,
	partnersExecutionerListAtom,
	partnersVictimListAtom,
	searchInputValueExecutionerAtom,
	searchInputValueVictimAtom,
	selectedExecutionerAtom,
	selectedStatusAtom,
	selectedVictimAtom,
} from "@/store/form-store.ts";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { getOdooJSONRpcClient } from "@/lib/odoo.ts";
import { toast } from "sonner";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";

const CroissantageForm: FC = () => {
	const odooConfiguration = store.get(odooConfigurationAtom);
	const [selectedStatus, setSelectedStatus] = useAtom(selectedStatusAtom);
	const [{ data: statuses }] = useAtom(croissantageStatusesAtom);
	const [selectedVictim] = useAtom(selectedVictimAtom);
	const [selectedExecutioners] = useAtom(selectedExecutionerAtom);

	const mappedStatuses = statuses.state.selection.map(([id, name]) => ({
		id,
		name,
	}));

	const croissantageCreationMutation = useMutation({
		mutationFn: async (croissantageValues: {
			name: string;
			partner_id: number;
			state: string;
		}) => {
			const odooRpcClient = await getOdooJSONRpcClient();
			// call_kw is a wrapper of Odoo's execute_kw
			// It prevents to pass redundant parameters for each call : db, uid, password
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
			partner_id: selectedVictim[0],
			partner_ids: [[6, 0, selectedExecutioners]],
			state: selectedStatus,
		};
		croissantageCreationMutation.mutate(croissantageValues);
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="partner-search" className="mr-3">
					Croissanté
				</Label>
				<PartnerSelect
					searchInputValueAtom={searchInputValueVictimAtom}
					selectedPartnersAtom={selectedVictimAtom}
					partnersAtom={partnersVictimListAtom}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="partner-search" className="mr-3">
					Croissanteurs
				</Label>
				<PartnerSelect
					multiSelect
					searchInputValueAtom={searchInputValueExecutionerAtom}
					selectedPartnersAtom={selectedExecutionerAtom}
					partnersAtom={partnersExecutionerListAtom}
				/>
			</div>
			<div className="flex items-center gap-3">
				<Label>Statut</Label>
				<RadioGroup
					onValueChange={setSelectedStatus}
					className="flex space-x-4"
				>
					{mappedStatuses.map((s) => (
						<div key={s.id} className="flex items-center space-x-2">
							<RadioGroupItem value={s.id} id={s.id} />
							<Label htmlFor={s.id}>{s.name}</Label>
						</div>
					))}
				</RadioGroup>
			</div>

			<Button onClick={onSubmit}>Créer</Button>
		</div>
	);
};

export default CroissantageForm;
