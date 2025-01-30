import type { FC, ReactNode } from "react";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface CroissantageListProps {
	children: ReactNode;
}

const CroissantageList: FC<CroissantageListProps> = ({ children }) => {
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
				<TableBody>{children}</TableBody>
			</Table>
		</div>
	);
};

export default CroissantageList;
