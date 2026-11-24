import { ContentTypeRecord, ContentTypes, MAIN_DOCUMENT_CONTENT_TYPE } from './content-types';
import { OpcPackage, PackagePart, PartRelationshipSet } from './package';
import { partNameKey, resolveInternalTarget, PartName } from './part-name';
import { OpcRelationship, Relationships } from './relationships';

/**
 * Supported Word document package file formats.
 *
 * @public
 */
export enum FileFormatType {
    /** Specifies the DOCX type. */
    DOCX = 'docx',
    /** Specifies the DOTX type. */
    DOTX = 'dotx',
    /** Specifies the DOCM type. */
    DOCM = 'docm',
    /** Specifies the DOTM type. */
    DOTM = 'dotm'
}

/**
 * Specifies the supported document file formats.
 *
 * @public
 */
export type FileFormat = 'docx' | 'dotx' | 'docm' | 'dotm';

interface FormatConfig {
    readonly contentType: string;
    readonly macroEnabled: boolean;
    readonly template: boolean;
    readonly extension: string;
}

/** Single source of truth for format-specific package settings. */
const FORMATS: { readonly [key in FileFormat]: FormatConfig } = {
    docx: { contentType: MAIN_DOCUMENT_CONTENT_TYPE, macroEnabled: false, template: false, extension: '.docx' },
    dotx: { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml', macroEnabled: false, template: true, extension: '.dotx' },
    docm: { contentType: 'application/vnd.ms-word.document.macroEnabled.main+xml', macroEnabled: true, template: false, extension: '.docm' },
    dotm: { contentType: 'application/vnd.ms-word.template.macroEnabledTemplate.main+xml', macroEnabled: true, template: true, extension: '.dotm' }
};

/** Relationship types of macro parts hung off the main document part. */
const MACRO_RELATIONSHIP_TYPES: ReadonlyArray<string> = [
    'http://schemas.microsoft.com/office/2006/relationships/vbaProject',
    'http://schemas.microsoft.com/office/2006/relationships/wordVbaData',
    'http://schemas.microsoft.com/office/2006/relationships/vbaProjectSignature',
    'http://schemas.microsoft.com/office/2006/relationships/vbaProjectSignatureAgile'
];

/**
 * Normalizes a FileFormatType enum value or string token to its lowercase wire form.
 *
 * @param {FileFormatType | FileFormat | string | undefined} value - The input format value.
 * @returns {FileFormat | undefined} The resolved FileFormat wire token, or undefined if not recognized.
 * @private
 */
export function resolveFileFormat(value: FileFormatType | FileFormat | string | undefined): FileFormat | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    const normalized: string = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(FORMATS, normalized)) {
        return normalized as FileFormat;
    }
    return undefined;
}

/**
 * @param {unknown} value - The value.
 * @returns {boolean} `true` when the condition is met; otherwise `false`.
 * @private
 */
export function isFileFormat(value: unknown): value is FileFormat | FileFormatType {
    return resolveFileFormat(value as string) !== undefined;
}

/**
 * @param {FileFormat | FileFormatType} format - The format.
 * @returns {string} The result of the operation.
 * @private
 */
export function fileExtensionForFormat(format: FileFormat | FileFormatType): string {
    const found: FileFormat | undefined = resolveFileFormat(format);
    const resolved: FileFormat = found === undefined ? 'docx' : found;
    // eslint-disable-next-line security/detect-object-injection
    return FORMATS[resolved].extension;
}

/**
 * Detects the package format from the main document content type.
 * Unknown content types are treated as `docx`.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} main - The main.
 * @returns {FileFormat} The result of the operation.
 * @private
 */
export function detectPackageFormat(pkg: OpcPackage, main: PartName): FileFormat {
    const key: string = partNameKey(main);
    const part: PackagePart | undefined = pkg.parts.find((p: PackagePart) => partNameKey(p.name) === key);
    const contentType: string | undefined = part === undefined ? undefined : part.contentType;
    for (const format of Object.keys(FORMATS) as FileFormat[]) {
        // eslint-disable-next-line security/detect-object-injection
        if (FORMATS[format].contentType === contentType) {
            return format;
        }
    }
    return 'docx';
}

/**
 * Maps a wire {@link FileFormat} token to its {@link FileFormatType} enum equivalent.
 *
 * @param {FileFormat} format - The format.
 * @returns {FileFormatType} The result of the operation.
 * @private
 */
