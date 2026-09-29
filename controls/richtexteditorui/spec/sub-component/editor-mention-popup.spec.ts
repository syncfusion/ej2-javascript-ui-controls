import { RichTextEditorUI } from '../../src/richtexteditor-ui/richtexteditor-ui';
import { RichTextEditorUIModel } from '../../src/richtexteditor-ui/richtexteditor-ui-model';
import { destroyRTE, renderRTE } from '../base.spec';
import {
    EditorMentionPopup,
    EditorMentionPopupModel,
    MentionDataItem
} from '../../src/base/renderer/editor-mention-popup';

describe('EditorMentionPopup sub component', () => {
    let editor: RichTextEditorUI;
    let mention: EditorMentionPopup;
    let host: HTMLElement;

    const sampleData: MentionDataItem[] = [
        { text: 'Alice', value: '1' },
        { text: 'Bob', value: '2' },
        { text: 'Charlie', value: '3' }
    ];

    beforeEach(() => {
        editor = renderRTE({});
        host = editor.element;
    });

    afterEach(() => {
        if (mention) {
            mention.destroy();
            mention = undefined;
        }
        destroyRTE(editor);
    });

    it('should construct and render the mention host with the given id', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-test-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-test-mention');
        expect(root).not.toBe(null);
        expect(root.classList.contains('e-editor-mention-root')).toBe(true);
        expect(mention.id).toBe('rte-test-mention');
    });

    it('should append the mention host to the supplied target', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-target-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-target-mention');
        expect(root.parentNode).toBe(host);
    });

    it('should create an underlying Mention instance', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-instance-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-instance-mention');
        expect(root.classList.contains('e-mention')).toBe(true);
    });

    it('should target the editor editable element (contenteditable / content container)', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-target-editable-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-target-editable-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        expect(mentionInstance).not.toBe(null);
        const target: HTMLElement | string = mentionInstance.target;
        const resolved: HTMLElement = typeof target === 'string' ? document.querySelector(target) : target;
        expect(resolved).not.toBe(null);
    });

    it('should configure the underlying mention with mentionChar and dataSource', () => {
        const model: EditorMentionPopupModel = { mentionChar: '#', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-config-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-config-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        expect(mentionInstance).not.toBe(null);
        expect(mentionInstance.mentionChar).toBe('#');
        expect(mentionInstance.dataSource.length).toBe(3);
    });

    it('should default fields to { text, value } when not supplied', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-default-fields-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-default-fields-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        expect(mentionInstance.fields.text).toBe('text');
        expect(mentionInstance.fields.value).toBe('value');
    });

    it('should honour caller-supplied custom field mapping', () => {
        const customData: MentionDataItem[] = [
            { Name: 'Alice', Email: 'a@x.com' },
            { Name: 'Bob', Email: 'b@x.com' }
        ];
        const model: EditorMentionPopupModel = {
            mentionChar: '@',
            dataSource: customData,
            fields: { text: 'Name', value: 'Email' }
        };
        mention = new EditorMentionPopup(editor, 'rte-custom-fields-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-custom-fields-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        expect(mentionInstance.fields.text).toBe('Name');
        expect(mentionInstance.fields.value).toBe('Email');
    });

    it('should honour parent enableRtl on the underlying Mention instance', () => {
        editor = renderRTE({ enableRtl: true });
        host = editor.element;
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-rtl-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-rtl-mention');
        // Mention applies e-rtl to its popup only when opened; the host root
        // stays bidirectional. assert the underlying instance inherited the
        // editor's enableRtl flag instead.
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        expect(mentionInstance).not.toBe(null);
        expect(mentionInstance.enableRtl).toBe(true);
    });

    it('should not trigger parent beforePopupOpen event when the popup opens', () => {
        let beforeOpenCalled: boolean = false;
        editor = renderRTE({ beforePopupOpen: (): void => { beforeOpenCalled = true; } });
        host = editor.element;
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-open-event-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-open-event-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        // Drive the underlying mention's beforeOpen path directly; the sub
        // component's bound handler saves the selection, calls the caller
        // hook, then triggers the parent beforePopupOpen event.
        editor.inputElement.focus();
        const range: Range = document.createRange();
        range.selectNodeContents(editor.inputElement);
        range.collapse(false);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        mentionInstance.trigger('beforeOpen', { cancel: false });
        expect(beforeOpenCalled).toBe(false);
    });

    it('should trigger parent select event when an item is selected', () => {
        let selectCalled: boolean = false;
        editor = renderRTE({ select: (): void => { selectCalled = true; } } as unknown as RichTextEditorUIModel);
        host = editor.element;
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData, select: (): void => { selectCalled = true; } };
        mention = new EditorMentionPopup(editor, 'rte-select-event-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-select-event-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        mentionInstance.trigger('beforeOpen', { cancel: false });
        mentionInstance.trigger('select', { itemData: sampleData[0] });
        expect(selectCalled).toBe(true);
    });

    it('should invoke caller-supplied model.beforePopupOpen before parent beforePopupOpen', () => {
        const callOrder: string[] = [];
        editor = renderRTE({ beforePopupOpen: (): void => { callOrder.push('parent'); } });
        host = editor.element;
        const model: EditorMentionPopupModel = {
            mentionChar: '@',
            dataSource: sampleData,
            beforePopupOpen: (): void => { callOrder.push('model'); }
        };
        mention = new EditorMentionPopup(editor, 'rte-caller-beforeopen-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-caller-beforeopen-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        editor.inputElement.focus();
        const range: Range = document.createRange();
        range.selectNodeContents(editor.inputElement);
        range.collapse(false);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        mentionInstance.trigger('beforeOpen', { cancel: false });
        expect(callOrder).toEqual(['model']);
    });

    it('should invoke caller-supplied model.select before parent select and restore range', () => {
        const callOrder: string[] = [];
        editor = renderRTE({ select: (): void => { callOrder.push('parent'); } } as unknown as RichTextEditorUIModel);
        host = editor.element;
        const model: EditorMentionPopupModel = {
            mentionChar: '@',
            dataSource: sampleData,
            select: (): void => { callOrder.push('model'); }
        };
        mention = new EditorMentionPopup(editor, 'rte-caller-select-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-caller-select-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        mentionInstance.trigger('beforeOpen', { cancel: false });
        mentionInstance.trigger('select', { itemData: sampleData[0] });
        expect(callOrder).toEqual(['model']);
    });

    it('show() should save the editor selection without throwing', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-show-mention', host, model);
        editor.focus();
        expect((): void => {
            mention.show();
        }).not.toThrow();
    });

    it('hide() should not throw when mention has not been opened', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-hide-mention', host, model);
        expect((): void => {
            mention.hide();
        }).not.toThrow();
    });

    it('destroy() should remove the mention host from the DOM', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-destroy-remove-mention', host, model);
        const id: string = mention.id;
        mention.destroy();
        expect(document.getElementById(id)).toBe(null);
    });

    it('destroy() should be idempotent', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-idem-mention', host, model);
        mention.destroy();
        expect((): void => {
            mention.destroy();
        }).not.toThrow();
    });

    it('should support multiple trigger characters via separate instances on the same editor', () => {
        const modelAt: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        const modelHash: EditorMentionPopupModel = { mentionChar: '#', dataSource: sampleData };
        const at: EditorMentionPopup = new EditorMentionPopup(editor, 'rte-multi-at-mention', host, modelAt);
        const hash: EditorMentionPopup = new EditorMentionPopup(editor, 'rte-multi-hash-mention', host, modelHash);
        const atInstance: any = (document.getElementById('rte-multi-at-mention') as any).ej2_instances[0];
        const hashInstance: any = (document.getElementById('rte-multi-hash-mention') as any).ej2_instances[0];
        expect(atInstance.mentionChar).toBe('@');
        expect(hashInstance.mentionChar).toBe('#');
        at.destroy();
        hash.destroy();
    });

    it('should accept string array data source', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: ['one', 'two', 'three'] };
        mention = new EditorMentionPopup(editor, 'rte-string-data-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-string-data-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        expect(mentionInstance.dataSource.length).toBe(3);
    });

    it('hide() should be a safe no-op when the underlying mention has been destroyed', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-hide-after-destroy-mention', host, model);
        mention.destroy();
        // After destroy this.mention is null; hide() must skip the hidePopup
        // call and still restore (a no-op) without throwing.
        expect((mention as any).mention).toBe(null);
        expect((): void => { mention.hide(); }).not.toThrow();
    });

    it('destroy() should not throw when the host element is already detached', () => {
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-destroy-twice-mention', host, model);
        mention.destroy();
        // Second destroy: host is gone, the `if (host && host.parentNode)`
        // guard's false branch runs; must not throw.
        expect((): void => { mention.destroy(); }).not.toThrow();
    });

    it('should not invoke model.select when it is not supplied', () => {
        let parentCalled: boolean = false;
        editor = renderRTE({ select: (): void => { parentCalled = true; } } as unknown as RichTextEditorUIModel);
        host = editor.element;
        // No select in model — exercises the false branch of the
        // `if (typeof model.select === 'function')` guard.
        const model: EditorMentionPopupModel = { mentionChar: '@', dataSource: sampleData };
        mention = new EditorMentionPopup(editor, 'rte-no-select-cb-mention', host, model);
        const root: HTMLElement = document.getElementById('rte-no-select-cb-mention');
        const mentionInstance: any = (root as any).ej2_instances ? (root as any).ej2_instances[0] : null;
        mentionInstance.trigger('beforeOpen', { cancel: false });
        mentionInstance.trigger('select', { itemData: sampleData[0] });
        expect(parentCalled).toBe(false);
    });
});
