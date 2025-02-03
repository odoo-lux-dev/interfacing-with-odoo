import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getCroissantages, getCroissantageStatuses } from "@/lib/odoo.ts";

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
	queryFn: getCroissantageStatuses,
	placeholderData: { state: { selection: [] } },
}));

export const selectedStatusAtom = atom("");

export const croissantageRpcListAtom = atomWithQuery(() => ({
	queryKey: ["croissantageRpcList"],
	queryFn: getCroissantages,
	placeholderData: [],
}));
