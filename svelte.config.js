import preprocess from 'svelte-preprocess';
import { resolve } from 'path';
//import adapter from '@sveltejs/adapter-auto'
// import adapter from '@sveltejs/adapter-vercel'
import adapter from '@sveltejs/adapter-static';

let routeFolder = 'admin';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		prerender: { default: true },
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		files: {
			routes: `src/routes/${routeFolder}`
		},

		vite: {
			resolve: {
				alias: {
					$src: resolve('./src'),
					$lib: resolve('./src/lib'),
					$stores: resolve('./src/stores'),
					$assets: resolve('./src/assets'),
					$icon: resolve('./node_modules/svelte-bootstrap-icons/lib')
				}
			},
			server: {
				fs: {
					// Allow serving files from one level up to the project root (needed for local modules in packages)
					allow: ['..']
				}
			}
		}
	}
};

export default config;
