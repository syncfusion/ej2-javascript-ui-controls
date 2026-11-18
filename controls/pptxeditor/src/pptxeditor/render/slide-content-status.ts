import { SlideShapeLevels, SlideShapeSnapshot } from './shape-render-model';

/** Slide-content families displayed by the local fidelity demo.  @internal */
/**
 * @internal
 */
export type SlideContentType =
  | 'shape' | 'textBox' | 'connector' | 'group' | 'picture'
  | 'table' | 'chart' | 'smartArt' | 'ole' | 'media';

/** Current Stage 1 implementation state for one slide-content family.  @internal */
/**
 * @internal
 */
export interface SlideContentStatus {
    readonly type: SlideContentType;
    readonly label: string;
    readonly status: 'rendered' | 'partial' | 'not ported';
    readonly milestone?: string;
}

/** One registry entry augmented with the count found on the open slide.  @internal */
/**
 * @internal
 */
export interface SlideContentSummary extends SlideContentStatus {
    readonly count: number;
}

const SLIDE_CONTENT_STATUS: SlideContentStatus[] = [
    { type: 'shape', label: 'shape', status: 'rendered' },
    { type: 'textBox', label: 'text box', status: 'partial', milestone: 'S3c/S3d' },
    { type: 'connector', label: 'connector', status: 'rendered' },
    { type: 'group', label: 'group', status: 'rendered' },
    { type: 'picture', label: 'picture', status: 'partial', milestone: 'S4 fallbacks' },
    { type: 'table', label: 'table', status: 'partial', milestone: 'S5 table styles' },
    { type: 'chart', label: 'chart', status: 'partial', milestone: 'S6 fallback' },
    { type: 'smartArt', label: 'SmartArt', status: 'partial', milestone: 'S6 fallback' },
    { type: 'ole', label: 'OLE', status: 'partial', milestone: 'S6 fallback' },
    { type: 'media', label: 'media', status: 'partial', milestone: 'S6 fallback' }
];

/**
 * Single source of truth for the demo coverage strip.
 *
 * @remarks Each rendering slice updates its owned rows when it lands. This is
 * slide-content status only; it makes no claim about editor UI-shell parity.
 * @internal
 */
export const SLIDE_CONTENT_STATUS_REGISTRY: ReadonlyArray<SlideContentStatus> = Object.freeze(SLIDE_CONTENT_STATUS);

/**
 * Builds complete status rows for direct elements on the open slide.
 * @param {SlideShapeLevels} levels - levels
 * @returns {Array.<SlideContentSummary>} result
 * @internal
 */
export function summarizeSlideContent(levels: SlideShapeLevels): ReadonlyArray<SlideContentSummary> {
    const counts: Record<SlideContentType, number> = {
        shape: 0, textBox: 0, connector: 0, group: 0, picture: 0,
        table: 0, chart: 0, smartArt: 0, ole: 0, media: 0
    };
    levels.slide.forEach((shape: SlideShapeSnapshot): void => {
        counts[classifyShape(shape)] += 1;
    });
    return SLIDE_CONTENT_STATUS_REGISTRY.map((entry: SlideContentStatus): SlideContentSummary => ({
        ...entry,
        count: counts[entry.type]
    }));
}

function classifyShape(shape: SlideShapeSnapshot): SlideContentType {
    if (shape.elementKind === 'cxnSp') {
        return 'connector';
    }
    if (shape.elementKind === 'grpSp') {
        return 'group';
    }
    if (shape.elementKind === 'pic' || shape.contentKind === 'picture') {
        return 'picture';
    }
    if (shape.contentKind === 'table') {
        return 'table';
    }
    if (shape.contentKind === 'chart') {
        return 'chart';
    }
    if (shape.contentKind === 'diagram') {
        return 'smartArt';
    }
    if (shape.contentKind === 'ole') {
        return 'ole';
    }
    if (shape.contentKind === 'media' || shape.elementKind === 'contentPart') {
        return 'media';
    }
    if (shape.elementKind === 'sp' && shape.hasTextBody) {
        return 'textBox';
    }
    return 'shape';
}
