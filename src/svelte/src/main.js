import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'Goths as a service!'
	}
});

export default app;