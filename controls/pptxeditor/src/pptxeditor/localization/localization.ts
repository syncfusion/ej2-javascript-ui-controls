/**
 * Localization (L10n) support for the EJ2 PowerPoint Editor.
 *
 * Follows the Document Editor pattern: a single `defaultLocale` dictionary of
 * English strings, an `L10n` instance created with the control name
 * `pptxeditor`, and translations supplied through `L10n.load` for a culture.
 * Missing translations fall back to the English default.
 *
 * @module @syncfusion/ej2-pptxeditor/localization
 */

import { L10n } from '@syncfusion/ej2-base';

/**
 * Control name used for every `L10n` instance and locale resource section.
 * @private
 */
export const PPTX_EDITOR_L10N_NAME: string = 'pptxeditor';

/**
 * English default strings, keyed by localization key.
 * Placeholders use `{0}`, `{1}` and are filled by {@link formatLocale}.
 * @private
 */
export const DEFAULT_PPTX_LOCALE: Record<string, string> = {
    // Ribbon tabs and File menu
    File: 'File',
    Home: 'Home',
    SlideShow: 'Slide Show',
    View: 'View',
    Open: 'Open',
    Export: 'Export',
    Print: 'Print',
    // Home tab
    Clipboard: 'Clipboard',
    Copy: 'Copy',
    CopyTooltip: 'Copy (Ctrl+C)',
    ReadOnly: 'Read-only',
    FontReadOnly: 'Font \u00B7 read-only',
    Bold: 'Bold',
    Italic: 'Italic',
    Underline: 'Underline',
    Strikethrough: 'Strikethrough',
    // Slide Show tab
    StartSlideShowGroup: 'Start Slide Show',
    FromBeginning: 'From Beginning',
    FromCurrentSlide: 'From Current Slide',
    StartFromBeginningTooltip: 'Start From Beginning (F5)',
    FromCurrentSlideTooltip: 'From Current Slide (Shift+F5)',
    Presenter: 'Presenter',
    PresenterView: 'Presenter View',
    // View tab
    Show: 'Show',
    Notes: 'Notes',
    Thumbnails: 'Thumbnails',
    ShowNotes: 'Show Notes',
    HideNotes: 'Hide Notes',
    ShowThumbnails: 'Show Thumbnails',
    HideThumbnails: 'Hide Thumbnails',
    ThumbnailPanelUnavailable: 'Thumbnail panel is not available',
    Zoom: 'Zoom',
    ZoomEllipsis: 'Zoom\u2026',
    FitToWindowTitle: 'Fit to Window',
    // Zoom dialog and shared dialog buttons
    FitToWindow: 'Fit to window',
    FitToWidth: 'Fit to width',
    Percent: 'Percent',
    Cancel: 'Cancel',
    Ok: 'OK',
    // Status bar
    SlideCounter: 'Slide {0} of {1}',
    PreviousSlide: 'Previous slide',
    NextSlide: 'Next slide',
    StartSlideShow: 'Start slide show',
    ZoomOut: 'Zoom out',
    ZoomIn: 'Zoom in',
    // Notes pane
    NotesTitle: 'Notes \u00b7 Slide {0}',
    NoNotes: 'No notes available for this slide.',
    ExpandNotes: 'Expand notes',
    CollapseNotes: 'Collapse notes',
    NotesShown: 'Notes pane shown',
    NotesHidden: 'Notes pane hidden',
    // Title bar
    Present: 'Present',
    Presentation: 'Presentation',
    // Main slide and thumbnail panel
    Slide: 'Slide',
    CopyText: 'Copy Text',
    // Slide show and presenter view
    SlideShowEnd: 'End of slide show, click to exit.',
    SlideShowEndLive: 'End of slide show. Press any navigation key to exit.',
    SlideShowExitHint: 'Press Esc to exit the slide show',
    SlideShowLive: 'Slide {0}',
    PresenterViewLabel: 'Presenter view',
    ExitSlideShow: 'Exit slide show',
    CannotStartSlideShow: 'Cannot start slideshow',
    Elapsed: 'Elapsed',
    EndShow: 'End show',
    CurrentSlide: 'Current slide',
    DecreaseNotesFontSize: 'Decrease notes font size',
    IncreaseNotesFontSize: 'Increase notes font size',
    Previous: 'Previous',
    Next: 'Next',
    PauseTimer: 'Pause timer',
    ResumeTimer: 'Resume timer',
    ResetTimer: 'Reset timer',
    // Editor messages, Help dialogs
    NothingToCopy: 'Nothing to copy',
    NothingToUndo: 'Nothing to undo',
    NothingToRedo: 'Nothing to redo',
    Undo: 'Undo',
    Redo: 'Redo',
    FindNotAvailable: 'Find is not available',
    FindInPresentation: 'Find in presentation',
    FindNotAvailableYet: 'Find for "{0}" is not available yet',
    FitToWindowNotAvailable: 'Fit to Window is not available yet',
    FitToWidthNotAvailable: 'Fit Width is not available yet',
    ReadingViewActive: 'Reading View is active',
    CopiedToClipboard: 'Copied to clipboard',
    UnableToCopy: 'Unable to copy',
    // Loading overlay and errors
    Loading: 'Loading presentation',
    LoadingPercent: 'Loading presentation {0}%',
    Retry: 'Retry',
    OpenAnother: 'Open another presentation',
    LoadErrorTitle: 'Unable to open presentation',
    LoadErrorCode: 'Error code: {0}',
    LoadErrorNetwork: 'The presentation could not be downloaded. Check the network connection and try again.',
    LoadErrorCors: 'The presentation server did not allow this site to read the file.',
    LoadErrorHttp: 'The presentation server returned an error.',
    LoadErrorNotZip: 'The selected file is not a valid ZIP package.',
    LoadErrorNotPptx: 'The selected package is not a PowerPoint presentation.',
    LoadErrorCorrupt: 'The presentation is damaged or incomplete.',
    LoadErrorEncrypted: 'Password-protected presentations are not supported.',
    LoadErrorUnsupported: 'This presentation uses an unsupported format or feature.',
    LoadErrorTooLarge: 'The presentation exceeds the configured safety limits.',
    LoadErrorAborted: 'Loading was canceled.'
};

