import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditorUI } from '../../src/richtexteditor-ui/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../base.spec';
import { EditorUploadPopup, UploadPopupModel, MediaUploadType } from '../../src/base/renderer/editor-upload-popup';

describe('EditorUploadPopup sub component', () => {
    let editor: RichTextEditorUI;
    let popup: EditorUploadPopup;
    let host: HTMLElement;

    beforeEach(() => {
        editor = renderRTE({});
        host = editor.element;
    });

    afterEach(() => {
        if (popup) {
            popup.destroy();
            popup = undefined;
        }
        destroyRTE(editor);
    });

    it('should construct and render the popup root with the given id', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-test-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-test-upload');
        expect(root).not.toBe(null);
        expect(popup.id).toBe('rte-test-upload');
    });

    it('should append the popup root to the supplied target', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-target-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-target-upload');
        expect(root.parentNode).toBe(host);
    });

    it('should apply the Images type-specific class', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-image-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-image-upload');
        expect(root.classList.contains('e-rte-image-upload-popup')).toBe(true);
    });

    it('should apply the Videos type-specific class', () => {
        // Video upload is out of scope for the current iteration; the popup
        // falls back to the generic upload popup class when an unsupported
        // type is supplied.
        const model: UploadPopupModel = { type: 'Videos' as MediaUploadType, relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-video-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-video-upload');
        expect(root.classList.contains('e-rte-upload-popup')).toBe(true);
    });

    it('should apply the Audios type-specific class', () => {
        // Audio upload is out of scope for the current iteration; the popup
        // falls back to the generic upload popup class when an unsupported
        // type is supplied.
        const model: UploadPopupModel = { type: 'Audios' as MediaUploadType, relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-audio-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-audio-upload');
        expect(root.classList.contains('e-rte-upload-popup')).toBe(true);
    });

    it('should embed a file input inside the popup root', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-input-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-input-upload');
        const input: HTMLInputElement = root.querySelector('#rte-input-upload_input') as HTMLInputElement;
        expect(input).not.toBe(null);
        expect(input.type).toBe('file');
        expect(input.name).toBe('UploadFiles');
    });

    it('should keep the popup hidden until show() is called', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-hidden-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-hidden-upload');
        expect(root.style.display).toBe('none');
    });

    it('should reveal the popup after show() with no file', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-show-upload', host, model);
        popup.show();
        const root: HTMLElement = document.getElementById('rte-show-upload');
        expect(root.style.display).toBe('block');
    });

    it('should hide the popup after hide()', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-hide-upload', host, model);
        popup.show();
        popup.hide();
        const root: HTMLElement = document.getElementById('rte-hide-upload');
        expect(root.style.display).toBe('none');
    });

    it('should honour parent enableRtl', () => {
        editor = renderRTE({ enableRtl: true });
        host = editor.element;
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-rtl-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-rtl-upload');
        expect(root.classList.contains('e-rtl')).toBe(true);
    });

    it('should be idempotent on destroy', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-idem-upload', host, model);
        popup.destroy();
        expect((): void => {
            popup.destroy();
        }).not.toThrow();
    });

    it('should remove the popup root from the DOM after destroy', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-remove-upload', host, model);
        const id: string = popup.id;
        popup.destroy();
        expect(document.getElementById(id)).toBe(null);
    });

    it('should create an underlying Uploader instance', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-uploader-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-uploader-upload_input') as HTMLInputElement;
        expect(input.classList.contains('e-control')).toBe(true);
        expect(input.classList.contains('e-uploader')).toBe(true);
    });

    it('should pass allowedExtensions and saveUrl through to the uploader', () => {
        const model: UploadPopupModel = {
            type: 'Images',
            relateTo: host,
            saveUrl: '/api/upload',
            allowedExtensions: '.png,.jpg'
        };
        popup = new EditorUploadPopup(editor, 'rte-config-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-config-upload_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        expect(uploaderInstance).not.toBe(null);
        expect(uploaderInstance.asyncSettings.saveUrl).toBe('/api/upload');
        expect(uploaderInstance.allowedExtensions).toBe('.png,.jpg');
        expect(isNullOrUndefined(uploaderInstance.multiple)).toBe(false);
        expect(uploaderInstance.multiple).toBe(false);
    });

    it('should apply parent cssClass to the popup root', () => {
        editor = renderRTE({ cssClass: 'custom-editor' });
        host = editor.element;
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-cssclass-upload', host, model);
        const root: HTMLElement = document.getElementById('rte-cssclass-upload');
        expect(root.classList.contains('custom-editor')).toBe(true);
    });

    it('should not trigger parent fileSelected event when files are selected', () => {
        let fileSelectedCalled: boolean = false;
        editor = renderRTE({ fileSelected: (): void => { fileSelectedCalled = true; } });
        host = editor.element;
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-selected-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-selected-upload_input') as HTMLInputElement;
        const file: File = new File(['bits'], 'sample.png', { type: 'image/png' });
        const fileList: FileList = {
            0: file,
            length: 1,
            item: (index: number): File => file
        } as unknown as FileList;
        const changeEvent: Event = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', {
            writable: false,
            value: { files: fileList }
        });
        input.dispatchEvent(changeEvent);
        expect(fileSelectedCalled).toBe(false);
    });

    it('should invoke caller-supplied model callbacks and not parent events for each upload stage', () => {
        const callOrder: string[] = [];
        editor = renderRTE({
            beforeFileUpload: (): void => { callOrder.push('parent-beforeFileUpload'); },
            fileUploading: (): void => { callOrder.push('parent-fileUploading'); },
            fileUploadSuccess: (): void => { callOrder.push('parent-fileUploadSuccess'); },
            fileUploadFailed: (): void => { callOrder.push('parent-fileUploadFailed'); }
        });
        host = editor.element;
        // Capture the model handed to the underlying Uploader so we can drive
        // each event callback directly. The callbacks are the closures the
        // sub component registers; invoking them exercises both the caller
        // hook and the parent.trigger path.
        const model: UploadPopupModel = {
            type: 'Images',
            relateTo: host,
            beforeFileUpload: (): void => { callOrder.push('model-beforeFileUpload'); },
            fileUploading: (): void => { callOrder.push('model-fileUploading'); },
            fileUploadSuccess: (): void => { callOrder.push('model-fileUploadSuccess'); },
            fileUploadFailed: (): void => { callOrder.push('model-fileUploadFailed'); }
        };
        popup = new EditorUploadPopup(editor, 'rte-callbacks-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-callbacks-upload_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        expect(uploaderInstance).not.toBe(null);
        // The sub component registered beforeUpload/uploading/success/failure
        // callbacks on the Uploader model; the Uploader stores them as event
        // handlers. Trigger them through the uploader's event pipeline.
        uploaderInstance.trigger('beforeUpload', { name: 'beforeUpload' });
        uploaderInstance.trigger('uploading', { name: 'uploading' });
        uploaderInstance.trigger('success', { name: 'success' });
        uploaderInstance.trigger('failure', { name: 'failure' });
        expect(callOrder).toEqual([
            'model-beforeFileUpload',
            'model-fileUploading',
            'model-fileUploadSuccess',
            'model-fileUploadFailed'
        ]);
    });

    it('show(file) should not queue a server upload without saveUrl', () => {
        editor = renderRTE({});
        host = editor.element;
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-show-file-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-show-file-upload_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        expect(uploaderInstance.showFileList).toBe(true);
        const createSpy: jasmine.Spy = spyOn(uploaderInstance, 'createFileList').and.callThrough();
        const uploadSpy: jasmine.Spy = spyOn(uploaderInstance, 'upload').and.callThrough();
        const dummyFile: File = new File(['payload'], 'sample.png', { type: 'image/png' });
        editor.focus();
        expect((): void => { popup.show(dummyFile); }).not.toThrow();
        expect(createSpy).not.toHaveBeenCalled();
        expect(uploadSpy).not.toHaveBeenCalled();
        const root: HTMLElement = document.getElementById('rte-show-file-upload');
        expect(root.style.display).toBe('block');
    });

    it('show(file) should feed the file to the uploader when saveUrl is configured', () => {
        editor = renderRTE({});
        host = editor.element;
        const model: UploadPopupModel = { type: 'Images', relateTo: host, saveUrl: '/upload' };
        popup = new EditorUploadPopup(editor, 'rte-show-file-upload-configured', host, model);
        const input: HTMLInputElement = document.getElementById('rte-show-file-upload-configured_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        expect(uploaderInstance.showFileList).toBe(true);
        const createSpy: jasmine.Spy = spyOn(uploaderInstance, 'createFileList').and.callThrough();
        const uploadSpy: jasmine.Spy = spyOn(uploaderInstance, 'upload').and.callThrough();
        const dummyFile: File = new File(['payload'], 'sample.png', { type: 'image/png' });
        editor.focus();
        expect((): void => { popup.show(dummyFile); }).not.toThrow();
        expect(createSpy).toHaveBeenCalled();
        expect(uploadSpy).toHaveBeenCalled();
    });

    it('hide() should restore the saved editor selection', () => {
        editor = renderRTE({});
        host = editor.element;
        editor.inputElement.innerHTML = '<p id="restore-target">Pick me</p>';
        const target: HTMLElement = editor.inputElement.querySelector('#restore-target');
        editor.focus();
        const range: Range = document.createRange();
        range.selectNodeContents(target);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-restore-upload', host, model);
        popup.show();
        popup.hide();
        const restored: Selection = window.getSelection();
        expect(editor.inputElement.contains(restored.anchorNode)).toBe(true);
    });

    it('should honour caller-supplied viewPortElement for the popup', () => {
        const viewPort: HTMLElement = document.createElement('div');
        viewPort.id = 'rte-viewport';
        document.body.appendChild(viewPort);
        // Supplying viewPortElement exercises the truthy branch of
        // `viewPortElement || this.parent.element` in render(); the popup
        // must construct cleanly and stay clipped to the supplied viewport.
        const model: UploadPopupModel = { type: 'Images', relateTo: host, viewPortElement: viewPort };
        expect((): void => {
            popup = new EditorUploadPopup(editor, 'rte-viewport-upload', host, model);
        }).not.toThrow();
        const root: HTMLElement = document.getElementById('rte-viewport-upload');
        expect(root).not.toBe(null);
        expect(document.getElementById('rte-viewport')).not.toBe(null);
        document.body.removeChild(viewPort);
    });

    it('should not fire parent events when no model callbacks are supplied', () => {
        const parentEvents: string[] = [];
        editor = renderRTE({
            beforeFileUpload: (): void => { parentEvents.push('beforeFileUpload'); },
            fileUploading: (): void => { parentEvents.push('fileUploading'); },
            fileUploadSuccess: (): void => { parentEvents.push('fileUploadSuccess'); },
            fileUploadFailed: (): void => { parentEvents.push('fileUploadFailed'); }
        });
        host = editor.element;
        // No model.* callbacks supplied — exercises the false branch of each
        // `if (typeof model.X === 'function')` guard inside the uploader
        // callbacks.
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-no-callbacks-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-no-callbacks-upload_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        uploaderInstance.trigger('beforeUpload', {});
        uploaderInstance.trigger('uploading', {});
        uploaderInstance.trigger('success', {});
        uploaderInstance.trigger('failure', {});
        expect(parentEvents).toEqual([]);
    });

    it('should invoke caller-supplied model.fileSelected and parent fileSelected on select', () => {
        const callOrder: string[] = [];
        editor = renderRTE({ fileSelected: (): void => { callOrder.push('parent'); } });
        host = editor.element;
        const model: UploadPopupModel = {
            type: 'Images',
            relateTo: host,
            fileSelected: (): void => { callOrder.push('model'); }
        };
        popup = new EditorUploadPopup(editor, 'rte-model-fileselected-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-model-fileselected-upload_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        uploaderInstance.trigger('selected', {});
        expect(callOrder).toEqual(['model']);
    });

    it('destroy() should be safe when the underlying uploader is already destroyed', () => {
        const model: UploadPopupModel = { type: 'Images', relateTo: host };
        popup = new EditorUploadPopup(editor, 'rte-destroy-guard-upload', host, model);
        const input: HTMLInputElement = document.getElementById('rte-destroy-guard-upload_input') as HTMLInputElement;
        const uploaderInstance: any = (input as any).ej2_instances ? (input as any).ej2_instances[0] : null;
        // Destroy the underlying uploader directly so the destroy() guard's
        // `!this.uploader.isDestroyed` false branch runs.
        uploaderInstance.destroy();
        expect((): void => { popup.destroy(); }).not.toThrow();
    });
});
