/**
 * Converts Formatter step data into display text and optional rich HTML
 * for Text, JSON, Markdown, and Table formats.
 *
 * @internal
 */

import { ExpressionEvaluator } from './expression-evaluator';

/**
 * Workflow Formatter Output Format.
 *
 * @private
 */
export type WorkflowFormatterOutputFormat = 'Text' | 'JSON' | 'Markdown' | 'Table';

/**
 * Runtime payload stored on Formatter steps while simulation is active.
 *
 * @private
 */
export interface WorkflowFormatterRuntimeOutput {
    format: string;
    display: string;
    html?: string;
}

/**
 * Formatter Output Result.
 *
 * @private
 */
export interface FormatterOutputResult {
    format: string;
    display: string;
    html?: string;
}

/**
 * Formats workflow data for Formatter step canvas display and event payload.
 *
 * @private
 */
export class FormatterOutput {
    /**
     * Normalize Format.
     *
     * @param {Object} format The format.
     * @returns {WorkflowFormatterOutputFormat} The result.
     * @private
     */
    public static normalizeFormat(format: unknown): WorkflowFormatterOutputFormat {
        const value: string = String(format || 'Text');
        if (value === 'JSON' || value === 'Markdown' || value === 'Table') {
            return value;
        }
        return 'Text';
    }

    /**
     * Format.
     *
     * @param {Object} data The data.
     * @param {Object} format The format.
     * @returns {FormatterOutputResult} The result.
     * @private
     */
    public static format(data: unknown, format: unknown): FormatterOutputResult {
        const normalized: WorkflowFormatterOutputFormat = FormatterOutput.normalizeFormat(format);
        if (normalized === 'JSON') {
            // Pretty multi-line JSON (same style as simulation log).
            return { format: normalized, display: FormatterOutput.jsonValue(data) };
        }
        if (normalized === 'Table') {
            return {
                format: normalized,
                display: FormatterOutput.jsonValue(data),
                html: FormatterOutput.tableHtml(data)
            };
        }
        if (normalized === 'Markdown') {
            return {
                format: normalized,
                display: FormatterOutput.markdownValue(data),
                html: FormatterOutput.markdownHtml(data)
            };
        }
        // Text: plain items without JSON braces — "key: value" lines / array items.
        return {
            format: normalized,
            display: typeof data === 'string' ? data : FormatterOutput.textValue(data)
        };
    }

    /**
     * When ContextPath resolves to a scalar, wrap as { [fieldLabel]: value }
     * so Table/Markdown show the path field name (e.g. Support ID | Ticket001)
     * instead of a generic "Value" column.
     * Objects/arrays are left unchanged (already have their own keys).
     *
     * @param {unknown} data - Context path value.
     * @param {string | undefined} pathLabel - Display label for scalar values.
     * @returns {unknown} Original data or a labeled scalar object.
     * @private
     */
    public static withContextPathLabel(data: unknown, pathLabel: string | undefined): unknown {
        if (!pathLabel || !String(pathLabel).trim()) {
            return data;
        }
        // Missing values stay empty (do not wrap — JSON.stringify drops undefined keys → {}).
        if (data === undefined) {
            return data;
        }
        if (data !== null && typeof data === 'object') {
            return data;
        }
        const record: Record<string, unknown> = {};
        record[String(pathLabel).trim()] = data;
        return record;
    }

