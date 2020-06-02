/**
 * progress bar type
 */
export type ProgressType =
    /** linear */
    'Linear' |
    /** circular */
    'Circular';

/** 
 * Corner type
 */
export type CornerType =
    /** Auto will change based on theme */
    'Auto' |
    /** square */
    'Square' |
    /** Round */
    'Round';

/** 
 * ProgressTheme
 */
export type ProgressTheme =
    /** Material */
    'Material' |
    /** Fabric */
    'Fabric' |
    /** Bootstrap */
    'Bootstrap' |
    /** Bootstrap4 */
    'Bootstrap4' |
    /** HighContrast */
    'HighContrast';

/**
 * Text alignment
 */
export type TextAlignmentType =
    /** Near */
    'Near' |
    /** Center */
    'Center' |
    /** Far */
    'Far';

/** 
 * Linear modes
 */
export type ModeType =
    'Auto' |
    'Success' |
    'Info' |
    'Danger' |
    'Warning';

/**
 * Timing function
 */
export type TimingFunction =
    'Linear' |
    'EaseIn' |
    'EaseOut' |
    'EaseInOut'|
    'Bounce';