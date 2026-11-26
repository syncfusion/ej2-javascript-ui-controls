/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, EventHandler, extend } from '@syncfusion/ej2-base';
import { ZoomLevel, ZoomAnchorSnapshot, ZoomAnchorSource, ActionEventArgs, IRenderer } from '../base/interface';
import { Schedule } from '../base/schedule';
import { TdData, ViewsData } from '../base/interface';
import { TimelineView, ZoomChangeType, View } from '../base/type';
import { TimeScaleModel } from '../models/models';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

/**
 * Represents the pinch state for two-finger zoom gestures.
 */
interface PinchState {
    pointers: Record<number, { clientX: number; clientY: number }>;
    referenceDistance: number | null;
    lastDirection: 1 | -1 | null;
    pinchStarted: boolean;
}

/**
 * Decoded semantic anchor returned by `scrollLeftToDate`.
 *
 * @typedef {{ centerDate: Date; centerHour: string | null }} ZoomAnchorDecode
 */

/**
 * Represents the TimelineZoom action module that handles all zoom-related functionality
 * for the Schedule component, including Ctrl+Wheel zoom and pinch zoom.
 */
export class TimelineZoom {
    private parent: Schedule;

    /**
     * Threshold (in pixels) for pinch gesture distance change to trigger zoom.
     * Prevents accidental zoom from minor touch movements.
     *
     * @private
     */
    public pinchDistanceThreshold: number = 30;

    /**
     * Pinch state tracking for multi-touch zoom gestures.
     *
     * @private
     */
    public pinchState: PinchState = {
        pointers: {},
        referenceDistance: null,
        lastDirection: null,
        pinchStarted: false
    };

    /**
     * Horizontal pixel offset (relative to content-wrap's left edge) captured
     * from a Ctrl+Wheel zoom event. Used by `applyZoomPreset` as the anchor point.
     *
     * @private
     */
    public cursorOffsetX: number | null = null;

    /**
     * Horizontal pixel offset (relative to content-wrap's left edge) of the
     * pinch midpoint, captured during a two-finger zoom. Used by `applyZoomPreset`
     * to anchor the upcoming transition.
     *
     * @private
     */
    public pinchAnchorOffsetX: number | null = null;

    /**
     * Constructor to initialize the TimelineZoom module.
     *
     * @param {Schedule} parent The parent Schedule instance.
     * @private
     */
    constructor(parent: Schedule) {
        this.parent = parent;
    }

    /**
     * Initializes the zoom module by setting up event handlers.
     * Called during Schedule onLoad.
     *
     * @returns {void}
     *
     * @private
     */
    public initialize(): void {
        this.setupZoomEventHandlers();
    }

    /**
     * Sets up wheel and pointer event handlers for zoom functionality.
     *
     * @returns {void}
     */
    private setupZoomEventHandlers(): void {
        if (!isNullOrUndefined(this.parent.zoomLevels) && this.parent.zoomLevels.length > 0) {
            this.updateZoomTouchAction(true);
            EventHandler.add(this.parent.element, 'wheel', this.onWheelZoom, this);
            EventHandler.add(this.parent.element, 'pointerdown', this.onPinchPointerDown, this);
            EventHandler.add(this.parent.element, 'pointermove', this.onPinchPointerMove, this);
            EventHandler.add(this.parent.element, 'pointerup', this.onPinchPointerUp, this);
            EventHandler.add(this.parent.element, 'pointercancel', this.onPinchPointerUp, this);
        }
    }

    /**
     * Detaches zoom event handlers.
     * Called during Schedule destroy.
     *
     * @returns {void}
     *
     * @private
     */
    public destroy(): void {
        EventHandler.remove(this.parent.element, 'wheel', this.onWheelZoom);
        EventHandler.remove(this.parent.element, 'pointerdown', this.onPinchPointerDown);
        EventHandler.remove(this.parent.element, 'pointermove', this.onPinchPointerMove);
        EventHandler.remove(this.parent.element, 'pointerup', this.onPinchPointerUp);
        EventHandler.remove(this.parent.element, 'pointercancel', this.onPinchPointerUp);
        this.updateZoomTouchAction(false);
        this.resetPinchState();
    }

    /**
     * Validates the `zoomLevels` preset array and returns the accepted entries.
     *
     * @returns {ZoomLevel[]} The list of valid presets.
     * @private
     */
    public validateZoomLevels(): ZoomLevel[] {
        const valid: ZoomLevel[] = [];
        if (!this.parent.zoomLevels || this.parent.zoomLevels.length === 0) {
            return valid;
        }
        const seenKeys: Set<string> = new Set<string>();
        let index: number = 0;
        for (const preset of this.parent.zoomLevels) {
            if (!preset || typeof preset.key !== 'string' || preset.key.length === 0) {
                console.warn('[WARNING] :: Zoom preset at index ' + index +
                    ' is missing a string `key` and was skipped.');
                index++;
                continue;
            }
            if (seenKeys.has(preset.key)) {
                console.warn('[WARNING] :: Duplicate zoom preset key "' + preset.key +
                    '" — first preset with this key wins, later entries are unreachable.');
                index++;
                continue;
            }
            const option: TimelineView = preset.option as TimelineView;
            if (option !== 'TimelineDay' && option !== 'TimelineWeek' &&
                option !== 'TimelineWorkWeek' && option !== 'TimelineMonth' &&
                option !== 'TimelineYear') {
                console.warn('[WARNING] :: Zoom preset "' + preset.key +
                    '" has an unsupported `option` "' + option +
                    '" — only TimelineDay, TimelineWeek, TimelineWorkWeek, ' +
                    'TimelineMonth, and TimelineYear are accepted as Zoom options. Preset skipped.');
                index++;
                continue;
            }
            if (option === 'TimelineYear' && preset.orientation !== 'Vertical') {
                console.warn('[WARNING] :: Zoom preset "' + preset.key +
                    '" has `option: "TimelineYear"` but `orientation` is "' +
                    (preset.orientation === undefined ? 'undefined' : preset.orientation) +
                    '" — only `orientation: "Vertical"` is allowed for ' +
                    'TimelineYear Zoom presets. Preset skipped.');
                index++;
                continue;
            }
            seenKeys.add(preset.key);
            valid.push(preset);
            index++;
        }
        return valid;
    }