export function fileFormatTypeFromFormat(format: FileFormat): FileFormatType {
    switch (format) {
    case 'dotx':
        return FileFormatType.DOTX;
    case 'docm':
        return FileFormatType.DOCM;
    case 'dotm':
        return FileFormatType.DOTM;
    case 'docx':
    default:
        return FileFormatType.DOCX;
    }
}

function macroPartNames(pkg: OpcPackage, main: PartName): PartName[] {
    const key: string = partNameKey(main);
    const names: PartName[] = [];
    for (const set of pkg.partRelationships) {
        if (partNameKey(set.source) !== key) {
            continue;
        }
        for (const rel of set.relationships.items) {
            if (MACRO_RELATIONSHIP_TYPES.indexOf(rel.type) >= 0 && rel.targetMode !== 'External') {
                names.push(resolveInternalTarget(rel.target, main));
            }
        }
    }
    // Parts owned by macro parts (for example vbaData.xml) go with them.
    for (let i: number = 0; i < names.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const owned: string = partNameKey(names[i]);
        for (const set of pkg.partRelationships) {
            if (partNameKey(set.source) !== owned) {
                continue;
            }
            for (const rel of set.relationships.items) {
                if (rel.targetMode !== 'External') {
                    // eslint-disable-next-line security/detect-object-injection
                    names.push(resolveInternalTarget(rel.target, names[i]));
                }
            }
        }
    }
    return names;
}

/**
 * Returns a package whose main document content type (and macro parts) match
 * `format`. Macro parts are kept byte-for-byte for macro-enabled output and
 * dropped (with relationships and content types) for non-macro output.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} main - The main.
 * @param {FileFormat | FileFormatType} format - The format.
 * @returns {OpcPackage} The result of the operation.
 * @private
 */
export function withPackageFormat(pkg: OpcPackage, main: PartName, format: FileFormat | FileFormatType): OpcPackage {
    const found: FileFormat | undefined = resolveFileFormat(format);
    const resolved: FileFormat = found === undefined ? 'docx' : found;
    // eslint-disable-next-line security/detect-object-injection
    const config: FormatConfig = FORMATS[resolved];
    const mainKey: string = partNameKey(main);
    const macros: PartName[] = config.macroEnabled ? [] : macroPartNames(pkg, main);
    const macroKeys: Set<string> = new Set<string>(macros.map((n: PartName) => partNameKey(n)));
    const parts: PackagePart[] = pkg.parts
        .filter((p: PackagePart) => !macroKeys.has(partNameKey(p.name)))
        .map((p: PackagePart) => partNameKey(p.name) === mainKey ? { name: p.name, contentType: config.contentType, data: p.data } : p);
    const partRelationships: PartRelationshipSet[] = pkg.partRelationships
        .filter((set: PartRelationshipSet) => !macroKeys.has(partNameKey(set.source)))
        .map((set: PartRelationshipSet) => {
            if (partNameKey(set.source) !== mainKey) {
                return set;
            }
            const filteredRels: ReadonlyArray<OpcRelationship> = set.relationships.items.filter((rel: OpcRelationship) => {
                if (rel.targetMode === 'External') {
                    return true;
                }
                const targetName: PartName = resolveInternalTarget(rel.target, main);
                return !macroKeys.has(partNameKey(targetName));
            });
            return { source: set.source, relationships: { items: filteredRels, opaque: set.relationships.opaque } };
        });
    const mainName: string = main;
    const records: ContentTypeRecord[] = pkg.contentTypes.records
        .filter((r: ContentTypeRecord) => r.kind !== 'override' || !macroKeys.has(partNameKey(r.partName)))
        // eslint-disable-next-line @typescript-eslint/prefer-as-const -- `as const` needs TypeScript 3.4+; this project compiles with 3.3
        .map((r: ContentTypeRecord) => r.kind === 'override' && partNameKey(r.partName) === mainKey ? { kind: 'override' as 'override', partName: mainName, contentType: config.contentType } : r);
    const hasMainOverride: boolean = records.some((r: ContentTypeRecord) => r.kind === 'override' && partNameKey(r.partName) === mainKey);
    const updatedRecords: ContentTypeRecord[] = hasMainOverride
        ? records
        // eslint-disable-next-line @typescript-eslint/prefer-as-const -- `as const` needs TypeScript 3.4+; this project compiles with 3.3
        : [...records, { kind: 'override' as 'override', partName: mainName, contentType: config.contentType }];
    return {
        contentTypes: { records: updatedRecords },
        packageRelationships: pkg.packageRelationships,
        parts,
        partRelationships
    };
}
