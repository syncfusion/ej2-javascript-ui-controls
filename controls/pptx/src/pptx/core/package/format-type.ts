/**
 * Presentation package format (file extension and main-part content type).
 *
 * @remarks
 * Numeric members match the public contract. Each value maps to one Office
 * Open XML package family already accepted on open — never an invented
 * content type.
 *
 * Citations:
 * - ECMA-376 Part 1 presentation main parts (`presentation.main+xml`,
 *   `template.main+xml`) via `specs/generated/engineering-reference-pack/03-OPC-PACKAGING/opc.md`.
 * - [MS-OFFMACRO2] macro-enabled main types
 *   `application/vnd.ms-powerpoint.presentation.macroEnabled.main+xml` and
 *   `application/vnd.ms-powerpoint.template.macroEnabled.main+xml`.
 */
export enum FormatType {
    /** `.pptx` — non-macro presentation. Default for `save()` with no argument. */
    Pptx = 0,
    /** `.pptm` — macro-enabled presentation. */
    Pptm = 1,
    /** `.potx` — non-macro presentation template. */
    Potx = 2,
    /** `.potm` — macro-enabled presentation template. */
    Potm = 3
}

/**
 * Main-part content type for each {@link FormatType}.
 *
 * @remarks Strings are the four types already listed in
 * `PRESENTATION_MAIN_CONTENT_TYPES`. Slideshow (`.ppsx` / `.ppsm`) is not a
 * conversion target.
 */
export const FORMAT_MAIN_CONTENT_TYPES: Readonly<{ [key: number]: string }> = Object.freeze({
    [FormatType.Pptx]: 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml',
    [FormatType.Pptm]: 'application/vnd.ms-powerpoint.presentation.macroEnabled.main+xml',
    [FormatType.Potx]: 'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml',
    [FormatType.Potm]: 'application/vnd.ms-powerpoint.template.macroEnabled.main+xml'
});

/**
 * Whether a format is a macro-enabled package (`.pptm` / `.potm`).
 *
 * @param {FormatType} format - Target format.
 * @returns {boolean} `true` for macro-enabled formats.
 */
export function formatIsMacroEnabled(format: FormatType): boolean {
    return format === FormatType.Pptm || format === FormatType.Potm;
}

/**
 * Resolves a file name extension to {@link FormatType}.
 *
 * @remarks Comparison is case-insensitive. Only `.pptx`, `.pptm`, `.potx`, and
 * `.potm` are supported. Other extensions (including `.ppsx`) throw.
 * @param {string} fileName - Path or file name.
 * @returns {FormatType} Matching format.
 */
export function getFormatTypeFromExtension(fileName: string): FormatType {
    const dot: number = fileName.lastIndexOf('.');
    const ext: string = dot < 0 ? '' : fileName.slice(dot).toLowerCase();
    if (ext === '.pptx') {
        return FormatType.Pptx;
    }
    if (ext === '.pptm') {
        return FormatType.Pptm;
    }
    if (ext === '.potx') {
        return FormatType.Potx;
    }
    if (ext === '.potm') {
        return FormatType.Potm;
    }
    throw new TypeError('Unsupported presentation extension: ' + ext);
}

/**
 * Resolves a presentation main content type to {@link FormatType}.
 *
 * @param {string} contentType - Presentation main part content type.
 * @returns {FormatType | undefined} Matching format, or `undefined` when the
 * type is not one of the four save targets (for example slideshow).
 */
export function getFormatTypeFromContentType(contentType: string): FormatType | undefined {
    if (contentType === FORMAT_MAIN_CONTENT_TYPES[FormatType.Pptx]) {
        return FormatType.Pptx;
    }
    if (contentType === FORMAT_MAIN_CONTENT_TYPES[FormatType.Pptm]) {
        return FormatType.Pptm;
    }
    if (contentType === FORMAT_MAIN_CONTENT_TYPES[FormatType.Potx]) {
        return FormatType.Potx;
    }
    if (contentType === FORMAT_MAIN_CONTENT_TYPES[FormatType.Potm]) {
        return FormatType.Potm;
    }
    return undefined;
}
