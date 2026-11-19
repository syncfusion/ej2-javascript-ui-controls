import { arrayAt } from '../util/es5-compat';
/** Detached authoring boundary. Local dml-main.xsd CT_GradientFillProperties,
 * CT_GradientStopList, EG_ColorChoice/Transform and CT_ShapeProperties govern output.
 * No live document is touched until the complete subtree has passed validation.
 */
import { PresentationError } from '../errors';
import { OoxmlAttribute, OoxmlElement } from '../xml/dom';
import { ColorValue } from '../theme/color-value';
import { SCHEME_COLOR_VALS } from '../theme/constants';
import { GRADIENT_PRESET_COLORS } from '../theme/gradient-preset-colors';
import { GradientDialect, parseGradientAngle, parseGradientPercentage, serializeGradientAngle,
    serializeGradientBoolean, serializeGradientPercentage } from '../theme/gradient-values';
import { GradientColorOperation, GradientFillOptions, GradientRectangleOptions, GradientStopOptions } from './gradient-fill-options';
/** Caller-correctable authoring error with target location. @public */
export class GradientFillError extends PresentationError {
    /** Target package part, when available. */
    readonly partName: string | undefined;
    /** Target property, including the stop index where applicable. */
    readonly property: string;
    /**
     * @param {string | undefined} partName - Target package part.
     * @param {string} property - Invalid target property.
     */
    constructor(partName: string | undefined, property: string) {
        super('model/invalid-argument', 'Invalid gradient fill property: ' + property);
        this.name = 'GradientFillError'; this.partName = partName; this.property = property;
        Object.setPrototypeOf(this, GradientFillError.prototype);
    }
}
const SYSTEM_COLORS: ReadonlyArray<string> = ['scrollBar', 'background', 'activeCaption', 'inactiveCaption', 'menu',
    'window', 'windowFrame', 'menuText', 'windowText', 'captionText', 'activeBorder', 'inactiveBorder', 'appWorkspace',
    'highlight', 'highlightText', 'btnFace', 'btnShadow', 'grayText', 'btnText', 'inactiveCaptionText', 'btnHighlight',
    '3dDkShadow', '3dLight', 'infoText', 'infoBk', 'hotLight', 'gradientActiveCaption', 'gradientInactiveCaption',
    'menuHighlight', 'menuBar'];
const EMPTY_OPERATIONS: ReadonlyArray<string> = ['comp', 'inv', 'gray', 'gamma', 'invGamma'];
const PERCENT_OPERATIONS: ReadonlyArray<string> = ['tint', 'shade', 'alpha', 'alphaOff', 'alphaMod', 'hueMod',
    'sat', 'satOff', 'satMod', 'lum', 'lumOff', 'lumMod', 'red', 'redOff', 'redMod', 'green', 'greenOff', 'greenMod',
    'blue', 'blueOff', 'blueMod'];
/**
 * Builds a fully validated gradient without touching a live tree.
 *
 * @internal
 * @param {GradientFillOptions} options - Edited authoring values.
 * @param {string} ns - Owning DrawingML namespace.
 * @param {string | undefined} partName - Diagnostic part identity.
 * @returns {OoxmlElement} Detached subtree.
 */
export function buildGradientFill(options: GradientFillOptions, ns: string, partName?: string): OoxmlElement {
    const writer: GradientWriter = new GradientWriter(ns, partName);
    return writer.gradient(options);
}
/**
 * Builds an authored solid color without resolving theme references.
 *
 * @internal
 * @param {ColorValue} color - Edited color choice.
 * @param {string} ns - Owning DrawingML namespace.
 * @param {string | undefined} partName - Diagnostic part identity.
 * @returns {OoxmlElement} Detached solid fill.
 */
