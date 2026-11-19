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
const WEB_SETTINGS: FeatureId = featureId('web-settings');
/**
 * @private
 * Transitional web settings relationship (ECMA-376-4 §9.2.13). */
export const WEB_SETTINGS_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings';
/**
 * @private
 * Strict web settings relationship (ECMA-376-1 §11.3.13). */
export const STRICT_WEB_SETTINGS_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/webSettings';
/**
 * @private
 * ECMA-376-1 §11.3.13 Web Settings content type. */
export const WEB_SETTINGS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml';
/**
 * @private
 */
export const WEB_SETTINGS_PART_NAME: PartName = partName('/word/webSettings.xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const EMPTY_METADATA: { encoding: string; hasFrameset: boolean; divCount: number; optimizeForBrowserTarget: string; } = {
    encoding: undefined as string | undefined,
    hasFrameset: false,
    divCount: 0,
    optimizeForBrowserTarget: undefined as string | undefined
};
function wmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
interface WebSettingsMetadata {
    readonly encoding: string | undefined;
    readonly hasFrameset: boolean;
    readonly divCount: number;
    readonly optimizeForBrowserTarget: string | undefined;
}
function parseWebSettingsMetadata(root: OpenXmlElement): WebSettingsMetadata | undefined {
    if (!isWml(root, 'webSettings')) {
        return undefined;
    }
    let encoding: string | undefined;
    let hasFrameset: boolean = false;
    let divCount: number = 0;
    let optimizeForBrowserTarget: string | undefined;
    for (const child of elementChildren(root)) {
        if (isWml(child, 'encoding')) {
            encoding = wmlAttribute(child, 'val');
            continue;
        }
        if (isWml(child, 'frameset')) {
            hasFrameset = true;
            continue;
        }
        if (isWml(child, 'divs')) {
            for (const div of elementChildren(child)) {
                if (isWml(div, 'div')) {
                    divCount += 1;
                }
            }
            continue;
        }
        if (isWml(child, 'optimizeForBrowser')) {
            optimizeForBrowserTarget = wmlAttribute(child, 'target');
        }
    }
    return { encoding, hasFrameset, divCount, optimizeForBrowserTarget };
}
function parseWebSettingsMetadataFromBytes(bytes: Uint8Array): WebSettingsMetadata | undefined {
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
    return parseWebSettingsMetadata(root);
}
/**
 * In-memory Web Settings part (`word/webSettings.xml`).
 *
 * @private
 */
export class WebSettingsPart implements FeaturePackagePart {
    private readonly bytes: Uint8Array | undefined;
    private readonly metadata: WebSettingsMetadata;
    private readonly dirty: boolean;
    /**
     * @param {Uint8Array | undefined} bytes - The bytes.
     * @param {WebSettingsMetadata} metadata - The metadata.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(bytes: Uint8Array | undefined, metadata: WebSettingsMetadata, dirty: boolean) {
        this.bytes = bytes;
        this.metadata = metadata;
        this.dirty = dirty;
    }
    /**
     * `w:encoding/@w:val`, or `undefined` when absent or the part is missing.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    encoding(): string | undefined {
        return this.metadata.encoding;
    }
    /**
     * Whether `w:frameset` is present under `w:webSettings`.
     *
     * @returns {boolean} The result.
     * @public
     */
    hasFrameset(): boolean {
        return this.metadata.hasFrameset;
    }
    /**
     * Count of `w:divs/w:div` children.
     *
     * @returns {number} The result.
     * @public
     */
    divCount(): number {
        return this.metadata.divCount;
    }
    /**
     * `w:optimizeForBrowser/@w:target`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    optimizeForBrowserTarget(): string | undefined {
        return this.metadata.optimizeForBrowserTarget;
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
function loadWebSettingsPart(part: PackagePart | undefined): WebSettingsPart {
    let ts330: any;
    if (part === undefined) {
        return new WebSettingsPart(undefined, { ...EMPTY_METADATA }, false);
    }
    const metadata: WebSettingsMetadata =
        ((ts330 = parseWebSettingsMetadataFromBytes(part.data)), ts330 != null ? ts330 : { ...EMPTY_METADATA });
    return new WebSettingsPart(part.data, metadata, false);
}
let webSettingsRegistered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetWebSettingsFeatureForTests(): void {
    webSettingsRegistered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the web settings package-part handler. Idempotent.
 */
export function registerWebSettingsFeature(): void {
    if (webSettingsRegistered) {
        return;
    }
    webSettingsRegistered = true;
    registerFeature({ id: WEB_SETTINGS });
    registerFeaturePartHandler({
        featureId: WEB_SETTINGS,
        relationshipTypes: [WEB_SETTINGS_RELATIONSHIP_TYPE, STRICT_WEB_SETTINGS_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'webSettings.xml',
        partName: WEB_SETTINGS_PART_NAME,
        contentType: WEB_SETTINGS_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): WebSettingsPart {
            void ctx;
            return loadWebSettingsPart(part);
        }
    });
}
/**
 * Web settings catalog for a document. Requires {@link registerSettingsFeature} or
 * {@link registerWebSettingsFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {WebSettingsPart} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the web settings handler was not registered before load.
 *
 * @private
 */
export function webSettingsFor(document: WordDocument): WebSettingsPart {
    registerWebSettingsFeature();
    const part: FeaturePartState = document.featurePart(WEB_SETTINGS);
    if (part === undefined || !(part instanceof WebSettingsPart)) {
        throw new DocxError('feature/not-registered', 'Web settings part was not loaded; call registerSettingsFeature() before WordDocument.open');
    }
    return part;
}
