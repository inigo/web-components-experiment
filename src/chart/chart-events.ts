import {SlSelectEvent} from "@shoelace-style/shoelace";

export type DataChartTypeChangedEvent = CustomEvent<{ chartType: string }>;

export class DataEventMediator extends HTMLElement {
    constructor() {
        super();

        document.addEventListener('sl-select', (event: Event) => {
            const selectEvent = (event as SlSelectEvent);

            const purpose = ((selectEvent.target as HTMLElement)
                .closest("[data-purpose]") as HTMLElement)
                ?.dataset.purpose;
            const selectedItem = selectEvent.detail.item.value;

            if (purpose === "chartType") {
                console.debug(`Launched new event`);

                const event: DataChartTypeChangedEvent = new CustomEvent('data-chartType-changed', {
                    bubbles: true,
                    detail: { chartType: selectedItem }
                });
                document.dispatchEvent(event);
            }
        });
    }
}

export function registerDataEventMediator(): void {
    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
}