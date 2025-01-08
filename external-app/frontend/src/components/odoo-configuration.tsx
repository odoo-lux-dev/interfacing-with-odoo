import type { FC, ReactNode } from "react";
import { useAtom } from "jotai";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { odooConfigurationAtom } from "@/store/credentials-store.ts";

interface OdooConfigurationProps {
	children: ReactNode;
}

const OdooConfiguration: FC<OdooConfigurationProps> = ({ children }) => {
	const [odooConfig, setOdooConfig] = useAtom(odooConfigurationAtom);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Configuration d'Odoo</DialogTitle>
					<DialogDescription>
						Mettez à jour les informations pour intéragir avec votre DB Odoo
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<p>Informations DB</p>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="url" className="text-right">
							URL
						</Label>
						<Input
							id="url"
							placeholder="http://localhost:8069"
							className="col-span-3"
							value={odooConfig.url}
							onChange={(e) =>
								setOdooConfig({ ...odooConfig, url: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="port" className="text-right">
							Port
						</Label>
						<Input
							id="port"
							type="number"
							value={odooConfig.port}
							placeholder="8069"
							className="col-span-3"
							onChange={(e) =>
								setOdooConfig({ ...odooConfig, port: Number(e.target.value) })
							}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Nom
						</Label>
						<Input
							id="name"
							placeholder="ma-database-odoo"
							className="col-span-3"
							value={odooConfig.name}
							onChange={(e) =>
								setOdooConfig({ ...odooConfig, name: e.target.value })
							}
						/>
					</div>
					<Separator />
					<p>Informations de connexion</p>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right">
							Utilisateur
						</Label>
						<Input
							id="username"
							placeholder="user@mail.com"
							className="col-span-3"
							value={odooConfig.username}
							onChange={(e) =>
								setOdooConfig({ ...odooConfig, username: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="api-key" className="text-right">
							Clé API
						</Label>
						<Input
							id="api-key"
							placeholder="f15ger1ezc8eg1ez5v8"
							className="col-span-3"
							value={odooConfig.apiKey}
							onChange={(e) =>
								setOdooConfig({ ...odooConfig, apiKey: e.target.value })
							}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default OdooConfiguration;
