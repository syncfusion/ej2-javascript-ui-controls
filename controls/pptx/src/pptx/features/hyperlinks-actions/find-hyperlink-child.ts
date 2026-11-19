/**
 * Shared lookup for DrawingML hyperlink children.
 *
 * @remarks
 * Shape-level markup may place children under DML, empty, or PML default xmlns;
 * run-level markup is DML-primary with empty-NS fallback. Citation: Transitional
 * `dml-main.xsd` `CT_Hyperlink`; dual-NS walk rules.
 *
 * @internal
 */
import { PML_NS } from '../../core/presentation/constants';
import { DML_NS } from '../../core/shapes/constants';
import { findChild } from '../../core/shapes/dom-utils';
import { OoxmlElement } from '../../core/xml/index';
/**
 * Finds `hlinkClick` / `hlinkHover` / `hlinkMouseOver` under a parent container.
 *
 * @internal
 * @param {OoxmlElement} parent - `cNvPr` or `a:rPr`.
 * @param {string} localName - Hyperlink local name.
 * @param {*} options - The options value.
 * @param {boolean} [options.includePml] - Also search PML namespace.
 * @returns {OoxmlElement | undefined} Live element or `undefined`.
 */
export function findHyperlinkChild(parent: OoxmlElement, localName: string, options: {
    readonly includePml?: boolean;
} = {}): OoxmlElement | undefined {
    let dmlOrEmpty: OoxmlElement | undefined = findChild(parent, DML_NS, localName);
    if (dmlOrEmpty === undefined) {
        dmlOrEmpty = findChild(parent, '', localName);
    }
    if (dmlOrEmpty !== undefined) {
        return dmlOrEmpty;
    }
    if (options.includePml === true) {
        return findChild(parent, PML_NS, localName);
    }
    return undefined;
}
