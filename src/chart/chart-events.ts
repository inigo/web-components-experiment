import {SlSelectEvent} from "@shoelace-style/shoelace";

/**
 * Decouples the chart component from the components changing its values, by
 * converting and re-raises the relevant events.
 */
export class DataEventMediator extends HTMLElement {
    private chartTypePurpose: string = 'chartType';
    private chartTypeEvent: string = 'sl-select';

    private chartTypeMediator = (event: Event) => {
        const purpose = ((event.target as HTMLElement)
            .closest("[data-purpose]") as HTMLElement)
            ?.dataset.purpose;
        if (purpose === this.chartTypePurpose) {
            const selectedItem =
                (event as SlSelectEvent).detail?.item?.value ??
                (event.target as HTMLSelectElement).value;

            this.updateHash({chartType: selectedItem});

            console.debug(`Raised new chart type changed event with value '${selectedItem}'`);
            const newEvent: DataChartTypeChangedEvent = new CustomEvent('data-chartType-changed', {
                bubbles: true,
                detail: { chartType: selectedItem }
            });
            document.dispatchEvent(newEvent);
        }
    };

    /** Update the hash if it has changed, adding to the browser history */
    private updateHash(newValues: Record<string, string>): void {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        hash.sort();
        const originalHashString = hash.toString();

        Object.entries(newValues).forEach(([key, value]) => hash.set(key, value));
        hash.sort();

        console.debug(`New hash is ${hash} compared to original ${originalHashString}`);
        if (hash.toString() !== originalHashString) {
            history.pushState(null, '', `#${hash}`);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.chartTypePurpose = this.getAttribute('chartTypePurpose') ?? this.chartTypePurpose;
        this.chartTypeEvent = this.getAttribute('chartTypeEvent') ?? this.chartTypeEvent;

        document.addEventListener(this.chartTypeEvent, this.chartTypeMediator);
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        document.removeEventListener(this.chartTypeEvent, this.chartTypeMediator);
    }
}

export type DataChartTypeChangedEvent = CustomEvent<{ chartType: string }>;

export function registerDataEventMediator(): void {
    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
}