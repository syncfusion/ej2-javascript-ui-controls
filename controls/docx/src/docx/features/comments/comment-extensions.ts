import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { TargetMode } from '../../core/opc/relationships';
import { parseXml, OpenXmlElement } from '../../core/xml/index';
import { OpenXmlChild, OpenXmlAttribute } from '../../core/xml/model';
/**
 * @private
 * `[MS-DOCX]` §2.1.2 commentsExtended relationship. */
export const COMMENTS_EXTENDED_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2011/relationships/commentsExtended';
/**
 * @private
 * `[MS-DOCX]` §2.1.3 people relationship. */
export const PEOPLE_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2011/relationships/people';
/**
 * @private
 * `[MS-DOCX]` §2.1.4 commentsIds relationship. */
export const COMMENTS_IDS_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2016/09/relationships/commentsIds';
/**
 * @private
 * `[MS-DOCX]` §2.1.5 commentsExtensible relationship. */
export const COMMENTS_EXTENSIBLE_RELATIONSHIP_TYPE: string = 'http://schemas.microsoft.com/office/2018/08/relationships/commentsExtensible';
/**
 * @private
 * `[MS-DOCX]` §2.5.1.5 commentsExtended root namespace. */
export const COMMENTS_EXTENDED_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2012/wordml';
/**
 * @private
 * `[MS-DOCX]` §2.8 commentsIds root namespace. */
export const COMMENTS_IDS_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2016/wordml/cid';
/**
 * @private
 * `[MS-DOCX]` §2.10 commentsExtensible root namespace. */
export const COMMENTS_EXTENSIBLE_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2018/wordml/cex';
/**
 * @private
 */
export const COMMENTS_EXTENDED_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml';
/**
 * @private
 */
export const PEOPLE_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.people+xml';
/**
 * @private
 */
export const COMMENTS_IDS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsIds+xml';
/**
 * @private
 */
export const COMMENTS_EXTENSIBLE_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtensible+xml';
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
/**
 * One `w15:commentEx` row from `commentsExtended` (`[MS-DOCX]` CT_CommentEx).
 *
 * @private
 */
export interface CommentExEntry {
    /** `commentEx/@paraId` — last body paragraph paraId of the associated comment. */
    readonly paraId: string;
    /** `commentEx/@paraIdParent` — last body paragraph paraId of the parent comment, when a reply. */
    readonly paraIdParent: string | undefined;
    /**
     * `commentEx/@done` when present.
     * `false` only when the attribute is `"0"` (DocIO-aligned); otherwise `true` when present.
     */
    readonly done: boolean | undefined;
}
interface ExtensionPartState {
    readonly extendedEntryCount: number;
    readonly extendedEntries: ReadonlyArray<CommentExEntry>;
    readonly peopleCount: number;
    readonly peopleAuthors: ReadonlyArray<string>;
    readonly idsEntryCount: number;
    readonly extensibleEntryCount: number;
}
const EMPTY_PART_COUNTS: {
    extendedEntryCount: number;
    extendedEntries: ReadonlyArray<CommentExEntry>;
    peopleCount: number;
    peopleAuthors: ReadonlyArray<string>;
    idsEntryCount: number;
    extensibleEntryCount: number;
} = {
    extendedEntryCount: 0,
    extendedEntries: [] as ReadonlyArray<CommentExEntry>,
    peopleCount: 0,
    peopleAuthors: [] as ReadonlyArray<string>,
    idsEntryCount: 0,
    extensibleEntryCount: 0
};
/**
 * @private
 */
