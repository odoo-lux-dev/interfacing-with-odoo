import { atomWithStorage } from "jotai/utils";

interface IOdooConfiguration {
	url: string;
	port: number;
	name: string;
	username: string;
	apiKey: string;
}

export const odooConfigurationAtom = atomWithStorage<IOdooConfiguration>(
	"odoo-configuration",
	{
		url: "",
		port: 8069,
		name: "",
		username: "",
		apiKey: "",
	},
);
