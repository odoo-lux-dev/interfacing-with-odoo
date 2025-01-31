import type { FC, ReactNode } from "react";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

interface CroissantageListProps {
	children: ReactNode;
}

const CroissantageList: FC<CroissantageListProps> = ({ children }) => {
	const { t } = useTranslation();

	return (
		<div className="w-full overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead>{t("NAME_LABEL")}</TableHead>
						<TableHead>Croissanté</TableHead>
						<TableHead>Croissanteur(s)</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>{children}</TableBody>
			</Table>
		</div>
	);
};

export default CroissantageList;
