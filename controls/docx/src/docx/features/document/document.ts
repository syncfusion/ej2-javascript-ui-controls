import { DetachedObjectError, InvalidArgumentError, IoError } from '../../core/errors/docx-error';
import { inspectMarkupCompatibility } from '../../core/mc/index';
import { createTransitionalWordPackage, loadOpcPackage, officeDocumentPartName, partByName, saveOpcPackage, withReplacedPart, detectPackageFormat, fileFormatTypeFromFormat, isFileFormat, resolveFileFormat, withPackageFormat, OpcPackage, FileFormat, FileFormatType } from '../../core/opc/index';
import { documentBody } from '../../core/preservation/index';
import { parseXml, serializeXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { materializeFeatureSideEffects } from '../../core/registry/materialize-handlers';
import { applyFeatureParts, loadFeatureParts } from '../../core/registry/part-handlers';
import { applyFeatureMultiParts, loadFeatureMultiParts } from '../../core/registry/multi-part-handlers';
import { applyFeaturePackageParts, loadFeaturePackageParts } from '../../core/registry/package-part-handlers';
import { detachedBodyBlockParseContext, BodyBlockParseContext } from '../../core/registry/block-handlers';
import { FeaturePackagePart } from './feature-package-part';
import { isFeaturePackageLevelPart, FeaturePackageLevelPart } from './feature-package-level-part';
import { isFeatureMultiPackagePart, FeatureMultiPackagePart } from './feature-multi-package-part';
import { ResourceLimitOverrides } from '../../core/security/limits';
import { altChunksInBlocks, bindAltChunkDocument, ensureCoreBlockHandlers, AltChunkAnchor } from './alt-chunk';
import { ensureAlwaysOnBodyFeaturesRegistered } from './body-always-on';
import { parseBodyBlocks, serializeBodyBlocks, stabilizeBodyLevelBookmarks } from './body-blocks';
import { Body } from './body';
import { LoadOptions } from './load-options';
import { BlockContent, Paragraph } from './paragraph';
import { Section } from './section';
import {
    flattenSectionsToBodyBlocks,
    materializeSectionProperties,
    notifySectionPropertiesAttached,
    partitionBodyIntoSections, SectionData
} from './section-partition-flatten';
import { Sections } from './sections';
import { SectionPropertiesModel } from './section-properties-model';
import { isWml, wmlElement } from './wml';
import { decodeBase64, encodeBase64 } from '../../core/compat/base64';
import { PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { _HTMLParser } from '../html-parser/parser';
import { _ImageMapper } from '../html-to-docio/image-mapper';
import { detectFormat } from './format-detection';
import { validateLicense } from '@syncfusion/ej2-base';
/**
 * HTML → WordDocument conversion callback (sync). Registered by the html-to-docio
 * barrel at load time so `document.ts` has no static import of the mapper
 * (which imports document types and would create a load-time cycle).
 *
 * @private
 */
export type HtmlConverter = (html: string, doc: WordDocument) => void;

/**
 * HTML → WordDocument conversion callback (async). Registered by the html-to-docio
 * barrel for openAsync path. Handles image downloads inside the parser/mapper level.
 *
 * @private
 */
export type HtmlAsyncConverter = (html: string, doc: WordDocument) => Promise<void>;

/**
 * Trial-license watermark callback. Registered by `watermark/license-register` so
 * `document.ts` has no static import of the watermark module (load-time cycle).
 *
 * @private
 */
export type LicenseWatermarkApplicator = (document: WordDocument) => void;

let licenseWatermarkApplicator: LicenseWatermarkApplicator | undefined;

/**
 * Registers the trial-license watermark callback used on save.
 *
 * @param {LicenseWatermarkApplicator} applicator - The applicator.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setLicenseWatermarkApplicator(applicator: LicenseWatermarkApplicator): void {
    licenseWatermarkApplicator = applicator;
}

let htmlConverterRegistered: HtmlConverter | undefined;
let htmlAsyncConverterRegistered: HtmlAsyncConverter | undefined;

/**
 * @param {HtmlConverter} converter - The converter.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerHtmlConverter(converter: HtmlConverter): void {
    htmlConverterRegistered = converter;
}

/**
 * @param {HtmlAsyncConverter} converter - The async converter.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerHtmlAsyncConverter(converter: HtmlAsyncConverter): void {
    htmlAsyncConverterRegistered = converter;
}

/**
 * @returns {HtmlConverter | undefined} The registered converter.
 * @private
 */
function htmlConverter(): HtmlConverter | undefined {
    return htmlConverterRegistered;
}

/**
 * @returns {HtmlAsyncConverter | undefined} The registered async converter.
 * @private
 */
function htmlAsyncConverter(): HtmlAsyncConverter | undefined {
    return htmlAsyncConverterRegistered;
}
/**
 * Core alt-chunk handlers + always-on body/run features (tables / content-controls /
 * images / drawing when bootstrapped from the main entry).
 *
 * @returns {void} Nothing is returned.
 */
function ensureBodyParseHandlers(): void {
    ensureCoreBlockHandlers();
    ensureAlwaysOnBodyFeaturesRegistered();
}
const utf8: TextEncoder = new TextEncoder();
/**
 * Optional feature-part hook after `WordDocument` construction (main-story post-load).
 * Used by comments elevation without a hard value-import cycle on `comments/index`.
 */
type AfterMainDocumentLoadPart = {
    afterMainDocumentLoad?(document: WordDocument): void;
};
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
/**
 * @private
 * Feature-owned package part state (single-, multi-, or package-level).
 */
export type FeaturePartState = FeaturePackagePart | FeatureMultiPackagePart | FeaturePackageLevelPart;
/**
 * In-memory WordprocessingML document backed by an OPC package.
 *
 * Load via {@link WordDocument.open} / {@link WordDocument.openSync} from bytes or base64,
 * or {@link WordDocument.openAsync} from a browser `File` / `Blob`. There is no filesystem-path open.
 * Serialize with {@link WordDocument.save} / {@link WordDocument.saveSync} to bytes, a browser
 * download file name, or base64. There is no Node.js filesystem write.
 *
 * Main-story entry is {@link Document.sections} (each {@link Section.body}).
 *
 * @public
 */
export interface SaveOptions {
    /** `'base64'` returns a base64 string instead of bytes. */
    format?: 'base64';
    /**
     * Output package format; defaults to `FileFormatType.Docx`.
     * Accepts either a {@link FileFormatType} enum value or a lowercase wire string
     * (`'docx'`, `'dotx'`, `'docm'`, `'dotm'`).
     */
    formatType?: FileFormatType | FileFormat;
}

export class WordDocument {
    private pkg: OpcPackage;
    private inputFormatValue: FileFormat = 'docx';
    private rootExtra: Pick<OpenXmlElement, 'attributes' | 'namespaceDeclarations'>;
    private background: OpenXmlElement | undefined;
    /** Ordered sections — sole main-story owners (TASK-8074). */
    private readonly sectionsInstance: Sections;
    /**
     * Body-final `w:sectPr` as preserved OOXML when the sections feature has not
     * attached a live {@link SectionPropertiesModel}.
     */
    private sectPr: OpenXmlElement | undefined;
    /**
     * Live body-final section properties when the sections feature owns the model.
     * Preferred over {@link sectPr} when both would otherwise be present.
     */
    private finalSectionModel: SectionPropertiesModel | undefined;
    private featureParts: Map<FeatureId, FeaturePartState>;
    private constructor(pkg: OpcPackage, rootExtra: Pick<OpenXmlElement, 'attributes' | 'namespaceDeclarations'>, background: OpenXmlElement | undefined, items: BlockContent[], sectPr: OpenXmlElement | undefined, featureParts: Map<FeatureId, FeaturePartState>) {
        this.pkg = pkg;
        this.rootExtra = rootExtra;
        this.background = background;
        this.sectPr = sectPr;
        this.finalSectionModel = undefined;
        this.featureParts = featureParts;
        const section: Section = new Section(this, items);
        this.sectionsInstance = new Sections(this, [section]);
        // Body constructor only copies the store — attach / bind seeded blocks here.
        const body: Body = section.body;
        for (const block of body.listBlocks()) {
            if (block.type === 'paragraph') {
                block.paragraph.attach(body);
                continue;
            }
            if (block.type === 'feature') {
                bindDocumentToFeatureBlock(block.value, this);
            }
        }
        bindAltChunkDocument(body.listBlocks(), this);
        section.syncCollections();
    }
    /**
     * Minimal Transitional package with one empty paragraph (`w:p` in `w:body`).
     *
     * Builds the in-memory document and package scaffold directly — does not
     * serialize then re-parse as the sole create path.
     *
     * @returns {WordDocument} The result.
     */
    static create(): WordDocument {
        ensureBodyParseHandlers();
        const pkg: OpcPackage = createTransitionalWordPackage();
        const name: PartName = officeDocumentPartName(pkg);
        const paragraph: Paragraph = new Paragraph(undefined);
        return new WordDocument(pkg, {
            attributes: [],
            namespaceDeclarations: [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }]
        }, undefined, [{ type: 'paragraph', paragraph }], undefined, mergeFeatureParts(loadFeatureParts(pkg, name), loadFeatureMultiParts(pkg, name), loadFeaturePackageParts(pkg)));
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @param {ResourceLimitOverrides} limits - The limits.
     * @returns {WordDocument} The result.
     * @private
     */
    static fromPackage(pkg: OpcPackage, limits?: ResourceLimitOverrides): WordDocument {
        ensureBodyParseHandlers();
        const name: PartName = officeDocumentPartName(pkg);
        const part: PackagePart = partByName(pkg, name);
        if (part === undefined) {
            throw new DetachedObjectError('Main document part is missing');
        }
        const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data), limits);
        inspectMarkupCompatibility(root);
        let background: OpenXmlElement | undefined;
        for (const child of root.children) {
            if (child.kind === 'element' && isWml(child, 'background')) {
                background = child;
                break;
            }
        }
        // Chart, ink, and diagram parts have no typed handlers. Leaving them
        // unregistered keeps those OPC parts untouched on save.
        const featureParts: Map<FeatureId, FeaturePartState> = mergeFeatureParts(
            loadFeatureParts(pkg, name, limits),
            loadFeatureMultiParts(pkg, name, limits),
            loadFeaturePackageParts(pkg, limits)
        );
        const body: OpenXmlElement = documentBody(root);
        const parseCtx: BodyBlockParseContext = detachedBodyBlockParseContext();
        const blocks: BlockContent[] = [];
        let sectPr: OpenXmlElement | undefined;
        for (const child of body.children) {
            if (child.kind !== 'element') {
                continue;
            }
            if (isWml(child, 'sectPr')) {
                sectPr = child;
                continue;
            }
            blocks.push(...parseBodyBlocks([child], parseCtx));
        }
        // Stabilize body-level bookmarks by moving them into their target paragraphs
        const stabilizedBlocks: BlockContent[] = stabilizeBodyLevelBookmarks(blocks);
        
        const document: WordDocument = new WordDocument(pkg, {
            attributes: root.attributes,
            namespaceDeclarations: root.namespaceDeclarations.length > 0
                ? root.namespaceDeclarations
                : [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }]
        }, background, [], undefined, featureParts);
        document.inputFormatValue = detectPackageFormat(pkg, name);
        document.hydratePartitionedSections(stabilizedBlocks, sectPr);
        // Feature post-load hooks (comments main-story elevation TASK-8055 / D14).
        // Duck-typed so `document.ts` does not value-import `features/comments` (that
        // cycle left `Paragraph` undefined when comments attached prototype methods).
        for (const featurePart of featureParts.values()) {
            const part: AfterMainDocumentLoadPart = featurePart as AfterMainDocumentLoadPart;
            if (part.afterMainDocumentLoad != null) {
                part.afterMainDocumentLoad(document);
            }
        }
        return document;
    }
    /**
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @param {SectionPropertiesModel | OpenXmlElement | undefined} trailingSectPr - The trailing sect pr.
     * @returns {void} Nothing is returned.
     * @private
     * Partition body blocks into logical sections and attach them (TASK-8075).
     * Non-final section properties stay dual-held internally on the closing
     * paragraph and {@link Section.pageSetup} for flatten/serialize; final
     * properties dual-hold body-final model / last pageSetup.
     *
     * Also used after dual-hold authoring (`setParagraphSectionBreak`) so
     * `Document.sections` matches paragraph break topology before save.
     */
    private hydratePartitionedSections(
        blocks: ReadonlyArray<BlockContent>,
        trailingSectPr: SectionPropertiesModel | OpenXmlElement | undefined
    ): void {
        const parts: SectionData[] = partitionBodyIntoSections(blocks, trailingSectPr);
        const sections: Section[] = [];
        for (const part of parts) {
            const materialized: OpenXmlElement | SectionPropertiesModel = materializeSectionProperties(part.properties);
            const pageSetup: SectionPropertiesModel =
                materialized !== undefined &&
                typeof (materialized as SectionPropertiesModel).toOpenXml === 'function'
                    ? (materialized as SectionPropertiesModel)
                    : undefined;
            const section: Section = new Section(this, part.items, pageSetup);
            sections.push(section);
            notifySectionPropertiesAttached(pageSetup, this);
            // Internal dual-hold: pin the same pageSetup identity on the non-final
            // closing paragraph so flatten/serialize can read break properties.
            if (!part.isFinal && pageSetup !== undefined) {
                const items: BlockContent[] = part.items;
                const last: BlockContent = items[items.length - 1];
                if (last !== undefined && last.type === 'paragraph') {
                    last.paragraph.replaceSectionBreakPropertiesModel(pageSetup);
                }
            }
        }
        this.sectionsInstance.replaceAll(sections);
        this.sectPr = undefined;
        this.finalSectionModel = undefined;
        const lastPart: SectionData = parts[parts.length - 1];
        const lastSection: Section = sections[sections.length - 1];
        if (lastPart !== undefined && lastSection !== undefined) {
            const finalMaterialized: OpenXmlElement | SectionPropertiesModel = materializeSectionProperties(lastPart.properties);
            if (
                finalMaterialized !== undefined &&
                typeof (finalMaterialized as SectionPropertiesModel).toOpenXml === 'function'
            ) {
                this.finalSectionModel = finalMaterialized as SectionPropertiesModel;
                lastSection.setPageSetup(this.finalSectionModel);
                notifySectionPropertiesAttached(this.finalSectionModel, this);
                this.sectPr = undefined;
            }
            else if (trailingSectPr !== undefined) {
                // No sections feature model — keep preserved body-final XML only.
                // trailing may be model | OpenXml; only OpenXml belongs on sectPr.
                if ((trailingSectPr as { kind?: string }).kind === 'element') {
                    this.sectPr = trailingSectPr as OpenXmlElement;
                    lastSection.setPageSetup(undefined);
                }
                else {
                    this.finalSectionModel = trailingSectPr as SectionPropertiesModel;
                    lastSection.setPageSetup(this.finalSectionModel);
                    notifySectionPropertiesAttached(this.finalSectionModel, this);
                }
            }
            else {
                // No trailing sectPr and no materialized model: seed default
                // pageSetup when the sections feature is registered.
                lastSection.setPageSetup(undefined);
            }
        }
        for (const section of sections) {
            const body: Body = section.body;
            for (const block of body.listBlocks()) {
                if (block.type === 'paragraph') {
                    block.paragraph.attach(body);
                    continue;
                }
                if (block.type === 'feature') {
                    bindDocumentToFeatureBlock(block.value, this);
                }
            }
            bindAltChunkDocument(body.listBlocks(), this);
            section.syncCollections();
        }
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     * Rebuild {@link Document.sections} from current body blocks + dual-hold
     * paragraph/body section properties (TASK-8075/8076 authoring path).
     *
     * Call after `setParagraphSectionBreak` so non-final pageSetup lives on its
     * own section and flatten emits paragraph-level + body-final `w:sectPr`.
     */
    repartitionFromBodyBlocks(): void {
        const trailingModel: SectionPropertiesModel = this.finalSectionPropertiesModel();
        const trailing: OpenXmlElement | SectionPropertiesModel = trailingModel !== undefined ? trailingModel : this.sectPr;
        this.hydratePartitionedSections(this.listBlocks().slice(), trailing);
    }
    /**
     * Load a `.docx` package from bytes.
     *
     * Reuses {@link WordDocument.openSync} parsing — returns `WordDocument` directly
     * (not a `Promise`). Prefer {@link WordDocument.openAsync} when a Promise is required.
     *
     * @param data - OPC ZIP payload (`Uint8Array` or `ArrayBuffer`).
     * @param options - Optional {@link LoadOptions.limits} overrides.
     * @throws {@link PackageError} for ZIP/OPC failures.
     * @throws {@link SecurityError} when a resource limit is exceeded.
     * @throws {@link XmlError} for malformed Main Document XML.
     */
    static open(data: Uint8Array | ArrayBuffer, options?: LoadOptions): WordDocument;
    /**
     * Open a `.docx` package from a base64 string. Requires `options.format: 'base64'`.
     *
     * Optional `data:...;base64,` prefixes are stripped.
     *
     * @param base64 - Base64-encoded OPC ZIP payload.
     * @param options - Load options including `format: 'base64'`.
     * @throws {@link InvalidArgumentError} when the payload is not valid base64
     */
    static open(base64: string, options: LoadOptions & { format: 'base64' }): WordDocument;
    static open(dataOrPath: Uint8Array | ArrayBuffer | string, options?: LoadOptions & { format: 'base64' }): WordDocument {
        // Narrow for TS 3.3 overload resolution (string vs binary packages).
        if (typeof dataOrPath === 'string') {
            if (options !== undefined && options.format === 'base64') {
                const base64Options: LoadOptions & { format: 'base64' } = {
                    format: 'base64',
                    limits: options.limits
                };
                return WordDocument.openSync(dataOrPath, base64Options);
            }
            return WordDocument.openSync(dataOrPath, options);
        }
        return WordDocument.openSync(dataOrPath, options);
    }
    /**
     * Open a `.docx` package or an HTML document asynchronously (Promise form of
     * {@link WordDocument.open}). HTML input is converted to the Word document model;
     * call {@link WordDocument.save} / {@link WordDocument.saveSync} to emit `.docx` bytes.
     *
     * Parsing still runs via {@link WordDocument.openSync}; the Promise only wraps
     * completion / rejection. Use this when call sites require a Promise API.
     *
     * For HTML input, `http:` / `https:` image sources that are not already supplied in
     * {@link LoadOptions.images} are downloaded automatically before conversion. Only PNG
     * and JPEG responses up to 10 MB are embedded; anything else is skipped and the image
     * is replaced by its alt text.
     *
     * @public
     */
    static openAsync(data: Uint8Array | ArrayBuffer, options?: LoadOptions): Promise<WordDocument>;
    /**
     * Open a browser `File` or `Blob` (file-input / drag-drop). Same input shape the
     * PDF library uses for an existing document: bytes the page already has, not a
     * filesystem path. Accepts `.docx` or `.html` file content.
     *
     * @public
     */
    static openAsync(file: { arrayBuffer(): Promise<ArrayBuffer> }, options?: LoadOptions): Promise<WordDocument>;
    /**
     * @public
     */
    static openAsync(base64: string, options: LoadOptions & { format: 'base64' }): Promise<WordDocument>;
    static openAsync(
        dataOrPath: Uint8Array | ArrayBuffer | string | { arrayBuffer(): Promise<ArrayBuffer> },
        options?: LoadOptions & { format: 'base64' }
    ): Promise<WordDocument> {
        return openDocumentAsync(dataOrPath, options);
    }
    /**
     * Open a `.docx` package from bytes synchronously.
     *
     * @param data - OPC ZIP payload (`Uint8Array` or `ArrayBuffer`).
     * @param options - Optional {@link LoadOptions.limits} overrides.
     */
    static openSync(data: Uint8Array | ArrayBuffer, options?: LoadOptions): WordDocument;
    /**
     * Open a `.docx` package from a base64 string synchronously. Requires `options.format: 'base64'`.
     *
     * @param base64 - Base64-encoded OPC ZIP payload.
     * @param options - Load options including `format: 'base64'`.
     */
    static openSync(base64: string, options: LoadOptions & { format: 'base64' }): WordDocument;
    static openSync(dataOrPath: Uint8Array | ArrayBuffer | string, options?: LoadOptions & { format: 'base64' }): WordDocument {
        const bytes: Uint8Array = resolveOpenInputToBytes(dataOrPath, options);
        const inputFormat: string = detectFormat(bytes);
        if (inputFormat === 'html') {
            const converter: HtmlConverter | undefined = htmlConverter();
            if (converter === undefined) {
                throw new Error('HTML conversion is not registered. Import the package root (src/index) once before opening HTML content.');
            }
            const doc = WordDocument.create();
            const htmlText = new TextDecoder().decode(bytes);
            converter(htmlText, doc);
            return doc;
        } else if (inputFormat === 'docx') {
            return WordDocument.fromPackage(loadOpcPackage(bytes, options == null ? undefined : options.limits), options == null ? undefined : options.limits);
        } else {
            throw new Error('Unsupported format. The provided content is neither a valid HTML document nor a DOCX document.');
        }
    }
    /**
     * Alias of {@link WordDocument.open} (legacy / DocIO-aligned `load` naming).
     *
     * @private
     */
    static load(data: Uint8Array | ArrayBuffer, options?: LoadOptions): WordDocument;
    /**
     * Loads a document from a base64-encoded string.
     *
     * @param {string} base64 - The base64-encoded document content to load.
     * @param {object} options - The load options with the base64 format.
     * @returns {WordDocument} Returns the loaded document.
     * @private
     */
    static load(base64: string, options: LoadOptions & { format: 'base64' }): WordDocument;
    /**
     * Loads a document from binary content or a base64-encoded string.
     *
     * @param {Uint8Array|ArrayBuffer|string} dataOrPath - The document content to load.
     * @param {LoadOptions} [options] - Optional load options.
     * @returns {WordDocument} Returns the loaded document.
     * @private
     */
    static load(
        dataOrPath: Uint8Array | ArrayBuffer | string,
        options?: LoadOptions & { format: 'base64' }
    ): WordDocument {
        if (typeof dataOrPath === 'string') {
            if (options !== undefined && options.format === 'base64') {
                const base64Options: LoadOptions & { format: 'base64' } = {
                    format: 'base64',
                    limits: options.limits
                };
                return WordDocument.open(dataOrPath, base64Options);
            }
            return WordDocument.open(dataOrPath, options);
        }
        return WordDocument.open(dataOrPath, options);
    }
    /**
     * Alias of {@link WordDocument.openAsync}. Browser file input: pass the picked `File`.
     * There is no filesystem-path overload.
     *
     * @private
     */
    static loadAsync(data: Uint8Array | ArrayBuffer, options?: LoadOptions): Promise<WordDocument>;
    /**
     * Loads a document from a browser file asynchronously.
     *
     * @param {object} file - The file to load.
     * @param {LoadOptions} [options] - Optional load options.
     * @returns {Promise<WordDocument>} Returns the loaded document.
     * @private
     */
    static loadAsync(file: { arrayBuffer(): Promise<ArrayBuffer> }, options?: LoadOptions): Promise<WordDocument>;
    /**
     * Loads a document from a base64-encoded string asynchronously.
     *
     * @param {string} base64 - The base64-encoded document content to load.
     * @param {object} options - The load options with the base64 format.
     * @returns {Promise<WordDocument>} Returns the loaded document.
     * @private
     */
    static loadAsync(base64: string, options: LoadOptions & { format: 'base64' }): Promise<WordDocument>;
    /**
     * Loads a document from binary content, a browser file, or a base64-encoded string asynchronously.
     *
     * @param {object} dataOrPath - The document content to load.
     * @param {LoadOptions} [options] - Optional load options.
     * @returns {Promise<WordDocument>} Returns the loaded document.
     * @private
     */
    static loadAsync(
        dataOrPath: Uint8Array | ArrayBuffer | string | { arrayBuffer(): Promise<ArrayBuffer> },
        options?: LoadOptions & { format: 'base64' }
    ): Promise<WordDocument> {
        return openDocumentAsync(dataOrPath, options);
    }
    /**
     * Alias of {@link WordDocument.openSync} (legacy / DocIO-aligned `loadSync` naming).
     *
     * @private
     */
    static loadSync(data: Uint8Array | ArrayBuffer, options?: LoadOptions): WordDocument;
    /**
     * Loads a document from a base64-encoded string synchronously.
     *
     * @param {string} base64 - The base64-encoded document content to load.
     * @param {object} options - The load options with the base64 format.
     * @returns {WordDocument} Returns the loaded document.
     * @private
     */
    static loadSync(base64: string, options: LoadOptions & { format: 'base64' }): WordDocument;
    /**
     * Loads a document from binary content or a base64-encoded string synchronously.
     *
     * @param {Uint8Array|ArrayBuffer|string} dataOrPath - The document content to load.
     * @param {LoadOptions} [options] - Optional load options.
     * @returns {WordDocument} Returns the loaded document.
     * @private
     */
    static loadSync(
        dataOrPath: Uint8Array | ArrayBuffer | string,
        options?: LoadOptions & { format: 'base64' }
    ): WordDocument {
        if (typeof dataOrPath === 'string') {
            if (options !== undefined && options.format === 'base64') {
                const base64Options: LoadOptions & { format: 'base64' } = {
                    format: 'base64',
                    limits: options.limits
                };
                return WordDocument.openSync(dataOrPath, base64Options);
            }
            return WordDocument.openSync(dataOrPath, options);
        }
        return WordDocument.openSync(dataOrPath, options);
    }
    /**
     * Ordered document sections. Sole main-story entry (API-RULES / TASK-8074).
     *
     * @public
     */
    get sections(): Sections {
        return this.sectionsInstance;
    }
    /**
     * Last section in {@link WordDocument.sections}.
     *
     * Equivalent to `sections[sections.count - 1]`. The document always has at
     * least one section.
     *
     * @public
     */
    get lastSection(): Section {
        const count: number = this.sectionsInstance.count;
        const section: Section = this.sectionsInstance[count - 1];
        if (section === undefined) {
            throw new DetachedObjectError('Document must have at least one section');
        }
        return section;
    }
    /**
     * Last block-level paragraph of {@link WordDocument.lastSection}.
     *
     * Does not walk paragraphs nested in tables or text boxes. Authored
     * documents always have at least one body paragraph per section.
     *
     * @throws DetachedObjectError when the last section has no block-level
     * paragraph (malformed loaded package).
     *
     * @public
     */
    get lastParagraph(): Paragraph {
        const paragraphs: ReadonlyArray<Paragraph> = this.lastSection.body.listParagraphs();
        const paragraph: Paragraph = paragraphs[paragraphs.length - 1];
        if (paragraph === undefined) {
            throw new DetachedObjectError(
                'Last section has no block-level paragraph (model invariant violated)'
            );
        }
        return paragraph;
    }
    /**
     * First section body — convenience bridge matching create-path documents
     * (single section) and public samples that use `doc.body`.
     *
     * Prefer {@link WordDocument.sections} for multi-section documents.
     *
     * @public
     */
    get body(): Body {
        return this.firstSectionBody();
    }
    /**
     * Appends a paragraph to {@link WordDocument.body}.
     *
     * Style ids route through {@link Paragraph.applyStyle} so built-in catalog
     * resolution and validation run on assignment.
     *
     * @param {Object} options - Optional paragraph style id and/or initial text.
     * @returns {Paragraph} The appended {@link Paragraph}.
     *
     * @public
     */
    appendParagraph(options?: {
        readonly style?: string;
        readonly text?: string;
    }): Paragraph {
        return this.body.appendParagraph(options);
    }
    /**
     * Appends a new section after the current last section.
     *
     * Thin delegate over {@link Sections.add}. Clones page setup from the
     * previous last section when the sections feature has registered a clone
     * hook; otherwise seeds a default letter page setup when a seed hook is
     * registered.
     *
     * @returns {Section} The new {@link Section}.
     *
     * @public
     */
    addSection(): Section {
        return this.sectionsInstance.add();
    }
    /**
     * @param {Paragraph} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     */
    assertAttachedParagraph(target: Paragraph): void {
        for (const section of this.sectionsInstance.asArray()) {
            const found: boolean = section.body.listBlocks().some((b: BlockContent) => b.type === 'paragraph' && b.paragraph === target);
            if (found) {
                return;
            }
        }
        throw new DetachedObjectError('This paragraph is no longer in the document');
    }
    /**
     * @returns {*} The result.
     * @private
     */
    owningDocument(): this {
        return this;
    }
    /**
     * Modeled `w:altChunk` anchors in the Main Document body.
     *
     * @private
     */
    get altChunks(): ReadonlyArray<AltChunkAnchor> {
        return altChunksInBlocks(this.listBlocks());
    }
    /**
     * @returns {Body} The result.
     * @private
     * First section body (internal feature/load bridges).
     */
    firstSectionBody(): Body {
        const first: Section = this.sectionsInstance[0];
        if (first === undefined) {
            throw new DetachedObjectError('Document must have at least one section');
        }
        return first.body;
    }
    /**
     * @returns {ReadonlyArray<Paragraph>} The result.
     * @private
     */
    listParagraphs(): ReadonlyArray<Paragraph> {
        const out: Paragraph[] = [];
        for (const section of this.sectionsInstance.asArray()) {
            const paras: ReadonlyArray<Paragraph> = section.body.listParagraphs();
            for (const paragraph of paras) {
                out.push(paragraph);
            }
        }
        return out;
    }
    /**
     * @returns {ReadonlyArray<BlockContent>} The result.
     * @private
     * Flattened internal store across sections.
     */
    listBlocks(): ReadonlyArray<BlockContent> {
        const out: BlockContent[] = [];
        for (const section of this.sectionsInstance.asArray()) {
            const blocks: ReadonlyArray<BlockContent> = section.body.listBlocks();
            for (const content of blocks) {
                out.push(content);
            }
        }
        return out;
    }
    /**
     * @param {BlockContent} block - The block.
     * @returns {void} Nothing is returned.
     * @private
     */
    appendBlock(block: BlockContent): void {
        this.firstSectionBody().appendRawBlock(block);
    }
    /**
     * Inserts a body item at index (`0…count` inclusive) on the first section body.
     *
     * @param {number} index - The index.
     * @param {BlockContent} block - The block.
     * @returns {void} Nothing is returned.
     * @private
     */
    insertBlockAt(index: number, block: BlockContent): void {
        this.firstSectionBody().insertRawBlockAt(index, block);
    }
    /**
     * Inserts an empty paragraph at a body item index (`0…count` inclusive).
     *
     * @param {number} index - The index.
     * @returns {Paragraph} The result.
     * @private
     */
    insertParagraphAtBlockIndex(index: number): Paragraph {
        const paragraph: Paragraph = new Paragraph(undefined);
        this.insertBlockAt(index, { type: 'paragraph', paragraph });
        return paragraph;
    }
    /**
     * @param {number} index - The index.
     * @returns {Paragraph} The result.
     * @private
     */
    insertParagraph(index: number): Paragraph {
        return this.firstSectionBody().paragraphs.insert(index);
    }
    /**
     * @param {Paragraph} paragraph - The paragraph.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeParagraph(paragraph: Paragraph): void {
        this.firstSectionBody().paragraphs.remove(paragraph);
    }
    /**
     * Removes the body item at `index` (`0…count-1`) on the first section body.
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeBlockAt(index: number): void {
        this.firstSectionBody().removeRawBlockAt(index);
    }
    /**
     * Advanced L3 hatch: Main Document `w:document` tree (API-RULES R5.4).
     * Unstable; prefer semantic properties and `save` / `saveSync`.
     *
     * Always flattens section bodies into one physical `w:body` (TASK-8075/8076).
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const sectionList: ReadonlyArray<Section> = this.sectionsInstance.asArray();
        const bodyBlocks: BlockContent[] = flattenSectionsToBodyBlocks(
            sectionList.map((section: Section, index: number) => ({
                listBlocks: () => section.body.listBlocks(),
                pageSetup: section.internalPageSetupModel(),
                pageSetupXml:
                    index === sectionList.length - 1 &&
                    section.internalPageSetupModel() === undefined
                        ? this.sectPr
                        : undefined,
                replaceItems: (items: ReadonlyArray<BlockContent>) => {
                    section.body.replaceItems(items);
                    // Flatten may append an empty terminator paragraph when a
                    // non-final section ends on a table (or other non-p). Attach
                    // so subsequent mutation does not throw DetachedObjectError.
                    for (const block of items) {
                        if (block.type === 'paragraph') {
                            block.paragraph.attach(section.body);
                        }
                    }
                },
                isLast: index === sectionList.length - 1
            }))
        );
        const bodyChildren: OpenXmlElement[] = serializeBodyBlocks(bodyBlocks);
        const sectPr: OpenXmlElement = this.bodySectPr();
        if (sectPr !== undefined) {
            bodyChildren.push(sectPr);
        }
        const children: OpenXmlElement[] = [];
        if (this.background !== undefined) {
            children.push(this.background);
        }
        children.push(wmlElement('body', { children: bodyChildren }));
        return wmlElement('document', {
            attributes: this.rootExtra.attributes,
            namespaceDeclarations: this.rootExtra.namespaceDeclarations,
            children
        });
    }
    /**
     * Preserved `w:document/w:background` subtree from load, if any.
     *
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     */
    preservedBackground(): OpenXmlElement | undefined {
        return this.background;
    }
    /**
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     * Body-final `w:sectPr`, when present.
     * Serializes a live section-properties model when the sections feature owns it;
     * otherwise returns preserved OOXML from load / XML write-back.
     *
     * Prefers the last section's pageSetup (TASK-8074) over the stored finalSectionModel,
     * so that programmatically modified sections are properly reflected in the output.
     */
    bodySectPr(): OpenXmlElement | undefined {
        // Prefer pageSetup on the last section when dual-held (TASK-8074 bridge).
        // This ensures that changes to the last section's page setup are serialized,
        // rather than a stale finalSectionModel from document construction.
        const sections: ReadonlyArray<Section> = this.sectionsInstance.asArray();
        const last: Section = sections[sections.length - 1];
        const lastModel: SectionPropertiesModel = last == null ? undefined : last.internalPageSetupModel();
        if (lastModel !== undefined) {
            return lastModel.toOpenXml();
        }
        // Fall back to finalSectionModel if the last section has no pageSetup
        if (this.finalSectionModel !== undefined) {
            return this.finalSectionModel.toOpenXml();
        }
        return this.sectPr;
    }
    /**
     * @param {OpenXmlElement | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Replace body-final `w:sectPr` as preserved OOXML.
     * Clears any live section-properties model (XML becomes source of truth again).
     */
    replaceBodySectPr(value: OpenXmlElement | undefined): void {
        this.finalSectionModel = undefined;
        this.sectPr = value;
        const sections: ReadonlyArray<Section> = this.sectionsInstance.asArray();
        const last: Section = sections[sections.length - 1];
        if (last !== undefined) {
            last.setPageSetup(undefined);
        }
    }
    /**
     * @returns {SectionPropertiesModel | undefined} The result.
     * @private
     * Live body-final section properties model (sections feature), if any.
     */
    finalSectionPropertiesModel(): SectionPropertiesModel | undefined {
        if (this.finalSectionModel !== undefined) {
            return this.finalSectionModel;
        }
        const sections: ReadonlyArray<Section> = this.sectionsInstance.asArray();
        const last: Section = sections[sections.length - 1];
        return last == null ? undefined : last.internalPageSetupModel();
    }
    /**
     * @param {SectionPropertiesModel | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Attach or clear the live body-final section properties model.
     * When set, clears preserved `w:sectPr` XML so the model is the sole source of truth.
     * Also seeds {@link Section.pageSetup} on the last section (TASK-8074 dual-hold).
     */
    replaceFinalSectionPropertiesModel(value: SectionPropertiesModel | undefined): void {
        this.finalSectionModel = value;
        if (value !== undefined) {
            this.sectPr = undefined;
        }
        const sections: ReadonlyArray<Section> = this.sectionsInstance.asArray();
        const last: Section = sections[sections.length - 1];
        if (last !== undefined) {
            last.setPageSetup(value);
        }
        if (value !== undefined) {
            notifySectionPropertiesAttached(value, this);
        }
    }
    /**
     * @param {FeatureId} id - The id.
     * @returns {FeaturePartState | undefined} The result.
     * @private
     */
    featurePart(id: FeatureId): FeaturePartState | undefined {
        return this.featureParts.get(id);
    }
    /**
     * @param {FeatureId} id - The id.
     * @param {FeaturePartState} part - The part.
     * @returns {void} Nothing is returned.
     * @private
     */
    setFeaturePart(id: FeatureId, part: FeaturePartState): void {
        this.featureParts.set(id, part);
    }
    /**
     * @returns {OpcPackage} The result.
     * @private
     */
    /**
     * The actual package file format detected from the loaded document part content types.
     *
     * @returns {FileFormatType} The detected file format type.
     * @public
     */
    get actualFileFormatType(): FileFormatType {
        return fileFormatTypeFromFormat(this.inputFormatValue);
    }
    /** @private */
    opcPackage(): OpcPackage {
        return this.pkg;
    }
    /**
     * Serialize the OPC package to bytes in the selected {@link FileFormatType} (defaults to DOCX).
     */
    saveSync(): Uint8Array;
    /**
     * Serialize the OPC package to bytes or base64.
     *
     * @param options - Serialization options including {@link FileFormatType} and base64.
     */
    saveSync(options: SaveOptions & { format: 'base64' }): string;
    saveSync(options: SaveOptions): Uint8Array;
    saveSync(formatType: FileFormatType | FileFormat): Uint8Array;
    saveSync(formatTypeOrOptions?: SaveOptions | FileFormatType | FileFormat): Uint8Array | string {
        const options: SaveOptions | undefined = typeof formatTypeOrOptions === 'object' && formatTypeOrOptions !== null
            ? formatTypeOrOptions
            : (formatTypeOrOptions !== undefined ? { formatType: formatTypeOrOptions as FileFormatType | FileFormat } : undefined);
        const bytes: Uint8Array = this.saveSyncBytes(options);
        if (options != null && options.format === 'base64') {
            return encodeBytesToBase64(bytes);
        }
        return bytes;
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     * Shared package serialization used by `saveSync` overloads and async `save`.
     */
    private saveSyncBytes(options?: SaveOptions): Uint8Array {
        const rawFormat: FileFormatType | FileFormat | undefined = options != null ? options.formatType : undefined;
        let target: FileFormat = 'docx';
        if (rawFormat !== undefined) {
            const resolved: FileFormat | undefined = resolveFileFormat(rawFormat);
            if (resolved === undefined) {
                throw new InvalidArgumentError(`Unsupported formatType: ${String(rawFormat)}`);
            }
            target = resolved;
        }
        // Same gate as document.save: unlicensed saves are marked before serialize.
        if (!validateLicense('docx') && licenseWatermarkApplicator !== undefined) {
            licenseWatermarkApplicator(this);
        }
        materializeFeatureSideEffects(this);
        const name: PartName = officeDocumentPartName(this.pkg);
        let next: OpcPackage = this.pkg;
        const singleParts: Map<FeatureId, FeaturePackagePart> = new Map<FeatureId, FeaturePackagePart>();
        const multiParts: Map<FeatureId, FeatureMultiPackagePart> = new Map<FeatureId, FeatureMultiPackagePart>();
        const packageParts: Map<FeatureId, FeaturePackageLevelPart> = new Map<FeatureId, FeaturePackageLevelPart>();
        for (const [id, part] of this.featureParts) {
            if (isFeatureMultiPackagePart(part)) {
                multiParts.set(id, part);
            }
            else if (isFeaturePackageLevelPart(part)) {
                packageParts.set(id, part);
            }
            else {
                singleParts.set(id, part);
            }
        }
        // Multi-part handlers (headers/footers) reserve sectPr relationship ids before
        // single-part handlers (styles/numbering) allocate new document relationships.
        next = applyFeatureMultiParts(next, name, multiParts);
        next = applyFeatureParts(next, name, singleParts);
        next = applyFeaturePackageParts(next, packageParts);
        const xml: string = serializeXml(this.toOpenXml());
        next = withReplacedPart(next, name, utf8.encode(xml));
        // Keep the in-memory package aligned with what was written. Feature multi-part
        // catalogs clear dirty flags after apply; without this, a later saveSync would
        // start from the pre-apply package and drop embeddings/media/rels (TASK-8056).
        this.pkg = next;
        return saveOpcPackage(withPackageFormat(next, name, target));
    }
    /**
     * Serialize the package to bytes. Resolves with the same result as {@link WordDocument.saveSync}.
     */
    save(): Promise<Uint8Array>;
    /**
     * Save the document under a file name by triggering a browser download.
     *
     * Matches the PDF library `save(filename)` pattern (`Blob` + anchor click).
     * Directory segments are stripped (`./out/report.docx` → `report.docx`).
     * This method does not import Node.js `fs` — a browser bundle must not
     * touch the filesystem. In Node.js, call parameterless {@link WordDocument.save}
     * or {@link WordDocument.saveSync} and write the bytes with the host's own I/O.
     *
     * @param fileName - Browser download file name (for example `Output.docx`).
     * @param formatType - Optional output file format for the downloaded package.
     * @throws InvalidArgumentError when `fileName` is missing or empty
     * @throws IoError when no browser document is available to start the download
     */
    save(filePath: string, formatType?: FileFormatType | FileFormat): Promise<void>;
    /**
     * Serialize the package to a base64 string.
     *
     * @param options - Must include `format: 'base64'`.
     */
    save(options: SaveOptions & { format: 'base64' }): Promise<string>;
    save(options: SaveOptions): Promise<Uint8Array>;
    save(formatType: FileFormatType | FileFormat): Promise<Uint8Array>;
    async save(filePathOrFormatOrOptions?: string | SaveOptions | FileFormatType | FileFormat, formatType?: FileFormatType | FileFormat): Promise<Uint8Array | string | void> {
        let options: SaveOptions | undefined;
        let filePath: string | undefined;
        if (typeof filePathOrFormatOrOptions === 'string') {
            const resolvedFormat: FileFormat | undefined = resolveFileFormat(filePathOrFormatOrOptions);
            if (resolvedFormat !== undefined && formatType === undefined) {
                options = { formatType: resolvedFormat };
            } else {
                filePath = filePathOrFormatOrOptions;
                if (formatType !== undefined) {
                    options = { formatType };
                }
            }
        } else if (typeof filePathOrFormatOrOptions === 'object' && filePathOrFormatOrOptions !== null) {
            options = filePathOrFormatOrOptions;
        }

        const bytes: Uint8Array = this.saveSyncBytes(options);
        if (filePath === undefined) {
            if (options != null && options.format === 'base64') {
                return encodeBytesToBase64(bytes);
            }
            return bytes;
        }
        await writeDocumentToPath(filePath, bytes);
    }
}
/**
 * Page `document` used to start a filename download.
 * Does not probe Node.js `fs` — that module must stay out of the browser bundle.
 *
 * @returns {Object} The result.
 * @private
 */
function browserDocument(): {
    createElementNS(namespaceURI: string, qualifiedName: string): {
        download: string;
        href: string;
        dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void }): boolean;
    };
    createEvent(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void };
} | undefined {
    const globalObject: { window?: { document?: { createElementNS?(namespaceURI: string, qualifiedName: string): { download: string; href: string; dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void; }): boolean; }; createEvent?(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void; }; }; }; } = Function('return this')() as {
        window?: {
            document?: {
                createElementNS?(namespaceURI: string, qualifiedName: string): {
                    download: string;
                    href: string;
                    dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void }): boolean;
                };
                createEvent?(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void };
            };
        };
    };
    const host: {
        document?: {
            createElementNS?(
                namespaceURI: string,
                qualifiedName: string
            ): {
                download: string;
                href: string;
                dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void }): boolean;
            };
            createEvent?(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void };
        };
    } = globalObject.window;
    if (host == null || host.document == null || typeof host.document.createElementNS !== 'function') {
        return undefined;
    }
    return host.document as {
        createElementNS(namespaceURI: string, qualifiedName: string): {
            download: string;
            href: string;
            dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void }): boolean;
        };
        createEvent(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void };
    };
}

