/**
 * Configuration options for the Markdown Converter.
 *
 * @interface MarkdownConverterOptions
 */
export interface MarkdownConverterOptions {
    /**
     * Indicates whether the conversion should run asynchronously.
     * If `true`, the converter will return a Promise.
     *
     * @default false
     */
    async?: boolean;

    /**
     * Enables line breaks in the output.
     * When `true`, single line breaks in Markdown will be converted to `<br>` tags.
     *
     * @default false
     */
    lineBreak?: boolean;

    /**
     * Enables GitHub Flavored Markdown (GFM) support.
     * This includes tables, task lists, and other GFM-specific syntax.
     *
     * @default true
     */
    gfm?: boolean;

    /**
     * Suppresses errors during parsing.
     * When `true`, the converter will ignore invalid Markdown instead of throwing errors.
     *
     * @default false
     */
    silent?: boolean;
}
