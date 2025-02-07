import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { NavLink } from "react-router";
import OdooConfiguration from "@/components/odoo-configuration";
import NavLinkButton from "@/components/nav-link-button";
import TogglePresentationMode from "@/components/toggle-presentation-mode.tsx";
import { useAtom } from "jotai/index";
import { presentationModeAtom } from "@/store/options-store.ts";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/language-switcher.tsx";

const Header: FC = () => {
	const { t } = useTranslation();
	const [presentationMode] = useAtom(presentationModeAtom);

	return (
		<header className="flex items-center justify-between p-4 bg-gray-100">
			<div className="flex space-x-4">
				<NavLink to="/">
					<Button variant="link">
						{presentationMode ? "Gestion de croissantages" : t("APP_TITLE")}
					</Button>
				</NavLink>
				{!presentationMode ? (
					<>
						<NavLinkButton endpoint="/json" label="/json" />
						<NavLinkButton endpoint="/json-rpc" label="JSON-RPC" />
						<NavLinkButton endpoint="/webhook" label="Webhook" />
					</>
				) : null}
			</div>
			<div className="flex gap-3">
				<OdooConfiguration>
					<Button variant="outline">{t("SETUP_ODOO_INFORMATIONS")}</Button>
				</OdooConfiguration>
				<TogglePresentationMode />
				{!presentationMode ? <LanguageSwitcher /> : null}
			</div>
		</header>
	);
};

export default Header;
