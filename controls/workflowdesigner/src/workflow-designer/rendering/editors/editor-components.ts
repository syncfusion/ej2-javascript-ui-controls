import { TextBox } from '@syncfusion/ej2-inputs';

/**
 * A field the runtime-context picker can write an expression into.
 *
 * Structurally identical to `ExpressionTarget` in `property-panel.ts`. It is
 * declared here as well so editors never import from the property panel,
 * which imports them — a cycle that would otherwise be introduced purely for
 * a type alias.
 *
 * @private
 */
export type EditorExpressionTarget = HTMLInputElement | HTMLTextAreaElement | TextBox;

/** Minimal shape of an EJ2 component as reached through its host element. */
interface Ej2Instance {
    destroy?: () => void;
    isDestroyed?: boolean;
    focusIn?: () => void;
}

/**
 * An element that may host one or more EJ2 component instances.
 *
 * `ej2_instances` is the property name EJ2 itself writes onto host elements;
 * it is not ours to rename, so the camelCase rule is disabled for that one
 * declaration rather than aliasing the framework's contract.
 */
interface Ej2Host extends HTMLElement {
    // eslint-disable-next-line camelcase
    ej2_instances?: Ej2Instance[];
}

/**
 * Lifecycle helpers shared by the structured property-panel list editors.
 *
 * Every list editor rebuilds its rows by assigning `innerHTML = ''`. With
 * native controls that was harmless; with EJ2 components it orphans every
 * instance in the discarded subtree along with its popups and its
 * document-level listeners.
 *
 * `destroyWithin` performs a generic sweep rather than requiring each editor
 * to maintain its own registry: EJ2 records its instances on the host
 * element, so any component in the subtree can be found and disposed without
 * changing a single editor signature.
 *
 * @internal
 * @private
 */
export class EditorComponents {
    /**
     * Destroys every EJ2 component hosted inside (or on) `root`.
     *
     * Safe to call on a subtree containing no components, on one whose
     * components were already destroyed, and on `null`.
     *
     * @param {HTMLElement | null} root The subtree about to be discarded.
     * @returns {void}
     * @private
     */
    public static destroyWithin(root: HTMLElement | null): void {
        if (!root) {
            return;
        }
        const hosts: NodeListOf<Element> = root.querySelectorAll('.e-control');
        for (let i: number = 0; i < hosts.length; i++) {
            EditorComponents.destroyOn(hosts.item(i) as Ej2Host);
        }
        // The root itself may be a component host (e.g. an editor mounted
        // directly onto the element handed in by the property panel).
        EditorComponents.destroyOn(root as Ej2Host);
    }

    /**
     * Clears a subtree, disposing its EJ2 components first.
     *
     * @param {HTMLElement | null} root The element to empty.
     * @returns {void}
     * @private
     */
    public static clear(root: HTMLElement | null): void {
        EditorComponents.destroyWithin(root);
        if (root) {
            root.innerHTML = '';
        }
    }

    /**
     * Restores focus to the control tagged with `data-wf-focus="<key>"` after
     * a rebuild.
     *
     * The native implementation always called `focus()` and moved the caret to
     * the end. That still applies to text inputs, but a component such as
     * `DropDownList` hides its original element, so focusing it does nothing;
     * those are focused through the component's own `focusIn()`.
     *
     * @param {HTMLElement | null} root The rebuilt subtree.
     * @param {string} key The focus key to restore.
     * @returns {void}
     * @private
     */
    public static focusTarget(root: HTMLElement | null, key: string): void {
        if (!root || !key) {
            return;
        }
        const target: Ej2Host | null =
            root.querySelector('[data-wf-focus="' + key + '"]') as Ej2Host | null;
        if (!target) {
            return;
        }
        const focusable: boolean =
            (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
            && target.offsetParent !== null;
        if (focusable) {
            const element: HTMLInputElement = target as HTMLInputElement;
            element.focus();
            const length: number = element.value ? element.value.length : 0;
            try {
                element.setSelectionRange(length, length);
            } catch (error) {
                // date / number inputs reject selection ranges.
            }
            return;
        }
        const instance: Ej2Instance | undefined =
            target.ej2_instances && target.ej2_instances.length ? target.ej2_instances[0] : undefined;
        if (instance && typeof instance.focusIn === 'function') {
            instance.focusIn();
            return;
        }
        if (typeof target.focus === 'function') {
            target.focus();
        }
    }

    /**
     * Disposes the EJ2 components on a single host element.
     *
     * @param {Ej2Host} element The candidate host.
     * @returns {void}
     */
    private static destroyOn(element: Ej2Host): void {
        const instances: Ej2Instance[] =
            element && element.ej2_instances ? element.ej2_instances.slice() : [];
        instances.forEach((instance: Ej2Instance) => {
            try {
                if (instance && !instance.isDestroyed && typeof instance.destroy === 'function') {
                    instance.destroy();
                }
            } catch (error) {
                // A component whose element was already detached throws on
                // destroy; it is discarded either way.
            }
        });
    }
}
