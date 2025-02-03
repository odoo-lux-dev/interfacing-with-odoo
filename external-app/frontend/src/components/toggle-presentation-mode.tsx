import type { FC } from "react";
import { presentationModeAtom } from "@/store/options-store.ts";
import { useAtom } from "jotai";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import { FileCode, Presentation } from "lucide-react";
import { toast } from "sonner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router";

const TogglePresentationMode: FC = () => {
	const [presentationMode, setPresentationMode] = useAtom(presentationModeAtom);
	const { t, i18n } = useTranslation();
	const [value] = useLocalStorage("defaultLanguage", "en", { raw: true });
	const navigate = useNavigate();

	return (
		<div className="flex items-center space-x-2">
			<Switch
				id="presentation-mode"
				checked={presentationMode}
				onCheckedChange={(checked) => {
					i18n.changeLanguage(checked ? "fr" : value).catch(console.error);
					toast.info(
						checked
							? t("PRESENTATION_MODE_LABEL")
							: t("DEMONSTRATION_MODE_LABEL"),
						{
							position: "bottom-center",
						},
					);
					setPresentationMode(checked);
					navigate("/");
				}}
			/>

			<TooltipProvider>
				<Tooltip delayDuration={200}>
					<TooltipTrigger>
						<Label htmlFor="presentation-mode">
							{presentationMode ? <Presentation /> : <FileCode />}
						</Label>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							{presentationMode
								? t("PRESENTATION_MODE_LABEL")
								: t("DEMONSTRATION_MODE_LABEL")}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default TogglePresentationMode;
