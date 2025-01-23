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
		return odooRpcClient.call_kw("croissantage", "fields_get", ["state"], {
			attributes: ["selection"],
		});
	},
	placeholderData: { state: { selection: [] } },
}));

export const selectedStatusAtom = atom("");
