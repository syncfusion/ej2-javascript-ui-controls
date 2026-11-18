/**
 * Fired after a chart is created.
 */
export const chartCreated: string = 'chartCreated';

/**
 * Fired after chart properties change.
 */
export const chartUpdated: string = 'chartUpdated';

/**
 * Fired after series data is recalculated.
 */
export const chartRefreshed: string = 'chartRefreshed';

/**
 * Fired after a chart is deleted.
 */
export const chartDeleted: string = 'chartDeleted';

/**
 * Fired before a chart action is applied.
 */
export const beforeChartAction: string = 'beforeChartAction';

/**
 * Fired after a chart action is applied.
 */
export const afterChartAction: string = 'afterChartAction';

/**
 * Fired when an overlay element is selected.
 */
export const overlaySelected: string = 'overlaySelected';

/**
 * Fired when an overlay element drag/move completes.
 */
export const overlayMoved: string = 'overlayMoved';

/**
 * Fired when an overlay element resize completes.
 */
export const overlayResized: string = 'overlayResized';

/**
 * Fired when any overlay interaction (move or resize) completes.
 */
export const overlayComplete: string = 'overlayComplete';
