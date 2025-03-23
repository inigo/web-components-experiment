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
import {initSelectors} from "./select/select.ts";

const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

initCookieConsent();
setupCssActions();
initSelectors();