/**
 * Download file name from a path-shaped argument (`./out/Output.docx` → `Output.docx`).
 *
 * @param {string} filePath - The file path.
 * @returns {string} The result.
 * @private
 */
function downloadFileName(filePath: string): string {
    const trimmed: string = filePath.trim();
    const parts: string[] = trimmed.split(/[/\\]/);
    const name: string = parts[parts.length - 1];
    return name !== undefined && name.length > 0 ? name : trimmed;
}

/**
 * Trigger a browser download of the package bytes.
 * Same approach as the PDF library filename save (Blob + anchor click).
 *
 * @param {string} fileName - The file name.
 * @param {Uint8Array} bytes - The bytes.
 * @param {Object} doc - The doc.
 * @returns {void} Nothing is returned.
 * @private
 */
function downloadDocumentInBrowser(fileName: string, bytes: Uint8Array, doc: {
    createElementNS(namespaceURI: string, qualifiedName: string): {
        download: string;
        href: string;
        dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void }): boolean;
    };
    createEvent(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void };
}): void {
    const host: { Blob: new (parts: Uint8Array[], options: { type: string; }) => object; navigator?: { msSaveBlob?: (blob: object, name: string) => boolean; }; URL: { createObjectURL(blob: object): string; revokeObjectURL(url: string): void; }; setTimeout(handler: () => void, timeout: number): number; } = Function('return this')() as {
        Blob: new (parts: Uint8Array[], options: { type: string }) => object;
        navigator?: { msSaveBlob?: (blob: object, name: string) => boolean };
        URL: { createObjectURL(blob: object): string; revokeObjectURL(url: string): void };
        setTimeout(handler: () => void, timeout: number): number;
    };
    const blob: object = new host.Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const nav: { msSaveBlob?: (blob: object, name: string) => boolean; } = host.navigator;
    if (nav != null && typeof nav.msSaveBlob === 'function') {
        nav.msSaveBlob(blob, fileName);
        return;
    }
    const url: string = host.URL.createObjectURL(blob);
    const link: { download: string; href: string; dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void; }): boolean; } = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    link.download = fileName;
    link.href = url;
    const event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void; } = doc.createEvent('MouseEvent');
    event.initEvent('click', true, true);
    link.dispatchEvent(event);
    host.setTimeout(function (): void {
        host.URL.revokeObjectURL(url);
    }, 0);
}

