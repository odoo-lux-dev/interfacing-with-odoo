export default function Home() {
	return (
		<>
			<h1 className="text-2xl font-bold mb-4">S'interfacer avec Odoo</h1>
			<p>
				Ce site a pour but de montrer différentes façons de s'interfacer avec
				Odoo. Actuellement, trois méthodes principales sont présentées :
			</p>

			<h2 className="text-xl font-semibold mt-4">Lecture de la route /json</h2>
			<p>
				Cette méthode permet de lire les données disponibles sur la route{" "}
				<code>/json</code>, disponible depuis la version 18 d'Odoo. Cette
				méthode permet uniquement des flux de lecture.
			</p>

			<h2 className="text-xl font-semibold mt-4">Utilisation du JSON-RPC</h2>
			<p>
				Le JSON-RPC est une méthode flexible permettant diverses opérations
				comme la lecture, la recherche, la création, la mise à jour... mais
				également l'envoi de mails par exemple. C'est une interface puissante
				permettant d'intéragir avec la majorité des fonctionnalités d'Odoo.
			</p>

			<h2 className="text-xl font-semibold mt-4">Webhook</h2>
			<p>
				Les webhooks permettent à Odoo d'envoyer des notifications à votre
				application quand certains événements se produisent, comme la création
				d'un "croissantage". Ça permet de garder votre application à jour en
				temps réel.
			</p>
		</>
	);
}
