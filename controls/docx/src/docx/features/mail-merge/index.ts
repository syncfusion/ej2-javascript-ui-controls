import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { elementChildren, isWml } from '../document/wml';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { TargetMode } from '../../core/opc/relationships';
import { featureId, registerFeature, registerFeatureMultiPartHandler } from '../../core/registry/index';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { parseXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
const MAIL_MERGE: FeatureId = featureId('mail-merge');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
/** Transitional settings relationship (ECMA-376-4 §9.2.3). */
const SETTINGS_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings';
/** Strict settings relationship (ECMA-376-1 §11.3.3). */
const STRICT_SETTINGS_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/settings';
/**
 *  Word recipientData relationship (`[MS-OI29500]` §2.1.378).
 *
 * @private
 */
export const RECIPIENT_DATA_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/recipientData';
/**
 *  Strict Mail Merge Recipient Data relationship (ECMA-376-1 §17.14.28).
 *
 * @private
 */
export const STRICT_RECIPIENT_DATA_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/mailMergeRecipientData';
/**
 *  Transitional mail merge data source (ECMA-376-4 §9.6).
 *
 * @private
 */
export const MAIL_MERGE_SOURCE_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/mailMergeSource';
/**
 *  Strict mail merge data source (ECMA-376-1 §11.7).
 *
 * @private
 */
export const STRICT_MAIL_MERGE_SOURCE_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/mailMergeSource';
/**
 *  Transitional mail merge header source (ECMA-376-4 §9.7).
 *
 * @private
 */
export const MAIL_MERGE_HEADER_SOURCE_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/mailMergeHeaderSource';
/**
 *  Strict mail merge header source (ECMA-376-1 §11.8).
 *
 * @private
 */
export const STRICT_MAIL_MERGE_HEADER_SOURCE_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/mailMergeHeaderSource';
/**
 *  Mail Merge Recipient Data content type (ECMA-376-1 / `[MS-OI29500]`).
 *
 * @private
 */
export const RECIPIENT_DATA_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.mailMergeRecipientData+xml';
const SETTINGS_RELATIONSHIP_TYPES: string[] = [
    SETTINGS_RELATIONSHIP_TYPE,
    STRICT_SETTINGS_RELATIONSHIP_TYPE
];
const RECIPIENT_DATA_RELATIONSHIP_TYPES: string[] = [
    RECIPIENT_DATA_RELATIONSHIP_TYPE,
    STRICT_RECIPIENT_DATA_RELATIONSHIP_TYPE
];
const DATA_SOURCE_RELATIONSHIP_TYPES: string[] = [
    MAIL_MERGE_SOURCE_RELATIONSHIP_TYPE,
    STRICT_MAIL_MERGE_SOURCE_RELATIONSHIP_TYPE,
    MAIL_MERGE_HEADER_SOURCE_RELATIONSHIP_TYPE,
    STRICT_MAIL_MERGE_HEADER_SOURCE_RELATIONSHIP_TYPE
];
/** `ST_MailMergeDocType` (Transitional `wml.xsd`).
 * @private
 */
export type MailMergeDocumentType = 'catalog' | 'envelopes' | 'mailingLabels' | 'formLetters' | 'email' | 'fax';
/** `ST_MailMergeDest` (Transitional `wml.xsd`).
 * @private
 */
export type MailMergeDestination = 'newDocument' | 'printer' | 'email' | 'fax';
function wmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseDocumentType(raw: string | undefined): MailMergeDocumentType | undefined {
    switch (raw) {
    case 'catalog':
    case 'envelopes':
    case 'mailingLabels':
    case 'formLetters':
    case 'email':
    case 'fax':
        return raw;
    default:
        return undefined;
    }
}
function parseDestination(raw: string | undefined): MailMergeDestination | undefined {
    switch (raw) {
    case 'newDocument':
    case 'printer':
    case 'email':
    case 'fax':
        return raw;
    default:
        return undefined;
    }
}
function findWmlChild(children: ReadonlyArray<OpenXmlElement>, localName: string): OpenXmlElement | undefined {
    return children.find((child: OpenXmlElement) => isWml(child, localName));
}
interface MailMergeMetadata {
    readonly present: boolean;
    readonly mainDocumentType: MailMergeDocumentType | undefined;
    readonly dataType: string | undefined;
    readonly destination: MailMergeDestination | undefined;
}
function parseMailMergeMetadata(settingsRoot: OpenXmlElement | undefined): MailMergeMetadata {
    if (settingsRoot === undefined || !isWml(settingsRoot, 'settings')) {
        return { present: false, mainDocumentType: undefined, dataType: undefined, destination: undefined };
    }
    const mailMerge: OpenXmlElement = findWmlChild(elementChildren(settingsRoot), 'mailMerge');
    if (mailMerge === undefined) {
        return { present: false, mainDocumentType: undefined, dataType: undefined, destination: undefined };
    }
    const children: ReadonlyArray<OpenXmlElement> = elementChildren(mailMerge);
    const typeElement: OpenXmlElement = findWmlChild(children, 'mainDocumentType');
    const dataTypeElement: OpenXmlElement = findWmlChild(children, 'dataType');
    const destinationElement: OpenXmlElement = findWmlChild(children, 'destination');
    return {
        present: true,
        mainDocumentType: parseDocumentType(typeElement === undefined ? undefined : wmlAttribute(typeElement, 'val')),
        dataType: dataTypeElement === undefined ? undefined : wmlAttribute(dataTypeElement, 'val'),
        destination: parseDestination(destinationElement === undefined ? undefined : wmlAttribute(destinationElement, 'val'))
    };
}
function countRecipientRecords(bytes: Uint8Array | undefined): number {
    if (bytes === undefined) {
        return 0;
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
    if (root.localName !== 'recipients') {
        return 0;
    }
    let count: number = 0;
    for (const child of elementChildren(root)) {
        if (child.localName === 'recipientData') {
            count += 1;
        }
    }
    return count;
}
function firstRelatedPart(pkg: OpcPackage, source: PartName, relationshipTypes: ReadonlyArray<string>): {
    readonly name: PartName;
    readonly data: Uint8Array;
} | undefined {
    for (const rel of relationshipsForPart(pkg, source).items) {
        if (relationshipTypes.indexOf(rel.type) === -1 || rel.targetMode === TargetMode.External) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, source);
        const part: PackagePart = partByName(pkg, target);
        if (part !== undefined) {
            return { name: part.name, data: part.data };
        }
    }
    return undefined;
}
function collectExternalTargets(pkg: OpcPackage, source: PartName, relationshipTypes: ReadonlyArray<string>): ReadonlyArray<string> {
    const targets: string[] = [];
    for (const rel of relationshipsForPart(pkg, source).items) {
        if (relationshipTypes.indexOf(rel.type) === -1 || rel.targetMode !== TargetMode.External) {
            continue;
        }
        targets.push(rel.target);
    }
    return targets;
}
/**
 * Preserve-only mail merge metadata catalog.
 * Recipient data and data-source relationships are never fetched, executed, or
 * mutated; connection strings and queries remain opaque.
 * @private
 */
export class MailMergeCatalog implements FeatureMultiPackagePart {
    private readonly metadata: MailMergeMetadata;
    private readonly recipientsBytes: Uint8Array | undefined;
    private readonly recipientCount: number;
    private readonly sourceTargets: ReadonlyArray<string>;
    /**
     * @param {MailMergeMetadata} metadata - The metadata.
     * @param {Uint8Array | undefined} recipientsBytes - The recipients bytes.
     * @param {number} recipientCount - The recipient count.
     * @param {ReadonlyArray<string>} sourceTargets - The source targets.
     * @private
     */
    constructor(
        metadata: MailMergeMetadata,
        recipientsBytes: Uint8Array | undefined,
        recipientCount: number,
        sourceTargets: ReadonlyArray<string>
    ) {
        this.metadata = metadata;
        this.recipientsBytes = recipientsBytes;
        this.recipientCount = recipientCount;
        this.sourceTargets = sourceTargets;
    }
    /**
     * Whether `w:mailMerge` is present on the WordDocument Settings part.
     *
     * @returns {boolean} The result.
     * @private
     */
    present(): boolean {
        return this.metadata.present;
    }
    /**
     * `w:mainDocumentType/@w:val`, or `undefined` when absent or unrecognized.
     *
     * @returns {MailMergeDocumentType | undefined} The result.
     * @private
     */
    mainDocumentType(): MailMergeDocumentType | undefined {
        return this.metadata.mainDocumentType;
    }
    /**
     * `w:dataType/@w:val`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @private
     */
    dataType(): string | undefined {
        return this.metadata.dataType;
    }
    /**
     * `w:destination/@w:val`, or `undefined` when absent or unrecognized.
     *
     * @returns {MailMergeDestination | undefined} The result.
     * @private
     */
    destination(): MailMergeDestination | undefined {
        return this.metadata.destination;
    }
    /**
     * Whether a Mail Merge Recipient Data part is related from settings.
     *
     * @returns {boolean} The result.
     * @private
     */
    hasRecipientsPart(): boolean {
        return this.recipientsBytes !== undefined;
    }
    /**
     * Number of `recipientData` children in the recipients part.
     *
     * @returns {number} The result.
     * @private
     */
    recipientRecordCount(): number {
        return this.recipientCount;
    }
    /**
     * External mail-merge data-source relationship targets. Never fetched.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    dataSourceTargets(): ReadonlyArray<string> {
        return this.sourceTargets;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return false;
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @param {PartName} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage {
        void mainPartName;
        return pkg;
    }
}
function loadMailMerge(pkg: OpcPackage, mainPartName: PartName): MailMergeCatalog {
    const settingsPart: { readonly name: PartName; readonly data: Uint8Array } = firstRelatedPart(
        pkg,
        mainPartName,
        SETTINGS_RELATIONSHIP_TYPES
    );
    if (settingsPart === undefined) {
        return new MailMergeCatalog(
            { present: false, mainDocumentType: undefined, dataType: undefined, destination: undefined },
            undefined,
            0,
            []
        );
    }
    const settingsRoot: OpenXmlElement = parseXml(utf8Decoder.decode(settingsPart.data));
    const metadata: MailMergeMetadata = parseMailMergeMetadata(settingsRoot);
    const recipients: { readonly name: PartName; readonly data: Uint8Array } = firstRelatedPart(
        pkg,
        settingsPart.name,
        RECIPIENT_DATA_RELATIONSHIP_TYPES
    );
    const sourceTargets: ReadonlyArray<string> = collectExternalTargets(pkg, settingsPart.name, DATA_SOURCE_RELATIONSHIP_TYPES);
    return new MailMergeCatalog(
        metadata,
        recipients == null ? undefined : recipients.data,
        countRecipientRecords(recipients == null ? undefined : recipients.data),
        sourceTargets
    );
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetMailMergeFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the mail-merge multi-part handler. Idempotent.
 */
export function registerMailMergeFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: MAIL_MERGE });
    registerFeatureMultiPartHandler({
        featureId: MAIL_MERGE,
        relationshipTypes: RECIPIENT_DATA_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): MailMergeCatalog {
            return loadMailMerge(pkg, ctx.mainPartName);
        }
    });
}
Object.defineProperty(WordDocument.prototype, 'mailMerge', {
    get(this: WordDocument): MailMergeCatalog {
        const part: FeaturePartState = this.featurePart(MAIL_MERGE);
        if (part === undefined || !(part instanceof MailMergeCatalog)) {
            throw new DocxError('feature/not-registered', 'Mail merge catalog was not loaded; call registerMailMergeFeature() before WordDocument.open');
        }
        return part;
    }
});
registerMailMergeFeature();
