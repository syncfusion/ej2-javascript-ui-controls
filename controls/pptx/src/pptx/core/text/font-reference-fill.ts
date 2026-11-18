/** Canonical fontRef fallback shared by host and Worker. */
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { findChild } from '../shapes/dom-utils';
import { ColorValue } from '../theme/color-value';
import { tryParseColorChoiceChild } from '../theme/parse-color-choice';
import { readGradientColorTransforms } from '../theme/read-gradient';
import { TextCharacterFills } from './character-fills';
/**
 * Reads the shape's exact-namespace fontRef color without resolving its scheme
 * or dropping ordered transforms. Only glyph fallback participates.
 *
 * @param {OoxmlElement} shape - PresentationML shape with optional style/fontRef.
 * @returns {TextCharacterFills | undefined} Authored fallback carriers, or absent.
 * @internal
 */
export function readFontReferenceFills(shape: OoxmlElement): TextCharacterFills | undefined {
    const pml: string = shape.namespaceUri;
    const ns: string | undefined = pml === 'http://schemas.openxmlformats.org/presentationml/2006/main' ?
        'http://schemas.openxmlformats.org/drawingml/2006/main' : pml === 'http://purl.oclc.org/ooxml/presentationml/main' ?
            'http://purl.oclc.org/ooxml/drawingml/main' : undefined;
    const style: OoxmlElement | undefined = findChild(shape, pml, 'style');
    const reference: OoxmlElement | undefined = style === undefined || ns === undefined ? undefined : findChild(style, ns, 'fontRef');
    const color: ColorValue | undefined = reference === undefined ? undefined : tryParseColorChoiceChild(reference, ns);
    if (reference === undefined || ns === undefined || color === undefined) { return undefined; }
    const names: string[] = ['srgbClr', 'scrgbClr', 'hslClr', 'sysClr', 'schemeClr', 'prstClr'];
    const selected: OoxmlElement | undefined = reference.children.find((child: OoxmlElement | OoxmlText): child is OoxmlElement =>
        child.kind === 'element' && child.namespaceUri === ns && names.indexOf(child.localName) >= 0);
    return { glyphFill: { kind: 'solid', color, colorTransforms: selected === undefined ? [] :
        readGradientColorTransforms(selected, ns, pml === 'http://purl.oclc.org/ooxml/presentationml/main' ? 'strict' : 'transitional') },
    outline: { kind: 'missing' }, underlineFill: { kind: 'missing' }, underlineLine: { kind: 'missing' } };
}
