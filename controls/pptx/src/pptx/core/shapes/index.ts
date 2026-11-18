/**
 * Shape tree identity (core).
 *
 * @packageDocumentation
 */
export { addTextBoxToSlide, DEFAULT_TEXT_BOX_BOUNDS, DEFAULT_TEXT_BOX_NAME, AddTextBoxOptions, AddTextBoxToSlideArgs,
    ShapeBounds, TextBoxBounds } from './add-text-box';
export { addShapeToSlide, DEFAULT_AUTO_SHAPE_BOUNDS, AddShapeOptions, AddShapeToSlideArgs } from './add-shape';
export { AutoShapeType, DEFAULT_AUTO_SHAPE_NAMES, autoShapePrst, isAutoShapeType, AutoShapePrst,
    AutoShapeTypeValue } from './auto-shape-type';
export { DML_NS } from './constants';
export { ConnectorConnection, ConnectorEnds, CustomGeometry, CustomGeometryCommand, CustomGeometryConnectionSite,
    CustomGeometryPath, CustomGeometryPoint, DirectGeometry, GeometryGuide, GeometryKind,
    MissingGeometry, PresetGeometry } from './connector-geometry-types';
export { allocateNextDrawingElementId, collectDrawingElementIds, ST_DRAWING_ELEMENT_ID_MAX } from './drawing-element-id';
export { ShapeNotFoundError, ShapeTextError, ShapeTreeCycleError } from './errors';
export { BlipFill, DirectFill, DirectLine, DirectLineFill, GradientFill, GroupFill, LineEnd, LineJoin, MissingFill, NoFill,
    PatternFill, ResolvedDirectFill, ResolvedFill, ResolvedMissingFill, ResolvedStyleRefFill, ShapeStyleRefs, SolidFill,
    StyleMatrixReference } from './fill-line-types';
export { DirectTransform, EmuPoint, EmuSize, GroupChildSpace } from '../resolve/read-xfrm';
export { Shape, PictureShape, AddTextOptions, ShapeElementKind, ShapeMaterializer } from './shape'; 
export { bindShapeCollection, ShapeCollection, ShapeCollectionMutators } from './shape-collection';
export { removeShapeFromSlide, RemoveShapeFromSlideArgs } from './remove-shape';
export { findParentElement, isDescendantOf, removeDirectChild, walkElements } from './tree-detach';
export { walkSlideShapeTree } from './walk';
export { AddPictureOptions, PictureBounds, PictureDataInput } from '../pictures/add-picture';
export { DEFAULT_PICTURE_BOUNDS, DEFAULT_PICTURE_NAME, PICTURE_INSERT_CONTENT_TYPES } from '../pictures/add-picture';
