/**
 * A web component, using a custom element - defined to prevent the IDE thinking
 * that the lifecycle methods are unused.
 */
export interface WebComponentElement extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
}