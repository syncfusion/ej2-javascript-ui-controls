import { createElement, detach, extend, getUniqueID } from '@syncfusion/ej2-base';
import { RichTextEditorUI } from '../src/richtexteditor-ui/richtexteditor-ui';
import { RichTextEditorUIModel } from '../src/richtexteditor-ui/richtexteditor-ui-model';
import { SlashCommand } from '../src/base/renderer/index';
// eslint-disable-next-line jsdoc/require-jsdoc
export function renderRTE(options: RichTextEditorUIModel): RichTextEditorUI {
    const element: HTMLElement = createElement('div', { id: getUniqueID('rte-test') });
    element.dataset.rteUnitTesting = 'true';
    document.body.appendChild(element);
    extend(options, options, { saveInterval: 0 });
    RichTextEditorUI.Inject(SlashCommand);
    const editor: RichTextEditorUI = new RichTextEditorUI(options);
    editor.appendTo(element);
    return editor;
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function destroyRTE(editor: RichTextEditorUI): void {
    editor.destroy();
    detach(editor.element);
}
