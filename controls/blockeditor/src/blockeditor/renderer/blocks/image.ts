import { BlockAction } from '../../actions/index';
import { BlockEditor, BlockType } from '../../base/index';
import { BlockModel } from '../../models/index';
import { ImageSettingsModel, SaveFormat } from '../../models/block/index';
import { generateUniqueId, getBlockContentElement, getBlockModelById } from '../../utils/index';
import { appendDocumentNodes } from './block-utils';
import { detach, formatUnit } from '@syncfusion/ej2-base';

// Constants
const MIN_IMAGE_WIDTH: number = 40;
const MIN_IMAGE_HEIGHT: number = 40;
const DEFAULT_IMAGE_WIDTH: string = 'auto';
const DEFAULT_IMAGE_HEIGHT: string = 'auto';
const RESIZE_HANDLE_SIZE: number = 8;
const ALLOWED_IMAGE_TYPES: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

export class ImageRenderer {
    private editor: BlockEditor;
    private isResizing: boolean = false;
    private startDimensions: { width: number, height: number };
    private startPosition: { x: number, y: number };
    private aspectRatio: number;
    private currentResizeHandle: HTMLElement;
    private currentImage: HTMLImageElement;
    private resizeOverlay: HTMLElement;
    private animationFrameId: number;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on('documentClick', this.handleDocumentClick, this);
    }

    private removeEventListeners(): void {
        this.editor.off('documentClick', this.handleDocumentClick);
    }

    private handleDocumentClick(args: MouseEvent): void {
        const target: HTMLElement = event.target as HTMLElement;
        const isImageClick: boolean =
            target.matches('img') || target.getAttribute('data-block-type') === 'Image';
        const images: NodeListOf<HTMLImageElement> =
            this.editor.element.querySelectorAll<HTMLImageElement>('img');
        images.forEach((image: HTMLImageElement): void => {
            const isTargetImage: boolean = image === target || target.contains(image);
            const resizeHandles: NodeListOf<HTMLElement> =
                image.parentElement.querySelectorAll<HTMLElement>('.e-image-rsz-handle');
            if (isImageClick && isTargetImage) {
                image.classList.add('e-image-focus');
                resizeHandles.forEach((handle: HTMLElement): void => {
                    handle.style.display = 'block';
                });
            } else {
                image.classList.remove('e-image-focus');
                resizeHandles.forEach((handle: HTMLElement): void => {
                    handle.style.display = 'none';
                });
            }
        });
    }

    public renderImage(block: BlockModel, blockElement: HTMLElement, isTransform?: boolean): HTMLElement {
        const settings: ImageSettingsModel = block.imageSettings;

        const blockId: string = block.id;

        const container: HTMLElement = this.editor.createElement('div', {
            className: 'e-image-container',
            attrs: { 'data-block-id': blockId, contenteditable: 'false' }
        });
        container.style.position = 'relative';

        const img: HTMLImageElement = this.editor.createElement('img', {
            className: `e-image-block ${settings.cssClass || ''}`,
            attrs: {
                'alt': settings.altText || '',
                'role': 'img',
                'data-block-id': blockId
            }
        }) as HTMLImageElement;

        if (settings.width) {
            img.style.width = formatUnit(settings.width);
        }
        if (settings.height) {
            img.style.height = formatUnit(settings.height);
        }
        container.appendChild(img);
        if (settings.src) {
            img.src = settings.src;
        }
        else {
            this.handleImageUpload(img, block.imageSettings);
        }
        img.addEventListener('load', () => {
            img.style.display = 'block';
            this.aspectRatio = img.naturalWidth / img.naturalHeight;
            if (!settings.readOnly) {
                this.addResizeHandles(container, img);
            }
        });
        if (settings.readOnly) {
            container.classList.add('e-readonly');
        }
        if (settings.altText) {
            img.setAttribute('aria-label', settings.altText);
        }
        if (isTransform) {
            setTimeout(() => {
                appendDocumentNodes(blockElement, container, getBlockContentElement(blockElement));
            });
        }
        return container;
    }

    private handleImageUpload(img: HTMLImageElement, settings: ImageSettingsModel): void {
        const fileInput: HTMLInputElement = this.editor.createElement('input', {
            attrs: {
                type: 'file',
                accept: settings.allowedTypes.join(',')
            }
        }) as HTMLInputElement;

        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        const handleFileChange: () => void = async(): Promise<void> => {
            const file: File = fileInput.files[0];

            if (!file) {
                document.body.removeChild(fileInput);
                return;
            }
            const fileExtension: string = '.' + file.name.split('.').pop().toLowerCase();
            if (settings.allowedTypes.indexOf(fileExtension) === -1) {
                document.body.removeChild(fileInput);
                return;
            }

            // this.handleFileReaderForImage(file, img, settings);
            const src: string = await this.getImageSrcFromFile(file, settings.saveFormat);
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            img.src = settings.src = src;
            (this.editor as any).isProtectedOnChange = prevOnChange;
            /* eslint-enable @typescript-eslint/no-explicit-any */

            fileInput.removeEventListener('change', handleFileChange);
            if (fileInput.parentNode) {
                fileInput.parentNode.removeChild(fileInput);
            }
        };

        fileInput.addEventListener('change', handleFileChange);
        fileInput.click();
    }

    public async handleFilePaste(file: File | Blob): Promise<void> {
        const blockElement: HTMLElement = this.editor.currentFocusedBlock;
        const block: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        const src: string = await this.getImageSrcFromFile(file, block.imageSettings.saveFormat);
        const fileName: string = (file instanceof File) ? file.name : `image-${Date.now()}`;

        let transformedParagraph: HTMLElement = blockElement;
        if (((blockElement.textContent.length > 0))) {
            transformedParagraph = this.editor.blockAction.addNewBlock({
                targetBlock: blockElement,
                blockType: 'Paragraph'
            });
        }
        const paragraphModel: BlockModel = getBlockModelById(transformedParagraph.id, this.editor.blocksInternal);
        paragraphModel.imageSettings.src = src;
        paragraphModel.imageSettings.altText = fileName;
        this.editor.blockAction.transformBlock({
            block: paragraphModel,
            blockElement: transformedParagraph,
            newBlockType: 'Image'
        });
    }

    private async getImageSrcFromFile(file: File | Blob, saveFormat: SaveFormat): Promise<string> {
        const format: string = saveFormat.toLowerCase();

        if (format === 'base64') {
            return new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
                const reader: FileReader = new FileReader();

                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                reader.onload = (event: any): void => {
                    resolve((event.target as FileReader).result as string);
                };

                reader.onerror = (): void => {
                    reject(new Error('Failed to read image as base64.'));
                };

                reader.readAsDataURL(file);
            });
        } else {
            return URL.createObjectURL(file);
        }
    }

    private addResizeHandles(container: HTMLElement, img: HTMLImageElement): void {
        const existingHandles: NodeListOf<Element> = container.querySelectorAll('.e-image-rsz-handle');
        existingHandles.forEach((handle: Element) => container.removeChild(handle));
        const positions: string[] = ['nw', 'ne', 'se', 'sw'];
        positions.forEach((pos: string) => {
            const handle: HTMLElement = this.editor.createElement('div', {
                className: `e-image-rsz-handle e-resize-${pos}`
            });
            Object.assign(handle.style, {
                position: 'absolute',
                width: `${RESIZE_HANDLE_SIZE}px`,
                height: `${RESIZE_HANDLE_SIZE}px`,
                backgroundColor: '#0078d4',
                borderRadius: '50%',
                zIndex: '100'
            });

            handle.style.cursor = ['nw', 'se'].indexOf(pos) !== -1 ? 'nwse-resize' : 'nesw-resize';
            if (img.clientWidth > 0 || img.clientHeight > 0) {
                container.style.width = formatUnit(img.clientWidth);
                container.style.height = formatUnit(img.clientHeight);
            }
            img.classList.add('e-image-focus');
            handle.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                this.startImageResize(e, img, handle);
            });
            container.appendChild(handle);
        });
    }

    private startImageResize(e: MouseEvent, img: HTMLImageElement, handle: HTMLElement): void {
        this.isResizing = true;
        this.currentResizeHandle = handle;
        this.currentImage = img;

        this.startDimensions = {
            width: img.offsetWidth,
            height: img.offsetHeight
        };

        this.startPosition = {
            x: e.clientX,
            y: e.clientY
        };

        this.resizeOverlay = this.editor.createElement('div');
        Object.assign(this.resizeOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '9999',
            cursor: handle.style.cursor
        });
        document.body.appendChild(this.resizeOverlay);

        document.addEventListener('mousemove', this.handleImageResize);
        document.addEventListener('mouseup', this.stopImageResize);
    }

    private handleImageResize = (e: MouseEvent): void => {
        const allowedTarget: HTMLElement = this.editor.element as HTMLElement;
        if (!allowedTarget.contains(e.target as Node) && (!this.isResizing)) {
            return;
        }

        const dx: number = e.clientX - this.startPosition.x;
        const dy: number = e.clientY - this.startPosition.y;
        const position: string = this.currentResizeHandle.className.split('e-resize-')[1];

        let newWidth: number = this.startDimensions.width;
        let newHeight: number = this.startDimensions.height;

        switch (position) {
        case 'se': newWidth += dx; newHeight += dy; break;
        case 'sw': newWidth -= dx; newHeight += dy; break;
        case 'ne': newWidth += dx; newHeight -= dy; break;
        case 'nw': newWidth -= dx; newHeight -= dy; break;
        }

        newWidth = Math.max(newWidth, MIN_IMAGE_WIDTH);
        newHeight = Math.max(newHeight, MIN_IMAGE_HEIGHT);

        if (this.aspectRatio) {
            const widthChange: number = Math.abs(newWidth - this.startDimensions.width);
            const heightChange: number = Math.abs(newHeight - this.startDimensions.height);

            if (widthChange >= heightChange) {
                newHeight = newWidth / this.aspectRatio;
            } else {
                newWidth = newHeight * this.aspectRatio;
            }
        }

        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(() => {
            if (this.currentImage && this.currentImage.parentElement) {
                this.currentImage.style.width = this.currentImage.parentElement.style.width = formatUnit(newWidth);
                this.currentImage.style.height = this.currentImage.parentElement.style.height = formatUnit(newHeight);
            }
        });
    };

    private stopImageResize = (): void => {
        if (!this.isResizing) {
            return;
        }

        document.removeEventListener('mousemove', this.handleImageResize);
        document.removeEventListener('mouseup', this.stopImageResize);

        if (this.resizeOverlay && this.resizeOverlay.parentNode) {
            document.body.removeChild(this.resizeOverlay);
        }
        this.isResizing = false;
        this.currentResizeHandle = null;
        this.currentImage = null;
    };

    public destroy(): void {
        this.removeEventListeners();
        if (this.resizeOverlay && this.resizeOverlay.parentNode) {
            document.body.removeChild(this.resizeOverlay);
        }
    }
}
