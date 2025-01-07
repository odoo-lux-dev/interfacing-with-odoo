import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/home.tsx";
import JSONPage from "@/pages/json.tsx";
import Webhook from "@/pages/webhook.tsx";
import JSONRpc from "@/pages/json-rpc.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={<Home />} />
				<Route path="json" element={<JSONPage />} />
				<Route path="json-rpc" element={<JSONRpc />} />
				<Route path="webhook" element={<Webhook />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
