/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				netflix: {
					black: "#141414",
					"dark-bg": "#1f1f1f",
					"card-bg": "#181818",
					red: "#E50914",
					gray: "#b3b3b3",
					"gray-dark": "#808080",
				},
			},
			fontSize: {
				hero: ["4rem", { lineHeight: "1.1" }],
				title: ["2.5rem", { lineHeight: "1.2" }],
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-in",
				glow: "glow 2s ease-in-out infinite",
				"slide-up": "slideUp 0.4s ease-out",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				glow: {
					"0%, 100%": { boxShadow: "0 0 5px rgba(229, 9, 20, 0.3)" },
					"50%": { boxShadow: "0 0 20px rgba(229, 9, 20, 0.8)" },
				},
				slideUp: {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};