/**
 * Creates the `pptxeditor` L10n instance for a locale. Translations registered
 * with `L10n.load({ [locale]: { pptxeditor: {...} } })` are used when present;
 * every missing key falls back to {@link DEFAULT_PPTX_LOCALE}.
 *
 * @param {string} locale - Culture name such as `de` or `fr`
 * @returns {L10n} Localization instance
 * @private
 */
export function createL10n(locale: string): L10n {
    const l10n: L10n = new L10n(PPTX_EDITOR_L10N_NAME, DEFAULT_PPTX_LOCALE, locale);
    l10n.setLocale(locale);
    return l10n;
}

/**
 * Replaces `{0}`, `{1}` ... placeholders in a localized template.
 *
 * @param {string} template - Localized text
 * @param {Array<string|number>} args - Replacement values
 * @returns {string} Formatted text
 * @private
 */
export function formatLocale(template: string, ...args: Array<string | number>): string {
    return template.replace(/\{(\d+)\}/g, (match: string, index: string): string => {
        const value: string | number | undefined = args[Number(index)];
        return value === undefined ? match : String(value);
    });
}

/**
 * Returns the localized text for a key (English fallback) with placeholders filled.
 *
 * @param {string|undefined} locale - Culture name; defaults to `en-US`
 * @param {string} key - Key in {@link DEFAULT_PPTX_LOCALE}
 * @param {Array<string|number>} args - Placeholder values
 * @returns {string} Localized text
 * @private
 */
export function localize(locale: string | undefined, key: string, ...args: Array<string | number>): string {
    return formatLocale(createL10n(locale || 'en-US').getConstant(key), ...args);
}

/**
 * Escapes localized text for safe insertion into an HTML string.
 *
 * @param {string} text - Localized text
 * @returns {string} HTML-escaped text
 * @private
 */
export function escapeLocaleHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
