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

    handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        const params = this.parseHashParams(hash);

        if (params.chartType) {
            const el = document.querySelector(`[data-purpose="${this.chartTypePurpose}"]`);
            const selectElement = el as HTMLSelectElement;
            if (selectElement && selectElement.value !== params.chartType) {
                console.debug(`Because of hash change, setting chart type to ${params.chartType}`);
                selectElement.value = params.chartType;
                selectElement.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }
    }

    private parseHashParams(hash: string): Record<string, string> {
        if (!hash) return {};

        const searchParams = new URLSearchParams(hash);
        const result: Record<string, string> = {};
        searchParams.forEach((value, key) => result[key] = value );

        return result;
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.chartTypePurpose = this.getAttribute('chartTypePurpose') ?? this.chartTypePurpose;
        this.chartTypeEvent = this.getAttribute('chartTypeEvent') ?? this.chartTypeEvent;

        document.addEventListener(this.chartTypeEvent, this.chartTypeMediator);
        window.addEventListener('hashchange', this.handleHashChange);
        requestAnimationFrame(() => this.handleHashChange());
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        document.removeEventListener(this.chartTypeEvent, this.chartTypeMediator);
        document.removeEventListener('hashchange', this.handleHashChange);
    }
}

export type DataChartTypeChangedEvent = CustomEvent<{ chartType: string }>;

export function registerDataEventMediator(): void {
    if (!customElements.get('data-event-mediator')) {
        customElements.define('data-event-mediator', DataEventMediator);
    }
}