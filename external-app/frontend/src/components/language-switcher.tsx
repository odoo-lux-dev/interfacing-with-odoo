import frenchFlag from "/flags/fr.svg";
import englishFlag from "/flags/en.svg";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDownIcon } from "lucide-react";
import { useLocalStorage } from "react-use";

const flags = {
	en: englishFlag,
	fr: frenchFlag,
};

const LanguageSwitcher: FC = () => {
	const { t, i18n } = useTranslation();
	const [, setValue] = useLocalStorage("defaultLanguage", "en", { raw: true });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<img
						src={flags[i18n.language as "en" | "fr"]}
						width={24}
						height={24}
						className="rounded-full"
						style={{ aspectRatio: "24/24", objectFit: "cover" }}
					/>
					<ChevronDownIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuLabel>{t("LANG_SELECT")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => i18n.changeLanguage("en").then(() => setValue("en"))}
					>
						<div className="flex items-center gap-2">
							<img
								src={flags["en"]}
								alt="EN Flag"
								width={24}
								height={24}
								className="rounded-full"
								style={{ aspectRatio: "24/24", objectFit: "cover" }}
							/>
							<span>{t("EN")}</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => i18n.changeLanguage("fr").then(() => setValue("fr"))}
					>
						<div className="flex items-center gap-2">
							<img
								src={flags["fr"]}
								alt="FR Flag"
								width={24}
								height={24}
								className="rounded-full"
								style={{ aspectRatio: "24/24", objectFit: "cover" }}
							/>
							<span>{t("FR")}</span>
						</div>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LanguageSwitcher;
