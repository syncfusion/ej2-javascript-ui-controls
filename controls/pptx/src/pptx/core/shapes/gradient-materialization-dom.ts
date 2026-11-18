import { OoxmlElement, OoxmlText } from '../xml/dom';
import { ScopedCloneError } from '../xml/clone-scoped-element';
/** @param {OoxmlElement} parent - Source container.
 * @param {string} ns - Exact native namespace.
 * @param {string} name - Native child name.
 * @returns {OoxmlElement | undefined} Unique child, refusing ambiguity. */
export function uniqueGradientChild(parent: OoxmlElement, ns: string, name: string): OoxmlElement | undefined {
    const values: OoxmlElement[] = parent.children.filter((value: OoxmlElement | OoxmlText): value is OoxmlElement =>
        value.kind === 'element' && value.namespaceUri === ns && value.localName === name);
    if (values.length > 1) { throw new ScopedCloneError('ambiguous-gradient-source'); }
    return values[0];
}
