import { Browser, createElement, SanitizeHtmlHelper, initializeTelemetryFeature, isNullOrUndefined, getUniqueID } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { Toolbar, ItemModel } from '@syncfusion/ej2-navigations';
import { Dialog, DialogModel, Popup } from '@syncfusion/ej2-popups';
import { DropDownButton, ItemModel as DropDownButtonItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Gantt } from '../base/gantt';
import { NotesEditorModel, NotesToolbarLabelsModel } from '../models/notes-editor-model';
import { ColumnModel } from '../models/models';

const COMMANDS: { [key: string]: string } = {
    Bold: 'bold',
    Italic: 'italic',
    Underline: 'underline',
    OrderedList: 'insertOrderedList',
    UnorderedList: 'insertUnorderedList'
};
const COMMAND_STATE_NAMES: string[] = ['bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList'];

const TOOLBAR_LABELS: { [key: string]: string } = {
    Bold: 'Bold',
    Italic: 'Italic',
    Underline: 'Underline',
    OrderedList: 'Numbered list',
    UnorderedList: 'Bulleted list',
    CreateLink: 'Create link',
    FontName: 'Font Name',
    FontSize: 'Font Size',
    FontColor: 'Font Color',
    BackgroundColor: 'Background Color'
};

const TOOLBAR_ICONS: { [key: string]: string } = {
    Bold: 'e-icons e-bold',
    Italic: 'e-icons e-italic',
    Underline: 'e-icons e-underline',
    OrderedList: 'e-icons e-list-ordered',
    UnorderedList: 'e-icons e-list-unordered',
    CreateLink: 'e-icons e-link'
};

