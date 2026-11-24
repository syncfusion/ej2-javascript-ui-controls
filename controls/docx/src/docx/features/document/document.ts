import { DetachedObjectError, InvalidArgumentError, IoError, PackageError, SecurityError } from '../../core/errors/docx-error';
import { inspectMarkupCompatibility } from '../../core/mc/index';
import { createTransitionalWordPackage, loadOpcPackage, officeDocumentPartName, partByName, saveOpcPackage, withReplacedPart, detectPackageFormat, fileFormatTypeFromFormat, isFileFormat, resolveFileFormat, withPackageFormat, OpcPackage, FileFormat, FileFormatType } from '../../core/opc/index';
import { documentBody } from '../../core/preservation/index';
import { parseXml, serializeXml, closePartNamespaces, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
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
import { ImportOptions, isValidImportOptions, normalizeImportOptions, NormalizedImportOptions } from './import-options';
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
import {
    decryptPackage, encryptPackage, isEncryptedContainer, MAX_PASSWORD_LENGTH,
    EncryptedPackageError, InvalidPasswordError, PackageLimitError, UnsupportedEncryptionError
} from '@syncfusion/ej2-office-common';
import { resolveResourceLimits } from '../../core/security/limits';

/**
 * HTML → WordDocument conversion callback (sync). Registered by the HTML conversion
 * barrel at load time so the owning module has no static import of the mapper
 * (which imports document types and would create a load-time cycle).
 *
 * @private
 */
export type HtmlConverter = (html: string, doc: WordDocument) => void;

/**
 * HTML → WordDocument conversion callback (async). Registered by the HTML conversion
 * barrel for openAsync path. Handles image downloads inside the parser/mapper level.
 *
 * @private
 */
export type HtmlAsyncConverter = (html: string, doc: WordDocument) => Promise<void>;

/**
 * Trial-license watermark callback. Registered by `watermark/license-register` so
 * the owning module has no static import of the watermark module (load-time cycle).
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

/**
 * Normalized request passed to the registered import handler.
 *
 * @private
 */
export interface ImportRequest {
    readonly addMissingStyles: boolean;
    readonly generateOnConflict: boolean;
    readonly options: NormalizedImportOptions;
    readonly join: boolean;
}

/**
 * @private
 */
export type ImportContentHandler = (destination: WordDocument, source: WordDocument, request: ImportRequest) => void;

let importContentHandler: ImportContentHandler | undefined;

/**
 * Registers the import implementation (kept out of this module to avoid load-time cycles with styles and numbering).
 *
 * @param {ImportContentHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerImportContentHandler(handler: ImportContentHandler): void {
    importContentHandler = handler;
}

/**
 * @private
 */
export type CloneDocumentHandler = (source: WordDocument) => WordDocument;

let cloneDocumentHandler: CloneDocumentHandler | undefined;

/**
 * Registers the clone implementation (kept out of this module to avoid load-time cycles).
 *
 * @param {CloneDocumentHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerCloneDocumentHandler(handler: CloneDocumentHandler): void {
    cloneDocumentHandler = handler;
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
 * @returns {void} Nothing.
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
 * Defines the options that control how a document is saved.
 *
 * @public
 */
export interface SaveOptions {
    /** Specifies that the document is returned as a base64 string instead of bytes when set to `'base64'`. */
    format?: 'base64';
    /**
     * Specifies the output file format. The default value is `FileFormatType.Docx`.
     * Accepts a {@link FileFormatType} value or a string such as `'docx'`, `'dotx'`, `'docm'`, or `'dotm'`.
     */
    formatType?: FileFormatType | FileFormat;
}

/**
 * Represents a Word document.
 *
 * Use {@link WordDocument.open}, {@link WordDocument.openSync}, or {@link WordDocument.openAsync} to load a document from bytes, a base64 string, or a browser `File` or `Blob`.
 * Use {@link WordDocument.save} or {@link WordDocument.saveSync} to save the document as bytes, a base64 string, or a browser download.
 * The content of the document is available through {@link Document.sections}.
 */
export class WordDocument {
    private pkg: OpcPackage;
    private inputFormatValue: FileFormat = 'docx';
    private rootExtra: Pick<OpenXmlElement, 'attributes' | 'namespaceDeclarations'>;
    private background: OpenXmlElement | undefined;
    /** Ordered sections — sole main-story owners. */
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
    /**
     * Private collection of all fields in the document.
     * Maintained during load/save and field creation/deletion.
     *
     * @private
     */
    private readonly fieldCollectionValue: Array<any> = [];
    /**
     * Flag to prevent recursive updateDocumentFields() calls.
     *
     * @private
     */
    private isUpdatingFields: boolean = false;
    /**
     * Temporary sequence field result cache during field updates.
     * Maps caption name to current sequence number (global state).
     *
     * @private
     */
    public sequenceFieldResults: Map<string, number> | undefined;
    private seqHeadingResetLevels: Map<string, number> = new Map<string, number>();
    private seqCollectingLevels: boolean = false;
    /**
     * Maps each SEQ field to its calculated sequence value.
     * Used during pre-processing to store the value each field should display.
     *
     * @private
     */
    private sequenceFieldValues: WeakMap<any, number> | undefined;

    /**
     * Create an independent clone of this document.
     *
     * Performs deep cloning of all document content:
     * - Main body (sections, paragraphs, tables, content controls, etc.)
     * - Styles and numbering (paragraph and character styles, list definitions)
     * - Images and linked resources (embedded media, hyperlinks)
     * - Document properties (title, author, subject, etc.)
     * - Headers and footers (all section-specific headers/footers)
     *
     * The cloned document is fully independent with no shared mutable state.
     * All references, styles, and resources are remapped for the destination.
     *
     * @returns {WordDocument} A new, independent document with all content and resources.
     * @throws {InvalidArgumentError} when the default package entry is not loaded, so cloning is unavailable.
     * @public
     */
    clone(): WordDocument {
        if (cloneDocumentHandler === undefined) {
            throw new InvalidArgumentError('clone requires the default package entry to be loaded');
        }
        const copy: WordDocument = cloneDocumentHandler(this);
        copy.inputFormatValue = this.inputFormatValue;
        if (this.background !== undefined) {
            copy.background = JSON.parse(JSON.stringify(this.background)) as OpenXmlElement;
        }
        return copy;
    }

    /**
     * Imports the content of another document after the existing content of this document.
     *
     * The source is not changed. Imported content is a copy. A failed import is not rolled back.
     *
     * @param {WordDocument} source - The document to import from.
     * @param {boolean} importStyles - `true` (default) merges styles and resolves same-name
     * conflicts with a generated style name; `false` imports no style definitions.
     * @param {boolean} mergeLastAndFirstSections - When `true`, the first source section is joined to the
     * destination's last section.
     * @returns {void} Nothing is returned.
     * @throws {InvalidArgumentError} when an argument is invalid. The destination is not changed.
     * @public
     */
    importContent(source: WordDocument, importStyles?: boolean, mergeLastAndFirstSections?: boolean): void;
    /**
     * Imports the content of another document after the existing content of this document,
     * using {@link ImportOptions} flags to select the style mode and list handling.
     *
     * The source is not changed. Imported content is a copy. A failed import is not rolled back.
     *
     * @param {WordDocument} source - The document to import from.
     * @param {ImportOptions} importOptions - Style mode and list flags; no document-level style merge is performed.
     * @param {boolean} mergeLastAndFirstSections - When `true`, the first source section is joined to the
     * destination's last section. Has no effect with {@link ImportOptions.KeepTextOnly}.
     * @returns {void} Nothing is returned.
     * @throws {InvalidArgumentError} when an argument is invalid. The destination is not changed.
     * @public
     */
    importContent(source: WordDocument, importOptions: ImportOptions, mergeLastAndFirstSections?: boolean): void;
    importContent(source: WordDocument, second?: boolean | ImportOptions, join?: boolean): void {
        if (!(source instanceof WordDocument)) {
            throw new InvalidArgumentError('source must be a WordDocument');
        }
        if (join !== undefined && typeof join !== 'boolean') {
            throw new InvalidArgumentError('mergeLastAndFirstSections must be a boolean');
        }
        let request: ImportRequest;
        if (second === undefined || typeof second === 'boolean') {
            const styles: boolean = second !== false;
            request = {
                addMissingStyles: styles,
                generateOnConflict: styles,
                options: normalizeImportOptions(ImportOptions.UseDestinationStyles),
                join: join === true
            };
        } else if (isValidImportOptions(second)) {
            request = {
                addMissingStyles: true,
                generateOnConflict: false,
                options: normalizeImportOptions(second),
                join: join === true
            };
        } else {
            throw new InvalidArgumentError('importStyles must be a boolean or a valid ImportOptions value');
        }
        if (importContentHandler === undefined) {
            throw new InvalidArgumentError('importContent requires the default package entry to be loaded');
        }
        importContentHandler(this, source, request);
    }

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
     * Minimal Transitional package with one empty paragraph.
     *
     * Builds the in-memory document and package scaffold directly — does not
     * serialize then re-parse as the sole create path.
     *
     * @returns {WordDocument} - Returns the WordDocument.
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
        // Feature post-load hooks (comments main-story elevation / D14).
        // Duck-typed so the owning module does not value-import `features/comments` (that
        // cycle left `Paragraph` undefined when comments attached prototype methods).
        for (const featurePart of featureParts.values()) {
            const part: AfterMainDocumentLoadPart = featurePart as AfterMainDocumentLoadPart;
            if (part.afterMainDocumentLoad != null) {
                part.afterMainDocumentLoad(document);
            }
        }
        // Register all fields in the document (after fields are reconstructed during parsing)
        document.registerAllFieldsInDocument();
        return document;
    }
    /**
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @param {SectionPropertiesModel | OpenXmlElement | undefined} trailingSectPr - The trailing sect pr.
     * @returns {void} Nothing is returned.
     * @private
     * Partition body blocks into logical sections and attach them.
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
     * paragraph/body section properties.
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
     * Opens a Word document from bytes.
     *
     * Returns the document directly. Use {@link WordDocument.openAsync} to get a promise instead.
     *
     * @param {Uint8Array | ArrayBuffer} data - Specifies the document bytes (`Uint8Array` or `ArrayBuffer`).
     * @param {LoadOptions} options - Specifies the optional {@link LoadOptions.limits} overrides.
     * @throws PackageError for ZIP/OPC failures.
     * @throws SecurityError when a resource limit is exceeded.
     * @returns {WordDocument} - Returns the loaded document.
     * @throws XmlError for malformed Main Document XML.
     */
    static open(data: Uint8Array | ArrayBuffer, options?: LoadOptions | string): WordDocument;
    /**
     * Opens a Word document from a base64 string. The `format` option must be `'base64'`.
     *
     * A leading `data:...;base64,` prefix is ignored.
     *
     * @param {string} base64 - Specifies the base64-encoded document.
     * @param {LoadOptions & { format: 'base64' }} options - Specifies the load options including `format: 'base64'`.
     * @returns {WordDocument} - Returns the loaded document.
     * @throws InvalidArgumentError when the payload is not valid base64
     */
    static open(base64: string, options: LoadOptions & { format: 'base64' }): WordDocument;
    static open(dataOrPath: Uint8Array | ArrayBuffer | string, optionsOrPassword?: (LoadOptions & { format: 'base64' }) | string): WordDocument {
        const options: (LoadOptions & { format: 'base64' }) | undefined = normalizeLoadOptions(optionsOrPassword);
        // Narrow for TS 3.3 overload resolution (string vs binary packages).
        if (typeof dataOrPath === 'string') {
            if (options !== undefined && options.format === 'base64') {
                const base64Options: LoadOptions & { format: 'base64' } = {
                    format: 'base64',
                    limits: options.limits,
                    password: options.password
                };
                return WordDocument.openSync(dataOrPath, base64Options);
            }
            return WordDocument.openSync(dataOrPath, options);
        }
        return WordDocument.openSync(dataOrPath, options);
    }
    /**
     * Opens a Word or HTML document asynchronously.
     *
     * HTML input is converted to a Word document. For HTML input, images referenced by `http:` or `https:` URLs
     * that are not supplied in {@link LoadOptions.images} are downloaded automatically.
     * Only PNG and JPEG images up to 10 MB are embedded. Other images are replaced by their alternative text.
     *
     * @param {Uint8Array | ArrayBuffer} data - Specifies the bytes of the document.
     * @param {LoadOptions | string} options - Specifies the options that control how the document is loaded, or the password of an encrypted document.
     * @returns {Promise<WordDocument>} - Returns a promise that resolves to the loaded document.
     * @throws PackageError with code `encryption/password-required` when the document is encrypted and no password is supplied.
     * @throws PackageError with code `encryption/invalid-password` when the password is empty or incorrect.
     * @throws PackageError with code `encryption/unsupported` or `encryption/invalid-package` when the encryption is not supported or the encrypted data is damaged.
     * @example
     * const document = await Document.openAsync(data, 'syncfusion');
     * @public
     */
    static openAsync(data: Uint8Array | ArrayBuffer, options?: LoadOptions | string): Promise<WordDocument>;
    /**
     * Opens a Word or HTML document from a browser `File` or `Blob`.
     *
     * @param {Object} file - Specifies the file or blob that contains the document.
     * @param {LoadOptions | string} options - Specifies the options that control how the document is loaded, or the password of an encrypted document.
     * @returns {Promise<WordDocument>} - Returns a promise that resolves to the loaded document.
     * @public
     */
    static openAsync(file: { arrayBuffer(): Promise<ArrayBuffer> }, options?: LoadOptions | string): Promise<WordDocument>;
    /**
     * Opens a Word or HTML document from a base64 string.
     *
     * @param {string} base64 - Specifies the base64-encoded document.
     * @param {LoadOptions & { format: 'base64' }} options - Specifies the load options. The `format` value must be `'base64'`.
     * @returns {Promise<WordDocument>} - Returns a promise that resolves to the loaded document.
     * @public
     */
    static openAsync(base64: string, options: LoadOptions & { format: 'base64' }): Promise<WordDocument>;
    static openAsync(
        dataOrPath: Uint8Array | ArrayBuffer | string | { arrayBuffer(): Promise<ArrayBuffer> },
        optionsOrPassword?: (LoadOptions & { format: 'base64' }) | string
    ): Promise<WordDocument> {
        return openDocumentAsync(dataOrPath, normalizeLoadOptions(optionsOrPassword));
    }
    /**
     * Opens a Word document from bytes synchronously.
     *
     * @param {Uint8Array | ArrayBuffer} data - Specifies the document bytes (`Uint8Array` or `ArrayBuffer`).
     * @param {LoadOptions | string} options - Specifies the optional {@link LoadOptions} or the password of an encrypted document.
     * @returns {WordDocument} - Returns the loaded document.
     */
    static openSync(data: Uint8Array | ArrayBuffer, options?: LoadOptions | string): WordDocument;
    /**
     * Opens a Word document from a base64 string synchronously. The `format` option must be `'base64'`.
     *
     * @param {string} base64 - Specifies the base64-encoded document.
     * @param {LoadOptions & { format: 'base64' }} options - Specifies the load options including `format: 'base64'`.
     * @returns {WordDocument} - Returns the loaded document.
     */
    static openSync(base64: string, options: LoadOptions & { format: 'base64' }): WordDocument;
    static openSync(dataOrPath: Uint8Array | ArrayBuffer | string, optionsOrPassword?: (LoadOptions & { format: 'base64' }) | string): WordDocument {
        const options: (LoadOptions & { format: 'base64' }) | undefined = normalizeLoadOptions(optionsOrPassword);
        let bytes: Uint8Array = resolveOpenInputToBytes(dataOrPath, options);
        let openPassword: string | undefined;
        if (isEncryptedContainer(bytes)) {
            bytes = decryptDocumentBytes(bytes, options);
            openPassword = options !== undefined ? options.password : undefined;
        }
        const inputFormat: string = detectFormat(bytes);
        if (inputFormat === 'html') {
            const converter: HtmlConverter | undefined = htmlConverter();
            if (converter === undefined) {
                throw new Error('HTML conversion is not registered. Import the package root (src/index) once before opening HTML content.');
            }
            const doc: WordDocument = WordDocument.create();
            const htmlText: string = new TextDecoder().decode(bytes);
            converter(htmlText, doc);
            return doc;
        } else if (inputFormat === 'docx') {
            const loaded: WordDocument = WordDocument.fromPackage(
                loadOpcPackage(bytes, options == null ? undefined : options.limits),
                options == null ? undefined : options.limits
            );
            if (openPassword !== undefined) {
                encryptionPasswords.set(loaded, openPassword);
            }
            return loaded;
        } else {
            throw new Error('Unsupported format. The provided content is neither a valid HTML document nor a DOCX document.');
        }
    }
    /**
     * Alias of {@link WordDocument.open} (legacy / `load` naming).
     *
     * @private
     */
    static load(data: Uint8Array | ArrayBuffer, options?: LoadOptions | string): WordDocument;
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
     * @param {LoadOptions | string} [optionsOrPassword] - Optional load options or the password of an encrypted document.
     * @returns {WordDocument} Returns the loaded document.
     * @private
     */
    static load(
        dataOrPath: Uint8Array | ArrayBuffer | string,
        optionsOrPassword?: (LoadOptions & { format: 'base64' }) | string
    ): WordDocument {
        const options: (LoadOptions & { format: 'base64' }) | undefined = normalizeLoadOptions(optionsOrPassword);
        if (typeof dataOrPath === 'string') {
            if (options !== undefined && options.format === 'base64') {
                const base64Options: LoadOptions & { format: 'base64' } = {
                    format: 'base64',
                    limits: options.limits,
                    password: options.password
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
    static loadAsync(data: Uint8Array | ArrayBuffer, options?: LoadOptions | string): Promise<WordDocument>;
    /**
     * Loads a document from a browser file asynchronously.
     *
     * @param {object} file - The file to load.
     * @param {LoadOptions | string} [optionsOrPassword] - Optional load options or the password of an encrypted document.
     * @returns {Promise<WordDocument>} Returns the loaded document.
     * @private
     */
    static loadAsync(file: { arrayBuffer(): Promise<ArrayBuffer> }, options?: LoadOptions | string): Promise<WordDocument>;
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
     * @param {LoadOptions | string} [optionsOrPassword] - Optional load options or the password of an encrypted document.
     * @returns {Promise<WordDocument>} Returns the loaded document.
     * @private
     */
    static loadAsync(
        dataOrPath: Uint8Array | ArrayBuffer | string | { arrayBuffer(): Promise<ArrayBuffer> },
        optionsOrPassword?: (LoadOptions & { format: 'base64' }) | string
    ): Promise<WordDocument> {
        return openDocumentAsync(dataOrPath, normalizeLoadOptions(optionsOrPassword));
    }
    /**
     * Alias of {@link WordDocument.openSync} (legacy / `loadSync` naming).
     *
     * @private
     */
    static loadSync(data: Uint8Array | ArrayBuffer, options?: LoadOptions | string): WordDocument;
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
     * @param {LoadOptions | string} [optionsOrPassword] - Optional load options or the password of an encrypted document.
     * @returns {WordDocument} Returns the loaded document.
     * @private
     */
    static loadSync(
        dataOrPath: Uint8Array | ArrayBuffer | string,
        optionsOrPassword?: (LoadOptions & { format: 'base64' }) | string
    ): WordDocument {
        const options: (LoadOptions & { format: 'base64' }) | undefined = normalizeLoadOptions(optionsOrPassword);
        if (typeof dataOrPath === 'string') {
            if (options !== undefined && options.format === 'base64') {
                const base64Options: LoadOptions & { format: 'base64' } = {
                    format: 'base64',
                    limits: options.limits,
                    password: options.password
                };
                return WordDocument.openSync(dataOrPath, base64Options);
            }
            return WordDocument.openSync(dataOrPath, options);
        }
        return WordDocument.openSync(dataOrPath, options);
    }
    /**
     * Gets the ordered document sections. Sole main-story entry.
     *
     * @public
     */
    get sections(): Sections {
        return this.sectionsInstance;
    }
    /**
     * Gets the last section.
     *
     * Equivalent to `sections[sections.count - 1]`. The document always has at least one section.
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
     * Gets the last paragraph.
     *
     * Does not walk paragraphs nested in tables or text boxes. Authored documents always have at least one body paragraph per section.
     *
     * @throws DetachedObjectError when the last section has no block-level
     * paragraph (malformed loaded package).
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
     * Gets the body.
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
     * @returns {Paragraph} - Returns the appended {@link Paragraph}.
     *
     * @param {Object} options - Specifies the options.
     * @public
     */
    appendParagraph(options?: {
        readonly style?: string;
        readonly text?: string;
    }): Paragraph {
        return this.body.appendParagraph(options);
    }
    /**
     * Appends a new section after the last section.
     *
     * The page setup of the previous last section is copied to the new section.
     *
     * @returns {Section} - Returns the new {@link Section}.
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
    owningDocument(): WordDocument {
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
     * Always flattens section bodies into one physical `w:body`.
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
            namespaceDeclarations: closePartNamespaces(this.rootExtra.namespaceDeclarations, children, this.rootExtra.attributes),
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
     * Prefers the last section's pageSetup over the stored finalSectionModel,
     * so that programmatically modified sections are properly reflected in the output.
     */
    bodySectPr(): OpenXmlElement | undefined {
        // Prefer pageSetup on the last section when dual-held.
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
        // The last section's model wins: sections appended after load (e.g. imported) replace the final one.
        const sections: ReadonlyArray<Section> = this.sectionsInstance.asArray();
        const last: Section = sections[sections.length - 1];
        const lastModel: SectionPropertiesModel | undefined = last == null ? undefined : last.internalPageSetupModel();
        return lastModel !== undefined ? lastModel : this.finalSectionModel;
    }
    /**
     * @param {SectionPropertiesModel | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Attach or clear the live body-final section properties model.
     * When set, clears preserved `w:sectPr` XML so the model is the sole source of truth.
     * Also seeds {@link Section.pageSetup} on the last section.
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
     * Gets the actual package file format detected from the loaded document part content types.
     *
     * @returns {FileFormatType} Returns the detected file format type.
     * @public
     */
    get actualFileFormatType(): FileFormatType {
        return fileFormatTypeFromFormat(this.inputFormatValue);
    }
    /**
     * @returns {OpcPackage} The result of the operation.
     * @private
     */
    opcPackage(): OpcPackage {
        return this.pkg;
    }
    /**
     * Updates all supported field results in the document.
     *
     * Iterates through the document's field collection and updates each field
     * based on its type and the current document state. Supported fields include:
     * - Date, Time, CreateDate
     * - Formula, Expression
     * - Comparison and conditional fields
     * - Document properties (Title, Subject, Author, etc.)
     * - Section numbering
     * - Sequence fields
     * - Reference fields
     * - And others per ECMA-376-1 specification
     *
     * Page-dependent fields (PAGE, NUMPAGES, SECTIONPAGES, PAGEREF) and
     * content-generation fields (TOC, INDEX, TOA) are preserved without change.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    public updateDocumentFields(): void {
        // Guard against recursive calls
        if (this.isUpdatingFields) {
            return;
        }

        this.isUpdatingFields = true;
        this.sequenceFieldResults = new Map<string, number>();
        this.sequenceFieldValues = new WeakMap<any, number>();

        try {
            const fields: Array<any> = this.getInternalFieldsSnapshot();

            // Reset updated flags
            for (const field of fields) {
                if (field != null && typeof field === 'object' && 'isUpdated' in field) {
                    field.isUpdated = false;
                }
            }

            // CRITICAL: Pre-process SEQ fields in document order to establish correct sequence state
            // This ensures sequence numbers are calculated from the start of the document,
            // regardless of when individual fields call their update() methods.
            // Also populates sequenceFieldValues WeakMap with each field's specific value.
            this.updateSequenceFieldsInDocumentOrder();

            // First pass: supported non-REF fields
            for (const field of fields) {
                if (field == null || typeof field !== 'object') {
                    continue;
                }
                if (field.isUpdated || field.fieldType === 'REF') {
                    continue;
                }
                if (typeof field.update === 'function') {
                    try {
                        field.update();
                    } catch (err) {
                        // Isolate field failures and continue
                    }
                }
            }

            // Second pass: REF fields after their dependencies
            for (const field of fields) {
                if (field == null || typeof field !== 'object') {
                    continue;
                }
                if (field.isUpdated || field.fieldType !== 'REF') {
                    continue;
                }
                if (typeof field.update === 'function') {
                    try {
                        field.update();
                    } catch (err) {
                        // Isolate field failures and continue
                    }
                }
            }
        } finally {
            if (this.sequenceFieldResults !== undefined) {
                this.sequenceFieldResults.clear();
            }
            this.sequenceFieldResults = undefined;
            this.sequenceFieldValues = undefined;
            this.seqHeadingResetLevels.clear();
            this.isUpdatingFields = false;
        }
    }

    /**
     * Update all SEQ fields in document order.
     *
     * This traversal ensures sequence numbers are calculated from the beginning of the document,
     * as specified by the SEQ field standard. The sequence cache is populated in document order
     * before any individual field's update() method is called.
     *
     * Traversal order:
     * - Sections
     * - Body content (paragraphs, tables)
     * - Table rows and cells
     * - Headers and footers
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateSequenceFieldsInDocumentOrder(): void {
        // Pre-scan: \s levels must be known before the headings that precede the field are visited.
        this.seqCollectingLevels = true;
        try {
            for (const section of this.sections) {
                this.visitSeqFieldsInBody(section.body);
            }
        } finally {
            this.seqCollectingLevels = false;
        }
        // Visit main document body
        for (const section of this.sections) {
            this.visitSeqFieldsInBody(section.body);
            // TODO: Visit headers and footers when supported
        }
    }

    /**
     * Visit all SEQ fields in a body (main document, header, footer).
     * Processes them in document order and updates the sequence cache.
     *
     * @param {any} body - The body.
     * @returns {void} Nothing is returned.
     * @private
     */
    private visitSeqFieldsInBody(body: any): void {
        if (body == null || typeof body !== 'object') {
            return;
        }

        // Get items collection - handle both BodyItemCollection and arrays
        let items: any[] | undefined;
        if (Array.isArray(body.items)) {
            items = body.items;
        } else if (body.items != null && typeof body.items === 'object' && typeof body.items.toArray === 'function') {
            items = body.items.toArray();
        }

        if (!Array.isArray(items)) {
            return;
        }

        for (const block of items) {
            if (block == null || typeof block !== 'object') {
                continue;
            }
            if (block.type === 'paragraph' && block.paragraph != null) {
                this.visitSeqFieldsInParagraph(block.paragraph);
            } else if (block.type === 'table' && block.table != null) {
                this.visitSeqFieldsInTable(block.table);
            } else if ('rows' in block) {
                this.visitSeqFieldsInTable(block);
            } else if ('items' in block) {
                this.visitSeqFieldsInParagraph(block);
            }
        }
    }

    /**
     * Visit all SEQ fields in a paragraph in document order.
     *
     * @param {any} paragraph - The paragraph.
     * @returns {void} Nothing is returned.
     * @private
     */
    private visitSeqFieldsInParagraph(paragraph: any): void {
        if (paragraph == null || typeof paragraph !== 'object') {
            return;
        }

        // \s switch: a heading of level L restarts every sequence whose \s level is >= L
        const headingMatch: RegExpExecArray | null = /^heading\s*([1-9])$/i.exec(String(paragraph.styleId === undefined || paragraph.styleId === null ? '' : paragraph.styleId));
        if (!this.seqCollectingLevels && headingMatch != null && this.sequenceFieldResults !== undefined) {
            const headingLevel: number = parseInt(headingMatch[1], 10);
            this.seqHeadingResetLevels.forEach((level: number, name: string) => {
                if (level >= headingLevel) {
                    this.sequenceFieldResults.delete(name);
                }
            });
        }

        // Get items collection - handle both ParagraphItemCollection and arrays
        let items: any[] | undefined;
        if (Array.isArray(paragraph.items)) {
            items = paragraph.items;
        } else if (paragraph.items != null && typeof paragraph.items === 'object' && typeof paragraph.items.snapshot === 'function') {
            items = paragraph.items.snapshot();
        }

        if (!Array.isArray(items)) {
            return;
        }

        for (const item of items) {
            if (item != null && typeof item === 'object' && item.fieldType === 'SEQ') {
                // Process this SEQ field to update sequence cache
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal api
                const field: any = item;
                if (this.seqCollectingLevels) {
                    const lv: string | undefined = this.extractFieldSwitch(field.fieldCode || '', 's');
                    const n: number = lv === undefined ? NaN : parseInt(lv, 10);
                    const key: string | undefined = this.extractSeqCaption(field.fieldCode || '');
                    if (!isNaN(n) && key !== undefined) {
                        this.seqHeadingResetLevels.set(key.toLowerCase(), n);
                    }
                    continue;
                }
                // Call a method that processes the field and updates cache WITHOUT calling updateFieldResult yet
                this.processSeqFieldForSequencing(field);
            }
        }
    }

    /**
     * Visit all SEQ fields in a table.
     *
     * @param {any} table - The table.
     * @returns {void} Nothing is returned.
     * @private
     */
    private visitSeqFieldsInTable(table: any): void {
        if (table == null || typeof table !== 'object') {
            return;
        }

        // Handle both TableRowCollection and arrays
        let rows: any[] | undefined;
        if (Array.isArray(table.rows)) {
            rows = table.rows;
        } else if (table.rows != null && typeof table.rows === 'object' && typeof table.rows.toArray === 'function') {
            // TableRowCollection has toArray() method
            rows = table.rows.toArray();
        }

        if (!Array.isArray(rows)) {
            return;
        }

        for (const row of rows) {
            if (row == null || typeof row !== 'object') {
                continue;
            }

            // Handle both TableCellCollection and arrays
            let cells: any[] | undefined;
            if (Array.isArray(row.cells)) {
                cells = row.cells;
            } else if (row.cells != null && typeof row.cells === 'object' && typeof row.cells.toArray === 'function') {
                // TableCellCollection has toArray() method
                cells = row.cells.toArray();
            }

            if (!Array.isArray(cells)) {
                continue;
            }

            for (const cell of cells) {
                if (cell == null || typeof cell !== 'object') {
                    continue;
                }
                // Visit body in cell
                this.visitSeqFieldsInBody(cell.body != null ? cell.body : cell);
            }
        }
    }

    /**
     * Process a SEQ field to update sequence cache (without updating result yet).
     *
     * This is called during the pre-processing phase to establish correct sequence state.
     * Updates both the global caption counter AND stores this field's specific value.
     *
     * @param {any} field - The field.
     * @returns {void} Nothing is returned.
     * @private
     */
    private processSeqFieldForSequencing(field: any): void {
        try {
            if (field == null || typeof field !== 'object' || field.fieldCode === undefined) {
                return;
            }

            // Parse SEQ instruction - must import parseSeqInstruction
            // For now, extract caption manually
            const fieldCode: string = field.fieldCode || '';
            const seqKey: string = this.extractSeqCaption(fieldCode) || 'Sequence';
            const seqBookmark: string = seqKey.indexOf('|') >= 0 ? seqKey.substring(seqKey.indexOf('|') + 1) : '';
            if (seqBookmark.length > 0 && this.bookmarks.findByName(seqBookmark) === undefined) {
                // Undefined bookmark: field shows an error and does not consume a number.
                return;
            }
            const captionName: string = seqKey.toLowerCase();

            // Get or create sequence cache (global caption counter)
            let sequenceCache: any = this.sequenceFieldResults;
            if (sequenceCache === undefined) {
                sequenceCache = new Map<string, number>();
                this.sequenceFieldResults = sequenceCache;
            }

            // Get current sequence value
            let sequenceValue: number = sequenceCache.get(captionName);
            if (sequenceValue === undefined || sequenceValue === null) {
                sequenceValue = 0;
            }

            // Check for special switches
            let nextValue: number = sequenceValue;

            const levelSwitch: string | undefined = this.extractFieldSwitch(fieldCode, 's');
            const resetLevel: number = levelSwitch === undefined ? NaN : parseInt(levelSwitch, 10);
            if (!isNaN(resetLevel)) {
                this.seqHeadingResetLevels.set(captionName, resetLevel);
            }

            // \r switch: reset number to specified value
            const resetSwitch: string | undefined = this.extractFieldSwitch(fieldCode, 'r');
            if (resetSwitch) {
                try {
                    nextValue = parseInt(resetSwitch, 10);
                    if (isNaN(nextValue)) {
                        nextValue = sequenceValue + 1;
                    }
                } catch (e) {
                    nextValue = sequenceValue + 1;
                }
            } else if (this.hasFieldSwitch(fieldCode, 'n')) {
                // \n switch: insert next number (increment)
                nextValue = sequenceValue + 1;
            } else if (this.hasFieldSwitch(fieldCode, 'c')) {
                // \c switch: repeat current number (don't increment)
                nextValue = sequenceValue;
            } else {
                // Default: increment
                nextValue = sequenceValue + 1;
            }

            // Update global cache
            sequenceCache.set(captionName, nextValue);

            // CRITICAL: Store this field's calculated value in WeakMap
            // This ensures each field retrieves its own value, not the final state
            if (this.sequenceFieldValues === undefined) {
                this.sequenceFieldValues = new WeakMap<any, number>();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal api
            (this.sequenceFieldValues as any).set(field, nextValue);
        } catch (e) {
            // Silently ignore errors in sequence processing
        }
    }

    /**
     * Extract SEQ caption name from field code.
     * Format: "SEQ name" or "SEQ name \r 5"
     *
     * @param {string} fieldCode - The field code.
     * @returns {string | undefined} The caption name, or undefined.
     * @private
     */
    private extractSeqCaption(fieldCode: string): string | undefined {
        const tokens: string[] = [];
        const re: RegExp = /"([^"]*)"|(\S+)/g;
        let m: RegExpExecArray | null = re.exec(fieldCode);
        while (m != null) {
            tokens.push(m[1] !== undefined ? m[1] : m[2]);
            m = re.exec(fieldCode);
        }
        const operands: string[] = [];
        let i: number = 0;
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        while (i < tokens.length && tokens[i].toUpperCase() === 'SEQ') {
            i += 1;
        }
        for (; i < tokens.length; i++) {
            // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
            const t: string = tokens[i];
            if (t.charAt(0) === '\\') {
                if (/^\\[#*rs]$/i.test(t)) {
                    i += 1;
                }
            } else {
                operands.push(t);
            }
        }
        if (operands.length === 0) {
            return undefined;
        }
        // Counter key: identifier + bookmark
        return operands.length > 1 ? operands[0] + '|' + operands[1] : operands[0];
    }

    /**
     * Extract a field switch value (e.g., \r 5 or \# "arabic")
     *
     * @param {string} fieldCode - The field code.
     * @param {string} switchChar - The switch character (r, n, c, etc).
     * @returns {string | undefined} The switch value, or undefined.
     * @private
     */
    private extractFieldSwitch(fieldCode: string, switchChar: string): string | undefined {
        // eslint-disable-next-line security/detect-non-literal-regexp -- interpolated switch character comes from a fixed set of field switches
        const pattern: RegExp = new RegExp(`\\\\${switchChar}\\s+(\\S+)`, 'i');
        const match: RegExpExecArray = pattern.exec(fieldCode);
        if (match != null && match[1] != null) {
            return match[1];
        }
        return undefined;
    }

    /**
     * Check if a field code contains a specific switch.
     *
     * @param {string} fieldCode - The field code.
     * @param {string} switchChar - The switch character.
     * @returns {boolean} True if the switch is present.
     * @private
     */
    private hasFieldSwitch(fieldCode: string, switchChar: string): boolean {
        // eslint-disable-next-line security/detect-non-literal-regexp -- interpolated switch character comes from a fixed set of field switches
        const pattern: RegExp = new RegExp(`\\\\${switchChar}\\s`, 'i');
        return pattern.test(fieldCode);
    }
    /**
     * Get the internal field collection as a snapshot for safe iteration.
     *
     * @returns {Array} A copy of the internal field collection.
     * @private
     */
    getInternalFieldsSnapshot(): Array<any> {
        return this.fieldCollectionValue.slice();
    }
    /**
     * Register a field in the document's internal collection.
     *
     * @param {any} field - The field to register.
     * @returns {void} Nothing is returned.
     * @private
     */
    registerField(field: any): void {
        if (field != null && this.fieldCollectionValue.indexOf(field) === -1) {
            this.fieldCollectionValue.push(field);
        }
    }
    /**
     * Unregister a field from the document's internal collection.
     *
     * @param {any} field - The field to unregister.
     * @returns {void} Nothing is returned.
     * @private
     */
    unregisterField(field: any): void {
        if (field != null) {
            const index: number = this.fieldCollectionValue.indexOf(field);
            if (index >= 0) {
                this.fieldCollectionValue.splice(index, 1);
            }
        }
    }
    /**
     * Get the internal field collection for direct iteration (internal use only).
     *
     * @returns {Array} The internal field collection.
     * @private
     */
    getInternalFields(): Array<any> {
        return this.fieldCollectionValue;
    }
    /**
     * Traverse all paragraphs in the document and register any fields found.
     * Called after document loading to populate the field collection.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private registerAllFieldsInDocument(): void {
        // Traverse all sections and paragraphs
        for (const section of this.sections) {
            this.registerFieldsInBody(section.body);
        }
    }
    /**
     * Traverse a body and register all fields found in its paragraphs.
     *
     * @param {any} body - The body.
     * @returns {void} Nothing is returned.
     * @private
     */
    private registerFieldsInBody(body: any): void {
        if (body == null || typeof body !== 'object') {
            return;
        }
        // Bodies expose blocks through rawBlocks(); table cells may hold a plain array.
        const blocks: any = typeof body.rawBlocks === 'function' ? body.rawBlocks() : body.items;
        if (!Array.isArray(blocks)) {
            return;
        }
        for (const block of blocks) {
            if (block == null || typeof block !== 'object') {
                continue;
            }
            if (block.type === 'paragraph' && block.paragraph != null) {
                this.registerFieldsInParagraph(block.paragraph);
            } else if (block.type === 'table' && block.table != null) {
                this.registerFieldsInTable(block.table);
            } else if (block.type === 'feature' && block.featureId === 'tables' && block.value != null) {
                this.registerFieldsInTable(block.value);
            }
        }
    }
    /**
     * Traverse a paragraph and register all fields found in its items.
     *
     * @param {any} paragraph - The paragraph.
     * @returns {void} Nothing is returned.
     * @private
     */
    private registerFieldsInParagraph(paragraph: any): void {
        if (paragraph == null || typeof paragraph !== 'object') {
            return;
        }

        // Get items collection - handle both ParagraphItemCollection and arrays
        let items: any[] | undefined;
        if (Array.isArray(paragraph.items)) {
            items = paragraph.items;
        } else if (paragraph.items != null && typeof paragraph.items === 'object' && typeof paragraph.items.snapshot === 'function') {
            // ParagraphItemCollection has a snapshot() method
            items = paragraph.items.snapshot();
        }

        if (!Array.isArray(items)) {
            return;
        }

        for (const item of items) {
            if (item != null && typeof item === 'object' && item.fieldType != null) {
                this.registerField(item);
            }
        }
    }
    /**
     * Traverse a table and register all fields found in its rows and cells.
     *
     * @param {any} table - The table.
     * @returns {void} Nothing is returned.
     * @private
     */
    private registerFieldsInTable(table: any): void {
        if (table == null || typeof table !== 'object') {
            return;
        }
        // `rows` / `cells` are iterable collections (plain arrays in some callers).
        if (table.rows == null || typeof table.rows[Symbol.iterator] !== 'function') {
            return;
        }
        for (const row of table.rows) {
            if (row == null || typeof row !== 'object' || row.cells == null || typeof row.cells[Symbol.iterator] !== 'function') {
                continue;
            }
            for (const cell of row.cells) {
                if (cell == null || typeof cell !== 'object') {
                    continue;
                }
                this.registerFieldsInBody(cell);
            }
        }
    }
    /**
     * Serialize the OPC package to bytes in the selected {@link FileFormatType} (defaults to DOCX).
     *
     * @returns {Uint8Array} - Returns the document content as bytes.
     */
    saveSync(): Uint8Array;
    /**
     * Saves the document as a base64 string.
     *
     * @param {SaveOptions & { format: 'base64' }} options - Specifies the save options. The `format` value must be `'base64'`.
     * @returns {string} - Returns the document content as a base64-encoded string.
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
     * @param {SaveOptions} options - The options.
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
        // start from the pre-apply package and drop embeddings/media/rels.
        this.pkg = next;
        const packageBytes: Uint8Array = saveOpcPackage(withPackageFormat(next, name, target));
        const password: string | undefined = encryptionPasswords.get(this);
        return password === undefined ? packageBytes : encryptDocumentBytes(packageBytes, password);
    }
    /**
     * Encrypts the document with a password.
     *
     * Every save after this call produces a password-protected file until {@link WordDocument.removeEncryption} is called.
     * Calling this method on an already encrypted document replaces the password.
     * Do not log the password or include it in messages.
     *
     * @param {string} password - Specifies the password to protect the document with. The password must be 1 to 255 characters long.
     * @returns {void}
     * @throws InvalidArgumentError when the password is not a string, is empty, or is longer than 255 characters.
     * @example
     * document.encryptDocument('syncfusion');
     * const output = await document.save();
     * @public
     */
    encryptDocument(password: string): void {
        if (typeof password !== 'string' || password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
            throw new InvalidArgumentError('encryptDocument requires a password of 1 to ' + MAX_PASSWORD_LENGTH + ' characters');
        }
        encryptionPasswords.set(this, password);
    }
    /**
     * Removes the encryption from the document.
     *
     * Every save after this call produces a document without a password. This method has no effect on a document that is not encrypted.
     * An encrypted document that was opened without the correct password cannot be loaded, so its encryption cannot be removed.
     *
     * @returns {void}
     * @example
     * const document = await Document.openAsync(data, 'syncfusion');
     * document.removeEncryption();
     * const output = await document.save();
     * @public
     */
    removeEncryption(): void {
        encryptionPasswords.delete(this);
    }
    /**
     * Saves the document as bytes asynchronously.
     *
     * @returns {Promise<Uint8Array>} - Returns a promise that resolves to the document content as bytes.
     */
    save(): Promise<Uint8Array>;
    /**
     * Saves the document by downloading it in the browser with the specified file name.
     *
     * Directory segments in the file name are removed. This method does not write to the file system.
     * In Node.js, use {@link WordDocument.save} or {@link WordDocument.saveSync} to get the bytes and write them yourself.
     *
     * @param {string} filePath - Specifies the file name of the downloaded document, for example `Output.docx`.
     * @param {FileFormatType | FileFormat} formatType - Specifies the optional output file format.
     * @returns {Promise<void>} - Returns a promise that resolves when the download starts.
     * @throws InvalidArgumentError when `filePath` is missing or empty
     * @throws IoError when no browser document is available to start the download
     */
    save(filePath: string, formatType?: FileFormatType | FileFormat): Promise<void>;
    /**
     * Saves the document as a base64 string asynchronously.
     *
     * @param {SaveOptions & { format: 'base64' }} options - Specifies the save options. The `format` value must be `'base64'`.
     * @returns {Promise<string>} - Returns a promise that resolves to the document content as a base64-encoded string.
     */
    save(options: SaveOptions & { format: 'base64' }): Promise<string>;
    save(options: SaveOptions): Promise<Uint8Array>;
    save(formatType: FileFormatType | FileFormat): Promise<Uint8Array>;
    async save(
        filePathOrFormatOrOptions?: string | SaveOptions | FileFormatType | FileFormat,
        formatType?: FileFormatType | FileFormat
    ): Promise<Uint8Array | string | void> {
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

/**
 * Passwords of encrypted documents live outside the instance so they are never a property of it,
 * and are never serialized or enumerated.
 *
 * @private
 */
const encryptionPasswords: WeakMap<WordDocument, string> = new WeakMap<WordDocument, string>();

function normalizeLoadOptions(
    optionsOrPassword: (LoadOptions & { format: 'base64' }) | LoadOptions | string | undefined
): (LoadOptions & { format: 'base64' }) | undefined {
    if (typeof optionsOrPassword === 'string') {
        return { password: optionsOrPassword } as LoadOptions & { format: 'base64' };
    }
    return optionsOrPassword as (LoadOptions & { format: 'base64' }) | undefined;
}

function decryptDocumentBytes(bytes: Uint8Array, options: LoadOptions | undefined): Uint8Array {
    const supplied: unknown = options == null ? undefined : options.password;
    if (supplied == null) {
        throw new PackageError('encryption/password-required', 'The document is encrypted; a password is required to open it');
    }
    if (typeof supplied !== 'string') {
        throw new InvalidArgumentError('The password must be a string');
    }
    try {
        return decryptPackage(bytes, supplied, resolveResourceLimits(options == null ? undefined : options.limits).totalUncompressedSize);
    } catch (err) {
        // Messages are fixed text so the password and key material never reach an error.
        if (err instanceof InvalidPasswordError) {
            throw new PackageError('encryption/invalid-password', 'The password is empty or incorrect; the encrypted document cannot be opened');
        }
        if (err instanceof UnsupportedEncryptionError) {
            throw new PackageError('encryption/unsupported', 'The encryption format or algorithm of this document is not supported', { cause: err });
        }
        if (err instanceof EncryptedPackageError) {
            throw new PackageError('encryption/invalid-package', 'The encrypted document is damaged or failed its integrity check', { cause: err });
        }
        if (err instanceof PackageLimitError) {
            throw new SecurityError('security/limit-exceeded', 'The decrypted document exceeds a package security limit', { cause: err });
        }
        throw new PackageError('encryption/invalid-package', 'The encrypted document could not be decrypted', { cause: err });
    }
}

function encryptDocumentBytes(packageBytes: Uint8Array, password: string): Uint8Array {
    try {
        return encryptPackage(packageBytes, password);
    } catch (err) {
        throw new IoError('The document could not be encrypted', { cause: err });
    }
}

function openDocumentAsync(
    dataOrPath: Uint8Array | ArrayBuffer | string | { arrayBuffer(): Promise<ArrayBuffer> },
    options?: LoadOptions & { format: 'base64' }
): Promise<WordDocument> {
    const bytesPromise: Promise<Uint8Array> = isBlobLike(dataOrPath)
        ? dataOrPath.arrayBuffer().then(function (buffer: ArrayBuffer): Uint8Array {
            return toUint8Array(buffer);
        })
        : new Promise<Uint8Array>(function (resolve: (value: Uint8Array | PromiseLike<Uint8Array>) => void): void {
            resolve(resolveOpenInputToBytes(dataOrPath as Uint8Array | ArrayBuffer | string, options as LoadOptions & { format: 'base64' } | undefined));
        });
    return bytesPromise.then(async function (bytes: Uint8Array): Promise<WordDocument> {
        if (detectFormat(bytes) !== 'html') {
            return WordDocument.openSync(bytes, options);
        }
        // For HTML: use the async converter which handles image downloading at the
        // parser/mapper level (not here in the owning module). This is cleaner: all the
        // HTML parsing and image embedding logic stays together in the HTML conversion module.
        const converter: HtmlAsyncConverter | undefined = htmlAsyncConverter();
        if (converter === undefined) {
            throw new Error('HTML async conversion is not registered. Import the package root (src/index) once before opening HTML content.');
        }
        const doc: WordDocument = WordDocument.create();
        const htmlText: string = new TextDecoder().decode(bytes);
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

// Re-export Body from the owning module so existing `import { Document, Body } from '.../document'` keeps working.
export { Body } from './body';
/** @public Compatibility alias for {@link WordDocument}. */
export type Document = WordDocument;

