import {customElement, property} from "lit/decorators.js";
import {listen} from "../component-utils/listen.ts";
import {LitElement} from "lit";
import {parseStringArray} from "../component-utils/property-converters.ts";

/**
 * Keep the browser history aligned with the current state of the data chart, by
 * reading and updating the URL hash.
 *
 * @listens hashchange
 */
@customElement('data-history-manager')
export class DataHistoryManager extends LitElement {
    @property({converter: parseStringArray})
    private purposes: string[] = ['chartType'];

    protected firstUpdated() {
        requestAnimationFrame(() => this.handleHashChange());
    }

    /** Update the hash if it has changed, adding to the browser history */
    updateHash(newValues: Record<string, string>): void {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        hash.sort();
        const originalHashString = hash.toString().replace(/%2C/g, ',');

        Object.entries(newValues).forEach(([key, value]) => {
            (value && (value?.length ?? 1 > 0)) ? hash.set(key, value) : hash.delete(key)
        });
        hash.sort();
        const newHashString = hash.toString().replace(/%2C/g, ',');

        console.debug(`New hash is ${newHashString} compared to original ${originalHashString}`);
        if (newHashString !== originalHashString) {
            history.pushState(null, '', `#${newHashString}`);
        }
    }

    @listen("hashchange", {attachTo: "window"})
    handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        const params = this.parseHashParams(hash);

        this.purposes.forEach(purpose => {
            const key = purpose;
            const value = params[purpose];

            const el = document.querySelector(`[data-purpose=${key}]`);
            if (!el) return;

            const selectElement = el as HTMLSelectElement;
            console.debug(`Because of hash change, setting ${key} to ${value}`);

            if (selectElement.multiple) {
                const valuesToSelect = value ? value.split(',').map(v => v.trim()).sort() : [];

                if (selectElement.tagName.toLowerCase() === 'sl-select') {
                    const slElement = el as unknown as { value: string[] };
                    const existingValues = slElement.value.sort();
                    if (valuesToSelect.join(',') !== existingValues.join(',')) {
                        slElement.value = valuesToSelect;
                    }
                } else {
                    const existingValues = Array.from(selectElement.selectedOptions).map(option => option.value).sort();
                    if (valuesToSelect.join(',') !== existingValues.join(',')) {
                        Array.from(selectElement.options).forEach(option => {
                            option.selected = valuesToSelect.includes(option.value);
                        });
                    }
                }
            } else {
                if (selectElement.value !== value) {
                    if (value) selectElement.value = value;
                }
            }

            selectElement.dispatchEvent(new Event('change', {bubbles: true}));
        });
    }

    private parseHashParams(hash: string): Record<string, string> {
        if (!hash) return {};

        const searchParams = new URLSearchParams(hash);
        const result: Record<string, string> = {};
        searchParams.forEach((value, key) => result[key] = value);

        return result;
    }
}