    /**
     * Resolves the initial zoom preset during `preRender`.
     *
     * @returns {ZoomLevel | null} The resolved initial preset, or `null` when Zoom mode is off.
     * @private
     */
    public resolveInitialZoomPreset(): ZoomLevel | null {
        const valid: ZoomLevel[] = this.validateZoomLevels();
        if (valid.length === 0) {
            return null;
        }
        if (this.parent.zoomLevel === null || typeof this.parent.zoomLevel === 'undefined') {
            return valid[0];
        }
        for (const candidate of valid) {
            if (candidate.key === this.parent.zoomLevel) {
                return candidate;
            }
        }
        console.warn('[WARNING] :: zoomLevel "' + this.parent.zoomLevel +
            '" does not match any preset in `zoomLevels` — using the first valid preset instead.');
        return valid[0];
    }

    /**
     * Appends valid zoom presets to `viewCollections` and `viewOptions`.
     *
     * @returns {void}
     * @private
     */
    public appendZoomPresets(): void {
        const valid: ZoomLevel[] = this.validateZoomLevels();
        for (const preset of valid) {
            const viewName: string = preset.option as string;
            const presetLayer: ViewsData = extend({ option: viewName }, preset) as ViewsData;
            delete (presetLayer as Record<string, any>).key;
            this.parent.viewCollections.push(presetLayer);
            const list: ViewsData[] = this.viewOptionsTimelineBucket(viewName);
            list.push(presetLayer);
        }
    }

    /**
     * Returns the per-Timeline bucket array for the given view name,
     * materialising it as a fresh array on first access. Each branch
     * uses literal dot-property access so the
     * `security/detect-object-injection` rule does not fire.
     *
     * @param {string} viewName Timeline view name as defined by `TimelineView`.
     * @returns {ViewsData[]} The bucket array — created on demand if it
     *      did not exist before.
     */
    private viewOptionsTimelineBucket(viewName: string): ViewsData[] {
        if (viewName === 'TimelineDay') {
            return this.parent.viewOptions.timelineDay || (this.parent.viewOptions.timelineDay = []);
        }
        if (viewName === 'TimelineWeek') {
            return this.parent.viewOptions.timelineWeek || (this.parent.viewOptions.timelineWeek = []);
        }
        if (viewName === 'TimelineWorkWeek') {
            return this.parent.viewOptions.timelineWorkWeek || (this.parent.viewOptions.timelineWorkWeek = []);
        }
        if (viewName === 'TimelineMonth') {
            return this.parent.viewOptions.timelineMonth || (this.parent.viewOptions.timelineMonth = []);
        }
        return this.parent.viewOptions.timelineYear || (this.parent.viewOptions.timelineYear = []);
    }

    /**
     * Classifies the type of zoom change for layout/range optimization.
     *
     * @param {ZoomLevel | null} prev - The previous zoom preset, or null if initializing
     * @param {ZoomLevel} next - The target zoom preset
     * @returns {ZoomChangeType} The type of zoom change
     */
    private classifyZoomChange(prev: ZoomLevel | null, next: ZoomLevel): ZoomChangeType {
        if (!prev) {
            return 'range';
        }
        if (prev === next) {
            return 'no-op';
        }
        if (prev.option !== next.option) {
            return 'range';
        }
        if ((prev.interval || 1) !== (next.interval || 1)) {
            return 'range';
        }
        if ((prev.numberOfWeeks || 0) !== (next.numberOfWeeks || 0)) {
            return 'range';
        }
        if ((prev.startHour || '') !== (next.startHour || '')) {
            return 'range';
        }
        if ((prev.endHour || '') !== (next.endHour || '')) {
            return 'range';
        }
        if ((typeof prev.showWeekend === 'boolean' ? prev.showWeekend : true) !==
            (typeof next.showWeekend === 'boolean' ? next.showWeekend : true)) {
            return 'range';
        }
        const prevTimeScale: TimeScaleModel = (prev.timeScale as TimeScaleModel) || {};
        const nextTimeScale: TimeScaleModel = (next.timeScale as TimeScaleModel) || {};
        if ((typeof prevTimeScale.enable === 'boolean' ? prevTimeScale.enable : true) !==
            (typeof nextTimeScale.enable === 'boolean' ? nextTimeScale.enable : true)) {
            return 'range';
        }
        if ((prevTimeScale.interval || 60) !== (nextTimeScale.interval || 60)) {
            return 'range';
        }
        if ((prevTimeScale.slotCount || 2) !== (nextTimeScale.slotCount || 2)) {
            return 'range';
        }
        return 'layout';
    }

