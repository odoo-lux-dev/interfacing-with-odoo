import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { NavLink, useLocation } from "react-router";
import OdooConfiguration from "@/components/odoo-configuration.tsx";
import NavLinkButton from "@/components/nav-link-button.tsx";

const CONFIGURATION_ALLOWED_LINKS = ["/json", "/webhook", "/json-rpc"];

const Header: FC = () => {
	const location = useLocation();

	return (
		<header className="flex items-center justify-between p-4 bg-gray-100">
			<div className="flex space-x-4">
				<NavLink to="/">
					<Button variant="link">Odoo Tech Evening</Button>
				</NavLink>
				<NavLinkButton endpoint="/json" label="/json" />
				<NavLinkButton endpoint="/json-rpc" label="JSON-RPC" />
				<NavLinkButton endpoint="/webhook" label="Webhook" />
			</div>
			{CONFIGURATION_ALLOWED_LINKS.includes(location.pathname) ? (
				<div>
					<OdooConfiguration>
						<Button variant="outline">Configuration Odoo</Button>
					</OdooConfiguration>
				</div>
			) : null}
		</header>
	);
};

export default Header;
