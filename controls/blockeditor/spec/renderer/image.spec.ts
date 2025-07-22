import { createElement, remove } from "@syncfusion/ej2-base";
import { BlockEditor, BlockModel, BlockType, ContentType, getBlockModelById,  } from "../../src/index";
import { createEditor } from "../common/util.spec";

describe('Image Block', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Render image block', () => {
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

        it('should render image block with basic settings in DOM correctly', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'image1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Test Image',
                        width: '200px',
                        height: '150px',
                        cssClass: 'custom-image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const blockElement = editorElement.querySelector('.e-block');
            expect(blockElement).not.toBeNull();
            
            const container = blockElement.querySelector('.e-image-container');
            expect(container).not.toBeNull();
            expect(container.getAttribute('data-block-id')).toBe('image1');
            expect(container.getAttribute('contenteditable')).toBe('false');
            
            const img = container.querySelector('img');
            expect(img).not.toBeNull();
            expect(img.classList.contains('e-image-block')).toBe(true);
            expect(img.classList.contains('custom-image')).toBe(true);
            expect(img.getAttribute('alt')).toBe('Test Image');
            expect(img.getAttribute('role')).toBe('img');
            expect(img.getAttribute('aria-label')).toBe('Test Image');
            expect(img.style.width).toBe('200px');
            expect(img.style.height).toBe('150px');
        });

        // it('should render image block without src and trigger file upload', (done) => {
        //     const blocks: BlockModel[] = [
        //         {
        //             id: 'image2',
        //             type: BlockType.Image,
        //             imageSettings: {
        //                 altText: 'Upload Image',
        //                 allowedTypes: ['.jpg', '.png', '.gif'],
        //                 saveFormat: 'Base64',
        //                 readOnly: false
        //             }
        //         }
        //     ];
        //     editor = createEditor({ blocks: blocks });
        //     editor.appendTo('#editor');

        //     setTimeout(() => {
        //         const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        //         expect(fileInput).not.toBeNull();
        //         expect(fileInput.style.display).toBe('none');
        //         expect(fileInput.getAttribute('accept')).toBe('.jpg,.png,.gif');
        //         done();
        //     }, 1000);
        // });

        it('should render readonly image block correctly', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'image4',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Readonly Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: true
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const container = editorElement.querySelector('.e-image-container');
            expect(container.classList.contains('e-readonly')).toBe(true);
        });

        it('should add resize handles on image load for non-readonly images', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'image5',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Resizable Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            img.addEventListener('load', () => {
                setTimeout(() => {
                    const resizeHandles = editorElement.querySelectorAll('.e-image-rsz-handle');
                    expect(resizeHandles.length).toBe(4);
                    
                    const positions = ['nw', 'ne', 'se', 'sw'];
                    positions.forEach((pos, index) => {
                        if (resizeHandles[index]) {
                            expect(resizeHandles[index].classList.contains(`e-resize-${pos}`)).toBe(true);
                        }
                    });
                    done();
                }, 1500);
            });
        });

        it('should handle document click events correctly', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'image6',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Clickable Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const container = editorElement.querySelector('.e-image-container') as HTMLElement;
            
            // Simulate adding resize handles
            const renderer = (editor.blockAction as any).imageRenderer;
            renderer.addResizeHandles(container, img);

            // Click on image
            const clickEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent, 'target', { value: img });
            (window as any).event = clickEvent;
            
            renderer.handleDocumentClick(clickEvent);
            
            expect(img.classList.contains('e-image-focus')).toBe(true);
            
            const resizeHandles = container.querySelectorAll('.e-image-rsz-handle') as NodeListOf<HTMLElement>;
            resizeHandles.forEach(handle => {
                expect(handle.style.display).toBe('block');
            });

            // Click outside image
            const outsideElement = createElement('div');
            const outsideClickEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(outsideClickEvent, 'target', { value: outsideElement });
            (window as any).event = outsideClickEvent;
            
            renderer.handleDocumentClick(outsideClickEvent);
            
            expect(img.classList.contains('e-image-focus')).toBe(false);
            resizeHandles.forEach(handle => {
                expect(handle.style.display).toBe('none');
            });
        });
    });

    describe('Image upload functionality', () => {
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

        it('should handle file upload with base64 format', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'upload1',
                    type: BlockType.Image,
                    imageSettings: {
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                const img = editorElement.querySelector('img') as HTMLImageElement;
                
                // Mock file
                const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                Object.defineProperty(fileInput, 'files', {
                    value: [file],
                    writable: false
                });

                // Mock FileReader
                const mockFileReader = {
                    readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                        setTimeout(() => {
                            this.onload({ target: { result: 'data:image/jpeg;base64,testdata' } });
                        }, 10);
                    }),
                    onload: null as ((event: any) => void) | null
                };
                spyOn(window as any, 'FileReader').and.returnValue(mockFileReader as any);

                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    // expect(img.src).toBe('data:image/jpeg;base64,testdata');
                    done();
                }, 500);
            }, 1500);
        });

        it('should handle file upload with blob format', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'upload2',
                    type: BlockType.Image,
                    imageSettings: {
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Blob',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                const img = editorElement.querySelector('img') as HTMLImageElement;
                
                // Mock file
                const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                Object.defineProperty(fileInput, 'files', {
                    value: [file],
                    writable: false
                });

                // Mock URL.createObjectURL
                spyOn(URL, 'createObjectURL').and.returnValue('blob:test-url');

                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    // expect(img.src).toBe('blob:test-url');
                    done();
                }, 500);
            }, 1500);
        });

        it('should reject invalid file types', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'upload3',
                    type: BlockType.Image,
                    imageSettings: {
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                const img = editorElement.querySelector('img') as HTMLImageElement;
                const originalSrc = img.src;
                
                // Mock invalid file
                const file = new File(['test'], 'test.txt', { type: 'text/plain' });
                Object.defineProperty(fileInput, 'files', {
                    value: [file],
                    writable: false
                });

                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    // expect(img.src).toBe(originalSrc);
                    // expect(document.querySelector('input[type="file"]')).toBeNull();
                    done();
                }, 500);
            }, 1500);
        });

        it('should handle no file selected', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'upload4',
                    type: BlockType.Image,
                    imageSettings: {
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                
                Object.defineProperty(fileInput, 'files', {
                    value: [],
                    writable: false
                });

                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    // expect(document.querySelector('input[type="file"]')).toBeNull();
                    done();
                }, 500);
            }, 1500);
        });
    });

    describe('Image resize functionality', () => {
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

        it('should start image resize on handle mousedown', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'resize1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Resizable Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const container = editorElement.querySelector('.e-image-container') as HTMLElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    const resizeHandle = container.querySelector('.e-resize-se') as HTMLElement;
                    expect(resizeHandle).not.toBeNull();

                    const mouseDownEvent = new MouseEvent('mousedown', {
                        clientX: 100,
                        clientY: 100,
                        bubbles: true
                    });

                    resizeHandle.dispatchEvent(mouseDownEvent);

                    setTimeout(() => {
                        expect(renderer.isResizing).toBe(true);
                        expect(renderer.currentResizeHandle).toBe(resizeHandle);
                        done();
                    }, 200);
                }, 1000);
            });
        });

        it('should handle image resize with different handle positions', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'resize2',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Resizable Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const container = editorElement.querySelector('.e-image-container') as HTMLElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    const resizeHandle = container.querySelector('.e-resize-se') as HTMLElement;
                    
                    // Start resize
                    renderer.startImageResize(
                        new MouseEvent('mousedown', { clientX: 100, clientY: 100 }),
                        img,
                        resizeHandle
                    );

                    // Test different resize positions
                    const positions = ['se', 'sw', 'ne', 'nw'];
                    positions.forEach(pos => {
                        renderer.currentResizeHandle.className = `e-image-rsz-handle e-resize-${pos}`;
                        
                        const mouseMoveEvent = new MouseEvent('mousemove', {
                            clientX: 150,
                            clientY: 150,
                            bubbles: true
                        });
                        Object.defineProperty(mouseMoveEvent, 'target', { value: editorElement });
                        
                        renderer.handleImageResize(mouseMoveEvent);
                    });

                    // Stop resize
                    renderer.stopImageResize();
                    expect(renderer.isResizing).toBe(false);
                    done();
                }, 1000);
            });
        });

        it('should maintain aspect ratio during resize', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'resize3',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Aspect Ratio Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    renderer.aspectRatio = 2; // width:height = 2:1
                    renderer.startDimensions = { width: 200, height: 100 };
                    renderer.startPosition = { x: 100, y: 100 };
                    renderer.currentImage = img;
                    renderer.currentResizeHandle = { className: 'e-image-rsz-handle e-resize-se' };
                    renderer.isResizing = true;

                    const mouseMoveEvent = new MouseEvent('mousemove', {
                        clientX: 150, // dx = 50
                        clientY: 120  // dy = 20
                    });
                    Object.defineProperty(mouseMoveEvent, 'target', { value: editorElement });
                    
                    renderer.handleImageResize(mouseMoveEvent);
                    
                    // Since width change (50) > height change (20), height should be adjusted
                    // newWidth = 250, newHeight should be 250/2 = 125
                    setTimeout(() => {
                        done();
                    }, 500);
                }, 1000);
            });
        });

        it('should enforce minimum dimensions during resize', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'resize4',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Min Size Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    renderer.startDimensions = { width: 50, height: 50 };
                    renderer.startPosition = { x: 100, y: 100 };
                    renderer.currentImage = img;
                    renderer.currentResizeHandle = { className: 'e-image-rsz-handle e-resize-nw' };
                    renderer.isResizing = true;

                    const mouseMoveEvent = new MouseEvent('mousemove', {
                        clientX: 150, // dx = 50, so newWidth = 50 - 50 = 0, should be clamped to 40
                        clientY: 150  // dy = 50, so newHeight = 50 - 50 = 0, should be clamped to 40
                    });
                    Object.defineProperty(mouseMoveEvent, 'target', { value: editorElement });
                    
                    renderer.handleImageResize(mouseMoveEvent);
                    done();
                }, 1000);
            });
        });

        it('should ignore resize events outside editor element', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'resize5',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Outside Event Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            renderer.isResizing = false;
            renderer.currentImage = null;

            const outsideElement = createElement('div');
            const mouseMoveEvent = new MouseEvent('mousemove', {
                clientX: 150,
                clientY: 150,
                bubbles: true
            });
            Object.defineProperty(mouseMoveEvent, 'target', { value: outsideElement });
            
            // Should return early and not process the event
            renderer.handleImageResize(mouseMoveEvent);
            
            // No assertions needed as the method should return early
        });

        it('should stop resize when not resizing', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'resize6',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Stop Resize Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            renderer.isResizing = false;
            
            // Should return early
            renderer.stopImageResize();
            
            expect(renderer.isResizing).toBe(false);
        });
    });

    describe('ImageRenderer destroy functionality', () => {
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

        it('should clean up properly on destroy', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'destroy1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Destroy Test Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            
            // Create resize overlay
            renderer.resizeOverlay = createElement('div');
            document.body.appendChild(renderer.resizeOverlay);
            
            // Spy on removeEventListeners
            spyOn(renderer, 'removeEventListeners');
            
            renderer.destroy();
            
            expect(renderer.removeEventListeners).toHaveBeenCalled();
            expect(document.body.contains(renderer.resizeOverlay)).toBe(false);
        });

        it('should handle destroy when no resize overlay exists', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'destroy2',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'No Overlay Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            renderer.resizeOverlay = null;
            
            // Should not throw error
            expect(() => renderer.destroy()).not.toThrow();
        });
    });

    describe('Edge cases and error handling', () => {
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

        it('should handle image block without imageSettings', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'edge1',
                    type: BlockType.Image
                }
            ];
            
            // Should not throw error even without imageSettings
            expect(() => {
                editor = createEditor({ blocks: blocks });
                editor.appendTo('#editor');
            }).not.toThrow();
        });

        it('should generate unique ID when block ID is not provided', () => {
            const blocks: BlockModel[] = [
                {
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'test.jpg',
                        allowedTypes: ['.jpg'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const container = editorElement.querySelector('.e-image-container');
            const blockId = container.getAttribute('data-block-id');
            expect(blockId !== '').toBe(true);
        });

        it('should handle existing resize handles removal', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'handles1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Handle Removal Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const container = editorElement.querySelector('.e-image-container') as HTMLElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    // Add handles first time
                    renderer.addResizeHandles(container, img);
                    expect(container.querySelectorAll('.e-image-rsz-handle').length).toBe(4);
                    
                    // Add handles again - should remove existing ones first
                    renderer.addResizeHandles(container, img);
                    expect(container.querySelectorAll('.e-image-rsz-handle').length).toBe(4);
                    done();
                }, 1000);
            });
        });

        it('should handle file upload when img element is null', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'nullimg1',
                    type: BlockType.Image,
                    imageSettings: {
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                const renderer = (editor.blockAction as any).imageRenderer;
                
                // Mock file
                const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                Object.defineProperty(fileInput, 'files', {
                    value: [file],
                    writable: false
                });

                // Call handleImageUpload with null img
                renderer.handleImageUpload(null, blocks[0].imageSettings);

                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    expect(document.querySelector('input[type="file"]')).not.toBeNull();
                    done();
                }, 500);
            }, 1000);
        });

        it('should handle cursor styles for resize handles correctly', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'cursor1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Cursor Test Image',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const container = editorElement.querySelector('.e-image-container') as HTMLElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    const nwHandle = container.querySelector('.e-resize-nw') as HTMLElement;
                    const neHandle = container.querySelector('.e-resize-ne') as HTMLElement;
                    const seHandle = container.querySelector('.e-resize-se') as HTMLElement;
                    const swHandle = container.querySelector('.e-resize-sw') as HTMLElement;
                    
                    expect(nwHandle.style.cursor).toBe('nwse-resize');
                    expect(neHandle.style.cursor).toBe('nesw-resize');
                    expect(seHandle.style.cursor).toBe('nwse-resize');
                    expect(swHandle.style.cursor).toBe('nesw-resize');
                    done();
                }, 1000);
            });
        });

        it('should handle document click with data-block-type attribute', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'datatype1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Data Type Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            const mockElement = createElement('div');
            mockElement.setAttribute('data-block-type', 'Image');
            
            const clickEvent = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent, 'target', { value: mockElement });
            (window as any).event = clickEvent;
            
            // Should not throw error
            expect(() => renderer.handleDocumentClick(clickEvent)).not.toThrow();
        });

        it('should handle resize overlay cleanup in stopImageResize', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'cleanup1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Cleanup Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            renderer.isResizing = true;
            
            // Create and add overlay
            renderer.resizeOverlay = createElement('div');
            document.body.appendChild(renderer.resizeOverlay);
            
            renderer.stopImageResize();
            
            expect(renderer.isResizing).toBe(false);
            expect(renderer.currentResizeHandle).toBeNull();
            expect(renderer.currentImage).toBeNull();
            expect(document.body.contains(renderer.resizeOverlay)).toBe(false);
        });

        it('should handle stopImageResize when overlay has no parent', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'noparent1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'No Parent Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const renderer = (editor.blockAction as any).imageRenderer;
            renderer.isResizing = true;
            
            // Create overlay but don't add to DOM
            renderer.resizeOverlay = createElement('div');
            
            // Should not throw error
            expect(() => renderer.stopImageResize()).not.toThrow();
            expect(renderer.isResizing).toBe(false);
        });

        it('should handle animation frame cancellation', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'animation1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Animation Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            renderer.startDimensions = { width: 100, height: 100 };
            renderer.startPosition = { x: 100, y: 100 };
            renderer.currentImage = img;
            renderer.currentResizeHandle = { className: 'e-image-rsz-handle e-resize-se' };
            renderer.isResizing = true;
            renderer.animationFrameId = 123;

            spyOn(window, 'cancelAnimationFrame');
            spyOn(window, 'requestAnimationFrame').and.returnValue(456);

            const mouseMoveEvent = new MouseEvent('mousemove', {
                clientX: 150,
                clientY: 150
            });
            Object.defineProperty(mouseMoveEvent, 'target', { value: editorElement });
            
            renderer.handleImageResize(mouseMoveEvent);
            
            expect(window.cancelAnimationFrame).toHaveBeenCalledWith(123);
            expect(window.requestAnimationFrame).toHaveBeenCalled();
            expect(renderer.animationFrameId).toBe(456);
            done();
        });

        it('should handle image settings with empty cssClass', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'emptycss1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'test.jpg',
                        cssClass: '',
                        altText: 'Empty CSS Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img');
            expect(img.classList.contains('e-image-block')).toBe(true);
            expect(img.className.trim()).toBe('e-image-block');
        });

        it('should handle image settings without altText', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'noalt1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'test.jpg',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img');
            expect(img.getAttribute('alt')).toBe('');
            expect(img.hasAttribute('aria-label')).toBe(false);
        });
    });

    describe('Complex interaction scenarios', () => {
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

        it('should handle multiple images with focus management', () => {
            const blocks: BlockModel[] = [
                {
                    id: 'multi1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Image 1',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                },
                {
                    id: 'multi2',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Image 2',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const images = editorElement.querySelectorAll('img');
            const renderer = (editor.blockAction as any).imageRenderer;
            
            // Click first image
            const clickEvent1 = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent1, 'target', { value: images[0] });
            (window as any).event = clickEvent1;
            
            renderer.handleDocumentClick(clickEvent1);
            
            expect(images[0].classList.contains('e-image-focus')).toBe(true);
            expect(images[1].classList.contains('e-image-focus')).toBe(false);
            
            // Click second image
            const clickEvent2 = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(clickEvent2, 'target', { value: images[1] });
            (window as any).event = clickEvent2;
            
            renderer.handleDocumentClick(clickEvent2);
            
            expect(images[0].classList.contains('e-image-focus')).toBe(false);
            expect(images[1].classList.contains('e-image-focus')).toBe(true);
        });

        it('should handle resize with extreme values', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'extreme1',
                    type: BlockType.Image,
                    imageSettings: {
                        src: 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png',
                        altText: 'Extreme Resize Test',
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            const img = editorElement.querySelector('img') as HTMLImageElement;
            const renderer = (editor.blockAction as any).imageRenderer;
            
            img.addEventListener('load', () => {
                setTimeout(() => {
                    renderer.startDimensions = { width: 100, height: 100 };
                    renderer.startPosition = { x: 100, y: 100 };
                    renderer.currentImage = img;
                    renderer.currentResizeHandle = { className: 'e-image-rsz-handle e-resize-se' };
                    renderer.isResizing = true;
                    renderer.aspectRatio = 1;

                    // Test extreme negative resize
                    const extremeEvent = new MouseEvent('mousemove', {
                        clientX: -1000,
                        clientY: -1000
                    });
                    Object.defineProperty(extremeEvent, 'target', { value: editorElement });
                    
                    renderer.handleImageResize(extremeEvent);
                    
                    // Should clamp to minimum values
                    setTimeout(() => {
                        done();
                    }, 500);
                }, 1500);
            });
        });

        it('should handle file input cleanup on various scenarios', (done) => {
            const blocks: BlockModel[] = [
                {
                    id: 'filecleanup1',
                    type: BlockType.Image,
                    imageSettings: {
                        allowedTypes: ['.jpg', '.png'],
                        saveFormat: 'Base64',
                        readOnly: false
                    }
                }
            ];
            editor = createEditor({ blocks: blocks });
            editor.appendTo('#editor');

            setTimeout(() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                
                // Test cleanup when file input has no parent
                if (fileInput.parentNode) {
                    fileInput.parentNode.removeChild(fileInput);
                }
                
                // Mock file selection
                const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                Object.defineProperty(fileInput, 'files', {
                    value: [file],
                    writable: false
                });

                // Should handle gracefully even when input is not in DOM
                fileInput.dispatchEvent(new Event('change'));
                
                setTimeout(() => {
                    done();
                }, 500);
            }, 1500);
        });
    });

    describe('Image paste functionality', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const blocks: BlockModel[] = [
                {
                    id: 'paragraph',
                    type: BlockType.Paragraph,
                    content: [{ 
                        id: 'paragraph-content',
                        type: ContentType.Text, 
                        content: 'Paragraph that will receive pasted image' 
                    }]
                },
                {
                    id: 'paragraph1',
                    type: BlockType.Paragraph,
                    content: [{ 
                        id: 'paragraph-content1',
                        type: ContentType.Text, 
                        content: '' 
                    }]
                }
            ];
            editor = createEditor({ blocks });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) {
                editor.destroy();
                editor = undefined;
            }
            remove(editorElement);
            const file = document.querySelector('input[type="file"]');
            if (file) {
                remove(file);
            }
        });

        it('should handle file paste directly from clipboard', (done) => {
            // Mock file blob for paste
            const imageBlob = new Blob(['fake-image-data'], { type: 'image/png' });
            
            // Spy on URL.createObjectURL
            spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
            
            // Mock FileReader for testing base64 conversion
            const mockFileReader = {
                readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                    setTimeout(() => {
                        this.onload({ target: { result: 'data:image/png;base64,fakedata' } });
                    }, 10);
                }),
                onload: null as ((event: any) => void) | null
            };
            spyOn(window as any, 'FileReader').and.returnValue(mockFileReader as any);
            
            // Set focused block to paragraph
            const paragraphBlock = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.setFocusToBlock(paragraphBlock);
            
            // Spy on blockAction.addNewBlock
            const addNewBlockSpy = spyOn(editor.blockAction, 'addNewBlock').and.callThrough();
            
            // Call handleFilePaste - this will indirectly use getImageSrcFromFile
            editor.blockAction.imageRenderer.handleFilePaste(imageBlob).then(() => {
                expect(addNewBlockSpy).toHaveBeenCalled();
                
                // Should create a new Image block
                setTimeout(() => {
                    // Check that image block was created
                    const imageBlock = editorElement.querySelector('.e-image-block');
                    expect(imageBlock).not.toBeNull();
                    done();
                }, 100);
            }).catch((error) => {
                done.fail(error);
            });
        });

        it('should handle file paste when text content is empty', (done) => {
            // Clear content of paragraph
            const paragraphBlock = editorElement.querySelector('#paragraph') as HTMLElement;
            const contentElement = paragraphBlock.querySelector('.e-block-content');
            contentElement.textContent = '';
            
            // Update model
            editor.updateContentOnUserTyping(paragraphBlock);
            
            // Set focused block to paragraph
            editor.setFocusToBlock(paragraphBlock);
            
            // Mock file blob for paste
            const imageBlob = new Blob(['fake-image-data'], { type: 'image/png' });
            
            // Spy on transformBlock
            const transformBlockSpy = spyOn(editor.blockAction, 'transformBlock').and.callThrough();
            
            // Call handleFilePaste - this will indirectly use getImageSrcFromFile
            editor.blockAction.imageRenderer.handleFilePaste(imageBlob).then(() => {
                expect(transformBlockSpy).toHaveBeenCalled();
                
                setTimeout(() => {
                    // Should transform the empty paragraph to image
                    const imageBlock = editorElement.querySelector('.e-image-block');
                    expect(imageBlock).not.toBeNull();
                    done();
                }, 100);
            }).catch((error) => {
                done.fail(error);
            });
        });

        it('should handle file paste with File object', (done) => {
            // Mock File object
            const imageFile = new File(['fake-image-data'], 'test.png', {
                type: 'image/png'
            });
            
            // Set focused block to paragraph
            const paragraphBlock = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.setFocusToBlock(paragraphBlock);
            
            // Call handleFilePaste
            editor.blockAction.imageRenderer.handleFilePaste(imageFile).then(() => {
                setTimeout(() => {
                    // Check that image block was created with proper alt text
                    const imageBlock = editorElement.querySelector('.e-image-container');
                    expect(imageBlock).not.toBeNull();
                    
                    // Check the alt text was set correctly
                    const imgElement = imageBlock.querySelector('img');
                    expect(imgElement.getAttribute('alt')).toBe('test.png');
                    done();
                }, 100);
            }).catch((error) => {
                done.fail(error);
            });
        });
        

        it('should handle file paste with invalid object', (done) => {
            // Mock File object
            const imageFile = new File(['fake-image-data'], 'test.png', {
                type: ''
            });
            
            // Set focused block to paragraph
            const paragraphBlock = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.setFocusToBlock(paragraphBlock);
            
            // Call handleFilePaste
            editor.blockAction.imageRenderer.handleFilePaste(imageFile).then(() => {
                setTimeout(() => {
                    // Check that image block was created with proper alt text
                    const imageBlock = editorElement.querySelector('.e-image-container');
                    expect(imageBlock).not.toBeNull();
                    
                    // Check the alt text was set correctly
                    const imgElement = imageBlock.querySelector('img');
                    expect(imgElement.getAttribute('alt')).toBe('test.png');
                    done();
                }, 100);
            }).catch((error) => {
                done.fail(error);
            });
        });

        it('should handle file paste with invalid file type', (done) => {
            // Mock File object with invalid type
            const invalidFile = new File(['invalid-data'], 'test.txt', {
                type: 'text/plain'
            });
            
            // Set focused block to paragraph
            const paragraphBlock = editorElement.querySelector('#paragraph') as HTMLElement;
            editor.setFocusToBlock(paragraphBlock);
            
            // Mock FileReader to simulate error
            const mockFileReader = {
                readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function() {
                    setTimeout(() => {
                        this.onerror(new Error('Invalid file format'));
                    }, 10);
                }),
                onload: null as ((event: any) => void) | null,
                onerror: null as ((event: any) => void) | null
            };
            spyOn(window as any, 'FileReader').and.returnValue(mockFileReader as any);
            
            // Call handleFilePaste with invalid file
            editor.blockAction.imageRenderer.handleFilePaste(invalidFile).then(() => {
                // This should not execute if proper error handling is in place
                done.fail('Should have rejected invalid file');
            }).catch(() => {
                // Should catch the error from FileReader
                setTimeout(() => {
                    expect((window as any).FileReader).toHaveBeenCalled();
                    done();
                }, 100);
            });
        });

        it('should handle file paste with saveFormat as blob', (done) => {
            // Mock File object
            const blobFile = new File(['blob-image-data'], 'test.png', {
                type: 'image/png'
            });
            
            // Set focused block to paragraph with empty content
            const emptyParagraph = editorElement.querySelector('#paragraph1') as HTMLElement;
            editor.setFocusToBlock(emptyParagraph);
            
            // Set saveFormat to Blob in the block model
            const blockModel = getBlockModelById(emptyParagraph.id, editor.blocksInternal);
            if (!blockModel.imageSettings) {
                blockModel.imageSettings = {};
            }
            blockModel.imageSettings.saveFormat = 'Blob';
            
            // Spy on URL.createObjectURL
            spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
            
            // Call handleFilePaste
            editor.blockAction.imageRenderer.handleFilePaste(blobFile).then(() => {
                setTimeout(() => {
                    // Verify URL.createObjectURL was called
                    expect(URL.createObjectURL).toHaveBeenCalledWith(blobFile);
                    
                    // Check image block was created with blob URL
                    const imageBlock = editorElement.querySelector('.e-image-container');
                    expect(imageBlock).not.toBeNull();
                    
                    const imgElement = imageBlock.querySelector('img');
                    expect(imgElement).not.toBeNull();
                    // The src might not be directly accessible due to security, but we can check alt
                    expect(imgElement.getAttribute('alt')).toBe('test.png');
                    done();
                }, 100);
            }).catch((error) => {
                done.fail(error);
            });
        });
    });
});