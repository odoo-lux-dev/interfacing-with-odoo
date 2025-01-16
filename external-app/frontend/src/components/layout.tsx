import Header from "./header";
import { Toaster } from "@/components/ui/sonner";
import type { FC, ReactNode } from "react";
import { Provider } from "jotai";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface LayoutProps {
	children: ReactNode;
}

const queryClient = new QueryClient();
const Layout: FC<LayoutProps> = ({ children }) => {
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
