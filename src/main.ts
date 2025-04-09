import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-ext-400.css";
import "@fontsource/source-sans-3/latin-400-italic.css";
import "@fontsource/source-sans-3/latin-ext-400-italic.css";
import '@shoelace-style/shoelace/dist/themes/light.css';
import './style.css' // Needs to be after light.css for variable overrides to work without !important
import {initCookieConsent} from "./cookieconsent/cookieconsent.ts";

import 'sortable-tablesort/dist/sortable.min.js'
import 'sortable-tablesort/dist/sortable.a11y.min.js'

import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import {setupCssActions} from "./actions/actions.ts";

import './savedsearch/saved-search-dialog-element.ts';
import {registerDataChartComponents} from "./chart/register-components.ts";

const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

initCookieConsent();
setupCssActions();
registerDataChartComponents();