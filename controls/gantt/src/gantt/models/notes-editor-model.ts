/**
 * Settings supported by the lightweight Gantt Notes editor.
 */
export interface NotesEditorModel {
    enabled?: boolean;
    enableRtl?: boolean;
    enableHtmlSanitizer?: boolean;
    height?: string | number;
    locale?: string;
    placeholder?: string;
    value?: string;
    toolbarLabels?: NotesToolbarLabelsModel;
    toolbarSettings?: NotesToolbarSettingsModel;
}

/**
 * Toolbar settings supported by the lightweight Gantt Notes editor.
 */
export interface NotesToolbarSettingsModel {
    items?: string[];
}

/**
 * Localized labels used by the lightweight Gantt Notes editor.
 */
export interface NotesToolbarLabelsModel {
    toolbar?: string;
    Bold?: string;
    Italic?: string;
    Underline?: string;
    OrderedList?: string;
    UnorderedList?: string;
    CreateLink?: string;
    FontName?: string;
    FontSize?: string;
    FontColor?: string;
    BackgroundColor?: string;
    LinkHeader?: string;
    LinkUrl?: string;
    LinkText?: string;
    LinkTitle?: string;
    LinkOpenInNewWindow?: string;
    LinkAriaLabel?: string;
    Insert?: string;
    Cancel?: string;
    OpenLink?: string;
    EditLink?: string;
    RemoveLink?: string;
}
