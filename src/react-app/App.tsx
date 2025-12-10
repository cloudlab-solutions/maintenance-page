import { useMemo } from "react";
import "./App.css";

const translations = {
	en: {
		title: "Under Maintenance",
		message: "We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!",
		thanks: "Thank you for your patience."
	},
	es: {
		title: "En Mantenimiento",
		message: "Actualmente estamos realizando mantenimiento programado para mejorar tu experiencia. ¡Volveremos pronto!",
		thanks: "Gracias por tu paciencia."
	},
	fr: {
		title: "En Maintenance",
		message: "Nous effectuons actuellement une maintenance programmée pour améliorer votre expérience. Nous serons de retour sous peu!",
		thanks: "Merci pour votre patience."
	},
	de: {
		title: "Wartungsarbeiten",
		message: "Wir führen derzeit planmäßige Wartungsarbeiten durch, um Ihre Erfahrung zu verbessern. Wir sind bald zurück!",
		thanks: "Vielen Dank für Ihre Geduld."
	},
	ja: {
		title: "メンテナンス中",
		message: "現在、サービス向上のため定期メンテナンスを実施しております。まもなく再開いたします。",
		thanks: "ご不便をおかけして申し訳ございません。"
	},
	zh: {
		title: "维护中",
		message: "我们正在进行定期维护以改善您的体验。我们很快就会回来！",
		thanks: "感谢您的耐心等待。"
	},
	pt: {
		title: "Em Manutenção",
		message: "Estamos realizando manutenção programada para melhorar sua experiência. Voltaremos em breve!",
		thanks: "Obrigado pela sua paciência."
	},
	ru: {
		title: "Технические работы",
		message: "В настоящее время проводятся плановые технические работы для улучшения вашего опыта. Скоро вернемся!",
		thanks: "Спасибо за ваше терпение."
	},
	ro: {
		title: "În Mentenanță",
		message: "În prezent efectuăm lucrări de mentenanță programate pentru a îmbunătăți experiența dumneavoastră. Revenim în curând!",
		thanks: "Vă mulțumim pentru răbdare."
	}
};

function App() {
	const t = useMemo(() => {
		const userLang = navigator.language.split('-')[0];
		return translations[userLang as keyof typeof translations] || translations.en;
	}, []);

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			textAlign: 'center',
			padding: '2rem'
		}}>
			<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
				🔧
			</div>
			<h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
				{t.title}
			</h1>
			<p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px' }}>
				{t.message}
			</p>
			<p style={{ fontSize: '0.9rem', color: '#666', marginTop: '2rem' }}>
				{t.thanks}
			</p>
		</div>
	);
}

export default App;
