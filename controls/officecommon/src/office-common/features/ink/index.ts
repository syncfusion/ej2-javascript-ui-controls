/**
 * Optional ink feature module (`@syncfusion/ej2-office-common/ink`).
 *
 * Provides the shared InkML DOM model, pure trace codec, authoring helpers,
 * cited constants, effect→color table, and InkML parse/serialize (TASK-9003).
 *
 * @packageDocumentation
 */

export {
    INKML_NAMESPACE,
    INK_CONTENT_TYPE,
    INK_SOURCE_RELATIONSHIP_TYPE,
    WORDML_2010_NAMESPACE,
    WORDPROCESSING_INK_URI
} from './constants';

export { INK_EFFECT_COLORS, inkEffectColor } from './ink-effects';

export {
    InkBounds,
    InkExtent,
    InkPoint,
    TraceDecodeResult,
    TraceDecodeStats
} from './trace-codec';
export {
    computeInkBounds,
    decodeTrace,
    encodeTrace,
    scalePointsStretch,
    scalePointsUniform
} from './trace-codec';

export {
    InkBrush,
    InkChannel,
    InkContext,
    InkEffectType,
    InkTrace,
    OfficeInk
} from './ink-model';
export {
    addInkTrace,
    cloneInk,
    createInk,
    inkPathPoints,
    isOfficeInk,
    setInkScaleMode
} from './ink-model';

export { InkParseDiagnostic, InkParseDiagnostics } from './ink-parser';
export {
    DIAG_INVALID_INK_TRACE,
    getLastInkParseDiagnostics,
    parseInkXml
} from './ink-parser';

export { serializeInkXml } from './ink-serializer';

export { EMUS_PER_POINT, formatUnitValue, pointsToUnit, unitValueToPoints } from './ink-units';
