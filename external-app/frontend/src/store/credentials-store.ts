import { atomWithStorage } from "jotai/utils";

interface OdooConfiguration {
	url: string;
	port: number;
	name: string;
	username: string;
	apiKey: string;
}

export const odooConfigurationAtom = atomWithStorage<OdooConfiguration>(
	"odoo-configuration",
	{
		url: "",
		port: 8069,
		name: "",
		username: "",
		apiKey: "",
	},
);
