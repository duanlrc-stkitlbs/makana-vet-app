/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				clinical: {
					50: '#f0fdf9',
					100: '#ccfbe8',
					200: '#99f6d4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
					800: '#115e59',
					900: '#134e4a',
					950: '#042f2c'
				},
				surface: {
					50: '#fafbfd',
					100: '#f4f6fb',
					200: '#e8edf5',
					300: '#d5dfed',
					800: '#1e293b',
					900: '#0f172a',
					950: '#090d16'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'sans-serif'
				],
				mono: [
					'"JetBrains Mono"',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'monospace'
				]
			},
			boxShadow: {
				'clinical-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
				'clinical-md': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
				'clinical-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
				'glow': '0 0 25px -5px rgba(20, 184, 166, 0.25)'
			}
		}
	},
	plugins: []
};
