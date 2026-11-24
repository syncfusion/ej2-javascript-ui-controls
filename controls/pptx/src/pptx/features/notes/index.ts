/**
 * Optional notes slide module (`@syncfusion/ej2-pptx/notes`).
 *
 * @remarks
 * Detect/read/write notes slide body text and create/associate a notesSlide part
 * without pulling notes authoring into the core bundle. Importing this entry
 * registers feature id {@link NOTES_FEATURE_ID}. Core continues to preserve
 * notesSlide / notesMaster parts and relationships when this module is absent.
 *
 * Callers pass {@link PackagePartAccess} from
 * `Presentation.packagePartAccess()` so body mutations and create
 * (part / rel / content-type) write through live package maps before save (core
 * flush covers presentation + slides only).
 *
 * **Security:** never executes notes content; never fetches external resources;
 * notes XML uses the same package/XML/shape limits as slides; create enforces
 * `entryCount` / `relationshipsPerPart`.
 *
 * Citation: `docs/specs/016-notes-slides.md`; Transitional `pml.xsd` `CT_NotesSlide`.
 *
 * Authoring (req/spec `043`, TASK-1107 / TASK-1108):
 * - `notes.addNumberedParagraph(text)` appends a numbered (`a:buAutoNum
 *   type="arabicPeriod"`) paragraph to the body placeholder.
 * - `slide.removeNotesSlide()` removes the slide →
 *   notesSlide relationship and deletes an unshared notes part + Override.
 *   No-op when absent. Never deletes notesMaster parts.
 *
 * @packageDocumentation
 */
import { registerFeature } from '../../core/registry/feature-registry';
import { NOTES_FEATURE_ID, NOTES_MASTER_CONTENT_TYPE, NOTES_MASTER_REL_TYPE, NOTES_SLIDE_CONTENT_TYPE,
    NOTES_SLIDE_REL_TYPE } from './constants';
import { NotesError } from './errors';
import { ensureNotes } from './ensure-notes';
import { getNotes } from './get-notes';
import { NotesSlide, NotesMutationOptions } from './notes-slide';
import { removeNotesSlide } from './remove-notes';
import { addNotesSlide } from './attach-notes';
registerFeature({ id: NOTES_FEATURE_ID });
export { NOTES_FEATURE_ID, NOTES_MASTER_CONTENT_TYPE, NOTES_MASTER_REL_TYPE, NOTES_SLIDE_CONTENT_TYPE,
    NOTES_SLIDE_REL_TYPE, NotesSlide, NotesMutationOptions, addNotesSlide, ensureNotes, getNotes, removeNotesSlide, NotesError };
export { NotesMaster, HandoutMaster, getHandoutMaster, HANDOUT_MASTER_CONTENT_TYPE, HANDOUT_MASTER_REL_TYPE } from './notes-masters';
