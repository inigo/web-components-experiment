import './style.css'
import {initCookieConsent} from "./cookieconsent/cookieconsent.ts";

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import {setupCssActions} from "./actions/actions.ts";
import {initSelectors} from "./select/select.ts";

import './savedsearch/saved-search-dialog';
import "./chart/chart.ts";
import {SlSelectEvent} from "@shoelace-style/shoelace";
import {DataChartTypeChangedEvent} from "./chart/chart-events.ts";

const isDev = import.meta.env.DEV;
setBasePath(isDev ? '/dist/' : '.');

initCookieConsent();
setupCssActions();
initSelectors();

// @todo Move this to the data-event-mediator
document.addEventListener('sl-select', (event: Event) => {
    const selectEvent = (event as SlSelectEvent);

    const purpose = ((selectEvent.target as HTMLElement)
        .closest("[data-purpose]") as HTMLElement)
        .dataset.purpose;
    const selectedItem = selectEvent.detail.item.value;

    if (purpose==="chartType") {
        console.debug(`Launched new event`);

        const event: DataChartTypeChangedEvent = new CustomEvent('data-chartType-changed', {
            bubbles: true,
            detail: { chartType: selectedItem }
        });
        document.dispatchEvent(event);
    }
})

