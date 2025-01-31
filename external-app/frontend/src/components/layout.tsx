import Header from "./header";
import { Toaster } from "@/components/ui/sonner";
import type { FC, ReactNode } from "react";
import { Provider } from "jotai";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";
import { WebhookReceivedMessage } from "@/types.ts";
import { toast } from "sonner";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";
import { useAtom } from "jotai/index";
import { presentationModeAtom } from "@/store/options-store.ts";
import { useTranslation } from "react-i18next";

interface LayoutProps {
	children: ReactNode;
}

const queryClient = new QueryClient();
const Layout: FC<LayoutProps> = ({ children }) => {
	const [presentationMode] = useAtom(presentationModeAtom);
	const { t } = useTranslation();
	useWebSocket(
		import.meta.env.VITE_WEBSOCKET_URL,
		{
			onMessage: (message) => {
				const parsedMessage = JSON.parse(
					message.data,
				) as WebhookReceivedMessage;
				const odooConfiguration = store.get(odooConfigurationAtom);

				toast.info(t("NEW_CROISSANTAGE_TOAST_TITLE", { ns: "croissantage" }), {
					description: t("NEW_CROISSANTAGE_TOAST_DESCRIPTION", {
						ns: "croissantage",
						id: parsedMessage.id,
						name: parsedMessage.name,
					}),
					action: {
						label: t("GO_TO_LABEL"),
						onClick: () => {
							window.open(
								`${odooConfiguration.url}:${odooConfiguration.port}/odoo/croissantage/${parsedMessage.id}`,
								"_blank",
							);
						},
					},
				});
			},
		},
		presentationMode,
	);

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<div className="flex flex-col min-h-screen min-w-screen">
					<Header />
					<main className="flex-1 p-8">{children}</main>
					<Toaster />
				</div>
			</QueryClientProvider>
		</Provider>
	);
};

export default Layout;
