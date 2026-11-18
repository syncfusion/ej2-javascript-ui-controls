/**
 * Create presentation / add-slide skeleton (core).
 *
 * @packageDocumentation
 */
export { buildCreatePackage, BuildCreatePackageOptions } from './build-package';
export { addSlideToPresentation, AddSlideOptions } from './add-slide';
export { bindSlideCollection, SlideCollection } from './slide-collection';
export { DEFAULT_SLIDE_LAYOUT_TYPE, SlideLayoutType, isSlideLayoutType, SlideLayoutTypeValue } from './slide-layout-type';
export { DEFAULT_FIRST_SLIDE_ID, DEFAULT_NOTES_SZ_CX, DEFAULT_NOTES_SZ_CY, DEFAULT_SLIDE_LAYOUT_LIST_ID,
    DEFAULT_SLIDE_MASTER_LIST_ID, DEFAULT_SLIDE_SZ_CX, DEFAULT_SLIDE_SZ_CY, DEFAULT_TABLE_STYLE_LIST_DEF } from './templates';
export { CREATE_APP_PROPS_PART, CREATE_CORE_PROPS_PART, CREATE_FIRST_SLIDE_PART, CREATE_PRES_PROPS_PART,
    CREATE_PRESENTATION_PART, CREATE_SLIDE_LAYOUT_PART, CREATE_SLIDE_MASTER_PART, CREATE_TABLE_STYLES_PART, CREATE_THEME_PART,
    slideLayoutPartName, CREATE_VIEW_PROPS_PART, slidePartName } from './part-names';
