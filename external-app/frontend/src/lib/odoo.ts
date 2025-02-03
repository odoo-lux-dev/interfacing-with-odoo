import OdooJSONRpc from "@fernandoslim/odoo-jsonrpc";
import { odooConfigurationAtom } from "@/store/credentials-store";
import { store } from "@/store";

// ********************************************************************************************************************
// *													Fetch part													  *
// ********************************************************************************************************************

// --------------------------------------------------------------------------------------------------------------------
// 														  Utils
// --------------------------------------------------------------------------------------------------------------------
export async function odooFetch(url: string, options: RequestInit = {}) {
	const odooConfiguration = store.get(odooConfigurationAtom);
	const databaseEndpoint = `${odooConfiguration.url}:${odooConfiguration.port}`;

	const headers = new Headers(options.headers);
	headers.set("Authorization", `Bearer ${odooConfiguration.apiKey}`);
	headers.set("Content-Type", "application/json");

	const response = await fetch(databaseEndpoint + url, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

// --------------------------------------------------------------------------------------------------------------------
// 														Functions
// --------------------------------------------------------------------------------------------------------------------
export function fetchCroissantages() {
	return odooFetch("/json/1/croissantage");
}

export function fetchCroissantage(id: number) {
	return odooFetch(`/json/1/croissantage/${id}`);
}

// ********************************************************************************************************************
// *													JSON-RPC part												  *
// ********************************************************************************************************************

// --------------------------------------------------------------------------------------------------------------------
// 														  Utils
// --------------------------------------------------------------------------------------------------------------------
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

// --------------------------------------------------------------------------------------------------------------------
// 														Functions
// --------------------------------------------------------------------------------------------------------------------
export async function sendMailNotification(recordId: number) {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	const actionSendMail = await odooRpcClient.call_kw(
		"croissantage",
		"action_send_croissantage_mail",
		[recordId],
	);
	const actionContext = actionSendMail.context;
	const wizardArgs = [{}];
	const wizardKwargs = { context: actionContext };
	const wizardId = await odooRpcClient.call_kw(
		"mail.compose.message",
		"create",
		wizardArgs,
		wizardKwargs,
	);
	return odooRpcClient.call_kw("mail.compose.message", "action_send_mail", [
		wizardId,
	]);
}

export async function deleteCroissantage(recordId: number) {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("croissantage", "unlink", [recordId]);
}

export async function createCroissantage(recordValues: {
	name: string;
	partner_id: number;
	state: string;
}) {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("croissantage", "create", [recordValues]);
}

export async function editCroissantage(recordValues: {
	id: number;
	options: any;
}) {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("croissantage", "write", [
		[recordValues.id],
		recordValues.options,
	]);
}

export async function postLogNote(recordValues: {
	id: number;
	options: any;
}) {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw(
		"croissantage",
		"message_post",
		[[recordValues.id]],
		recordValues.options,
	);
}

export async function searchPartners(name: string) {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("res.partner", "search_read", [
		[
			["name", "ilike", `%${name}%`],
			["type", "=", "contact"],
		],
		["name", "id"],
	]);
}

export async function getCroissantageStatuses() {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("croissantage", "fields_get", ["state"], {
		attributes: ["selection"],
	});
}

export async function getCroissantages() {
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	const res = await odooRpcClient.call_kw("croissantage", "search_read", [
		[],
		["id", "name", "partner_id", "partner_ids"],
	]);
	return res.map((croissantage) => ({
		...croissantage,
		partner_id: {
			id: croissantage.partner_id[0],
			display_name: croissantage.partner_id[1],
		},
	}));
}
