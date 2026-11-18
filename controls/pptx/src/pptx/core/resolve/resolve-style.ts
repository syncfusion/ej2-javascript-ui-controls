/**
 * Pure inheritance resolve for text styles and shape transforms.
 *
 * @remarks
 * Chain (text): shape → layout placeholder → master placeholder → master
 * `txStyles` → presentation `defaultTextStyle` → theme (via scheme colour map).
 * Geometry: shape `xfrm` → layout ph `xfrm` → master ph `xfrm`.
 *
 * **Non-mutating.** Never writes {@link ResolvedColor} or geometry back into the DOM.
 *
 * Citations: `docs/specs/010-inheritance-resolve.md`; Transitional `pml.xsd`
 * `CT_SlideMasterTextStyles`; `dml-main.xsd` text list / character properties.
 */
import { findTxBody } from '../text/text-body';
import { PML_NS } from '../presentation/constants';
import { Shape } from '../shapes/shape';
import { EffectiveColorContext } from '../theme/resolve-color';
import { resolveColor } from '../theme/resolve-color';
import { ResolvedColor } from '../theme/resolved-color';
import { OoxmlElement } from '../xml/index';
import { arrayAt } from '../util/es5-compat';
import { hundredthsToPoints, listParagraphs, readListStyleLevelProps, readParagraphDefRPr, readParagraphLevel,
    readRunPathProps, DirectCharProps } from './read-text-props';
import { isTransformDefined, readShapeXfrm, DirectTransform } from './read-xfrm';
import { selectTxStylesBucket, txStylesBucketForPlaceholderType, TxStylesBucket } from './tx-styles';
import { ResolvedTextStyle, ResolvedTransform, StyleInheritanceSource } from './types';
/**
 * Inputs required to resolve styles for one slide shape.
 *
 * @remarks
 * Built by {@link Slide} from load-time placeholder indexes, master `txStyles`,
 * presentation `defaultTextStyle`, and the document colour context.
 *
 * @internal
 */
export interface ResolveContext {
    readonly layoutShape: Shape | undefined;
    readonly masterShape: Shape | undefined;
    /** Master `p:txStyles` element when present. */
    readonly masterTxStyles: OoxmlElement | undefined;
    /** Presentation `p:defaultTextStyle` when present. */
    readonly defaultTextStyle: OoxmlElement | undefined;
    /** Effective colour map + theme scheme for schemeClr views. */
    readonly colorContext: EffectiveColorContext | undefined;
    /** Placeholder type for txStyles bucket; undefined when shape is not a ph. */
    readonly placeholderType: string | undefined;
}
/**
 * Resolves text style for one paragraph (paragraph `defRPr` path + list styles).
 *
 * @remarks Pure read. Does not mutate `a:pPr` / list styles / theme. First-defined-wins per atomic property along the inheritance chain.
 * @param {Shape} shape - Slide shape owning the text body.
 * @param {number} paragraphIndex - 0-based `a:p` index.
 * @param {ResolveContext} context - Inheritance chain context for this slide/shape.
 * @returns {ResolvedTextStyle} View DTO; empty properties when nothing was found on the chain.
 */
export function resolveParagraphStyle(shape: Shape, paragraphIndex: number, context: ResolveContext): ResolvedTextStyle {
    const level: number = paragraphLevelOnShape(shape, paragraphIndex);
    return resolveCharPropsAlongChain(shape, context, level, (s: Shape) => paragraphPropsOnShape(s, paragraphIndex));
}
/**
 * Resolves text style for one regular run (run `rPr`, then paragraph `defRPr`, then chain).
 *
 * @remarks Pure read. Never materializes RGB over authored `a:schemeClr` in the package. First-defined-wins per atomic property along the
 * inheritance chain.
 * @param {Shape} shape - Slide shape owning the text body.
 * @param {number} paragraphIndex - 0-based `a:p` index.
 * @param {number} runIndex - 0-based `a:r` index within the paragraph.
 * @param {ResolveContext} context - Inheritance chain context for this slide/shape.
 * @returns {ResolvedTextStyle} View DTO; scheme references on the run count as **direct** specification.
 */
