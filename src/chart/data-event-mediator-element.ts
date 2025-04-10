import {DataHistoryManager} from "./data-history-manager-element.ts";
import {customElement, property} from "lit/decorators.js";
import {LitElement} from "lit";
import {parseStringArray} from "../component-utils/property-converters.ts";

/**
 * Decouples the chart component from the components changing its values, by
 * converting and re-raises the relevant events.
 *
 * @listens change - from a select with purpose=chartType (depending on chartTypeEvent)
 * @listens sl-select - from a Shoelace dropdown with purpose=chartType (depending on chartTypeEvent)
 * @property {string[]} watchedEvents - a comma-separated list of event names to watch for
 * @property {string[]} purposes - a comma-separated list of "data-purpose" values that should be on the elements raising these events
 */
@customElement('data-event-mediator')
export class DataEventMediator extends LitElement {

    @property({converter: parseStringArray})
    private watchedEvents: string[] = ['sl-select', 'sl-change', 'change'];

    @property({converter: parseStringArray})
    private purposes: string[] = ['chartType'];

    private historyManager? : DataHistoryManager;

    private changeMediator = (event: Event) => {
        const purpose = ((event.target as HTMLElement)
            .closest("[data-purpose]") as HTMLElement)
            ?.dataset.purpose;
        if (purpose && this.purposes.includes(purpose)) {
            const selectedItem =
                (event as LocalSlSelectEvent).detail?.item?.value ??
                Array.from((event.target as HTMLSelectElement).selectedOptions).map(option => option.value);

            if (this.historyManager) {
                this.historyManager.updateHash({[purpose]: selectedItem});
            }

            console.debug(`Raised new ${purpose} changed event with value '${selectedItem}'`);
            const newEvent: DataChangedEvent = new CustomEvent(`data-${purpose}-changed`, {
                bubbles: true,
                detail: { fieldChanged: purpose, newValue: selectedItem }
            });
            document.dispatchEvent(newEvent);
        }
    };

    connectedCallback() {
        this.historyManager = this.querySelector('data-history-manager') as DataHistoryManager;
        this.watchedEvents.forEach(name => document.addEventListener(name, this.changeMediator));
    }

    disconnectedCallback() {
        this.watchedEvents.forEach(name => document.removeEventListener(name, this.changeMediator));
    }
}

interface LocalSlSelectEvent extends Event {
    detail: { item: { value: string } };
}

export type DataChangedEvent = CustomEvent<{ fieldChanged: string, newValue: string }>;