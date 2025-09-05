import { BlockEditor } from '../../base/index';
import { BlockModel, ImageProps } from '../../models/index';
import { BlockType, SaveFormat } from '../../base/enums';
import { getBlockModelById } from '../../utils/index';
import { formatUnit } from '@syncfusion/ej2-base';
import { events } from '../../base/constant';

// Constants
const MIN_IMAGE_WIDTH: number = 40;
const MIN_IMAGE_HEIGHT: number = 40;
const RESIZE_HANDLE_SIZE: number = 8;

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
        this.editor.on(events.documentClick, this.handleDocumentClick, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.documentClick, this.handleDocumentClick);
    }

    /**
     * Renders a image block
     *
     * @param {BlockModel} block - The block model containing data.
     * @returns {HTMLElement} - The rendered image block element.
     * @hidden
     */
    public renderImage(block: BlockModel): HTMLElement {
        const settings: ImageProps = block.props as ImageProps;

        const { container, img }: { container: HTMLElement; img: HTMLImageElement } = this.createImageContainer(block);
        this.configureImageElement(img, settings);

        container.appendChild(img);
        return container;
    }

    private createImageContainer(block: BlockModel): { container: HTMLElement; img: HTMLImageElement } {
        const container: HTMLElement = this.editor.createElement('div', {
            className: 'e-image-container',
            attrs: { 'data-block-id': block.id, contenteditable: 'false' }
        });
        container.style.position = 'relative';
        if ((block.props as ImageProps).readOnly) {
            container.classList.add('e-readonly');
        }

        const img: HTMLImageElement = this.editor.createElement('img', {
            className: `e-image-block ${(block.props as ImageProps).cssClass || ''}`,
            attrs: { 'alt': (block.props as ImageProps).altText || '', 'role': 'img', 'data-block-id': block.id }
        }) as HTMLImageElement;

        return { container, img };
    }

    private configureImageElement(img: HTMLImageElement, settings: ImageProps): void {
        if (settings.width) {
            img.style.width = formatUnit(settings.width);
        }
        if (settings.height) {
            img.style.height = formatUnit(settings.height);
        }
        if (settings.src) {
            img.src = settings.src;
        } else {
            this.handleImageUpload(img, settings);
        }
        if (settings.altText) {
            img.setAttribute('aria-label', settings.altText);
        }
        img.addEventListener('load', () => {
            img.style.display = 'block';
            this.aspectRatio = img.naturalWidth / img.naturalHeight;
            if (!settings.readOnly) {
                this.addResizeHandles(img.parentElement, img);
            }
        });
    }

    handleImageUpload(img: HTMLImageElement, settings: ImageProps): void {
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

            const src: string = await this.getImageSrcFromFile(file, settings.saveFormat);
            img.src = settings.src = src;

            fileInput.removeEventListener('change', handleFileChange);
            if (fileInput.parentNode) {
                fileInput.parentNode.removeChild(fileInput);
            }
        };

        fileInput.addEventListener('change', handleFileChange);
        fileInput.click();
    }

    private handleDocumentClick(mouseEvent: MouseEvent): void {
        const target: HTMLElement = mouseEvent.target as HTMLElement;
        const isImageClick: boolean = target.matches('img') || target.getAttribute('data-block-type') === BlockType.Image;
        const images: NodeListOf<HTMLImageElement> = this.editor.element.querySelectorAll<HTMLImageElement>('img');

        for (const image of Array.from(images)) {
            const isTargetImage: boolean = image === target || target.contains(image);
            const resizeHandles: NodeListOf<HTMLElement> = image.parentElement.querySelectorAll('.e-image-rsz-handle');
            for (const handle of Array.from(resizeHandles)) {
                handle.style.display = isImageClick && isTargetImage ? 'block' : 'none';
            }
            image.classList.toggle('e-image-focus', isImageClick && isTargetImage);
        }
    }

    /**
     * Handles the paste event for images.
     *
     * @param {File | Blob} file - The file or blob to be pasted.
     * @returns {Promise<void>} - A promise that resolves when the image is pasted.
     * @hidden
     */
    public async handleFilePaste(file: File | Blob): Promise<void> {
        const blockElement: HTMLElement = this.editor.currentFocusedBlock;
        const block: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        const saveFormat: SaveFormat = block.props ? (block.props as ImageProps).saveFormat : null;
        const src: string = await this.getImageSrcFromFile(file, (saveFormat || 'Base64'));
        const fileName: string = (file instanceof File) ? file.name : `image-${Date.now()}`;

        let transformedParagraph: HTMLElement = blockElement;
        if (((blockElement.textContent.length > 0))) {
            transformedParagraph = this.editor.blockCommandManager.addNewBlock({
                targetBlock: blockElement,
                blockType: BlockType.Paragraph
            });
        }

        this.editor.blockRendererManager.transformBlock({
            block: getBlockModelById(transformedParagraph.id, this.editor.getEditorBlocks()),
            blockElement: transformedParagraph,
            newBlockType: BlockType.Image,
            props: { src: src, altText: fileName }
        });
    }

    private async getImageSrcFromFile(file: File | Blob, saveFormat: SaveFormat): Promise<string> {
        const format: string = saveFormat.toLowerCase();

        if (format === 'base64') {
            return new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
                const reader: FileReader = new FileReader();
                reader.onload = (event: any): void => { resolve((event.target as FileReader).result as string); };
                reader.onerror = (): void => { reject(new Error('Failed to read image as base64.')); };
                reader.readAsDataURL(file);
            });
        } else {
            return URL.createObjectURL(file);
        }
    }

    private createResizeHandle(pos: string, img: HTMLImageElement): HTMLElement {
        const handle: HTMLElement = this.editor.createElement('div', {
            className: `e-image-rsz-handle e-resize-${pos}`
        });
        Object.assign(handle.style, {
            position: 'absolute',
            width: `${RESIZE_HANDLE_SIZE}px`,
            height: `${RESIZE_HANDLE_SIZE}px`,
            backgroundColor: '#0078d4',
            borderRadius: '50%',
            zIndex: '100',
            cursor: ['nw', 'se'].indexOf(pos) !== -1 ? 'nwse-resize' : 'nesw-resize'
        });
        handle.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.startImageResize(e, img, handle);
        });
        return handle;
    }

    private addResizeHandles(container: HTMLElement, img: HTMLImageElement): void {
        const existingHandles: NodeListOf<Element> = container.querySelectorAll('.e-image-rsz-handle');
        existingHandles.forEach((handle: Element) => container.removeChild(handle));
        const positions: string[] = ['nw', 'ne', 'se', 'sw'];

        for (const pos of positions) {
            const handle: HTMLElement = this.createResizeHandle(pos, img);
            container.appendChild(handle);
        }
        if (img.clientWidth > 0 || img.clientHeight > 0) {
            container.style.width = formatUnit(img.clientWidth);
            container.style.height = formatUnit(img.clientHeight);
        }
        img.classList.add('e-image-focus');
    }

    private startImageResize(e: MouseEvent, img: HTMLImageElement, handle: HTMLElement): void {
        this.isResizing = true;
        this.currentResizeHandle = handle;
        this.currentImage = img;
        this.startDimensions = { width: img.offsetWidth, height: img.offsetHeight };
        this.startPosition = { x: e.clientX, y: e.clientY };
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
        if (!allowedTarget.contains(e.target as Node) && (!this.isResizing)) { return; }

        const dx: number = e.clientX - this.startPosition.x;
        const dy: number = e.clientY - this.startPosition.y;
        const position: string = this.currentResizeHandle.className.split('e-resize-')[1];
        const { newWidth, newHeight }: { newWidth: number; newHeight: number } = this.calculateNewDimensions(dx, dy, position);

        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(() => {
            if (this.currentImage && this.currentImage.parentElement) {
                this.currentImage.style.width = this.currentImage.parentElement.style.width = formatUnit(newWidth);
                this.currentImage.style.height = this.currentImage.parentElement.style.height = formatUnit(newHeight);
            }
        });
    }

    private calculateNewDimensions(dx: number, dy: number, position: string): { newWidth: number; newHeight: number } {
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

        return { newWidth, newHeight };
    }

    private stopImageResize = (): void => {
        if (!this.isResizing) { return; }

        document.removeEventListener('mousemove', this.handleImageResize);
        document.removeEventListener('mouseup', this.stopImageResize);

        if (this.resizeOverlay && this.resizeOverlay.parentNode) {
            document.body.removeChild(this.resizeOverlay);
        }
        this.isResizing = false;
        this.currentResizeHandle = null;
        this.currentImage = null;
    }

    public destroy(): void {
        this.removeEventListeners();
        if (this.resizeOverlay && this.resizeOverlay.parentNode) {
            document.body.removeChild(this.resizeOverlay);
        }
    }
}
