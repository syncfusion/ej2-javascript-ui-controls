import { registerGraphicKindDetector } from '../../core/registry/feature-registry';
import { P14_NS, ShapeType } from '../../core/presentation/shapetype';
import { OoxmlElement } from '../../core/xml/index';
interface MediaDetector {
    detect(uri: string | undefined, element: OoxmlElement): ShapeType | null;
}

const mediaDetector: MediaDetector = {
    detect: (_uri: string | undefined, element: OoxmlElement): ShapeType | null => (hasMediaElement(element) ? 'media' : null)
};
registerGraphicKindDetector(mediaDetector);
/**
 * Enables PowerPoint p14 media extension kind detection.
 *
 * @returns {void} Nothing.
 */
export function detectMedia(): void {
    registerGraphicKindDetector(mediaDetector);
}
/**
 * Recursively checks whether an element tree contains a p14 media element.
 *
 * @param {OoxmlElement} element Current element to inspect.
 * @returns {boolean} True when a media element exists in the subtree.
 */
function hasMediaElement(element: OoxmlElement): boolean {
    if (element.namespaceUri === P14_NS && element.localName === 'media') {
        return true;
    }
    return element.children.some((child: any) => child.kind === 'element' && hasMediaElement(child)); // eslint-disable-line
}
