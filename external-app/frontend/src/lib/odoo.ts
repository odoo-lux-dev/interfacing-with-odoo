import { odooConfigurationAtom } from "@/store/credentials-store";
import { store } from "@/store";

export async function odooFetch(url: string, options: RequestInit = {}) {
	const odooConfiguration = store.get(odooConfigurationAtom);

	const headers = {
		Authorization: `Bearer ${odooConfiguration.apiKey}`,
		"Content-Type": "application/json",
		...options.headers,
	};

	const response = await fetch(odooConfiguration.url + url, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}
