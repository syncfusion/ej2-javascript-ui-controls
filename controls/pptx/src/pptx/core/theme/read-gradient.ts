/** Complete authored gradient reader shared by all DrawingML fill hosts. */
import { arrayAt } from '../util/es5-compat';
import { getAttr } from '../shapes/dom-utils';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { tryParseColorChoiceChild } from './parse-color-choice';
import { DML_NS } from './constants';
import { ColorValue } from './color-value';
import { ThemeColorTransform, ThemeGradientPath, ThemeGradientStop, ThemeFillStyle } from './theme-render-model';
import { AuthoredGradientFill, AuthoredGradientRectangle, AuthoredGradientShade, AuthoredGradientStop,
    GradientReadDiagnostic, GradientTileFlip } from './gradient-types';
import { GradientDialect, GradientLexical, parseGradientAngle, parseGradientBoolean, parseGradientPercentage } from './gradient-values';

/** Strict DrawingML namespace from the Part 1 schema, not a prefix alias. */
const STRICT_DML_NS: string = 'http://purl.oclc.org/ooxml/drawingml/main';

/**
 * Reads complete sparse authored data without mutation, resolution or defaults.
 *
 * @param {OoxmlElement} element - Candidate gradFill element in either dialect.
 * @param {string} partName - Optional owning package part for diagnostics.
 * @returns {AuthoredGradientFill | undefined} Clone-safe data, or undefined for a foreign host.
 * @internal
 */
export function readAuthoredGradient(element: OoxmlElement, partName?: string): AuthoredGradientFill | undefined {
    const ns: string = element.namespaceUri;
    if (element.localName !== 'gradFill' || (ns !== DML_NS && ns !== STRICT_DML_NS)) { return undefined; }
    const dialect: GradientDialect = ns === STRICT_DML_NS ? 'strict' : 'transitional';
    const diagnostics: GradientReadDiagnostic[] = [];
    const lists: OoxmlElement[] = children(element, ns, 'gsLst');
    if (lists.length > 1) { issue(diagnostics, 'gsLst', 'Multiple gradient stop lists.'); }
    const stopElements: OoxmlElement[] = lists.length === 0 ? [] : children(arrayAt(lists, 0), ns, 'gs');
    if (lists.length > 0 && stopElements.length < 2) { issue(diagnostics, 'gsLst', 'A present stop list requires at least two stops.'); }
    const stops: AuthoredGradientStop[] | undefined = lists.length === 0 ? undefined : stopElements.map(
        (stop: OoxmlElement, index: number): AuthoredGradientStop => {
            const position: GradientLexical<number> = parseGradientPercentage(getAttr(stop, '', 'pos'), dialect, 'stop');
            if (position.kind !== 'value') { issue(diagnostics, 'gs/@pos', 'Missing or invalid stop position.', index); }
            const color: ColorValue | undefined = tryParseColorChoiceChild(stop, ns);
            const colorElements: OoxmlElement[] = children(stop, ns).filter((child: OoxmlElement): boolean => isColor(child.localName));
            if (colorElements.length !== 1 || color === undefined) { issue(diagnostics, 'gs/color', 'A stop requires exactly one recognized color choice.', index); }
            const colorElement: OoxmlElement | undefined = colorElements.length === 0 ? undefined : arrayAt(colorElements, 0);
            return { position, color, colorTransforms: readGradientColorTransforms(colorElement, ns, dialect) };
        });
    const shadeElements: OoxmlElement[] = children(element, ns).filter(
        (child: OoxmlElement): boolean => child.localName === 'lin' || child.localName === 'path');
    if (shadeElements.length > 1) { issue(diagnostics, 'shade', 'Gradient shading is one linear or path choice.'); }
    const shade: AuthoredGradientShade | undefined = shadeElements.length === 0 ? undefined :
        readShade(arrayAt(shadeElements, 0), ns, dialect, diagnostics);
    const rotateWithShape: GradientLexical<boolean> = parseGradientBoolean(getAttr(element, '', 'rotWithShape'));
    const flip: GradientLexical<GradientTileFlip> = readFlip(getAttr(element, '', 'flip'));
    invalid(diagnostics, 'gradFill/@rotWithShape', rotateWithShape);
    invalid(diagnostics, 'gradFill/@flip', flip);
    const tileRect: AuthoredGradientRectangle | undefined = readRectangle(element, 'tileRect', ns, dialect, diagnostics);
    const located: GradientReadDiagnostic[] = partName === undefined ? diagnostics :
        diagnostics.map((entry: GradientReadDiagnostic): GradientReadDiagnostic => ({ ...entry, partName }));
    return { kind: 'gradient', stops, shade, rotateWithShape, flip, tileRect, diagnostics: located };
}

/**
 * Reads one present shading element and its sparse fields.
 *
 * @param {OoxmlElement} element - Linear or path element.
 * @param {string} ns - DrawingML namespace.
 * @param {GradientDialect} dialect - Owning dialect.
 * @param {GradientReadDiagnostic[]} diagnostics - Collected issues.
 * @returns {AuthoredGradientShade} Authored shade without defaults.
 */
