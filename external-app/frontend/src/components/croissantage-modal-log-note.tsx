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
import type { Croissantage } from "@/types.ts";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postLogNote } from "@/lib/odoo.ts";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import DataCollapsible from "@/components/data-viewer-collapsible.tsx";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai/index";
import { presentationModeAtom } from "@/store/options-store.ts";

interface CroissantageModalLogNoteProps {
	children: ReactNode;
	croissantage: Croissantage;
}

const CroissantageModalLogNote: FC<CroissantageModalLogNoteProps> = ({
	children,
	croissantage,
}) => {
	const [logNoteMessage, setLogNoteMessage] = useState("");
	const { t } = useTranslation();
	const [presentationMode] = useAtom(presentationModeAtom);

	const croissantageLogNoteMutation = useMutation({
		mutationFn: postLogNote,
		onSuccess: () => {
			toast.success(t("LOG_NOTE_SUCCESSFULLY_SENT", { ns: "croissantage" }));
		},
	});

	const handleLogNoteCroissantage = async () => {
		croissantageLogNoteMutation.mutate({
			id: croissantage.id,
			body: logNoteMessage,
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="min-w-[80%]">
				<DialogHeader>
					<DialogTitle>
						{t("POST_LOG_NOTE_MODAL_TITLE", {
							ns: "croissantage",
							name: croissantage.name,
						})}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{t("POST_LOG_NOTE_MODAL_DESCRIPTION", {
						ns: "croissantage",
						name: croissantage.name,
					})}
				</DialogDescription>
				<Textarea
					placeholder={t("POST_LOG_NOTE_PLACEHOLDER", { ns: "croissantage" })}
					value={logNoteMessage}
					onChange={(e) => setLogNoteMessage(e.target.value)}
				/>
				<DialogFooter>
					<Button onClick={handleLogNoteCroissantage}>{t("SEND_LABEL")}</Button>
				</DialogFooter>
				{!presentationMode ? (
					<>
						<Separator className="my-5" />
						<DataCollapsible title={t("RPC_CALL_DETAILS_LABEL")}>
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
	[[${croissantage.id}]], // ID Record
	messageValues
)
`}
								</code>
							</pre>
						</DataCollapsible>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default CroissantageModalLogNote;
