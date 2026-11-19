/**
 * Cell formula types and CT_CellFormula parse/serialize (text only).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.40 `f`; §18.18.6 ST_CellFormulaType
 * - transitional sml.xsd CT_CellFormula / ST_CellFormulaType
 * - docs/specs/cell-formulas.md; docs/ooxml-mapping/cell-formulas.md
 *
 * Never evaluates formulas. Never resolves external workbook links.
 */

import { escapeXml, escapeXmlText, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';

/**
 * SpreadsheetML `ST_CellFormulaType` values.
 *
 * Citation: transitional sml.xsd ST_CellFormulaType enumerations.
 *
 * @private
 */
export type CellFormulaType = 'normal' | 'array' | 'dataTable' | 'shared';

const FORMULA_TYPES: ReadonlySet<string> = new Set(['normal', 'array', 'dataTable', 'shared']);

/**
 * Full formula view including shared/array metadata. Prefer public
 * {@link Cell.formula} for normal expression text.
 *
 * @private
 */
export interface CellFormula {
    /**
     * Expression text as stored in `f` character content.
     * Excel stores the expression without a mandatory leading `=`.
     */
    readonly expression: string;
    /** Formula type; default/omitted on wire is `normal`. */
    readonly type: CellFormulaType;
    /** Array/shared master range (`f@ref`) when present. */
    readonly ref?: string;
    /** Shared formula group index (`f@si`) when present. */
    readonly si?: number;
    /**
     * Other `f` attributes preserved for round-trip
     * (aca, ca, bx, dt2D, dtr, del1, del2, r1, r2, and unknowns).
     */
    readonly extraAttributes?: Readonly<Record<string, string>>;
}

/**
 * Options for internal {@link Cell.setFormula}.
 *
 * @private
 */
export interface SetFormulaOptions {
    /** Formula type; default `normal`. */
    readonly type?: CellFormulaType;
    /** Array/shared master range. */
    readonly ref?: string;
    /** Shared formula group index. */
    readonly si?: number;
    /**
     * When true (default), clear the cached calculated value so Excel recalculates.
     * When false, leave any existing `v` / type payload unchanged.
     */
    readonly clearCachedValue?: boolean;
    /**
     * Extra `f` attributes to emit. Prefer typed `type` / `ref` / `si`
     * for those fields.
     */
    readonly extraAttributes?: Readonly<Record<string, string>>;
}

/**
 * Options for internal {@link Cell.clearFormula}.
 *
 * @private
 */
export interface ClearFormulaOptions {
    /**
     * When true, also clear the cached value payload.
     * Default false — leave `v` if present.
     */
    readonly clearCachedValue?: boolean;
}

/**
 * Internal mutable formula state on {@link CellModel}.
 *
 * @private
 */
export interface CellFormulaState {
    expression: string;
    type: CellFormulaType;
    ref: string | undefined;
    si: number | undefined;
    /** Preserved non-primary attributes (local name → value). */
    extraAttributes: Record<string, string>;
    /** True when authored/mutated via API this session. */
    dirty: boolean;
}

/**
 * Whether `value` is a known ST_CellFormulaType.
 *
 * @param {string} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
export function isCellFormulaType(value: string): value is CellFormulaType {
    return FORMULA_TYPES.has(value);
}

/**
 * Convert internal state to the public readonly view.
 *
 * @param {CellFormulaState} state - The state parameter.
 * @returns {CellFormula} - Returns the result.
 */
export function formulaStateToPublic(state: CellFormulaState): CellFormula {
    const extras: Record<string, string> = state.extraAttributes;
    const keys: string[] = Object.keys(extras);
    const out: {
        expression: string;
        type: CellFormulaType;
        ref?: string;
        si?: number;
        extraAttributes?: Readonly<Record<string, string>>;
    } = {
        expression: state.expression,
        type: state.type
    };
    if (state.ref !== undefined) {
        out.ref = state.ref;
    }
    if (state.si !== undefined) {
        out.si = state.si;
    }
    if (keys.length > 0) {
        out.extraAttributes = { ...extras };
    }
    return out;
}

/**
 * Parse a full `<f>…</f>` (or self-closing) element into structured state. Does not evaluate. Shared/array slaves may have empty expression.
 *
 * @param {string} fXml - The fXml parameter.
 * @returns {CellFormulaState} - Returns the result.
 */
export function parseFormulaXml(fXml: string): CellFormulaState {
    const trimmed: string = fXml.trim();
    const attrsText: string = formulaOpenAttrs(trimmed);
    const attrMap: Map<string, string> = parseAttrMap(attrsText);
    const expression: string = unescapeXml(formulaInnerText(trimmed));

    let type: CellFormulaType = 'normal';
    const tRaw: string = attrMap.get('t');
    if (tRaw !== undefined && tRaw !== '' && isCellFormulaType(tRaw)) {
        type = tRaw;
    }

    let ref: string | undefined;
    const refRaw: string = attrMap.get('ref');
    if (refRaw !== undefined && refRaw !== '') {
        ref = refRaw;
    }

    let si: number | undefined;
    const siRaw: string = attrMap.get('si');
    if (siRaw !== undefined && siRaw !== '') {
        const n: number = Number.parseInt(siRaw, 10);
        if (Number.isFinite(n) && n >= 0) {
            si = n;
        }
    }

    const extraAttributes: Record<string, string> = {};
    const seen: Set<string> = new Set<string>();
    for (const [k, v] of attrMap) {
        const local: string = k.includes(':') ? k.slice(k.indexOf(':') + 1) : k;
        if (local === 't' || local === 'ref' || local === 'si') {
            continue;
        }
        if (seen.has(local)) {
            continue;
        }
        seen.add(local);
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        extraAttributes[local] = v;
    }

    return {
        expression,
        type,
        ref,
        si,
        extraAttributes,
        dirty: false
    };
}

/**
 * Serialize structured formula state to a `<f>…</f>` element string. Omits default `t="normal"`. Expression is XML-escaped. Citation: CT_CellFormula attribute order in transitional sml.xsd.
 *
 * @param {CellFormulaState} state - The state parameter.
 * @returns {string} - Returns the result.
 */
export function serializeFormulaXml(state: CellFormulaState): string {
    const attrs: string[] = [];
    if (state.type !== 'normal') {
        attrs.push(`t="${escapeXml(state.type)}"`);
    }

    // Schema attribute order (after t): aca, ref, dt2D, dtr, del1, del2, r1, r2, ca, si, bx
    const order: string[] = ['aca', 'ref', 'dt2D', 'dtr', 'del1', 'del2', 'r1', 'r2', 'ca', 'si', 'bx'];
    const emitted: Set<string> = new Set<string>();

    for (const name of order) {
        if (name === 'ref') {
            if (state.ref !== undefined) {
                attrs.push(`ref="${escapeXml(state.ref)}"`);
                emitted.add('ref');
            }
            continue;
        }
        if (name === 'si') {
            if (state.si !== undefined) {
                attrs.push(`si="${String(state.si)}"`);
                emitted.add('si');
            }
            continue;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const v: string = state.extraAttributes[name];
        if (v !== undefined) {
            attrs.push(`${name}="${escapeXml(v)}"`);
            emitted.add(name);
        }
    }

    const extraKeys: string[] = Object.keys(state.extraAttributes);
    for (let i: number = 0; i < extraKeys.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const k: string = extraKeys[i];
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const v: string = state.extraAttributes[k];
        if (emitted.has(k) || k === 't' || k === 'ref' || k === 'si') {
            continue;
        }
        attrs.push(`${k}="${escapeXml(v)}"`);
    }

    const attrStr: string = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    // Formula body is element text: keep literal " (Excel does not use &quot; here).
    const body: string = escapeXmlText(state.expression);
    if (body.length === 0) {
        // Shared slaves: empty body; prefer self-closing when attrs present or not.
        return `<f${attrStr}/>`;
    }
    return `<f${attrStr}>${body}</f>`;
}

/**
 * Build state from setFormula arguments (caller validates expression/type).
 *
 * @param {string} expression - The expression parameter.
 * @param {SetFormulaOptions} options - The options parameter.
 * @returns {CellFormulaState} - Returns the result.
 */
export function createFormulaState(expression: string, options?: SetFormulaOptions): CellFormulaState {
    const type: CellFormulaType = ((__t: CellFormulaType): CellFormulaType => (__t != null ? __t : 'normal'))(
        options == null ? undefined : options.type
    );
    const extraAttributes: Record<string, string> = {};
    const extra: Readonly<Record<string, string>> = options == null ? undefined : options.extraAttributes;
    if (extra !== undefined) {
        const extraKeys: string[] = Object.keys(extra);
        for (let i: number = 0; i < extraKeys.length; i++) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const k: string = extraKeys[i];
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const v: string = extra[k];
            const local: string = k.includes(':') ? k.slice(k.indexOf(':') + 1) : k;
            if (local === 't' || local === 'ref' || local === 'si') {
                continue;
            }
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            extraAttributes[local] = v;
        }
    }
    return {
        expression,
        type,
        ref: options == null ? undefined : options.ref,
        si: options == null ? undefined : options.si,
        extraAttributes,
        dirty: true
    };
}

/**
 * Strip a single leading `=` convenience prefix from caller text. Does not strip `+`/`-`/`@` — those remain part of the expression.
 *
 * @param {string} expression - The expression parameter.
 * @returns {string} - Returns the result.
 */
export function normalizeFormulaExpression(expression: string): string {
    if (expression.startsWith('=')) {
        return expression.slice(1);
    }
    return expression;
}

/**
 * formulaOpenAttrs function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function formulaOpenAttrs(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[1]);
}

/**
 * formulaInnerText function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function formulaInnerText(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>\s*$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = trimmed.indexOf('>');
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}
