import {SlSelectEvent} from "@shoelace-style/shoelace";

/**
 * Decouples the chart component from the components changing its values, by
 * converting and re-raises the relevant events.
 */
export class DataEventMediator extends HTMLElement {
    private chartTypePurpose: string = 'chartType';

    private chartTypeMediator = (event: Event) => {
        const selectEvent = (event as SlSelectEvent);

        const purpose = ((selectEvent.target as HTMLElement)
            .closest("[data-purpose]") as HTMLElement)
            ?.dataset.purpose;
        const selectedItem = selectEvent.detail.item.value;

        if (purpose === this.chartTypePurpose) {
            console.debug(`Raised new chart type changed event with value '${selectedItem}'`);
            const event: DataChartTypeChangedEvent = new CustomEvent('data-chartType-changed', {
                bubbles: true,
                detail: { chartType: selectedItem }
            });
            document.dispatchEvent(event);
        }
    };

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.chartTypePurpose = this.getAttribute('chartTypePurpose') ?? this.chartTypePurpose;
        document.addEventListener('sl-select', this.chartTypeMediator);
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        document.removeEventListener('sl-select', this.chartTypeMediator);
    }
}

export type DataChartTypeChangedEvent = CustomEvent<{ chartType: string }>;

export function registerDataEventMediator(): void {
    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
}