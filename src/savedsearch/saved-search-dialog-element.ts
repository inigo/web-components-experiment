import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {defaultSearchStore, SavedSearch, SearchStore} from "./searchstore.ts";
import {DataStoreController} from "../chart/data-store-controller.ts";

@customElement('saved-search-dialog')
export class SavedSearchDialog extends LitElement {
  private storeController = new DataStoreController(this);

  @property({ type: SearchStore })
  store: SearchStore = defaultSearchStore;

  private unsubscribe = () => {};

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = this.store.subscribe((_: SavedSearch[]) => {
      // This will be triggered by the remove button, as well as other additions to the list of searches
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe();
  }

  /** Overriding this to disable the shadow root, so Tailwind classes work */
  createRenderRoot() { return this; }

  // noinspection JSUnusedGlobalSymbols
  show() { this.getDialog().show() }
  // noinspection JSUnusedGlobalSymbols
  showModal() { this.getDialog().showModal() }
  close() { this.getDialog().close() }

  private addCurrentSearch() {
    const query = this.storeController.getQuery();
    const title =  this.storeController.getData()?.title;
    if (query && title) {
      this.store.addSearch(title, query);
    } else {
      console.warn(`Could not add current search: no query or title found in store`);
    }
  }

  private getDialog = () => this.querySelector('dialog') as HTMLDialogElement;

  render() {
    return html`
      <dialog class="modal backdrop:backdrop-blur-sm">
        <div class="modal-box flex flex-col gap-4">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <h2 class="font-bold mb-2">Saved searches</h2>
          
          ${this.store.getSearches().length === 0 
            ? html`<p>No saved searches yet.</p>`
            : html`
              <ul class="list-disc list-outside ml-4">
                ${this.store.getSearches().map(search => html`
                  <li>
                    <div class="flex justify-between items-center">
                      <a class="link link-primary link-hover" @click="${this.close}" href="${search.query}">${search.title}</a>
                      <sl-icon-button name="trash3" @click=${() => this.store.removeSearch(search.id)}></sl-icon-button>
                    </div>
                  </li>
                `)}
              </ul>
            `}
          
          <div>
            <button class="btn btn-primary" @click=${() => this.addCurrentSearch() }>Add current search</button>
          </div>
        </div>
        
        <!-- Covers the background, so click on background closes -->
        <form method="dialog" class="modal-backdrop"><button>Close</button></form>
      </dialog>
    `;
  }
}