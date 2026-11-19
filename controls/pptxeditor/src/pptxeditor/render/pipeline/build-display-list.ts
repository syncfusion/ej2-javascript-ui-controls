/**
 * @internal
 */
export type DisplayListSource = 'master' | 'layout' | 'slide';

/**
 * @internal
 */
export interface DisplayListInput<T> {
    readonly showMasterShapes: boolean;
    readonly layoutShowMasterShapes: boolean;
    readonly master: ReadonlyArray<T>;
    readonly layout: ReadonlyArray<T>;
    readonly slide: ReadonlyArray<T>;
}

/**
 * @internal
 */
export interface DisplayListEntry<T> {
    readonly source: DisplayListSource;
    readonly item: T;
}

/**
 * ports `RendererBase.BaseDrawSlide`.
 * @param {DisplayListInput} input - input
 * @returns {Array.<DisplayListEntry>} result
 * @internal
 */
export function buildDisplayList<T>(input: DisplayListInput<T>): ReadonlyArray<DisplayListEntry<T>> {
    const result: DisplayListEntry<T>[] = [];
    if (input.showMasterShapes) {
        if (input.layoutShowMasterShapes) {
            append(result, 'master', input.master);
        }
        append(result, 'layout', input.layout);
    }
    append(result, 'slide', input.slide);
    return result;
}

function append<T>(target: DisplayListEntry<T>[], source: DisplayListSource, items: ReadonlyArray<T>): void {
    for (const item of items) {
        target.push({ source, item });
    }
}