const FONT_NAMES: { text: string, value: string, cssClass: string }[] = [
    { text: 'Default', value: '', cssClass: '' },
    { text: 'Segoe UI', value: 'Segoe UI', cssClass: 'e-segoe-ui' },
    { text: 'Arial', value: 'Arial,Helvetica,sans-serif', cssClass: 'e-arial' },
    { text: 'Georgia', value: 'Georgia,serif', cssClass: 'e-georgia' },
    { text: 'Impact', value: 'Impact,Charcoal,sans-serif', cssClass: 'e-impact' },
    { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif', cssClass: 'e-tahoma' },
    { text: 'Times New Roman', value: 'Times New Roman,Times,serif', cssClass: 'e-times-new-roman' },
    { text: 'Verdana', value: 'Verdana,Geneva,sans-serif', cssClass: 'e-verdana' }
];
const FONT_SIZES: { text: string, value: string, commandValue: string }[] = [
    { text: 'Default', value: '', commandValue: '' },
    { text: '8 pt', value: '8pt', commandValue: '1' }, { text: '10 pt', value: '10pt', commandValue: '2' },
    { text: '12 pt', value: '12pt', commandValue: '3' }, { text: '14 pt', value: '14pt', commandValue: '4' },
    { text: '18 pt', value: '18pt', commandValue: '5' }, { text: '24 pt', value: '24pt', commandValue: '6' },
    { text: '36 pt', value: '36pt', commandValue: '7' }
];

const FONT_COLOR_PALETTE: string[] = [
    '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
    '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
    '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
    '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
    '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
    '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000'
];
const BACKGROUND_COLOR_PALETTE: string[] = [
    '', '#000000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff0000', '#000080', '#800080', '#996633',
    '#f2f2f2', '#808080', '#ffffcc', '#b3ffb3', '#ccffff', '#ccccfe', '#ffcccc', '#ccccff', '#ff80ff', '#f2e6d9',
    '#d9d9d9', '#595959', '#ffff80', '#80ff80', '#b3ffff', '#8080fe', '#ff8080', '#8080ff', '#ff00ff', '#dfbf9f',
    '#bfbfbf', '#404040', '#ffff33', '#33ff33', '#33ffff', '#3333ff', '#ff3333', '#0000b3', '#b300b3', '#c68c53',
    '#a6a6a6', '#262626', '#e6e600', '#00b300', '#009999', '#000099', '#b30000', '#000065', '#660066', '#86592d',
    '#7f7f7f', '#0d0d0d', '#999900', '#006600', '#006666', '#000066', '#660000', '#00004d', '#4d004d', '#734d26'
];

interface NotesBeforeInputEvent extends Event {
    inputType?: string;
}

/**
 * Lightweight HTML editor module used by the Gantt dialog Notes field.
 * ```html
 * <div id='gantt'></div>
 * <script>
 *     let gantt: Gantt = new Gantt({ taskFields: { notes: 'Notes' } });
 *     gantt.appendTo('#gantt');
 * </script>
 * ```
 */
export class NotesEditor {
    private parent: Gantt;
    private hostElement: HTMLElement;
    private toolbarElement: HTMLElement;
    private contentElement: HTMLElement;
    private toolbarLabels: NotesToolbarLabelsModel;
    private enableHtmlSanitizer: boolean;
    private savedRange: Range;
    private instanceId: string;
    private toolbar: Toolbar;
    private fontNameDropDown: DropDownButton;
    private fontSizeDropDown: DropDownButton;
    private colorPickers: ColorPicker[] = [];
    private linkDialog: Dialog;
    private linkDialogElement: HTMLElement;
    private linkTargetCheckBox: CheckBox;
    private selectedLink: HTMLAnchorElement;
    private editingLink: HTMLAnchorElement;
    private linkActionPopup: HTMLElement;
    private contentAreaElement: HTMLElement;
    private placeholderElement: HTMLElement;
    private linkActionToolbar: Toolbar;
    private linkActionPopupControl: Popup;
    private allowRichText: boolean;
    private readonly onEditorClickBound: (event: MouseEvent) => void;
    private readonly onLinkPopupOutsideBound: (event: MouseEvent) => void;
    private readonly onLinkPopupKeyDownBound: (event: KeyboardEvent) => void;
    private readonly onToolbarMouseDownBound: (event: MouseEvent) => void;
    private readonly onKeyDownBound: (event: KeyboardEvent) => void;
    private readonly onBeforeInputBound: (event: Event) => void;
    private readonly onPasteBound: (event: ClipboardEvent) => void;
    private readonly onInputBound: () => void;
    private readonly onSelectionChangeBound: () => void;
    private currentValue: string;
    private isDestroyed: boolean = false;
    private savedCommandStates: { command: string, state: boolean }[] = null;

    /**
     * Constructor for the NotesEditor module.
     *
     * @param {Gantt} parent - The parent Gantt component instance.
     * @private
     */
    public constructor(parent: Gantt) {
        initializeTelemetryFeature('NotesEditor', 'Gantt');
        this.parent = parent;
        this.instanceId = getUniqueID('gantt-notes');
        this.onToolbarMouseDownBound = this.preventToolbarFocusLoss.bind(this);
        this.onKeyDownBound = this.handleKeyDown.bind(this);
        this.onBeforeInputBound = this.handleBeforeInput.bind(this);
        this.onPasteBound = this.handlePaste.bind(this);
        this.onInputBound = this.updatePlaceholder.bind(this);
        this.onSelectionChangeBound = this.updateToolbarState.bind(this);
        this.onEditorClickBound = this.handleEditorClick.bind(this);
        this.onLinkPopupOutsideBound = this.handleLinkPopupOutside.bind(this);
        this.onLinkPopupKeyDownBound = this.handleLinkPopupKeyDown.bind(this);
    }

    /**
     * Renders a Notes editor into the supplied dialog element.
     *
     * @param {HTMLElement} hostElement - The dialog Notes host element.
     * @param {NotesEditorModel} options - Supported Notes editor settings.
     * @param {string} value - Initial Notes HTML or text.
     * @param {boolean} enableHtmlSanitizer - Whether Gantt HTML sanitization is enabled.
     * @returns {void}
     * @private
     */
    public renderInto(hostElement: HTMLElement, options: NotesEditorModel, value: string, enableHtmlSanitizer: boolean): void {
        this.hostElement = hostElement;
        this.enableHtmlSanitizer = enableHtmlSanitizer;
        this.toolbarLabels = Object.assign({}, TOOLBAR_LABELS, options.toolbarLabels);
        const notesColumn: ColumnModel | undefined =
            (this.parent.columns as ColumnModel[]).find((column: ColumnModel) => column.field === this.parent.taskFields.notes);
        this.allowRichText = !!(notesColumn && notesColumn.disableHtmlEncode === true);
        this.toolbarElement = createElement('div', { className: 'e-gantt-notes-toolbar-container' });
        this.contentElement = createElement('div', {
            className: 'e-gantt-notes-editor',
            attrs: {
                contenteditable: options.enabled === false ? 'false' : this.allowRichText ? 'true' : 'plaintext-only',
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-label': options.placeholder || 'Notes'
            }
        });
        this.hostElement.classList.add('e-gantt-notes-container');
        if (options.height === '100%') {
            this.hostElement.style.height = '100%';
            this.hostElement.style.minHeight = '0';
            this.contentElement.style.height = 'auto';
            this.contentElement.style.minHeight = '0';
            this.contentElement.style.flex = '1 1 auto';
        } else if (options.height && options.height !== 'auto') {
            this.hostElement.style.height = 'auto';
            this.contentElement.style.minHeight = String(options.height);
        }
        if (options.enableRtl) {
            this.hostElement.classList.add('e-rtl');
            this.contentElement.setAttribute('dir', 'rtl');
        }
        if (options.enabled === false || this.parent.readOnly) {
            this.hostElement.classList.add('e-disabled');
        }
        this.hostElement.appendChild(this.toolbarElement);
        this.hostElement.appendChild(this.contentElement);
        if (this.allowRichText) {
            this.renderToolbar(options.toolbarSettings && options.toolbarSettings.items,
                               options.enableRtl === true, options.enabled !== false);
        }
        this.contentAreaElement = createElement('div', {
            className: 'e-gantt-notes-content-area'
        });
        this.placeholderElement = createElement('span', {
            className: 'e-gantt-notes-placeholder'
        });
        this.placeholderElement.textContent = options.placeholder || '';
        this.contentAreaElement.appendChild(this.placeholderElement);
        this.contentAreaElement.appendChild(this.contentElement);
        this.hostElement.appendChild(this.toolbarElement);
        this.hostElement.appendChild(this.contentAreaElement);
        this.contentElement.setAttribute('aria-placeholder', options.placeholder || '');
        this.value = value;
        this.toolbarElement.addEventListener('mousedown', this.onToolbarMouseDownBound);
        this.contentElement.addEventListener('keydown', this.onKeyDownBound);
        this.contentElement.addEventListener('beforeinput', this.onBeforeInputBound);
        this.contentElement.addEventListener('paste', this.onPasteBound);
        this.contentElement.addEventListener('input', this.onInputBound);
        this.contentElement.addEventListener('click', this.onEditorClickBound);
        document.addEventListener('selectionchange', this.onSelectionChangeBound);
        this.updatePlaceholder();
    }

    /**
     * Gets the module name for the NotesEditor.
     *
     * @returns {string} The module name.
     * @private
     */
    public getModuleName(): string {
        return 'notesEditor';
    }

    /**
     * Gets or sets the editor HTML value.
     *
     * @returns {string} The editor HTML value.
     */
    public get value(): string {
        return this.allowRichText ? this.getHtml() : this.getText();
    }

    public set value(value: string) {
        const safeValue: string = this.sanitize(value || '');
        this.currentValue = this.allowRichText ? this.normalizeValue(safeValue) : safeValue;
        this.setEditorContent();
        this.updatePlaceholder();
    }

    /**
     * Gets the current editor HTML.
     *
     * @returns {string} The current editor HTML.
     */
    public getHtml(): string {
        const html: string = this.contentElement ? this.contentElement.innerHTML : '';
        return html ? this.sanitize(html) : '<p><br></p>';
    }

    /**
     * Gets the current editor text.
     *
     * @returns {string} The current editor text.
     */
    public getText(): string {
        return this.contentElement ? this.contentElement.innerText : '';
    }

    /**
     * Refreshes the editor after its containing dialog tab becomes visible.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (!this.isDestroyed && !isNullOrUndefined(this.contentElement)) {
            this.updateToolbarState();
            if (this.toolbar) {
                this.toolbar.refreshOverflow();
            }
        }
    }

    /**
     * Applies a changed value after property-style assignment.
     *
     * @returns {void}
     */
    public dataBind(): void {
        this.setEditorContent();
        this.updatePlaceholder();
    }

    /**
     * Detaches the rendered editor from the dialog without destroying the module instance.
     * Called when the edit dialog is closed so that the module stays reusable for the next open.
     *
     * @returns {void}
     * @private
     */
    public detach(): void {
        if (this.isDestroyed || isNullOrUndefined(this.hostElement)) {
            return;
        }
        if (this.linkDialog) {
            this.linkDialog.hide();
        }
        if (this.fontNameDropDown) {
            this.fontNameDropDown.destroy();
            this.fontNameDropDown = null;
        }
        if (this.fontSizeDropDown) {
            this.fontSizeDropDown.destroy();
            this.fontSizeDropDown = null;
        }
        for (let index: number = 0; index < this.colorPickers.length; index++) {
            this.colorPickers[index as number].destroy();
        }
        this.colorPickers = [];
        if (this.toolbar) {
            this.toolbar.destroy();
            this.toolbar = null;
        }
        if (this.toolbarElement) {
            this.toolbarElement.removeEventListener('mousedown', this.onToolbarMouseDownBound);
        }
        if (this.contentElement) {
            this.contentElement.removeEventListener('keydown', this.onKeyDownBound);
            this.contentElement.removeEventListener('beforeinput', this.onBeforeInputBound);
            this.contentElement.removeEventListener('paste', this.onPasteBound);
            this.contentElement.removeEventListener('input', this.onInputBound);
            this.contentElement.removeEventListener('click', this.onEditorClickBound);
            this.closeLinkActionPopup();
        }
        document.removeEventListener('selectionchange', this.onSelectionChangeBound);
        this.hostElement.classList.remove('e-gantt-notes-container', 'e-rtl', 'disabled');
        this.hostElement.style.removeProperty('height');
        this.hostElement.style.removeProperty('min-height');
        this.hostElement.innerHTML = '';
        this.hostElement = null;
        this.toolbarElement = null;
        this.contentElement = null;
        this.savedRange = null;
        this.linkDialog = null;
        this.linkDialogElement = null;
        this.savedCommandStates = null;
    }

    /**
     * Destroys the NotesEditor module and removes its event listeners and DOM references.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.detach();
        this.currentValue = null;
        this.isDestroyed = true;
    }

    private renderToolbar(items: string[] | undefined, enableRtl: boolean, enabled: boolean): void {
        const toolbarItems: string[] = items && items.length ? items : this.getDefaultToolbarItems();
        const ej2Items: ItemModel[] = [];
        for (let index: number = 0; index < toolbarItems.length; index++) {
            const item: string = toolbarItems[index as number];
            if (item === '|') {
                ej2Items.push({ type: 'Separator' });
                continue;
            }
            if (!Object.prototype.hasOwnProperty.call(TOOLBAR_LABELS, item)) {
                continue;
            }
            if (item === 'FontName' || item === 'FontSize') {
                ej2Items.push({
                    type: 'Input',
                    cssClass: item === 'FontName' ? 'e-gantt-notes-font-item' : 'e-gantt-notes-size-item',
                    template: this.createToolbarButtonHost(item)
                });
            } else if (item === 'FontColor' || item === 'BackgroundColor') {
                ej2Items.push({
                    type: 'Input',
                    cssClass: 'e-gantt-notes-color-item',
                    template: this.createToolbarInput(item)
                });
            } else {
                const label: string = this.toolbarLabels[item as keyof NotesToolbarLabelsModel] || TOOLBAR_LABELS[item as string];
                const htmlAttributes: { [key: string]: string } = {
                    'data-command': item,
                    'aria-label': label,
                    'aria-pressed': 'false'
                };
                if (item === 'CreateLink') {
                    htmlAttributes['aria-haspopup'] = 'dialog';
                }
                ej2Items.push({
                    id: this.instanceId + '-' + item,
                    prefixIcon: TOOLBAR_ICONS[item as string],
                    tooltipText: label,
                    cssClass: 'e-gantt-notes-toolbar-action',
                    htmlAttributes,
                    disabled: !enabled,
                    click: () => this.handleToolbarClick(item)
                });
            }
        }
        this.toolbar = new Toolbar({
            items: ej2Items,
            width: '100%',
            overflowMode: Browser.isDevice ? 'Popup' : 'Extended',
            enableRtl,
            cssClass: 'e-gantt-notes-toolbar'
        });
        this.toolbar.appendTo(this.toolbarElement);
        this.toolbar.element.setAttribute('aria-label', this.toolbarLabels.toolbar || 'Notes formatting');
        this.createFontDropdowns(enableRtl, enabled);
        this.createColorPickers(enableRtl, enabled);
    }

    private getDefaultToolbarItems(): string[] {
        return ['Bold', 'Italic', 'Underline', '|', 'FontName', 'FontSize', '|',
            'FontColor', 'BackgroundColor', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink'];
    }

    private createToolbarInput(item: string): HTMLInputElement {
        return createElement('input', {
            attrs: {
                id: this.instanceId + '-' + item,
                'aria-label': this.toolbarLabels[item as keyof NotesToolbarLabelsModel] || TOOLBAR_LABELS[item as string]
            }
        }) as HTMLInputElement;
    }

    private createToolbarButtonHost(item: string): HTMLButtonElement {
        const label: string = this.toolbarLabels[item as keyof NotesToolbarLabelsModel] || TOOLBAR_LABELS[item as string];
        return createElement('button', {
            attrs: {
                id: this.instanceId + '-' + item,
                type: 'button',
                'aria-label': label,
                title: label
            }
        }) as HTMLButtonElement;
    }

    private createFontDropdowns(enableRtl: boolean, enabled: boolean): void {
        const fontNameHost: HTMLButtonElement = this.toolbarElement.querySelector('#' + this.instanceId + '-FontName') as HTMLButtonElement;
        if (fontNameHost) {
            this.fontNameDropDown = new DropDownButton({
                content: this.dropdownContent('FontName', this.toolbarLabels.FontName || TOOLBAR_LABELS.FontName),
                items: FONT_NAMES.map((font: { text: string, value: string, cssClass: string }) => ({
                    id: font.value || 'default', text: font.text
                })),
                itemTemplate: (item: DropDownButtonItemModel) => this.fontNameItemTemplate(item),
                popupWidth: 'auto',
                disabled: !enabled,
                enableRtl,
                cssClass: 'e-gantt-notes-font-dropdown',
                beforeOpen: () => this.saveSelection(),
                select: (args: MenuEventArgs) => {
                    const selectedFont: { text: string, value: string, cssClass: string } = FONT_NAMES.filter(
                        (font: { text: string, value: string, cssClass: string }) => (font.value || 'default') === args.item.id)[0];
                    this.applyFontValue('FontName', selectedFont.value);
                    this.fontNameDropDown.content = this.dropdownContent('FontName', selectedFont.value ? selectedFont.text :
                        (this.toolbarLabels.FontName || TOOLBAR_LABELS.FontName));
                    this.fontNameDropDown.dataBind();
                }
            });
            this.fontNameDropDown.appendTo(fontNameHost);
        }
        const fontSizeHost: HTMLButtonElement = this.toolbarElement.querySelector('#' + this.instanceId + '-FontSize') as HTMLButtonElement;
        if (fontSizeHost) {
            this.fontSizeDropDown = new DropDownButton({
                content: this.dropdownContent('FontSize', this.toolbarLabels.FontSize || TOOLBAR_LABELS.FontSize),
                items: FONT_SIZES.map((size: { text: string, value: string, commandValue: string }) => ({
                    id: size.commandValue || 'default', text: size.text
                })),
                popupWidth: 'auto',
                disabled: !enabled,
                enableRtl,
                cssClass: 'e-gantt-notes-size-dropdown',
                beforeOpen: () => this.saveSelection(),
                select: (args: MenuEventArgs) => {
                    const selectedSize: { text: string, value: string, commandValue: string } = FONT_SIZES.filter(
                        (size: { text: string, value: string, commandValue: string }) => (size.commandValue || 'default') === args.item.id)[0];
                    this.applyFontValue('FontSize', selectedSize.value);
                    this.fontSizeDropDown.content = this.dropdownContent('FontSize', selectedSize.value ? selectedSize.text :
                        (this.toolbarLabels.FontSize || TOOLBAR_LABELS.FontSize));
                    this.fontSizeDropDown.dataBind();
                }
            });
            this.fontSizeDropDown.appendTo(fontSizeHost);
        }
    }

    private dropdownContent(type: string, text: string): string {
        const wrapper: HTMLElement = createElement('span', {
            className: 'e-gantt-notes-dropdown-text e-gantt-notes-' + type.toLowerCase() + '-text'
        });
        wrapper.textContent = text;
        return wrapper.outerHTML;
    }

    private fontNameItemTemplate(item: DropDownButtonItemModel): HTMLElement[] {
        const font: { text: string, value: string, cssClass: string } = FONT_NAMES.filter(
            (family: { text: string, value: string, cssClass: string }) => (family.value || 'default') === item.id)[0];
        const element: HTMLElement = createElement('span', { className: font.cssClass });
        element.style.fontFamily = font.value;
        element.textContent = font.text;
        // Returns the preview element as a node array, matching the EJ2 template
        // contract (node list/array) expected by the DropDownButton template append path.
        return [element];
    }

    private createColorPickers(enableRtl: boolean, enabled: boolean): void {
        const colorItems: string[] = ['FontColor', 'BackgroundColor'];
        for (let index: number = 0; index < colorItems.length; index++) {
            const item: string = colorItems[index as number];
            const input: HTMLInputElement = this.toolbarElement.querySelector('#' + this.instanceId + '-' + item) as HTMLInputElement;
            if (!input) {
                continue;
            }
            const isFontColor: boolean = item === 'FontColor';
            const colorLabel: string = this.toolbarLabels[item as keyof NotesToolbarLabelsModel] || TOOLBAR_LABELS[item as string];
            const picker: ColorPicker = new ColorPicker({
                value: isFontColor ? '#ff0000' : '#ffff00',
                mode: 'Palette',
                modeSwitcher: false,
                showButtons: false,
                showRecentColors: true,
                enableOpacity: false,
                columns: 10,
                presetColors: { 'Custom': isFontColor ? FONT_COLOR_PALETTE : BACKGROUND_COLOR_PALETTE },
                disabled: !enabled,
                enableRtl,
                cssClass: 'e-gantt-notes-colorpicker ' + (isFontColor ? 'e-gantt-notes-font-color' : 'e-gantt-notes-background-color'),
                noColor: true,
                created: () => {
                    const colorPickerHost: HTMLElement = input.parentElement as HTMLElement;
                    if (!colorPickerHost) {
                        return;
                    }
                    const splitColorButton: HTMLElement = colorPickerHost.querySelector('.e-split-colorpicker') as HTMLElement;
                    if (splitColorButton) {
                        splitColorButton.classList.add(
                            'e-icons', isFontColor ? 'e-font-color' : 'e-highlight', isFontColor ? 'e-gantt-notes-font-color-icon' :
                                'e-gantt-notes-background-color-icon');
                        splitColorButton.setAttribute('aria-label', colorLabel);
                        splitColorButton.setAttribute('title', colorLabel);
                    }
                    const dropdownButton: HTMLElement = colorPickerHost.querySelector('.e-dropdown-btn') as HTMLElement;
                    if (dropdownButton) {
                        dropdownButton.setAttribute('aria-label', colorLabel);
                        dropdownButton.setAttribute('title', colorLabel);
                    }
                },
                beforeOpen: (tileArgs: any) => {
                    if (tileArgs.value === '') {
                        tileArgs.element.classList.add('e-nocolor-item');
                    }
                    this.saveSelection();
                },
                change: (args: ColorPickerEventArgs) => {
                    const isNoColor: boolean = args.currentValue.hex === '';
                    this.prepareEditorSelection();
                    const color: string = isNoColor
                        ? (isFontColor ? window.getComputedStyle(this.contentElement).color : 'transparent')
                        : args.currentValue.rgba;
                    document.execCommand(isFontColor ? 'foreColor' : 'hiliteColor', false, color);
                    this.saveSelection();
                    this.updateToolbarState();
                }
            });
            picker.appendTo(input);
            this.colorPickers.push(picker);
        }
    }
    private preventToolbarFocusLoss(event: MouseEvent): void {
        this.saveSelection();
        event.preventDefault();
    }

    private handleToolbarClick(command: string): void {
        this.prepareEditorSelection();
        if (command === 'CreateLink') {
            this.openLinkDialog();
            return;
        }
        if (COMMANDS[command as string]) {
            document.execCommand(COMMANDS[command as string], false, null);
        }
        this.saveSelection();
        this.updateToolbarState();
    }
    private prepareEditorSelection(): void {
        const selection: Selection = window.getSelection();
        const selectionInEditor: boolean = !!selection && selection.rangeCount > 0 &&
            this.contentElement.contains(selection.getRangeAt(0).commonAncestorContainer);

        if (document.activeElement === this.contentElement && selectionInEditor) {
            this.restoreSavedCommandStates();
            return;
        }

        if (!this.savedRange || !this.contentElement.contains(this.savedRange.commonAncestorContainer)) {
            const range: Range = document.createRange();
            const isEmpty: boolean = !this.contentElement.textContent.trim();
            const emptyParagraph: HTMLElement = isEmpty
                ? this.contentElement.querySelector('p, div')
                : null;

            if (emptyParagraph) {
                range.selectNodeContents(emptyParagraph);
                range.collapse(true);
            } else {
                const lastBlock: Element = this.contentElement.lastElementChild;
                range.selectNodeContents(lastBlock || this.contentElement);
                range.collapse(false);
            }

            this.savedRange = range;
            this.savedCommandStates = null;
        }

        this.contentElement.focus();
        this.restoreSelection();
        this.restoreSavedCommandStates();
    }

    private applyFontValue(type: string, value: string): void {
        this.prepareEditorSelection();
        if (!value) {
            this.clearSelectionFontStyle(type);
        } else if (type === 'FontName') {
            document.execCommand('fontName', false, value);
        } else {
            const size: { text: string, value: string, commandValue: string } = FONT_SIZES.filter(
                (fontSize: { text: string, value: string, commandValue: string }) => fontSize.value === value)[0];
            if (size) {
                document.execCommand('fontSize', false, size.commandValue);
            }
        }
        this.saveSelection();
        this.updateToolbarState();
    }

    private clearSelectionFontStyle(type: string): void {
        if (!this.savedRange || this.savedRange.collapsed) {
            return;
        }
        const range: Range = this.savedRange.cloneRange();
        const property: string = type === 'FontName' ? 'font-family' : 'font-size';
        const clearElementProperty: (element: HTMLElement) => void = (element: HTMLElement): void => {
            element.style.removeProperty(property);
            if (element.tagName === 'FONT') {
                element.removeAttribute(type === 'FontName' ? 'face' : 'size');
            }
            if (element.getAttribute('style') === '') {
                element.removeAttribute('style');
            }
        };
        const selectionCoversElement: (element: HTMLElement) => boolean = (element: HTMLElement): boolean => {
            const textWalker: TreeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let firstText: Node = null;
            let lastText: Node = null;
            let textNode: Node = textWalker.nextNode();
            while (textNode) {
                if (textNode.textContent) {
                    if (!firstText) {
                        firstText = textNode;
                    }
                    lastText = textNode;
                }
                textNode = textWalker.nextNode();
            }
            if (!firstText || !lastText) {
                return false;
            }
            const startRange: Range = document.createRange();
            startRange.setStart(firstText, 0);
            startRange.collapse(true);
            const endRange: Range = document.createRange();
            endRange.setStart(lastText, lastText.textContent.length);
            endRange.collapse(true);
            return range.compareBoundaryPoints(Range.START_TO_START, startRange) <= 0 &&
                range.compareBoundaryPoints(Range.END_TO_END, endRange) >= 0;
        };
        for (let ancestor: Node | null = range.commonAncestorContainer;
            ancestor && ancestor !== this.contentElement; ancestor = ancestor.parentNode) {
            if (ancestor.nodeType === 1) {
                const element: HTMLElement = ancestor as HTMLElement;
                const hasTargetProperty: boolean = !!element.style.getPropertyValue(property) ||
                    (element.tagName === 'FONT' && element.hasAttribute(type === 'FontName' ? 'face' : 'size'));
                if (hasTargetProperty && selectionCoversElement(element)) {
                    clearElementProperty(element);
                }
            }
        }
        const fragment: DocumentFragment = range.extractContents();
        const firstNode: Node | null = fragment.firstChild;
        const lastNode: Node | null = fragment.lastChild;
        if (!firstNode || !lastNode) {
            return;
        }
        const clearProperty: (node: Node) => void = (node: Node): void => {
            if (node.nodeType === 1) {
                clearElementProperty(node as HTMLElement);
            }
            for (let child: Node | null = node.firstChild; child; child = child.nextSibling) {
                clearProperty(child);
            }
        };
        clearProperty(fragment);
        range.insertNode(fragment);
        range.setStartBefore(firstNode);
        range.setEndAfter(lastNode);
        const selection: Selection | null = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            this.savedRange = range.cloneRange();
        }
    }

    private openLinkDialog(link?: HTMLAnchorElement): void {
        if (this.linkDialog) {
            return;
        }
        this.editingLink = link || null;
        if (link) {
            const range: Range = document.createRange();
            range.selectNodeContents(link);
            this.savedRange = range.cloneRange();
        }
        this.prepareEditorSelection();
        this.saveSelection();
        const selectedText: string = this.savedRange ? this.savedRange.toString() : '';
        const dialogId: string = this.instanceId + '-link-dialog';
        const content: HTMLElement = createElement('div', { className: 'e-gantt-notes-link-content' });
        const urlId: string = this.instanceId + '-link-url';
        const textId: string = this.instanceId + '-link-text';
        const titleId: string = this.instanceId + '-link-title';
        const targetId: string = this.instanceId + '-link-target';
        const urlLabel: HTMLElement = createElement('label', { attrs: { for: urlId } });
        urlLabel.textContent = this.toolbarLabels.LinkUrl || 'Web address';
        const urlInput: HTMLInputElement = createElement('input', {
            className: 'e-input e-gantt-notes-link-url',
            attrs: {
                id: urlId, type: 'text', placeholder: 'https://', spellcheck: 'false',
                'aria-label': this.toolbarLabels.LinkUrl || 'Web address'
            }
        }) as HTMLInputElement;
        const textLabel: HTMLElement = createElement('label', { attrs: { for: textId } });
        textLabel.textContent = this.toolbarLabels.LinkText || 'Display text';
        const textInput: HTMLInputElement = createElement('input', {
            className: 'e-input e-gantt-notes-link-text',
            attrs: { id: textId, type: 'text', 'aria-label': this.toolbarLabels.LinkText || 'Display text' }
        }) as HTMLInputElement;
        const titleLabel: HTMLElement = createElement('label', { attrs: { for: titleId } });
        titleLabel.textContent = this.toolbarLabels.LinkTitle || 'Title';
        const titleInput: HTMLInputElement = createElement('input', {
            className: 'e-input e-gantt-notes-link-title',
            attrs: { id: titleId, type: 'text', 'aria-label': this.toolbarLabels.LinkTitle || 'Title' }
        }) as HTMLInputElement;
        const targetInput: HTMLInputElement = createElement('input', {
            className: 'e-gantt-notes-link-target',
            attrs: { id: targetId, type: 'checkbox' }
        }) as HTMLInputElement;
        textInput.value = selectedText;
        if (link) {
            urlInput.value = link.getAttribute('href') || '';
            textInput.value = link.textContent || '';
            titleInput.value = link.getAttribute('title') || '';
        }
        this.appendLinkField(content, urlLabel, urlInput);
        this.appendLinkField(content, textLabel, textInput);
        this.appendLinkField(content, titleLabel, titleInput);
        const targetField: HTMLElement = createElement('div', { className: 'e-gantt-notes-link-field' });
        targetField.appendChild(targetInput);
        content.appendChild(targetField);
        this.linkTargetCheckBox = new CheckBox({
            label: this.toolbarLabels.LinkOpenInNewWindow || 'Open in new window',
            checked: link ? link.target === '_blank' : true,
            enableRtl: this.hostElement.classList.contains('e-rtl'),
            cssClass: 'e-gantt-notes-link-window'
        });
        this.linkTargetCheckBox.isStringTemplate = true;
        this.linkTargetCheckBox.appendTo(targetInput);
        const target: HTMLElement = Browser.isDevice ? document.body :
            this.hostElement as HTMLElement || document.body;
        const parentZIndex: number = target === document.body ? 999 : parseInt(window.getComputedStyle(target).zIndex, 10) || 0;
        this.linkDialogElement = createElement('div', { className: 'e-gantt-notes-link-dialog', attrs: { id: dialogId } });
        this.linkDialogElement.style.maxHeight = 'inherit';
        target.appendChild(this.linkDialogElement);
        const dialogModel: DialogModel = {
            header: this.toolbarLabels.LinkHeader || 'Insert Link',
            content,
            width: Browser.isDevice ? '290px' : '310px',
            cssClass: 'e-gantt-notes-link-dialog-shell',
            target,
            zIndex: Math.max(1000, parentZIndex + 1),
            enableRtl: this.hostElement.classList.contains('e-rtl'),
            showCloseIcon: true,
            closeOnEscape: true,
            isModal: Browser.isDevice,
            locale: this.parent.locale,
            position: { X: 'center', Y: Browser.isDevice ? 'center' : 'top' },
            buttons: [
                {
                    buttonModel: { content: this.toolbarLabels.Insert || 'Insert', cssClass: 'e-flat', isPrimary: true },
                    click: () => this.insertLink(urlInput, textInput, titleInput)
                },
                { buttonModel: { content: this.toolbarLabels.Cancel || 'Cancel', cssClass: 'e-flat' }, click: () => this.linkDialog.hide() }
            ],
            animationSettings: { effect: 'None' },
            close: () => this.closeLinkDialog()
        };
        this.linkDialog = new Dialog(dialogModel);
        this.linkDialog.appendTo(this.linkDialogElement);
        urlInput.focus();
    }

    private appendLinkField(content: HTMLElement, label: HTMLElement, input: HTMLElement): void {
        const labelContainer: HTMLElement = createElement('div', { className: 'e-gantt-notes-link-label' });
        const fieldContainer: HTMLElement = createElement('div', { className: 'e-gantt-notes-link-field' });
        labelContainer.appendChild(label);
        fieldContainer.appendChild(input);
        content.appendChild(labelContainer);
        content.appendChild(fieldContainer);
    }

    private insertLink(urlInput: HTMLInputElement, textInput: HTMLInputElement, titleInput: HTMLInputElement): void {
        const rawUrl: string = urlInput.value.trim();
        if (!rawUrl) {
            urlInput.classList.add('e-error');
            urlInput.setAttribute('aria-invalid', 'true');
            urlInput.focus();
            return;
        }
        urlInput.classList.remove('e-error');
        urlInput.removeAttribute('aria-invalid');
        if (!this.savedRange) {
            return;
        }
        const href: string = /^(ftp|http|https):\/\//i.test(rawUrl) ? rawUrl :
            (rawUrl.indexOf('https') > -1 ? rawUrl : 'https://' + rawUrl);
        const link: HTMLAnchorElement = createElement('a') as HTMLAnchorElement;
        link.setAttribute('href', href);
        link.textContent = textInput.value.trim() || href;
        if (titleInput.value) {
            link.setAttribute('title', titleInput.value);
        }
        if (this.linkTargetCheckBox && this.linkTargetCheckBox.checked) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('aria-label', this.toolbarLabels.LinkAriaLabel || 'Opens in a new window');
        }
        const safeHtml: string = this.sanitize(link.outerHTML);
        const wrapper: HTMLElement = createElement('div');
        wrapper.innerHTML = safeHtml;
        const safeLink: HTMLAnchorElement = wrapper.firstElementChild as HTMLAnchorElement;
        if (!safeLink || safeLink.tagName !== 'A') {
            return;
        }
        const range: Range = this.savedRange.cloneRange();
        if (this.editingLink && this.editingLink.parentNode) {
            this.editingLink.parentNode.replaceChild(safeLink, this.editingLink);
        } else {
            range.deleteContents();
            range.insertNode(safeLink);
        }
        range.selectNodeContents(safeLink);
        const showActionsAfterInsert: boolean = !!(this.linkTargetCheckBox && this.linkTargetCheckBox.checked);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.savedRange = range.cloneRange();
        this.updatePlaceholder();
        this.updateToolbarState();
        if (this.linkDialog) {
            this.linkDialog.hide();
        }
        if (showActionsAfterInsert) {
            this.showLinkActionPopup(safeLink);
        }
    }

    private closeLinkDialog(): void {
        const dialog: Dialog = this.linkDialog;
        this.linkDialog = null;
        if (dialog) {
            dialog.destroy();
        }
        if (this.linkTargetCheckBox) {
            this.linkTargetCheckBox.destroy();
            this.linkTargetCheckBox = null;
        }
        if (this.linkDialogElement) {
            this.linkDialogElement.remove();
            this.linkDialogElement = null;
        }
        this.restoreSelection();
        if (this.contentElement && this.contentElement.getAttribute('contenteditable') !== 'false') {
            this.contentElement.focus();
        }
    }

    private saveSelection(): void {
        const selection: Selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            this.savedCommandStates = null;
            return;
        }

        const range: Range = selection.getRangeAt(0);
        if (!this.contentElement || !this.contentElement.contains(range.commonAncestorContainer)) {
            this.savedCommandStates = null;
            return;
        }

        this.savedRange = range.cloneRange();

        if (range.collapsed && document.queryCommandState) {
            this.savedCommandStates = COMMAND_STATE_NAMES.map((command: string) => {
                return { command: command, state: document.queryCommandState(command) };
            });
        } else {
            this.savedCommandStates = null;
        }
    }
    private restoreSavedCommandStates(): void {
        if (!this.savedCommandStates || !document.queryCommandState) {
            return;
        }

        this.savedCommandStates.forEach((savedCommandState: { command: string, state: boolean }) => {
            if (document.queryCommandState(savedCommandState.command) !== savedCommandState.state) {
                document.execCommand(savedCommandState.command, false, null);
            }
        });
    }
    private restoreSelection(): void {
        if (this.savedRange) {
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.savedRange);
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (!this.allowRichText) {
            if ((event.ctrlKey || event.metaKey) && ['b', 'i', 'u'].indexOf(event.key.toLowerCase()) !== -1) {
                event.preventDefault();
            }
            return;
        }
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            document.execCommand('insertParagraph', false, null);
        }
    }

    private handleBeforeInput(event: Event): void {
        const inputType: string = (event as NotesBeforeInputEvent).inputType || '';
        if (!this.allowRichText && (inputType.indexOf('format') === 0 ||
            inputType === 'insertOrderedList' || inputType === 'insertUnorderedList' || inputType === 'insertLink')) {
            event.preventDefault();
        }
    }

    private handlePaste(event: ClipboardEvent): void {
        if (!event.clipboardData || (this.allowRichText && !this.enableHtmlSanitizer)) {
            return;
        }
        event.preventDefault();
        const html: string = event.clipboardData.getData('text/html');
        const text: string = event.clipboardData.getData('text/plain');
        if (text) {
            document.execCommand('insertText', false, text);
            return;
        }
        if (this.allowRichText && html) {
            document.execCommand('insertHTML', false, this.sanitize(html));
        }
    }

    private updateToolbarState(): void {
        if (this.isDestroyed || !this.toolbarElement || !this.contentElement) {
            return;
        }
        if (document.activeElement !== this.contentElement) {
            return;
        }
        if (!isNullOrUndefined(this.linkDialog)) {
            this.closeLinkDialog();
        }
        const toolbarItems: NodeListOf<HTMLElement> = this.toolbarElement.querySelectorAll('.e-toolbar-item[data-command]');
        for (let index: number = 0; index < toolbarItems.length; index++) {
            const toolbarItem: HTMLElement = toolbarItems[index as number];
            const command: string = toolbarItem.getAttribute('data-command');
            const stateCommand: string = COMMANDS[command as string];
            if (stateCommand && document.queryCommandState) {
                const isActive: boolean = document.queryCommandState(stateCommand);
                toolbarItem.setAttribute('aria-pressed', String(isActive));
                toolbarItem.classList.toggle('e-active', isActive);
                const button: HTMLButtonElement = toolbarItem.querySelector('button.e-tbar-btn') as HTMLButtonElement;
                if (button) {
                    button.setAttribute('aria-pressed', String(isActive));
                }
            }
        }
        const fontName: string = document.queryCommandValue('fontName').replace(/["']/g, '').toLowerCase().replace(/\s/g, '');
        const selectedFont: { text: string, value: string, cssClass: string } = FONT_NAMES.filter(
            (family: { text: string, value: string, cssClass: string }) => family.value &&
                (family.value.toLowerCase().replace(/\s/g, '') === fontName ||
                    family.value.split(',')[0].toLowerCase().replace(/\s/g, '') === fontName.split(',')[0]))[0];
        if (this.fontNameDropDown) {
            this.fontNameDropDown.content = this.dropdownContent('FontName', selectedFont ? selectedFont.text :
                (this.toolbarLabels.FontName || TOOLBAR_LABELS.FontName));
            this.fontNameDropDown.dataBind();
        }
        const fontSize: string = document.queryCommandValue('fontSize');
        const selectedSize: { text: string, value: string, commandValue: string } = FONT_SIZES.filter(
            (size: { text: string, value: string, commandValue: string }) => size.commandValue && size.commandValue === fontSize)[0];
        if (this.fontSizeDropDown) {
            this.fontSizeDropDown.content = this.dropdownContent('FontSize', selectedSize ? selectedSize.text :
                (this.toolbarLabels.FontSize || TOOLBAR_LABELS.FontSize));
            this.fontSizeDropDown.dataBind();
        }
        const colorCommands: string[] = ['foreColor', 'hiliteColor'];
        for (let index: number = 0; index < this.colorPickers.length; index++) {
            const currentColor: string = document.queryCommandValue(colorCommands[index as number]);
            if (currentColor && currentColor.indexOf('rgb') === 0) {
                this.colorPickers[index as number].setProperties({
                    value: this.colorPickers[index as number].getValue(currentColor)
                });
            }
        }
    }

    private normalizeValue(value: string): string {
        if (!value) {
            return '<p><br></p>';
        }
        if (/<[a-z][^>]*>/i.test(value)) {
            return value;
        }
        const container: HTMLElement = createElement('div');
        container.innerHTML = value;
        return '<p>' + container.innerHTML + '</p>';
    }

    private setEditorContent(): void {
        if (this.allowRichText) {
            this.contentElement.innerHTML = this.currentValue;
        } else {
            this.contentElement.textContent = this.currentValue;
        }
    }

    private updatePlaceholder(): void {
        if (!this.contentElement || !this.placeholderElement) {
            return;
        }
        const hasNonTextContent: boolean =
            !!this.contentElement.querySelector('img, table, video, audio, iframe, hr');
        const isEmpty: boolean = !this.contentElement.textContent.trim() && !hasNonTextContent;
        this.placeholderElement.classList.toggle('e-placeholder-enabled', isEmpty);
    }

    private sanitize(value: string): string {
        return this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(value) : value;
    }
    private handleEditorClick(event: MouseEvent): void {
        const target: HTMLElement = event.target as HTMLElement;
        const link: HTMLAnchorElement = target && target.closest ?
            target.closest('a') as HTMLAnchorElement : null;

        if (!link || !this.contentElement.contains(link)) {
            return;
        }
        if (event.ctrlKey || event.metaKey) {
            this.openSelectedLink(link);
            return;
        }
        if (link.target !== '_blank') {
            window.location.href = link.href;
            return;
        }
        event.preventDefault();

        const range: Range = document.createRange();
        range.selectNodeContents(link);
        const selection: Selection = window.getSelection();

        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            this.savedRange = range.cloneRange();
        }

        this.showLinkActionPopup(link);
    }

    private showLinkActionPopup(link: HTMLAnchorElement): void {
        this.closeLinkActionPopup();

        const popupElement: HTMLElement = createElement('div', {
            className: 'e-gantt-notes-link-popup'
        });
        this.contentAreaElement.appendChild(popupElement);

        const toolbarElement: HTMLElement = createElement('div');
        popupElement.appendChild(toolbarElement);

        const actions: ItemModel[] = [
            {
                prefixIcon: 'e-open-link',
                tooltipText: this.toolbarLabels.OpenLink || 'Open Link',
                htmlAttributes: { 'aria-label': this.toolbarLabels.OpenLink || 'Open Link' },
                click: () => this.openSelectedLink(link)
            },
            {
                prefixIcon: 'e-hyperlink-edit',
                tooltipText: this.toolbarLabels.EditLink || 'Edit Link',
                htmlAttributes: { 'aria-label': this.toolbarLabels.EditLink || 'Edit Link' },
                click: () => {
                    this.closeLinkActionPopup();
                    this.openLinkDialog(link);
                }
            },
            {
                prefixIcon: 'e-hyperlink-remove',
                tooltipText: this.toolbarLabels.RemoveLink || 'Remove Link',
                htmlAttributes: { 'aria-label': this.toolbarLabels.RemoveLink || 'Remove Link' },
                click: () => this.removeSelectedLink(link)
            }
        ];

        this.linkActionToolbar = new Toolbar({
            items: actions,
            width: '100%',
            height: '38px',
            overflowMode: 'Scrollable',
            enableRtl: this.hostElement.classList.contains('e-rtl'),
            cssClass: 'e-gantt-notes-link-toolbar'
        });
        this.linkActionToolbar.appendTo(toolbarElement);

        popupElement.addEventListener('mousedown', (event: MouseEvent) => event.preventDefault());
        this.linkActionPopupControl = new Popup(popupElement, {
            relateTo: link,
            viewPortElement: this.contentAreaElement,
            position: { X: 'left', Y: 'bottom' },
            collision: { X: 'fit', Y: 'flip' },
            actionOnScroll: 'reposition',
            zIndex: 9
        });
        this.linkActionPopupControl.show(undefined, link);
        const popupRect: DOMRect | ClientRect = popupElement.getBoundingClientRect();
        const linkRect: DOMRect | ClientRect = link.getBoundingClientRect();
        const pointerLeft: number = Math.max(
            9.5,
            Math.min(linkRect.left - popupRect.left + 9.5, popupRect.width - 9.5)
        );
        popupElement.style.setProperty('--link-pointer-left', pointerLeft + 'px');
        this.linkActionPopup = popupElement;
        document.addEventListener('mousedown', this.onLinkPopupOutsideBound);
        document.addEventListener('keydown', this.onLinkPopupKeyDownBound);
    }

    private closeLinkActionPopup(): void {
        document.removeEventListener('mousedown', this.onLinkPopupOutsideBound);
        document.removeEventListener('keydown', this.onLinkPopupKeyDownBound);

        if (this.linkActionPopup) {
            this.linkActionPopup.remove();
            this.linkActionPopup = null;
        }
        if (this.linkActionPopupControl) {
            this.linkActionPopupControl.destroy();
            this.linkActionPopupControl = null;
        }
        if (this.linkActionPopup) {
            this.linkActionPopup.remove();
            this.linkActionPopup = null;
        }
        this.selectedLink = null;
    }

    private handleLinkPopupOutside(event: MouseEvent): void {
        if (this.linkActionPopup && !this.linkActionPopup.contains(event.target as Node)) {
            this.closeLinkActionPopup();
        }
    }

    private handleLinkPopupKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.closeLinkActionPopup();
            this.contentElement.focus();
        }
    }

    private openSelectedLink(link: HTMLAnchorElement): void {
        const url: HTMLAnchorElement = document.createElement('a');
        url.href = link.getAttribute('href') || '';

        if (!/^(https?:|ftp:)$/i.test(url.protocol)) {
            return;
        }

        const opened: Window = window.open(url.href, '_blank', 'noopener,noreferrer');
        if (opened) {
            opened.opener = null;
        }
        this.closeLinkActionPopup();
    }

    private removeSelectedLink(link: HTMLAnchorElement): void {
        const parent: Node = link.parentNode;
        if (!parent) {
            return;
        }

        while (link.firstChild) {
            parent.insertBefore(link.firstChild, link);
        }
        parent.removeChild(link);
        this.closeLinkActionPopup();
        this.updatePlaceholder();
    }
}
