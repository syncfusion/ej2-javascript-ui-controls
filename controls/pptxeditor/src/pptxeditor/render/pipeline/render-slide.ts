import { PresentationFrameInfo, SlideFrameSnapshot } from '../../main-slide/slide-frame-model';
import { BackgroundPaint, renderBackground } from '../background/render-background';
import { resolveBackground } from '../background/resolve-background';
import { buildDisplayList, DisplayListEntry } from './build-display-list';
import { buildSlideViewport, SlideViewport } from '../slide-viewport';

/**
 * @internal
 */
export interface SlideRenderModel<T> {
    readonly viewport: SlideViewport;
    readonly hidden: boolean;
    readonly backgroundSource: 'slide' | 'layout' | 'master' | 'default';
    readonly background: BackgroundPaint;
    readonly displayList: ReadonlyArray<DisplayListEntry<T>>;
    readonly theme: PresentationFrameInfo['theme'];
    /** Every master shape, kept so placeholders can inherit geometry even when masters are not painted. */
    readonly masterShapes?: ReadonlyArray<T>;
    /** Every layout shape, kept so placeholders can inherit geometry even when layouts are not painted. */
    readonly layoutShapes?: ReadonlyArray<T>;
}

/**
 * ports `SlideToImageConverter.ConvertToImage` and `RendererBase.BaseDrawSlide`.
 * @param {PresentationFrameInfo} info - info
 * @param {SlideFrameSnapshot} slide - slide
 * @param {Object} items - items
 * @returns {SlideRenderModel} result
 * @internal
 */
export function renderSlide<T>(
    info: PresentationFrameInfo,
    slide: SlideFrameSnapshot,
    items: {
        readonly master: ReadonlyArray<T>;
        readonly layout: ReadonlyArray<T>;
        readonly slide: ReadonlyArray<T>;
    }
): SlideRenderModel<T> {
    const resolved: import('../../main-slide/slide-frame-model').SlideFrameBackgroundSnapshot = resolveBackground(slide.backgrounds);
    return {
        viewport: buildSlideViewport(info),
        hidden: slide.isHidden,
        backgroundSource: resolved.source,
        background: renderBackground(resolved, info.theme),
        displayList: buildDisplayList({
            showMasterShapes: slide.showMasterShapes,
            layoutShowMasterShapes: slide.layoutShowMasterShapes,
            ...items
        }),
        theme: info.theme,
        masterShapes: items.master,
        layoutShapes: items.layout
    };
}
