/**
 * It defines orientation of the bullet chart.
 * * horizontal
 * * vertical
 *
 * @private
 */
export type OrientationType =
    /** Horizontal type */
    'Horizontal' |
    /** Vertical type */
    'Vertical';

/**
 * It defines flow direction of the bullet chart.
 * * Forward
 * * Backward
 *
 * @private
 */
export type FlowType =
    /** Forward type */
    'Forward' |
    /** Backward type */
    'Backward';

/**
 * It defines tick position of the bullet chart.
 * * Far
 * * Near
 * * Center
 *
 * @private
 */
export type TickPlacement =
    /** Far type */
    'Far' |
    /** Near type */
    'Near' |
    /** Near type */
    'Center';

/**
 * It defines flow direction of the bullet chart.
 * * Forward
 * * Backward
 *
 * @private
 */
export type FeatureType =
    /** Rectangle type */
    'Rect' |
    /** Dot type */
    'Dot';

/**
 * It defines tick placement of bullet chart.
 * * Outside
 * * Inside
 *
 * @private
 */
export type TickPosition =
    /** Far type */
    'Outside' |
    /** Near type */
    'Inside';

/**
 * It defines label placement of bullet chart.
 * * Outside
 * * Inside
 *
 * @private
 */
export type LabelsPlacement =
    /** Far type */
    'Outside' |
    /** Near type */
    'Inside';

/**
 * It defines label position of bullet chart.
 * * Below
 * * Above
 *
 * @private
 */
export type LabelsPosition =
    /** Below type */
    'Below' |
    /** Above type */
    'Above';

/**
 * It defines Text anchor of bullet chart.
 * * Start
 * * Middle
 * * End
 *
 * @private
 */
export type TextAnchor =
    /** Start type */
    'Start' |
    /** Middle type */
    'Middle' |
    /** End type */
    'End';

/**
 * It defines Text anchor of bullet chart.
 * * Left
 * * Right
 * * Top
 * * Bottom
 *
 * @private
 */
export type TextPosition =
    /** Left position */
    'Left' |
    /** Right position */
    'Right' |
    /** Top position */
    'Top' |
    /** Bottom position */
    'Bottom';

/**
 * It defines Text anchor of bullet chart.
 * * Rect
 * * Circle
 * * Cross
 *
 * @private
 */
export type TargetType =
    /** Rect bulletchart target type */
    'Rect' |
    /** Circle bulletchart target type */
    'Circle' |
    /** Cross bulletchart target type */
    'Cross';
