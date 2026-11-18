/**
 * {@link OfficeInk} → InkML element tree serializer ([MS-ODRAWXML] §2.1.4).
 *
 * Trace text is always {@link encodeTrace} from points — never stored XML text.
 * Brush property order matches `docs/specs/ink-shared-codec.md` / TASK-9003.
 */

import { Literal } from '../../core/literal-type';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/model';
import {
    InkBrush,
    InkChannel,
    InkContext,
    InkEffectType,
    InkTrace,
    InkTraceTreeNode,
    OfficeInk
} from './ink-model';
import { isOfficeInk } from './ink-model';
import { inkEffectColor } from './ink-effects';
import { formatUnitValue, pointsToUnit } from './ink-units';
import {
    attr,
    inkElement,
    inkmlNamespaceDecl,
    textNode,
    xmlIdAttr
} from './ink-xml';
import { encodeTrace } from './trace-codec';

const DEFAULT_CONTEXT_ID: Literal<'ctx0'> = 'ctx0';
const DEFAULT_CONTEXT_REF: Literal<'#ctx0'> = '#ctx0';
const DEFAULT_INK_SOURCE_ID: Literal<'inkSrc0'> = 'inkSrc0';
const CHANNEL_MIN: Literal<'-2.14748E9'> = '-2.14748E9';
const CHANNEL_MAX: Literal<'2.14748E9'> = '2.14748E9';
const CHANNEL_UNITS: Literal<'cm'> = 'cm';

/**
 * Serialize an {@link OfficeInk} DOM to an InkML `ink` root element.
 *
 * Source: [MS-ODRAWXML] §2.1.4; `docs/specs/ink-shared-codec.md` Serializer behavior.
 *
 * @param {OfficeInk} ink - The ink.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeInkXml(ink: OfficeInk): OpenXmlElement {
    if (!isOfficeInk(ink)) {
        throw new TypeError('serializeInkXml: expected OfficeInk from parseInkXml/createInk');
    }

    const children: OpenXmlChild[] = [];
    const definitionsChildren: OpenXmlChild[] = [];

    const needsContext: boolean = ink.traces.some(
        (t: InkTrace) => t.contextRef === DEFAULT_CONTEXT_REF || t.contextRef === '' || t.contextRef === `#${DEFAULT_CONTEXT_ID}`
    ) || ink.traces.length > 0;

    const contexts: ReadonlyArray<InkContext> = (ink.contexts != null ? ink.contexts : []);

    // Emit each known context; ensure default #ctx0 when referenced/needed
    let hasDefaultContext: boolean = false;
    for (const ctx of contexts) {
        definitionsChildren.push(serializeContext(ctx));
        const bare: string = stripHash(ctx.id);
        if (bare === DEFAULT_CONTEXT_ID) {
            hasDefaultContext = true;
        }
    }
    if (needsContext && !hasDefaultContext) {
        definitionsChildren.push(serializeContext(defaultContext()));
    }

    // Brushes sorted by id (string key order)
    const sortedBrushes: InkBrush[] = [...ink.brushes].sort((a: InkBrush, b: InkBrush) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    for (const brush of sortedBrushes) {
        definitionsChildren.push(serializeBrush(brush));
    }

    if (definitionsChildren.length > 0) {
        children.push(inkElement('definitions', [], definitionsChildren));
    }

    // Traces / groups
    if (ink.traceTree !== undefined && ink.traceTree.length > 0) {
        for (const node of ink.traceTree) {
            children.push(...serializeTreeNode(node, ink.traces));
        }
    } else {
        for (const trace of ink.traces) {
            children.push(serializeTrace(trace));
        }
    }

    return inkElement('ink', [], children, [inkmlNamespaceDecl()]);
}

/**
 * The default context.
 *
 * @returns {InkContext} The result.
 */
function defaultContext(): InkContext {
    return {
        id: DEFAULT_CONTEXT_REF,
        inkSourceId: DEFAULT_INK_SOURCE_ID,
        channels: [
            {
                name: 'X',
                type: 'integer',
                min: CHANNEL_MIN,
                max: CHANNEL_MAX,
                units: CHANNEL_UNITS
            },
            {
                name: 'Y',
                type: 'integer',
                min: CHANNEL_MIN,
                max: CHANNEL_MAX,
                units: CHANNEL_UNITS
            }
        ]
    };
}

/**
 * The serialize context.
 *
 * @param {InkContext} ctx - The ctx.
 * @returns {OpenXmlElement} The result.
 */
function serializeContext(ctx: InkContext): OpenXmlElement {
    const idBare: string = stripHash(ctx.id);
    const inkSourceId: string = stripHash((ctx.inkSourceId != null ? ctx.inkSourceId : DEFAULT_INK_SOURCE_ID));
    const channels: ReadonlyArray<InkChannel> =
    ctx.channels.length > 0
        ? ctx.channels
        : defaultContext().channels;

    const channelEls: OpenXmlElement[] = channels.map((ch: InkChannel) => serializeChannel(ch));
    const traceFormat: OpenXmlElement = inkElement('traceFormat', [], channelEls);
    const inkSource: OpenXmlElement = inkElement('inkSource', [xmlIdAttr(inkSourceId)], [traceFormat]);
    return inkElement('context', [xmlIdAttr(idBare)], [inkSource]);
}

/**
 * The serialize channel.
 *
 * @param {InkChannel} ch - The ch.
 * @returns {OpenXmlElement} The result.
 */
