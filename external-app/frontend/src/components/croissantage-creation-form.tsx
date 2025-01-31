import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import PartnerSelect from "@/components/partner-select.tsx";
import {
	croissantageRpcListAtom,
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
import { createRecord } from "@/lib/odoo.ts";
import { toast } from "sonner";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import { useTranslation } from "react-i18next";

const CroissantageCreationForm: FC = () => {
	const odooConfiguration = store.get(odooConfigurationAtom);
	const [{ data: statuses }] = useAtom(croissantageStatusesAtom);
	const [selectedStatus, setSelectedStatus] = useAtom(selectedStatusAtom);
	const [selectedVictim] = useAtom(selectedVictimAtom);
	const [selectedExecutioners] = useAtom(selectedExecutionerAtom);
	const [{ refetch: refetchCroissantages }] = useAtom(croissantageRpcListAtom);
	const { t } = useTranslation();

	const mappedStatuses = statuses.state.selection.map(([id, name]) => ({
		id,
		name,
	}));

	const croissantageCreationMutation = useMutation({
		mutationFn: createRecord,
		onSuccess: (recordId) => {
			toast.success(t("CROISSANTAGE_SUCCESSFULLY_CREATED"), {
				description: `ID: ${recordId}`,
				action: {
					label: t("GO_TO_LABEL"),
					onClick: () => {
						window.open(
							`${odooConfiguration.url}:${odooConfiguration.port}/odoo/croissantage/${recordId}`,
							"_blank",
						);
					},
				},
			});
			refetchCroissantages().catch(console.error);
		},
	});

	const onSubmit = () => {
		const croissantageValues = {
			name: t("CROISSANTAGE_CREATED_VIA_RPC"),
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
				<Label>{t("STATE_LABEL")}</Label>
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

			<Button onClick={onSubmit}>{t("CREATE_LABEL")}</Button>
		</div>
	);
};

export default CroissantageCreationForm;
