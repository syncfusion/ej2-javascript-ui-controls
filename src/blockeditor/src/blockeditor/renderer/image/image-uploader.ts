import { createElement, detach, isNullOrUndefined as isNOU, getUniqueID } from '@syncfusion/ej2-base';
import { Tab, TabItemModel, SelectEventArgs as TabSelectEventArgs } from '@syncfusion/ej2-navigations';
import { Uploader, SelectedEventArgs, UploadingEventArgs, SuccessEventArgs, FailureEventArgs, BeforeUploadEventArgs, FileInfo } from '@syncfusion/ej2-inputs';
import { BlockEditor } from '../../base/blockeditor';
import { UploadSession } from './upload-session';
import { ImageProgressRenderer } from './image-progress';
import { FileUploadSuccessEventArgs } from '../../../models/eventargs';

/**
 * ImageUploaderRenderer manages the Tab and Uploader components for image upload workflow.
 * Combines tab navigation (Upload/Embed) with uploader functionality and embed URL validation.
 *
 * @hidden
 */
export class ImageUploaderRenderer {
    private editor: BlockEditor;
    private container: HTMLElement | null;
    private tabObj: Tab | null;
    private tabElement: HTMLElement | null;
    private uploaderObj: Uploader | null;
    private uploaderElement: HTMLInputElement | null;
    private embedContainer: HTMLElement | null;
    private selectedTabIndex: number;
    private isInitialized: boolean;
    private progressRenderers: Map<string, ImageProgressRenderer>;  // Track progress bar per blockId
    private uploadSessions: Map<string, UploadSession>;  // Track multiple sessions by blockId
    private fileNameToBlockId: Map<string, string>;  // Map filename to blockId for event handling
    private blobUrlsToRevoke: string[];

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.container = null;
        this.tabObj = null;
        this.tabElement = null;
        this.uploaderObj = null;
        this.uploaderElement = null;
        this.embedContainer = null;
        this.selectedTabIndex = 0;
        this.isInitialized = false;
        this.progressRenderers = new Map<string, ImageProgressRenderer>();
        this.uploadSessions = new Map<string, UploadSession>();
        this.fileNameToBlockId = new Map<string, string>();
        this.blobUrlsToRevoke = [];

        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.blockManager.observer.on('renderImageUploader', this.renderImageUploader, this);
        this.editor.blockManager.observer.on('imagePopupOpen', this.onPopupOpen, this);
        this.editor.blockManager.observer.on('imagePopupClose', this.onPopupClose, this);
        this.editor.blockManager.observer.on('imageInserted', this.handleImageInserted, this);
        this.editor.blockManager.observer.on('clearUploaderObj', this.clearUploaderObj, this);
    }

    private removeEventListeners(): void {
        this.editor.blockManager.observer.off('renderImageUploader', this.renderImageUploader);
        this.editor.blockManager.observer.off('imagePopupOpen', this.onPopupOpen);
        this.editor.blockManager.observer.off('imagePopupClose', this.onPopupClose);
        this.editor.blockManager.observer.off('imageInserted', this.handleImageInserted);
        this.editor.blockManager.observer.off('clearUploaderObj', this.clearUploaderObj);
    }

    private renderImageUploader(args: { container: HTMLElement }): void {
        if (!this.isInitialized && args.container) {
            this.container = args.container;
            this.initialize();
        }
    }

    private initialize(): void {
        // Create tab element
        this.tabElement = createElement('div', {
            id: `${this.editor.element.id}_image-tabs`,
            className: 'e-image-tabs'
        });

        this.container.appendChild(this.tabElement);

        // Define tab items
        const tabItems: TabItemModel[] = [
            {
                header: { text: this.editor.blockManager.localeJson['tabHeaderUpload'] },
                content: this.createUploadTabContent()
            },
            {
                header: { text: this.editor.blockManager.localeJson['tabHeaderEmbed'] },
                content: this.createEmbedTabContent()
            }
        ];

        // Use generic TabRenderer to create Tab component
        this.tabObj = this.editor.tabRenderer.renderTab({
            element: this.tabElement,
            items: tabItems,
            selectedItem: this.selectedTabIndex,
            cssClass: 'e-image-upload-tabs',
            selected: this.handleTabSelect.bind(this)
        });

        // Initialize uploader for upload tab
        this.initializeUploader();

        this.isInitialized = true;
    }

    private createUploadTabContent(): string {
        return `
            <div class="e-upload-tab-content">
                <div class="e-uploader-container" id="${this.editor.element.id}_uploader-container"></div>
            </div>
        `;
    }

    private createEmbedTabContent(): string {
        return `
            <div class="e-embed-tab-content">
                <div class="e-url-input-container">
                    <input type="text" 
                           id="${this.editor.element.id}_embed-url-input" 
                           class="e-embed-url-input e-input" 
                           placeholder="${this.editor.blockManager.localeJson['embedPlaceholder']}"
                           aria-label="${this.editor.blockManager.localeJson['imageUrl']}" />
                </div>
                <div class="e-embed-actions">
                    <button id="${this.editor.element.id}_embed-button" 
                            class="e-btn e-primary e-embed-button e-disabled"
                            type="button">
                        ${this.editor.blockManager.localeJson['embedImage']}
                    </button>
                </div>
            </div>
        `;
    }

    private initializeUploader(): void {
        const uploaderContainer: HTMLElement = this.tabElement.querySelector(`#${this.editor.element.id}_uploader-container`) as HTMLElement;
        // Create uploader input element
        this.uploaderElement = createElement('input', {
            id: `${this.editor.element.id}_uploader`,
            attrs: {
                type: 'File',
                name: 'UploadFiles'
            }
        }) as HTMLInputElement;

        uploaderContainer.appendChild(this.uploaderElement);

        // Use generic UploaderRenderer to create Uploader component
        this.uploaderObj = this.editor.uploaderRenderer.renderUploader({
            element: this.uploaderElement,
            asyncSettings: {
                saveUrl: this.editor.imageBlockSettings.saveUrl
            },
            multiple: false,
            allowedExtensions: this.editor.imageBlockSettings.allowedTypes.join(','),
            maxFileSize: this.editor.imageBlockSettings.maxFileSize,
            dropArea: uploaderContainer,
            cssClass: 'e-image-uploader',
            selected: this.handleFileSelected.bind(this),
            uploading: this.handleUploading.bind(this),
            progress: this.handleProgress.bind(this),
            success: this.handleSuccess.bind(this),
            failure: this.handleFailure.bind(this),
            beforeUpload: this.handleBeforeUpload.bind(this),
            removing: undefined
        });
    }

    private handleTabSelect(args: TabSelectEventArgs): void {
        this.selectedTabIndex = args.selectedIndex;
        // Initialize embed tab functionality when selected
        if (args.selectedIndex === 1 && !this.embedContainer) {
            this.initializeEmbedTab();
        }
    }

    private initializeEmbedTab(): void {
        const embedTabContent: HTMLElement = this.tabElement.querySelector('.e-embed-tab-content') as HTMLElement;
        this.embedContainer = embedTabContent;
        const urlInput: HTMLInputElement = embedTabContent.querySelector(`#${this.editor.element.id}_embed-url-input`) as HTMLInputElement;
        const embedButton: HTMLButtonElement = embedTabContent.querySelector(`#${this.editor.element.id}_embed-button`) as HTMLButtonElement;
        // Bind input validation
        urlInput.addEventListener('input', () => {
            urlInput.classList.remove('e-error');
            if (urlInput.value.length === 0) {
                embedButton.classList.add('e-disabled');
            }
            else {
                embedButton.classList.remove('e-disabled');
            }
        });

        // Bind Enter key on input
        urlInput.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.handleEmbedClick();
            }
        });

        // Bind button click
        embedButton.addEventListener('click', () => {
            this.handleEmbedClick();
        });
    }

    // Handles embed button click (validates URL and embeds image).
    private handleEmbedClick(): void {
        const urlInput: HTMLInputElement = this.tabElement.querySelector(`#${this.editor.element.id}_embed-url-input`) as HTMLInputElement;
        const url: string = urlInput.value.trim();
        // Validate URL format
        const validationResult: { valid: boolean; url?: string; error?: string } = this.validateImageUrl(url);
        if (!validationResult.valid) {
            this.showEmbedError(urlInput);
            return;
        }

        // Notify ImageRenderer to embed the image
        this.editor.blockManager.observer.notify('imageEmbedded', {
            url: validationResult.url
        });

        // Clear input and hide error
        urlInput.value = '';
    }

    // Validates an image URL.
    private validateImageUrl(urlString: string): { valid: boolean; url?: string; error?: string } {
        // Block dangerous protocols (XSS prevention)
        const dangerousProtocols: string[] = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
        const lowerUrl: string = urlString.toLowerCase();

        for (const protocol of dangerousProtocols) {
            if (lowerUrl.startsWith(protocol)) {
                return { valid: false, error: 'Dangerous protocol detected' };
            }
        }

        // Only allow HTTP/HTTPS
        if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
            return { valid: false, error: 'Only HTTP/HTTPS protocols are allowed' };
        }

        // Parse URL to validate structure
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(urlString);
        } catch (e) {
            return { valid: false, error: 'Invalid URL format' };
        }

        // Block internal network access (SSRF prevention)
        const hostname: string = parsedUrl.hostname.toLowerCase();
        const blockedHosts: string[] = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        if (blockedHosts.indexOf(hostname) !== -1 ||
            hostname.indexOf('192.168.') === 0 ||
            hostname.indexOf('10.') === 0 ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
            return { valid: false, error: 'Internal network URLs are not allowed' };
        }

        return { valid: true, url: parsedUrl.href }; // Normalized URL
    }

    // Shows an error style over input.
    private showEmbedError(input: HTMLInputElement): void {
        input.classList.add('e-error');
        input.focus();
    }

    // Handles imageInserted event - unified handler for both pasted and uploader-selected images.
    // This fires for ALL image insertions regardless of source (paste, uploader, etc).
    private handleImageInserted(evt: { blockId: string, imgElement: HTMLImageElement }): void {
        if (!evt || !evt.blockId || !evt.imgElement) { return; }
        const blockId: string = evt.blockId;
        const imgElement: HTMLImageElement = evt.imgElement as HTMLImageElement;
        // Check if there's an existing session (from uploader selection)
        const existingSession: UploadSession = this.uploadSessions.get(blockId);

        if (existingSession) {
            // This image came from uploader selection (handleFileSelected)
            // Session already created, just need to show progress bar if saveUrl configured
            const hasSaveUrl: boolean = !isNOU(this.editor.imageBlockSettings.saveUrl) &&
                              this.editor.imageBlockSettings.saveUrl.trim() !== '';
            if (hasSaveUrl && !this.progressRenderers.has(blockId)) {
                // Create progress bar for uploader-selected image
                const progressRenderer: ImageProgressRenderer = new ImageProgressRenderer(this.editor, imgElement);
                this.progressRenderers.set(blockId, progressRenderer);
                progressRenderer.show();
            }
        } else {
            // This image was pasted (no existing session)
            // Check if saveUrl is configured and if image needs upload
            const hasSaveUrl: boolean = !isNOU(this.editor.imageBlockSettings.saveUrl) &&
                              this.editor.imageBlockSettings.saveUrl.trim() !== '';
            if (!hasSaveUrl) {
                return; // No server upload configured
            }
            // Trigger upload for pasted image
            this.uploadPastedImage(imgElement, blockId);
        }
    }

    private async uploadPastedImage(imgElement: HTMLImageElement, blockId: string): Promise<void> {
        try {
            // If src is already a hosted URL (http/https), skip upload
            if (imgElement.src.startsWith('http://') || imgElement.src.startsWith('https://')) {
                return;
            }
            // Convert base64/blob to File object
            const file: File = await this.convertImageToFile(imgElement.src, blockId);
            if (!file) {
                return;
            }

            // Create upload session and store in map
            const sessionId: string = getUniqueID('upload-session');
            const session: UploadSession = new UploadSession(sessionId, blockId, file, imgElement.src);
            this.uploadSessions.set(blockId, session);
            this.fileNameToBlockId.set(file.name, blockId);

            // Show progress bar immediately
            const progressRenderer: ImageProgressRenderer = new ImageProgressRenderer(this.editor, imgElement);
            this.progressRenderers.set(blockId, progressRenderer);
            progressRenderer.show();

            const fileInfo: FileInfo = {
                name: file.name,
                size: file.size,
                type: file.type,
                statusCode: '1', // '1' = file ready to upload
                status: 'Ready to upload',
                rawFile: file,
                validationMessages: { minSize: '', maxSize: '' }
            };

            this.uploaderObj.upload([fileInfo], true);

        } catch (error) {
            console.error('Failed to upload pasted image:', error);
        }
    }

    private async convertImageToFile(src: string, blockId: string): Promise<File | null> {
        try {
            let blob: Blob;

            if (src.startsWith('data:image/')) {
                const response: Response = await fetch(src);
                blob = await response.blob();
            } else if (src.startsWith('blob:')) {
                const response: Response = await fetch(src);
                blob = await response.blob();
            } else {
                return null;
            }

            // Generate filename based on blob type and blockId
            const extension: string = blob.type.split('/')[1] || 'png';
            const filename: string = `pasted-image-${blockId}.${extension}`;
            // Convert Blob to File
            const file: File = new File([blob], filename, { type: blob.type });
            return file;

        } catch (error) {
            console.error('Error converting image to file:', error);
            return null;
        }
    }

    private handleFileSelected(args: SelectedEventArgs): void {
        if (!args.filesData || args.filesData.length === 0) { return; }
        const fileData: FileInfo = args.filesData[0];
        const file: File = fileData.rawFile as File;
        const blockId: string = this.getPlaceholderBlockId();
        if (!blockId || fileData.statusCode === '0') {
            return;
        }

        // Create upload session immediately (synchronous) and store in map
        const sessionId: string = getUniqueID('upload-session');
        const session: UploadSession = new UploadSession(sessionId, blockId, file, null);
        this.uploadSessions.set(blockId, session);
        this.fileNameToBlockId.set(file.name, blockId);
        this.AddImagePreview(file, blockId);
    }

    private getPlaceholderBlockId(): string | null {
        const placeholder: HTMLElement = this.editor.blockManager.blockRenderer.imageRenderer.getCurrentPlaceholder();
        if (placeholder) {
            return placeholder.getAttribute('data-block-id');
        }
        return null;
    }

    private async AddImagePreview(file: File, blockId: string): Promise<void> {
        // Generate preview URL based on saveFormat
        const previewUrl: string = await this.getPreviewUrl(file);

        // Update session with preview URL
        const session: UploadSession = this.uploadSessions.get(blockId);
        if (session) {
            session.previewUrl = previewUrl;
        }

        // Trigger internal event
        this.editor.blockManager.observer.notify('fileSelected', {
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                rawFile: file
            },
            previewUrl: previewUrl,
            blockId: blockId
        });
    }

    private getPreviewUrl(file: File): Promise<string> {
        const saveFormat: string = (this.editor.imageBlockSettings.saveFormat || 'Base64').toString().toLowerCase();

        // If host requests blob previews, always use blob URL (fast and low-memory)
        if (saveFormat === 'blob') {
            const blobUrl: string = URL.createObjectURL(file);
            this.blobUrlsToRevoke.push(blobUrl);
            return Promise.resolve(blobUrl);
        }
        else {
            return this.encodeImageAsBase64(file);
        }
    }

    private encodeImageAsBase64(file: File): Promise<string> {
        return new Promise((resolve: (value: string) => void, reject: (reason?: any) => void) => {
            const reader: FileReader = new FileReader();
            reader.onload = (event: any): void => {
                resolve((event.target as FileReader).result as string);
            };
            reader.onerror = (): void => {
                reject(new Error('Failed to read image as base64.'));
            };
            reader.readAsDataURL(file);
        });
    }

    private handleBeforeUpload(args: BeforeUploadEventArgs): void {
        const beforeArgs: BeforeUploadEventArgs = {
            ...args
        };
        this.editor.trigger('beforeFileUpload', beforeArgs);
        args.cancel = beforeArgs.cancel;
    }

    private handleUploading(args: UploadingEventArgs): void {
        const blockId: string = this.fileNameToBlockId.get(args.fileData.name) || '';
        const progressRenderer: ImageProgressRenderer = this.progressRenderers.get(blockId);

        // Upload started - initialize progress at 0%
        if (progressRenderer) {
            progressRenderer.updateProgress(0);
        }

        const uploadingArgs: UploadingEventArgs = {
            ...args
        };

        this.editor.trigger('fileUploading', uploadingArgs);
        args.cancel = uploadingArgs.cancel;
    }

    private handleProgress(args: any): void {
        // Calculate progress percentage from loaded/total bytes
        const e: ProgressEvent = args.e as ProgressEvent;
        if (e && e.lengthComputable) {
            const progressPercent: number = Math.round((e.loaded / e.total) * 100);

            // Get blockId from filename lookup
            const fileName: string = args.file ? args.file.name : '';
            const blockId: string = this.fileNameToBlockId.get(fileName) || '';
            const progressRenderer: ImageProgressRenderer = this.progressRenderers.get(blockId);

            // Update session progress
            const session: UploadSession = this.uploadSessions.get(blockId);
            if (session) {
                session.updateProgress(progressPercent);
            }

            // Update progress bar for this specific upload
            if (progressRenderer) {
                progressRenderer.updateProgress(progressPercent);
            }
        }
    }

    private handleSuccess(args: SuccessEventArgs): void {
        const fileName: string = args.file ? args.file.name : '';
        const blockId: string = this.fileNameToBlockId.get(fileName) || '';
        const progressRenderer: ImageProgressRenderer = this.progressRenderers.get(blockId);

        // Ensure progress reaches 100% before hiding
        if (progressRenderer) {
            progressRenderer.updateProgress(100);
        }

        const session: UploadSession = this.uploadSessions.get(blockId);
        if (session) {
            session.complete();
        }

        // Parse server response
        let serverResponse: any = {};
        if (args.e && typeof args.e === 'object') {
            const eventObj: any = args.e as any;
            if (eventObj.target && eventObj.target.response) {
                try {
                    const parsed: any = JSON.parse(eventObj.target.response);
                    serverResponse = typeof parsed === 'object' ? parsed : { message: parsed };
                } catch (e) {
                    serverResponse = { message: eventObj.target.response };
                }
            }
        }

        // Construct final image URL based on path setting
        let finalImageUrl: string = '';
        const path: string = this.editor.imageBlockSettings.path;

        if (path && path.trim() !== '') {
            const uploadFileName: string = session ? session.file.name : (serverResponse.fileName || '');
            const normalizedPath: string = path.endsWith('/') ? path : path + '/';
            const normalizedFileName: string = uploadFileName.startsWith('/') ? uploadFileName.substring(1) : uploadFileName;
            finalImageUrl = normalizedPath + normalizedFileName;
        } else {
            finalImageUrl = serverResponse.url || (session ? session.previewUrl : '') || '';
        }
        serverResponse.url = finalImageUrl;
        const successArgs: FileUploadSuccessEventArgs = {
            ...args,
            fileUrl: finalImageUrl
        };

        this.editor.trigger('fileUploadSuccess', successArgs);

        this.editor.blockManager.observer.notify('fileUploadSuccess', { ...successArgs, blockId: blockId });

        // Clean up Blob URLs
        this.revokeBlobUrls();
        // Hide progress bar, show success badge, cleanup
        if (progressRenderer) {
            progressRenderer.hide(() => {
                progressRenderer.showSuccessBadge();
                setTimeout(() => {
                    progressRenderer.destroy();
                    this.progressRenderers.delete(blockId);
                }, 1000);
            });
        }

        // Clean up session and filename mapping
        this.uploadSessions.delete(blockId);
        this.fileNameToBlockId.delete(fileName);
    }

    private handleFailure(args: FailureEventArgs): void {
        const fileName: string = args.file ? args.file.name : '';
        const blockId: string = this.fileNameToBlockId.get(fileName);
        const progressRenderer: ImageProgressRenderer = this.progressRenderers.get(blockId);
        let errorMessage: string = 'Upload failed';

        if (args.statusText) {
            errorMessage = args.statusText;
        } else if (args.e && typeof args.e === 'object') {
            const eventObj: any = args.e as any;
            if (eventObj.target && eventObj.target.statusText) {
                errorMessage = eventObj.target.statusText;
            }
        }

        const session: UploadSession = this.uploadSessions.get(blockId);
        if (session) {
            session.fail(errorMessage);
        }

        const failedArgs: FailureEventArgs = {
            ...args
        };

        this.editor.blockManager.observer.notify('fileUploadFailed', failedArgs);

        this.editor.trigger('fileUploadFailed', failedArgs);

        // Hide progress bar, show error badge, cleanup
        if (progressRenderer) {
            progressRenderer.hide(() => {
                progressRenderer.showErrorBadge();
                setTimeout(() => {
                    progressRenderer.destroy();
                    this.progressRenderers.delete(blockId);
                }, 1000);
            });
        }

        this.uploadSessions.delete(blockId);
        this.fileNameToBlockId.delete(fileName);
    }

    private revokeBlobUrls(): void {
        this.blobUrlsToRevoke.forEach((url: string) => URL.revokeObjectURL(url));
        this.blobUrlsToRevoke = [];
    }

    private clearUploaderObj(): void {
        if (this.uploaderObj) {
            this.uploaderObj.clearAll();
        }
    }

    public onPopupOpen(): void {
        if (this.tabObj) {
            this.tabObj.select(0);
        }
        const uploaderContainer: HTMLElement = this.tabElement.querySelector(`#${this.editor.element.id}_uploader-container`) as HTMLElement;
        const browseButton: HTMLButtonElement = uploaderContainer.querySelector('.e-upload .e-file-select-wrap > button') as HTMLButtonElement;
        browseButton.focus();
    }

    public onPopupClose(): void {
        if (this.tabObj) {
            this.tabObj.select(0);
        }
        // Clear embed input if any
        if (this.tabElement) {
            const urlInput: HTMLInputElement = this.tabElement.querySelector(`#${this.editor.element.id}_embed-url-input`) as HTMLInputElement;
            if (urlInput) {
                urlInput.value = '';
            }
        }
    }

    public refresh(): void {
        if (this.uploaderObj) {
            this.uploaderObj.clearAll();
        }
    }

    public destroy(): void {
        // Remove event listeners
        this.removeEventListeners();
        // Revoke Blob URLs
        this.revokeBlobUrls();
        // Destroy all progress renderer instances
        this.progressRenderers.forEach((renderer: ImageProgressRenderer) => {
            renderer.destroy();
        });
        this.progressRenderers.clear();

        // Destroy uploader
        if (this.uploaderObj) {
            this.uploaderObj.destroy();
            this.uploaderObj = null;
        }
        // Remove uploader element
        if (this.uploaderElement && this.uploaderElement.parentElement) {
            detach(this.uploaderElement);
            this.uploaderElement = null;
        }
        // Destroy tab component
        if (this.tabObj) {
            this.tabObj.destroy();
            this.tabObj = null;
        }
        // Remove tab element
        if (this.tabElement && this.tabElement.parentElement) {
            detach(this.tabElement);
            this.tabElement = null;
        }
        // Clear all references
        this.embedContainer = null;
        this.container = null;
        this.uploadSessions.clear();
        this.fileNameToBlockId.clear();
        this.isInitialized = false;
    }
}