function serializeChannel(ch: InkChannel): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [attr('name', ch.name)];
    if (ch.type !== undefined) {
        attrs.push(attr('type', ch.type));
    }
    if (ch.min !== undefined) {
        attrs.push(attr('min', ch.min));
    }
    if (ch.max !== undefined) {
        attrs.push(attr('max', ch.max));
    }
    if (ch.units !== undefined) {
        attrs.push(attr('units', ch.units));
    }
    return inkElement('channel', attrs, []);
}

/**
 * The serialize brush.
 *
 * @param {InkBrush} brush - The brush.
 * @returns {OpenXmlElement} The result.
 */
function serializeBrush(brush: InkBrush): OpenXmlElement {
    const idBare: string = stripHash(brush.id);
    const props: OpenXmlChild[] = [];
    const units: string = brush.units.length > 0 ? brush.units : 'cm';

    // Size is stored in points after parse; authoring may use pt units with pt values.
    // ConvertPointsToUnit always treats size as points → target units.
    const widthOut: number = pointsToUnit(brush.size.width, units);
    const heightOut: number = pointsToUnit(brush.size.height, units);

    props.push(
        brushProperty('width', formatUnitValue(widthOut), units),
        brushProperty('height', formatUnitValue(heightOut), units)
    );

    const color: string = resolveBrushColor(brush);
    props.push(brushProperty('color', color.startsWith('#') ? color : `#${color}`));

    // Effect-specific series (TASK-9003 / shared-codec)
    // Always emit ignorePressure. Non-none effects emit inkEffects so parse→serialize→parse
    // preserves the effect token (including pencil, which has no color override).
    const effect: InkEffectType = brush.inkEffect;
    props.push(brushProperty('ignorePressure', brush.ignorePressure ? '1' : '0'));

    if (effect !== 'pencil' && brush.rasterOp !== undefined && brush.rasterOp.length > 0) {
        props.push(brushProperty('tip', (brush.tip != null ? brush.tip : 'ellipse')));
        props.push(brushProperty('rasterOp', brush.rasterOp));
    }

    if (effect !== 'none') {
        props.push(brushProperty('inkEffects', effectToken(effect)));
        if (effect !== 'pencil') {
            props.push(brushProperty('anchorX', (brush.anchorX != null ? brush.anchorX : '0')));
            props.push(brushProperty('anchorY', (brush.anchorY != null ? brush.anchorY : '0')));
            props.push(brushProperty('scaleFactor', (brush.scaleFactor != null ? brush.scaleFactor : '0.5')));
        }
    }

    return inkElement('brush', [xmlIdAttr(idBare)], props);
}

/**
 * The brush property.
 *
 * @param {string} name - The name.
 * @param {string} value - The value.
 * @param {string | undefined} units - The units.
 * @returns {OpenXmlElement} The result.
 */
function brushProperty(name: string, value: string, units?: string): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [attr('name', name), attr('value', value)];
    if (units !== undefined) {
        attrs.push(attr('units', units));
    }
    return inkElement('brushProperty', attrs, []);
}

/**
 * The resolve brush color.
 *
 * @param {InkBrush} brush - The brush.
 * @returns {string} The result.
 */
function resolveBrushColor(brush: InkBrush): string {
    const effectHex: string = inkEffectColor(brush.inkEffect);
    if (effectHex !== undefined) {
        return effectHex.toUpperCase();
    }
    return brush.color.toUpperCase();
}

/**
 * The effect token.
 *
 * @param {InkEffectType} effect - The effect.
 * @returns {string} The result.
 */
function effectToken(effect: InkEffectType): string {
    // Prefer camelCase for roseGold (spec token); others lowercase
    if (effect === 'roseGold') {
        return 'roseGold';
    }
    return effect;
}

/**
 * The serialize tree node.
 *
 * @param {InkTraceTreeNode} node - The node.
 * @param {ReadonlyArray<InkTrace>} traces - The traces.
 * @returns {OpenXmlElement[]} The result.
 */
function serializeTreeNode(
    node: InkTraceTreeNode,
    traces: ReadonlyArray<InkTrace>
): OpenXmlElement[] {
    if (node.kind === 'trace') {
        const t: InkTrace = traces[node.traceIndex];
        if (t === undefined) {
            return [];
        }
        return [serializeTrace(t)];
    }
    const kids: OpenXmlChild[] = [];
    for (const child of node.children) {
        kids.push(...serializeTreeNode(child, traces));
    }
    return [inkElement('traceGroup', [], kids)];
}

/**
 * The serialize trace.
 *
 * @param {InkTrace} trace - The trace.
 * @returns {OpenXmlElement} The result.
 */
function serializeTrace(trace: InkTrace): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [];
    const contextRef: string =
    trace.contextRef.length > 0 ? ensureHash(trace.contextRef) : DEFAULT_CONTEXT_REF;
    attrs.push(attr('contextRef', contextRef));
    if (trace.brushRef.length > 0) {
        attrs.push(attr('brushRef', ensureHash(trace.brushRef)));
    }
    if (trace.timeOffset !== undefined) {
        attrs.push(attr('timeOffset', trace.timeOffset));
    }
    const text: string = encodeTrace(trace.points);
    const children: OpenXmlChild[] = text.length > 0 ? [textNode(text)] : [];
    return inkElement('trace', attrs, children);
}

/**
 * The strip hash.
 *
 * @param {string} id - The id.
 * @returns {string} The result.
 */
function stripHash(id: string): string {
    return id.startsWith('#') ? id.slice(1) : id;
}

/**
 * The ensure hash.
 *
 * @param {string} id - The id.
 * @returns {string} The result.
 */
function ensureHash(id: string): string {
    return id.startsWith('#') ? id : `#${id}`;
}
