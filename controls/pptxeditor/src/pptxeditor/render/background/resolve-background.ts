import {
    SlideFrameBackgroundLevels,
    SlideFrameBackgroundSnapshot,
    SlideFrameDirectBackgroundSnapshot
} from '../../main-slide/slide-frame-model';

const WHITE_BACKGROUND: SlideFrameBackgroundSnapshot = {
    source: 'default',
    background: {
        kind: 'fill',
        shadeToTitle: false,
        fill: { kind: 'solid', color: { kind: 'srgb', val: 'FFFFFF' }, colorTransforms: [] }
    }
};

/**
 * ports `SlideToImageConverter.CreateImage` and `DrawMasterBackground`.
 * @param {SlideFrameBackgroundLevels} levels - levels
 * @returns {SlideFrameBackgroundSnapshot} result
 * @internal
 */
export function resolveBackground(levels: SlideFrameBackgroundLevels): SlideFrameBackgroundSnapshot {
    const selected: {
        readonly source: SlideFrameBackgroundSnapshot['source'];
        readonly value: SlideFrameDirectBackgroundSnapshot;
    }[] = [
        { source: 'slide', value: levels.slide },
        { source: 'layout', value: levels.layout },
        { source: 'master', value: levels.master }
    ];
    for (const candidate of selected) {
        if (candidate.value.kind !== 'missing') {
            return { source: candidate.source, background: candidate.value };
        }
    }
    return WHITE_BACKGROUND;
}
