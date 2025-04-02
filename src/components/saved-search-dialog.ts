import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface SavedSearch {
  id: string;
  title: string;
  query: string;
  timestamp: number;
}

@customElement('saved-search-dialog')
export class SavedSearchDialog extends LitElement {
  @state()
  private searches: SavedSearch[] = [];

  private storageKey = 'saved-searches';

  connectedCallback() {
    super.connectedCallback();
    this.loadSearches();
  }

  /** Overriding this to disable the shadow root, so Tailwind classes work */
  createRenderRoot() { return this; }

  private loadSearches() {
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      try {
        this.searches = JSON.parse(savedData);
        this.searches.sort((a, b) => b.timestamp - a.timestamp);
      } catch (e) {
        console.error('Failed to parse saved searches', e);
        this.searches = [];
      }
    }
  }

  private saveSearches() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.searches));
  }

  // @todo Remove this once there's an actual way to add searches
  setupDefaultSearches() {
    if (this.searches.length === 0) {
      this.addSearch('All', '?something');
      this.addSearch('My files', '?other');
    }
  }

  addSearch(title: string, query: string) {
    const newSearch: SavedSearch = { id: crypto.randomUUID(), title, query, timestamp: Date.now() };
    
    this.searches = [...this.searches, newSearch];
    this.saveSearches();
    this.requestUpdate();
  }

  removeSearch(id: string) {
    this.searches = this.searches.filter(search => search.id !== id);
    this.saveSearches();
    this.requestUpdate();
    
    this.dispatchEvent(new CustomEvent('search-deleted', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }

  show() { this.getDialog().show() }
  showModal() { this.getDialog().showModal() }
  close() { this.getDialog().close() }

  private getDialog = () => this.querySelector('dialog') as HTMLDialogElement;

  render() {
    return html`
      <dialog class="modal backdrop:backdrop-blur-sm">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <h2 class="font-bold mb-2">Saved searches</h2>
          
          ${this.searches.length === 0 
            ? html`<p>No saved searches yet.</p>`
            : html`
              <ul class="list-disc list-outside ml-4">
                ${this.searches.map(search => html`
                  <li>
                    <div class="flex justify-between items-center">
                      <a class="link link-primary link-hover" href="${search.query}">${search.title}</a>
                      <sl-icon-button name="trash3" @click=${() => this.removeSearch(search.id)}></sl-icon-button>
                    </div>
                  </li>
                `)}
              </ul>
            `}
        </div>
        
        <!-- Covers the background, so click on background closes -->
        <form method="dialog" class="modal-backdrop"><button>Close</button></form>
      </dialog>
    `;
  }
}