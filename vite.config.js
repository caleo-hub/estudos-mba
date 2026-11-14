import {defineConfig} from 'vite';
export default defineConfig({base:process.env.VITE_GITHUB_PAGES==='true'?(process.env.PAGES_BASE_PATH||'/estudos-mba/'):'/'});
