import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { elementChildren, isWml } from '../document/wml';
import { partName, PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { featureId, registerFeature, registerFeaturePartHandler } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { parseXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
const STYLES_WITH_EFFECTS: FeatureId = featureId('styles-with-effects');
/**
 * @private
 * `[MS-DOCX]` §2.1.1 stylesWithEffects relationship. */
export const STYLES_WITH_EFFECTS_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects';
/**
 * @private
 * `[MS-DOCX]` stylesWithEffects content type (ooxmlsdk StylesWithEffectsPart). */
export const STYLES_WITH_EFFECTS_CONTENT_TYPE: string = 'application/vnd.ms-word.stylesWithEffects+xml';
/**
 * @private
 */
export const STYLES_WITH_EFFECTS_PART_NAME: PartName = partName('/word/stylesWithEffects.xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
function styleIdAttribute(element: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'styleId' &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseStyleIds(root: OpenXmlElement): ReadonlyArray<string> {
    if (!isWml(root, 'styles')) {
        return [];
    }
    const styleIds: string[] = [];
    for (const child of elementChildren(root)) {
        if (!isWml(child, 'style')) {
            continue;
        }
        const styleId: string = styleIdAttribute(child);
        if (styleId !== undefined && styleId.length > 0) {
            styleIds.push(styleId);
        }
    }
    return styleIds;
}
function parseStyleIdsFromBytes(bytes: Uint8Array): ReadonlyArray<string> {
    if (bytes.byteLength === 0) {
        return [];
    }
    try {
        const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
        return parseStyleIds(root);
    }
    catch (_e) {
        return [];
    }
}
/**
 * In-memory stylesWithEffects part (`word/stylesWithEffects.xml`).
 *
 * @private
 */
export class StylesWithEffectsPart implements FeaturePackagePart {
    private readonly bytes: Uint8Array | undefined;
    private readonly styleIdList: ReadonlyArray<string>;
    private readonly dirty: boolean;
    /**
     * @param {Uint8Array | undefined} bytes - The bytes.
     * @param {ReadonlyArray<string>} styleIdList - The style id list.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(bytes: Uint8Array | undefined, styleIdList: ReadonlyArray<string>, dirty: boolean) {
        this.bytes = bytes;
        this.styleIdList = styleIdList;
        this.dirty = dirty;
    }
    /**
     * Whether the stylesWithEffects part was present in the package.
     *
     * @returns {boolean} The result.
     * @public
     */
    present(): boolean {
        return this.bytes !== undefined;
    }
    /**
     * `w:style/@w:styleId` values in document order.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @public
     */
    styleIds(): ReadonlyArray<string> {
        return this.styleIdList;
    }
    /**
     * Count of readable style ids.
     *
     * @returns {number} The result.
     * @public
     */
    styleCount(): number {
        return this.styleIdList.length;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirty;
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        if (this.bytes !== undefined) {
            return this.bytes;
        }
        return new Uint8Array(0);
    }
}
function loadStylesWithEffectsPart(part: PackagePart | undefined): StylesWithEffectsPart {
    if (part === undefined) {
        return new StylesWithEffectsPart(undefined, [], false);
    }
    const styleIdList: ReadonlyArray<string> = parseStyleIdsFromBytes(part.data);
    return new StylesWithEffectsPart(part.data, styleIdList, false);
}
let stylesWithEffectsRegistered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetStylesWithEffectsFeatureForTests(): void {
    stylesWithEffectsRegistered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the stylesWithEffects package-part handler. Idempotent.
 */
export function registerStylesWithEffectsFeature(): void {
    if (stylesWithEffectsRegistered) {
        return;
    }
    stylesWithEffectsRegistered = true;
    registerFeature({ id: STYLES_WITH_EFFECTS });
    registerFeaturePartHandler({
        featureId: STYLES_WITH_EFFECTS,
        relationshipTypes: [STYLES_WITH_EFFECTS_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'stylesWithEffects.xml',
        partName: STYLES_WITH_EFFECTS_PART_NAME,
        contentType: STYLES_WITH_EFFECTS_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): StylesWithEffectsPart {
            void ctx;
            return loadStylesWithEffectsPart(part);
        }
    });
}
/**
 * stylesWithEffects part for a document. Requires {@link registerStylesFeature} or
 * {@link registerStylesWithEffectsFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {StylesWithEffectsPart} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the handler was not registered before load.
 *
 * @private
 */
export function stylesWithEffectsFor(document: WordDocument): StylesWithEffectsPart {
    registerStylesWithEffectsFeature();
    const part: FeaturePartState = document.featurePart(STYLES_WITH_EFFECTS);
    if (part === undefined || !(part instanceof StylesWithEffectsPart)) {
        throw new DocxError('feature/not-registered', 'stylesWithEffects part was not loaded; call registerStylesFeature() before WordDocument.open');
    }
    return part;
}
