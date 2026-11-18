/**
 * Workbook package document properties (`docProps/core.xml` + `docProps/app.xml`).
 *
 * Public surface: {@link BuiltInDocumentProperties} via
 * `workbook.builtInDocumentProperties`, plus convenience `workbook.author`
 * (`dc:creator`). Member names follow XlsIO `IBuiltInDocumentProperties`
 * (camelCase); load/parse/serialize is this library's OOXML model — not a port
 * of XlsIO internals.
 *
 * Citations:
 * - ECMA-376-2 opc-coreProperties.xsd `CT_CoreProperties`
 * - ECMA-376-1 shared-documentPropertiesExtended.xsd `CT_Properties`
 * - MS-OE376 §2.1.1885–1888 — DocSecurity, HeadingPairs, TitlesOfParts
 * - CAPABILITY-MATRIX: package properties Read/Preserve
 * - Syncfusion XlsIO `IBuiltInDocumentProperties` (API names only)
 *
 * Custom properties (`docProps/custom.xml`) stay opaque package parts.
 *
 * Lossless policy: untouched loaded parts are not rewritten on save. Mutating a
 * core-backed field dirties core only; app-backed fields dirty app only.
 * Timestamps are never auto-stamped. Dirty app write emits Excel
 * inventory/defaults (HeadingPairs / TitlesOfParts / DocSecurity / …).
 *
 * @module
 */

