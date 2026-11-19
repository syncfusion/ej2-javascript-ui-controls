/**
 * Presentation and slide skeleton (core).
 *
 * @packageDocumentation
 */
export { OFFICE_REL_ATTR_NS, PML_NS, ST_SLIDE_ID_MAX_EXCLUSIVE, ST_SLIDE_ID_MIN } from './constants';
export { flushPresentationModel, loadPresentationModel, PresentationModel } from './load';
export { LayoutSlide, LayoutSlideOptions } from '../slideimplementation/layoutslide';
export { MasterSlide, MasterSlideOptions } from '../slideimplementation/masterslide';
export { HyperlinkView, Slide } from '../slideimplementation/slide';
export { PresentationSection } from './presentation-section';
export { BackgroundFill, DirectSlideBackground, PictureBackgroundFill, ResolvedSlideBackground } from './background';
export { DRAWINGML_CHART_URI, DRAWINGML_DIAGRAM_URI, DRAWINGML_TABLE_URI, P14_NS, PRESENTATION_OLE_URI, ShapeType } from './shapetype';
