import type { FC, ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Croissantage } from "@/types.ts";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getOdooJSONRpcClient } from "@/lib/odoo.ts";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";

interface CroissantageModalLogNoteProps {
	children: ReactNode;
	croissantage: Croissantage;
}

const CroissantageModalLogNote: FC<CroissantageModalLogNoteProps> = ({
	children,
	croissantage,
}) => {
	const [logNoteMessage, setLogNoteMessage] = useState("");

	const croissantageLogNoteMutation = useMutation({
		mutationFn: async (croissantageValues: {
			id: number;
			options: any;
		}) => {
			const odooRpcClient = await getOdooJSONRpcClient();
			// call_kw is a wrapper of Odoo's execute_kw
			// It prevents to pass redundant parameters for each call : db, uid, password
			return odooRpcClient.call_kw(
				"croissantage",
				"message_post",
				[[croissantageValues.id]],
				croissantageValues.options,
			);
		},
		onSuccess: () => {
			toast.success("Log note postée avec succès");
		},
	});

	const handleLogNoteCroissantage = async () => {
		const croissantageValues = {
			body: logNoteMessage,
			message_type: "comment",
		};
		croissantageLogNoteMutation.mutate({
			id: croissantage.id,
			options: croissantageValues,
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="min-w-[80%]">
				<DialogHeader>
					<DialogTitle>
						Poster une log note sur "{croissantage.name}"
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Ceci va poster une log note sur le croissantage "{croissantage.name}".
				</DialogDescription>
				<Textarea
					placeholder="Entrez le message à rajouter au chatter du record"
					value={logNoteMessage}
					onChange={(e) => setLogNoteMessage(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleLogNoteCroissantage}>Envoyer</Button>
				</DialogFooter>
				<Separator className="my-5" />
				<DataCollapsible title="Détail du call RPC">
					<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
						<code>
							{`const messageValues = ${JSON.stringify(
								{
									body: logNoteMessage,
									message_type: "comment",
								},
								null,
								2,
							)}

odooJSONRpcClient.call_kw("croissantage", "message_post", 
	[[${croissantage.id}]], // ID du record
	messageValues // Dict. avec les données à utiliser
)
`}
						</code>
					</pre>
				</DataCollapsible>
			</DialogContent>
		</Dialog>
	);
};

export default CroissantageModalLogNote;
