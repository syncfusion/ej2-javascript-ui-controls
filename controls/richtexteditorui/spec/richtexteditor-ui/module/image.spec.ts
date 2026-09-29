import { createElement, detach } from '@syncfusion/ej2-base';
import { destroyRTE, renderRTE } from '../../../spec/base.spec';
import { RichTextEditorUI } from '../../../src/richtexteditor-ui/richtexteditor-ui';
import { ImageModule } from '../../../src/richtexteditor-ui/module/image';
import { EditorUploadPopup } from '../../../src/base/renderer/editor-upload-popup';
import { ImageSettings } from '../../../src/richtexteditor-ui/model/image-settings';
import { ImageSettingsModel } from '../../../src/richtexteditor-ui/model/image-settings-model';
import { BeforeFileUploadEventArgs } from '../../../src/common/interface';

interface FailureEventArgs {
    subType: string;
    message?: string;
}

interface ImageCommands {
    insertImage: jasmine.Spy;
    updateImage: jasmine.Spy;
    removeImage: jasmine.Spy;
    setImageAlign: jasmine.Spy;
    setImageWrap: jasmine.Spy;
    setImageDisplay: jasmine.Spy;
    setImageDimension: jasmine.Spy;
}

describe('ImageModule', () => {

    describe('ImageModule and ImageFormats', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ toolbarSettings: { items: ['Image'] } });
        });

        afterEach(() => {
            if (editor) {
                destroyRTE(editor);
            }
        });

        it('exposes the image module and toolbar entry point', () => {
            expect(editor.imageModule.getModuleName()).toBe('image');
            expect(typeof editor.openImageDialog).toBe('function');
        });

        it('lazily renders the image dialog, drop area, uploader, and URL input', () => {
            editor.openImageDialog();

            expect(document.querySelector('.e-rte-ui-img-dialog')).not.toBeNull();
            expect(document.querySelector('.e-rte-ui-img-dialog .e-img-uploadwrap.e-droparea')).not.toBeNull();
            expect(document.querySelector('.e-rte-ui-img-dialog .e-browsebtn')).not.toBeNull();
            expect(document.querySelector('.e-rte-ui-img-dialog input[type="file"]')).not.toBeNull();
            expect(document.querySelector('.e-rte-ui-img-dialog .e-img-url')).not.toBeNull();
            expect(document.querySelector('.e-rte-ui-img-dialog .e-primary button, .e-rte-ui-img-dialog .e-primary')).not.toBeNull();
        });

        it('keeps opening the image dialog idempotent', () => {
            editor.openImageDialog();
            const dialogCount: number = editor.element.querySelectorAll('.e-rte-ui-img-dialog').length;
            expect(() => { editor.openImageDialog(); }).not.toThrow();
            expect(editor.element.querySelectorAll('.e-rte-ui-img-dialog').length).toBe(dialogCount);
        });

        it('defines the built-in Image toolbar item command', () => {
            const builtIn: { command: string; iconCss: string } = {
                command: 'image', iconCss: 'e-icons e-image'
            };
            expect(builtIn.command).toBe('image');
            expect(builtIn.iconCss).toContain('e-image');
        });

        it('inserts a URL through the image command when Insert is clicked', () => {
            editor.openImageDialog();
            const urlInput: HTMLInputElement = document.querySelector('.e-rte-ui-img-dialog .e-img-url') as HTMLInputElement;
            urlInput.value = 'https://example.com/image.png';
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));

            const module: { commitSelection: () => void } = editor.imageModule as unknown as { commitSelection: () => void };
            module.commitSelection();

            expect(editor.inputElement.querySelector('img')?.getAttribute('src')).toBe('https://example.com/image.png');
        });

        it('enables Insert only when the image URL is non-empty', () => {
            editor.openImageDialog();
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-img-dialog') as HTMLElement;
            const urlInput: HTMLInputElement = dialog.querySelector('.e-img-url') as HTMLInputElement;
            const imageDialog: { getButtons?: () => { disabled: boolean }[] } =
                (editor.imageModule as unknown as { dialog: { getButtons?: () => { disabled: boolean }[] } }).dialog;

            expect(imageDialog.getButtons && imageDialog.getButtons()[0].disabled).toBe(true);
            urlInput.value = '   ';
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            expect(imageDialog.getButtons && imageDialog.getButtons()[0].disabled).toBe(true);
            urlInput.value = 'https://example.com/image.png';
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            expect(imageDialog.getButtons && imageDialog.getButtons()[0].disabled).toBe(false);
            urlInput.value = '';
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            expect(imageDialog.getButtons && imageDialog.getButtons()[0].disabled).toBe(true);
        });

        it('does not mutate the editor content while opening the dialog', () => {
            const before: string = editor.inputElement.innerHTML;
            editor.openImageDialog();
            expect(editor.inputElement.innerHTML).toBe(before);
        });

        it('keeps image settings defaults and accepts configured values', () => {
            const settings: ImageSettingsModel = editor.imageSettings;
            expect(settings.allowedTypes).toEqual(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']);
            expect(settings.maxFileSize).toBe(30000000);
            expect(settings.uploadUrl).toBeNull();
            expect(settings.removeUrl).toBeNull();
            expect(settings.saveFormat).toBe('Blob');
            expect(settings.display).toBe('inline');
            expect(settings.resize).toBe(true);
            expect(settings.dimension.width).toBe('auto');
            expect(settings.dimension.height).toBe('auto');

            const configured: RichTextEditorUI = renderRTE({
                imageSettings: {
                    allowedTypes: ['.png'],
                    maxFileSize: 1024,
                    uploadUrl: '/upload',
                    removeUrl: '/remove',
                    imageUrl: '/images/',
                    display: 'break'
                }
            });
            expect(configured.imageSettings.allowedTypes).toEqual(['.png']);
            expect(configured.imageSettings.maxFileSize).toBe(1024);
            expect(configured.imageSettings.uploadUrl).toBe('/upload');
            expect(configured.imageSettings.display).toBe('break');
            destroyRTE(configured);
        });

        it('uses ImageSettings as a ChildProperty model', () => {
            expect(Object.getPrototypeOf(ImageSettings)).toBeDefined();
            expect((ImageSettings as unknown as { prototype: object }).prototype).toBeDefined();
        });

        it('fires fileUploadFailed for missing upload configuration', (done: DoneFn) => {
            const trigger: jasmine.Spy = spyOn(editor, 'trigger').and.callThrough();
            editor.uploadFile('image/png', new Blob(['image']));
            const args: FailureEventArgs = trigger.calls.mostRecent().args[1] as FailureEventArgs;
            expect(trigger.calls.mostRecent().args[0]).toBe('fileUploadFailed');
            expect(args.subType).toBe('Image');
            expect(args.message).toContain('uploadUrl');
            done();
        });

        it('validates image type and size before forwarding an upload', () => {
            editor.imageSettings.uploadUrl = '/upload';
            editor.imageSettings.allowedTypes = ['.png'];
            editor.imageSettings.maxFileSize = 1;
            const failures: string[] = [];
            const trigger: jasmine.Spy = spyOn(editor, 'trigger').and.callThrough();

            editor.uploadFile('text/plain', new Blob(['image']));
            editor.uploadFile('image/png', new Blob(['image']));
            trigger.calls.allArgs().forEach((call: unknown[]): void => {
                if (call[0] === 'fileUploadFailed') {
                    failures.push(((call[1] as FailureEventArgs).message) || '');
                }
            });

            expect(failures[0]).toContain('Image type not allowed');
            expect(failures[1]).toContain('exceeds');
        });

        it('normalizes MIME types and raises beforeFileUpload on a valid upload', () => {
            editor.imageSettings.uploadUrl = '/upload';
            editor.imageSettings.allowedTypes = ['.png'];
            const beforeUpload: BeforeFileUploadEventArgs[] = [];
            const trigger: jasmine.Spy = spyOn(editor, 'trigger').and.callThrough();
            spyOn(editor.imageModule, 'uploadFileShow');

            editor.uploadFile('image/png', new Blob(['image']));
            trigger.calls.allArgs().forEach((call: unknown[]): void => {
                if (call[0] === 'beforeFileUpload') {
                    beforeUpload.push(call[1] as BeforeFileUploadEventArgs);
                }
            });

            expect(beforeUpload.length).toBe(1);
            expect(beforeUpload[0].subType).toBe('Image');
            expect(editor.imageModule.uploadFileShow).toHaveBeenCalledTimes(1);
        });

        it('routes image commands through ImageFormats to the headless command surface', () => {
            const core: { editor: { commands: ImageCommands } } = (editor as unknown as {
                baseEditorCore: { editor: { commands: ImageCommands } }
            }).baseEditorCore;
            const originalCommands: ImageCommands = core.editor.commands;
            const commands: ImageCommands = {
                insertImage: jasmine.createSpy('insertImage').and.callFake(originalCommands.insertImage),
                updateImage: jasmine.createSpy('updateImage').and.callFake(originalCommands.updateImage),
                removeImage: jasmine.createSpy('removeImage').and.callFake(originalCommands.removeImage),
                setImageAlign: jasmine.createSpy('setImageAlign').and.callFake(originalCommands.setImageAlign),
                setImageWrap: jasmine.createSpy('setImageWrap').and.callFake(originalCommands.setImageWrap),
                setImageDisplay: jasmine.createSpy('setImageDisplay').and.callFake(originalCommands.setImageDisplay),
                setImageDimension: jasmine.createSpy('setImageDimension').and.callFake(originalCommands.setImageDimension)
            };
            core.editor.commands = commands;

            editor.editorController.execute('imageInsert', { src: 'one.png', display: 'inline' });
            editor.editorController.execute('imageUpdate', { alt: 'updated' });
            editor.editorController.execute('removeImage');
            editor.editorController.execute('setAlignImage', { value: 'center' });
            editor.editorController.execute('setWrapTextImage', { value: 'right' });
            editor.editorController.execute('breakImage');
            editor.editorController.execute('dimensionImage', { width: 120, height: null });

            expect(commands.insertImage).toHaveBeenCalledWith({ src: 'one.png', display: 'inline' });
            expect(commands.updateImage).toHaveBeenCalledWith({ alt: 'updated' });
            expect(commands.removeImage).toHaveBeenCalled();
            expect(commands.setImageAlign).toHaveBeenCalledWith({ align: 'center' });
            expect(commands.setImageWrap).toHaveBeenCalledWith({ wrap: 'right' });
            expect(commands.setImageDisplay).toHaveBeenCalledWith({ mode: 'block' });
            expect(commands.setImageDimension).toHaveBeenCalledWith({ width: 120, height: null });
        });

        it('routes image attribute commands through updateImage', () => {
            const core: { editor: { commands: ImageCommands } } = (editor as unknown as {
                baseEditorCore: { editor: { commands: ImageCommands } }
            }).baseEditorCore;
            const original: ImageCommands = core.editor.commands;
            const updateImage: jasmine.Spy = jasmine.createSpy('updateImage').and.callFake(original.updateImage);
            core.editor.commands = {
                insertImage: original.insertImage,
                updateImage: updateImage,
                removeImage: original.removeImage,
                setImageAlign: original.setImageAlign,
                setImageWrap: original.setImageWrap,
                setImageDisplay: original.setImageDisplay,
                setImageDimension: original.setImageDimension
            };

            editor.editorController.execute('altText', { alt: 'Updated description' });
            editor.editorController.execute('replaceImage', { src: 'replacement.png' });
            editor.editorController.execute('imageUpdate', { title: 'Title', width: 120, height: 80 });

            expect(updateImage).toHaveBeenCalledWith({ alt: 'Updated description' });
            expect(updateImage).toHaveBeenCalledWith({ src: 'replacement.png' });
            expect(updateImage).toHaveBeenCalledWith({ title: 'Title', width: 120, height: 80 });
        });

        it('routes display commands and ignores invalid image format values', () => {
            const core: { editor: { commands: ImageCommands } } = (editor as unknown as {
                baseEditorCore: { editor: { commands: ImageCommands } }
            }).baseEditorCore;
            const original: ImageCommands = core.editor.commands;
            const display: jasmine.Spy = jasmine.createSpy('setImageDisplay').and.callFake(original.setImageDisplay);
            const align: jasmine.Spy = jasmine.createSpy('setImageAlign').and.callFake(original.setImageAlign);
            const wrap: jasmine.Spy = jasmine.createSpy('setImageWrap').and.callFake(original.setImageWrap);
            core.editor.commands = {
                insertImage: original.insertImage,
                updateImage: original.updateImage,
                removeImage: original.removeImage,
                setImageAlign: align,
                setImageWrap: wrap,
                setImageDisplay: display,
                setImageDimension: original.setImageDimension
            };

            editor.editorController.execute('displayImage', { mode: 'inline' });
            editor.editorController.execute('inlineImage');
            editor.editorController.execute('breakImage');
            editor.editorController.execute('setAlignImage', { value: 'center' });
            editor.editorController.execute('setAlignImage', { value: 'invalid' });
            editor.editorController.execute('setWrapTextImage', { value: 'right' });
            editor.editorController.execute('setWrapTextImage', { value: 'invalid' });

            expect(display).toHaveBeenCalledWith({ mode: 'inline' });
            expect(display).toHaveBeenCalledWith({ mode: 'block' });
            expect(display).toHaveBeenCalledTimes(3);
            expect(align).toHaveBeenCalledWith({ align: 'center' });
            expect(align).toHaveBeenCalledTimes(1);
            expect(wrap).toHaveBeenCalledWith({ wrap: 'right' });
            expect(wrap).toHaveBeenCalledTimes(1);
        });

        it('does not dispatch caption or unknown image commands', () => {
            const core: { editor: { commands: ImageCommands } } = (editor as unknown as {
                baseEditorCore: { editor: { commands: ImageCommands } }
            }).baseEditorCore;
            const commands: ImageCommands = core.editor.commands;
            const spies: jasmine.Spy[] = [
                spyOn(commands, 'insertImage').and.stub(),
                spyOn(commands, 'updateImage').and.stub(),
                spyOn(commands, 'removeImage').and.stub(),
                spyOn(commands, 'setImageAlign').and.stub(),
                spyOn(commands, 'setImageWrap').and.stub(),
                spyOn(commands, 'setImageDisplay').and.stub(),
                spyOn(commands, 'setImageDimension').and.stub()
            ];

            editor.editorController.execute('caption');
            editor.editorController.execute('unknownImageCommand' as never);

            spies.forEach((spy: jasmine.Spy): void => {
                expect(spy).not.toHaveBeenCalled();
            });
        });

        it('does not throw when a headless image command is unavailable', () => {
            const core: { editor: { commands: ImageCommands } } = (editor as unknown as {
                baseEditorCore: { editor: { commands: ImageCommands } }
            }).baseEditorCore;
            core.editor.commands = {} as ImageCommands;

            expect((): void => {
                editor.editorController.execute('imageInsert', { src: 'image.png' });
                editor.editorController.execute('removeImage');
                editor.editorController.execute('dimensionImage', { width: 100 });
            }).not.toThrow();
        });

        it('opens the image quick toolbar and replace dialog for a selected image', () => {
            editor.imageModule.executeQuickToolbarAction('replaceImage');
            expect(document.querySelector('.e-rte-ui-image-replace-dialog .e-img-uploadwrap.e-droparea')).not.toBeNull();
            expect(document.querySelector('.e-rte-ui-image-replace-dialog input[type="file"]')).not.toBeNull();
        });

        it('routes quick toolbar layout and removal actions through the controller', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.callThrough();

            editor.imageModule.executeQuickToolbarAction('setAlignImage', { attribute: 'alignImage', value: 'left' });
            editor.imageModule.executeQuickToolbarAction('setWrapTextImage', { attribute: 'wrapTextImage', value: 'right' });
            editor.imageModule.executeQuickToolbarAction('breakImage');
            editor.imageModule.executeQuickToolbarAction('inlineImage');
            editor.imageModule.executeQuickToolbarAction('removeImage');

            expect(execute).toHaveBeenCalledWith('setAlignImage', { attribute: 'alignImage', value: 'left' });
            expect(execute).toHaveBeenCalledWith('setWrapTextImage', { attribute: 'wrapTextImage', value: 'right' });
            expect(execute).toHaveBeenCalledWith('breakImage', undefined);
            expect(execute).toHaveBeenCalledWith('inlineImage', undefined);
            expect(execute).toHaveBeenCalledWith('removeImage', undefined);
        });

        it('opens the alternative text dialog without a selected image', () => {
            editor.imageModule.executeQuickToolbarAction('altText');
            expect(document.querySelector('.e-rte-ui-image-alt-dialog .e-img-altwrap')).not.toBeNull();
        });

        it('prefills and updates the selected image alternative text', () => {
            const image: HTMLImageElement = document.createElement('img');
            image.setAttribute('alt', 'Image');
            editor.inputElement.appendChild(image);
            editor.imageModule.setSelectedImage(image);
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();

            editor.imageModule.executeQuickToolbarAction('altText');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-alt-dialog') as HTMLElement;
            const input: HTMLInputElement = dialog.querySelector('.e-img-alt') as HTMLInputElement;
            expect(input.value).toBe('Image');
            input.value = 'Updated description';
            const update: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /update/i.test(button.textContent || '')) as HTMLElement;
            update.click();

            expect(execute).toHaveBeenCalledWith('altText', { alt: 'Updated description' });
        });

        it('does not dispatch an update for empty alternative text', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('altText');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-alt-dialog') as HTMLElement;
            const input: HTMLInputElement = dialog.querySelector('.e-img-alt') as HTMLInputElement;
            input.value = '   ';
            const update: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /update/i.test(button.textContent || '')) as HTMLElement;
            update.click();

            expect(execute).not.toHaveBeenCalledWith('altText', jasmine.anything());
        });

        it('exposes typed upload popup setters', () => {
            const host: HTMLElement = createElement('div', { id: 'rte-image-popup-test' });
            document.body.appendChild(host);
            const popup: EditorUploadPopup = new EditorUploadPopup(editor, 'rte-image-popup_test', host, {
                type: 'Images', relateTo: host, viewPortElement: host, saveUrl: '', removeUrl: '',
                allowedExtensions: '.png', maxFileSize: 1024
            });
            popup.saveUrl = '/upload';
            popup.removeUrl = '/remove';
            popup.allowedExtensions = '.png,.jpg';
            popup.maxFileSize = 4096;
            expect(popup.saveUrl).toBe('/upload');
            expect(popup.removeUrl).toBe('/remove');
            expect(popup.allowedExtensions).toBe('.png,.jpg');
            expect(popup.maxFileSize).toBe(4096);
            popup.destroy();
            detach(host);
        });
    });

    describe('ImageModule quick toolbar', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            RichTextEditorUI.Inject(ImageModule);
            editor = renderRTE({
                value: '<p><img src="image.png" alt="Image"></p>',
                valueFormat: 'html',
                quickToolbarSettings: {
                    enable: true,
                    image: ['AltText', 'Caption', 'Align', 'Display', 'WrapText', 'Dimension', 'Replace', 'Remove']
                }
            });
        });
        afterEach(() => {
            if (editor) {
                destroyRTE(editor);
                editor = null;
            }
        });

        it('changes the image AltText through the quick toolbar', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('altText');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-alt-dialog') as HTMLElement;
            const input: HTMLInputElement = dialog.querySelector('.e-img-alt') as HTMLInputElement;
            const update: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /update/i.test(button.textContent || '')) as HTMLElement;
            input.value = 'Updated image description';
            update.click();

            expect(execute).toHaveBeenCalledWith('altText', { alt: 'Updated image description' });
        });

        it('cancels the AltText dialog without dispatching an update', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('altText');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-alt-dialog') as HTMLElement;
            const input: HTMLInputElement = dialog.querySelector('.e-img-alt') as HTMLInputElement;
            const cancel: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /cancel/i.test(button.textContent || '')) as HTMLElement;
            input.value = 'Cancelled image description';
            cancel.click();

            expect(execute).not.toHaveBeenCalledWith('altText', jasmine.anything());
            expect(document.querySelector('.e-rte-ui-image-alt-dialog')).toBeNull();
        });

        it('dispatches the Caption option command', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('caption');
            expect(execute).toHaveBeenCalledWith('caption', undefined);
        });

        it('dispatches the Align option with the selected alignment', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            const value: { attribute: string; value: string } = {
                attribute: 'alignImage', value: 'center'
            };
            editor.imageModule.executeQuickToolbarAction('setAlignImage', value);
            expect(execute).toHaveBeenCalledWith('setAlignImage', value);
        });

        it('dispatches both Display option modes', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('inlineImage');
            editor.imageModule.executeQuickToolbarAction('breakImage');
            expect(execute).toHaveBeenCalledWith('inlineImage', undefined);
            expect(execute).toHaveBeenCalledWith('breakImage', undefined);
        });

        it('dispatches the WrapText option with the selected wrap mode', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            const value: { attribute: string; value: string } = {
                attribute: 'wrapTextImage', value: 'right'
            };
            editor.imageModule.executeQuickToolbarAction('setWrapTextImage', value);
            expect(execute).toHaveBeenCalledWith('setWrapTextImage', value);
        });

        it('changes the image dimensions through the quick toolbar', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('dimensionImage');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-dimension-dialog') as HTMLElement;
            const width: HTMLInputElement = dialog.querySelector('.e-img-width') as HTMLInputElement;
            const height: HTMLInputElement = dialog.querySelector('.e-img-height') as HTMLInputElement;
            const update: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /update/i.test(button.textContent || '')) as HTMLElement;
            width.value = '320';
            height.value = '180';
            update.click();

            expect(execute).toHaveBeenCalledWith('dimensionImage', { width: 320, height: 180 });
        });

        it('cancels the Dimension dialog without dispatching an update', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('dimensionImage');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-dimension-dialog') as HTMLElement;
            const width: HTMLInputElement = dialog.querySelector('.e-img-width') as HTMLInputElement;
            const height: HTMLInputElement = dialog.querySelector('.e-img-height') as HTMLInputElement;
            const cancel: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /cancel/i.test(button.textContent || '')) as HTMLElement;
            width.value = '640';
            height.value = '360';
            cancel.click();

            expect(execute).not.toHaveBeenCalledWith('dimensionImage', jasmine.anything());
            expect(document.querySelector('.e-rte-ui-image-dimension-dialog')).toBeNull();
        });

        it('does not dispatch invalid image dimensions', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('dimensionImage');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-dimension-dialog') as HTMLElement;
            const width: HTMLInputElement = dialog.querySelector('.e-img-width') as HTMLInputElement;
            const height: HTMLInputElement = dialog.querySelector('.e-img-height') as HTMLInputElement;
            width.value = 'not-a-number';
            height.value = '100';
            const update: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /update/i.test(button.textContent || '')) as HTMLElement;
            update.click();

            expect(execute).not.toHaveBeenCalledWith('dimensionImage', jasmine.anything());
        });

        it('replaces the image through the quick toolbar', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('replaceImage');
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-replace-dialog') as HTMLElement;
            const url: HTMLInputElement = dialog.querySelector('.e-img-url') as HTMLInputElement;
            url.value = 'https://example.com/replacement.png';
            url.dispatchEvent(new Event('input', { bubbles: true }));
            (editor.imageModule as unknown as { commitReplace: (src: string) => void })
                .commitReplace(url.value);

            expect(execute).toHaveBeenCalledWith('replaceImage', { src: 'https://example.com/replacement.png' });
        });

        it('removes the image through the quick toolbar', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            editor.imageModule.executeQuickToolbarAction('removeImage');

            expect(execute).toHaveBeenCalledWith('removeImage', undefined);
        });
    });

    describe('Image insert and quick toolbar dialog actions', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                value: '<p><img src="image.png" alt="Image"></p>',
                valueFormat: 'html',
                toolbarSettings: { items: ['Image'] },
                quickToolbarSettings: {
                    enable: true,
                    image: ['Replace']
                }
            });
        });

        afterEach(() => {
            if (editor) {
                destroyRTE(editor);
                editor = null;
            }
        });

        /**
         * Opens the Replace dialog by clicking the image quick-toolbar option.
         *
         * @returns {void}
         */
        function clickQuickToolbarReplace(): void {
            editor.imageModule.executeQuickToolbarAction('replaceImage');
        }

        it('inserts an image when the Insert button is clicked', () => {
            editor.openImageDialog();
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-img-dialog') as HTMLElement;
            const url: HTMLInputElement = dialog.querySelector('.e-img-url') as HTMLInputElement;
            url.value = 'https://example.com/inserted.png';
            url.dispatchEvent(new Event('input', { bubbles: true }));
            (editor.imageModule as unknown as { commitSelection: () => void }).commitSelection();

            expect(editor.inputElement.querySelector('img[src="https://example.com/inserted.png"]')).not.toBeNull();
        });

        it('cancels the Insert Image dialog without changing the editor content', () => {
            const before: string = editor.inputElement.innerHTML;
            editor.openImageDialog();
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-img-dialog') as HTMLElement;
            const url: HTMLInputElement = dialog.querySelector('.e-img-url') as HTMLInputElement;
            const cancel: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /cancel/i.test(button.textContent || '')) as HTMLElement;
            url.value = 'https://example.com/cancelled.png';
            cancel.click();

            expect(document.querySelector('.e-rte-ui-img-dialog')).toBeNull();
            expect(editor.inputElement.innerHTML).toBe(before);
        });

        it('updates the image when the Replace quick-toolbar option and Update button are clicked', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            clickQuickToolbarReplace();
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-replace-dialog') as HTMLElement;
            const url: HTMLInputElement = dialog.querySelector('.e-img-url') as HTMLInputElement;
            url.value = 'https://example.com/updated.png';
            url.dispatchEvent(new Event('input', { bubbles: true }));
            (editor.imageModule as unknown as { commitReplace: (src: string) => void })
                .commitReplace(url.value);

            expect(execute).toHaveBeenCalledWith('replaceImage', { src: 'https://example.com/updated.png' });
        });

        it('cancels the Replace quick-toolbar dialog without dispatching an update', () => {
            const execute: jasmine.Spy = spyOn(editor.editorController, 'execute').and.stub();
            clickQuickToolbarReplace();
            const dialog: HTMLElement = document.querySelector('.e-rte-ui-image-replace-dialog') as HTMLElement;
            const cancel: HTMLElement = Array.from(dialog.querySelectorAll('button'))
                .find((button: HTMLElement): boolean => /cancel/i.test(button.textContent || '')) as HTMLElement;
            cancel.click();

            expect(execute).not.toHaveBeenCalledWith('replaceImage', jasmine.anything());
            expect(document.querySelector('.e-rte-ui-image-replace-dialog')).toBeNull();
        });
    });

    describe('Image upload with uploadUrl configured', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                imageSettings: {
                    uploadUrl: '/upload',
                    imageUrl: '/images/'
                }
            });
        });

        afterEach(() => {
            if (editor) {
                destroyRTE(editor);
                editor = null;
            }
        });

        it('uploads an image when uploadUrl and imageUrl are configured', () => {
            const uploadFileShow: jasmine.Spy = spyOn(editor.imageModule, 'uploadFileShow').and.stub();

            editor.uploadFile('image/png', new Blob(['image'], { type: 'image/png' }));

            expect(uploadFileShow).toHaveBeenCalledTimes(1);
            expect(editor.imageSettings.uploadUrl).toBe('/upload');
            expect(editor.imageSettings.imageUrl).toBe('/images/');
        });

        it('uploads an image when uploadUrl is configured without imageUrl', () => {
            editor = renderRTE({
                imageSettings: {
                    uploadUrl: '/upload'
                }
            });
            const uploadFileShow: jasmine.Spy = spyOn(editor.imageModule, 'uploadFileShow').and.stub();

            editor.uploadFile('image/png', new Blob(['image'], { type: 'image/png' }));

            expect(uploadFileShow).toHaveBeenCalledTimes(1);
            expect(editor.imageSettings.uploadUrl).toBe('/upload');
            expect(editor.imageSettings.imageUrl).toBeNull();
        });
    });

    describe('Image upload without uploadUrl configured', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            RichTextEditorUI.Inject(ImageModule);
        });

        afterEach(() => {
            if (editor) {
                destroyRTE(editor);
                editor = null;
            }
        });

        it('reports a missing uploadUrl even when imageUrl is configured', () => {
            editor = renderRTE({
                imageSettings: {
                    imageUrl: '/images/'
                }
            });
            const trigger: jasmine.Spy = spyOn(editor, 'trigger').and.callThrough();

            editor.uploadFile('image/png', new Blob(['image'], { type: 'image/png' }));

            const failure: FailureEventArgs = trigger.calls.allArgs()
                .find((call: unknown[]): boolean => call[0] === 'fileUploadFailed')[1] as FailureEventArgs;
            expect(failure.message).toContain('uploadUrl');
            expect(editor.imageSettings.imageUrl).toBe('/images/');
        });

        it('reports a missing uploadUrl when imageUrl is not configured', () => {
            editor = renderRTE({});
            const trigger: jasmine.Spy = spyOn(editor, 'trigger').and.callThrough();

            editor.uploadFile('image/png', new Blob(['image'], { type: 'image/png' }));

            const failure: FailureEventArgs = trigger.calls.allArgs()
                .find((call: unknown[]): boolean => call[0] === 'fileUploadFailed')[1] as FailureEventArgs;
            expect(failure.message).toContain('uploadUrl');
            expect(editor.imageSettings.imageUrl).toBeNull();
        });
    });

    describe('Image selection and resize', () => {
        let resizeEditor: RichTextEditorUI;

        beforeEach(() => {
            resizeEditor = renderRTE({
                value: '<p><img src="image.png" alt="Image"></p>',
                valueFormat: 'html',
                imageSettings: { resize: true },
                quickToolbarSettings: { enable: true, image: ['Dimension'] }
            });
        });

        afterEach(() => {
            if (resizeEditor) {
                destroyRTE(resizeEditor);
                resizeEditor = null;
            }
        });

        it('selects the image and initializes the image quick toolbar for resizing', () => {
            const image: HTMLImageElement = resizeEditor.inputElement.querySelector('img') as HTMLImageElement;
            resizeEditor.imageModule.setSelectedImage(image);
            expect(image.classList.contains('e-rte-ui-image-selected')).toBe(true);
        });
    });

    describe('ensureUploadPopup', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                imageSettings: {
                    allowedTypes: ['.png'],
                    maxFileSize: 2048,
                    uploadUrl: '/upload',
                    removeUrl: '/remove'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('creates the upload popup with the configured file constraints', () => {
            const module: {
                ensureUploadPopup: (id: string, relateTo: HTMLElement) => void;
                uploadPopup: EditorUploadPopup | null;
            } = editor.imageModule as unknown as {
                ensureUploadPopup: (id: string, relateTo: HTMLElement) => void;
                uploadPopup: EditorUploadPopup | null;
            };

            module.ensureUploadPopup('image-popup-test', editor.inputElement);

            expect(module.uploadPopup).not.toBeNull();
            expect(module.uploadPopup && module.uploadPopup.allowedExtensions).toBe('.png');
            expect(module.uploadPopup && module.uploadPopup.maxFileSize).toBe(2048);
            expect(module.uploadPopup && module.uploadPopup.saveUrl).toBe('/upload');
            expect(module.uploadPopup && module.uploadPopup.removeUrl).toBe('/remove');
        });

        it('synchronizes an existing upload popup after settings change', () => {
            const module: {
                ensureUploadPopup: (id: string, relateTo: HTMLElement) => void;
                uploadPopup: EditorUploadPopup | null;
            } = editor.imageModule as unknown as {
                ensureUploadPopup: (id: string, relateTo: HTMLElement) => void;
                uploadPopup: EditorUploadPopup | null;
            };
            module.ensureUploadPopup('image-popup-test', editor.inputElement);
            const original: EditorUploadPopup | null = module.uploadPopup;
            editor.imageSettings.allowedTypes = ['.jpg', '.gif'];
            editor.imageSettings.maxFileSize = 4096;
            editor.imageSettings.uploadUrl = '/new-upload';
            editor.imageSettings.removeUrl = '/new-remove';

            module.ensureUploadPopup('image-popup-test', editor.inputElement);

            expect(module.uploadPopup).toBe(original);
            expect(module.uploadPopup && module.uploadPopup.allowedExtensions).toBe('.jpg,.gif');
            expect(module.uploadPopup && module.uploadPopup.maxFileSize).toBe(4096);
            expect(module.uploadPopup && module.uploadPopup.saveUrl).toBe('/new-upload');
            expect(module.uploadPopup && module.uploadPopup.removeUrl).toBe('/new-remove');
        });
    });

    describe('handleUploadSuccess', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                imageSettings: {
                    imageUrl: '/images/'
                }
            });
            editor.openImageDialog();
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('stages the image URL returned from a successful upload', () => {
            const module: {
                handleUploadSuccess: (args: unknown) => void;
                pending: { url: string; alt: string } | null;
            } = editor.imageModule as unknown as {
                handleUploadSuccess: (args: unknown) => void;
                pending: { url: string; alt: string } | null;
            };

            module.handleUploadSuccess({
                file: {
                    name: 'uploaded-image.png',
                    type: 'image/png',
                    size: 12,
                    fileSource: 'https://cdn.example.com/uploaded-image.png'
                },
                operation: 'upload'
            });

            expect(module.pending).not.toBeNull();
            expect(module.pending && module.pending.url).toBe('/images/uploaded-image.png');
            expect(module.pending && module.pending.alt).toBe('uploaded-image');
        });

        it('raises fileUploadFailed when a successful upload has no usable source', () => {
            const trigger: jasmine.Spy = spyOn(editor, 'trigger').and.callThrough();
            const module: { handleUploadSuccess: (args: unknown) => void } = editor.imageModule as unknown as {
                handleUploadSuccess: (args: unknown) => void;
            };

            editor.imageSettings.imageUrl = null;
            module.handleUploadSuccess({
                file: { name: 'uploaded-image.png', type: 'image/png', size: 12, fileSource: '' },
                operation: 'upload'
            });

            const failure: unknown[] | undefined = trigger.calls.allArgs()
                .find((call: unknown[]): boolean => call[0] === 'fileUploadFailed');
            expect(failure).toBeDefined();
            expect((failure && failure[1] as FailureEventArgs).message).toContain('imageUrl');
        });
    });

    describe('stageFile', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ imageSettings: { saveFormat: 'Base64' } });
            editor.openImageDialog();
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('stages a selected file as a Base64 image and inserts it', (done: DoneFn) => {
            const module: {
                stageFile: (file: unknown) => void;
                pending: { url: string; alt: string } | null;
                commitSelection: () => void;
            } = editor.imageModule as unknown as {
                stageFile: (file: unknown) => void;
                pending: { url: string; alt: string } | null;
                commitSelection: () => void;
            };
            module.stageFile({
                name: 'photo.png',
                type: 'image/png',
                size: 5,
                rawFile: new Blob(['image'], { type: 'image/png' })
            });

            setTimeout(() => {
                expect(module.pending).not.toBeNull();
                expect(module.pending && module.pending.url).toContain('data:image/png');
                expect(module.pending && module.pending.alt).toBe('photo');
                module.commitSelection();
                expect(editor.inputElement.querySelector('img')).not.toBeNull();
                done();
            }, 100);
        });

        it('stages a Blob URL when Base64 mode is not configured', () => {
            editor.imageSettings.saveFormat = 'Blob';
            const createObjectUrl: jasmine.Spy = spyOn(URL, 'createObjectURL').and.returnValue('blob:image-test');
            const module: {
                stageFile: (file: unknown) => void;
                pending: { url: string } | null;
            } = editor.imageModule as unknown as {
                stageFile: (file: unknown) => void;
                pending: { url: string } | null;
            };

            module.stageFile({
                name: 'photo.png',
                type: 'image/png',
                size: 5,
                rawFile: new Blob(['image'], { type: 'image/png' })
            });

            expect(createObjectUrl).toHaveBeenCalled();
            expect(module.pending && module.pending.url).toBe('blob:image-test');
        });
    });

    describe('scheduleImageLoadActions', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('shows the image toolbar after an already-complete image is found', (done: DoneFn) => {
            const image: HTMLImageElement = document.createElement('img');
            image.src = 'image-loaded.png';
            Object.defineProperty(image, 'complete', { configurable: true, value: true });
            editor.inputElement.appendChild(image);
            const showToolbar: jasmine.Spy = spyOn(editor.quickToolbarModule, 'showImageToolbarAfterLoad').and.stub();
            const module: { scheduleImageLoadActions: (src: string) => void } = editor.imageModule as unknown as {
                scheduleImageLoadActions: (src: string) => void;
            };

            module.scheduleImageLoadActions('image-loaded.png');

            setTimeout(() => {
                expect(showToolbar).toHaveBeenCalledWith(image);
                done();
            }, 0);
        });

        it('waits for the image load event before showing the image toolbar', (done: DoneFn) => {
            const image: HTMLImageElement = document.createElement('img');
            image.src = 'image-pending.png';
            Object.defineProperty(image, 'complete', { configurable: true, value: false });
            editor.inputElement.appendChild(image);
            const showToolbar: jasmine.Spy = spyOn(editor.quickToolbarModule, 'showImageToolbarAfterLoad').and.stub();
            const module: { scheduleImageLoadActions: (src: string) => void } = editor.imageModule as unknown as {
                scheduleImageLoadActions: (src: string) => void;
            };

            module.scheduleImageLoadActions('image-pending.png');
            expect(showToolbar).not.toHaveBeenCalled();
            image.dispatchEvent(new Event('load'));
            expect(showToolbar).toHaveBeenCalledWith(image);
            done();
        });
    });

    describe('coerceDimensionPx', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('converts numeric and pixel dimensions to rounded pixels', () => {
            const module: { coerceDimensionPx: (value: unknown) => number | undefined } = editor.imageModule as unknown as {
                coerceDimensionPx: (value: unknown) => number | undefined;
            };

            expect(module.coerceDimensionPx(120.6)).toBe(121);
            expect(module.coerceDimensionPx('320px')).toBe(320);
            expect(module.coerceDimensionPx(' 180 ')).toBe(180);
        });

        it('omits unsupported, empty, and non-finite dimensions', () => {
            const module: { coerceDimensionPx: (value: unknown) => number | undefined } = editor.imageModule as unknown as {
                coerceDimensionPx: (value: unknown) => number | undefined;
            };

            expect(module.coerceDimensionPx('auto')).toBeUndefined();
            expect(module.coerceDimensionPx('100%')).toBeUndefined();
            expect(module.coerceDimensionPx('')).toBeUndefined();
            expect(module.coerceDimensionPx('not-a-size')).toBeUndefined();
            expect(module.coerceDimensionPx(Infinity)).toBeUndefined();
            expect(module.coerceDimensionPx(null)).toBeUndefined();
        });
    });

    describe('destroyModule', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
            editor.openImageDialog();
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('revokes tracked Blob URLs and removes image module resources', () => {
            const revokeObjectUrl: jasmine.Spy = spyOn(URL, 'revokeObjectURL').and.stub();
            const module: {
                blobUrls: Set<string>;
                dialog: unknown;
                uploadPopup: unknown;
                destroyModule: () => void;
            } = editor.imageModule as unknown as {
                blobUrls: Set<string>;
                dialog: unknown;
                uploadPopup: unknown;
                destroyModule: () => void;
            };
            module.blobUrls.add('blob:image-one');
            module.blobUrls.add('blob:image-two');

            module.destroyModule();

            expect(revokeObjectUrl).toHaveBeenCalledWith('blob:image-one');
            expect(revokeObjectUrl).toHaveBeenCalledWith('blob:image-two');
            expect(module.blobUrls.size).toBe(0);
            expect(module.dialog).toBeNull();
            expect(module.uploadPopup).toBeNull();
        });
    });

    describe('uploadFileShow and file upload events', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                imageSettings: {
                    uploadUrl: '/upload',
                    imageUrl: '/images/'
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
            editor = null;
        });

        it('creates an image File and shows it through the upload popup', () => {
            const uploadFileShow: jasmine.Spy = spyOn(editor.imageModule, 'uploadFileShow').and.callThrough();
            const blob: Blob = new Blob(['image'], { type: 'image/png' });

            editor.uploadFile('image/png', blob);

            expect(uploadFileShow).toHaveBeenCalledWith(blob, 'image/png');
        });

        it('triggers configured upload events through public upload scenarios', () => {
            const beforeFileUpload: jasmine.Spy = jasmine.createSpy('beforeFileUpload');
            const fileUploading: jasmine.Spy = jasmine.createSpy('fileUploading');
            const fileSelected: jasmine.Spy = jasmine.createSpy('fileSelected');
            const fileUploadSuccess: jasmine.Spy = jasmine.createSpy('fileUploadSuccess');
            const fileUploadFailed: jasmine.Spy = jasmine.createSpy('fileUploadFailed');
            const fileRemoving: jasmine.Spy = jasmine.createSpy('fileRemoving');
            const configured: RichTextEditorUI = renderRTE({
                imageSettings: { uploadUrl: '/upload', allowedTypes: ['.png'] },
                beforeFileUpload: beforeFileUpload,
                fileUploading: fileUploading,
                fileSelected: fileSelected,
                fileUploadSuccess: fileUploadSuccess,
                fileUploadFailed: fileUploadFailed,
                fileRemoving: fileRemoving
            });

            configured.uploadFile('text/plain', new Blob(['not-image'], { type: 'text/plain' }));
            configured.uploadFile('image/png', new Blob(['image'], { type: 'image/png' }));

            expect(fileUploadFailed).toHaveBeenCalled();
            expect(beforeFileUpload).toHaveBeenCalled();
            expect(fileUploading).toHaveBeenCalled();
            expect(fileSelected).not.toHaveBeenCalled();
            expect(fileUploadSuccess).not.toHaveBeenCalled();
            expect(fileRemoving).not.toHaveBeenCalled();
            destroyRTE(configured);
        });
    });

});
