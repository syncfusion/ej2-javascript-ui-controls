import { DocumentEditorContainer } from '../../document-editor-container';
import { Browser, createElement, EventHandler, L10n } from '@syncfusion/ej2-base';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { BeforeFileOpenArgs, beforeFileOpenEvent, fileMenuItemClickEvent, FileMenuItemType } from '../../../document-editor/base/index';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

/**
 * File menu constants
 */
export const FILE_MENU_ID: string = 'file_menu';
export const NEW_DOCUMENT_ID: string = 'new';
export const OPEN_DOCUMENT_ID: string = 'open';
export const EXPORT_ID: string = 'export';
export const EXPORT_SFDT_ID: string = 'export_sfdt';
export const EXPORT_DOCX_ID: string = 'export_docx';
export const EXPORT_DOTX_ID: string = 'export_dotx';
export const EXPORT_TXT_ID: string = 'export_txt';
export const PRINT_ID: string = 'print';

/**
 * FileMenu class for Document Editor Ribbon
 * @private
 */
export class FileMenu {
    /**
     * Container reference
     * @private
     */
    private container: DocumentEditorContainer;

    /**
     * File picker element
     * @private
     */
    private filePicker: HTMLInputElement;

    /**
     * Constructor for FileMenu class
     *
     * @param {DocumentEditorContainer} container - Document editor container reference
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
    }

    /**
     * Get file menu items
     *
     * @returns {MenuItemModel[]} File menu items
     * @private
     */
    public getFileMenuItems(): MenuItemModel[] {
        const locale: L10n = this.container.localObj;
        const fileMenuItems: MenuItemModel[] = [];
        const commentId: string = this.container.element.id + RIBBON_ID;
        // Check if fileMenuItems property exists and use it, otherwise use default items
        const items: (FileMenuItemType | MenuItemModel)[] = this.container.fileMenuItems;

        for (let i: number = 0; i < items.length; i++) {
            /* eslint-disable */
            const item: FileMenuItemType | MenuItemModel = items[i];

            if (typeof item === 'string') {
                switch (item) {
                case 'New':
                    fileMenuItems.push({
                        text: locale.getConstant('New'),
                        iconCss: 'e-icons e-de-ctnr-new',
                        id: commentId + NEW_DOCUMENT_ID
                    });
                    break;
                case 'Open':
                    fileMenuItems.push({
                        text: locale.getConstant('Open'),
                        iconCss: 'e-icons e-de-ctnr-open',
                        id: commentId + OPEN_DOCUMENT_ID
                    });
                    break;
                case 'Export':
                    fileMenuItems.push({
                        text: locale.getConstant('Export'),
                        iconCss: 'e-icons e-de-ctnr-export',
                        id: commentId + EXPORT_ID,
                        items: [
                            { id: commentId + EXPORT_SFDT_ID, text: locale.getConstant('Syncfusion Document Text (*.sfdt)') },
                            { id: commentId + EXPORT_DOCX_ID, text: locale.getConstant('Word Document (*.docx)') },
                            { id: commentId + EXPORT_DOTX_ID, text: locale.getConstant('Word Template (*.dotx)') },
                            { id: commentId + EXPORT_TXT_ID, text: locale.getConstant('Plain Text (*.txt)') }
                        ]
                    });
                    break;
                case 'Print':
                    fileMenuItems.push({
                        text: locale.getConstant('Print'),
                        iconCss: 'e-icons e-de-ctnr-print',
                        id: commentId + PRINT_ID
                    });
                    break;
                }
            } else {
                // Item is already a MenuItemModel
                fileMenuItems.push(item);
            }
        }

        return fileMenuItems;
    }

