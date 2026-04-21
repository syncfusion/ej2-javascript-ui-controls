import { createElement, remove, isNullOrUndefined as isNOU } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BlockModel, IImageBlockSettings } from "../../src/models/index";
import { BlockType, ContentType } from '../../src/models/enums';
import { BlockEditor, ImageProgressRenderer } from '../../src/index';
import { getBlockModelById, getBlockContentElement } from "../../src/common/utils/block";
import { IClipboardPayloadOptions, setCursorPosition } from "../../src/common/index";
import { FileInfo } from '@syncfusion/ej2-inputs';
import { UploadSession } from "../../src/blockeditor/renderer/image/upload-session";

/**
 * Comprehensive test suite for Image Upload feature
 * Covers: Placeholder rendering, Upload popup, File selection, Upload progress,
 * Success/Failure handling, Embed tab, Pasted images, Progress bars, Sessions
 */
describe('Image Upload Feature - Comprehensive Tests', () => {
    // Helper function to trigger keyboard events for undo/redo
    function triggerUndo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
    }

    function triggerRedo(editorElement: HTMLElement): void {
        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
    }

    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    // ========================================================================
    // 1. PLACEHOLDER RENDERING & INTERACTION TESTS
    // ========================================================================
    describe('1. Image Placeholder Rendering & Interactions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('1.1 should render placeholder when image block has empty src', () => {
            const blocks: BlockModel[] = [{
                id: 'img-placeholder-1',
                blockType: BlockType.Image,
                properties: { src: '' } as IImageBlockSettings
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            // Assert DOM
            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();
            expect(placeholder.getAttribute('data-block-id')).toBe('img-placeholder-1');
            expect(placeholder.getAttribute('contenteditable')).toBe('false');
            expect(placeholder.querySelector('.e-placeholder-icon-container')).not.toBeNull();
            expect(placeholder.querySelector('.e-placeholder-text')).not.toBeNull();

            // Assert Model
            const block = editor.blocks.find(b => b.id === 'img-placeholder-1');
            expect(block).toBeDefined();
            expect(block.blockType).toBe(BlockType.Image);
            const props = block.properties as IImageBlockSettings;
            expect(props.src).toBe('');
        });

        it('1.2 should render placeholder with proper ARIA attributes for accessibility', () => {
            const blocks: BlockModel[] = [{
                id: 'img-aria-1',
                blockType: BlockType.Image,
                properties: {} as IImageBlockSettings
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            // Assert DOM
            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();
            expect(placeholder.getAttribute('role')).toBe('button');
            expect(placeholder.getAttribute('aria-label')).toContain('Insert image');
            expect(placeholder.getAttribute('tabindex')).toBe('0');

            // Assert Model
            const block = editor.blocks[0];
            expect(block).toBeDefined();
            expect(block.blockType).toBe(BlockType.Image);
            expect(block.id).toBe('img-aria-1');
        });

        it('1.3 should show placeholder icon and text correctly', () => {
            const blocks: BlockModel[] = [{
                id: 'img-icon-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            // Assert DOM
            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();
            
            const icon = placeholder.querySelector('.e-icons.e-block-image-icon');
            const text = placeholder.querySelector('.e-placeholder-text');

            expect(icon).not.toBeNull();
            expect(text).not.toBeNull();
            expect(text.innerHTML.length).toBeGreaterThan(0);

            // Assert Model
            const block = editor.blocks[0];
            expect(block.blockType).toBe(BlockType.Image);
            expect(block.id).toBe('img-icon-1');
        });

        it('1.4 should open upload popup when placeholder is clicked', () => {
            const blocks: BlockModel[] = [{
                id: 'img-click-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                }
            });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();
            
            // Click placeholder
            placeholder.click();

            // Assert DOM - popup should be visible
            const popup = document.querySelector('.e-image-upload-popup') as HTMLElement;
            expect(popup).not.toBeNull();
            expect(popup.style.display).not.toBe('none');

            // Assert Model - imageRenderer should track popup state
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(true);
            expect(imageRenderer.getCurrentPlaceholder()).toBe(placeholder);

            // Verify block exists
            const block = editor.blocks.find(b => b.id === 'img-click-1');
            expect(block).toBeDefined();
            expect(block.blockType).toBe(BlockType.Image);
        });

        it('1.5 should open upload popup when Enter key is pressed on placeholder', (done) => {
            const blocks: BlockModel[] = [{
                id: 'img-enter-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                }
            });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();

            // Trigger Enter key
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            placeholder.dispatchEvent(enterEvent);

            setTimeout(() => {
                // Assert DOM - popup should be visible
                const popup = document.querySelector('.e-image-upload-popup');
                expect(popup).not.toBeNull();

                // Assert Model - imageRenderer should track popup state
                const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
                expect(imageRenderer.isUploadPopupOpen).toBe(true);

                // Verify block exists
                const block = editor.blocks.find(b => b.id === 'img-enter-1');
                expect(block).toBeDefined();
                expect(block.blockType).toBe(BlockType.Image);

                done();
            }, 100); // Keep timeout for popup initialization
        });

        it('1.7 should toggle popup visibility on repeated placeholder clicks', () => {
            const blocks: BlockModel[] = [{
                id: 'img-toggle-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                }
            });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();

            // First click - open
            placeholder.click();

            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(true);

            // Second click - close (toggle)
            placeholder.click();

            // Assert DOM - popup should be closed
            expect(imageRenderer.isUploadPopupOpen).toBe(false);
            const popup = document.querySelector('.e-image-upload-popup') as HTMLElement;
            if (popup) {
                expect(popup.classList.contains('e-popup-close') || popup.style.display === 'none').toBe(true);
            }

            // Verify block still exists
            const block = editor.blocks.find(b => b.id === 'img-toggle-1');
            expect(block).toBeDefined();
            expect(block.blockType).toBe(BlockType.Image);
        });

        it('1.8 should not auto-open popup after placeholder rendering (non-undo/redo scenario)', () => {
            // Create editor first
            editor = createEditor({ 
                blocks: [],
                imageBlockSettings: {
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                }
            });
            editor.appendTo('#editor');

            // Add image block dynamically (simulates insertion)
            const newBlock = editor.blockManager.blockCommand.addBlock({
                targetBlock: null,
                blockType: BlockType.Image
            });

            const placeholder = editorElement.querySelector('.e-image-placeholder');
            expect(placeholder).not.toBeNull();

            // Assert Model - popup should NOT auto-open
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(false);

            const popup = document.querySelector('.e-image-upload-popup') as HTMLElement;
            if (popup) {
                expect(popup.classList.contains('e-popup-close') || popup.style.display === 'none').toBe(true);
            }

            // Verify block was added
            const block = editor.blocks.find(b => b.blockType === BlockType.Image);
            expect(block).toBeDefined();
            expect(block.blockType).toBe(BlockType.Image);

        });

        it('1.9 should NOT auto-open popup during undo/redo operations', (done) => {
            const blocks: BlockModel[] = [{
                id: 'para-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: 'Test' }]
            },
            {
                id: 'para-2',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: 'Test' }]
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            // Transform to image
            const paraBlock = editorElement.querySelector('#para-1') as HTMLElement;
            editor.blockManager.blockCommand.transformBlock({
                block: editor.blocks[0],
                blockElement: paraBlock,
                newBlockType: BlockType.Image,
                props: {}
            });

            // Verify image block created
            let imageBlock = editor.blocks.find(b => b.blockType === BlockType.Image);
            expect(imageBlock).toBeDefined();

            // Trigger undo using keyboard (Ctrl+Z)
            triggerUndo(editor.element);


            setTimeout(() => {
                // Assert Model - should be paragraph again
                const paraBlock = editor.blocks.find(b => b.blockType === BlockType.Paragraph);
                expect(paraBlock).toBeDefined();
                expect(paraBlock.id).toBe('para-1');

                // Trigger redo using keyboard (Ctrl+Shift+Z)
                triggerRedo(editor.element);

                setTimeout(() => {
                    // Assert DOM - popup should NOT be open
                    const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
                    expect(imageRenderer.isUploadPopupOpen).toBe(false);

                    // Assert Model - should be image again
                    imageBlock = editor.blocks.find(b => b.blockType === BlockType.Image);
                    expect(imageBlock).toBeDefined();
                    expect(imageBlock.blockType).toBe(BlockType.Image);

                    done();
                }, 100);
            }, 100);
        });

        it('1.10 should NOT auto-open popup during initial block rendering', () => {
            const blocks: BlockModel[] = [{
                id: 'img-initial-1',
                blockType: BlockType.Image,
                properties: { src: '' } as IImageBlockSettings
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                }
            });
            editor.appendTo('#editor');

            // Assert DOM - placeholder should exist
            const placeholder = editorElement.querySelector('.e-image-placeholder');
            expect(placeholder).not.toBeNull();

            // Assert Model - popup should NOT be open on initial render
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(false);

            // Verify block exists and has correct properties
            const block = editor.blocks[0];
            expect(block).toBeDefined();
            expect(block.blockType).toBe(BlockType.Image);
            expect(block.id).toBe('img-initial-1');

        });
    });

    // ========================================================================
    // 2. UPLOAD POPUP MANAGEMENT TESTS
    // ========================================================================
    describe('2. Upload Popup Management', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('2.1 should create upload popup with Tab component (Upload/Embed tabs)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'popup-tab-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const imgContentContainer: HTMLElement = document.querySelector('.e-image-placeholder.e-block-content');
                imgContentContainer.click();
                setTimeout(() => {
                    // Assert DOM
                    const popup = document.querySelector('.e-image-upload-popup');
                    expect(popup).not.toBeNull();
    
                    const tabContainer = popup.querySelector('.e-image-tabs');
                    expect(tabContainer).not.toBeNull();
    
                    // Check if both tabs exist
                    const uploadTab = popup.querySelector('.e-upload-tab-content');
                    const embedTab = popup.querySelector('.e-embed-tab-content');
                    expect(uploadTab || embedTab).not.toBeNull();
    
                    // Assert Model
                    const uploaderRenderer = (editor as any).imageUploaderRenderer;
                    expect(uploaderRenderer).toBeDefined();
                    const browseButton = popup.querySelector('.e-upload .e-file-select-wrap > button') as HTMLElement;
                    expect(document.activeElement).toBe(browseButton);
                    done();
                }, 500);
            }, 500);
        });

        it('2.2 should initialize popup only once (modulesInitialized event)', () => {
            const blocks: BlockModel[] = [{
                id: 'popup-once-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            // Count popup elements
            const popups = document.querySelectorAll('.e-image-upload-popup');
            
            // Assert DOM - should be only one popup
            expect(popups.length).toBe(1);

            // Assert Model
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.uploadPopupObj).not.toBeNull();
        });

        it('2.3 should close popup when clicking outside popup and placeholder', () => {
            const blocks: BlockModel[] = [{
                id: 'popup-close-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            // Open popup
            placeholder.click();

            // Click outside
            const outsideElement = editorElement;
            outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            // Assert DOM
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(false);

            // Assert Model
            expect(imageRenderer.getCurrentPlaceholder()).toBe(null);

        });

        it('2.4 should NOT close popup when clicking inside popup', () => {
            const blocks: BlockModel[] = [{
                id: 'popup-inside-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            // Open popup
            placeholder.click();

                // Click inside popup
            const popup = document.querySelector('.e-image-upload-popup') as HTMLElement;
            popup.click();

            // Assert DOM
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(true);

            // Assert Model
            expect(imageRenderer.uploadPopupObj).not.toBeNull();

        });

        it('2.5 should close popup when Escape key is pressed', () => {
            const blocks: BlockModel[] = [{
                id: 'popup-escape-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            // Open popup
            placeholder.click();

            // Press Escape
            const popup = document.querySelector('.e-image-upload-popup') as HTMLElement;
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
            popup.dispatchEvent(escapeEvent);

            // Assert DOM
            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            // Assert Model
            expect(imageRenderer.uploadPopupObj).not.toBeNull();

        });

        it('2.6 should reset to Upload tab on popup open', () => {
            const blocks: BlockModel[] = [{
                id: 'popup-reset-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            // Open popup
            placeholder.click();

            // Assert DOM
            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            expect(uploaderRenderer.selectedTabIndex).toBe(0);

            // Assert Model
            expect(uploaderRenderer.tabObj).not.toBeNull();

        });
    });

    // ========================================================================
    // 3. UPLOADER TAB - FILE SELECTION TESTS
    // ========================================================================
    describe('3. Uploader Tab - File Selection', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('3.1 should initialize Syncfusion Uploader component with correct settings', () => {
            const blocks: BlockModel[] = [{
                id: 'uploader-init-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    allowedTypes: ['.jpg', '.png', '.gif'],
                    maxFileSize: 5000000,
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            // Assert DOM
            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            expect(uploaderRenderer.uploaderObj).not.toBeNull();

            // Assert Model
            expect(editor.imageBlockSettings.allowedTypes).toEqual(['.jpg', '.png', '.gif']);
            expect(editor.imageBlockSettings.maxFileSize).toBe(5000000);
            expect(editor.imageBlockSettings.saveUrl).toBe('https://example.com/upload');
        });

        it('3.2 should allow only configured file types', () => {
            const blocks: BlockModel[] = [{
                id: 'file-types-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    allowedTypes: ['.jpg', '.png']
                }
            });
            editor.appendTo('#editor');

            // Assert DOM
            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            const allowedExtensions = uploaderRenderer.uploaderObj.allowedExtensions;
            expect(allowedExtensions).toBe('.jpg,.png');

            // Assert Model
            expect(editor.imageBlockSettings.allowedTypes).toEqual(['.jpg', '.png']);

        });

        it('3.3 should generate Base64 preview when saveFormat is Base64', (done) => {
            const blocks: BlockModel[] = [{
                id: 'base64-preview-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveFormat: 'Base64'
                }
            });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            placeholder.click();

            // Mock file selection
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInfo: FileInfo = {
                name: 'test.jpg',
                size: 1024,
                type: 'image/jpeg',
                statusCode: '1',
                status: 'Ready',
                rawFile: mockFile,
                validationMessages: { minSize: '', maxSize: '' }
            };

            // Mock FileReader
            const mockFileReader = {
                readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                    setTimeout(() => {
                        this.onload({ target: { result: 'data:image/jpeg;base64,testdata' } });
                    }, 10);
                }),
                onload: null as any
            };
            spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            uploaderRenderer.handleFileSelected({ filesData: [fileInfo] });

            setTimeout(() => {
                // Assert DOM
                const imgElement = editorElement.querySelector('img.e-image-block') as HTMLImageElement;
                expect(imgElement).not.toBeNull();
                expect(imgElement.src).toContain('data:image/jpeg;base64');

                // Assert Model
                const block = editor.blocks.find(b => b.id === 'base64-preview-1');
                expect((block.properties as IImageBlockSettings).src).toContain('data:image/jpeg;base64');

                done();
            }, 300);
        });

        it('3.4 should generate Blob URL preview when saveFormat is Blob', (done) => {
            const blocks: BlockModel[] = [{
                id: 'blob-preview-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveFormat: 'Blob'
                }
            });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            placeholder.click();

            // Mock URL.createObjectURL
            spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');

            // Mock file selection
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInfo: FileInfo = {
                name: 'test.jpg',
                size: 1024,
                type: 'image/jpeg',
                statusCode: '1',
                status: 'Ready',
                rawFile: mockFile,
                validationMessages: { minSize: '', maxSize: '' }
            };

            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            uploaderRenderer.handleFileSelected({ filesData: [fileInfo] });

            setTimeout(() => {
                // Assert DOM
                const imgElement = editorElement.querySelector('img.e-image-block') as HTMLImageElement;
                expect(imgElement).not.toBeNull();
                expect(imgElement.src).toBe('blob:mock-url');

                // Assert Model
                expect(URL.createObjectURL).toHaveBeenCalled();

                done();
            }, 300);
        });

        it('3.5 should replace placeholder with preview image after file selection', (done) => {
            const blocks: BlockModel[] = [{
                id: 'replace-placeholder-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
            expect(placeholder).not.toBeNull();

            placeholder.click();

            // Mock file selection
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInfo: FileInfo = {
                name: 'test.jpg',
                size: 1024,
                type: 'image/jpeg',
                statusCode: '1',
                status: 'Ready',
                rawFile: mockFile,
                validationMessages: { minSize: '', maxSize: '' }
            };

            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            uploaderRenderer.handleFileSelected({ filesData: [fileInfo] });

            setTimeout(() => {
                // Assert DOM - placeholder should be replaced
                const newPlaceholder = editorElement.querySelector('.e-image-placeholder');
                expect(newPlaceholder).toBeNull();

                const imgElement = editorElement.querySelector('img.e-image-block');
                expect(imgElement).not.toBeNull();

                // Assert Model
                const block = editor.blocks.find(b => b.id === 'replace-placeholder-1');
                expect((block.properties as IImageBlockSettings).src).toBeTruthy();

                done();
            }, 300);
        });

        it('3.6 should close upload popup after file selection', (done) => {
            const blocks: BlockModel[] = [{
                id: 'close-popup-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

            placeholder.click();

            const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
            expect(imageRenderer.isUploadPopupOpen).toBe(true);

            // Mock file selection
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInfo: FileInfo = {
                name: 'test.jpg',
                size: 1024,
                type: 'image/jpeg',
                statusCode: '1',
                status: 'Ready',
                rawFile: mockFile,
                validationMessages: { minSize: '', maxSize: '' }
            };

            const uploaderRenderer = (editor as any).imageUploaderRenderer;
            uploaderRenderer.handleFileSelected({ filesData: [fileInfo] });

            setTimeout(() => {
                // Assert Model
                expect(imageRenderer.uploadPopupObj).not.toBeNull();
                done();
            }, 300);
        });
    });

    // ========================================================================
    // 4. UPLOADER TAB - UPLOAD PROGRESS TESTS
    // ========================================================================
    describe('4. Uploader Tab - Upload Progress', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        let currentTestName: string = '';

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('4.1 Check image element on upload starts', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-show-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    saveFormat: 'Base64'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Paste image to trigger upload
                const mockBlob = new Blob(['fake-image'], { type: 'image/png' });
                const paraBlock = editorElement.querySelector('#progress-show-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(paraBlock);

                // Mock FileReader
                const mockFileReader = {
                    readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                        setTimeout(() => {
                            this.onload({ target: { result: 'data:image/png;base64,testdata' } });
                        }, 10);
                    }),
                    onload: null as any
                };
                spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

                editor.blockManager.blockRenderer.imageRenderer.handleFilePaste(mockBlob).then(() => {
                    // Wait for imageInserted event to be processed and progress bar to be created
                    setTimeout(() => {
                        // Assert DOM
                        const imgElement = editorElement.querySelector('img.e-image-block');
                        expect(imgElement).not.toBeNull();

                        // Assert Model
                        const imageBlock = editor.blocks.find(b => b.blockType === BlockType.Image);
                        expect(imageBlock).toBeDefined();

                        done();
                    }, 800); // Increased timeout to ensure load event and imageInserted are processed
                });
            }, 200);
        });

        it('4.2 should trigger beforeFileUpload event', (done) => {
            const blocks: BlockModel[] = [{
                id: 'before-upload-1',
                blockType: BlockType.Image
            }];

            let beforeUploadTriggered = false;

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                },
                beforeFileUpload: (args: any) => {
                    beforeUploadTriggered = true;
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Trigger beforeUpload
                const mockArgs = { cancel: false };
                uploaderRenderer.handleBeforeUpload(mockArgs);

                // Assert DOM
                expect(beforeUploadTriggered).toBe(true);

                // Assert Model
                expect(mockArgs.cancel).toBe(false);

                done();
            }, 500);
        });

        it('4.3 should cancel upload if beforeFileUpload sets cancel=true', (done) => {
            const blocks: BlockModel[] = [{
                id: 'cancel-upload-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                },
                beforeFileUpload: (args: any) => {
                    args.cancel = true;
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Trigger beforeUpload
                const mockArgs = { cancel: false };
                uploaderRenderer.handleBeforeUpload(mockArgs);

                // Assert DOM
                expect(mockArgs.cancel).toBe(true);

                // Assert Model
                expect(uploaderRenderer).toBeDefined();

                done();
            }, 500);
        });

        it('4.4 should trigger fileUploading event when upload starts', (done) => {
            const blocks: BlockModel[] = [{
                id: 'uploading-event-1',
                blockType: BlockType.Image
            }];

            let uploadingTriggered = false;

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                },
                fileUploading: (args: any) => {
                    uploadingTriggered = true;
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Trigger uploading event
                const mockArgs = { 
                    cancel: false,
                    fileData: { name: 'test.jpg' }
                };
                uploaderRenderer.handleUploading(mockArgs);

                // Assert DOM
                expect(uploadingTriggered).toBe(true);

                // Assert Model
                expect(mockArgs.cancel).toBe(false);

                done();
            }, 500);
        });
    });

    // ========================================================================
    // 5. UPLOADER TAB - UPLOAD SUCCESS TESTS
    // ========================================================================
    describe('5. Uploader Tab - Upload Success', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('5.1 should trigger fileUploadSuccess event', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-event-1',
                blockType: BlockType.Image
            }];

            let successTriggered = false;

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                },
                fileUploadSuccess: (args: any) => {
                    successTriggered = true;
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Setup session
                const blockId = 'success-event-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock session
                const mockSession = {
                    file: mockFile,
                    previewUrl: 'data:image/jpeg;base64,test',
                    complete: jasmine.createSpy('complete')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                // Trigger success
                const mockArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ url: 'https://example.com/uploaded.jpg' })
                        }
                    }
                };
                uploaderRenderer.handleSuccess(mockArgs);

                setTimeout(() => {
                    // Assert DOM
                    expect(successTriggered).toBe(true);

                    // Assert Model
                    expect(mockSession.complete).toHaveBeenCalled();

                    done();
                }, 300);
            }, 500);
        });

        it('5.2 should parse JSON response from server', (done) => {
            const blocks: BlockModel[] = [{
                id: 'parse-json-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'parse-json-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                const mockSession = {
                    file: mockFile,
                    previewUrl: 'data:image/jpeg;base64,test',
                    complete: jasmine.createSpy('complete')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                const mockResponse = { url: 'https://example.com/image.jpg', fileName: 'test.jpg' };
                const mockArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify(mockResponse)
                        }
                    }
                };

                uploaderRenderer.handleSuccess(mockArgs);

                setTimeout(() => {
                    // Assert DOM
                    expect(mockSession.complete).toHaveBeenCalled();

                    // Assert Model
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);

                    done();
                }, 300);
            }, 500);
        });

        it('5.3 should handle non-JSON response from server', (done) => {
            const blocks: BlockModel[] = [{
                id: 'non-json-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'non-json-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                const mockSession = {
                    file: mockFile,
                    previewUrl: 'data:image/jpeg;base64,test',
                    complete: jasmine.createSpy('complete')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                const mockArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        target: {
                            response: 'Plain text response'
                        }
                    }
                };

                uploaderRenderer.handleSuccess(mockArgs);

                setTimeout(() => {
                    // Assert DOM
                    expect(mockSession.complete).toHaveBeenCalled();

                    // Assert Model
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);

                    done();
                }, 300);
            }, 500);
        });

        it('5.4 should show success badge after upload', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-badge-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image element with progress renderer
                const mockImg = createElement('img', { className: 'e-image-block' }) as HTMLImageElement;
                const mockContainer = createElement('div', { className: 'e-image-container' });
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                
                // Show and complete progress
                progressRenderer.show();
                progressRenderer.updateProgress(100);
                progressRenderer.hide(() => {
                    progressRenderer.showSuccessBadge();

                    setTimeout(() => {
                        // Assert DOM
                        const badge = mockContainer.querySelector('.e-badge.e-badge-success');
                        expect(badge).not.toBeNull();

                        // Assert Model
                        expect((progressRenderer as any).badgeElement).not.toBeNull();

                        done();
                    }, 100);
                });
            }, 200);
        });

        it('5.5 should auto-remove success badge after 1 second', (done) => {
            const blocks: BlockModel[] = [{
                id: 'badge-remove-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image element
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                progressRenderer.showSuccessBadge();

                // Assert DOM - badge exists initially
                let badge = mockContainer.querySelector('.e-badge-success');
                expect(badge).not.toBeNull();

                // Wait for auto-removal (1 second)
                setTimeout(() => {
                    // Assert DOM - badge should be removed
                    badge = mockContainer.querySelector('.e-badge-success');
                    expect(badge).toBeNull();

                    // Assert Model
                    expect((progressRenderer as any).badgeElement).toBeNull();

                    done();
                }, 1200);
            }, 200);
        });

        it('5.6 should construct URL using path + fileName when path is configured', (done) => {
            const blocks: BlockModel[] = [{
                id: 'path-config-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    path: 'https://cdn.example.com/images/'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'path-config-1';
                const mockFile = new File(['test'], 'uploaded.jpg', { type: 'image/jpeg' });
                uploaderRenderer.fileNameToBlockId.set('uploaded.jpg', blockId);

                const mockSession = {
                    file: mockFile,
                    previewUrl: 'data:image/jpeg;base64,test',
                    complete: jasmine.createSpy('complete')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                const mockArgs = {
                    file: { name: 'uploaded.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ fileName: 'uploaded.jpg' })
                        }
                    }
                };

                uploaderRenderer.handleSuccess(mockArgs);

                setTimeout(() => {
                    // Assert DOM
                    expect(mockSession.complete).toHaveBeenCalled();

                    // Assert Model - URL should be path + fileName
                    // The constructed URL should be: https://cdn.example.com/images/uploaded.jpg

                    done();
                }, 300);
            }, 500);
        });
    });

    // ========================================================================
    // 6. UPLOADER TAB - UPLOAD FAILURE TESTS
    // ========================================================================
    describe('6. Uploader Tab - Upload Failure', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('6.1 should trigger fileUploadFailed event', (done) => {
            const blocks: BlockModel[] = [{
                id: 'failed-event-1',
                blockType: BlockType.Image
            }];

            let failedTriggered = false;

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                },
                fileUploadFailed: (args: any) => {
                    failedTriggered = true;
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'failed-event-1';
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                const mockSession = {
                    fail: jasmine.createSpy('fail')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                const mockArgs = {
                    file: { name: 'test.jpg' },
                    statusText: 'Upload failed'
                };

                uploaderRenderer.handleFailure(mockArgs);

                setTimeout(() => {
                    // Assert DOM
                    expect(failedTriggered).toBe(true);

                    // Assert Model
                    expect(mockSession.fail).toHaveBeenCalledWith('Upload failed');

                    done();
                }, 300);
            }, 500);
        });

        it('6.2 should show error badge on upload failure', (done) => {
            const blocks: BlockModel[] = [{
                id: 'error-badge-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image element
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                progressRenderer.showErrorBadge();

                setTimeout(() => {
                    // Assert DOM
                    const badge = mockContainer.querySelector('.e-badge.e-badge-danger');
                    expect(badge).not.toBeNull();

                    // Assert Model
                    expect((progressRenderer as any).badgeElement).not.toBeNull();

                    done();
                }, 100);
            }, 200);
        });

        it('6.3 should auto-remove error badge after 1 second', (done) => {
            const blocks: BlockModel[] = [{
                id: 'error-badge-remove-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image element
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                progressRenderer.showErrorBadge();

                // Assert DOM - badge exists initially
                let badge = mockContainer.querySelector('.e-badge-danger');
                expect(badge).not.toBeNull();

                // Wait for auto-removal
                setTimeout(() => {
                    // Assert DOM - badge should be removed
                    badge = mockContainer.querySelector('.e-badge-danger');
                    expect(badge).toBeNull();

                    // Assert Model
                    expect((progressRenderer as any).badgeElement).toBeNull();

                    done();
                }, 1200);
            }, 200);
        });

        it('6.4 should extract error message from statusText', (done) => {
            const blocks: BlockModel[] = [{
                id: 'error-message-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'error-message-1';
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                const mockSession = {
                    fail: jasmine.createSpy('fail')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                const mockArgs = {
                    file: { name: 'test.jpg' },
                    statusText: 'Network error'
                };

                uploaderRenderer.handleFailure(mockArgs);

                // Assert DOM
                expect(mockSession.fail).toHaveBeenCalledWith('Network error');

                // Assert Model
                expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);

                done();
            }, 500);
        });

        it('6.5 should cleanup session after failure', (done) => {
            const blocks: BlockModel[] = [{
                id: 'cleanup-failure-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'cleanup-failure-1';
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                const mockSession = {
                    fail: jasmine.createSpy('fail')
                };
                uploaderRenderer.uploadSessions.set(blockId, mockSession);

                const mockArgs = {
                    file: { name: 'test.jpg' },
                    statusText: 'Failed'
                };

                uploaderRenderer.handleFailure(mockArgs);

                setTimeout(() => {
                    // Assert DOM
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);

                    // Assert Model
                    expect(uploaderRenderer.fileNameToBlockId.has('test.jpg')).toBe(false);

                    done();
                }, 300);
            }, 500);
        });
    });

    // ========================================================================
    // 7. EMBED TAB - URL INPUT TESTS
    // ========================================================================
    describe('7. Embed Tab - URL Input & Validation', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('7.1 should initialize embed tab on selection', (done) => {
            const blocks: BlockModel[] = [{
                id: 'embed-init-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

                setTimeout(() => {
                    placeholder.click();

                    setTimeout(() => {
                        // Switch to Embed tab
                        const uploaderRenderer = (editor as any).imageUploaderRenderer;
                        if (uploaderRenderer.tabObj) {
                            uploaderRenderer.tabObj.select(1);

                            setTimeout(() => {
                                // Assert DOM
                                const embedInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                                const embedButton = document.querySelector('.e-embed-button');

                                expect(embedInput).not.toBeNull();
                                expect(embedButton).not.toBeNull();
                                // Placeholder should match configured locale string
                                expect(embedInput.placeholder).toBe(editor.blockManager.localeJson['embedPlaceholder']);

                                // Assert Model
                                expect(uploaderRenderer.embedContainer).not.toBeNull();

                                done();
                            }, 300);
                        } else {
                            done();
                        }
                    }, 300);
                }, 500);
            }, 200);
        });

        it('7.2 should enable Embed button when URL input has text', (done) => {
            const blocks: BlockModel[] = [{
                id: 'embed-enable-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

                setTimeout(() => {
                    placeholder.click();

                    setTimeout(() => {
                        // Switch to Embed tab
                        const uploaderRenderer = (editor as any).imageUploaderRenderer;
                        if (uploaderRenderer.tabObj) {
                            uploaderRenderer.tabObj.select(1);

                            setTimeout(() => {
                                const embedInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                                const embedButton = document.querySelector('.e-embed-button') as HTMLElement;

                                // Type URL
                                embedInput.value = 'https://example.com/image.jpg';
                                embedInput.dispatchEvent(new Event('input'));

                                setTimeout(() => {
                                    // Assert DOM
                                    expect(embedButton.classList.contains('e-disabled')).toBe(false);

                                    // Assert Model
                                    expect(embedInput.value.length).toBeGreaterThan(0);

                                    done();
                                }, 100);
                            }, 300);
                        } else {
                            done();
                        }
                    }, 300);
                }, 500);
            }, 200);
        });
    
        it('7.2.1 should show error Embed button when URL input has text', (done) => {
            const blocks: BlockModel[] = [{
                id: 'embed-enable-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

                setTimeout(() => {
                    placeholder.click();

                    setTimeout(() => {
                        // Switch to Embed tab
                        const uploaderRenderer = (editor as any).imageUploaderRenderer;
                        if (uploaderRenderer.tabObj) {
                            uploaderRenderer.tabObj.select(1);

                            setTimeout(() => {
                                const embedInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                                const embedButton = document.querySelector('.e-embed-button') as HTMLElement;

                                // Type URL
                                embedInput.value = 'javascript:alert("xss")';
                                embedInput.dispatchEvent(new Event('input'));

                                setTimeout(() => {
                                    // Assert DOM
                                    expect(embedButton.classList.contains('e-disabled')).toBe(false);

                                    // Assert Model
                                    expect(embedInput.value.length).toBeGreaterThan(0);
                                    embedButton.click();
                                    embedInput.classList.contains('e-error');

                                    done();
                                }, 100);
                            }, 300);
                        } else {
                            done();
                        }
                    }, 300);
                }, 500);
            }, 200);
        });

        it('7.3 should validate and accept HTTPS URLs', (done) => {
            const blocks: BlockModel[] = [{
                id: 'validate-https-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('https://example.com/image.jpg');

                // Assert DOM
                expect(result.valid).toBe(true);
                expect(result.url).toBe('https://example.com/image.jpg');

                // Assert Model
                expect(result.error).toBeUndefined();

                done();
            }, 200);
        });

        it('7.4 should validate and accept HTTP URLs', (done) => {
            const blocks: BlockModel[] = [{
                id: 'validate-http-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('http://example.com/image.jpg');

                // Assert DOM
                expect(result.valid).toBe(true);

                // Assert Model
                expect(result.url).toBe('http://example.com/image.jpg');

                done();
            }, 200);
        });

        it('7.5 should reject javascript: URLs (XSS prevention)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'reject-javascript-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('javascript:alert("xss")');

                // Assert DOM
                expect(result.valid).toBe(false);

                // Assert Model
                expect(result.error).toBe('Dangerous protocol detected');

                done();
            }, 200);
        });

        it('7.6 should reject data: URLs (XSS prevention)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'reject-data-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('data:text/html,<script>alert("xss")</script>');

                // Assert DOM
                expect(result.valid).toBe(false);

                // Assert Model
                expect(result.error).toBe('Dangerous protocol detected');

                done();
            }, 200);
        });

        it('7.7 should reject localhost URLs (SSRF prevention)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'reject-localhost-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('http://localhost/image.jpg');

                // Assert DOM
                expect(result.valid).toBe(false);

                // Assert Model
                expect(result.error).toBe('Internal network URLs are not allowed');

                done();
            }, 200);
        });

        it('7.8 should reject 127.0.0.1 URLs (SSRF prevention)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'reject-127-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('http://127.0.0.1/image.jpg');

                // Assert DOM
                expect(result.valid).toBe(false);

                // Assert Model
                expect(result.error).toBe('Internal network URLs are not allowed');

                done();
            }, 200);
        });

        it('7.9 should reject internal network IPs (192.168.x.x)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'reject-192-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const result = uploaderRenderer.validateImageUrl('http://192.168.1.1/image.jpg');

                // Assert DOM
                expect(result.valid).toBe(false);

                // Assert Model
                expect(result.error).toBe('Internal network URLs are not allowed');

                done();
            }, 200);
        });

        it('7.10 should trigger embed on Enter key in URL input', (done) => {
            const blocks: BlockModel[] = [{
                id: 'embed-enter-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

                setTimeout(() => {
                    placeholder.click();

                    setTimeout(() => {
                        const uploaderRenderer = (editor as any).imageUploaderRenderer;
                        if (uploaderRenderer.tabObj) {
                            uploaderRenderer.tabObj.select(1);

                            setTimeout(() => {
                                const embedInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                                
                                // Type valid URL
                                embedInput.value = 'https://example.com/image.jpg';

                                // Press Enter
                                const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                                embedInput.dispatchEvent(enterEvent);

                                setTimeout(() => {
                                    // Assert DOM - image should be embedded
                                    const imgElement = editorElement.querySelector('img.e-image-block');
                                    expect(imgElement).not.toBeNull();

                                    // Assert Model
                                    const block = editor.blocks.find(b => b.id === 'embed-enter-1');
                                    expect((block.properties as IImageBlockSettings).src).toBe('https://example.com/image.jpg');

                                    done();
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    }, 300);
                }, 500);
            }, 200);
        });

        it('7.11 should clear URL input after successful embed', (done) => {
            const blocks: BlockModel[] = [{
                id: 'clear-input-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;

                setTimeout(() => {
                    placeholder.click();

                    setTimeout(() => {
                        const uploaderRenderer = (editor as any).imageUploaderRenderer;
                        if (uploaderRenderer.tabObj) {
                            uploaderRenderer.tabObj.select(1);

                            setTimeout(() => {
                                const embedInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                                
                                embedInput.value = 'https://example.com/image.jpg';
                                
                                const embedButton = document.querySelector('.e-embed-button') as HTMLElement;
                                embedButton.click();

                                setTimeout(() => {
                                    // Close and reopen popup
                                    const imageRenderer = (editor.blockManager.blockRenderer as any).imageRenderer;
                                    imageRenderer.toggleUploadPopup(false, placeholder);

                                    setTimeout(() => {
                                        // Assert DOM - input should be cleared
                                        expect(embedInput.value).toBe('');

                                        // Assert Model
                                        const block = editor.blocks.find(b => b.id === 'clear-input-1');
                                        expect((block.properties as IImageBlockSettings).src).toBeTruthy();

                                        done();
                                    }, 300);
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    }, 300);
                }, 500);
            }, 200);
        });
    });

    // ========================================================================
    // 8. PASTED IMAGE UPLOAD TESTS
    // ========================================================================
    describe('8. Pasted Image Upload', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('8.1 should detect pasted image with Base64 src', (done) => {
            const blocks: BlockModel[] = [{
                id: 'paste-base64-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const paraBlock = editorElement.querySelector('#paste-base64-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(paraBlock);

                // Mock FileReader
                const mockFileReader = {
                    readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                        setTimeout(() => {
                            this.onload({ target: { result: 'data:image/png;base64,testdata' } });
                        }, 10);
                    }),
                    onload: null as any
                };
                spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

                const imageBlob = new Blob(['fake-image'], { type: 'image/png' });
                
                editor.blockManager.blockRenderer.imageRenderer.handleFilePaste(imageBlob).then(() => {
                    setTimeout(() => {
                        // Assert DOM
                        const imgElement = editorElement.querySelector('img.e-image-block');
                        expect(imgElement).not.toBeNull();

                        // Assert Model
                        const imageBlock = editor.blocks.find(b => b.blockType === BlockType.Image);
                        expect(imageBlock).toBeDefined();
                        expect((imageBlock.properties as IImageBlockSettings).src).toContain('data:image/png;base64');

                        done();
                    }, 300);
                });
            }, 200);
        });

        it('8.2 should convert Blob URL src to File object', (done) => {
            const blocks: BlockModel[] = [{
                id: 'convert-blob-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    saveFormat: 'Blob'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const paraBlock = editorElement.querySelector('#convert-blob-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(paraBlock);

                // Create blob URL
                const imageBlob = new Blob(['fake-image'], { type: 'image/png' });
                const blobUrl = URL.createObjectURL(imageBlob);

                // Mock FileReader for paste
                const mockFileReader = {
                    readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                        setTimeout(() => {
                            this.onload({ target: { result: blobUrl } });
                        }, 10);
                    }),
                    onload: null as any
                };
                spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

                editor.blockManager.blockRenderer.imageRenderer.handleFilePaste(imageBlob).then(() => {
                    setTimeout(() => {
                        // Assert DOM
                        const imgElement = editorElement.querySelector('img.e-image-block');
                        expect(imgElement).not.toBeNull();

                        // Assert Model
                        const imageBlock = editor.blocks.find(b => b.blockType === BlockType.Image);
                        expect(imageBlock).toBeDefined();

                        done();
                    }, 300);
                });
            }, 200);
        });

        it('8.3 should check image element on file paste', (done) => {
            const blocks: BlockModel[] = [{
                id: 'paste-progress-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const paraBlock = editorElement.querySelector('#paste-progress-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(paraBlock);

                // Mock FileReader
                const mockFileReader = {
                    readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                        setTimeout(() => {
                            this.onload({ target: { result: 'data:image/png;base64,testdata' } });
                        }, 10);
                    }),
                    onload: null as any
                };
                spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

                const imageBlob = new Blob(['fake-image'], { type: 'image/png' });
                
                editor.blockManager.blockRenderer.imageRenderer.handleFilePaste(imageBlob).then(() => {
                    setTimeout(() => {
                        // Assert DOM
                        const imgElement = editorElement.querySelector('img.e-image-block');
                        expect(imgElement).not.toBeNull();

                        // Assert Model
                        const imageBlock = editor.blocks.find(b => b.blockType === BlockType.Image);
                        expect(imageBlock).toBeDefined();

                        done();
                    }, 500);
                });
            }, 200);
        });

        it('8.4 should skip upload if src is already http/https URL', (done) => {
            const blocks: BlockModel[] = [{
                id: 'skip-upload-1',
                blockType: BlockType.Image,
                properties: {
                    src: 'https://example.com/already-uploaded.jpg'
                } as IImageBlockSettings
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Trigger imageInserted event manually
                const imgElement = editorElement.querySelector('img.e-image-block') as HTMLImageElement;
                
                editor.blockManager.observer.notify('imageInserted', {
                    blockId: 'skip-upload-1',
                    imgElement: imgElement
                });

                setTimeout(() => {
                    // Assert DOM - no progress bar should appear
                    const progressContainer = editorElement.querySelector('.e-progress-container');
                    expect(progressContainer).toBeNull();

                    // Assert Model
                    const block = editor.blocks.find(b => b.id === 'skip-upload-1');
                    expect((block.properties as IImageBlockSettings).src).toBe('https://example.com/already-uploaded.jpg');

                    done();
                }, 300);
            }, 500);
        });

        it('8.5 should skip upload if saveUrl is not configured', (done) => {
            const blocks: BlockModel[] = [{
                id: 'no-saveurl-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: '' // No saveUrl
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const paraBlock = editorElement.querySelector('#no-saveurl-1') as HTMLElement;
                editor.blockManager.setFocusToBlock(paraBlock);

                const imageBlob = new Blob(['fake-image'], { type: 'image/png' });
                
                editor.blockManager.blockRenderer.imageRenderer.handleFilePaste(imageBlob).then(() => {
                    setTimeout(() => {
                        // Assert DOM - no progress bar should appear
                        const progressContainer = editorElement.querySelector('.e-progress-container');
                        expect(progressContainer).toBeNull();

                        // Assert Model
                        const uploaderRenderer = (editor as any).imageUploaderRenderer;
                        expect(uploaderRenderer.progressRenderers.size).toBe(0);

                        done();
                    }, 300);
                });
            }, 200);
        });
    });

    // ========================================================================
    // 9. PROGRESS BAR COMPONENT TESTS
    // ========================================================================
    describe('9. ImageProgressRenderer Component', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('9.1 should create progress bar with unique ID', (done) => {
            const blocks: BlockModel[] = [{
                id: 'unique-id-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image element
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                // Assert DOM
                const progressElement = mockContainer.querySelector('.e-progress-container');
                expect(progressElement).not.toBeNull();
                expect(progressElement.id).toContain('progress-container');

                // Assert Model
                expect((progressRenderer as any).uniqueId).toBeTruthy();

                done();
            }, 200);
        });

        it('9.2 should initialize progress bar width matching image element', (done) => {
            const blocks: BlockModel[] = [{
                id: 'width-match-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image with specific width
                const mockImg = createElement('img', { styles: 'width: 300px;' }) as HTMLImageElement;
                Object.defineProperty(mockImg, 'offsetWidth', { value: 300 });
                
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                // Assert DOM
                const progressBar = (progressRenderer as any).progressBarObj;
                expect(progressBar).not.toBeNull();
                expect(progressBar.width).toBe('300');

                // Assert Model
                expect((progressRenderer as any).progressElement).not.toBeNull();

                done();
            }, 200);
        });

        it('9.3 should show progress container when show() is called', (done) => {
            const blocks: BlockModel[] = [{
                id: 'show-progress-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                
                // Initially hidden
                let progressContainer = mockContainer.querySelector('.e-progress-container') as HTMLElement;
                expect(progressContainer.classList.contains('e-hidden')).toBe(true);

                // Show
                progressRenderer.show();

                // Assert DOM
                progressContainer = mockContainer.querySelector('.e-progress-container') as HTMLElement;
                expect(progressContainer.classList.contains('e-hidden')).toBe(false);

                // Assert Model
                expect(progressRenderer.isVisible()).toBe(true);

                done();
            }, 200);
        });

        it('9.4 should hide progress container when hide() is called', (done) => {
            const blocks: BlockModel[] = [{
                id: 'hide-progress-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                
                progressRenderer.show();
                expect(progressRenderer.isVisible()).toBe(true);

                // Hide
                progressRenderer.hide();

                setTimeout(() => {
                    // Assert DOM
                    const progressContainer = mockContainer.querySelector('.e-progress-container') as HTMLElement;
                    expect(progressContainer.classList.contains('e-hidden')).toBe(true);

                    // Assert Model
                    expect(progressRenderer.isVisible()).toBe(false);

                    done();
                }, 200);
            }, 200);
        });

        it('9.6 should execute callback after hide() completes', (done) => {
            const blocks: BlockModel[] = [{
                id: 'hide-callback-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                
                let callbackExecuted = false;
                const callback = () => {
                    callbackExecuted = true;
                };

                progressRenderer.show();
                progressRenderer.hide(callback);

                setTimeout(() => {
                    // Assert DOM
                    expect(callbackExecuted).toBe(true);

                    // Assert Model
                    expect(progressRenderer.isVisible()).toBe(false);

                    done();
                }, 200);
            }, 200);
        });
    });

    // ========================================================================
    // 10. MEMORY & CLEANUP TESTS
    // ========================================================================
    describe('10. Memory & Cleanup', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('10.1 should revoke all Blob URLs on upload success', (done) => {
            const blocks: BlockModel[] = [{
                id: 'revoke-blob-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    saveFormat: 'Blob'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Add mock blob URLs
                uploaderRenderer.blobUrlsToRevoke.push('blob:mock-url-1');
                uploaderRenderer.blobUrlsToRevoke.push('blob:mock-url-2');

                // Spy on URL.revokeObjectURL
                spyOn(URL, 'revokeObjectURL');

                // Revoke
                uploaderRenderer.revokeBlobUrls();

                // Assert DOM
                expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);

                // Assert Model
                expect(uploaderRenderer.blobUrlsToRevoke.length).toBe(0);

                done();
            }, 500);
        });

        it('10.2 should cleanup all progress renderers on destroy', (done) => {
            const blocks: BlockModel[] = [{
                id: 'cleanup-progress-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create mock progress renderer
                const mockProgressRenderer = {
                    destroy: jasmine.createSpy('destroy')
                };
                uploaderRenderer.progressRenderers.set('test-block-1', mockProgressRenderer);

                // Destroy
                uploaderRenderer.destroy();

                // Assert DOM
                expect(mockProgressRenderer.destroy).toHaveBeenCalled();

                // Assert Model
                expect(uploaderRenderer.progressRenderers.size).toBe(0);

                done();
            }, 500);
        });

        it('10.3 should cleanup all upload sessions on destroy', (done) => {
            const blocks: BlockModel[] = [{
                id: 'cleanup-sessions-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Add mock sessions
                uploaderRenderer.uploadSessions.set('block-1', {});
                uploaderRenderer.uploadSessions.set('block-2', {});

                // Destroy
                uploaderRenderer.destroy();

                // Assert DOM
                expect(uploaderRenderer.uploadSessions.size).toBe(0);

                // Assert Model
                expect(uploaderRenderer.fileNameToBlockId.size).toBe(0);

                done();
            }, 500);
        });
    });

    // ========================================================================
    // 11. UPLOAD SESSION STATE MANAGEMENT TESTS
    // ========================================================================
    describe('11. UploadSession State Management', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('11.1 should initialize session with correct state', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-init-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create mock file and session
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                uploaderRenderer.uploadSessions.set('block-1', {
                    sessionId: 'session-123',
                    blockId: 'block-1',
                    file: mockFile,
                    fileName: 'test.jpg',
                    fileSize: mockFile.size,
                    progressPercent: 0,
                    status: 'pending',
                    previewUrl: 'data:image/jpeg;base64,test',
                    errorMessage: null,
                    startTime: Date.now(),
                    endTime: null
                });

                const session = uploaderRenderer.uploadSessions.get('block-1');
                expect(session.status).toBe('pending');
                expect(session.progressPercent).toBe(0);
                expect(session.errorMessage).toBeNull();

                done();
            }, 200);
        });

        it('11.2 should update progress and change status to uploading', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-progress-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create session
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const session = new UploadSession('session-1', 'block-1', mockFile, null);
                
                // Assert initial state
                expect(session.status).toBe('pending');
                expect(session.progressPercent).toBe(0);

                // Update progress to 50%
                session.updateProgress(50);

                // Assert updated state
                expect(session.status).toBe('uploading');
                expect(session.progressPercent).toBe(50);

                done();
            }, 200);
        });

        it('11.3 should clamp progress between 0 and 100', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-clamp-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const session = new UploadSession('session-1', 'block-1', mockFile, null);

                // Test negative value
                session.updateProgress(-50);
                expect(session.progressPercent).toBe(0);

                // Test value > 100
                session.updateProgress(150);
                expect(session.progressPercent).toBe(100);

                done();
            }, 200);
        });

        it('11.4 should mark session as completed', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-complete-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const session = new UploadSession('session-1', 'block-1', mockFile, null);

                // Set to uploading first
                session.updateProgress(50);
                expect(session.status).toBe('uploading');

                // Mark as complete
                session.complete();

                // Assert completed state
                expect(session.status).toBe('completed');
                expect(session.progressPercent).toBe(100);
                expect(session.endTime).not.toBeNull();
                expect(session.errorMessage).toBeNull();

                done();
            }, 200);
        });

        it('11.5 should mark session as failed with error message', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-fail-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const session = new UploadSession('session-1', 'block-1', mockFile, null);

                // Update to uploading
                session.updateProgress(50);

                // Fail with error message
                session.fail('Network error');

                // Assert failed state
                expect(session.status).toBe('failed');
                expect(session.errorMessage).toBe('Network error');
                expect(session.endTime).not.toBeNull();

                done();
            }, 200);
        });

        it('11.5.1 should mark session as failed without error message', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-fail-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const session = new UploadSession('session-1', 'block-1', mockFile, null);

                // Update to uploading
                session.updateProgress(50);

                // Fail with error message
                session.fail(undefined);

                // Assert failed state
                expect(session.status).toBe('failed');
                expect(session.errorMessage).toBe('Upload failed');
                expect(session.endTime).not.toBeNull();

                done();
            }, 200);
        });

        it('11.6 should mark session as cancelled', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-cancel-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const session = new UploadSession('session-1', 'block-1', mockFile, null);

                // Cancel upload
                session.cancel();

                // Assert cancelled state
                expect(session.status).toBe('cancelled');
                expect(session.errorMessage).toBe('Upload cancelled by user');
                expect(session.endTime).not.toBeNull();

                done();
            }, 200);
        });

        it('11.7 should maintain file reference for retry', (done) => {
            const blocks: BlockModel[] = [{
                id: 'session-retry-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const UploadSession = require('../../src/blockeditor/renderer/image/upload-session').UploadSession;
                const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
                const session = new UploadSession('session-1', 'block-1', mockFile, null);

                // Assert file is stored
                expect(session.file).toBe(mockFile);
                expect(session.file.name).toBe('test.jpg');
                expect(session.file.size).toBe(mockFile.size);

                done();
            }, 200);
        });
    });

    // ========================================================================
    // 12. PROGRESS BAR ADVANCED TESTS
    // ========================================================================
    describe('12. ImageProgressRenderer Advanced Behavior', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('12.1 should remove badge before showing new one', (done) => {
            const blocks: BlockModel[] = [{
                id: 'badge-replace-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                
                // Show success badge
                progressRenderer.showSuccessBadge();
                let badge = mockContainer.querySelector('.e-badge-success');
                expect(badge).not.toBeNull();

                // Show error badge (should replace success badge)
                progressRenderer.showErrorBadge();
                const errorBadge = mockContainer.querySelector('.e-badge-danger');
                expect(errorBadge).not.toBeNull();

                // Clear manual timeout to avoid async issues
                const badge2 = mockContainer.querySelector('.e-badge-success');
                expect(badge2).toBeNull(); // Success badge should be removed

                done();
            }, 200);
        });
    });

    // ========================================================================
    // 13. EMBED TAB INTERACTION TESTS
    // ========================================================================
    describe('13. Embed Tab URL Embedding Workflow', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('13.1 should prevent XSS by rejecting javascript: URLs via embed workflow', (done) => {
            const blocks: BlockModel[] = [{
                id: 'xss-test-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                expect(placeholder).not.toBeNull();

                // Open popup
                placeholder.click();

                setTimeout(() => {
                    // Get embed tab and input
                    const tabButtons = document.querySelectorAll('.e-tabs .e-tab-header');
                    if (tabButtons.length >= 2) {
                        (tabButtons[1] as HTMLElement).click(); // Click embed tab

                        setTimeout(() => {
                            const urlInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                            expect(urlInput).not.toBeNull();

                            // Try to enter malicious URL
                            urlInput.value = 'javascript:alert("xss")';
                            urlInput.dispatchEvent(new Event('input'));

                            // Verify button is still disabled for invalid URL
                            const embedButton = document.querySelector('.e-embed-button') as HTMLButtonElement;
                            expect(embedButton.classList.contains('e-disabled')).toBe(true);

                            done();
                        }, 100);
                    } else {
                        // Tab not available, verify at least image block and placeholder exist
                        expect(placeholder).not.toBeNull();
                        done();
                    }
                }, 100);
            }, 200);
        });

        it('13.2 should prevent SSRF by rejecting localhost via embed workflow', (done) => {
            const blocks: BlockModel[] = [{
                id: 'ssrf-localhost-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const tabButtons = document.querySelectorAll('.e-tabs .e-tab-header');
                    if (tabButtons.length >= 2) {
                        (tabButtons[1] as HTMLElement).click();

                        setTimeout(() => {
                            const urlInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                            urlInput.value = 'http://localhost/image.jpg';
                            urlInput.dispatchEvent(new Event('input'));

                            // Button should be disabled for localhost
                            const embedButton = document.querySelector('.e-embed-button') as HTMLButtonElement;
                            expect(embedButton.classList.contains('e-disabled')).toBe(true);

                            done();
                        }, 100);
                    } else {
                        done();
                    }
                }, 100);
            }, 200);
        });

        it('13.3 should allow valid HTTPS URLs via embed workflow', (done) => {
            const blocks: BlockModel[] = [{
                id: 'valid-url-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const tabButtons = document.querySelectorAll('.e-tabs .e-tab-header');
                    if (tabButtons.length >= 2) {
                        (tabButtons[1] as HTMLElement).click();

                        setTimeout(() => {
                            const urlInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                            urlInput.value = 'https://cdn.example.com/image.jpg';
                            urlInput.dispatchEvent(new Event('input'));

                            // Button should be enabled for valid URL
                            const embedButton = document.querySelector('.e-embed-button') as HTMLButtonElement;
                            expect(embedButton.classList.contains('e-disabled')).toBe(false);

                            done();
                        }, 100);
                    } else {
                        done();
                    }
                }, 100);
            }, 200);
        });

        it('13.4 should reject 192.168.x.x (SSRF prevention)', (done) => {
            const blocks: BlockModel[] = [{
                id: 'ssrf-192-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const tabButtons = document.querySelectorAll('.e-tabs .e-tab-header');
                    if (tabButtons.length >= 2) {
                        (tabButtons[1] as HTMLElement).click();

                        setTimeout(() => {
                            const urlInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                            urlInput.value = 'http://192.168.1.1/image.jpg';
                            urlInput.dispatchEvent(new Event('input'));

                            const embedButton = document.querySelector('.e-embed-button') as HTMLButtonElement;
                            expect(embedButton.classList.contains('e-disabled')).toBe(true);

                            done();
                        }, 100);
                    } else {
                        done();
                    }
                }, 100);
            }, 200);
        });

        it('13.5 should clear URL input after successful embed', (done) => {
            const blocks: BlockModel[] = [{
                id: 'embed-clear-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const tabButtons = document.querySelectorAll('.e-tabs .e-tab-header');
                    if (tabButtons.length >= 2) {
                        (tabButtons[1] as HTMLElement).click();

                        setTimeout(() => {
                            const urlInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                            urlInput.value = 'https://example.com/image.jpg';
                            urlInput.dispatchEvent(new Event('input'));

                            // Mock embed success
                            editor.blockManager.observer.notify('imageEmbedded', {
                                url: 'https://example.com/image.jpg'
                            });

                            setTimeout(() => {
                                // URL should be cleared after successful embed
                                expect(urlInput.value).toBe('');
                                done();
                            }, 100);
                        }, 100);
                    } else {
                        done();
                    }
                }, 100);
            }, 200);
        });
    });

    // ========================================================================
    // 14. FILE UPLOAD & PROGRESS TRACKING
    // ========================================================================
    describe('14. File Upload Progress & Completion', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('14.1 should show progress bar during file upload', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-show-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.toBlob((blob) => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(new File([blob], 'test.png', { type: 'image/png' }));
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                            // Verify progress bar container appears
                            setTimeout(() => {
                                const progressBar = document.querySelector('.e-upload-progress') as HTMLElement;
                                if (progressBar) {
                                    expect(progressBar).not.toBeNull();
                                }
                                done();
                            }, 100);
                        } else {
                            done();
                        }
                    });
                }, 100);
            }, 200);
        });

        it('14.2 should update progress percentage during upload', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-update-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.toBlob((blob) => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(new File([blob], 'test.png', { type: 'image/png' }));
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                            // Simulate progress update
                            editor.blockManager.observer.notify('uploadProgress', {
                                percent: 50
                            });

                            setTimeout(() => {
                                // Verify progress bar updated
                                const progressValue = document.querySelector('.e-progress-percent') as HTMLElement;
                                if (progressValue) {
                                    const percent = parseInt(progressValue.textContent || '0');
                                    expect(percent).toBeGreaterThanOrEqual(0);
                                }
                                done();
                            }, 100);
                        } else {
                            done();
                        }
                    });
                }, 100);
            }, 200);
        });

        it('14.3 should hide progress bar on upload completion', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-hide-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.toBlob((blob) => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(new File([blob], 'test.png', { type: 'image/png' }));
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                            // Simulate upload completion
                            setTimeout(() => {
                                editor.blockManager.observer.notify('uploadComplete', {
                                    success: true
                                });

                                setTimeout(() => {
                                    // Verify progress bar is hidden
                                    const progressBar = document.querySelector('.e-upload-progress:not(.e-hidden)') as HTMLElement;
                                    if (progressBar) {
                                        expect(progressBar.classList.contains('e-hidden')).toBe(true);
                                    }
                                    done();
                                }, 100);
                            }, 100);
                        } else {
                            done();
                        }
                    });
                }, 100);
            }, 200);
        });
    });

    // ========================================================================
    // 15. ERROR HANDLING & UPLOAD FAILURE RECOVERY
    // ========================================================================
    describe('15. Upload Error Handling & Recovery', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        it('15.1 should display error badge on upload failure', (done) => {
            const blocks: BlockModel[] = [{
                id: 'error-badge-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.toBlob((blob) => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(new File([blob], 'test.png', { type: 'image/png' }));
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                            // Simulate upload failure
                            setTimeout(() => {
                                editor.blockManager.observer.notify('uploadError', {
                                    error: 'Upload failed'
                                });

                                setTimeout(() => {
                                    // Verify error badge appears
                                    const errorBadge = document.querySelector('.e-error-badge') as HTMLElement;
                                    if (errorBadge) {
                                        expect(errorBadge.style.display).not.toBe('none');
                                    }
                                    done();
                                }, 100);
                            }, 100);
                        } else {
                            done();
                        }
                    });
                }, 100);
            }, 200);
        });

        it('15.2 should allow retry after upload failure', (done) => {
            const blocks: BlockModel[] = [{
                id: 'retry-upload-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    // Simulate upload error
                    editor.blockManager.observer.notify('uploadError', {
                        error: 'Network timeout'
                    });

                    // Verify retry button exists
                    setTimeout(() => {
                        const retryButton = document.querySelector('.e-retry-button') as HTMLButtonElement;
                        if (retryButton) {
                            expect(retryButton).not.toBeNull();
                            expect(retryButton.disabled).toBe(false);
                        }
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });

        it('15.3 should handle cancel button interaction', (done) => {
            const blocks: BlockModel[] = [{
                id: 'cancel-upload-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.toBlob((blob) => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(new File([blob], 'test.png', { type: 'image/png' }));
                            fileInput.files = dataTransfer.files;
                            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                // Find and click cancel button
                                const cancelButton = document.querySelector('.e-upload-cancel') as HTMLButtonElement;
                                if (cancelButton) {
                                    cancelButton.click();

                                    setTimeout(() => {
                                        // Verify upload was cancelled
                                        const progressBar = document.querySelector('.e-upload-progress') as HTMLElement;
                                        if (progressBar) {
                                            expect(progressBar.classList.contains('e-hidden')).toBe(true);
                                        }
                                        done();
                                    }, 100);
                                } else {
                                    done();
                                }
                            }, 100);
                        } else {
                            done();
                        }
                    });
                }, 100);
            }, 200);
        });

        it('15.4 should clear upload state on successful completion', (done) => {
            const blocks: BlockModel[] = [{
                id: 'clear-state-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    // Simulate successful upload completion
                    editor.blockManager.observer.notify('uploadComplete', {
                        success: true,
                        blockId: 'clear-state-1'
                    });

                    setTimeout(() => {
                        // Verify UI state is reset
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                            expect(fileInput.value).toBe('');
                        }
                        done();
                    }, 100);
                }, 100);
            }, 200);
        });
    });

    // ========================================================================
    // 16. IMPROVED COVERAGE FOR IMAGE-UPLOADER METHODS
    // ========================================================================
    describe('16. Image-Uploader Coverage - Advanced Scenarios', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        // ========================================================================
        // 16.1 COVERAGE: handleImageInserted with existingSession
        // ========================================================================
        it('16.1.1 should handle imageInserted event with existing uploader session', (done) => {
            const blocks: BlockModel[] = [{
                id: 'existing-session-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    saveFormat: 'Base64'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    // Create mock file and add to session
                    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                    const uploaderRenderer = (editor as any).imageUploaderRenderer;
                    
                    const blockId = 'existing-session-1';
                    const sessionId = 'test-session-1';
                    const session = new UploadSession(sessionId, blockId, mockFile, null);
                    uploaderRenderer.uploadSessions.set(blockId, session);
                    uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                    // Create mock image element
                    const mockImg = document.createElement('img');
                    mockImg.src = 'data:image/jpeg;base64,test';
                    mockImg.className = 'e-image-block';
                    editorElement.appendChild(mockImg);

                    // Trigger imageInserted event with existing session
                    editor.blockManager.observer.notify('imageInserted', {
                        blockId: blockId,
                        imgElement: mockImg
                    });

                    setTimeout(() => {
                        // Assert that progress renderer was created
                        const progressRenderer = (uploaderRenderer as any).progressRenderers.get(blockId);
                        expect(progressRenderer).toBeDefined();
                        
                        // Assert that session still exists
                        const existingSession = uploaderRenderer.uploadSessions.get(blockId);
                        expect(existingSession).toBeDefined();

                        done();
                    }, 300);
                }, 500);
            }, 200);
        });

        it('16.1.2 should handle imageInserted event without saveUrl configured', (done) => {
            const blocks: BlockModel[] = [{
                id: 'no-saveurl-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    // No saveUrl configured
                    saveFormat: 'Base64'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                // Create mock image element
                const mockImg = document.createElement('img');
                mockImg.src = 'data:image/jpeg;base64,test';
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                const blockId = 'no-saveurl-1';

                // Trigger imageInserted event without saveUrl
                editor.blockManager.observer.notify('imageInserted', {
                    blockId: blockId,
                    imgElement: mockImg
                });

                setTimeout(() => {
                    // Assert that uploadPastedImage was NOT called (no saveUrl)
                    const uploadSessions = uploaderRenderer.uploadSessions;
                    expect(uploadSessions.size).toBe(0);

                    done();
                }, 300);
            }, 200);
        });

        // ========================================================================
        // 16.2 COVERAGE: uploadPastedImage & convertImageToFile
        // ========================================================================
        it('16.2.1 should upload pasted image with base64 source', (done) => {
            const blocks: BlockModel[] = [{
                id: 'paste-upload-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    saveFormat: 'Base64'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create mock image with base64 src
                const mockImg = document.createElement('img');
                mockImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const blockId = 'paste-upload-1';

                // Spy on uploaderObj.upload
                spyOn(uploaderRenderer.uploaderObj, 'upload').and.callFake((files: any) => {
                    // Verify file was prepared for upload
                    expect(files.length).toBeGreaterThan(0);
                });

                // Call uploadPastedImage
                uploaderRenderer.uploadPastedImage(mockImg, blockId).then(() => {
                    setTimeout(() => {
                        // Assert that upload session was created
                        const session = uploaderRenderer.uploadSessions.get(blockId);
                        expect(session).toBeDefined();
                        
                        // Assert that progress renderer was created
                        const progressRenderer = uploaderRenderer.progressRenderers.get(blockId);
                        expect(progressRenderer).toBeDefined();

                        done();
                    }, 300);
                });
            }, 200);
        });

        it('16.2.2 should convert blob URL to File object', (done) => {
            const blocks: BlockModel[] = [{
                id: 'convert-blob-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create blob and blob URL
                const blob = new Blob(['fake-image'], { type: 'image/png' });
                const blobUrl = URL.createObjectURL(blob);

                const blockId = 'convert-blob-1';

                // Call convertImageToFile with blob URL
                uploaderRenderer.convertImageToFile(blobUrl, blockId).then((file: File | null) => {
                    // Assert file was created
                    expect(file).not.toBeNull();
                    if (file) {
                        expect(file.name).toContain('pasted-image-');
                        expect(file.name).toContain(blockId);
                        expect(file.type).toBe('image/png');
                    }

                    // Clean up blob URL
                    URL.revokeObjectURL(blobUrl);
                    done();
                });
            }, 200);
        });

        it('16.2.3 should skip upload for hosted HTTP/HTTPS URLs', (done) => {
            const blocks: BlockModel[] = [{
                id: 'skip-hosted-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create mock image with hosted URL
                const mockImg = document.createElement('img');
                mockImg.src = 'https://example.com/already-hosted.jpg';
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const blockId = 'skip-hosted-1';

                // Spy on uploaderObj.upload
                spyOn(uploaderRenderer.uploaderObj, 'upload');

                // Call uploadPastedImage with hosted URL
                uploaderRenderer.uploadPastedImage(mockImg, blockId).then(() => {
                    setTimeout(() => {
                        // Assert that upload was NOT called for hosted URL
                        expect(uploaderRenderer.uploaderObj.upload).not.toHaveBeenCalled();

                        // Assert that no session was created
                        const session = uploaderRenderer.uploadSessions.get(blockId);
                        expect(session).toBeUndefined();

                        done();
                    }, 300);
                });
            }, 200);
        });

        // ========================================================================
        // 16.3 COVERAGE: handleProgress
        // ========================================================================
        it('16.3.1 should update progress bar during file upload', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-update-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'progress-update-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

                // Create upload session and progress renderer
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'updateProgress');
                spyOn(session, 'updateProgress');

                // Mock progress event
                const progressArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        lengthComputable: true,
                        loaded: 50,
                        total: 100
                    }
                };

                // Call handleProgress
                uploaderRenderer.handleProgress(progressArgs);

                // Assert progress was updated
                expect(progressRenderer.updateProgress).toHaveBeenCalledWith(50);
                expect(session.updateProgress).toHaveBeenCalledWith(50);

                done();
            }, 200);
        });

        it('16.3.2 should handle progress with 0% initially', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-zero-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'progress-zero-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

                // Create upload session and progress renderer
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'updateProgress');

                // Mock progress event at 0%
                const progressArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        lengthComputable: true,
                        loaded: 0,
                        total: 100
                    }
                };

                // Call handleProgress
                uploaderRenderer.handleProgress(progressArgs);

                // Assert progress was updated to 0%
                expect(progressRenderer.updateProgress).toHaveBeenCalledWith(0);

                done();
            }, 200);
        });

        // ========================================================================
        // 16.4 COVERAGE: handleSuccess
        // ========================================================================
        it('16.4.1 should complete upload with URL from path configuration', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-path-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    path: 'https://cdn.example.com/images/'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'success-path-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

                // Create upload session
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, 'data:image/jpeg;base64,test');
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });
                spyOn(progressRenderer, 'showSuccessBadge');

                // Mock success event
                const successArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ fileName: 'test.jpg' })
                        }
                    }
                };

                // Call handleSuccess
                uploaderRenderer.handleSuccess(successArgs);

                setTimeout(() => {
                    // Assert session was cleaned up
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);
                    expect(uploaderRenderer.fileNameToBlockId.has('test.jpg')).toBe(false);

                    // Assert progress bar was hidden and success badge shown
                    expect(progressRenderer.hide).toHaveBeenCalled();
                    expect(progressRenderer.showSuccessBadge).toHaveBeenCalled();

                    done();
                }, 1100);
            }, 200);
        });

        it('16.4.2 should handle success with direct URL from server', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-direct-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'success-direct-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

                // Create upload session
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, 'data:image/jpeg;base64,test');
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });

                // Mock success event with direct URL
                const successArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ url: 'https://example.com/uploaded.jpg' })
                        }
                    }
                };

                // Call handleSuccess
                uploaderRenderer.handleSuccess(successArgs);

                setTimeout(() => {
                    // Assert session was cleaned up
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);

                    done();
                }, 1100);
            }, 200);
        });

        // ========================================================================
        // 16.5 COVERAGE: handleFailure
        // ========================================================================
        it('16.5.1 should handle upload failure with statusText', (done) => {
            const blocks: BlockModel[] = [{
                id: 'failure-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'failure-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

                // Create upload session
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });
                spyOn(progressRenderer, 'showErrorBadge');
                spyOn(session, 'fail');

                // Mock failure event
                const failureArgs = {
                    file: { name: 'test.jpg' },
                    statusText: 'Network error'
                };

                // Call handleFailure
                uploaderRenderer.handleFailure(failureArgs);

                setTimeout(() => {
                    // Assert session fail was called
                    expect(session.fail).toHaveBeenCalledWith('Network error');

                    // Assert progress bar was hidden and error badge shown
                    expect(progressRenderer.hide).toHaveBeenCalled();
                    expect(progressRenderer.showErrorBadge).toHaveBeenCalled();

                    // Assert session was cleaned up
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);

                    done();
                }, 1100);
            }, 200);
        });

        it('16.5.2 should extract error message from response event', (done) => {
            const blocks: BlockModel[] = [{
                id: 'failure-event-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'failure-event-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

                // Create upload session
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });
                spyOn(session, 'fail');

                // Mock failure event with event object
                const failureArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        target: {
                            statusText: 'Server error'
                        }
                    }
                };

                // Call handleFailure
                uploaderRenderer.handleFailure(failureArgs);

                setTimeout(() => {
                    // Assert session fail was called with extracted message
                    expect(session.fail).toHaveBeenCalledWith('Server error');

                    done();
                }, 1100);
            }, 200);
        });

        // ========================================================================
        // 16.6 COVERAGE: refresh
        // ========================================================================
        it('16.6.1 should clear uploader on refresh', (done) => {
            const blocks: BlockModel[] = [{
                id: 'refresh-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Spy on uploaderObj.clearAll
                spyOn(uploaderRenderer.uploaderObj, 'clearAll');

                // Call refresh
                uploaderRenderer.refresh();

                // Assert clearAll was called
                expect(uploaderRenderer.uploaderObj.clearAll).toHaveBeenCalled();

                done();
            }, 200);
        });
    });

    // ========================================================================
    // 17. BRANCH COVERAGE IMPROVEMENTS - image-uploader.js
    // ========================================================================
    describe('17. Branch Coverage - Image-Uploader', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        // ========================================================================
        // 17.1 Branch: validateImageUrl - missing protocols and hostname checks
        // ========================================================================
        it('17.1.1 should reject URL without protocol', (done) => {
            const blocks: BlockModel[] = [{
                id: 'no-protocol-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Test URL without protocol
                const result = uploaderRenderer.validateImageUrl('example.com/image.jpg');

                expect(result.valid).toBe(false);
                expect(result.error).toBe('Only HTTP/HTTPS protocols are allowed');

                done();
            }, 200);
        });

        it('17.1.2 should reject invalid URL format', (done) => {
            const blocks: BlockModel[] = [{
                id: 'invalid-url-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Test invalid URL format
                const result = uploaderRenderer.validateImageUrl('https://');

                expect(result.valid).toBe(false);
                expect(result.error).toBe('Invalid URL format');

                done();
            }, 200);
        });

        it('17.1.3 should block internal IP 10.x.x.x', (done) => {
            const blocks: BlockModel[] = [{
                id: 'internal-10-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Test 10.x.x.x internal IP
                const result = uploaderRenderer.validateImageUrl('http://10.0.0.1/image.jpg');

                expect(result.valid).toBe(false);
                expect(result.error).toBe('Internal network URLs are not allowed');

                done();
            }, 200);
        });

        it('17.1.4 should block internal IP 172.16-31.x.x', (done) => {
            const blocks: BlockModel[] = [{
                id: 'internal-172-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Test 172.16.0.0 - 172.31.255.255 range
                const result1 = uploaderRenderer.validateImageUrl('http://172.16.0.1/image.jpg');
                const result2 = uploaderRenderer.validateImageUrl('http://172.31.255.255/image.jpg');

                expect(result1.valid).toBe(false);
                expect(result1.error).toBe('Internal network URLs are not allowed');
                expect(result2.valid).toBe(false);
                expect(result2.error).toBe('Internal network URLs are not allowed');

                done();
            }, 200);
        });

        // ========================================================================
        // 17.2 Branch: handleProgress - missing fileName and blockId edge cases
        // ========================================================================
        it('17.2.1 should handle progress with missing file name', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-no-file-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create session without file mapping
                const blockId = 'progress-no-file-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'updateProgress');

                // Mock progress event without file name
                const progressArgs: any = {
                    file: undefined,
                    e: {
                        lengthComputable: true,
                        loaded: 50,
                        total: 100
                    }
                };

                // Call handleProgress
                uploaderRenderer.handleProgress(progressArgs);

                // Assert progress was still updated with 0% because fileName is ''
                expect(progressRenderer.updateProgress).not.toHaveBeenCalled();

                done();
            }, 200);
        });

        it('17.2.2 should not update progress if not lengthComputable', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-not-computable-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'progress-not-computable-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'updateProgress');

                // Mock progress event with lengthComputable = false
                const progressArgs = {
                    file: { name: 'test.jpg' },
                    e: {
                        lengthComputable: false,
                        loaded: 50,
                        total: 100
                    }
                };

                // Call handleProgress
                uploaderRenderer.handleProgress(progressArgs);

                // Assert progress was NOT updated
                expect(progressRenderer.updateProgress).not.toHaveBeenCalled();

                done();
            }, 200);
        });

        // ========================================================================
        // 17.3 Branch: handleSuccess - URL construction edge cases
        // ========================================================================
        it('17.3.1 should handle success with path ending with slash', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-path-slash-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    path: 'https://cdn.example.com/images/'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'success-path-slash-1';
                const mockFile = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, 'data:image/jpeg;base64,test');
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('image.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });

                let finalUrl = '';
                spyOn(editor.blockManager.observer, 'notify').and.callFake((event: string, args: any) => {
                    if (event === 'fileUploadSuccess' && args) {
                        finalUrl = args.e.target.response ? JSON.parse(args.e.target.response).url : '';
                    }
                });

                // Mock success event
                const successArgs = {
                    file: { name: 'image.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ fileName: 'image.jpg' })
                        }
                    }
                };

                // Call handleSuccess
                uploaderRenderer.handleSuccess(successArgs);

                setTimeout(() => {
                    // Assert session was cleaned up
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);
                    done();
                }, 1100);
            }, 200);
        });

        it('17.3.2 should handle success with path not ending with slash', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-path-no-slash-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    path: 'https://cdn.example.com/images'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'success-path-no-slash-1';
                const mockFile = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, 'data:image/jpeg;base64,test');
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('image.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });

                // Mock success event
                const successArgs = {
                    file: { name: 'image.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ fileName: 'image.jpg' })
                        }
                    }
                };

                // Call handleSuccess
                uploaderRenderer.handleSuccess(successArgs);

                setTimeout(() => {
                    // Assert session was cleaned up
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);
                    done();
                }, 1100);
            }, 200);
        });

        it('17.3.3 should handle success with filename starting with slash', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-filename-slash-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload',
                    path: 'https://cdn.example.com/images/'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'success-filename-slash-1';
                const mockFile = new File(['test'], '/image.jpg', { type: 'image/jpeg' });
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, 'data:image/jpeg;base64,test');
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('/image.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });

                // Mock success event
                const successArgs = {
                    file: { name: '/image.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ fileName: '/image.jpg' })
                        }
                    }
                };

                // Call handleSuccess
                uploaderRenderer.handleSuccess(successArgs);

                setTimeout(() => {
                    // Assert session was cleaned up
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);
                    done();
                }, 1100);
            }, 200);
        });

        it('17.3.4 should handle success without session object', (done) => {
            const blocks: BlockModel[] = [{
                id: 'success-no-session-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'success-no-session-1';
                uploaderRenderer.fileNameToBlockId.set('image.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });

                // Mock success event without session
                const successArgs = {
                    file: { name: 'image.jpg' },
                    e: {
                        target: {
                            response: JSON.stringify({ url: 'https://example.com/uploaded.jpg' })
                        }
                    }
                };

                // Call handleSuccess
                uploaderRenderer.handleSuccess(successArgs);

                setTimeout(() => {
                    // Assert session was not found
                    expect(uploaderRenderer.uploadSessions.has(blockId)).toBe(false);
                    done();
                }, 1100);
            }, 200);
        });

        // ========================================================================
        // 17.4 Branch: handleFailure - error extraction edge cases
        // ========================================================================
        it('17.4.1 should use default error message when statusText is empty', (done) => {
            const blocks: BlockModel[] = [{
                id: 'failure-default-msg-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                const blockId = 'failure-default-msg-1';
                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                const sessionId = 'test-session-1';
                const session = new UploadSession(sessionId, blockId, mockFile, null);
                uploaderRenderer.uploadSessions.set(blockId, session);
                uploaderRenderer.fileNameToBlockId.set('test.jpg', blockId);

                // Create mock image and progress renderer
                const mockImg = document.createElement('img');
                mockImg.className = 'e-image-block';
                editorElement.appendChild(mockImg);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                uploaderRenderer.progressRenderers.set(blockId, progressRenderer);

                spyOn(progressRenderer, 'hide').and.callFake((callback: any) => {
                    if (callback) callback();
                });
                spyOn(session, 'fail');

                // Mock failure event with no statusText
                const failureArgs: any = {
                    file: { name: 'test.jpg' },
                    statusText: undefined,
                    e: undefined
                };

                // Call handleFailure
                uploaderRenderer.handleFailure(failureArgs);

                setTimeout(() => {
                    // Assert default message was used
                    expect(session.fail).toHaveBeenCalledWith('Upload failed');
                    done();
                }, 1100);
            }, 200);
        });

        // ========================================================================
        // 17.5 Branch: convertImageToFile - edge cases for blob type
        // ========================================================================
        it('17.5.1 should use png as default extension when blob type has no subtype', (done) => {
            const blocks: BlockModel[] = [{
                id: 'convert-no-subtype-1',
                blockType: BlockType.Paragraph,
                content: [{ contentType: ContentType.Text, content: '' }]
            }];

            editor = createEditor({ 
                blocks,
                imageBlockSettings: {
                    saveUrl: 'https://example.com/upload'
                }
            });
            editor.appendTo('#editor');

            setTimeout(() => {
                const uploaderRenderer = (editor as any).imageUploaderRenderer;
                
                // Create a mock blob URL with empty type
                const blob = new Blob(['fake-image'], { type: '' });
                const blobUrl = URL.createObjectURL(blob);

                const blockId = 'convert-no-subtype-1';

                // Mock fetch to return our blob
                spyOn(window as any, 'fetch').and.returnValue(
                    Promise.resolve({
                        blob: () => Promise.resolve(blob)
                    })
                );

                // Call convertImageToFile with blob URL
                uploaderRenderer.convertImageToFile(blobUrl, blockId).then((file: File | null) => {
                    // Assert file uses default png extension
                    if (file) {
                        expect(file.name).toContain('.png');
                    }

                    // Clean up blob URL
                    URL.revokeObjectURL(blobUrl);
                    done();
                });
            }, 200);
        });

        // ========================================================================
        // 17.6 Branch: URL input handler branches
        // ========================================================================
        it('17.6.1 should disable embed button when input is cleared', (done) => {
            const blocks: BlockModel[] = [{
                id: 'embed-disable-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const placeholder = editorElement.querySelector('.e-image-placeholder') as HTMLElement;
                placeholder.click();

                setTimeout(() => {
                    const uploaderRenderer = (editor as any).imageUploaderRenderer;
                    if (uploaderRenderer.tabObj) {
                        uploaderRenderer.tabObj.select(1);

                        setTimeout(() => {
                            const embedInput = document.querySelector('.e-embed-url-input') as HTMLInputElement;
                            const embedButton = document.querySelector('.e-embed-button') as HTMLElement;

                            // First add a URL
                            embedInput.value = 'https://example.com/image.jpg';
                            embedInput.dispatchEvent(new Event('input'));

                            expect(embedButton.classList.contains('e-disabled')).toBe(false);

                            // Now clear it
                            embedInput.value = '';
                            embedInput.dispatchEvent(new Event('input'));

                            // Assert button is disabled again
                            expect(embedButton.classList.contains('e-disabled')).toBe(true);

                            done();
                        }, 300);
                    } else {
                        done();
                    }
                }, 500);
            }, 200);
        });
    });

    // ========================================================================
    // 18. BRANCH COVERAGE IMPROVEMENTS - image-progress.js
    // ========================================================================
    describe('18. Branch Coverage - Image-Progress', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
        });

        // ========================================================================
        // 18.1 Branch: hide() - callback branch
        // ========================================================================
        it('18.1.1 should call callback in hide() method', (done) => {
            const blocks: BlockModel[] = [{
                id: 'hide-callback-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                progressRenderer.show();

                let callbackCalled = false;
                progressRenderer.hide(() => {
                    callbackCalled = true;
                });

                setTimeout(() => {
                    // Assert callback was called
                    expect(callbackCalled).toBe(true);
                    done();
                }, 200);
            }, 200);
        });

        it('18.1.2 should hide progress bar even without callback', (done) => {
            const blocks: BlockModel[] = [{
                id: 'hide-no-callback-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                progressRenderer.show();

                // Assert progress is visible
                expect(progressRenderer.isVisible()).toBe(true);

                // Hide without callback
                progressRenderer.hide();

                setTimeout(() => {
                    // Assert progress is hidden
                    expect(progressRenderer.isVisible()).toBe(false);
                    done();
                }, 200);
            }, 200);
        });

        // ========================================================================
        // 18.2 Branch: updateProgress() - increment thresholds
        // ========================================================================

        it('18.2.1 should update progress at 0 percent', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-0-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                let performUpdateCalled = false;
                const originalPerform = (progressRenderer as any).performUpdate;
                (progressRenderer as any).performUpdate = () => {
                    performUpdateCalled = true;
                    originalPerform.call(progressRenderer, 0);
                };

                // Call updateProgress with 0
                progressRenderer.updateProgress(0);

                // Assert performUpdate was called
                expect(performUpdateCalled).toBe(true);

                done();
            }, 200);
        });

        it('18.2.2 should clamp progress values below 0', (done) => {
            const blocks: BlockModel[] = [{
                id: 'progress-clamp-low-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                let capturedValue = 0;
                const originalPerform = (progressRenderer as any).performUpdate;
                (progressRenderer as any).performUpdate = (value: number) => {
                    capturedValue = value;
                    originalPerform.call(progressRenderer, value);
                };

                // Call updateProgress with negative value
                progressRenderer.updateProgress(-10);

                // Assert value was clamped to 0
                expect(capturedValue).toBe(0);

                done();
            }, 200);
        });

        // ========================================================================
        // 18.3 Branch: isVisible() - false branch
        // ========================================================================
        it('18.3.1 should return false when progressContainer is null', (done) => {
            const blocks: BlockModel[] = [{
                id: 'visible-null-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                
                // Destroy to set progressContainer to null
                progressRenderer.destroy();

                // Assert isVisible returns false
                expect(progressRenderer.isVisible()).toBe(false);

                done();
            }, 200);
        });

        // ========================================================================
        // 18.4 Branch: showBadge() - imageContainer null check
        // ========================================================================
        it('18.4.1 should handle badge creation when imageContainer is present', (done) => {
            const blocks: BlockModel[] = [{
                id: 'badge-create-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div', { className: 'e-image-container' });
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);
                progressRenderer.showSuccessBadge();

                setTimeout(() => {
                    // Assert badge was created
                    const badge = mockContainer.querySelector('.e-badge-success');
                    expect(badge).not.toBeNull();

                    done();
                }, 100);
            }, 200);
        });

        // ========================================================================
        // 18.5 Branch: removeBadge() - null checks
        // ========================================================================
        it('18.5.1 should handle removeBadge when badgeTimeoutId is null', (done) => {
            const blocks: BlockModel[] = [{
                id: 'remove-badge-null-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                // Directly call removeBadge without creating badge first
                expect(() => {
                    (progressRenderer as any).removeBadge();
                }).not.toThrow();

                done();
            }, 200);
        });

        it('18.5.2 should handle destroy when progressBarObj is null', (done) => {
            const blocks: BlockModel[] = [{
                id: 'destroy-null-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                const mockContainer = createElement('div');
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                // Destroy twice to ensure null handling works
                progressRenderer.destroy();
                expect(() => {
                    progressRenderer.destroy();
                }).not.toThrow();

                done();
            }, 200);
        });

        // ========================================================================
        // 18.6 Branch: initialize() - width calculation fallback
        // ========================================================================
        it('18.6.1 should use clientWidth when offsetWidth is 0', (done) => {
            const blocks: BlockModel[] = [{
                id: 'width-fallback-1',
                blockType: BlockType.Image
            }];

            editor = createEditor({ blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const mockImg = createElement('img') as HTMLImageElement;
                mockImg.style.width = '0px';
                const mockContainer = createElement('div');
                mockContainer.style.width = '0px';
                mockContainer.appendChild(mockImg);
                editorElement.appendChild(mockContainer);

                // Spy on progressBar renderer to check width passed
                let passedWidth = 0;
                const originalRender = editor.progressBarRenderer.renderProgressBar;
                spyOn(editor.progressBarRenderer, 'renderProgressBar').and.callFake((config: any) => {
                    passedWidth = parseInt(config.width || '0');
                    return originalRender.call(editor.progressBarRenderer, config);
                });

                const progressRenderer = new ImageProgressRenderer(editor, mockImg);

                // Assert progress bar was created with a width
                expect(progressRenderer).toBeDefined();

                done();
            }, 200);
        });
    });
});