export function resolveRunStyle(shape: Shape, paragraphIndex: number, runIndex: number, context: ResolveContext): ResolvedTextStyle {
    const level: number = paragraphLevelOnShape(shape, paragraphIndex);
    return resolveCharPropsAlongChain(shape, context, level, (s: Shape) => runPropsOnShape(s, paragraphIndex, runIndex));
}
/**
 * Resolves shape transform (`a:xfrm`) with placeholder geometry inheritance.
 *
 * @remarks Non-placeholder shapes only see direct `xfrm`. Missing slide `xfrm` on a matched placeholder may inherit layout then master
 * coordinates (EMUs). View-only — never written back as direct geometry automatically.
 * @param {Shape} shape - Slide shape.
 * @param {ResolveContext} context - Must carry layout/master placeholder shapes when matched.
 * @returns {ResolvedTransform | undefined} View DTO, or `undefined` when no xfrm exists on the chain.
 */
export function resolveTransform(shape: Shape, context: ResolveContext): ResolvedTransform | undefined {
    const direct: DirectTransform = readShapeXfrm(shape.getElement());
    if (isTransformDefined(direct)) {
        return toResolvedTransform(direct, 'direct');
    }
    if (context.layoutShape !== undefined) {
        const layout: DirectTransform = readShapeXfrm(context.layoutShape.getElement());
        if (isTransformDefined(layout)) {
            return toResolvedTransform(layout, 'layout');
        }
    }
    if (context.masterShape !== undefined) {
        const master: DirectTransform = readShapeXfrm(context.masterShape.getElement());
        if (isTransformDefined(master)) {
            return toResolvedTransform(master, 'master');
        }
    }
    return undefined;
}
/**
 * Shared chain walk used by paragraph/run resolve (includes direct shape).
 *
 * @internal
 * @param {Shape} slideShape - The slideShape value.
 * @param {ResolveContext} context - The context value.
 * @param {number} level - The level value.
 * @param {*} readOnShape - The readOnShape value.
 * @returns {ResolvedTextStyle} The result.
 */
function resolveCharPropsAlongChain(slideShape: Shape, context: ResolveContext, level: number,
                                    readOnShape: (shape: Shape) => DirectCharProps | undefined): ResolvedTextStyle {
    let fontSizePt: number | undefined;
    let fontSizeSource: StyleInheritanceSource | undefined;
    let color: ResolvedColor | undefined;
    let colorSource: StyleInheritanceSource | undefined;
    const take: (props: DirectCharProps | undefined, source: StyleInheritanceSource) => void = (props: DirectCharProps | undefined,
                                                                                                source: StyleInheritanceSource): void => {
        if (props === undefined) {
            return;
        }
        if (fontSizePt === undefined && props.fontSizeHundredths !== undefined) {
            fontSizePt = hundredthsToPoints(props.fontSizeHundredths);
            fontSizeSource = source;
        }
        if (color === undefined && props.color !== undefined) {
            color = resolveColor(props.color, context.colorContext);
            colorSource = source;
        }
    };
    take(readOnShape(slideShape), 'direct');
    if (context.layoutShape !== undefined) {
        take(readOnShape(context.layoutShape), 'layout');
    }
    if (context.masterShape !== undefined) {
        take(readOnShape(context.masterShape), 'master');
    }
    if ((fontSizePt === undefined || color === undefined) &&
        context.masterTxStyles !== undefined &&
        context.placeholderType !== undefined) {
        const bucket: TxStylesBucket = txStylesBucketForPlaceholderType(context.placeholderType);
        const styleEl: OoxmlElement = selectTxStylesBucket(context.masterTxStyles, bucket);
        if (styleEl !== undefined) {
            take(readListStyleLevelProps(styleEl, level), 'txStyles');
        }
    }
    if ((fontSizePt === undefined || color === undefined) && context.defaultTextStyle !== undefined) {
        take(readListStyleLevelProps(context.defaultTextStyle, level), 'defaultTextStyle');
    }
    return finalizeStyle(fontSizePt, fontSizeSource, color, colorSource);
}
/**
 * @param {*} t - The t value.
 * @param {number} [t.x] - Offset x EMUs.
 * @param {number} [t.y] - Offset y EMUs.
 * @param {number} [t.cx] - Extent width EMUs.
 * @param {number} [t.cy] - Extent height EMUs.
 * @param {*} source - The source value.
 * @returns {ResolvedTransform} The result.
 */
