import type { FC, ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useQuery } from "@tanstack/react-query";
import { fetchCroissantage } from "@/lib/odoo.ts";
import { Separator } from "@/components/ui/separator.tsx";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { store } from "@/store";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai/index";
import { presentationModeAtom } from "@/store/options-store.ts";

interface CroissantageModalDetailsProps {
	children: ReactNode;
	id: number;
}

const CroissantageModalDetails: FC<CroissantageModalDetailsProps> = ({
	children,
	id,
}) => {
	const odooConfiguration = store.get(odooConfigurationAtom);
	const { t } = useTranslation();
	const [presentationMode] = useAtom(presentationModeAtom);

	const { data } = useQuery({
		queryKey: [`croissantage-details-${id}`],
		queryFn: () => fetchCroissantage(id),
	});

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="min-w-[80%]">
				<DialogHeader>
					<DialogTitle>
						{t("DETAILS_MODAL_TITLE", { ns: "croissantage", name: data?.name })}
					</DialogTitle>
				</DialogHeader>
				<div>
					<p>
						<strong>ID:</strong> {data?.id}
					</p>
					<p>
						<strong>{t("STATE_LABEL")}:</strong> {data?.state}
					</p>
					<p>
						<strong>{t("NAME_LABEL")}:</strong> {data?.name}
					</p>
					<p>
						<strong>{t("CITY_LABEL")}:</strong> {data?.city}
					</p>
					<p>
						<strong>{t("BEGIN_DATE_LABEL")}:</strong> {data?.date_begin}
					</p>
					<p>
						<strong>{t("END_DATE_LABEL")}:</strong>{" "}
						{data?.date_end ? data.date_end : "N/A"}
					</p>
					<p>
						<strong>{t("DURATION_LABEL")}:</strong> {data?.duration}
					</p>
					<p>
						<strong>Croissanté:</strong> {data?.partner_id?.display_name}
					</p>
					<p>
						<strong>Croissanteur(s):</strong>{" "}
						{data?.partner_names?.join(", ") || data?.partner_ids?.join(", ")}
					</p>
				</div>
				{!presentationMode ? (
					<>
						<Separator className="my-5" />
						<DataCollapsible title={t("API_RESPONSE_LABEL")}>
							<p className="py-3">
								<strong className="text-sm">{t("REQUEST_LABEL")} : </strong>
								<code className="bg-gray-100">
									{`${odooConfiguration.url}:${odooConfiguration.port}/json/1/croissantage/${id}`}
								</code>
							</p>
							<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
								<code>{JSON.stringify(data, null, 2)}</code>
							</pre>
						</DataCollapsible>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default CroissantageModalDetails;
