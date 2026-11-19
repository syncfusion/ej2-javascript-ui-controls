/**
 * Notes feature identifiers and re-exported corpus constants.
 *
 * @remarks
 * Relationship type and content type strings are defined in core
 * (`NOTES_SLIDE_*`) so preserve/docs can cite the same values without importing
 * this module. Feature id is notes-module only.
 *
 * Citation: ECMA-376 Part 4 Transitional notesSlide relationship;
 * ECMA-376 Part 1 notesSlide content type; `docs/specs/016-notes-slides.md`.
 */
/**
 * Optional feature id registered on `@syncfusion/ej2-pptx/notes` import.
 *
 * @public
 */
export const NOTES_FEATURE_ID: string = 'notes';
export { NOTES_MASTER_CONTENT_TYPE, NOTES_MASTER_REL_TYPE, NOTES_SLIDE_CONTENT_TYPE,
    NOTES_SLIDE_REL_TYPE } from '../../core/package/constants';
