import {WebComponentElement} from "./web-component-interface.ts";
import {DataHistoryManager} from "./data-history-manager-element.ts";
import {customElement} from "lit/decorators.js";

/**
 * Decouples the chart component from the components changing its values, by
 * converting and re-raises the relevant events.
 *
 * @listens change - from a select with purpose=chartType (depending on chartTypeEvent)
 * @listens sl-select - from a Shoelace dropdown with purpose=chartType (depending on chartTypeEvent)
 */
@customElement('data-event-mediator')
export class DataEventMediator extends HTMLElement implements WebComponentElement {
    private chartTypeEvent: string = 'sl-select';
    private historyManager? : DataHistoryManager;

    private chartTypeMediator = (event: Event) => {
        const purpose = ((event.target as HTMLElement)
            .closest("[data-purpose]") as HTMLElement)
            ?.dataset.purpose;
        if (purpose === "chartType") {
            const selectedItem =
                (event as LocalSlSelectEvent).detail?.item?.value ??
                (event.target as HTMLSelectElement).value;

            if (this.historyManager) {
                this.historyManager.updateHash({chartType: selectedItem});
            }

            console.debug(`Raised new chart type changed event with value '${selectedItem}'`);
            const newEvent: DataChartTypeChangedEvent = new CustomEvent('data-chartType-changed', {
                bubbles: true,
                detail: { chartType: selectedItem }
            });
            document.dispatchEvent(newEvent);
        }
    };

    connectedCallback() {
        this.chartTypeEvent = this.getAttribute('chartTypeEvent') ?? this.chartTypeEvent;
        this.historyManager = this.querySelector('data-history-manager') as DataHistoryManager;

        document.addEventListener(this.chartTypeEvent, this.chartTypeMediator);
    }

    disconnectedCallback() {
        document.removeEventListener(this.chartTypeEvent, this.chartTypeMediator);
    }
}

interface LocalSlSelectEvent extends Event {
    detail: { item: { value: string } };
}


export type DataChartTypeChangedEvent = CustomEvent<{ chartType: string }>;