    /**
     * Handle file menu item selection
     *
     * @param {MenuEventArgs} args - Menu item selection arguments
     * @returns {void}
     */
    public onFileMenuItemSelect(args: MenuEventArgs): void {
        const locale: L10n = this.container.localObj;
        if (args.item && args.item.id) {
            switch (args.item.text) {
            case locale.getConstant('New'):
                this.container.documentEditor.openBlank();
                break;
            case locale.getConstant('Open'):
                this.initializeFilePicker();
                this.filePicker.value = '';
                this.filePicker.click();
                break;
            case locale.getConstant('Print'):
                this.container.documentEditor.print();
                break;
            case locale.getConstant('Word Document (*.docx)'):
                this.container.documentEditor.save(this.container.documentEditor.documentName || 'Document', 'Docx');
                break;
            case locale.getConstant('Word Template (*.dotx)'):
                this.container.documentEditor.save(this.container.documentEditor.documentName || 'Document', 'Dotx');
                break;
            case locale.getConstant('Syncfusion Document Text (*.sfdt)'):
                this.container.documentEditor.save(this.container.documentEditor.documentName || 'Document', 'Sfdt');
                break;
            case locale.getConstant('Plain Text (*.txt)'):
                this.container.documentEditor.save(this.container.documentEditor.documentName || 'Document', 'Txt');
                break;
            default:
                // Trigger file menu click event for custom handling
                this.container.trigger(fileMenuItemClickEvent, args);
                break;
            }
            this.container.documentEditor.focusIn();
        }
    }

    /**
     * Initialize file picker
     *
     * @private
     * @returns {void}
     */
    private initializeFilePicker(): void {
        if (!this.filePicker) {
            this.filePicker = createElement('input', {
                attrs: { type: 'file', accept: '.doc,.docx,.rtf,.txt,.htm,.html,.sfdt' },
                className: 'e-de-ctnr-file-picker'
            }) as HTMLInputElement;

            if (Browser.isIE) {
                document.body.appendChild(this.filePicker);
            }

            EventHandler.add(this.filePicker, 'change', this.onFileChange, this);
        }
    }

    /**
     * Handle file change event when a document is opened
     * @private
     * @returns {void}
     */
    private onFileChange(): void {
        const file: File = this.filePicker.files[0];
        const fileSize: number = file.size;
        let check: boolean;
        const eventArgs: BeforeFileOpenArgs = { fileSize: fileSize, isCanceled: check };
        this.container.documentEditor.trigger(beforeFileOpenEvent, eventArgs);

        if (eventArgs.isCanceled) {
            return;
        }

        if (file) {
            const formatType: string = file.name.substr(file.name.lastIndexOf('.'));
            if (formatType === '.sfdt' || formatType === '.txt') {
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (): void => {
                    if (formatType === '.txt') {
                        this.container.documentEditor.documentHelper.openTextFile(fileReader.result as string);
                    } else {
                        this.container.documentEditor.openAsync(fileReader.result as string);
                    }
                };
                fileReader.readAsText(file);
            } else {
                if (this.isSupportedFormatType(formatType.toLowerCase())) {
                    this.container.documentEditor.open(file);
                } else {
                    const localizeValue: L10n = new L10n('documenteditor', this.container.documentEditor.defaultLocale);
                    DialogUtility.alert({
                        content: localizeValue.getConstant('Unsupported format'),
                        closeOnEscape: true,
                        showCloseIcon: true,
                        position: { X: 'center', Y: 'center' }
                    }).enableRtl = this.container.enableRtl;
                }
            }
            this.container.documentEditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
        }
    }

    /**
     * Check if the file format is supported
     * @private
     * @param {string} formatType - The file format extension
     * @returns {boolean} Whether the format is supported
     */
    private isSupportedFormatType(formatType: string): boolean {
        switch (formatType) {
        case '.dotx':
        case '.docx':
        case '.docm':
        case '.dotm':
        case '.dot':
        case '.doc':
        case '.rtf':
        case '.txt':
        case '.xml':
        case '.html':
            return true;
        default:
            return false;
        }
    }

    /**
     * Destroy the file menu
     * @returns {void}
     */
    public destroy(): void {
        if (this.filePicker) {
            EventHandler.remove(this.filePicker, 'change', this.onFileChange);
            if (this.filePicker.parentNode) {
                this.filePicker.parentNode.removeChild(this.filePicker);
            }
            this.filePicker = null;
        }
    }
}
