import { createApp } from 'vue';
import App from './App.vue';
import AppLoading from './components/common/app-loading.vue';
import { setupDirectives } from './directives';
import { setupRouter } from './router';
import { setupAssets } from './plugins';
import { setupStore } from './store';
import { setupI18n } from './locales';
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
async function setupApp() {
  // import assets: js、css
  setupAssets();
  // app loading
  const appLoading = createApp(AppLoading);

  appLoading.mount('#appLoading');

  const app = createApp(App);
  // store plugin: pinia
  setupStore(app);

  // vue custom directives
  setupDirectives(app);

  // vue router
  await setupRouter(app);

  setupI18n(app);

  appLoading.unmount();

  // mount app
  app.mount('#app');
}

setupApp();
