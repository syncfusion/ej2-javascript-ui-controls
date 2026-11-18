import { TextBoxLayout, TextLayoutLine, TextLayoutSegment } from './layout-paragraph';

/** Disposable character-level layout cache analogous to .NET TextInfo. @private */
export class TextInfo {
    /** Segment the cached character info belongs to. */
    public readonly textPartReference: TextLayoutSegment;
    /** Cached text of the segment. */
    public readonly text: string;
    /** Cached bounds in points. */
    public readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
    /** Cached position in points. */
    public readonly position: { readonly x: number; readonly y: number };
    /** UTF-16 length of the cached text. */
    public readonly length: number;
    /** Ascent above the baseline in points. */
    public readonly ascent: number;
    /** Inclusive UTF-16 start offset in the logical text. */
    public readonly startOffset: number;
    /** Exclusive UTF-16 end offset in the logical text. */
    public readonly endOffset: number;

    constructor(
        textPartReference: TextLayoutSegment,
        text: string,
        bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number },
        position: { readonly x: number; readonly y: number },
        length: number,
        ascent: number,
        startOffset: number,
        endOffset: number
    ) {
        this.textPartReference = textPartReference;
        this.text = text;
        this.bounds = bounds;
        this.position = position;
        this.length = length;
        this.ascent = ascent;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
    }

    /** @returns {TextInfo} A deep copy of this cache entry. */
    public clone(): TextInfo {
        return new TextInfo(this.textPartReference, this.text, { ...this.bounds }, { ...this.position },
                            this.length, this.ascent, this.startOffset, this.endOffset);
    }
}

/** Disposable line layout cache analogous to .NET LineInfo. @private */
export class LineInfo {
    /** Line height in points. */
    public readonly lineHeight: number;
    /** Maximum ascent across the line in points. */
    public readonly maximumAscent: number;
    /** Character-level entries of the line. */
    public readonly textInfos: ReadonlyArray<TextInfo>;
    /** Inclusive UTF-16 start offset of the line. */
    public readonly startOffset: number;
    /** Exclusive UTF-16 end offset of the line. */
    public readonly endOffset: number;
    /** Whether the line ends in a hard break. */
    public readonly hardBreakAfter: boolean;

    constructor(
        lineHeight: number,
        maximumAscent: number,
        textInfos: ReadonlyArray<TextInfo>,
        startOffset: number,
        endOffset: number,
        hardBreakAfter: boolean
    ) {
        this.lineHeight = lineHeight;
        this.maximumAscent = maximumAscent;
        this.textInfos = textInfos;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.hardBreakAfter = hardBreakAfter;
    }

    /** @returns {LineInfo} A deep copy of this cache entry. */
    public clone(): LineInfo {
        return new LineInfo(this.lineHeight, this.maximumAscent,
                            this.textInfos.map((value: TextInfo): TextInfo => value.clone()),
                            this.startOffset, this.endOffset, this.hardBreakAfter);
    }
}

/** Disposable paragraph layout cache analogous to .NET ParagraphInfo. @private */
export class ParagraphInfo {
    /** Index of the paragraph in the text body. */
    public readonly paragraphIndex: number;
    /** Line-level entries of the paragraph. */
    public readonly lineInfos: ReadonlyArray<LineInfo>;

    constructor(
        paragraphIndex: number,
        lineInfos: ReadonlyArray<LineInfo>
    ) {
        this.paragraphIndex = paragraphIndex;
        this.lineInfos = lineInfos;
    }

    /** @returns {ParagraphInfo} A deep copy of this cache entry. */
    public clone(): ParagraphInfo {
        return new ParagraphInfo(this.paragraphIndex,
                                 this.lineInfos.map((value: LineInfo): LineInfo => value.clone()));
    }
}

const layoutInfoCache: WeakMap<TextBoxLayout, ReadonlyArray<ParagraphInfo>> = new WeakMap();

/**
 * Stores a disposable cache without adding it to the public layout result.
 *
 * @param {TextBoxLayout} layout - Layout result the cache belongs to.
 * @param {ReadonlyArray<ParagraphInfo>} infos - Cache entries to store.
 * @returns {void} Nothing.
 * @private
 */
export function cacheLayoutInfo(layout: TextBoxLayout, infos: ReadonlyArray<ParagraphInfo>): void {
    layoutInfoCache.set(layout, infos);
}

/**
 * Internal test/viewer bridge for the disposable cache.
 *
 * @param {TextBoxLayout} layout - Layout result the cache belongs to.
 * @returns {ReadonlyArray<ParagraphInfo> | undefined} Stored entries, or undefined.
 * @private
 */
export function getLayoutInfo(layout: TextBoxLayout): ReadonlyArray<ParagraphInfo> | undefined {
    return layoutInfoCache.get(layout);
}

/**
 * Rebuilds the private cache deterministically from the existing layout result.
 *
 * @param {ReadonlyArray<TextLayoutLine>} lines - Laid-out lines of a text body.
 * @returns {ReadonlyArray<ParagraphInfo>} Rebuilt per-paragraph cache entries.
 * @private
 */
export function createParagraphInfos(lines: ReadonlyArray<TextLayoutLine>): ReadonlyArray<ParagraphInfo> {
    const paragraphIndexes: number[] = [];
    lines.forEach((line: TextLayoutLine): void => {
        if (paragraphIndexes.indexOf(line.paragraphIndex) < 0) {
            paragraphIndexes.push(line.paragraphIndex);
        }
    });
    return paragraphIndexes.map((paragraphIndex: number): ParagraphInfo => {
        const lineInfos: LineInfo[] = lines
            .filter((line: TextLayoutLine): boolean => line.paragraphIndex === paragraphIndex)
            .map((line: TextLayoutLine): LineInfo => {
                const infos: TextInfo[] = line.segments.map((segment: TextLayoutSegment): TextInfo => new TextInfo(
                    segment, segment.text,
                    { x: segment.leftPt, y: line.topPt + segment.topOffsetPt,
                        width: segment.widthPt, height: line.heightPt },
                    { x: segment.leftPt, y: line.baselinePt + segment.topOffsetPt },
                    segment.endOffset - segment.startOffset, line.baselinePt - line.topPt,
                    segment.startOffset, segment.endOffset));
                const maximumAscent: number = infos.reduce((value: number, info: TextInfo): number =>
                    Math.max(value, info.ascent), 0);
                return new LineInfo(line.heightPt, maximumAscent, infos, line.startOffset,
                                    line.endOffset, line.hardBreakAfter);
            });
        return new ParagraphInfo(paragraphIndex, lineInfos);
    });
}
