import { odooConfigurationAtom } from "@/store/credentials-store";
import { store } from "@/store";
import OdooJSONRpc from "@fernandoslim/odoo-jsonrpc";

export async function odooFetch(url: string, options: RequestInit = {}) {
	const odooConfiguration = store.get(odooConfigurationAtom);
	const databaseEndpoint = `${odooConfiguration.url}:${odooConfiguration.port}`;

	const headers = {
		Authorization: `Bearer ${odooConfiguration.apiKey}`,
		"Content-Type": "application/json",
		...options.headers,
	};

	const response = await fetch(databaseEndpoint + url, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export function getOdooJSONRpcClient(): Promise<OdooJSONRpc> {
	return new Promise((resolve, reject) => {
		const odooConfiguration = store.get(odooConfigurationAtom);

		const odoo = new OdooJSONRpc({
			baseUrl: odooConfiguration.url,
			port: odooConfiguration.port,
			db: odooConfiguration.name,
			username: odooConfiguration.username,
			apiKey: odooConfiguration.apiKey,
		});

		odoo
			.connect()
			.then((res) => {
				if (!res.uid) {
					return reject("No UID returned");
				}
				resolve(odoo);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