function readShade(
    element: OoxmlElement, ns: string, dialect: GradientDialect, diagnostics: GradientReadDiagnostic[]
): AuthoredGradientShade {
    if (element.localName === 'lin') {
        const angle: GradientLexical<number> = parseGradientAngle(getAttr(element, '', 'ang'));
        const scaled: GradientLexical<boolean> = parseGradientBoolean(getAttr(element, '', 'scaled'));
        invalid(diagnostics, 'lin/@ang', angle); invalid(diagnostics, 'lin/@scaled', scaled);
        return { kind: 'linear', angle, scaled };
    }
    const path: GradientLexical<ThemeGradientPath> = readPath(getAttr(element, '', 'path'));
    invalid(diagnostics, 'path/@path', path);
    return { kind: 'path', path, fillToRect: readRectangle(element, 'fillToRect', ns, dialect, diagnostics) };
}

/**
 * Reads an optional rectangle, retaining present-empty and per-edge absence.
 *
 * @param {OoxmlElement} parent - Owning gradient or path.
 * @param {string} name - Rectangle local name.
 * @param {string} ns - DrawingML namespace.
 * @param {GradientDialect} dialect - Owning dialect.
 * @param {GradientReadDiagnostic[]} diagnostics - Collected issues.
 * @returns {AuthoredGradientRectangle | undefined} Sparse authored rectangle.
 */
function readRectangle(
    parent: OoxmlElement, name: string, ns: string, dialect: GradientDialect, diagnostics: GradientReadDiagnostic[]
): AuthoredGradientRectangle | undefined {
    const list: OoxmlElement[] = children(parent, ns, name);
    if (list.length === 0) { return undefined; }
    if (list.length > 1) { issue(diagnostics, name, 'Multiple rectangle elements.'); }
    const element: OoxmlElement = arrayAt(list, 0);
    const left: GradientLexical<number> = parseGradientPercentage(getAttr(element, '', 'l'), dialect, 'rectangle');
    const top: GradientLexical<number> = parseGradientPercentage(getAttr(element, '', 't'), dialect, 'rectangle');
    const right: GradientLexical<number> = parseGradientPercentage(getAttr(element, '', 'r'), dialect, 'rectangle');
    const bottom: GradientLexical<number> = parseGradientPercentage(getAttr(element, '', 'b'), dialect, 'rectangle');
    invalid(diagnostics, name + '/@l', left); invalid(diagnostics, name + '/@t', top);
    invalid(diagnostics, name + '/@r', right); invalid(diagnostics, name + '/@b', bottom);
    return { left, top, right, bottom };
}

/**
 * Reads transforms in source order; unresolved/unknown XML stays on the document.
 *
 * @param {OoxmlElement | undefined} color - Direct color choice.
 * @param {string} ns - DrawingML namespace.
 * @param {GradientDialect} dialect - Owning dialect.
 * @returns {ThemeColorTransform[]} Ordered names and numeric authored units.
 */
export function readGradientColorTransforms(color: OoxmlElement | undefined, ns: string, dialect: GradientDialect): ThemeColorTransform[] {
    if (color === undefined) { return []; }
    return children(color, ns).map((transform: OoxmlElement): ThemeColorTransform => {
        const raw: string | undefined = getAttr(transform, '', 'val');
        let value: number | undefined;
        if (raw !== undefined && raw.charAt(raw.length - 1) === '%') {
            const parsed: GradientLexical<number> = parseGradientPercentage(raw, dialect, 'rectangle');
            value = parsed.kind === 'value' ? parsed.value * 100000 : undefined;
        } else if (raw !== undefined && /^[+-]?[0-9]+$/.test(trimToken(raw))) {
            const numeric: number = Number(trimToken(raw)); value = Number.isFinite(numeric) ? numeric : undefined;
        }
        return { kind: transform.localName, value };
    });
}

/**
 * Collects only direct children in the expected namespace.
 *
 * @param {OoxmlElement} parent - Owning element.
 * @param {string} ns - Exact namespace URI.
 * @param {string} name - Optional local-name restriction.
 * @returns {OoxmlElement[]} Matching children in document order.
 */
function children(parent: OoxmlElement, ns: string, name?: string): OoxmlElement[] {
    const result: OoxmlElement[] = [];
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === ns && (name === undefined || child.localName === name)) { result.push(child); }
    }
    return result;
}

/**
 * Recognizes the six DrawingML color choices.
 *
 * @param {string} name - Child local name.
 * @returns {boolean} Whether the name is an EG_ColorChoice member.
 */
function isColor(name: string): boolean {
    return name === 'srgbClr' || name === 'scrgbClr' || name === 'hslClr' || name === 'sysClr' || name === 'schemeClr' || name === 'prstClr';
}

/**
 * Reads an authored path token without supplying shape as a default.
 *
 * @param {string | undefined} raw - Authored token.
 * @returns {GradientLexical<ThemeGradientPath>} Sparse/valid/invalid token.
 */
