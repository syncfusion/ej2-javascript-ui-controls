import { createElement, formatUnit, updateCSSText, detach, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { BlockModel, FileUploadSuccessEventArgs, IImageBlockSettings, ImageBlockSettingsModel } from '../../../models/index';
import { BlockType } from '../../../models/enums';
import { SaveFormat } from '../../../models/types';
import { getBlockModelById, decoupleReference } from '../../../common/utils/index';
import { events } from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';
import { IPopupRenderOptions } from '../../../common/interface';
import { IFileUploadSuccessEventArgs } from '../../base/interface';

// Constants
const MIN_IMAGE_WIDTH: number = 40;
const MIN_IMAGE_HEIGHT: number = 40;
const RESIZE_HANDLE_SIZE: number = 8;

export class ImageRenderer {
    private parent: BlockManager;
    private isResizing: boolean = false;
    private startDimensions: { width: number, height: number };
    private startPosition: { x: number, y: number };
    public aspectRatio: number;
    private currentResizeHandle: HTMLElement;
    private currentImage: HTMLImageElement;
    private resizeOverlay: HTMLElement;
    private animationFrameId: number;
    private uploadPopupObj: Popup | null;
    private uploadPopupElement: HTMLElement | null;
    private currentPlaceholder: HTMLElement | null;
    private isUploadPopupOpen: boolean;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.uploadPopupObj = null;
        this.uploadPopupElement = null;
        this.currentPlaceholder = null;
        this.isUploadPopupOpen = false;
        this.addEventListeners();
        // Create upload popup during initialization to ensure uploader is ready
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.documentClick, this.handleDocumentClick, this);
        this.parent.observer.on('modulesInitialized', this.createUploadPopup, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.documentClick, this.handleDocumentClick);
        this.parent.observer.off('modulesInitialized', this.createUploadPopup);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Renders a image block
     *
     * @param {BlockModel} block - The block model containing data.
     * @returns {HTMLElement} - The rendered image block element.
     * @hidden
     */
    public renderImage(block: BlockModel): HTMLElement {
        const settings: IImageBlockSettings = block.properties as IImageBlockSettings;

        const isCallFromBlazor: boolean = isNOU((this.parent.rootEditorElement as any).ej2_instances);
        // Check if image has source - if not, render placeholder
        if (!isCallFromBlazor && (!settings.src || settings.src === '')) {
            const placeholder: HTMLElement = this.renderPlaceholder(block.id);

            // Only auto-open popup if NOT during undo/redo and NOT during initial rendering
            const isUndoRedo: boolean = this.parent.undoRedoAction.isUndoing || this.parent.undoRedoAction.isRedoing;
            if (!isUndoRedo && (this.parent.blockRenderer && !this.parent.blockRenderer.isEntireBlocksRendering)) {
                // Open upload popup after a short delay to ensure placeholder is appended in dom
                setTimeout(() => {
                    this.toggleUploadPopup(isNOU(this.parent.currentFocusedBlock), placeholder);
                }, 100);
            }
            return placeholder;
        }

        // Render normal image if src exists
        const { container, img }: { container: HTMLElement; img: HTMLImageElement } = this.createImageContainer(block);
        this.configureImageElement(img, block);
        container.appendChild(img);
        return container;
    }

    public renderPlaceholder(blockId: string): HTMLElement {
        const placeholder: HTMLElement = createElement('div', {
            id: `${this.parent.rootEditorElement.id}_image-placeholder-${blockId}`,
            className: 'e-image-placeholder',
            attrs: {
                'role': 'button',
                'aria-label': this.parent.localeJson['imgPlaceholderAriaLabel'],
                'tabindex': '0',
                'data-block-id': blockId,
                contenteditable: 'false'
            }
        });

        // Create placeholder icon
        const iconContainer: HTMLElement = createElement('div', {
            className: 'e-placeholder-icon-container'
        });
        const icon: HTMLElement = createElement('span', {
            className: 'e-icons e-block-image-icon'
        });
        iconContainer.appendChild(icon);
        // Create placeholder text
        const textElement: HTMLElement = createElement('div', {
            className: 'e-placeholder-text',
            innerHTML: this.parent.localeJson['imagePlaceholder']
        });
        placeholder.appendChild(iconContainer);
        placeholder.appendChild(textElement);
        // Bind click event
        placeholder.addEventListener('click', this.handlePlaceholderClick.bind(this));
        // Bind keyboard events
        placeholder.addEventListener('keydown', this.handlePlaceholderKeydown.bind(this));

        return placeholder;
    }

    private handlePlaceholderClick(event: MouseEvent): void {
        event.preventDefault();
        const target: HTMLElement = event.currentTarget as HTMLElement;
        if (this.currentPlaceholder !== target) {
            this.toggleUploadPopup(false, target);
        }
        else {
            this.toggleUploadPopup(true);
            this.currentPlaceholder = null;
        }
    }

    private handlePlaceholderKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const target: HTMLElement = event.currentTarget as HTMLElement;
            this.toggleUploadPopup(false, target);
        }
    }

    public toggleUploadPopup(shouldHide: boolean, placeholder?: HTMLElement): void {
        if (shouldHide) {
            if (this.uploadPopupObj && this.isUploadPopupOpen) {
                this.uploadPopupObj.hide();
                this.isUploadPopupOpen = false;
                this.currentPlaceholder = null;
            }
        } else {
            if (placeholder) {
                this.currentPlaceholder = placeholder;
            }
            // Show popup
            if (this.uploadPopupObj && this.currentPlaceholder) {
                this.uploadPopupObj.relateTo = this.currentPlaceholder;
                this.parent.popupRenderer.adjustPopupPositionRelativeToTarget(
                    this.currentPlaceholder,
                    this.uploadPopupObj
                );
                this.parent.observer.notify('clearUploaderObj');
                this.uploadPopupObj.show();
                this.isUploadPopupOpen = true;
            }
        }
    }

    private createUploadPopup(): void {
        // Create popup container
        this.uploadPopupElement = createElement('div', {
            id: `${this.parent.rootEditorElement.id}_image-upload-popup`,
            className: 'e-image-upload-popup e-popup-container'
        });
        // Create popup content container
        const contentContainer: HTMLElement = createElement('div', {
            id: `${this.parent.rootEditorElement.id}_image-tab-container`,
            className: 'e-popup-content'
        });
        this.uploadPopupElement.appendChild(contentContainer);
        this.parent.rootEditorElement.appendChild(this.uploadPopupElement);
        // Notify BlockEditor to render the tab component in this container
        this.parent.observer.notify('renderImageUploader', { container: contentContainer });
        // Use PopupRenderer to create the popup
        const args: IPopupRenderOptions = {
            element: this.uploadPopupElement,
            content: contentContainer,
            width: '400px',
            height: 'auto'
        };
        this.uploadPopupObj = this.parent.popupRenderer.renderPopup(args);
        // Bind popup lifecycle events
        this.uploadPopupObj.open = this.handlePopupOpen.bind(this);
        this.uploadPopupObj.close = this.handlePopupClose.bind(this);
        // Bind escape key to close popup
        this.uploadPopupElement.addEventListener('keydown', this.handlePopupKeydown.bind(this));
        // Subscribe to image selection and upload events
        this.subscribeToImageEvents();
    }

    private subscribeToImageEvents(): void {
        // Listen for file selected event to show Base64 preview
        this.parent.observer.on('fileSelected', this.handleFileSelected, this);
        // Listen for upload success to replace with server URL
        this.parent.observer.on('fileUploadSuccess', this.handleUploadSuccess, this);
        // Listen for embed image event
        this.parent.observer.on('imageEmbedded', this.handleImageEmbedded, this);
    }

    private unsubscribeFromImageEvents(): void {
        this.parent.observer.off('fileSelected', this.handleFileSelected);
        this.parent.observer.off('fileUploadSuccess', this.handleUploadSuccess);
        this.parent.observer.off('imageEmbedded', this.handleImageEmbedded);
    }

    private handleFileSelected(args: any): void {
        if (!this.currentPlaceholder || !args.previewUrl) {
            return;
        }
        // Get the block ID from placeholder
        const blockId: string = this.currentPlaceholder.getAttribute('data-block-id') || '';
        // Replace placeholder with image preview
        this.replaceWithImage(this.currentPlaceholder, args.previewUrl, args.file.name, blockId);
        // Close the popup
        this.toggleUploadPopup(true);
    }

    private handleUploadSuccess(args: IFileUploadSuccessEventArgs): void {
        const blockElement: HTMLElement = this.parent.rootEditorElement.querySelector(`[data-block-id="${args.blockId}"]`) as HTMLElement;
        if (!blockElement) {
            return;
        }
        // Find the image element and update its src
        const imgElement: HTMLImageElement = blockElement.querySelector('img.e-image-block') as HTMLImageElement;
        if (imgElement) {
            imgElement.src = args.fileUrl;
            // Update the block model
            const block: BlockModel = getBlockModelById(args.blockId, this.parent.getEditorBlocks());
            if (block) {
                (block.properties as IImageBlockSettings).src = args.fileUrl;
            }
        }
    }

    private handleImageEmbedded(args: any): void {
        if (!this.currentPlaceholder || !args.url) {
            return;
        }
        // Get the block ID from placeholder
        const blockId: string = this.currentPlaceholder.getAttribute('data-block-id') || '';
        // Replace placeholder with image
        this.replaceWithImage(this.currentPlaceholder, args.url, 'Embedded image', blockId);
        // Close the popup
        this.toggleUploadPopup(true);
    }

    // Replaces placeholder element with actual image element using BlockCommand API.
    private replaceWithImage(placeholder: HTMLElement, imageSrc: string, altText: string, blockId: string): void {
        const blockElement: HTMLElement = placeholder.parentElement;
        if (!blockElement) {
            return;
        }
        const oldBlock: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        if (!oldBlock) {
            return;
        }
        // old block model (src empty)
        const oldBlockClone: BlockModel = decoupleReference(oldBlock);
        // Update the block with the new src
        const updatedProps: IImageBlockSettings = {
            ...oldBlock.properties as IImageBlockSettings,
            src: imageSrc,
            altText: altText
        };
        // Update the block model
        oldBlock.properties = updatedProps;
        const newBlock: BlockModel = this.parent.blockService.updateBlock(blockId, oldBlock);
        this.parent.stateManager.updateManagerBlocks();
        const newBlockClone: BlockModel = decoupleReference(newBlock);
        const newBlockElement: HTMLElement = this.parent.blockRenderer.createBlockElement(newBlock);
        // Replace the old placeholder block element with the new image block element
        blockElement.parentElement.insertBefore(newBlockElement, blockElement);
        detach(blockElement);
        this.parent.setFocusToBlock(newBlockElement);
        this.parent.undoRedoAction.trackImageInsertionForUndoRedo(blockId, oldBlockClone, newBlockClone);
        this.parent.eventService.addChange({
            action: 'Update',
            data: {
                block: newBlockClone,
                prevBlock: oldBlockClone
            }
        });
        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
        // Clear current placeholder reference
        this.currentPlaceholder = null;
    }

    private handlePopupOpen(): void {
        this.isUploadPopupOpen = true;
        // Notify BlockEditor's tab renderer via event
        this.parent.observer.notify('imagePopupOpen', {});
    }

    private handlePopupClose(): void {
        this.isUploadPopupOpen = false;
        // Notify BlockEditor's tab renderer via event
        this.parent.observer.notify('imagePopupClose', {});
    }

    private handlePopupKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.toggleUploadPopup(true);
        }
    }

    /**
     * Gets the current placeholder element.
     *
     * @returns {HTMLElement | null} The current image placeholder element
     * @hidden
     */
    public getCurrentPlaceholder(): HTMLElement | null {
        return this.currentPlaceholder;
    }

    private createImageContainer(block: BlockModel): { container: HTMLElement; img: HTMLImageElement } {
        const container: HTMLElement = createElement('div', {
            className: 'e-image-container',
            attrs: { 'data-block-id': block.id, contenteditable: 'false' }
        });
        updateCSSText(container, 'position: relative;');

        const img: HTMLImageElement = createElement('img', {
            className: 'e-image-block',
            attrs: { 'alt': (block.properties as IImageBlockSettings).altText || '', 'role': 'img', 'data-block-id': block.id }
        }) as HTMLImageElement;

        return { container, img };
    }

    private configureImageElement(img: HTMLImageElement, block: BlockModel): void {
        const settings: IImageBlockSettings = block.properties as IImageBlockSettings;
        const globalImgSettings: ImageBlockSettingsModel = this.parent.imageBlockSettings;
        updateCSSText(img, `width: ${formatUnit(settings.width ? settings.width : globalImgSettings.width)};`);
        updateCSSText(img, `height: ${formatUnit(settings.height ? settings.height : globalImgSettings.height)};`);

        const isUndoRedo: boolean = this.parent.undoRedoAction.isUndoing || this.parent.undoRedoAction.isRedoing;
        if (settings.src) {
            img.src = settings.src;
        } else {
            this.handleImageUpload(img, settings);
        }
        if (settings.altText) {
            img.setAttribute('aria-label', settings.altText);
        }
        img.addEventListener('load', () => {
            updateCSSText(img, 'display: block;');
            const minWidth: string = globalImgSettings.minWidth ? `min-width: ${formatUnit(globalImgSettings.minWidth)};` : '';
            const minHeight: string = globalImgSettings.minHeight ? `min-height: ${formatUnit(globalImgSettings.minHeight)};` : '';
            const maxWidth: string = globalImgSettings.maxWidth ? `max-width: ${formatUnit(globalImgSettings.maxWidth)};` : '';
            const maxHeight: string = globalImgSettings.maxHeight ? `max-height: ${formatUnit(globalImgSettings.maxHeight)};` : '';
            updateCSSText(img, minWidth + minHeight + maxWidth + maxHeight);
            this.aspectRatio = img.naturalWidth / img.naturalHeight;
            // Should notify only during image inserted via uploader and paste action.
            if ((this.parent.blockRenderer && !this.parent.blockRenderer.isEntireBlocksRendering) && !isUndoRedo) {
                this.parent.observer.notify('imageInserted', { blockId: block.id, imgElement: img });
            }
            if (this.parent.imageBlockSettings.enableResize) {
                this.addResizeHandles(img.parentElement, img);
            }
        });
    }

    /**
     * Handles image upload
     *
     * @param {HTMLImageElement} img - The image element whose source will be updated.
     * @param {IImageBlockSettings} settings - Image configuration including allowedTypes and saveFormat.
     * @returns {void}
     * @hidden
     */
    public handleImageUpload(img: HTMLImageElement, settings: IImageBlockSettings): void {
        const fileInput: HTMLInputElement = createElement('input', {
            attrs: {
                type: 'file',
                accept: this.parent.imageBlockSettings.allowedTypes.join(',')
            }
        }) as HTMLInputElement;

        updateCSSText(fileInput, 'display: none;');
        document.body.appendChild(fileInput);

        const handleFileChange: () => void = async(): Promise<void> => {
            const file: File = fileInput.files[0];
            if (!file) {
                document.body.removeChild(fileInput);
                return;
            }
            const fileExtension: string = '.' + file.name.split('.').pop().toLowerCase();
            if (this.parent.imageBlockSettings.allowedTypes.indexOf(fileExtension) === -1) {
                document.body.removeChild(fileInput);
                return;
            }

            const src: string = await this.getImageSrcFromFile(file, this.parent.imageBlockSettings.saveFormat);
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

        // Handle upload popup visibility logic
        if (this.uploadPopupObj && this.isUploadPopupOpen) {
            const isInsidePopup: boolean = this.uploadPopupElement && this.uploadPopupElement.contains(target);
            const isOnPlaceholder: boolean = this.currentPlaceholder && this.currentPlaceholder.contains(target);

            // Close popup if clicking outside both popup and placeholder
            if (!isInsidePopup && !isOnPlaceholder) {
                this.toggleUploadPopup(true);
            }
        }

        // Handle image resize handles visibility
        const isImageClick: boolean = target.matches('img') || target.getAttribute('data-block-type') === BlockType.Image;
        const images: NodeListOf<HTMLImageElement> = this.parent.rootEditorElement.querySelectorAll<HTMLImageElement>('img');

        for (const image of Array.from(images)) {
            const isTargetImage: boolean = image === target || target.contains(image);
            const resizeHandles: NodeListOf<HTMLElement> = image.parentElement.querySelectorAll('.e-image-rsz-handle');
            for (const handle of Array.from(resizeHandles)) {
                updateCSSText(handle, `display: ${isImageClick && isTargetImage ? 'block' : 'none'};`);
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
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        const block: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        const saveFormat: SaveFormat = this.parent.imageBlockSettings.saveFormat;
        const src: string = await this.getImageSrcFromFile(file, (saveFormat || 'Base64'));
        const fileName: string = (file instanceof File) ? file.name : `image-${Date.now()}`;

        let transformedParagraph: HTMLElement = blockElement;
        if (((blockElement.textContent.length > 0))) {
            const addedBlock: BlockModel = this.parent.blockCommand.addBlock({
                targetBlock: blockElement,
                blockType: BlockType.Paragraph
            });
            transformedParagraph = this.parent.getBlockElementById(addedBlock.id);
        }

        this.parent.blockCommand.transformBlock({
            block: getBlockModelById(transformedParagraph.id, this.parent.getEditorBlocks()),
            blockElement: transformedParagraph,
            newBlockType: BlockType.Image,
            props: { src: src, altText: fileName }
        });
    }

    private getImageSrcFromFile(file: File | Blob, saveFormat: SaveFormat): Promise<string> {
        const format: string = saveFormat.toLowerCase();

        if (format === 'base64') {
            return new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
                const reader: FileReader = new FileReader();
                reader.onload = (event: any): void => { resolve((event.target as FileReader).result as string); };
                reader.onerror = (): void => { reject(new Error('Failed to read image as base64.')); };
                reader.readAsDataURL(file);
            });
        } else {
            return Promise.resolve(URL.createObjectURL(file));
        }
    }

    private createResizeHandle(pos: string, img: HTMLImageElement): HTMLElement {
        const handle: HTMLElement = createElement('div', {
            className: `e-image-rsz-handle e-resize-${pos}`
        });
        Object.assign(handle.style, {
            position: 'absolute',
            width: `${RESIZE_HANDLE_SIZE}px`,
            height: `${RESIZE_HANDLE_SIZE}px`,
            backgroundColor: '#0078d4',
            borderRadius: '50%',
            zIndex: '100',
            cursor: ['nw', 'se'].indexOf(pos) !== -1 ? 'nwse-resize' : 'nesw-resize',
            display: 'none'
        });
        handle.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.startImageResize(e, img, handle);
        });
        return handle;
    }

    /**
     * Handles image resize
     *
     * @param {HTMLElement} container - The wrapper element that hosts the image and resize handles.
     * @param {HTMLImageElement} img - The image element to which resize handles are attached.
     * @returns {void}
     * @hidden
     */
    public addResizeHandles(container: HTMLElement, img: HTMLImageElement): void {
        const existingHandles: NodeListOf<Element> = container.querySelectorAll('.e-image-rsz-handle');
        existingHandles.forEach((handle: Element) => container.removeChild(handle));
        const positions: string[] = ['nw', 'ne', 'se', 'sw'];

        for (const pos of positions) {
            const handle: HTMLElement = this.createResizeHandle(pos, img);
            container.appendChild(handle);
        }
        if (img.clientWidth > 0 || img.clientHeight > 0) {
            updateCSSText(container, `width: ${formatUnit(img.clientWidth)};`);
        }
    }

    private startImageResize(e: MouseEvent, img: HTMLImageElement, handle: HTMLElement): void {
        this.isResizing = true;
        this.currentResizeHandle = handle;
        this.currentImage = img;
        this.startDimensions = { width: img.offsetWidth, height: img.offsetHeight };
        this.startPosition = { x: e.clientX, y: e.clientY };
        this.resizeOverlay = createElement('div', { id: this.parent.rootEditorElement.id + 'resize_overlay' });
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
        const allowedTarget: HTMLElement = this.parent.rootEditorElement as HTMLElement;
        if (!allowedTarget.contains(e.target as Node) && (!this.isResizing)) { return; }

        const dx: number = e.clientX - this.startPosition.x;
        const dy: number = e.clientY - this.startPosition.y;
        const position: string = this.currentResizeHandle.className.split('e-resize-')[1];
        const { newWidth, newHeight }: { newWidth: number; newHeight: number } = this.calculateNewDimensions(dx, dy, position);

        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(() => {
            if (this.currentImage && this.currentImage.parentElement) {
                updateCSSText(this.currentImage, `width: ${formatUnit(newWidth)}; height: ${formatUnit(newHeight)};`);
                updateCSSText(this.currentImage.parentElement, `width: ${formatUnit(newWidth)}; height: ${formatUnit(newHeight)};`);
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

        // Unsubscribe from image events
        this.unsubscribeFromImageEvents();

        // Destroy upload popup
        if (this.uploadPopupObj) {
            this.uploadPopupObj.destroy();
            this.uploadPopupObj = null;
        }

        // Remove upload popup element
        if (this.uploadPopupElement && this.uploadPopupElement.parentElement) {
            detach(this.uploadPopupElement);
            this.uploadPopupElement = null;
        }

        // Clean up resize overlay
        if (this.resizeOverlay && this.resizeOverlay.parentNode) {
            document.body.removeChild(this.resizeOverlay);
        }

        // Clear references
        this.currentPlaceholder = null;
        this.isUploadPopupOpen = false;
    }
}
