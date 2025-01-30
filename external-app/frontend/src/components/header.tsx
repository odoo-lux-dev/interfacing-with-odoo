import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { NavLink } from "react-router";
import OdooConfiguration from "@/components/odoo-configuration";
import NavLinkButton from "@/components/nav-link-button";

const Header: FC = () => {
	return (
		<header className="flex items-center justify-between p-4 bg-gray-100">
			<div className="flex space-x-4">
				<NavLink to="/">
					<Button variant="link">API avec Odoo</Button>
				</NavLink>
				<NavLinkButton endpoint="/json" label="/json" />
				<NavLinkButton endpoint="/json-rpc" label="JSON-RPC" />
				<NavLinkButton endpoint="/webhook" label="Webhook" />
			</div>
			<OdooConfiguration>
				<Button variant="outline">Configuration Odoo</Button>
			</OdooConfiguration>
		</header>
	);
};

export default Header;