function readPath(raw: string | undefined): GradientLexical<ThemeGradientPath> {
    if (raw === undefined) { return { kind: 'absent' }; }
    const token: string = trimToken(raw);
    return token === 'circle' || token === 'rect' || token === 'shape' ?
        { kind: 'value', raw, value: token } : { kind: 'invalid', raw };
}

/**
 * Reads a tile-flip token without applying an Office rendering override.
 *
 * @param {string | undefined} raw - Authored token.
 * @returns {GradientLexical<GradientTileFlip>} Sparse/valid/invalid token.
 */
function readFlip(raw: string | undefined): GradientLexical<GradientTileFlip> {
    if (raw === undefined) { return { kind: 'absent' }; }
    const token: string = trimToken(raw);
    return token === 'none' || token === 'x' || token === 'y' || token === 'xy' ?
        { kind: 'value', raw, value: token } : { kind: 'invalid', raw };
}

/**
 * Records an invalid optional attribute while keeping its raw token in the model.
 *
 * @param {GradientReadDiagnostic[]} diagnostics - Collected issues.
 * @param {string} field - Relative field location.
 * @template T
 * @param {GradientLexical<T>} value - Parsed authored value.
 * @returns {void} No result.
 */
function invalid<T>(diagnostics: GradientReadDiagnostic[], field: string, value: GradientLexical<T>): void {
    if (value.kind === 'invalid') { issue(diagnostics, field, 'Invalid authored value.'); }
}

/**
 * Adds a location-aware read finding without changing XML.
 *
 * @param {GradientReadDiagnostic[]} diagnostics - Collected issues.
 * @param {string} field - Relative field location.
 * @param {string} message - Description.
 * @param {number} stopIndex - Optional stop identity by source order.
 * @returns {void} No result.
 */
function issue(diagnostics: GradientReadDiagnostic[], field: string, message: string, stopIndex?: number): void {
    diagnostics.push({ field, stopIndex, message });
}

/**
 * Projects valid authored values into the existing compatibility read model.
 *
 * @remarks Invalid positions are omitted, never fabricated as zero; diagnostics
 * remain on the complete authored model and original XML is unchanged.
 * @param {AuthoredGradientFill} authored - Complete sparse gradient.
 * @returns {Extract<ThemeFillStyle, {kind: 'gradient'}>} Existing required-member projection.
 * @internal
 */
export function projectAuthoredGradient(authored: AuthoredGradientFill): Extract<ThemeFillStyle, {kind: 'gradient'}> {
    const stops: ThemeGradientStop[] = [];
    if (authored.stops !== undefined) {
        for (let i: number = 0; i < authored.stops.length; i++) {
            const stop: AuthoredGradientStop = arrayAt(authored.stops, i);
            if (stop.position.kind === 'value') {
                stops.push({ position: stop.position.value, color: stop.color, colorTransforms: stop.colorTransforms });
            }
        }
    }
    const shade: AuthoredGradientShade | undefined = authored.shade;
    return {
        kind: 'gradient', stops,
        angle: shade !== undefined && shade.kind === 'linear' && shade.angle.kind === 'value' ? shade.angle.value : undefined,
        path: shade !== undefined && shade.kind === 'path' && shade.path.kind === 'value' ? shade.path.value : undefined,
        fillToRect: shade !== undefined && shade.kind === 'path' && shade.fillToRect !== undefined ? {
            left: numberValue(shade.fillToRect.left), top: numberValue(shade.fillToRect.top),
            right: numberValue(shade.fillToRect.right), bottom: numberValue(shade.fillToRect.bottom)
        } : undefined
    };
}

/**
 * Maps a known fill host namespace to its DrawingML dialect.
 *
 * @param {string} namespaceUri - PresentationML or DrawingML host namespace.
 * @returns {string | undefined} Matching DrawingML URI, or undefined for foreign XML.
 * @internal
 */
export function getGradientDrawingNamespace(namespaceUri: string): string | undefined {
    if (namespaceUri === DML_NS || namespaceUri === 'http://schemas.openxmlformats.org/presentationml/2006/main') {
        return DML_NS;
    }
    if (namespaceUri === STRICT_DML_NS || namespaceUri === 'http://purl.oclc.org/ooxml/presentationml/main') {
        return STRICT_DML_NS;
    }
    return undefined;
}

/**
 * Reads a valid projected number without defaulting an absent/invalid edge.
 *
 * @param {GradientLexical<number>} value - Sparse numeric field.
 * @returns {number | undefined} Authored valid number, otherwise undefined.
 */
function numberValue(value: GradientLexical<number>): number | undefined {
    return value.kind === 'value' ? value.value : undefined;
}

/**
 * Trims XML token whitespace without accepting non-XML Unicode whitespace.
 *
 * @param {string} raw - Authored enumeration or integer token.
 * @returns {string} Token with XML edge whitespace removed.
 */
function trimToken(raw: string): string {
    return raw.replace(/^[ \t\r\n]+/, '').replace(/[ \t\r\n]+$/, '');
}
