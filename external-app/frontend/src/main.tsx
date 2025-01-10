import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/home";
import JSONPage from "@/pages/json";
import Webhook from "@/pages/webhook";
import JSONRpc from "@/pages/json-rpc";
import Layout from "@/components/layout";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route
					index
					element={
						<Layout>
							<Home />
						</Layout>
					}
				/>
				<Route
					path="json"
					element={
						<Layout>
							<JSONPage />
						</Layout>
					}
				/>
				<Route
					path="json-rpc"
					element={
						<Layout>
							<JSONRpc />
						</Layout>
					}
				/>
				<Route
					path="webhook"
					element={
						<Layout>
							<Webhook />
						</Layout>
					}
				/>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