    /**
     * Derives a human-readable label from a context path string.
     * Examples:
     *   Support ID → Support ID
     *   {{$.previousStep.response["Support ID"]}} → Support ID
     *   $.input.response.Priority → Priority
     *   {{$.input.response.Ticket ID}} → Ticket ID
     *
     * @param {string | undefined | null} path - Context path to label.
     * @returns {string} Human-readable path label.
     * @private
     */
    public static labelFromPath(path: string | undefined | null): string {
        const raw: string = String(path || '').trim();
        if (!raw) {
            return '';
        }
        // Strip {{ }} wrappers.
        let body: string = raw;
        const wrapped: RegExpExecArray | null = /^\{\{\s*(.+?)\s*\}\}$/.exec(body);
        if (wrapped) {
            body = wrapped[1].trim();
        }
        // Bare field name (no $ root).
        if (body.indexOf('$.') !== 0 && body.charAt(0) !== '$') {
            return body;
        }
        // Prefer normalized path so spaced tails become one bracket key
        // (e.g. $.input.response.Ticket ID → …["Ticket ID"]).
        const normalized: string | null = ExpressionEvaluator.normalizePath(body);
        const pathForLabel: string = normalized || body;
        const segments: string[] = ExpressionEvaluator.segments(pathForLabel);
        if (segments.length > 0) {
            return segments[segments.length - 1];
        }
        // Fallback: last bracket key on the raw body.
        const bracketMatches: RegExpMatchArray | null =
            body.match(/\[(?:'([^']*)'|"([^"]*)"|([^\]]+))\]/g);
        if (bracketMatches && bracketMatches.length) {
            const last: string = bracketMatches[bracketMatches.length - 1];
            const inner: RegExpExecArray | null =
                /\[(?:'([^']*)'|"([^"]*)"|([^\]]+))\]/.exec(last);
            if (inner) {
                return (inner[1] || inner[2] || (inner[3] ? inner[3].trim() : '')).trim();
            }
        }
        // Spaced dotted leaf: $.input.response.Ticket ID → Ticket ID
        const looseLeaf: RegExpExecArray | null =
            // This pattern intentionally accepts spaced dotted field names.
            // eslint-disable-next-line security/detect-unsafe-regex
            /\.([A-Za-z0-9_]+(?:\s+[A-Za-z0-9_]+)+)\s*$/.exec(body);
        if (looseLeaf && looseLeaf[1]) {
            return looseLeaf[1].trim();
        }
        // Last dotted segment (identifier only).
        const dotMatches: RegExpMatchArray | null = body.match(/\.([A-Za-z0-9_]+)/g);
        if (dotMatches && dotMatches.length) {
            const lastDot: string = dotMatches[dotMatches.length - 1];
            return lastDot.replace(/^\./, '');
        }
        return body;
    }

    /**
     * To Runtime Output.
     *
     * @param {FormatterOutputResult} result The result.
     * @returns {WorkflowFormatterRuntimeOutput} The result.
     * @private
     */
    public static toRuntimeOutput(result: FormatterOutputResult): WorkflowFormatterRuntimeOutput {
        const runtime: WorkflowFormatterRuntimeOutput = {
            format: result.format,
            display: result.display
        };
        if (result.html) {
            runtime.html = result.html;
        }
        return runtime;
    }

    /**
     * Read Runtime Output.
     *
     * @param {Record} stepCustomProps The step custom props.
     * @returns {WorkflowFormatterRuntimeOutput} The result.
     * @private
     */
    public static readRuntimeOutput(stepCustomProps: Record<string, unknown> | undefined): WorkflowFormatterRuntimeOutput | null {
        if (!stepCustomProps || typeof stepCustomProps !== 'object') {
            return null;
        }
        const raw: unknown = stepCustomProps.runtimeOutput;
        if (!raw || typeof raw !== 'object') {
            return null;
        }
        const record: Record<string, unknown> = raw as Record<string, unknown>;
        if (typeof record.display !== 'string' && typeof record.html !== 'string') {
            return null;
        }
        return {
            format: String(record.format || 'Text'),
            display: typeof record.display === 'string' ? record.display : '',
            html: typeof record.html === 'string' ? record.html : undefined
        };
    }

    /**
     * Clear Runtime Output.
     *
     * @param {Record} stepCustomProps The step custom props.
     * @returns {void} Nothing.
     * @private
     */
    public static clearRuntimeOutput(stepCustomProps: Record<string, unknown> | undefined): void {
        if (!stepCustomProps || typeof stepCustomProps !== 'object') {
            return;
        }
        delete stepCustomProps.runtimeOutput;
    }

    /**
     * Pretty-printed JSON for JSON format and nested object fallbacks.
     *
     * @param {unknown} value - Value to serialize.
     * @returns {string} Pretty-printed JSON or fallback text.
     */
    private static jsonValue(value: unknown): string {
        if (value === undefined) {
            return '';
        }
        if (value === null) {
            return 'null';
        }
        if (typeof value === 'string') {
            // Show strings as JSON string literals when the whole payload is a string.
            try {
                return JSON.stringify(value, null, 2);
            } catch {
                return value;
            }
        }
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    /**
     * Plain Text format: no braces.
     * Objects → key: value lines; arrays → one item per line; scalars as-is.
     * Null renders as the literal `null`; undefined renders as the empty string.
     *
     * @param {unknown} value - Value to format as plain text.
     * @returns {string} Plain text representation.
     */
    private static textValue(value: unknown): string {
        if (value === undefined) {
            return '';
        }
        if (value === null) {
            return 'null';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
            return String(value);
        }
        if (Array.isArray(value)) {
            return value.map((item: unknown) => {
                if (item !== null && typeof item === 'object') {
                    return FormatterOutput.textValue(item);
                }
                return item === undefined || item === null ? '' : String(item);
            }).join('\n');
        }
        if (value && typeof value === 'object') {
            return Object.keys(value as Record<string, unknown>).map((key: string) => {
                // Formatter keys are user-defined object keys.
                // eslint-disable-next-line security/detect-object-injection
                const item: unknown = (value as Record<string, unknown>)[key];
                if (item !== null && typeof item === 'object') {
                    return key + ':\n' + FormatterOutput.textValue(item);
                }
                return key + ': ' + (item === undefined || item === null ? '' : String(item));
            }).join('\n');
        }
        return String(value);
    }

    /**
     * Nested object/array pretty print used inside Markdown/Table cells.
     *
     * @param {unknown} value - Value to stringify.
     * @returns {string} Stringified value.
     */
    private static stringifyValue(value: unknown): string {
        return FormatterOutput.jsonValue(value);
    }

    private static markdownValue(value: unknown): string {
        if (Array.isArray(value)) {
            return value.map((item: unknown) =>
                `- ${typeof item === 'object' ? FormatterOutput.stringifyValue(item) : String(item)}`
            ).join('\n');
        }
        if (value && typeof value === 'object') {
            return Object.keys(value as Record<string, unknown>).map((key: string) => {
                // Formatter keys are user-defined object keys.
                // eslint-disable-next-line security/detect-object-injection
                const item: unknown = (value as Record<string, unknown>)[key];
                return `- **${key}**: ${typeof item === 'object' ? FormatterOutput.stringifyValue(item) : String(item)}`;
            }).join('\n');
        }
        return String(value === undefined || value === null ? '' : value);
    }

    private static markdownHtml(value: unknown): string {
        if (Array.isArray(value)) {
            const items: string = value.map((item: unknown) => {
                if (typeof item === 'object' && item !== null) {
                    return `<li><pre>${FormatterOutput.escapeHtml(FormatterOutput.stringifyValue(item))}</pre></li>`;
                }
                return `<li>${FormatterOutput.escapeHtml(item)}</li>`;
            }).join('');
            return `<ul class="e-wf-formatter-md-list">${items}</ul>`;
        }
        if (value && typeof value === 'object') {
            const items: string = Object.keys(value as Record<string, unknown>).map((key: string) => {
                // Formatter keys are user-defined object keys.
                // eslint-disable-next-line security/detect-object-injection
                const item: unknown = (value as Record<string, unknown>)[key];
                const body: string = typeof item === 'object' && item !== null
                    ? `<pre>${FormatterOutput.escapeHtml(FormatterOutput.stringifyValue(item))}</pre>`
                    : FormatterOutput.escapeHtml(item);
                return `<li><strong>${FormatterOutput.escapeHtml(key)}</strong>: ${body}</li>`;
            }).join('');
            return `<ul class="e-wf-formatter-md-list">${items}</ul>`;
        }
        return FormatterOutput.markdownStringToHtml(String(value === undefined || value === null ? '' : value));
    }

    private static markdownStringToHtml(text: string): string {
        let html: string = FormatterOutput.escapeHtml(text || '');
        html = html
            .replace(/^###\s+(.+)$/gm, '<h4>$1</h4>')
            .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
            .replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        const lines: string[] = html.split('\n');
        let out: string = '';
        let inList: boolean = false;
        for (let i: number = 0; i < lines.length; i++) {
            const line: string = lines[parseInt(i.toString(), 10)];
            const match: RegExpMatchArray | null = line.match(/^\s*-\s+(.*)$/);
            if (match) {
                if (!inList) {
                    out += '<ul class="e-wf-formatter-md-list">';
                    inList = true;
                }
                out += `<li>${match[1]}</li>`;
            } else {
                if (inList) {
                    out += '</ul>';
                    inList = false;
                }
                if (line.trim()) {
                    out += `<p>${line}</p>`;
                }
            }
        }
        if (inList) {
            out += '</ul>';
        }
        return out || '<p></p>';
    }

    private static tableHtml(value: unknown): string {
        const cell: (v: unknown) => string = (v: unknown): string => {
            // null/undefined are scalars (typeof null === 'object'), so check them first
            // to avoid JSON-stringifying them into the literal text "null".
            if (v === undefined || v === null) {
                return '<td></td>';
            }
            const renderedHTML: string = typeof v === 'object'
                ? FormatterOutput.escapeHtml(FormatterOutput.stringifyValue(v))
                : FormatterOutput.escapeHtml(v);
            return `<td>${renderedHTML}</td>`;
        };
        if (Array.isArray(value) && value.length && value[0] && typeof value[0] === 'object') {
            const keySet: { [key: string]: boolean } = Object.create(null);
            value.forEach((row: unknown) => {
                if (row && typeof row === 'object') {
                    Object.keys(row as Record<string, unknown>).forEach((key: string) => {
                        // Table columns are user-defined object keys.
                        // eslint-disable-next-line security/detect-object-injection
                        keySet[key] = true;
                    });
                }
            });
            const keys: string[] = Object.keys(keySet);
            const head: string = keys.map((key: string) =>
                `<th>${FormatterOutput.escapeHtml(key)}</th>`
            ).join('');
            const body: string = value.map((row: unknown) => {
                const record: Record<string, unknown> = row && typeof row === 'object'
                    ? row as Record<string, unknown>
                    : {};
                return `<tr>${keys.map((key: string) => {
                    // Table columns are user-defined object keys.
                    // eslint-disable-next-line security/detect-object-injection
                    return cell(record[key]);
                }).join('')}</tr>`;
            }).join('');
            return `<table class="e-wf-formatter-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
        }
        if (Array.isArray(value)) {
            const body: string = value.map((item: unknown, index: number) =>
                `<tr><th>${index + 1}</th>${cell(item)}</tr>`
            ).join('');
            return `<table class="e-wf-formatter-table"><tbody>${body}</tbody></table>`;
        }
        if (value && typeof value === 'object') {
            const body: string = Object.keys(value as Record<string, unknown>).map((key: string) => {
                // Table columns are user-defined object keys.
                // eslint-disable-next-line security/detect-object-injection
                return `<tr><th>${FormatterOutput.escapeHtml(key)}</th>${cell((value as Record<string, unknown>)[key])}</tr>`;
            }).join('');
            return `<table class="e-wf-formatter-table"><tbody>${body}</tbody></table>`;
        }
        return `<table class="e-wf-formatter-table"><tbody><tr><th>Value</th>${cell(value)}</tr></tbody></table>`;
    }

    /**
     * Escape Html.
     *
     * @param {Object} value The value.
     * @returns {string} The result.
     * @private
     */
    public static escapeHtml(value: unknown): string {
        if (value === undefined || value === null) {
            return '';
        }
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
