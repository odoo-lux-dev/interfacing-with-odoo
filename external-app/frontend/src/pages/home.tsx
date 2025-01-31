import { useAtom } from "jotai/index";
import { presentationModeAtom } from "@/store/options-store.ts";
import { useTranslation } from "react-i18next";

export default function Home() {
	const [presentationMode] = useAtom(presentationModeAtom);
	const { t } = useTranslation();

	if (!presentationMode) {
		return (
			<>
				<h1 className="text-2xl font-bold mb-4">
					{t("HOME_PAGE_TITLE", { ns: "pages" })}
				</h1>
				<p>{t("HOME_PAGE_SUBTITLE", { ns: "pages" })}</p>

				<h2 className="text-xl font-semibold mt-4">
					{t("HOME_PAGE_SUBPART_ONE_TITLE", { ns: "pages" })}
				</h2>
				<p>{t("HOME_PAGE_SUBPART_ONE_CONTENT", { ns: "pages" })}</p>

				<h2 className="text-xl font-semibold mt-4">
					{t("HOME_PAGE_SUBPART_TWO_TITLE", { ns: "pages" })}
				</h2>
				<p>{t("HOME_PAGE_SUBPART_TWO_CONTENT", { ns: "pages" })}</p>

				<h2 className="text-xl font-semibold mt-4">
					{t("HOME_PAGE_SUBPART_THREE_TITLE", { ns: "pages" })}
				</h2>
				<p>{t("HOME_PAGE_SUBPART_THREE_CONTENT", { ns: "pages" })}</p>
			</>
		);
	}

	return null;
}
