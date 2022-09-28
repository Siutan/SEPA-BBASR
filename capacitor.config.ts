import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.sepa.prototype',
	appName: 'Sepa Prototype',
	webDir: 'build',
	bundledWebRuntime: false,
	server: {
		hostname: 'localhost:3000'
	}
};

export default config;
