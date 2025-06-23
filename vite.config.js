import { defineConfig, loadEnv } from 'vite'; // 1. Importado 'loadEnv'
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// 2. A exportação foi convertida para uma função para acessar o 'mode'
export default defineConfig(({ mode }) => {
  // 3. Carrega as variáveis de ambiente do seu arquivo .env
  const env = loadEnv(mode, process.cwd(), '');

  // Cria um objeto que será usado pela opção 'define'
  // para substituir 'process.env.VITE_...' pelos valores corretos
  const processEnv = {};
  for (const key in env) {
    if (key.startsWith('VITE_')) {
      processEnv[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  }

  // Retorna a sua configuração, agora com a propriedade 'define'
  return {
    root: resolve(__dirname, '.'),
    base: '/',
    plugins: [react()],
    resolve: {
      alias: { '@': resolve(__dirname, './src') },
    },
    // 4. Propriedade 'define' adicionada para fazer a substituição
    define: processEnv,
    server: {
      port: 5173,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});