/**
 * @param {string} filePath - The file path.
 * @param {Uint8Array} bytes - The bytes.
 * @returns {Promise<void>} The result.
 * @private
 * Browser download of the file name (PDF `save(filename)` pattern).
 * Never calls Node.js `fs` — Vite externalizes that module and throws
 * `Cannot access "fs.writeFile"` when the client bundle evaluates it.
 */
function writeDocumentToPath(filePath: string, bytes: Uint8Array): Promise<void> {
    if (typeof filePath !== 'string' || filePath.trim().length === 0) {
        throw new InvalidArgumentError('save(fileName) requires a non-empty file name string');
    }
    const browserDoc: {
        createElementNS(
            namespaceURI: string,
            qualifiedName: string
        ): {
            download: string;
            href: string;
            dispatchEvent(event: { initEvent(type: string, bubbles: boolean, cancelable: boolean): void }): boolean;
        };
        createEvent(eventInterface: string): { initEvent(type: string, bubbles: boolean, cancelable: boolean): void };
    } = browserDocument();
    if (browserDoc === undefined) {
        throw new IoError(
            'save(fileName) downloads in the browser and does not write a filesystem path. Use save() or saveSync() and write the bytes from application code.'
        );
    }
    downloadDocumentInBrowser(downloadFileName(filePath), bytes, browserDoc);
    return Promise.resolve();
}
function toUint8Array(data: Uint8Array | ArrayBuffer): Uint8Array {
    if (data instanceof Uint8Array) {
        return data;
    }
    return new Uint8Array(data);
}

