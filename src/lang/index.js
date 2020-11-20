import Vue from 'vue';
import VueI18n from 'vue-i18n';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';// element-ui lang
import elementThLocale from 'element-ui/lib/locale/lang/th';// element-ui lang
import enLocale from './en';
import zhLocale from './zh';
import thLocale from './th';

Vue.use(VueI18n);

const messages = {
    en:{
        ...enLocale,
        ...elementEnLocale
    },
    zh:{
        ...zhLocale,
        ...elementZhLocale
    },
    th:{
        ...thLocale,
        ...elementThLocale
    }
}

export function getLanguage() {
    const chooseLanguage = localStorage.getItem('language');
    if(chooseLanguage) return chooseLanguage;
    // 获取设备的语言 
    const language = (navigator.language||navigator.browserLanguage).toLowerCase();
    // 返回一个对象属性数组
    const locales = Object.keys(messages);
    // 遍历locales数组
    for(const locale of locales ){
        // 判断是否存在locale在language里面的某一个位置
        if(language.indexOf(locale)>-1){
            return locale
        }
    }
    return 'en';
}

const i18n = new VueI18n({
    // 设置语言
    locale:getLanguage(),
    // 语言包的信息
    messages
})

export default i18n;