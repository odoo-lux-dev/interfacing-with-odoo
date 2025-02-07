import i18n from "@/i18n";
import OdooJSONRpc from "@fernandoslim/odoo-jsonrpc";
import { odooConfigurationAtom } from "@/store/credentials-store";
import { store } from "@/store";
import type { Croissantage, WebhookBodyOdoo } from "@/types.ts";

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
export async function fetchCroissantages() {
	const res = await odooFetch("/json/1/croissantage");
	let { records } = res;
	records = await Promise.all(
		records.map(async (croissantage: Croissantage) => {
			const { partner_ids } = croissantage;
			const partnerNames = await Promise.all(
				partner_ids.map(async (partnerId) => {
					const { name } = await odooFetch(`/json/1/res.partner/${partnerId}`);
					return name;
				}),
			);
			return {
				...croissantage,
				partner_names: partnerNames,
			};
		}),
	);
	return {
		...res,
		records,
	};
}

export async function fetchCroissantage(id: number) {
	const res = await odooFetch(`/json/1/croissantage/${id}`);
	const partnerNames = await Promise.all(
		res.partner_ids.map(async (partnerId: number) => {
			const { name } = await odooFetch(`/json/1/res.partner/${partnerId}`);
			return name;
		}),
	);
	return {
		...res,
		partner_names: partnerNames,
	};
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
export async function editCroissantage(recordValues: {
	id: number;
	name: string;
}) {
	const croissantageValues = {
		name: recordValues.name,
	};
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("croissantage", "write", [
		[recordValues.id],
		croissantageValues,
	]);
}

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

export async function createCroissantage(recordValues: {
	partner_id: number;
	partner_ids: number[];
	state: string;
}) {
	const croissantageValues = {
		name: i18n.t("CROISSANTAGE_CREATED_VIA_RPC", { ns: "croissantage" }),
		partner_id: recordValues.partner_id,
		partner_ids: [[6, 0, recordValues.partner_ids]],
		state: recordValues.state,
	};
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw("croissantage", "create", [croissantageValues]);
}

export async function postLogNote(recordValues: {
	id: number;
	body: string;
}) {
	const croissantageValues = {
		body: recordValues.body,
		message_type: "comment",
	};
	const odooRpcClient = await getOdooJSONRpcClient();
	// call_kw is a wrapper of Odoo's execute_kw
	// It prevents to pass redundant parameters for each call : db, uid, password
	return odooRpcClient.call_kw(
		"croissantage",
		"message_post",
		[[recordValues.id]],
		croissantageValues,
	);
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

// ********************************************************************************************************************
// *												Webhook part													  *
// ********************************************************************************************************************

// --------------------------------------------------------------------------------------------------------------------
// 														  Utils
// --------------------------------------------------------------------------------------------------------------------
export async function sendWebhook(
	webhookUrl: string,
	webhookBody: WebhookBodyOdoo,
) {
	const response = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(webhookBody),
	});
	if (!response.ok) {
		throw new Error("Error w/ webhook");
	}
	return response.json();
}

// --------------------------------------------------------------------------------------------------------------------
// 														Functions
// --------------------------------------------------------------------------------------------------------------------
export async function sendWebhookLogNote(
	recordId: number,
	webhookMessage: string,
	webhookUrl: string,
) {
	const webhookBody: WebhookBodyOdoo<{ message: string }> = {
		_id: recordId,
		_model: "croissantage",
		message: webhookMessage,
	};
	return sendWebhook(webhookUrl, webhookBody);
}

export async function sendWebhookSimpleAction(
	recordId: number,
	webhookUrl: string,
) {
	const webhookBody: WebhookBodyOdoo = {
		_id: recordId,
		_model: "croissantage",
	};
	return sendWebhook(webhookUrl, webhookBody);
}
