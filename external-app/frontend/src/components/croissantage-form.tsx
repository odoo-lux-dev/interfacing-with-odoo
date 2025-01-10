import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { Label } from "@/components/ui/label.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command.tsx";
import { cn } from "@/lib/utils.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { useState } from "react";
import { useDebounce } from "react-use";

interface ICroissantageFormProps {
	debouncedInputValue: string;
	selectedPartner: number | null;
	setSelectedPartner: (partner: number | null) => void;
	partners: { id: number; name: string }[];
	setDebouncedInputValue: (value: string) => void;
	statuses: { state: { selection: string[][] } };
	setSelectedStatus: (status: string) => void;
	onSubmit: () => void;
	isFetchingPartners: boolean;
}

const CroissantageForm: FC<ICroissantageFormProps> = ({
	debouncedInputValue,
	selectedPartner,
	setSelectedPartner,
	partners,
	setDebouncedInputValue,
	setSelectedStatus,
	statuses,
	onSubmit,
	isFetchingPartners,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);
	const emptyLabel =
		debouncedInputValue === "" || isFetchingPartners
			? "Entrez votre recherche"
			: `Aucun partenaire trouvé pour "${debouncedInputValue}"`;

	const mappedStatuses = statuses.state.selection.map(([id, name]) => ({
		id,
		name,
	}));

	useDebounce(
		() => {
			setDebouncedInputValue(inputValue);
		},
		500,
		[inputValue],
	);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="partner-search" className="mr-3">
					Croissanté
				</Label>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id="partner-search"
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-[250px] justify-between"
						>
							{selectedPartner
								? partners.find((partner) => partner.id === selectedPartner)
										?.name
								: "Sélectionnez un partenaire..."}
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
											setSelectedPartner(
												partnerId === selectedPartner ? null : partnerId,
											);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												selectedPartner === partner.id
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
			</div>
			<div className="flex items-center gap-3">
				<Label>Statut</Label>
				<RadioGroup
					onValueChange={setSelectedStatus}
					className="flex space-x-4"
				>
					{mappedStatuses.map((s) => (
						<div key={s.id} className="flex items-center space-x-2">
							<RadioGroupItem value={s.id} id={s.id} />
							<Label htmlFor={s.id}>{s.name}</Label>
						</div>
					))}
				</RadioGroup>
			</div>

			<Button onClick={onSubmit}>Créer</Button>
		</div>
	);
};

export default CroissantageForm;
