/**
 * Notes authoring entry: {@link addNotesSlide}.
 *
 * @remarks
 * API-RULES R6.2: `Slide.addNotesSlide()` is a thin core wrapper over
 * {@link addNotesSlide} — same structure as `Slide.addChart` / `Slide.addTable`
 * (static feature import; no runtime prototype patching or registry).
 *
 * @packageDocumentation
 */
import { Presentation } from '../../core/package/presentation';
import { Slide } from '../../core/slideimplementation/slide';
import { NotesError } from './errors';
import { ensureNotes } from './ensure-notes';
import { NotesSlide } from './notes-slide';

/**
 * Returns the notes slide for `slide`, creating the notesSlide part when absent.
 *
 * @param {Slide} slide - Host slide bound to a presentation.
 * @returns {NotesSlide} Existing or newly associated notes slide.
 *
 * @remarks
 * Idempotent: a second call returns the same notes slide. Does not rename slide
 * parts or renumber shape ids. Body text is authored through the notes text body.
 * Also available as `slide.addNotesSlide()`.
 *
 * @throws {NotesError} The slide is not bound to a presentation.
 * @public
 */
export function addNotesSlide(slide: Slide): NotesSlide {
    const document: Presentation = slide.getPresentation();
    if (document === undefined) {
        throw new NotesError('Cannot add a notes slide before the slide is bound to a presentation', {
            partName: slide.partName
        });
    }
    return ensureNotes(slide, document.packagePartAccess(), { autoPersist: true });
}
