import type { FC } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const RequestInfoTooltip: FC = () => {
	const { t } = useTranslation();

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger>
					<Info className="mr-2" size={20} />
				</TooltipTrigger>
				<TooltipContent>
					<p>{t("CALL_KW_INFO")}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default RequestInfoTooltip;
