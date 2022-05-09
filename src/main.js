import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementPlus from 'element-plus'
import * as ELIcons from '@element-plus/icons';
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App)
app.config.globalProperties.$http = axios;
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}
app.use(ElementPlus, {locale})
app.use(router)
app.mount('#app')
