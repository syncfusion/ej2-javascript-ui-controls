import { registerGraphicKindDetector } from '../../core/registry/feature-registry';
import { PRESENTATION_OLE_URI, ShapeType } from '../../core/presentation/shapetype';
import { OoxmlElement } from '../../core/xml/index';

interface OleDetector {
    detect(uri: string | undefined, element: OoxmlElement): ShapeType | null;
}

const oleDetector: OleDetector = {
    detect: (uri: string | undefined, element: OoxmlElement): ShapeType | null => (uri === PRESENTATION_OLE_URI || hasChild(element, 'oleObj') ? 'ole' : null)
};
registerGraphicKindDetector(oleDetector);
/**
 * Enables OLE graphic-frame and legacy shape kind detection.
 *
 * @returns {void} Nothing.
 */
export function detectOle(): void {
    registerGraphicKindDetector(oleDetector);
}
/**
 * Checks whether the element has a child with the given local name.
 *
 * @param {OoxmlElement} element Element to inspect.
 * @param {string} localName Local name to match.
 * @returns {boolean} True when a matching child exists.
 */
function hasChild(element: OoxmlElement, localName: string): boolean {
    return element.children.some((child: any) => child.kind === 'element' && child.localName === localName); // eslint-disable-line
}