import {
    CORE_PROPERTIES_CONTENT_TYPE,
    CORE_PROPERTIES_NS,
    CORE_PROPERTIES_REL_TYPE,
    DEFAULT_CORE_PROPERTIES_PART_NAME,
    DEFAULT_EXTENDED_PROPERTIES_PART_NAME,
    DOC_PROPS_VTYPES_NS,
    DUBLIN_CORE_NS,
    DUBLIN_CORE_TERMS_NS,
    EXTENDED_PROPERTIES_CONTENT_TYPE,
    EXTENDED_PROPERTIES_NS,
    EXTENDED_PROPERTIES_REL_TYPE_TRANSITIONAL,
    isCorePropertiesRelationshipType,
    isExtendedPropertiesRelationshipType,
    XML_SCHEMA_INSTANCE_NS
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { assertRootLocalName, decodeUtf8, encodeUtf8, escapeXml, escapeXmlText, unescapeXml } from '../core/xml/minimal-xml';

/**
 * Host notifications for property mutation.
 *
 * @private
 */
export interface DocumentPropertiesHost {
    markDirty(): void;
}

/**
 * Provides read and write access to a workbook's built-in metadata, such as
 * title, author, keywords, and the dates it was created and last saved.
 *
 * Assign `null` or `undefined` on setters to clear. Getters return `undefined`
 * when the field is absent.
 */
export interface BuiltInDocumentProperties {
    /**
     * The document's title (`dc:title`).
     *
     * @private
     */
    title: string | undefined | null;
    /**
     * The document's subject (`dc:subject`).
     *
     * @private
     */
    subject: string | undefined | null;
    /** The person who created the document. */
    author: string | undefined | null;
    /** Search keywords for the document, separated by spaces. */
    keywords: string | undefined | null;
    /** Descriptive notes about the document. */
    comments: string | undefined | null;
    /**
     * The name of the template the document is based on (`Template`).
     *
     * @private
     */
    template: string | undefined | null;
    /** The person who last saved the document. */
    lastAuthor: string | undefined | null;
    /**
     * The number of times the document has been saved (`cp:revision`).
     *
     * @private
     */
    revisionNumber: string | undefined | null;
    /**
     * The total time spent editing the document, in minutes.
     */
    editTime: number | undefined | null;
    /** The date and time the document was last printed. */
    lastPrinted: Date | undefined | null;
    /** The date and time the document was created. */
    creationDate: Date | undefined | null;
    /** The date and time the document was last saved. */
    lastSaveDate: Date | undefined | null;
    /**
     * App `Pages` inventory count.
     *
     * @private
     */
    pageCount: number | undefined | null;
    /**
     * App `Words`.
     *
     * @private
     */
    wordCount: number | undefined | null;
    /**
     * App `Characters`.
     *
     * @private
     */
    charCount: number | undefined | null;
    /**
     * Byte count. Not present in OOXML extended-properties schema; held in memory
     * only and is not written to `app.xml`.
     *
     * @private
     */
    byteCount: number | undefined | null;
    /** The name of the application that created the document. */
    applicationName: string | undefined | null;
    /** The document's category. */
    category: string | undefined | null;
    /**
     * The intended presentation format, such as "On-screen Show" (`PresentationFormat`).
     *
     * @private
     */
    presentationTarget: string | undefined | null;
    /** The total number of lines. */
    lineCount: number | undefined | null;
    /**
     * App `Paragraphs` inventory count.
     *
     * @private
     */
    paragraphCount: number | undefined | null;
    /**
     * App `Slides` inventory count (presentation documents).
     *
     * @private
     */
    slideCount: number | undefined | null;
    /**
     * App `Notes` inventory count (presentation documents).
     *
     * @private
     */
    noteCount: number | undefined | null;
    /**
     * App `HiddenSlides` inventory count (presentation documents).
     *
     * @private
     */
    hiddenCount: number | undefined | null;
    /** The number of embedded sound and video clips. */
    multimediaClipCount: number | undefined | null;
    /** The manager of the document's author. */
    manager: string | undefined | null;
    /** The company that created the document. */
    company: string | undefined | null;
    /**
     * Inverse of app `LinksUpToDate` (XlsIO `LinksDirty`).
     * `true` → write `LinksUpToDate=false`; `false` → `LinksUpToDate=true`.
     *
     * @private
     */
    linksDirty: boolean | undefined | null;
    /** The document's status, such as "Draft" or "Final". */
    contentStatus: string | undefined | null;
    /**
     * The number of times the document has been saved. Alias of `revisionNumber`.
     *
     * @private
     */
    revision: string | undefined | null;
    /**
     * The document's version label (`dcterms:version` / core version).
     *
     * @private
     */
    version: string | undefined | null;
    /** The document's primary language. */
    language: string | undefined | null;
    /**
     * A unique identifier for the document (`dc:identifier`).
     *
     * @private
     */
    identifier: string | undefined | null;
    /** The version of the creating application, such as "16.0000". */
    appVersion: string | undefined | null;
    /**
     * The base address used to resolve relative hyperlinks (`HyperlinkBase`).
     *
     * @private
     */
    hyperlinkBase: string | undefined | null;

    /** Removes the value from every document property. */
    clear(): void;
}

/**
 * Internal core + app package properties model and public façade implementation.
 *
 * @private
 */
export class DocumentPropertiesImpl implements BuiltInDocumentProperties {
    private host: DocumentPropertiesHost | undefined;

    private _title: string | undefined;
    private _subject: string | undefined;
    private _author: string | undefined;
    private _keywords: string | undefined;
    private _comments: string | undefined;
    private _lastAuthor: string | undefined;
    private _category: string | undefined;
    private _contentStatus: string | undefined;
    private _revision: string | undefined;
    private _version: string | undefined;
    private _language: string | undefined;
    private _identifier: string | undefined;
    private _created: Date | undefined;
    private _modified: Date | undefined;
    private _lastPrinted: Date | undefined;

    private _company: string | undefined;
    private _manager: string | undefined;
    private _application: string | undefined;
    private _appVersion: string | undefined;
    private _hyperlinkBase: string | undefined;
    private _template: string | undefined;
    private _editTime: number | undefined;
    private _pageCount: number | undefined;
    private _wordCount: number | undefined;
    private _charCount: number | undefined;
    private _byteCount: number | undefined;
    private _presentationTarget: string | undefined;
    private _lineCount: number | undefined;
    private _paragraphCount: number | undefined;
    private _slideCount: number | undefined;
    private _noteCount: number | undefined;
    private _hiddenCount: number | undefined;
    private _multimediaClipCount: number | undefined;
    /** Stored as wire LinksUpToDate; internal {@link linksDirty} exposes inverse. */
    private _linksUpToDate: boolean | undefined;

    private corePartName: string | undefined;
    private appPartName: string | undefined;
    private coreDirty: boolean = false;
    private appDirty: boolean = false;

    /** Unknown / complex core children preserved as outer XML fragments. */
    private coreExtraChildrenXml: string[] = [];
    /** Unknown / complex app children (HeadingPairs, TitlesOfParts, …). */
    private appExtraChildrenXml: string[] = [];
    private coreRootExtraAttrsXml: string = '';
    private appRootExtraAttrsXml: string = '';
    /** True when keywords element had nested markup and was kept in extras. */
    private keywordsPreservedRaw: boolean = false;

    /**
     * Creates an instance.
     */
    private constructor() {
        // no-op stub
    }

    /**
     * Empty properties (create path).
     *
     * @returns {DocumentPropertiesImpl} - Returns the result.
     */
    public static empty(): DocumentPropertiesImpl {
        return new DocumentPropertiesImpl();
    }

    /**
     * Load core + app from package relationships or conventional part names. Missing parts yield empty fields; custom.xml is ignored (opaque).
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @returns {DocumentPropertiesImpl} - Returns the result.
     */
    public static loadFromPackage(pkg: OpcPackage): DocumentPropertiesImpl {
        const props: DocumentPropertiesImpl = new DocumentPropertiesImpl();
        const packageRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(null);

        const coreRel: OpcRelationship = packageRels.find((r: OpcRelationship): boolean => isCorePropertiesRelationshipType(r.type));
        let coreName: string = coreRel == null ? undefined : coreRel.resolvedTarget;
        if (coreName === undefined && pkg.getPart(DEFAULT_CORE_PROPERTIES_PART_NAME) !== undefined) {
            coreName = DEFAULT_CORE_PROPERTIES_PART_NAME;
        }
        if (coreName !== undefined) {
            const part: any = pkg.getPart(coreName);
            if (part !== undefined) {
                props.corePartName = part.name;
                parseCoreProperties(decodeUtf8(part.data), part.name, props);
            } else {
                props.corePartName = coreName;
            }
        }

        const appRel: OpcRelationship = packageRels.find((r: OpcRelationship): boolean => isExtendedPropertiesRelationshipType(r.type));
        let appName: string = appRel == null ? undefined : appRel.resolvedTarget;
        if (appName === undefined && pkg.getPart(DEFAULT_EXTENDED_PROPERTIES_PART_NAME) !== undefined) {
            appName = DEFAULT_EXTENDED_PROPERTIES_PART_NAME;
        }
        if (appName !== undefined) {
            const part: any = pkg.getPart(appName);
            if (part !== undefined) {
                props.appPartName = part.name;
                parseExtendedProperties(decodeUtf8(part.data), part.name, props);
            } else {
                props.appPartName = appName;
            }
        }

        return props;
    }

    /**
     * bindHost method.
     *
     * @param {DocumentPropertiesHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: DocumentPropertiesHost): void {
        this.host = host;
    }

    /**
     * Gets corePropertiesPartName.
     *
     * @returns {string} - Returns the result.
     */
    public get corePropertiesPartName(): string | undefined {
        return this.corePartName;
    }

    /**
     * Gets extendedPropertiesPartName.
     *
     * @returns {string} - Returns the result.
     */
    public get extendedPropertiesPartName(): string | undefined {
        return this.appPartName;
    }

    /**
     * shouldWriteCore method.
     *
     * @returns {boolean} - Returns the result.
     */
    public shouldWriteCore(): boolean {
        return this.coreDirty;
    }

    /**
     * shouldWriteApp method.
     *
     * @returns {boolean} - Returns the result.
     */
    public shouldWriteApp(): boolean {
        return this.appDirty;
    }

    /**
     * Serialize dirty parts into the package and ensure package-level relationships. Untouched parts keep their original bytes (lossless open→save). When app is dirty, `options.sheetNames` drives Excel-compatible `HeadingPairs` / `TitlesOfParts` (workbook order).
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {any} allocatePackageRelId - The allocatePackageRelId parameter.
     * @param {DocumentPropertiesFlushOptions} options - The options parameter.
     * @returns {void} - Returns the result.
     */
    public flush(pkg: OpcPackage, allocatePackageRelId: () => string, options?: DocumentPropertiesFlushOptions): void {
        if (this.coreDirty) {
            const partName: string = this.corePartName != null ? this.corePartName : DEFAULT_CORE_PROPERTIES_PART_NAME;
            this.corePartName = partName;
            const bytes: Uint8Array = serializeCoreProperties(this);
            pkg.setPart(partName, bytes, CORE_PROPERTIES_CONTENT_TYPE);
            ensurePackageRelationship(pkg, allocatePackageRelId, isCorePropertiesRelationshipType, CORE_PROPERTIES_REL_TYPE, partName);
            this.coreDirty = false;
        }

        if (this.appDirty) {
            const partName: string = this.appPartName != null ? this.appPartName : DEFAULT_EXTENDED_PROPERTIES_PART_NAME;
            this.appPartName = partName;
            const sheetNames: ReadonlyArray<string> = ((__t: ReadonlyArray<string>): ReadonlyArray<string> => (__t != null ? __t : []))(
                options == null ? undefined : options.sheetNames
            );
            const bytes: Uint8Array = serializeExtendedProperties(this, sheetNames);
            pkg.setPart(partName, bytes, EXTENDED_PROPERTIES_CONTENT_TYPE);
            ensurePackageRelationship(
                pkg,
                allocatePackageRelId,
                isExtendedPropertiesRelationshipType,
                EXTENDED_PROPERTIES_REL_TYPE_TRANSITIONAL,
                partName
            );
            this.appDirty = false;
        }
    }

    // --- public string / date surface ---

    /**
     * Gets title.
     *
     * @returns {string} - Returns the result.
     */
    public get title(): string | undefined | null {
        return this._title;
    }
    /**
     * Sets title.
     *
     * @param {string} value - The value parameter.
     */
    public set title(value: string | undefined | null) {
        this.setCoreString('_title', value);
    }

    /**
     * Gets subject.
     *
     * @returns {string} - Returns the result.
     */
    public get subject(): string | undefined | null {
        return this._subject;
    }
    /**
     * Sets subject.
     *
     * @param {string} value - The value parameter.
     */
    public set subject(value: string | undefined | null) {
        this.setCoreString('_subject', value);
    }

    /**
     * Gets author.
     *
     * @returns {string} - Returns the result.
     */
    public get author(): string | undefined | null {
        return this._author;
    }
    /**
     * Sets author.
     *
     * @param {string} value - The value parameter.
     */
    public set author(value: string | undefined | null) {
        this.setCoreString('_author', value);
    }

    /**
     * Gets keywords.
     *
     * @returns {string} - Returns the result.
     */
    public get keywords(): string | undefined | null {
        return this._keywords;
    }
    /**
     * Sets keywords.
     *
     * @param {string} value - The value parameter.
     */
    public set keywords(value: string | undefined | null) {
        const next: string = normalizeOptionalString(value);
        if (this._keywords === next && !this.keywordsPreservedRaw) {
            return;
        }
        this._keywords = next;
        // Authoring replaces any preserved nested keywords markup.
        if (this.keywordsPreservedRaw) {
            this.coreExtraChildrenXml = this.coreExtraChildrenXml.filter(
                (x: string): boolean => !localNameOfOuterXml(x).toLowerCase().includes('keywords')
            );
            this.keywordsPreservedRaw = false;
        }
        this.touchCore();
    }

    /**
     * Gets comments.
     *
     * @returns {string} - Returns the result.
     */
    public get comments(): string | undefined | null {
        return this._comments;
    }
    /**
     * Sets comments.
     *
     * @param {string} value - The value parameter.
     */
    public set comments(value: string | undefined | null) {
        this.setCoreString('_comments', value);
    }

    /**
     * Gets lastAuthor.
     *
     * @returns {string} - Returns the result.
     */
    public get lastAuthor(): string | undefined | null {
        return this._lastAuthor;
    }
    /**
     * Sets lastAuthor.
     *
     * @param {string} value - The value parameter.
     */
    public set lastAuthor(value: string | undefined | null) {
        this.setCoreString('_lastAuthor', value);
    }

    /**
     * Gets category.
     *
     * @returns {string} - Returns the result.
     */
    public get category(): string | undefined | null {
        return this._category;
    }
    /**
     * Sets category.
     *
     * @param {string} value - The value parameter.
     */
    public set category(value: string | undefined | null) {
        this.setCoreString('_category', value);
    }

    /**
     * Gets contentStatus.
     *
     * @returns {string} - Returns the result.
     */
    public get contentStatus(): string | undefined | null {
        return this._contentStatus;
    }
    /**
     * Sets contentStatus.
     *
     * @param {string} value - The value parameter.
     */
    public set contentStatus(value: string | undefined | null) {
        this.setCoreString('_contentStatus', value);
    }

    /**
     * Gets revision.
     *
     * @returns {string} - Returns the result.
     */
    public get revision(): string | undefined | null {
        return this._revision;
    }
    /**
     * Sets revision.
     *
     * @param {string} value - The value parameter.
     */
    public set revision(value: string | undefined | null) {
        this.setCoreString('_revision', value);
    }

    /**
     * Gets version.
     *
     * @returns {string} - Returns the result.
     */
    public get version(): string | undefined | null {
        return this._version;
    }
    /**
     * Sets version.
     *
     * @param {string} value - The value parameter.
     */
    public set version(value: string | undefined | null) {
        this.setCoreString('_version', value);
    }

    /**
     * Gets language.
     *
     * @returns {string} - Returns the result.
     */
    public get language(): string | undefined | null {
        return this._language;
    }
    /**
     * Sets language.
     *
     * @param {string} value - The value parameter.
     */
    public set language(value: string | undefined | null) {
        this.setCoreString('_language', value);
    }

    /**
     * Gets identifier.
     *
     * @returns {string} - Returns the result.
     */
    public get identifier(): string | undefined | null {
        return this._identifier;
    }
    /**
     * Sets identifier.
     *
     * @param {string} value - The value parameter.
     */
    public set identifier(value: string | undefined | null) {
        this.setCoreString('_identifier', value);
    }

    /**
     * Gets lastPrinted.
     *
     * @returns {*} - Returns the result.
     */
    public get lastPrinted(): Date | undefined | null {
        return this._lastPrinted === undefined ? undefined : new Date(this._lastPrinted.getTime());
    }
    /**
     * Sets lastPrinted.
     *
     * @param {*} value - The value parameter.
     */
    public set lastPrinted(value: Date | undefined | null) {
        this.setCoreDate('_lastPrinted', value);
    }

    /**
     * Gets company.
     *
     * @returns {string} - Returns the result.
     */
    public get company(): string | undefined | null {
        return this._company;
    }
    /**
     * Sets company.
     *
     * @param {string} value - The value parameter.
     */
    public set company(value: string | undefined | null) {
        this.setAppString('_company', value);
    }

    /**
     * Gets manager.
     *
     * @returns {string} - Returns the result.
     */
    public get manager(): string | undefined | null {
        return this._manager;
    }
    /**
     * Sets manager.
     *
     * @param {string} value - The value parameter.
     */
    public set manager(value: string | undefined | null) {
        this.setAppString('_manager', value);
    }

    /**
     * Gets appVersion.
     *
     * @returns {string} - Returns the result.
     */
    public get appVersion(): string | undefined | null {
        return this._appVersion;
    }
    /**
     * Sets appVersion.
     *
     * @param {string} value - The value parameter.
     */
    public set appVersion(value: string | undefined | null) {
        const next: string = normalizeOptionalString(value);
        if (next !== undefined) {
            assertAppVersion(next);
        }
        if (this._appVersion === next) {
            return;
        }
        this._appVersion = next;
        this.touchApp();
    }

    /**
     * Gets hyperlinkBase.
     *
     * @returns {string} - Returns the result.
     */
    public get hyperlinkBase(): string | undefined | null {
        return this._hyperlinkBase;
    }
    /**
     * Sets hyperlinkBase.
     *
     * @param {string} value - The value parameter.
     */
    public set hyperlinkBase(value: string | undefined | null) {
        this.setAppString('_hyperlinkBase', value);
    }

    /**
     * Gets template.
     *
     * @returns {string} - Returns the result.
     */
    public get template(): string | undefined | null {
        return this._template;
    }
    /**
     * Sets template.
     *
     * @param {string} value - The value parameter.
     */
    public set template(value: string | undefined | null) {
        this.setAppString('_template', value);
    }

    /**
     * Gets revisionNumber.
     *
     * @returns {string} - Returns the result.
     */
    public get revisionNumber(): string | undefined | null {
        return this._revision;
    }
    /**
     * Sets revisionNumber.
     *
     * @param {string} value - The value parameter.
     */
    public set revisionNumber(value: string | undefined | null) {
        this.setCoreString('_revision', value);
    }

    /**
     * Gets editTime.
     *
     * @returns {number} - Returns the result.
     */
    public get editTime(): number | undefined | null {
        return this._editTime;
    }
    /**
     * Sets editTime.
     *
     * @param {number} value - The value parameter.
     */
    public set editTime(value: number | undefined | null) {
        this.setAppInt('_editTime', value);
    }

    /**
     * Gets creationDate.
     *
     * @returns {*} - Returns the result.
     */
    public get creationDate(): Date | undefined | null {
        return this._created === undefined ? undefined : new Date(this._created.getTime());
    }
    /**
     * Sets creationDate.
     *
     * @param {*} value - The value parameter.
     */
    public set creationDate(value: Date | undefined | null) {
        this.setCoreDate('_created', value);
    }

    /**
     * Gets lastSaveDate.
     *
     * @returns {*} - Returns the result.
     */
    public get lastSaveDate(): Date | undefined | null {
        return this._modified === undefined ? undefined : new Date(this._modified.getTime());
    }
    /**
     * Sets lastSaveDate.
     *
     * @param {*} value - The value parameter.
     */
    public set lastSaveDate(value: Date | undefined | null) {
        this.setCoreDate('_modified', value);
    }

    /**
     * Gets pageCount.
     *
     * @returns {number} - Returns the result.
     */
    public get pageCount(): number | undefined | null {
        return this._pageCount;
    }
    /**
     * Sets pageCount.
     *
     * @param {number} value - The value parameter.
     */
    public set pageCount(value: number | undefined | null) {
        this.setAppInt('_pageCount', value);
    }

    /**
     * Gets wordCount.
     *
     * @returns {number} - Returns the result.
     */
    public get wordCount(): number | undefined | null {
        return this._wordCount;
    }
    /**
     * Sets wordCount.
     *
     * @param {number} value - The value parameter.
     */
    public set wordCount(value: number | undefined | null) {
        this.setAppInt('_wordCount', value);
    }

    /**
     * Gets charCount.
     *
     * @returns {number} - Returns the result.
     */
    public get charCount(): number | undefined | null {
        return this._charCount;
    }
    /**
     * Sets charCount.
     *
     * @param {number} value - The value parameter.
     */
    public set charCount(value: number | undefined | null) {
        this.setAppInt('_charCount', value);
    }

    /**
     * Gets byteCount.
     *
     * @returns {number} - Returns the result.
     */
    public get byteCount(): number | undefined | null {
        return this._byteCount;
    }
    /**
     * Sets byteCount.
     *
     * @param {number} value - The value parameter.
     */
    public set byteCount(value: number | undefined | null) {
        // No OOXML extended-properties element; memory-only (load path / internal).
        const next: number = normalizeOptionalInt(value);
        if (this._byteCount === next) {
            return;
        }
        this._byteCount = next;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets applicationName.
     *
     * @returns {string} - Returns the result.
     */
    public get applicationName(): string | undefined | null {
        return this._application;
    }
    /**
     * Sets applicationName.
     *
     * @param {string} value - The value parameter.
     */
    public set applicationName(value: string | undefined | null) {
        this.setAppString('_application', value);
    }

    /**
     * Gets presentationTarget.
     *
     * @returns {string} - Returns the result.
     */
    public get presentationTarget(): string | undefined | null {
        return this._presentationTarget;
    }
    /**
     * Sets presentationTarget.
     *
     * @param {string} value - The value parameter.
     */
    public set presentationTarget(value: string | undefined | null) {
        this.setAppString('_presentationTarget', value);
    }

    /**
     * Gets lineCount.
     *
     * @returns {number} - Returns the result.
     */
    public get lineCount(): number | undefined | null {
        return this._lineCount;
    }
    /**
     * Sets lineCount.
     *
     * @param {number} value - The value parameter.
     */
    public set lineCount(value: number | undefined | null) {
        this.setAppInt('_lineCount', value);
    }

    /**
     * Gets paragraphCount.
     *
     * @returns {number} - Returns the result.
     */
    public get paragraphCount(): number | undefined | null {
        return this._paragraphCount;
    }
    /**
     * Sets paragraphCount.
     *
     * @param {number} value - The value parameter.
     */
    public set paragraphCount(value: number | undefined | null) {
        this.setAppInt('_paragraphCount', value);
    }

    /**
     * Gets slideCount.
     *
     * @returns {number} - Returns the result.
     */
    public get slideCount(): number | undefined | null {
        return this._slideCount;
    }
    /**
     * Sets slideCount.
     *
     * @param {number} value - The value parameter.
     */
    public set slideCount(value: number | undefined | null) {
        this.setAppInt('_slideCount', value);
    }

    /**
     * Gets noteCount.
     *
     * @returns {number} - Returns the result.
     */
    public get noteCount(): number | undefined | null {
        return this._noteCount;
    }
    /**
     * Sets noteCount.
     *
     * @param {number} value - The value parameter.
     */
    public set noteCount(value: number | undefined | null) {
        this.setAppInt('_noteCount', value);
    }

    /**
     * Gets hiddenCount.
     *
     * @returns {number} - Returns the result.
     */
    public get hiddenCount(): number | undefined | null {
        return this._hiddenCount;
    }
    /**
     * Sets hiddenCount.
     *
     * @param {number} value - The value parameter.
     */
    public set hiddenCount(value: number | undefined | null) {
        this.setAppInt('_hiddenCount', value);
    }

    /**
     * Gets multimediaClipCount.
     *
     * @returns {number} - Returns the result.
     */
    public get multimediaClipCount(): number | undefined | null {
        return this._multimediaClipCount;
    }
    /**
     * Sets multimediaClipCount.
     *
     * @param {number} value - The value parameter.
     */
    public set multimediaClipCount(value: number | undefined | null) {
        this.setAppInt('_multimediaClipCount', value);
    }

    /**
     * Gets linksDirty.
     *
     * @returns {boolean} - Returns the result.
     */
    public get linksDirty(): boolean | undefined | null {
        if (this._linksUpToDate === undefined) {
            return undefined;
        }
        return !this._linksUpToDate;
    }
    /**
     * Sets linksDirty.
     *
     * @param {boolean} value - The value parameter.
     */
    public set linksDirty(value: boolean | undefined | null) {
        const next: boolean = value === undefined || value === null ? undefined : !value;
        if (this._linksUpToDate === next) {
            return;
        }
        this._linksUpToDate = next;
        this.touchApp();
    }

    /**
     * Clear all authorable built-in fields. Dirties core and app so both parts rewrite (or omit empty fields) on the next save.
     *
     * @returns {void} - Returns the result.
     */
    public clear(): void {
        this._title = undefined;
        this._subject = undefined;
        this._author = undefined;
        this._keywords = undefined;
        this._comments = undefined;
        this._lastAuthor = undefined;
        this._category = undefined;
        this._contentStatus = undefined;
        this._revision = undefined;
        this._version = undefined;
        this._language = undefined;
        this._identifier = undefined;
        this._created = undefined;
        this._modified = undefined;
        this._lastPrinted = undefined;
        this.keywordsPreservedRaw = false;
        // Drop preserved keyword markup if present.
        this.coreExtraChildrenXml = this.coreExtraChildrenXml.filter(
            (x: string): boolean => !localNameOfOuterXml(x).toLowerCase().includes('keywords')
        );

        this._company = undefined;
        this._manager = undefined;
        this._application = undefined;
        this._appVersion = undefined;
        this._hyperlinkBase = undefined;
        this._template = undefined;
        this._editTime = undefined;
        this._pageCount = undefined;
        this._wordCount = undefined;
        this._charCount = undefined;
        this._byteCount = undefined;
        this._presentationTarget = undefined;
        this._lineCount = undefined;
        this._paragraphCount = undefined;
        this._slideCount = undefined;
        this._noteCount = undefined;
        this._hiddenCount = undefined;
        this._multimediaClipCount = undefined;
        this._linksUpToDate = undefined;

        this.touchCore();
        this.touchApp();
    }

    // --- package parse fill (internal) ---

    /**
     * applyCoreParsed method.
     *
     * @param {CoreParsedFields} fields - The fields parameter.
     * @returns {void} - Returns the result.
     */
    public applyCoreParsed(fields: CoreParsedFields): void {
        this._title = fields.title;
        this._subject = fields.subject;
        this._author = fields.author;
        this._keywords = fields.keywords;
        this._comments = fields.comments;
        this._lastAuthor = fields.lastAuthor;
        this._category = fields.category;
        this._contentStatus = fields.contentStatus;
        this._revision = fields.revision;
        this._version = fields.version;
        this._language = fields.language;
        this._identifier = fields.identifier;
        this._created = fields.created;
        this._modified = fields.modified;
        this._lastPrinted = fields.lastPrinted;
        this.coreExtraChildrenXml = fields.extraChildrenXml;
        this.coreRootExtraAttrsXml = fields.rootExtraAttrsXml;
        this.keywordsPreservedRaw = fields.keywordsPreservedRaw;
    }

    /**
     * applyAppParsed method.
     *
     * @param {AppParsedFields} fields - The fields parameter.
     * @returns {void} - Returns the result.
     */
    public applyAppParsed(fields: AppParsedFields): void {
        this._company = fields.company;
        this._manager = fields.manager;
        this._application = fields.application;
        this._appVersion = fields.appVersion;
        this._hyperlinkBase = fields.hyperlinkBase;
        this._template = fields.template;
        this._editTime = fields.editTime;
        this._pageCount = fields.pageCount;
        this._wordCount = fields.wordCount;
        this._charCount = fields.charCount;
        this._presentationTarget = fields.presentationTarget;
        this._lineCount = fields.lineCount;
        this._paragraphCount = fields.paragraphCount;
        this._slideCount = fields.slideCount;
        this._noteCount = fields.noteCount;
        this._hiddenCount = fields.hiddenCount;
        this._multimediaClipCount = fields.multimediaClipCount;
        this._linksUpToDate = fields.linksUpToDate;
        this.appExtraChildrenXml = fields.extraChildrenXml;
        this.appRootExtraAttrsXml = fields.rootExtraAttrsXml;
    }

    /**
     * coreSnapshot method.
     *
     * @returns {CoreParsedFields} - Returns the result.
     */
    public coreSnapshot(): CoreParsedFields {
        return {
            title: this._title,
            subject: this._subject,
            author: this._author,
            keywords: this._keywords,
            comments: this._comments,
            lastAuthor: this._lastAuthor,
            category: this._category,
            contentStatus: this._contentStatus,
            revision: this._revision,
            version: this._version,
            language: this._language,
            identifier: this._identifier,
            created: this._created,
            modified: this._modified,
            lastPrinted: this._lastPrinted,
            extraChildrenXml: this.coreExtraChildrenXml,
            rootExtraAttrsXml: this.coreRootExtraAttrsXml,
            keywordsPreservedRaw: this.keywordsPreservedRaw
        };
    }

    /**
     * appSnapshot method.
     *
     * @returns {AppParsedFields} - Returns the result.
     */
    public appSnapshot(): AppParsedFields {
        return {
            company: this._company,
            manager: this._manager,
            application: this._application,
            appVersion: this._appVersion,
            hyperlinkBase: this._hyperlinkBase,
            template: this._template,
            editTime: this._editTime,
            pageCount: this._pageCount,
            wordCount: this._wordCount,
            charCount: this._charCount,
            presentationTarget: this._presentationTarget,
            lineCount: this._lineCount,
            paragraphCount: this._paragraphCount,
            slideCount: this._slideCount,
            noteCount: this._noteCount,
            hiddenCount: this._hiddenCount,
            multimediaClipCount: this._multimediaClipCount,
            linksUpToDate: this._linksUpToDate,
            extraChildrenXml: this.appExtraChildrenXml,
            rootExtraAttrsXml: this.appRootExtraAttrsXml
        };
    }

    /**
     * setCoreString method.
     *
     * @param {any} key - The key parameter.
     * @param {string} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    private setCoreString(
        key:
        | '_title'
        | '_subject'
        | '_author'
        | '_comments'
        | '_lastAuthor'
        | '_category'
        | '_contentStatus'
        | '_revision'
        | '_version'
        | '_language'
        | '_identifier',
        value: string | undefined | null
    ): void {
        const next: string = normalizeOptionalString(value);
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        if (this[key] === next) {
            return;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        this[key] = next;
        this.touchCore();
    }

    /**
     * setAppString method.
     *
     * @param {any} key - The key parameter.
     * @param {string} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    private setAppString(
        key: '_company' | '_manager' | '_application' | '_hyperlinkBase' | '_template' | '_presentationTarget',
        value: string | undefined | null
    ): void {
        const next: string = normalizeOptionalString(value);
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        if (this[key] === next) {
            return;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        this[key] = next;
        this.touchApp();
    }

    /**
     * setAppInt method.
     *
     * @param {any} key - The key parameter.
     * @param {number} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    private setAppInt(
        key:
        | '_editTime'
        | '_pageCount'
        | '_wordCount'
        | '_charCount'
        | '_lineCount'
        | '_paragraphCount'
        | '_slideCount'
        | '_noteCount'
        | '_hiddenCount'
        | '_multimediaClipCount',
        value: number | undefined | null
    ): void {
        const next: number = normalizeOptionalInt(value);
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        if (this[key] === next) {
            return;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        this[key] = next;
        this.touchApp();
    }

    /**
     * setCoreDate method.
     *
     * @param {Object} key - The key parameter.
     * @param {*} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    private setCoreDate(key: '_created' | '_modified' | '_lastPrinted', value: Date | undefined | null): void {
        const next: Date = normalizeOptionalDate(value);
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const prev: Date = this[key];
        if (prev === undefined && next === undefined) {
            return;
        }
        if (prev !== undefined && next !== undefined && prev.getTime() === next.getTime()) {
            return;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        this[key] = next;
        this.touchCore();
    }

    /**
     * touchCore method.
     *
     * @returns {void} - Returns the result.
     */
    private touchCore(): void {
        this.coreDirty = true;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * touchApp method.
     *
     * @returns {void} - Returns the result.
     */
    private touchApp(): void {
        this.appDirty = true;
        if (this.host != null) {
            this.host.markDirty();
        }
    }
}

/** @private */
export interface CoreParsedFields {
    title: string | undefined;
    subject: string | undefined;
    author: string | undefined;
    keywords: string | undefined;
    comments: string | undefined;
    lastAuthor: string | undefined;
    category: string | undefined;
    contentStatus: string | undefined;
    revision: string | undefined;
    version: string | undefined;
    language: string | undefined;
    identifier: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
    lastPrinted: Date | undefined;
    extraChildrenXml: string[];
    rootExtraAttrsXml: string;
    keywordsPreservedRaw: boolean;
}

/** @private */
export interface AppParsedFields {
    company: string | undefined;
    manager: string | undefined;
    application: string | undefined;
    appVersion: string | undefined;
    hyperlinkBase: string | undefined;
    template: string | undefined;
    editTime: number | undefined;
    pageCount: number | undefined;
    wordCount: number | undefined;
    charCount: number | undefined;
    presentationTarget: string | undefined;
    lineCount: number | undefined;
    paragraphCount: number | undefined;
    slideCount: number | undefined;
    noteCount: number | undefined;
    hiddenCount: number | undefined;
    multimediaClipCount: number | undefined;
    linksUpToDate: boolean | undefined;
    extraChildrenXml: string[];
    rootExtraAttrsXml: string;
}

/**
 * Optional inventory passed when flushing a dirty extended-properties part.
 *
 * @private
 */
export interface DocumentPropertiesFlushOptions {
    /** Worksheet names in workbook order for TitlesOfParts / HeadingPairs. */
    readonly sheetNames?: ReadonlyArray<string>;
}

/** Core simple locals consumed by `parseCoreProperties` (case-insensitive). */
const CORE_KNOWN: Set<string> = new Set([
    'title',
    'subject',
    'creator',
    'keywords',
    'description',
    'lastmodifiedby',
    'category',
    'contentstatus',
    'revision',
    'version',
    'language',
    'identifier',
    'created',
    'modified',
    'lastprinted'
]);

/**
 * Extended-properties simple locals consumed by `parseExtendedProperties`
 * (case-insensitive). Complex nodes (HeadingPairs, TitlesOfParts, …) stay extras.
 */
const APP_KNOWN: Set<string> = new Set([
    'application',
    'manager',
    'company',
    'hyperlinkbase',
    'appversion',
    'template',
    'totaltime',
    'pages',
    'words',
    'characters',
    'presentationformat',
    'lines',
    'paragraphs',
    'slides',
    'notes',
    'hiddenslides',
    'mmclips',
    'linksuptodate'
]);

/**
 * Locals emitted by `serializeExtendedProperties` (or known simple fields).
 * Drop matching extras on rewrite so inventory/defaults are not duplicated.
 */
const APP_SYNTHESIZED_LOCALS: Set<string> = new Set([
    'application',
    'docsecurity',
    'scalecrop',
    'headingpairs',
    'titlesofparts',
    'manager',
    'company',
    'linksuptodate',
    'shareddoc',
    'hyperlinkbase',
    'hyperlinkschanged',
    'appversion',
    'template',
    'totaltime',
    'pages',
    'words',
    'characters',
    'presentationformat',
    'lines',
    'paragraphs',
    'slides',
    'notes',
    'hiddenslides',
    'mmclips'
]);

/**
 * Package-root relative Target for an absolute part name (`/docProps/core.xml` → `docProps/core.xml`).
 *
 * @param {string} partName - The partName parameter.
 * @returns {string} - Returns the result.
 */
export function packageRelativeTarget(partName: string): string {
    const n: string = partName.startsWith('/') ? partName.slice(1) : partName;
    return n;
}

/**
 * Highest numeric `rIdN` among package-level relationships (0 if none).
 *
 * @param {Object} rels - The rels parameter.
 * @returns {number} - Returns the result.
 */
export function maxPackageRelationshipNumber(rels: ReadonlyArray<OpcRelationship>): number {
    let max: number = 0;
    for (const r of rels) {
        const m: RegExpExecArray = /^rId(\d+)$/i.exec(r.id);
        if (m !== null && m[1] !== undefined) {
            const n: number = Number.parseInt(m[1], 10);
            if (n > max) {
                max = n;
            }
        }
    }
    return max;
}

/**
 * ensurePackageRelationship function.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @param {any} allocatePackageRelId - The allocatePackageRelId parameter.
 * @param {any} matchType - The matchType parameter.
 * @param {string} relType - The relType parameter.
 * @param {string} partName - The partName parameter.
 * @returns {void} - Returns the result.
 */
function ensurePackageRelationship(
    pkg: OpcPackage,
    allocatePackageRelId: () => string,
    matchType: (type: string) => boolean,
    relType: string,
    partName: string
): void {
    const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(null);
    const existing: OpcRelationship = rels.find((r: OpcRelationship): boolean => matchType(r.type));
    if (existing !== undefined) {
        return;
    }
    const id: string = allocatePackageRelId();
    const target: string = packageRelativeTarget(partName);
    const next: OpcRelationship[] = [
        ...rels,
        {
            id,
            type: relType,
            target,
            resolvedTarget: partName.startsWith('/') ? partName : `/${partName}`
        }
    ];
    pkg.setRelationships(null, next);
}

/**
 * normalizeOptionalString function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeOptionalString(value: string | undefined | null): string | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    return value;
}

/**
 * normalizeOptionalDate function.
 *
 * @param {*} value - The value parameter.
 * @returns {*} - Returns the result.
 */
function normalizeOptionalDate(value: Date | undefined | null): Date | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        throw new TypeError('Document property date must be a valid Date');
    }
    return new Date(value.getTime());
}

/**
 * normalizeOptionalInt function.
 *
 * @param {number} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function normalizeOptionalInt(value: number | undefined | null): number | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
        throw new TypeError('Document property count/time must be a finite integer');
    }
    return value;
}

/**
 * parseOptionalInt function.
 *
 * @param {string} text - The text parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalInt(text: string | undefined): number | undefined {
    if (text === undefined) {
        return undefined;
    }
    const t: string = text.trim();
    if (t.length === 0) {
        return undefined;
    }
    const n: number = Number.parseInt(t, 10);
    if (!Number.isFinite(n)) {
        return undefined;
    }
    return n;
}

/**
 * parseOptionalBool function.
 *
 * @param {string} text - The text parameter.
 * @returns {boolean} - Returns the result.
 */
function parseOptionalBool(text: string | undefined): boolean | undefined {
    if (text === undefined) {
        return undefined;
    }
    const t: string = text.trim().toLowerCase();
    if (t === 'true' || t === '1') {
        return true;
    }
    if (t === 'false' || t === '0') {
        return false;
    }
    return undefined;
}

/**
 * Office AppVersion wire form (MS-OE376 §2.1.1883 / ECMA-376-1 §22.2.2.2).
 * Pattern: `[0-9]{1,2}\.[0-9]{1,4}` → e.g. `16.0300`, `12.0000`.
 */
const APP_VERSION_PATTERN: RegExp = /^[0-9]{1,2}\.[0-9]{1,4}$/;

/**
 * isValidAppVersion function.
 *
 * @param {string} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function isValidAppVersion(value: string): boolean {
    return APP_VERSION_PATTERN.test(value);
}

/**
 * assertAppVersion function.
 *
 * @param {string} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function assertAppVersion(value: string): void {
    if (!isValidAppVersion(value)) {
        throw new TypeError(
            `Document property appVersion must match XX.YYYY (Office pattern [0-9]{1,2}.[0-9]{1,4}); got ${JSON.stringify(value)}`
        );
    }
}

/**
 * parseCoreProperties function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} partName - The partName parameter.
 * @param {DocumentPropertiesImpl} props - The props parameter.
 * @returns {void} - Returns the result.
 */
function parseCoreProperties(xml: string, partName: string, props: DocumentPropertiesImpl): void {
    assertRootLocalName(xml, 'coreProperties', partName);
    const root: RootMatch = matchRoot(xml, 'coreProperties');
    if (root === undefined) {
        return;
    }
    const fields: CoreParsedFields = {
        title: undefined,
        subject: undefined,
        author: undefined,
        keywords: undefined,
        comments: undefined,
        lastAuthor: undefined,
        category: undefined,
        contentStatus: undefined,
        revision: undefined,
        version: undefined,
        language: undefined,
        identifier: undefined,
        created: undefined,
        modified: undefined,
        lastPrinted: undefined,
        extraChildrenXml: [],
        rootExtraAttrsXml: stripDeclNamespaceAttrs(root.attrText),
        keywordsPreservedRaw: false
    };

    for (const child of iterateChildElements(root.inner)) {
        const local: string = child.localName.toLowerCase();
        if (!CORE_KNOWN.has(local)) {
            fields.extraChildrenXml.push(child.outerXml);
            continue;
        }
        if (local === 'keywords') {
            if (elementHasChildElements(child.inner)) {
                fields.keywords = flattenElementText(child.inner);
                fields.extraChildrenXml.push(child.outerXml);
                fields.keywordsPreservedRaw = true;
            } else {
                fields.keywords = emptyToUndef(flattenElementText(child.inner));
            }
            continue;
        }
        const text: string = emptyToUndef(flattenElementText(child.inner));
        switch (local) {
        case 'title':
            fields.title = text;
            break;
        case 'subject':
            fields.subject = text;
            break;
        case 'creator':
            fields.author = text;
            break;
        case 'description':
            fields.comments = text;
            break;
        case 'lastmodifiedby':
            fields.lastAuthor = text;
            break;
        case 'category':
            fields.category = text;
            break;
        case 'contentstatus':
            fields.contentStatus = text;
            break;
        case 'revision':
            fields.revision = text;
            break;
        case 'version':
            fields.version = text;
            break;
        case 'language':
            fields.language = text;
            break;
        case 'identifier':
            fields.identifier = text;
            break;
        case 'created':
            fields.created = parseWireDate(text);
            break;
        case 'modified':
            fields.modified = parseWireDate(text);
            break;
        case 'lastprinted':
            fields.lastPrinted = parseWireDate(text);
            break;
        default:
            break;
        }
    }

    props.applyCoreParsed(fields);
}

/**
 * parseExtendedProperties function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} partName - The partName parameter.
 * @param {DocumentPropertiesImpl} props - The props parameter.
 * @returns {void} - Returns the result.
 */
function parseExtendedProperties(xml: string, partName: string, props: DocumentPropertiesImpl): void {
    assertRootLocalName(xml, 'Properties', partName);
    const root: RootMatch = matchRoot(xml, 'Properties');
    if (root === undefined) {
        return;
    }
    const fields: AppParsedFields = {
        company: undefined,
        manager: undefined,
        application: undefined,
        appVersion: undefined,
        hyperlinkBase: undefined,
        template: undefined,
        editTime: undefined,
        pageCount: undefined,
        wordCount: undefined,
        charCount: undefined,
        presentationTarget: undefined,
        lineCount: undefined,
        paragraphCount: undefined,
        slideCount: undefined,
        noteCount: undefined,
        hiddenCount: undefined,
        multimediaClipCount: undefined,
        linksUpToDate: undefined,
        extraChildrenXml: [],
        rootExtraAttrsXml: stripDeclNamespaceAttrs(root.attrText)
    };

    for (const child of iterateChildElements(root.inner)) {
        const local: string = child.localName.toLowerCase();
        if (!APP_KNOWN.has(local) || elementHasChildElements(child.inner)) {
            // Preserve complex/unknown nodes opaquely (HeadingPairs, TitlesOfParts, …).
            fields.extraChildrenXml.push(child.outerXml);
            continue;
        }
        const text: string = emptyToUndef(flattenElementText(child.inner));
        switch (local) {
        case 'company':
            fields.company = text;
            break;
        case 'manager':
            fields.manager = text;
            break;
        case 'application':
            fields.application = text;
            break;
        case 'appversion':
            fields.appVersion = text;
            break;
        case 'hyperlinkbase':
            fields.hyperlinkBase = text;
            break;
        case 'template':
            fields.template = text;
            break;
        case 'totaltime':
            fields.editTime = parseOptionalInt(text);
            break;
        case 'pages':
            fields.pageCount = parseOptionalInt(text);
            break;
        case 'words':
            fields.wordCount = parseOptionalInt(text);
            break;
        case 'characters':
            fields.charCount = parseOptionalInt(text);
            break;
        case 'presentationformat':
            fields.presentationTarget = text;
            break;
        case 'lines':
            fields.lineCount = parseOptionalInt(text);
            break;
        case 'paragraphs':
            fields.paragraphCount = parseOptionalInt(text);
            break;
        case 'slides':
            fields.slideCount = parseOptionalInt(text);
            break;
        case 'notes':
            fields.noteCount = parseOptionalInt(text);
            break;
        case 'hiddenslides':
            fields.hiddenCount = parseOptionalInt(text);
            break;
        case 'mmclips':
            fields.multimediaClipCount = parseOptionalInt(text);
            break;
        case 'linksuptodate':
            fields.linksUpToDate = parseOptionalBool(text);
            break;
        default:
            fields.extraChildrenXml.push(child.outerXml);
            break;
        }
    }

    props.applyAppParsed(fields);
}

/**
 * serializeCoreProperties function.
 *
 * @param {DocumentPropertiesImpl} props - The props parameter.
 * @returns {Uint8Array} - Returns the result.
 */
function serializeCoreProperties(props: DocumentPropertiesImpl): Uint8Array {
    const s: CoreParsedFields = props.coreSnapshot();
    const body: string[] = [];

    pushSimple(body, 'dc:title', s.title);
    pushSimple(body, 'dc:subject', s.subject);
    pushSimple(body, 'dc:creator', s.author);
    if (!s.keywordsPreservedRaw) {
        pushSimple(body, 'cp:keywords', s.keywords);
    }
    pushSimple(body, 'dc:description', s.comments);
    pushSimple(body, 'cp:lastModifiedBy', s.lastAuthor);
    pushSimple(body, 'cp:revision', s.revision);
    pushDctermsDate(body, 'dcterms:created', s.created);
    pushDctermsDate(body, 'dcterms:modified', s.modified);
    pushLastPrinted(body, s.lastPrinted);
    pushSimple(body, 'cp:category', s.category);
    pushSimple(body, 'cp:contentStatus', s.contentStatus);
    pushSimple(body, 'cp:version', s.version);
    pushSimple(body, 'dc:language', s.language);
    pushSimple(body, 'dc:identifier', s.identifier);

    for (const extra of s.extraChildrenXml) {
        body.push(extra);
    }

    const extraAttrs: string = s.rootExtraAttrsXml.length > 0 ? ` ${s.rootExtraAttrsXml}` : '';
    const xml: string =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<cp:coreProperties' +
        ` xmlns:cp="${CORE_PROPERTIES_NS}"` +
        ` xmlns:dc="${DUBLIN_CORE_NS}"` +
        ` xmlns:dcterms="${DUBLIN_CORE_TERMS_NS}"` +
        ' xmlns:dcmitype="http://purl.org/dc/dcmitype/"' +
        ` xmlns:xsi="${XML_SCHEMA_INSTANCE_NS}"` +
        `${extraAttrs}>` +
        body.join('') +
        '</cp:coreProperties>';
    return encodeUtf8(xml);
}

/**
 * Extended properties write order mirrors common Excel resaves so MS Excel opens library-authored packages without repair. User identity fields stay as set; inventory + defaults are synthesized on every dirty app rewrite. Citations: MS-OE376 §2.1.1885 DocSecurity, §2.1.1886 HeadingPairs, §2.1.1888 TitlesOfParts; shared-documentPropertiesExtended.xsd CT_Properties.
 *
 * @param {DocumentPropertiesImpl} props - The props parameter.
 * @param {string} sheetNames - The sheetNames parameter.
 * @returns {Uint8Array} - Returns the result.
 */
function serializeExtendedProperties(props: DocumentPropertiesImpl, sheetNames: ReadonlyArray<string>): Uint8Array {
    const s: AppParsedFields = props.appSnapshot();
    const body: string[] = [];

    // Excel-typical core inventory order, plus optional CT_Properties simple
    // fields when set (Template, counts, TotalTime, PresentationFormat, …).
    pushSimple(body, 'Template', s.template);
    pushSimple(body, 'Application', s.application);
    body.push('<DocSecurity>0</DocSecurity>');
    body.push('<ScaleCrop>false</ScaleCrop>');
    pushWorksheetInventory(body, sheetNames);
    pushSimple(body, 'Manager', s.manager);
    pushSimple(body, 'Company', s.company);
    pushInt(body, 'Pages', s.pageCount);
    pushInt(body, 'Words', s.wordCount);
    pushInt(body, 'Characters', s.charCount);
    pushInt(body, 'TotalTime', s.editTime);
    pushSimple(body, 'PresentationFormat', s.presentationTarget);
    pushInt(body, 'Lines', s.lineCount);
    pushInt(body, 'Paragraphs', s.paragraphCount);
    pushInt(body, 'Slides', s.slideCount);
    pushInt(body, 'Notes', s.noteCount);
    pushInt(body, 'HiddenSlides', s.hiddenCount);
    pushInt(body, 'MMClips', s.multimediaClipCount);
    // Default false when unset (Excel-typical); honor authored LinksUpToDate.
    body.push(`<LinksUpToDate>${s.linksUpToDate === true ? 'true' : 'false'}</LinksUpToDate>`);
    body.push('<SharedDoc>false</SharedDoc>');
    pushSimple(body, 'HyperlinkBase', s.hyperlinkBase);
    body.push('<HyperlinksChanged>false</HyperlinksChanged>');
    // Office rejects non-XX.YYYY AppVersion (MS-OE376 §2.1.1883). Omit invalid
    // values that arrived via lossless parse so a dirty app rewrite stays openable.
    if (s.appVersion !== undefined && isValidAppVersion(s.appVersion)) {
        pushSimple(body, 'AppVersion', s.appVersion);
    }

    for (const extra of s.extraChildrenXml) {
        const local: string = localNameOfOuterXml(extra).toLowerCase();
        if (APP_SYNTHESIZED_LOCALS.has(local)) {
            continue;
        }
        body.push(extra);
    }

    const extraAttrs: string = s.rootExtraAttrsXml.length > 0 ? ` ${s.rootExtraAttrsXml}` : '';
    const xml: string =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Properties' +
        ` xmlns="${EXTENDED_PROPERTIES_NS}"` +
        ` xmlns:vt="${DOC_PROPS_VTYPES_NS}"` +
        `${extraAttrs}>` +
        body.join('') +
        '</Properties>';
    return encodeUtf8(xml);
}

/**
 * HeadingPairs + TitlesOfParts for worksheets only (MS-OE376 Excel SheetType "Worksheets" pair). Count must be positive; omit inventory when no sheets.
 *
 * @param {string[]} body - The body parameter.
 * @param {string} sheetNames - The sheetNames parameter.
 * @returns {void} - Returns the result.
 */
function pushWorksheetInventory(body: string[], sheetNames: ReadonlyArray<string>): void {
    const count: number = sheetNames.length;
    if (count <= 0) {
        return;
    }
    body.push(
        '<HeadingPairs>' +
            '<vt:vector size="2" baseType="variant">' +
            '<vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>' +
            `<vt:variant><vt:i4>${count}</vt:i4></vt:variant>` +
            '</vt:vector>' +
            '</HeadingPairs>'
    );
    const titles: string = sheetNames.map((name: string): string => `<vt:lpstr>${escapeXmlText(name)}</vt:lpstr>`).join('');
    body.push('<TitlesOfParts>' + `<vt:vector size="${count}" baseType="lpstr">` + titles + '</vt:vector>' + '</TitlesOfParts>');
}

/**
 * pushSimple function.
 *
 * @param {string[]} body - The body parameter.
 * @param {string} tag - The tag parameter.
 * @param {string} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function pushSimple(body: string[], tag: string, value: string | undefined): void {
    if (value === undefined) {
        return;
    }
    body.push(`<${tag}>${escapeXmlText(value)}</${tag}>`);
}

/**
 * pushInt function.
 *
 * @param {string[]} body - The body parameter.
 * @param {string} tag - The tag parameter.
 * @param {number} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function pushInt(body: string[], tag: string, value: number | undefined): void {
    if (value === undefined) {
        return;
    }
    body.push(`<${tag}>${value}</${tag}>`);
}

/**
 * pushDctermsDate function.
 *
 * @param {string[]} body - The body parameter.
 * @param {string} tag - The tag parameter.
 * @param {*} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function pushDctermsDate(body: string[], tag: string, value: Date | undefined): void {
    if (value === undefined) {
        return;
    }
    body.push(`<${tag} xsi:type="dcterms:W3CDTF">${escapeXmlText(formatW3cdtf(value))}</${tag}>`);
}

/**
 * pushLastPrinted function.
 *
 * @param {string[]} body - The body parameter.
 * @param {*} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function pushLastPrinted(body: string[], value: Date | undefined): void {
    if (value === undefined) {
        return;
    }
    body.push(`<cp:lastPrinted>${escapeXmlText(formatW3cdtf(value))}</cp:lastPrinted>`);
}

/**
 * formatW3cdtf function.
 *
 * @param {Date} d - The d parameter.
 * @returns {string} - Returns the result.
 */
function formatW3cdtf(d: Date): string {
    // UTC Z form commonly used by Office for dcterms created/modified.
    const pad: (n: number, width: number) => string =
        /**
         * pad function.
         *
         * @param {number} n - The n parameter.
         * @param {number} width - The width parameter.
         * @returns {string} - Returns the result.
         */
        (n: number, width: number): string => {
            const s: string = n.toString();
            return '0'.repeat(Math.max(0, width - s.length)) + s;
        };
    const y: string = pad(d.getUTCFullYear(), 4);
    const m: string = pad(d.getUTCMonth() + 1, 2);
    const day: string = pad(d.getUTCDate(), 2);
    const hh: string = pad(d.getUTCHours(), 2);
    const mm: string = pad(d.getUTCMinutes(), 2);
    const ss: string = pad(d.getUTCSeconds(), 2);
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}Z`;
}

/**
 * parseWireDate function.
 *
 * @param {string} text - The text parameter.
 * @returns {*} - Returns the result.
 */
function parseWireDate(text: string | undefined): Date | undefined {
    if (text === undefined) {
        return undefined;
    }
    const t: string = text.trim();
    if (t.length === 0) {
        return undefined;
    }
    const ms: number = Date.parse(t);
    if (Number.isNaN(ms)) {
        return undefined;
    }
    return new Date(ms);
}

/**
 * emptyToUndef function.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function emptyToUndef(text: string): string | undefined {
    return text.length === 0 ? undefined : text;
}

/**
 * RootMatch.
 */
interface RootMatch {
    attrText: string;
    inner: string;
}

/**
 * matchRoot function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} localName - The localName parameter.
 * @returns {*} - Returns the result.
 */
function matchRoot(xml: string, localName: string): RootMatch | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const re: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])([^>]*)>`, 'i');
    const open: RegExpExecArray = re.exec(xml);
    if (open === null || open.index === undefined) {
        return undefined;
    }
    const attrText: string = open[2] != null ? open[2] : '';
    const contentStart: number = open.index + open[0].length;
    if (/\/>\s*$/.test(open[0]) || attrText.replace(/\s+$/, '').endsWith('/')) {
        return { attrText: attrText.replace(/\/\s*$/, ''), inner: '' };
    }
    const prefix: string = open[1] != null ? open[1] : '';
    const closeTag: string = `</${prefix}${localName}>`;
    const closeIdx: number = xml.indexOf(closeTag, contentStart);
    if (closeIdx < 0) {
        // Fallback: any close with same local name.
        // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
        const closeRe: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}>`, 'i');
        closeRe.lastIndex = contentStart;
        const cm: RegExpExecArray = closeRe.exec(xml);
        if (cm === null || cm.index === undefined) {
            return { attrText, inner: xml.slice(contentStart) };
        }
        return { attrText, inner: xml.slice(contentStart, cm.index) };
    }
    return { attrText, inner: xml.slice(contentStart, closeIdx) };
}

/**
 * ChildElement.
 */
interface ChildElement {
    localName: string;
    outerXml: string;
    inner: string;
}

/**
 * iterateChildElements function.
 *
 * @param {string} inner - The inner parameter.
 * @returns {ChildElement[]} - Returns the result.
 */
function iterateChildElements(inner: string): ChildElement[] {
    const results: ChildElement[] = [];
    let i: number = 0;
    const s: string = inner;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        // Skip comments, PI, close tags.
        if (s.startsWith('<!--', lt)) {
            const end: number = s.indexOf('-->', lt + 4);
            i = end < 0 ? s.length : end + 3;
            continue;
        }
        if (s.startsWith('<?', lt)) {
            const end: number = s.indexOf('?>', lt + 2);
            i = end < 0 ? s.length : end + 2;
            continue;
        }
        if (s.startsWith('</', lt)) {
            i = lt + 2;
            continue;
        }
        // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
        const openMatch: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)([^>]*)>/.exec(s.slice(lt));
        if (openMatch === null) {
            i = lt + 1;
            continue;
        }
        const fullOpen: string = openMatch[0];
        const prefix: string = openMatch[1] != null ? openMatch[1] : '';
        const localName: string = openMatch[2] != null ? openMatch[2] : '';
        const attrText: string = openMatch[3] != null ? openMatch[3] : '';
        const afterOpen: number = lt + fullOpen.length;
        if (attrText.replace(/\s+$/, '').endsWith('/') || fullOpen.endsWith('/>')) {
            results.push({
                localName,
                outerXml: fullOpen,
                inner: ''
            });
            i = afterOpen;
            continue;
        }
        const close: { innerEnd: number; end: number } = findMatchingClose(s, afterOpen, prefix, localName);
        if (close === undefined) {
            results.push({
                localName,
                outerXml: s.slice(lt),
                inner: s.slice(afterOpen)
            });
            break;
        }
        results.push({
            localName,
            outerXml: s.slice(lt, close.end),
            inner: s.slice(afterOpen, close.innerEnd)
        });
        i = close.end;
    }
    return results;
}

/**
 * findMatchingClose function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @param {string} prefix - The prefix parameter.
 * @param {string} localName - The localName parameter.
 * @returns {Object} - Returns the result.
 */
function findMatchingClose(s: string, from: number, prefix: string, localName: string): { innerEnd: number; end: number } | undefined {
    // Depth-aware scan for nested same local names.
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openRe: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])([^>]*)>`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closeRe: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}>`, 'g');
    let depth: number = 1;
    let pos: number = from;
    while (depth > 0 && pos < s.length) {
        openRe.lastIndex = pos;
        closeRe.lastIndex = pos;
        const om: RegExpExecArray = openRe.exec(s);
        const cm: RegExpExecArray = closeRe.exec(s);
        if (cm === null) {
            return undefined;
        }
        const openIdx: number = om === null ? Number.POSITIVE_INFINITY : om.index;
        const closeIdx: number = cm.index;
        // Self-closing opens shouldn't increase depth if they're the match — check.
        if (openIdx < closeIdx && om !== null) {
            const attr: string = om[2] != null ? om[2] : '';
            const selfClosing: boolean = attr.replace(/\s+$/, '').endsWith('/') || om[0].endsWith('/>');
            if (!selfClosing) {
                depth += 1;
            }
            pos = om.index + om[0].length;
        } else {
            depth -= 1;
            if (depth === 0) {
                return { innerEnd: closeIdx, end: closeIdx + cm[0].length };
            }
            pos = closeIdx + cm[0].length;
        }
    }
    return undefined;
}

/**
 * elementHasChildElements function.
 *
 * @param {string} inner - The inner parameter.
 * @returns {boolean} - Returns the result.
 */
function elementHasChildElements(inner: string): boolean {
    // Any start tag that is not a close.
    return /<(?!\/|!|\?)/.test(inner);
}

/**
 * flattenElementText function.
 *
 * @param {string} inner - The inner parameter.
 * @returns {string} - Returns the result.
 */
function flattenElementText(inner: string): string {
    // Strip tags, unescape entities, collapse nothing (preserve inner spaces).
    const noTags: string = inner.replace(/<[^>]+>/g, '');
    return unescapeXml(noTags).trim();
}

/**
 * stripDeclNamespaceAttrs function.
 *
 * @param {string} attrText - The attrText parameter.
 * @returns {string} - Returns the result.
 */
function stripDeclNamespaceAttrs(attrText: string): string {
    // Drop xmlns* so we re-emit canonical declarations; keep other attrs.
    const parts: string[] = [];
    const re: RegExp = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    for (;;) {
        const m: RegExpExecArray = re.exec(attrText);
        if (m === null) {
            break;
        }
        const name: string = m[1];
        if (name === undefined) {
            continue;
        }
        if (name === 'xmlns' || name.startsWith('xmlns:')) {
            continue;
        }
        const raw: string = ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[3]);
        parts.push(`${name}="${escapeXml(raw)}"`);
    }
    return parts.join(' ');
}

/**
 * localNameOfOuterXml function.
 *
 * @param {string} outer - The outer parameter.
 * @returns {string} - Returns the result.
 */
function localNameOfOuterXml(outer: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(outer);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * escapeRegExp function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
