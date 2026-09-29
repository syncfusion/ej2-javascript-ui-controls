import { RichTextEditor, RichTextEditorModel } from "../../src/rich-text-editor/base";
import { extend, createElement, getUniqueID } from "@syncfusion/ej2-base";
import { HtmlEditor, Toolbar, PasteCleanup, QuickToolbar } from "../../src/rich-text-editor/actions";
import { Link, Audio, Video, Image, } from "../../src/rich-text-editor/renderer";
import { WebMcpAdapter } from "../../src/rich-text-editor/integrations/webmcp-adapter";
export class BasicMediaEditor extends RichTextEditor { }
export class MediaPasteEditor extends RichTextEditor { }
export class WebMCPToolsEditor extends RichTextEditor { }

BasicMediaEditor.Inject(HtmlEditor, Toolbar, QuickToolbar, Link, Audio, Video, Image);

MediaPasteEditor.Inject(HtmlEditor, Toolbar, QuickToolbar, Link, Audio, Video, Image, PasteCleanup);

WebMCPToolsEditor.Inject(HtmlEditor, Toolbar, WebMcpAdapter);

/**
 * Renders a RichTextEditor with basic media modules (`Audio`, `Video`, `Image`) for testing.
 * Creates a DOM container, initializes the editor, and disables debounce.
 */
export function renderBasicMediaEditor(options: RichTextEditorModel): BasicMediaEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    element.dataset.rteUnitTesting = 'true';
    document.body.appendChild(element);
    extend(options, options, { saveInterval: 0 })
    let editor: BasicMediaEditor = new BasicMediaEditor(options);
    editor.appendTo(element);
    if (editor.quickToolbarModule) {
        editor.quickToolbarModule.debounceTimeout = 0;
    }
    return editor;
}

/**
 * Renders a RichTextEditor with media paste support (`PasteCleanup`) for testing.
 * Creates a DOM container, initializes the editor, and disables debounce.
 */
export function renderMediaPasteEditor(options: RichTextEditorModel): MediaPasteEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    element.dataset.rteUnitTesting = 'true';
    document.body.appendChild(element);
    extend(options, options, { saveInterval: 0 })
    let editor: MediaPasteEditor = new MediaPasteEditor(options);
    editor.appendTo(element);
    if (editor.quickToolbarModule) {
        editor.quickToolbarModule.debounceTimeout = 0;
    }
    return editor;
}

/**
 * Renders a RichTextEditor with webmcp adaptor module for testing.
 * Creates a DOM container, initializes the editor, and disables debounce.
 */
export function renderWebMCPToolsEditor(options: RichTextEditorModel): WebMCPToolsEditor {
    let element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    element.dataset.rteUnitTesting = 'true';
    document.body.appendChild(element);
    extend(options, options, { saveInterval: 0 })
    let editor: WebMCPToolsEditor = new WebMCPToolsEditor(options);
    editor.appendTo(element);
    if (editor.quickToolbarModule) {
        editor.quickToolbarModule.debounceTimeout = 0;
    }
    return editor;
}