export function buildSolidFill(color: ColorValue, ns: string, partName?: string): OoxmlElement {
    const writer: GradientWriter = new GradientWriter(ns, partName);
    return writer.element('solidFill', [], [writer.color(color, 'fill.color')]);
}
/** Validates and serializes one detached edit. @internal */
class GradientWriter {
    private readonly ns: string;
    private readonly dialect: GradientDialect;
    private readonly partName: string | undefined;
    /**
     * @param {string} ns - Owning DrawingML namespace.
     * @param {string | undefined} partName - Diagnostic part.
     */
    constructor(ns: string, partName: string | undefined) {
        this.ns = ns; this.partName = partName;
        if (ns !== 'http://schemas.openxmlformats.org/drawingml/2006/main' && ns !== 'http://purl.oclc.org/ooxml/drawingml/main') {
            this.fail('fill.namespace');
        }
        this.dialect = ns === 'http://purl.oclc.org/ooxml/drawingml/main' ? 'strict' : 'transitional';
    }
    /**
     * @param {GradientFillOptions} input - Complete replacement input.
     * @returns {OoxmlElement} Detached gradient.
     */
    gradient(input: GradientFillOptions): OoxmlElement {
        if (!input || typeof input !== 'object' || !Array.isArray(input.stops) || input.stops.length < 2) { this.fail('fill.stops'); }
        const stops: OoxmlElement[] = [];
        for (let index: number = 0; index < input.stops.length; index++) {
            const stop: GradientStopOptions = arrayAt(input.stops, index);
            const field: string = 'fill.stops[' + index + ']';
            if (!stop || typeof stop !== 'object') { this.fail(field); }
            const pos: string = this.percentage(stop.position, field + '.position', true);
            const color: OoxmlElement = this.color(stop.color, field + '.color', stop.transforms);
            stops.push(this.element('gs', [attribute('pos', pos)], [color]));
        }
        const children: OoxmlElement[] = [this.element('gsLst', [], stops)];
        if (input.shade !== undefined) {
            const shade: typeof input.shade = input.shade;
            if (!shade || typeof shade !== 'object') { this.fail('fill.shade'); }
            const attrs: OoxmlAttribute[] = [];
            if (shade.kind === 'linear') {
                if (shade.angle !== undefined) { attrs.push(attribute('ang', this.angle(shade.angle, 'fill.shade.angle'))); }
                if (shade.scaled !== undefined) { attrs.push(attribute('scaled', this.boolean(shade.scaled, 'fill.shade.scaled'))); }
                children.push(this.element('lin', attrs));
            } else if (shade.kind === 'path') {
                if (shade.path !== undefined) {
                    if (['circle', 'rect', 'shape'].indexOf(shade.path) < 0) { this.fail('fill.shade.path'); }
                    attrs.push(attribute('path', shade.path));
                }
                children.push(this.element('path', attrs, shade.fillToRect === undefined ? [] :
                    [this.rectangle('fillToRect', shade.fillToRect, 'fill.shade.fillToRect')]));
            } else { this.fail('fill.shade.kind'); }
        }
        if (input.tileRect !== undefined) { children.push(this.rectangle('tileRect', input.tileRect, 'fill.tileRect')); }
        const attrs: OoxmlAttribute[] = [];
        if (input.flip !== undefined) {
            if (['none', 'x', 'y', 'xy'].indexOf(input.flip) < 0) { this.fail('fill.flip'); }
            attrs.push(attribute('flip', input.flip));
        }
        if (input.rotateWithShape !== undefined) { attrs.push(attribute('rotWithShape', this.boolean(input.rotateWithShape, 'fill.rotateWithShape'))); }
        return this.element('gradFill', attrs, children);
    }
    /**
     * @param {ColorValue} color - Direct color choice.
     * @param {string} field - Diagnostic property.
     * @param {ReadonlyArray<GradientColorOperation>} operations - Ordered edits.
     * @returns {OoxmlElement} Detached color choice.
     */
    color(color: ColorValue, field: string, operations?: ReadonlyArray<GradientColorOperation>): OoxmlElement {
        if (!color || typeof color !== 'object') { this.fail(field); }
        const attrs: OoxmlAttribute[] = []; let name: string;
        switch (color.kind) {
        case 'srgb':
            if (!hex(color.val)) { this.fail(field + '.val'); }
            name = 'srgbClr'; attrs.push(attribute('val', color.val)); break;
        case 'scheme':
            if (SCHEME_COLOR_VALS.indexOf(color.val) < 0) { this.fail(field + '.val'); }
            name = 'schemeClr'; attrs.push(attribute('val', color.val)); break;
        case 'prst':
            if (typeof color.val !== 'string' || !Object.prototype.hasOwnProperty.call(GRADIENT_PRESET_COLORS, color.val)) { this.fail(field + '.val'); }
            name = 'prstClr'; attrs.push(attribute('val', color.val)); break;
        case 'sys':
            if (SYSTEM_COLORS.indexOf(color.val) < 0) { this.fail(field + '.val'); }
            name = 'sysClr'; attrs.push(attribute('val', color.val));
            if (color.lastClr !== undefined) {
                if (!hex(color.lastClr)) { this.fail(field + '.lastClr'); }
                attrs.push(attribute('lastClr', color.lastClr));
            }
            break;
        case 'scrgb':
            name = 'scrgbClr';
            attrs.push(attribute('r', this.channel(color.r, field + '.r')), attribute('g', this.channel(color.g, field + '.g')),
                       attribute('b', this.channel(color.b, field + '.b'))); break;
        case 'hsl': {
            name = 'hslClr';
            const hue: ReturnType<typeof parseGradientAngle> = typeof color.hue === 'string' ? parseGradientAngle(color.hue) : { kind: 'absent' };
            if (hue.kind !== 'value') { return this.fail(field + '.hue'); }
            attrs.push(attribute('hue', this.angle(hue.value, field + '.hue')), attribute('sat', this.channel(color.sat, field + '.sat')),
                       attribute('lum', this.channel(color.lum, field + '.lum'))); break;
        }
        default: return this.fail(field + '.kind');
        }
        if (operations !== undefined && !Array.isArray(operations)) { this.fail(field + '.transforms'); }
        const children: OoxmlElement[] = [];
        if (operations !== undefined) {
            for (let i: number = 0; i < operations.length; i++) {
                children.push(this.operation(arrayAt(operations, i), field + '.transforms[' + i + ']'));
            }
        }
        return this.element(name, attrs, children);
    }
    /**
     * @param {GradientColorOperation} operation - Color operation.
     * @param {string} field - Diagnostic property.
     * @returns {OoxmlElement} Detached operation.
     */
    private operation(operation: GradientColorOperation, field: string): OoxmlElement {
        if (!operation || typeof operation !== 'object' || typeof operation.kind !== 'string') { this.fail(field); }
        const kind: string = operation.kind; const value: number | undefined = operation.value;
        if (EMPTY_OPERATIONS.indexOf(kind) >= 0) {
            if (value !== undefined) { this.fail(field + '.value'); }
            return this.element(kind);
        }
        if (typeof value !== 'number' || !Number.isFinite(value)) { this.fail(field + '.value'); }
        let token: string;
        if (kind === 'hue') { token = this.angle(value, field + '.value'); }
        else if (kind === 'hueOff') {
            const units: number = Math.round(value * 60000);
            if (units < -2147483648 || units > 2147483647) { this.fail(field + '.value'); }
            token = String(units);
        } else {
            if (PERCENT_OPERATIONS.indexOf(kind) < 0) { this.fail(field + '.kind'); }
            if ((['tint', 'shade', 'alpha'].indexOf(kind) >= 0 && (value < 0 || value > 1)) ||
                (kind === 'alphaOff' && (value < -1 || value > 1)) ||
                (['alphaMod', 'hueMod'].indexOf(kind) >= 0 && value < 0)) { this.fail(field + '.value'); }
            token = this.percentage(value, field + '.value', ['tint', 'shade', 'alpha'].indexOf(kind) >= 0);
            if (kind === 'alphaOff' && this.dialect === 'strict') {
                token = (value < 0 ? '-' : '') + this.percentage(Math.abs(value), field + '.value', true);
            }
        }
        return this.element(kind, [attribute('val', token)]);
    }
    /**
     * @param {string} name - Rectangle local name.
     * @param {GradientRectangleOptions} rect - Sparse edges.
     * @param {string} field - Diagnostic property.
     * @returns {OoxmlElement} Detached rectangle.
     */
    private rectangle(name: string, rect: GradientRectangleOptions, field: string): OoxmlElement {
        if (!rect || typeof rect !== 'object' || Array.isArray(rect)) { this.fail(field); }
        const attrs: OoxmlAttribute[] = [];
        if (rect.left !== undefined) { attrs.push(attribute('l', this.percentage(rect.left, field + '.left', false))); }
        if (rect.top !== undefined) { attrs.push(attribute('t', this.percentage(rect.top, field + '.top', false))); }
        if (rect.right !== undefined) { attrs.push(attribute('r', this.percentage(rect.right, field + '.right', false))); }
        if (rect.bottom !== undefined) { attrs.push(attribute('b', this.percentage(rect.bottom, field + '.bottom', false))); }
        return this.element(name, attrs);
    }
    /**
     * @param {string} raw - Existing ColorValue channel lexical form.
     * @param {string} field - Diagnostic property.
     * @returns {string} Owning dialect token.
     */
    private channel(raw: string, field: string): string {
        const parsed: ReturnType<typeof parseGradientPercentage> = typeof raw === 'string' ?
            parseGradientPercentage(raw, 'transitional', 'rectangle') : { kind: 'absent' };
        if (parsed.kind !== 'value') { return this.fail(field); }
        return this.percentage(parsed.value, field, false);
    }
    /**
     * @param {number} value - Normalized ratio.
     * @param {string} field - Diagnostic property.
     * @param {boolean} stop - Whether bounded as a stop.
     * @returns {string} Serialized ratio.
     */
    private percentage(value: number, field: string, stop: boolean): string {
        if (typeof value !== 'number') { return this.fail(field); }
        try { return serializeGradientPercentage(value, this.dialect, stop ? 'stop' : 'rectangle'); }
        catch (error) { return this.fail(field); }
    }
    /**
     * @param {number} value - Clockwise degrees.
     * @param {string} field - Diagnostic property.
     * @returns {string} Serialized angle.
     */
    private angle(value: number, field: string): string {
        if (typeof value !== 'number') { return this.fail(field); }
        try { return serializeGradientAngle(value); } catch (error) { return this.fail(field); }
    }
    /**
     * @param {boolean} value - Explicit boolean.
     * @param {string} field - Diagnostic property.
     * @returns {string} Serialized boolean.
     */
    private boolean(value: boolean, field: string): string {
        try { return serializeGradientBoolean(value); } catch (error) { return this.fail(field); }
    }
    /**
     * @param {string} name - Exact DrawingML local name.
     * @param {ReadonlyArray<OoxmlAttribute>} attributes - Validated attributes.
     * @param {ReadonlyArray<OoxmlElement>} children - Detached children.
     * @returns {OoxmlElement} Detached element.
     */
    element(name: string, attributes: ReadonlyArray<OoxmlAttribute> = [], children: ReadonlyArray<OoxmlElement> = []): OoxmlElement {
        return { kind: 'element', namespaceUri: this.ns, localName: name, attributes, children, prefixHint: 'a' };
    }
    /**
     * @param {string} property - Invalid property path.
     * @returns {void} Does not return normally.
     * @throws Invalid property error, including part and property identity.
     */
    private fail(property: string): never { throw new GradientFillError(this.partName, property); }
}
/**
 * @param {string} name - Unqualified attribute name.
 * @param {string} value - Validated value.
 * @returns {OoxmlAttribute} Detached attribute.
 */
function attribute(name: string, value: string): OoxmlAttribute { return { namespaceUri: '', localName: name, value }; }
/**
 * @param {string} value - Hex color input.
 * @returns {boolean} Whether exactly six hex digits.
 */
function hex(value: string): boolean { return typeof value === 'string' && /^[0-9a-fA-F]{6}$/.test(value); }
