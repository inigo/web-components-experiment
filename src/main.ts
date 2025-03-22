import './style.css'
import {initCookieConsent} from "./cookieconsent/cookieconsent.ts";

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js';
import '@shoelace-style/shoelace/dist/components/relative-time/relative-time.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import {setupCssActions} from "./cssactions/cssactions.ts";
import TomSelect from "tom-select/popular";
import "tom-select/dist/css/tom-select.default.css";

const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

initCookieConsent();
setupCssActions();

document.querySelectorAll('.slct').forEach((el)=>{
    let settings = {
        plugins: {
            remove_button:{
                title:'Remove this item',
            }
        },
        hidePlaceholder: true,
    };
    // @ts-ignore
    new TomSelect(el,settings);
});