function openDocumentAsync(
    dataOrPath: Uint8Array | ArrayBuffer | string | { arrayBuffer(): Promise<ArrayBuffer> },
    options?: LoadOptions & { format: 'base64' }
): Promise<WordDocument> {
    const bytesPromise: Promise<Uint8Array> = isBlobLike(dataOrPath)
        ? dataOrPath.arrayBuffer().then(function (buffer: ArrayBuffer): Uint8Array {
            return toUint8Array(buffer);
        })
        : new Promise<Uint8Array>(function (resolve) {
            resolve(resolveOpenInputToBytes(dataOrPath as Uint8Array | ArrayBuffer | string, options as LoadOptions & { format: 'base64' } | undefined));
        });
    return bytesPromise.then(async function (bytes: Uint8Array): Promise<WordDocument> {
        if (detectFormat(bytes) !== 'html') {
            return WordDocument.openSync(bytes, options);
        }
        // For HTML: use the async converter which handles image downloading at the
        // parser/mapper level (not here in document.ts). This is cleaner: all the
        // HTML parsing and image embedding logic stays together in html-to-docio/index.ts.
        const converter: HtmlAsyncConverter | undefined = htmlAsyncConverter();
        if (converter === undefined) {
            throw new Error('HTML async conversion is not registered. Import the package root (src/index) once before opening HTML content.');
        }
        const doc = WordDocument.create();
        const htmlText = new TextDecoder().decode(bytes);
        // Supplied images (if any) are published through the image mapper so the
        // converter/parser can read them; the converter downloads the rest automatically.
        _ImageMapper.setResolvedImages(undefined);
        try {
            await converter(htmlText, doc);
        } finally {
            _ImageMapper.setResolvedImages(undefined);
        }
        return doc;
    });
}

