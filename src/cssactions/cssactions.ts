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

function handleAction(element: HTMLElement) {
    const action = element.getAttribute('data-action');
    const targetSelector = element.getAttribute('data-target');
    const classes = element.getAttribute('data-class');

    if (!action || !targetSelector || !classes) return;

    const targetElements = document.querySelectorAll(targetSelector);
    const classList = classes.split(' ');

    targetElements.forEach(element => {
        if (action === 'addClass') {
            classList.forEach(cls => element.classList.add(cls));
        } else if (action === 'removeClass') {
            classList.forEach(cls => element.classList.remove(cls));
        }
    });
}
