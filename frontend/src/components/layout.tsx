import Header from "./header";
import { Toaster } from "@/components/ui/sonner";
import type { FC, ReactNode } from "react";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { Provider } from "jotai";
import { store } from "@/store";

interface LayoutProps {
	children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	useWebSocket(import.meta.env.VITE_WEBSOCKET_URL, {
		onMessage: (message) => {
			toast.info("Mise à jour Odoo", {
				description: message.data,
				action: {
					label: "Recharger",
					onClick: () => window.location.reload(),
				},
			});
		},
	});

	return (
		<Provider store={store}>
			<div className="flex flex-col min-h-screen min-w-screen">
				<Header />
				<main className="flex-1 p-8">{children}</main>
				<Toaster />
			</div>
		</Provider>
	);
};

export default Layout;
