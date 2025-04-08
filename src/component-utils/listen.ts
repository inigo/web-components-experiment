/**
 * Decorator factory to add an event listener to a method in a web component, registering it in connectedCallback
 * and unregistering it in disconnectedCallback. The decorated method will be called when the event is received.
 *
 * @example
 * ```typescript
 * @listen("hashChanged", "window") public hashHandler(e: Event) { ... }
 * ```
 */
export function listen(eventName: string,
                       options: ListenOptions = { attachTo: "document" },
                       listenerOptions: AddEventListenerOptions = {}): Function {
    return function(target: any, propertyKey: string) {
        // Necessary to store the handlers, because every invocation of bind() creates a new instance
        const boundHandlersMap = new WeakMap<any, EventListener>();

        const originalConnectedCallback = target.connectedCallback;
        const originalDisconnectedCallback = target.disconnectedCallback;
        const attachTarget = options.attachTo === "window" ? window : document;

        target.connectedCallback = function() {
            if (originalConnectedCallback) originalConnectedCallback.call(this);

            const boundHandler = this[propertyKey].bind(this);
            boundHandlersMap.set(this, boundHandler);
            attachTarget.addEventListener(eventName, boundHandler, listenerOptions);
        };

        target.disconnectedCallback = function() {
            if (originalDisconnectedCallback) originalDisconnectedCallback.call(this);

            const boundHandler = boundHandlersMap.get(this);
            if (boundHandler) {
                attachTarget.removeEventListener(eventName, boundHandler, listenerOptions);
                boundHandlersMap.delete(this);
            }
        };
    };
}

interface ListenOptions {
    attachTo: 'window' | 'document';
}