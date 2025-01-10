import useWebSocket from "react-use-websocket";
import { toast } from "sonner";

export default function Webhook() {
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
		<>
			<h1 className="text-2xl font-bold mb-4">Être notifié via Webhook</h1>
		</>
	);
}
