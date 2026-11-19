import { PresentationFrameInfo } from '../main-slide/slide-frame-model';
import { pointToPixel } from './units';

/**
 * @internal
 */
export interface SlideViewport {
    readonly widthPt: number;
    readonly heightPt: number;
    readonly widthPx: number;
    readonly heightPx: number;
    readonly sizeType?: string;
}

/**
 * ports `SlideToImageConverter.CreateImage`.
 * @param {PresentationFrameInfo} info - info
 * @returns {SlideViewport} result
 * @internal
 */
export function buildSlideViewport(info: PresentationFrameInfo): SlideViewport {
    return {
        widthPt: info.slideWidthPt,
        heightPt: info.slideHeightPt,
        widthPx: pointToPixel(info.slideWidthPt),
        heightPx: pointToPixel(info.slideHeightPt),
        ...(info.slideSizeType ? { sizeType: info.slideSizeType } : {})
    };
}
