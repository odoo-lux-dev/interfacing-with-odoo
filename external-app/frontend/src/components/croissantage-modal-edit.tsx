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
import { editCroissantage } from "@/lib/odoo.ts";
import { toast } from "sonner";
import { croissantageRpcListAtom } from "@/store/form-store.ts";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { presentationModeAtom } from "@/store/options-store.ts";

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
	const { t } = useTranslation();
	const [presentationMode] = useAtom(presentationModeAtom);

	const croissantageEditMutation = useMutation({
		mutationFn: editCroissantage,
		onSuccess: () => {
			toast.success(
				t("CROISSANTAGE_SUCCESSFULLY_UPDATED", { ns: "croissantage" }),
			);
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
					<DialogTitle>
						{t("EDIT_MODAL_TITLE", {
							ns: "croissantage",
							name: croissantage?.name,
						})}
					</DialogTitle>
				</DialogHeader>
				<Input
					placeholder={t("CROISSANTAGE_NAME_LABEL", { ns: "croissantage" })}
					value={croissantageName}
					onChange={(e) => setCroissantageName(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleEditCroissantage}>{t("SAVE_LABEL")}</Button>
				</DialogFooter>
				{!presentationMode ? (
					<>
						<Separator className="my-5" />
						<DataCollapsible title={t("RPC_CALL_DETAILS_LABEL")}>
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
	[${croissantage.id}], // ID Record
	croissantageValues,
])
`}
								</code>
							</pre>
						</DataCollapsible>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default CroissantageModalEdit;