function isBlobLike(value: unknown): value is { arrayBuffer(): Promise<ArrayBuffer> } {
    if (typeof value !== 'object' || value === null || !('arrayBuffer' in value)) {
        return false;
    }
    return typeof (value as { arrayBuffer?: unknown }).arrayBuffer === 'function';
}

function stripBase64DataUrlPrefix(value: string): string {
    const comma: number = value.indexOf(',');
    if (comma >= 0 && /^data:/i.test(value) && /;base64/i.test(value.slice(0, comma))) {
        return value.slice(comma + 1);
    }
    return value;
}

function decodeBase64ToBytes(base64: string): Uint8Array {
    if (typeof base64 !== 'string' || base64.trim().length === 0) {
        throw new InvalidArgumentError('open(..., { format: \'base64\' }) requires a non-empty base64 string');
    }
    const payload: string = stripBase64DataUrlPrefix(base64).replace(/\s+/g, '');
    try {
        return decodeBase64(payload);
    } catch (err) {
        throw new InvalidArgumentError('Invalid base64 payload for open(..., { format: \'base64\' })', { cause: err });
    }
}

function encodeBytesToBase64(bytes: Uint8Array): string {
    return encodeBase64(bytes);
}

function resolveOpenInputToBytes(dataOrPath: Uint8Array | ArrayBuffer | string, options?: LoadOptions & { format: 'base64' }): Uint8Array {
    if (typeof dataOrPath !== 'string') {
        return toUint8Array(dataOrPath);
    }
    if (options != null && options.format === 'base64') {
        return decodeBase64ToBytes(dataOrPath);
    }
    throw pathOpenRemoved();
}

