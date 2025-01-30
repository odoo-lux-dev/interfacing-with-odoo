import type { FC, ReactNode } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DataCollapsibleProps {
	title: string;
	children: ReactNode;
}

const DataCollapsible: FC<DataCollapsibleProps> = ({ children, title }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between space-x-4 cursor-pointer select-none">
					<h3 className="text-lg font-bold">{title}</h3>
					<Button variant="ghost" size="sm">
						{isOpen ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
						<span className="sr-only">Toggle</span>
					</Button>
				</div>
			</CollapsibleTrigger>

			<CollapsibleContent>{children}</CollapsibleContent>
		</Collapsible>
	);
};

export default DataCollapsible;