function toResolvedTransform(t: {
    readonly x?: number;
    readonly y?: number;
    readonly cx?: number;
    readonly cy?: number;
}, source: 'direct' | 'layout' | 'master'): ResolvedTransform {
    return {
        ...(t.x !== undefined ? { x: t.x } : {}),
        ...(t.y !== undefined ? { y: t.y } : {}),
        ...(t.cx !== undefined ? { width: t.cx } : {}),
        ...(t.cy !== undefined ? { height: t.cy } : {}),
        source
    };
}
/**
 *
 * @param {number | undefined} fontSizePt - The fontSizePt value.
 * @param {StyleInheritanceSource | undefined} fontSizeSource - The fontSizeSource value.
 * @param {ResolvedColor | undefined} color - The color value.
 * @param {StyleInheritanceSource | undefined} colorSource - The colorSource value.
 * @returns {ResolvedTextStyle} The result.
 */
function finalizeStyle(fontSizePt: number | undefined, fontSizeSource: StyleInheritanceSource | undefined, color: ResolvedColor | undefined,
                       colorSource: StyleInheritanceSource | undefined): ResolvedTextStyle {
    const preferred: StyleInheritanceSource = colorSource != null ? colorSource : fontSizeSource;
    const source: StyleInheritanceSource = preferred != null ? preferred : 'direct';
    return {
        ...(fontSizePt !== undefined ? { fontSizePt } : {}),
        ...(fontSizeSource !== undefined ? { fontSizeSource } : {}),
        ...(color !== undefined ? { color } : {}),
        ...(colorSource !== undefined ? { colorSource } : {}),
        source
    };
}
/**
 *
 * @param {Shape} shape - The shape value.
 * @param {number} paragraphIndex - The paragraphIndex value.
 * @returns {number} The result.
 */
function paragraphLevelOnShape(shape: Shape, paragraphIndex: number): number {
    const txBody: OoxmlElement = findTxBody(shape.getElement(), PML_NS);
    if (txBody === undefined) {
        return 0;
    }
    const paragraphs: Array<OoxmlElement> = listParagraphs(txBody);
    const p: OoxmlElement = arrayAt(paragraphs, paragraphIndex);
    if (p === undefined) {
        return 0;
    }
    return readParagraphLevel(p);
}
/**
 *
 * @param {Shape} shape - The shape value.
 * @param {number} paragraphIndex - The paragraphIndex value.
 * @returns {DirectCharProps | undefined} The result.
 */
function paragraphPropsOnShape(shape: Shape, paragraphIndex: number): DirectCharProps | undefined {
    const txBody: OoxmlElement = findTxBody(shape.getElement(), PML_NS);
    if (txBody === undefined) {
        return undefined;
    }
    const paragraphs: Array<OoxmlElement> = listParagraphs(txBody);
    const p: OoxmlElement = arrayAt(paragraphs, paragraphIndex);
    if (p === undefined) {
        return undefined;
    }
    return readParagraphDefRPr(p);
}
/**
 *
 * @param {Shape} shape - The shape value.
 * @param {number} paragraphIndex - The paragraphIndex value.
 * @param {number} runIndex - The runIndex value.
 * @returns {DirectCharProps | undefined} The result.
 */
function runPropsOnShape(shape: Shape, paragraphIndex: number, runIndex: number): DirectCharProps | undefined {
    const txBody: OoxmlElement = findTxBody(shape.getElement(), PML_NS);
    if (txBody === undefined) {
        return undefined;
    }
    const paragraphs: Array<OoxmlElement> = listParagraphs(txBody);
    const p: OoxmlElement = arrayAt(paragraphs, paragraphIndex);
    if (p === undefined) {
        return undefined;
    }
    return readRunPathProps(p, runIndex);
}