function pathOpenRemoved(): InvalidArgumentError {
    return new InvalidArgumentError(
        'open/load does not read a filesystem path. Pass Uint8Array, ArrayBuffer, base64 with { format: \'base64\' }, or a File/Blob to openAsync/loadAsync.'
    );
}

function bindDocumentToFeatureBlock(value: unknown, document: WordDocument): void {
    if (typeof value !== 'object' || value === null || !('bindDocument' in value)) {
        return;
    }
    const bindDocument: (doc: WordDocument) => void = (value as {
        bindDocument: (doc: WordDocument) => void;
    }).bindDocument;
    bindDocument.call(value, document);
}
function mergeFeatureParts(
    single: Map<FeatureId, FeaturePackagePart>,
    multi: Map<FeatureId, FeatureMultiPackagePart>,
    packageLevel: Map<FeatureId, FeaturePackageLevelPart>
): Map<FeatureId, FeaturePartState> {
    const out: Map<FeatureId, FeaturePartState> = new Map<FeatureId, FeaturePartState>();
    for (const [id, part] of single) {
        out.set(id, part);
    }
    for (const [id, part] of multi) {
        out.set(id, part);
    }
    for (const [id, part] of packageLevel) {
        out.set(id, part);
    }
    return out;
}

// Re-export Body from body.ts so existing `import { Document, Body } from '.../document'` keeps working.
export { Body } from './body';
/** @public Compatibility alias for {@link WordDocument}. */
export type Document = WordDocument;

