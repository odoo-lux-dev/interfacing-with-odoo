import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getOdooJSONRpcClient } from "@/lib/odoo.ts";

export const searchInputValueVictimAtom = atom("");
export const selectedVictimAtom = atom<number[]>([]);
export const partnersVictimListAtom = atom<{ id: number; name: string }[]>([]);

export const searchInputValueExecutionerAtom = atom("");
export const selectedExecutionerAtom = atom<number[]>([]);
export const partnersExecutionerListAtom = atom<{ id: number; name: string }[]>(
	[],
);

export const croissantageStatusesAtom = atomWithQuery(() => ({
	queryKey: ["croissantageStatuses"],
	queryFn: async () => {
		const odooRpcClient = await getOdooJSONRpcClient();
		// call_kw is a wrapper of Odoo's execute_kw
		// It prevents to pass redundant parameters for each call : db, uid, password
		return await odooRpcClient.call_kw(
			"croissantage",
			"fields_get",
			["state"],
			{
				attributes: ["selection"],
			},
		);
	},
	placeholderData: { state: { selection: [] } },
}));

export const selectedStatusAtom = atom("");

export const croissantageRpcListAtom = atomWithQuery(() => ({
	queryKey: ["croissantageRpcList"],
	queryFn: async () => {
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
	},
	placeholderData: [],
}));
