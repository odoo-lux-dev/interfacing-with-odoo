import type { FC } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import { useDebounce } from "react-use";
import { atom, useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getOdooJSONRpcClient } from "@/lib/odoo.ts";

interface PartnerSelectProps {
	searchInputValueAtom: ReturnType<typeof atom<string>>;
	selectedPartnersAtom: ReturnType<typeof atom<number[]>>;
	partnersAtom: ReturnType<typeof atom<{ id: number; name: string }[]>>;
	multiSelect?: boolean;
}

const PartnerSelect: FC<PartnerSelectProps> = ({
	searchInputValueAtom,
	selectedPartnersAtom,
	partnersAtom,
	multiSelect = false,
}) => {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [searchInputValue, setSearchInputValue] = useAtom(searchInputValueAtom);
	const [, setFetchedPartners] = useAtom(partnersAtom);
	const [selectedPartners, setSelectedPartners] = useAtom(selectedPartnersAtom);

	const { data: partners, isFetching: isFetchingPartners } = useQuery({
		queryKey: ["partners", searchInputValue],
		queryFn: async () => {
			const odooRpcClient = await getOdooJSONRpcClient();
			if (searchInputValue === "" || !odooRpcClient) {
				setFetchedPartners([]);
				return [];
			}
			// call_kw is a wrapper of Odoo's execute_kw
			// It prevents to pass redundant parameters for each call : db, uid, password
			const partners = await odooRpcClient.call_kw(
				"res.partner",
				"search_read",
				[
					[
						["name", "ilike", `%${searchInputValue}%`],
						["type", "=", "contact"],
					],
					["name", "id"],
				],
			);
			setFetchedPartners(partners);
			return partners;
		},
		placeholderData: [],
	});

	const emptyLabel =
		searchInputValue === "" || isFetchingPartners
			? "Entrez votre recherche"
			: `Aucun partenaire trouvé pour "${searchInputValue}"`;

	useDebounce(
		() => {
			setSearchInputValue(inputValue);
		},
		500,
		[inputValue],
	);

	const toggleSelection = (partnerId: number) => {
		if (multiSelect) {
			setSelectedPartners((previousPartners) =>
				previousPartners.includes(partnerId)
					? previousPartners.filter((item) => item !== partnerId)
					: [...previousPartners, partnerId],
			);
		} else {
			setSelectedPartners((previousPartners) =>
				previousPartners.includes(partnerId) ? [] : [partnerId],
			);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id="partner-search"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[250px] justify-between"
				>
					{selectedPartners.length === 0
						? "Sélectionnez un partenaire..."
						: selectedPartners.length === 1
							? partners.find((partner) => partner.id === selectedPartners[0])
									?.name
							: `${selectedPartners.length} partenaires sélectionnés`}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command shouldFilter={false}>
					<CommandInput
						value={inputValue}
						onValueChange={setInputValue}
						placeholder="Rechercher un partenaire..."
					/>
					<CommandList>
						<CommandEmpty className="py-6 px-3 text-center text-sm">
							{emptyLabel}
						</CommandEmpty>
						{partners.map((partner) => (
							<CommandItem
								key={partner.id}
								value={`partner-${partner.id}`}
								onSelect={(currentValue) => {
									const partnerId = Number(
										currentValue.replace("partner-", ""),
									);
									toggleSelection(partnerId);
									if (!multiSelect) {
										setOpen(false);
									}
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										selectedPartners.includes(partner.id)
											? "opacity-100"
											: "opacity-0",
									)}
								/>
								{partner.name}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default PartnerSelect;