    /**
     * Finds a zoom preset by its key.
     *
     * @param {string} key - The zoom preset key to search for
     * @returns {ZoomLevel | null} The matching zoom preset, or null if not found
     */
    private findZoomPreset(key: string): ZoomLevel | null {
        if (!key || !this.parent.zoomLevels) {
            return null;
        }
        const valid: ZoomLevel[] = this.validateZoomLevels();
        for (const candidate of valid) {
            if (candidate.key === key) {
                return candidate;
            }
        }
        return null;
    }

    /**
     * Applies the currently selected zoom preset, running the `actionBegin` / `actionComplete` lifecycle around the view re-initialization.
     *
     * @param {string | null} previousLevel The preset key to record as the source of the transition when no previous preset is active.
     * @returns {void}
     * @private
     */
    public applyZoomPreset(previousLevel: string | null): void {
        if (this.parent.isApplyingZoom) {
            return;
        }
        if (this.parent.isInteractionInProgress()) {
            return;
        }
        if (!this.parent.zoomLevels || this.parent.zoomLevels.length === 0) {
            this.parent.activeZoomPreset = null;
            return;
        }
        const targetKey: string | null = this.parent.zoomLevel;
        let newPreset: ZoomLevel | null = null;
        if (targetKey !== null && typeof targetKey !== 'undefined') {
            newPreset = this.findZoomPreset(targetKey);
            if (!newPreset) {
                const valid: ZoomLevel[] = this.validateZoomLevels();
                const fallback: ZoomLevel | null = valid.length > 0 ? valid[0] : null;
                console.warn('[WARNING] :: zoomLevel "' + targetKey +
                    '" does not match any preset in `zoomLevels` — using the first valid preset instead.');
                if (!fallback) {
                    return;
                }
                this.parent.isApplyingZoom = true;
                this.parent.setProperties({ zoomLevel: fallback.key }, true);
                this.parent.isApplyingZoom = false;
                newPreset = fallback;
            }
        } else {
            const valid: ZoomLevel[] = this.validateZoomLevels();
            newPreset = valid.length > 0 ? valid[0] : null;
            if (!newPreset) {
                return;
            }
            if (newPreset.key !== targetKey) {
                this.parent.isApplyingZoom = true;
                this.parent.setProperties({ zoomLevel: newPreset.key }, true);
                this.parent.isApplyingZoom = false;
            }
        }

        const prevPreset: ZoomLevel | null = this.parent.activeZoomPreset;
        const classification: ZoomChangeType = this.classifyZoomChange(prevPreset, newPreset);
        if (classification === 'no-op') {
            this.parent.activeZoomPreset = newPreset;
            return;
        }
        const previousLevelKey: string | null = prevPreset ? prevPreset.key : previousLevel;
        const currentLevelKey: string = newPreset.key;

        let args: ActionEventArgs = {
            requestType: 'zoomChange',
            cancel: false,
            previousLevel: previousLevelKey === null ? undefined : previousLevelKey,
            currentLevel: currentLevelKey
        };
        this.parent.trigger(events.actionBegin, args, (actionArgs: ActionEventArgs) => {
            if (actionArgs.cancel) {
                let revertKey: string | null = previousLevelKey;
                if (revertKey === null || !this.findZoomPreset(revertKey)) {
                    const valid: ZoomLevel[] = this.validateZoomLevels();
                    const fallback: ZoomLevel | null = valid.length > 0 ? valid[0] : null;
                    if (!fallback) {
                        this.cursorOffsetX = null;
                        this.parent.activeZoomPreset = null;
                        this.parent.isApplyingZoom = true;
                        this.parent.setProperties({ zoomLevel: null }, true);
                        this.parent.isApplyingZoom = false;
                        return;
                    }
                    console.warn('[WARNING] :: Previous zoom preset "' + previousLevelKey +
                        '" is no longer present in `zoomLevels` — falling back to the first valid preset.');
                    revertKey = fallback.key;
                }
                this.cursorOffsetX = null;
                this.parent.isApplyingZoom = true;
                this.parent.setProperties({ zoomLevel: revertKey }, true);
                this.parent.isApplyingZoom = false;
                return;
            }
            this.parent.activeZoomPreset = newPreset;

            this.parent.isApplyingZoom = true;
            this.parent.setProperties(
                {
                    zoomLevel: newPreset.key,
                    currentView: newPreset.option as View
                },
                true
            );
            this.parent.isApplyingZoom = false;

            const newIndex: number =
                this.parent.resolveViewIndexForOption(newPreset.option as string);
            if (newIndex !== -1) {
                this.parent.viewIndex = newIndex;
            }

            const cursorOffsetX: number | null = this.cursorOffsetX;
            const pinchOffsetX: number | null = this.pinchAnchorOffsetX;
            const anchor: ZoomAnchorSnapshot | null =
                (typeof pinchOffsetX === 'number' && !isNaN(pinchOffsetX))
                    ? this.captureZoomAnchor(pinchOffsetX, 'pinch')
                    : ((typeof cursorOffsetX === 'number' && !isNaN(cursorOffsetX))
                        ? this.captureZoomAnchor(cursorOffsetX, 'cursor')
                        : this.captureZoomAnchor());

            this.parent.activeCellsData = null;
            this.parent.uiStateValues.isPreventDataFetch =
                classification === 'layout';

            if (anchor && anchor.centerDateTime && !isNaN(anchor.centerDateTime.getTime())) {
                this.parent.isApplyingZoom = true;
                this.parent.setProperties(
                    { selectedDate: new Date(anchor.centerDateTime.getTime()) },
                    true
                );
                this.parent.isApplyingZoom = false;
            }

            this.parent.initializeView(this.parent.currentView);

            if (this.parent.headerModule) {
                this.parent.headerModule.updateActiveView();
                this.parent.headerModule.setCalendarDate(this.parent.selectedDate);
                this.parent.headerModule.setCalendarView();
            }

            this.restoreZoomAnchor(anchor);

            this.cursorOffsetX = null;
            this.pinchAnchorOffsetX = null;

            args = {
                requestType: 'zoomChange',
                cancel: false,
                currentLevel: currentLevelKey
            };
            this.parent.trigger(events.actionComplete, args);
        });
    }