export interface ExtensionMetadata {
    readonly extended: ExtensionPartState | undefined;
    readonly people: ExtensionPartState | undefined;
    readonly ids: ExtensionPartState | undefined;
    readonly extensible: ExtensionPartState | undefined;
}
export const EMPTY_EXTENSION_METADATA: ExtensionMetadata = {
    extended: undefined,
    people: undefined,
    ids: undefined,
    extensible: undefined
};
function isNamespace(element: OpenXmlElement, namespaceUri: string, localName: string): boolean {
    return element.namespaceUri === namespaceUri && element.localName === localName;
}
function childElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((child: OpenXmlChild): child is OpenXmlElement => child.kind === 'element');
}
function namespacedAttribute(element: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === namespaceUri || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
/**
 * DocIO-aligned `done` parse: attribute absent → `undefined`; `"0"` → `false`; any other value → `true`.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {boolean | undefined} The result.
 */
function parseCommentExDone(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    return raw !== '0';
}
function parseCommentExEntries(root: OpenXmlElement): {
    readonly count: number;
    readonly entries: ReadonlyArray<CommentExEntry>;
} {
    let count: number = 0;
    const entries: CommentExEntry[] = [];
    for (const child of childElements(root)) {
        if (!isNamespace(child, COMMENTS_EXTENDED_NAMESPACE, 'commentEx')) {
            continue;
        }
        count += 1;
        const paraId: string = namespacedAttribute(child, COMMENTS_EXTENDED_NAMESPACE, 'paraId');
        if (paraId === undefined || paraId.length === 0) {
            continue;
        }
        const paraIdParent: string = namespacedAttribute(child, COMMENTS_EXTENDED_NAMESPACE, 'paraIdParent');
        entries.push({
            paraId,
            paraIdParent: paraIdParent !== undefined && paraIdParent.length > 0 ? paraIdParent : undefined,
            done: parseCommentExDone(namespacedAttribute(child, COMMENTS_EXTENDED_NAMESPACE, 'done'))
        });
    }
    return { count, entries };
}
function parseExtensionPartMetadata(bytes: Uint8Array): ExtensionPartState | undefined {
    if (bytes.byteLength === 0) {
        return undefined;
    }
    try {
        const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
        if (isNamespace(root, COMMENTS_EXTENDED_NAMESPACE, 'commentsEx')) {
            const parsed: { readonly count: number; readonly entries: ReadonlyArray<CommentExEntry>; } = parseCommentExEntries(root);
            return {
                ...EMPTY_PART_COUNTS,
                extendedEntryCount: parsed.count,
                extendedEntries: parsed.entries
            };
        }
        if (isNamespace(root, COMMENTS_EXTENDED_NAMESPACE, 'people')) {
            const authors: string[] = [];
            let count: number = 0;
            for (const child of childElements(root)) {
                if (!isNamespace(child, COMMENTS_EXTENDED_NAMESPACE, 'person')) {
                    continue;
                }
                count += 1;
                const author: string = namespacedAttribute(child, COMMENTS_EXTENDED_NAMESPACE, 'author');
                if (author !== undefined && author.length > 0) {
                    authors.push(author);
                }
            }
            return {
                ...EMPTY_PART_COUNTS,
                peopleCount: count,
                peopleAuthors: authors
            };
        }
        if (isNamespace(root, COMMENTS_IDS_NAMESPACE, 'commentsIds')) {
            let count: number = 0;
            for (const child of childElements(root)) {
                if (isNamespace(child, COMMENTS_IDS_NAMESPACE, 'commentId')) {
                    count += 1;
                }
            }
            return {
                ...EMPTY_PART_COUNTS,
                idsEntryCount: count
            };
        }
        if (isNamespace(root, COMMENTS_EXTENSIBLE_NAMESPACE, 'commentsExtensible')) {
            let count: number = 0;
            for (const child of childElements(root)) {
                if (isNamespace(child, COMMENTS_EXTENSIBLE_NAMESPACE, 'commentExtensible')) {
                    count += 1;
                }
            }
            return {
                ...EMPTY_PART_COUNTS,
                extensibleEntryCount: count
            };
        }
    }
    catch {
        return { ...EMPTY_PART_COUNTS };
    }
    return undefined;
}
function firstRelatedPartBytes(pkg: OpcPackage, source: PartName, relationshipType: string): Uint8Array | undefined {
    for (const rel of relationshipsForPart(pkg, source).items) {
        if (rel.type !== relationshipType || rel.targetMode === TargetMode.External) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, source);
        const part: PackagePart = partByName(pkg, target);
        if (part !== undefined) {
            return part.data;
        }
    }
    return undefined;
}
/**
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @returns {ExtensionMetadata} The result.
 * @private
 */
