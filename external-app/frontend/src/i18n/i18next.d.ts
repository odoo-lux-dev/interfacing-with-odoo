import "i18next";
import { resources, defaultNS } from "./index.ts";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNS;
		resources: (typeof resources)["en"];
	}
}
