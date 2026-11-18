export * from './authoring';
export * from './body-pr';
export * from './drawing-shape';
export * from './encode-builders';
export * from './fill-format';
export * from './host-codec';
export * from './line-format';
export * from './parse-register';
export * from './shape-types';
export * from './sp-pr';
export * from './text-frame';
export {
    ANCHOR_DEFAULT_SIDE_DIST_EMU,
    CHART_GRAPHIC_DATA_URI,
    CHART_GRAPHIC_DATA_URI_STRICT,
    DIAGRAM_GRAPHIC_DATA_URI,
    DIAGRAM_GRAPHIC_DATA_URI_STRICT,
    DRAWING,
    DrawingEncoding,
    DrawingExtent,
    DrawingPlacement,
    DrawingVariant,
    GroupOptions,
    ShapeBodyPrOptions,
    WORDPROCESSING_INK_URI
} from './types';
export * from './wrap-format';
/**
 * Drawing shapes foundation — preserve non-picture DrawingML/VML and author
 * dual MC AlternateContent hosts (`wps` Choice + corpus-backed VML Fallback).
 *
 * @packageDocumentation
 */
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { Paragraph } from '../document/paragraph';
import { appendGroupToParagraph, appendShapeToParagraph } from './authoring';
import { registerDrawingFeature } from './parse-register';
import { GroupOptions } from './types';
import { AutoShapeType } from './shape-types';
import { GroupShape, Shape } from './drawing-shape';

Paragraph.prototype.appendShape = function (
    this: Paragraph,
    autoShapeType: AutoShapeType,
    width: number,
    height: number
): Shape {
    return appendShapeToParagraph(this, autoShapeType, width, height);
};
Paragraph.prototype.appendGroup = function (this: Paragraph, options: GroupOptions): GroupShape {
    return appendGroupToParagraph(this, options);
};
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerDrawingFeature();
});
registerDrawingFeature();