export function loadCommentExtensionMetadata(pkg: OpcPackage, mainPartName: PartName): ExtensionMetadata {
    const extendedBytes: Uint8Array = firstRelatedPartBytes(pkg, mainPartName, COMMENTS_EXTENDED_RELATIONSHIP_TYPE);
    const peopleBytes: Uint8Array = firstRelatedPartBytes(pkg, mainPartName, PEOPLE_RELATIONSHIP_TYPE);
    const idsBytes: Uint8Array = firstRelatedPartBytes(pkg, mainPartName, COMMENTS_IDS_RELATIONSHIP_TYPE);
    const extensibleBytes: Uint8Array = firstRelatedPartBytes(pkg, mainPartName, COMMENTS_EXTENSIBLE_RELATIONSHIP_TYPE);
    return {
        extended: extendedBytes === undefined ? undefined : parseExtensionPartMetadata(extendedBytes),
        people: peopleBytes === undefined ? undefined : parseExtensionPartMetadata(peopleBytes),
        ids: idsBytes === undefined ? undefined : parseExtensionPartMetadata(idsBytes),
        extensible: extensibleBytes === undefined ? undefined : parseExtensionPartMetadata(extensibleBytes)
    };
}
/**
 * MS-DOCX comment extension parts linked from the Main Document.
 *
 * @private
 */
export class CommentExtensionParts {
    private readonly metadata: ExtensionMetadata;
    /**
     * @param {ExtensionMetadata} metadata - The metadata.
     * @private
     */
    constructor(metadata: ExtensionMetadata) {
        this.metadata = metadata;
    }
    /**
     * Whether a `commentsExtended` part (`commentsEx` root) was found.
     *
     * @returns {boolean} The result.
     * @private
     */
    extendedPresent(): boolean {
        return this.metadata.extended !== undefined;
    }
    /**
     * Count of `commentEx` entries under `commentsEx`.
     *
     * @returns {number} The result.
     * @private
     */
    extendedEntryCount(): number {
        let ts330: any;
        return (
            (ts330 = this.metadata.extended == null ? undefined : this.metadata.extended.extendedEntryCount),
            ts330 != null ? ts330 : 0
        );
    }
    /**
     * Parsed `commentEx` rows with a non-empty `paraId` (order preserved).
     *
     * @returns {ReadonlyArray<CommentExEntry>} The result.
     * @private
     */
    extendedEntries(): ReadonlyArray<CommentExEntry> {
        let ts331: any;
        return ((ts331 = this.metadata.extended == null ? undefined : this.metadata.extended.extendedEntries), ts331 != null ? ts331 : []);
    }
    /**
     * Whether a `people` part was found.
     *
     * @returns {boolean} The result.
     * @private
     */
    peoplePresent(): boolean {
        return this.metadata.people !== undefined;
    }
    /**
     * Count of `person` entries under `people`.
     *
     * @returns {number} The result.
     * @private
     */
    peopleCount(): number {
        let ts332: any;
        return ((ts332 = this.metadata.people == null ? undefined : this.metadata.people.peopleCount), ts332 != null ? ts332 : 0);
    }
    /**
     * `person/@author` values in document order.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    peopleAuthors(): ReadonlyArray<string> {
        let ts333: any;
        return ((ts333 = this.metadata.people == null ? undefined : this.metadata.people.peopleAuthors), ts333 != null ? ts333 : []);
    }
    /**
     * Whether a `commentsIds` part was found.
     *
     * @returns {boolean} The result.
     * @private
     */
    idsPresent(): boolean {
        return this.metadata.ids !== undefined;
    }
    /**
     * Count of `commentId` entries under `commentsIds`.
     *
     * @returns {number} The result.
     * @private
     */
    idsEntryCount(): number {
        let ts334: any;
        return ((ts334 = this.metadata.ids == null ? undefined : this.metadata.ids.idsEntryCount), ts334 != null ? ts334 : 0);
    }
    /**
     * Whether a `commentsExtensible` part was found.
     *
     * @returns {boolean} The result.
     * @private
     */
    extensiblePresent(): boolean {
        return this.metadata.extensible !== undefined;
    }
    /**
     * Count of `commentExtensible` entries under `commentsExtensible`.
     *
     * @returns {number} The result.
     * @private
     */
    extensibleEntryCount(): number {
        let ts335: any;
        return (
            (ts335 = this.metadata.extensible == null ? undefined : this.metadata.extensible.extensibleEntryCount),
            ts335 != null ? ts335 : 0
        );
    }
}