    /**
     * Captures the semantic viewport anchor for the current Timeline layout so it can be restored after the target layout rebuilds.
     *
     * @param {number} [anchorOffset] Horizontal pixel offset relative to the content-wrap's left edge. Defaults to `clientWidth / 2`.
     * @param {ZoomAnchorSource} [anchorSource] Origin of the anchor offset. Defaults to `'viewport'`.
     * @returns {ZoomAnchorSnapshot | null} The captured anchor, or `null` when no anchor is applicable.
     */
    private captureZoomAnchor(anchorOffset?: number, anchorSource?: ZoomAnchorSource): ZoomAnchorSnapshot | null {
        const activeView: IRenderer = this.parent.activeView;
        if (!activeView) {
            return null;
        }
        if (typeof activeView.isTimelineView !== 'function' || !activeView.isTimelineView()) {
            return null;
        }
        const element: HTMLElement = this.parent.element;
        if (!element) {
            return null;
        }
        const contentWrap: HTMLElement = element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (!contentWrap) {
            return null;
        }
        const renderDates: Date[] = (activeView.renderDates as Date[]) || [];
        const isTimelineYear: boolean = this.isTimelineYearView(activeView);
        if (!isTimelineYear && renderDates.length === 0) {
            return null;
        }
        const scrollLeft: number = contentWrap.scrollLeft;
        const clientWidth: number = contentWrap.clientWidth || 0;
        const isRtl: boolean = !!this.parent.enableRtl;

        const effectiveOffset: number = (typeof anchorOffset === 'number' && !isNaN(anchorOffset))
            ? anchorOffset
            : (clientWidth / 2);
        const centerAbsX: number = isRtl
            ? (Math.abs(scrollLeft) + effectiveOffset)
            : (scrollLeft + effectiveOffset);
        const source: ZoomAnchorSource = anchorSource || 'viewport';
        const semantic: { centerDate: Date; centerHour: string | null } =
            this.scrollLeftToDate(Math.max(0, centerAbsX), activeView);

        const scrollTop: number = contentWrap.scrollTop;

        return {
            centerDateTime: semantic.centerDate,
            viewportOffset: effectiveOffset,
            scrollTop: scrollTop,
            anchorSource: source
        };
    }

    /**
     * Converts a horizontal pixel offset in the active Timeline body into the date (and time) at that pixel.
     *
     * @param {number} absPixelOffset Absolute horizontal pixel offset relative to the content wrap start.
     * @param {IRenderer} activeView The active Timeline renderer.
     * @returns {ZoomAnchorDecode} The decoded semantic anchor.
     */
    private scrollLeftToDate(absPixelOffset: number, activeView: IRenderer): { centerDate: Date; centerHour: string | null } {
        const renderDates: Date[] = (activeView.renderDates as Date[]) || [];
        const colLevels: TdData[][] = (activeView as any).colLevels as TdData[][] || [];

        if (this.isTimelineYearView(activeView)) {
            return this.scrollLeftToDateTimelineYear(absPixelOffset, activeView);
        }

        const bottomRow: TdData[] = (colLevels && colLevels.length > 0) ? colLevels[colLevels.length - 1] : [];
        const fallback: Date = renderDates.length > 0 ? renderDates[0] : (this.parent.selectedDate || new Date());

        if (bottomRow.length === 0 || !this.parent.element) {
            return {
                centerDate: fallback,
                centerHour: null
            };
        }

        const cells: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS + ', .e-work-cells');
        const cellWidth: number = (cells && cells.length > 0) ? this.parent.getElementWidth(cells[0]) : 50;

        if (!cellWidth || isNaN(cellWidth) || cellWidth <= 0) {
            const date: Date = new Date(+bottomRow[0].date);

            return {
                centerDate: date,
                centerHour: this.formatHourString(date)
            };
        }

        let runningPixel: number = 0;
        let slotWidth: number = cellWidth;
        let slotEntry: TdData = bottomRow[0];

        for (const entry of bottomRow) {
            const span: number = (entry.colSpan && entry.colSpan > 0) ? entry.colSpan * cellWidth : cellWidth;

            if (runningPixel + span > absPixelOffset) {
                slotWidth = span;
                slotEntry = entry;
                break;
            }

            runningPixel += span;
            slotWidth = span;
            slotEntry = entry;
        }

        const slotStart: Date = new Date(+slotEntry.date);
        const offsetWithinSlot: number = Math.max(0, absPixelOffset - runningPixel);
        const fractionOfSlot: number = Math.min(1, Math.max(0, offsetWithinSlot / slotWidth));
        const slotMinutes: number = this.parent.getEffectiveSlotMinutes() || 60;
        const slotDateTime: Date = new Date(slotStart.getTime() + (fractionOfSlot * slotMinutes * 60000));

