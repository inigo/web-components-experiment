/**
 * Initializes event listeners for elements with the `data-action` attribute to handle CSS-related actions on click or keyboard events.
 *
 * If data-action is "addClass", then add the class(es) specified in "data-class" to the element found with the selector
 * in "data-target", and the reverse for "removeClass"
 */
export function setupCssActions() {
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLElement)) return;

        const button = target.closest('[data-action]') as HTMLElement;
        if (button) handleAction(button);
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLElement)) return;

        if (target.hasAttribute('data-action')) {
            event.preventDefault();
            handleAction(target);
        }
    });
}

function handleAction(el: HTMLElement) {
    const action = el.getAttribute('data-action');
    const targetSelector = el.getAttribute('data-target');
    if (!action || !targetSelector) return;

    const targetElements = document.querySelectorAll(targetSelector);
    targetElements.forEach(target => {
        if (action === 'addClass' || action === 'removeClass') {
            const classes = el.getAttribute('data-class');
            if (!classes) {
                console.warn(`Element ${el.outerHTML} has a data-action of ${action} but no data-class attribute`);
                return;
            }
            const classList = classes.split(' ');
            if (action === 'addClass') {
                classList.forEach(cls => target.classList.add(cls));
            } else {
                classList.forEach(cls => target.classList.remove(cls));
            }
        } else if (action === 'showDialog') {
            console.log(`Showing dialog ${target.outerHTML}`);
            const isModal = el.hasAttribute('data-modal') && el.getAttribute('data-modal')==="true";
            
            if (target instanceof HTMLDialogElement) {
                isModal ? target.showModal() : target.show();
            } else if (target.tagName.toLowerCase() === 'saved-search-dialog') {
                isModal ? (target as any).showModal() : (target as any).show();
            }
        }
    });
}