        return {
            centerDate: slotDateTime,
            centerHour: this.formatHourString(slotDateTime)
        };
    }

    /**
     * Detects whether the supplied active view is a `TimelineYear`
     * renderer. Detection is module-name based because `TimelineYear`
     * is the only view in the Scheduler that publishes
     * `getModuleName() === 'timelineYear'`.
     *
     * @param {IRenderer} activeView The view to inspect.
     * @returns {boolean} `true` when the active view is a `TimelineYear`.
     */
    private isTimelineYearView(activeView: IRenderer): boolean {
        if (!activeView) {
            return false;
        }
        const moduleName: string = (activeView as any).getModuleName && (activeView as any).getModuleName();
        return moduleName === 'timelineYear';
    }

    /**
     * Lower bound for `clampAnchorToRange` when `renderDates` is unavailable.
     *
     * @param {IRenderer} targetView The active TimelineYear renderer.
     * @returns {Date} The first day of the rendered year at midnight.
     */
    private getTimelineYearRangeStart(targetView: IRenderer): Date {
        const year: number = (this.parent.selectedDate && !isNaN(this.parent.selectedDate.getTime()))
            ? this.parent.selectedDate.getFullYear()
            : new Date().getFullYear();
        const monthsList: number[] = (typeof (targetView as any).getMonths === 'function')
            ? (targetView as any).getMonths() as number[]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const firstMonth: number = monthsList.length > 0 ? monthsList[0] : 0;
        return new Date(year, firstMonth, 1, 0, 0, 0, 0);
    }

    /**
     * Upper bound for `clampAnchorToRange` when `renderDates` is unavailable.
     *
     * @param {IRenderer} targetView The active TimelineYear renderer.
     * @returns {Date} The last day of the rendered year at `23:59:59.999`.
     */
    private getTimelineYearRangeEnd(targetView: IRenderer): Date {
        const year: number = (this.parent.selectedDate && !isNaN(this.parent.selectedDate.getTime()))
            ? this.parent.selectedDate.getFullYear()
            : new Date().getFullYear();
        const monthsList: number[] = (typeof (targetView as any).getMonths === 'function')
            ? (targetView as any).getMonths() as number[]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const lastMonth: number = monthsList.length > 0 ? monthsList[monthsList.length - 1] : 11;
        const lastDay: Date = new Date(year, lastMonth + 1, 0, 23, 59, 59, 999);
        return lastDay;
    }

    /**
     * `TimelineYear` capture branch of `scrollLeftToDate`.
     *
     * @param {number} absPixelOffset Absolute horizontal pixel offset relative to the content wrap start.
     * @param {IRenderer} activeView The active TimelineYear renderer.
     * @returns {ZoomAnchorDecode} The decoded semantic anchor (first day of the matched month).
     */
    private scrollLeftToDateTimelineYear(absPixelOffset: number, activeView: IRenderer): { centerDate: Date; centerHour: string | null } {
        const year: number = (this.parent.selectedDate && !isNaN(this.parent.selectedDate.getTime()))
            ? this.parent.selectedDate.getFullYear()
            : new Date().getFullYear();
        const monthsList: number[] = (typeof (activeView as any).getMonths === 'function')
            ? (activeView as any).getMonths() as number[]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const columnCount: number = Math.max(1, monthsList.length);

        if (!this.parent.element) {
            const fallbackMonth: number = monthsList[0] || 0;
            return {
                centerDate: new Date(year, fallbackMonth, 1, 0, 0, 0, 0),
                centerHour: null
            };
        }

        const contentTable: HTMLElement | null = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        let columnWidth: number = 0;
        if (contentTable) {
            const colgroup: HTMLElement | null = contentTable.querySelector('colgroup');
            const cols: NodeListOf<HTMLElement> = colgroup ? colgroup.querySelectorAll('col') : null;
            if (cols && cols.length > 0) {
                columnWidth = this.parent.getElementWidth(cols[0]);
            }
        }
        if (!columnWidth || isNaN(columnWidth) || columnWidth <= 0) {
            const workCells: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS);
            if (workCells && workCells.length > 0) {
                columnWidth = this.parent.getElementWidth(workCells[0]);
            }
        }
        if (!columnWidth || isNaN(columnWidth) || columnWidth <= 0) {
            columnWidth = 50;
        }

        const safeOffset: number = Math.max(0, absPixelOffset);
        let monthIndex: number = Math.floor(safeOffset / columnWidth);
        if (monthIndex < 0) { monthIndex = 0; }
        if (monthIndex >= columnCount) { monthIndex = columnCount - 1; }

        const monthNumber: number = monthsList.find(
            (_: number, index: number) => index === monthIndex
        ) || 0;

        return {
            centerDate: new Date(year, monthNumber, 1, 0, 0, 0, 0),
            centerHour: null
        };
    }

    /**
     * Restores the viewport anchor captured before the current transition ran.
     *
     * @param {ZoomAnchorSnapshot | null} anchor The captured anchor, or null to no-op.
     * @returns {void}
     */
    private restoreZoomAnchor(anchor: ZoomAnchorSnapshot | null): void {
        if (!anchor) { return; }

        const targetView: IRenderer = this.parent.activeView;

        if (!targetView) { return; }

        const newRenderDates: Date[] = (targetView.renderDates as Date[]) || [];

        const isTargetTimelineYear: boolean = this.isTimelineYearView(targetView);
        if (!isTargetTimelineYear && newRenderDates.length === 0) { return; }

        const rangeStart: Date = newRenderDates.length > 0
            ? new Date(newRenderDates[0])
            : this.getTimelineYearRangeStart(targetView);
        const rangeEnd: Date = newRenderDates.length > 0
            ? new Date(newRenderDates[newRenderDates.length - 1])
            : this.getTimelineYearRangeEnd(targetView);

        const isTargetTimeline: boolean = !!(targetView.isTimelineView && targetView.isTimelineView());
        const element: HTMLElement = this.parent.element;
        const contentWrap: HTMLElement =
            element ? element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement : null;

        if (!contentWrap) { return; }

        if (
            this.parent.activeViewOptions &&
            this.parent.activeViewOptions.timeScale &&
            this.parent.activeViewOptions.timeScale.enable
        ) {
            rangeEnd.setHours(23, 59, 59, 999);
        }

        const clamped: Date = this.clampAnchorToRange(anchor.centerDateTime, rangeStart, rangeEnd);
        const targetIsRtl: boolean = !!this.parent.enableRtl;

        if (isTargetTimeline) {
            const computedLeft: number = this.computePixelOffsetForDate(targetView, clamped);
            const maxScrollLeft: number = Math.max(0, contentWrap.scrollWidth - contentWrap.clientWidth);
            const restoredLeft: number = Math.max(0, Math.min(maxScrollLeft, computedLeft - anchor.viewportOffset));
            contentWrap.scrollLeft = targetIsRtl ? -restoredLeft : restoredLeft;
        }

        if (!isNaN(anchor.scrollTop)) {
            contentWrap.scrollTop = anchor.scrollTop;
        }
    }

    /**
     * Formats the hour portion of a `Date` as an `HH:mm` string.
     *
     * @param {Date} date The source date.
     * @returns {string} The formatted hour string.
     */
    private formatHourString(date: Date): string {
        if (!date || isNaN(date.getTime())) {
            return '00:00';
        }
        const h: number = date.getHours();
        const m: number = date.getMinutes();
        const hh: string = (h < 10 ? '0' : '') + h.toString();
        const mm: string = (m < 10 ? '0' : '') + m.toString();
        return hh + ':' + mm;
    }

    /**
     * Clamps an anchor date to a valid range.
     *
     * @param {Date} anchor - The anchor date to clamp
     * @param {Date} rangeStart - The start of the valid range
     * @param {Date} rangeEnd - The end of the valid range
     * @returns {Date} The clamped date
     */
    private clampAnchorToRange(anchor: Date, rangeStart: Date, rangeEnd: Date): Date {
        if (!anchor || isNaN(anchor.getTime())) {
            return rangeStart;
        }
        if (anchor.getTime() < rangeStart.getTime()) {
            return new Date(+rangeStart);
        }
        if (anchor.getTime() > rangeEnd.getTime()) {
            return new Date(+rangeEnd);
        }
        return anchor;
    }

    /**
     * Derives the pixel offset at which the given date appears in the
     * new Timeline body. Re-uses the existing forward calculator when
     * the renderer exposes `getLeftFromDateTime`, otherwise falls back
     * to counting cells in the active row.
     *
     * @param {IRenderer} activeView The target Timeline renderer.
     * @param {Date} targetDate The date whose pixel offset is sought.
     * @returns {number} The pixel offset.
     */
    private computePixelOffsetForDate(activeView: IRenderer, targetDate: Date): number {
        const renderDates: Date[] = (activeView.renderDates as Date[]) || [];
        if (renderDates.length === 0) {
            return 0;
        }
        if (this.isTimelineYearView(activeView)) {
            return this.computePixelOffsetForDateTimelineYear(activeView, targetDate);
        }
        const ref: any = activeView as any;
        if (typeof ref.getLeftFromDateTime === 'function') {
            const index: number = this.parent.getIndexOfDate(renderDates, util.resetTime(targetDate));
            if (index >= 0) {
                return ref.getLeftFromDateTime([index], targetDate);
            }
        }
        const workCells: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.e-work-cells');
        if (workCells.length === 0) {
            return 0;
        }
        const targetMs: number = targetDate.getTime();
        const cellWidth: number = this.parent.getElementWidth(workCells[0]) || 50;
        let cellIndex: number = 0;
        for (const cell of Array.from(workCells)) {
            const dataDate: string | null = cell.getAttribute('data-date');
            if (dataDate && Number(dataDate) >= targetMs) {
                return cellIndex * cellWidth;
            }
            cellIndex++;
        }

        return Math.max(0, (workCells.length - 1) * cellWidth);
    }

    /**
     * `TimelineYear` restore branch of `computePixelOffsetForDate`.
     *
     * @param {IRenderer} activeView The active TimelineYear renderer.
     * @param {Date} targetDate The target date (clamped to the first day of its month).
     * @returns {number} The pixel offset of the matched column inside the content wrap.
     */
    private computePixelOffsetForDateTimelineYear(activeView: IRenderer, targetDate: Date): number {
        if (!targetDate || isNaN(targetDate.getTime())) {
            return 0;
        }
        const monthsList: number[] = (typeof (activeView as any).getMonths === 'function')
            ? (activeView as any).getMonths() as number[]
            : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const monthNumber: number = targetDate.getMonth();

        let monthIndex: number = monthsList.indexOf(monthNumber);
        if (monthIndex < 0) {
            monthIndex = monthNumber < monthsList[0] ? 0 : monthsList.length - 1;
        }

        if (!this.parent.element) {
            return 0;
        }
        const contentTable: HTMLElement | null = this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS) as HTMLElement;
        let columnWidth: number = 0;
        if (contentTable) {
            const colgroup: HTMLElement | null = contentTable.querySelector('colgroup');
            const cols: NodeListOf<HTMLElement> = colgroup ? colgroup.querySelectorAll('col') : null;
            if (cols && cols.length > 0) {
                columnWidth = this.parent.getElementWidth(cols[0]);
            }
        }
        if (!columnWidth || isNaN(columnWidth) || columnWidth <= 0) {
            const workCells: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS);
            if (workCells && workCells.length > 0) {
                columnWidth = this.parent.getElementWidth(workCells[0]);
            }
        }
        if (!columnWidth || isNaN(columnWidth) || columnWidth <= 0) {
            columnWidth = 50;
        }

        return Math.max(0, monthIndex * columnWidth);
    }

    /**
     * Ctrl + Mouse Wheel handler that drives zoom in / zoom out across
     * adjacent presets.
     *
     * Stores the client's horizontal cursor position (relative to the
     * content-wrap's viewport) in `cursorOffsetX`. This is used later by
     * `applyZoomPreset` to anchor the zoom transition.
     *
     * When the scroll direction is up (deltaY < 0), zoom in to the next
     * (finer) preset. When it is down (deltaY > 0), zoom out to the
     * previous (broader) preset.
     *
     * @param {Event} e The native wheel event.
     * @returns {void}
     */
    private onWheelZoom(e: Event): void {
        const wheelEvent: WheelEvent = e as WheelEvent;
        if (!wheelEvent || !wheelEvent.ctrlKey) {
            return;
        }

        if (wheelEvent.cancelable) {
            wheelEvent.preventDefault();
        }
        wheelEvent.stopPropagation();

        const contentWrap: HTMLElement | null = this.parent.element
            ? this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement
            : null;
        if (contentWrap && typeof wheelEvent.clientX === 'number') {
            const rect: ClientRect | DOMRect = contentWrap.getBoundingClientRect();
            const viewportWidth: number = contentWrap.clientWidth || rect.width;
            const offsetX: number = wheelEvent.clientX - rect.left;
            const clampedOffset: number = Math.max(0, Math.min(viewportWidth, offsetX));

            this.cursorOffsetX = this.parent.enableRtl ? (viewportWidth - clampedOffset) : clampedOffset;
        } else {
            this.cursorOffsetX = null;
        }

        if (wheelEvent.deltaY < 0) {
            this.selectAdjacentZoomPreset(1);
        } else if (wheelEvent.deltaY > 0) {
            this.selectAdjacentZoomPreset(-1);
        }
    }

    /**
     * Selects the zoom preset adjacent to the current one. Boundary
     * presets return silently so no `actionBegin` / `actionComplete`
     * fires.
     *
     * @param {1 | -1} direction `+1` for next preset, `-1` for previous.
     * @returns {void}
     */
    private selectAdjacentZoomPreset(direction: 1 | -1): void {
        if (!this.parent.zoomLevels || this.parent.zoomLevels.length === 0 || this.parent.zoomLevel === null) {
            return;
        }
        const currentIndex: number = this.parent.zoomLevels.findIndex(
            (preset: ZoomLevel) => preset.key === this.parent.zoomLevel
        );
        if (currentIndex === -1) {
            return;
        }
        const targetIndex: number = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= this.parent.zoomLevels.length) {
            return;
        }
        const targetPreset: ZoomLevel | undefined = this.parent.zoomLevels.find(
            (_: ZoomLevel, index: number) => index === targetIndex
        );
        if (!targetPreset) {
            return;
        }
        this.parent.zoomLevel = targetPreset.key;
        this.parent.dataBind();
    }

    /**
     * Resets the pinch state to its initial state.
     *
     * @returns {void}
     */
    private resetPinchState(): void {
        this.pinchState.pointers = {};
        this.pinchState.referenceDistance = null;
        this.pinchState.lastDirection = null;
        this.pinchState.pinchStarted = false;
        this.pinchAnchorOffsetX = null;
    }

    /**
     * Returns the number of active pointers.
     *
     * @returns {number} The number of active pointers
     */
    private pinchPointerCount(): number {
        return Object.keys(this.pinchState.pointers).length;
    }

    /**
     * Checks if a pointer is being tracked.
     *
     * @param {number} pointerId - The pointer ID to check
     * @returns {boolean} True if the pointer is being tracked
     */
    private pinchHasPointer(pointerId: number): boolean {
        return Object.prototype.hasOwnProperty.call(this.pinchState.pointers, String(pointerId));
    }

    /**
     * Calculates Euclidean distance between two points.
     *
     * @param {number} ax - X coordinate of point A
     * @param {number} ay - Y coordinate of point A
     * @param {number} bx - X coordinate of point B
     * @param {number} by - Y coordinate of point B
     * @returns {number} The Euclidean distance between the points
     */
    private pinchEuclideanDistance(ax: number, ay: number, bx: number, by: number): number {
        const dx: number = ax - bx;
        const dy: number = ay - by;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    /**
     * Gets the midpoint X coordinate of two active pointers.
     *
     * @returns {number | null} The X coordinate of the midpoint, or null if fewer than 2 pointers are active
     */
    private pinchMidpointX(): number | null {
        if (this.pinchPointerCount() < 2) {
            return null;
        }
        const arr: { clientX: number; clientY: number }[] = Object.keys(this.pinchState.pointers).map(
            (k: string): { clientX: number; clientY: number } => this.pinchState.pointers[Number(k)]
        );
        const a: { clientX: number; clientY: number } = arr[0];
        const b: { clientX: number; clientY: number } = arr[1];
        return (a.clientX + b.clientX) / 2;
    }

    /**
     * `pointerdown` handler that initiates pinch state tracking for multi-touch zoom.
     *
     * @param {PointerEvent} e The native pointerdown event.
     * @returns {void}
     */
    private onPinchPointerDown(e: PointerEvent): void {
        if (!this.parent.zoomLevels || this.parent.zoomLevels.length === 0) {
            return;
        }
        if (e.pointerType === 'mouse') {
            // Skip a bare-mouse pointerdown so single clicks do not
            // leak into pinch state; touchpad / trackpad multi-touch
            // arrives with subsequent pointers and is tracked from
            // then on.
            if (this.pinchPointerCount() === 0) {
                return;
            }
        }
        if (this.pinchPointerCount() >= 2) {
            return;
        }
        this.pinchState.pointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
        if (this.pinchPointerCount() === 2) {
            const arr: { clientX: number; clientY: number }[] = Object.keys(this.pinchState.pointers).map(
                (k: string): { clientX: number; clientY: number } => this.pinchState.pointers[Number(k)]
            );
            const a: { clientX: number; clientY: number } = arr[0];
            const b: { clientX: number; clientY: number } = arr[1];
            this.pinchState.referenceDistance = this.pinchEuclideanDistance(
                a.clientX, a.clientY, b.clientX, b.clientY
            );
            this.pinchState.lastDirection = null;
            this.pinchState.pinchStarted = true;
        }
    }

    /**
     * `pointermove` handler. Measures live distance against the
     * reference distance captured at the start of the pinch and
     * commits a transition on every threshold crossing. The reference
     * distance is rebased after each transition so sub-threshold jitter
     * never accumulates to a fresh crossing.
     *
     * @param {PointerEvent} e The native pointermove event.
     * @returns {void}
     */
    private onPinchPointerMove(e: PointerEvent): void {
        if (!this.pinchState.pinchStarted) {
            if (this.pinchHasPointer(e.pointerId)) {
                this.pinchState.pointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
            }
            return;
        }
        if (!this.pinchHasPointer(e.pointerId)) {
            return;
        }
        this.pinchState.pointers[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
        if (this.pinchPointerCount() !== 2 || this.pinchState.referenceDistance === null) {
            return;
        }
        if (e.cancelable) {
            e.preventDefault();
        }
        const arr: { clientX: number; clientY: number }[] = Object.keys(this.pinchState.pointers).map(
            (k: string): { clientX: number; clientY: number } => this.pinchState.pointers[Number(k)]
        );
        const a: { clientX: number; clientY: number } = arr[0];
        const b: { clientX: number; clientY: number } = arr[1];
        const current: number = this.pinchEuclideanDistance(a.clientX, a.clientY, b.clientX, b.clientY);
        const diff: number = current - this.pinchState.referenceDistance;
        let direction: 1 | -1 | null = null;
        if (diff >= this.pinchDistanceThreshold) {
            direction = 1;
        } else if (-diff >= this.pinchDistanceThreshold) {
            direction = -1;
        }
        if (direction === null) {
            return;
        }
        if (this.parent.isInteractionInProgress()) {
            this.pinchState.referenceDistance = current;
            this.pinchState.lastDirection = null;
            return;
        }
        const midpoint: number | null = this.pinchMidpointX();
        const contentWrap: HTMLElement | null = this.parent.element
            ? this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement
            : null;
        if (contentWrap && midpoint !== null) {
            const wrapRect: ClientRect | DOMRect = contentWrap.getBoundingClientRect();
            const viewportWidth: number = contentWrap.clientWidth || wrapRect.width;
            const offsetX: number = midpoint - wrapRect.left;
            const clampedOffset: number = Math.max(0, Math.min(viewportWidth, offsetX));
            this.pinchAnchorOffsetX = this.parent.enableRtl ? (viewportWidth - clampedOffset) : clampedOffset;
        } else {
            this.pinchAnchorOffsetX = null;
        }
        this.pinchState.lastDirection = direction;
        this.pinchState.referenceDistance = current;
        this.selectAdjacentZoomPreset(direction);
    }

    /**
     * `pointerup` handler that cleans up pointer tracking.
     *
     * @param {PointerEvent} e The native pointerup event.
     * @returns {void}
     */
    private onPinchPointerUp(e: PointerEvent): void {
        if (this.pinchHasPointer(e.pointerId)) {
            delete this.pinchState.pointers[e.pointerId];
        }
        if (this.pinchPointerCount() < 2) {
            this.resetPinchState();
        }
    }

    /**
     * Updates the native `touch-action` policy for Timeline Zoom.
     *
     * When Zoom mode is active, the Scheduler relies on pointer events
     * (pinch) and the Ctrl + Wheel handler, so the element must allow
     * pan / zoom gestures. When Zoom mode is disabled the original
     * `touch-action` is restored.
     *
     * @param {boolean} isZoomActive `true` to enable the Zoom-mode
     *      policy, `false` to restore the original behavior.
     * @returns {void}
     */
    private updateZoomTouchAction(isZoomActive: boolean): void {
        if (!this.parent.element) {
            return;
        }
        if (isZoomActive) {
            this.parent.element.style.touchAction = 'pan-x pan-y';
        } else {
            this.parent.element.style.removeProperty('touch-action');
        }
    }
}
