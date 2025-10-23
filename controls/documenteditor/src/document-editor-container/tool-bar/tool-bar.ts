import { createElement, L10n, isNullOrUndefined, EventHandler, classList, Browser } from '@syncfusion/ej2-base';
import { Toolbar as EJ2Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DocumentEditorContainer } from '../document-editor-container';
import { DropDownButton, MenuEventArgs, ItemModel, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';
import { DocumentEditor } from '../../document-editor/document-editor';
import { showSpinner, hideSpinner, DialogUtility } from '@syncfusion/ej2-popups';
import { ToolbarItem, BeforeFileOpenArgs } from '../../document-editor/base';
import { XmlHttpRequestHandler, beforePaneSwitchEvent, toolbarClickEvent, beforeFileOpenEvent } from '../../document-editor/base/index';
import { CustomToolbarItemModel } from '../../document-editor/base/events-helper';
import { beforeXmlHttpRequestSend, XmlHttpRequestEventArgs, ProtectionType, SectionBreakType } from './../../index';
import { ListView, SelectEventArgs as ListSelectEventArgs } from '@syncfusion/ej2-lists';
import { HelperMethods } from './../../index';
import { IToolbarHandler } from '../helper/toolbar-handler';

const TOOLBAR_ID: string = '_toolbar';
const NEW_ID: string = '_new';
const OPEN_ID: string = '_open';
const UNDO_ID: string = '_undo';
const REDO_ID: string = '_redo';
const INSERT_IMAGE_ID: string = '_image';
const INSERT_IMAGE_LOCAL_ID: string = '_image_local';
const INSERT_IMAGE_ONLINE_ID: string = '_image_url';
const INSERT_TABLE_ID: string = '_table';
const INSERT_LINK_ID: string = '_link';
const BOOKMARK_ID: string = '_bookmark';
const COMMENT_ID: string = '_comment';
const TRACK_ID: string = '_track';
const TABLE_OF_CONTENT_ID: string = '_toc';
const HEADER_ID: string = '_header';
const FOOTER_ID: string = '_footer';
const PAGE_SET_UP_ID: string = '_page_setup';
const PAGE_NUMBER_ID: string = '_page_number';
const BREAK_ID: string = '_break';
const LISTVIEW_ID: string = '_listView';
const FIND_ID: string = '_find';
const CLIPBOARD_ID: string = '_use_local_clipboard';
const RESTRICT_EDITING_ID: string = '_restrict_edit';
const PAGE_BREAK: string = '_page_break';
const SECTION_BREAK: string = '_section_break';
const SECTION_BREAK_CONTINUOUS: string = '_section_break_continuous';
const COLUMN_BREAK: string = '_column_break';
const READ_ONLY: string = '_read_only';
const PROTECTIONS: string = '_protections';
const FORM_FIELDS_ID: string = '_form_fields';
const UPDATE_FIELDS_ID: string = '_update_fields';
const TEXT_FORM: string = '_text_form';
const CHECKBOX: string = '_checkbox';
const DROPDOWN: string = '_dropdown';
const FOOTNOTE_ID: string = '_footnote';
const ENDNOTE_ID: string = '_endnote';
const COLUMNS_ID: string = '_columns';
const PAGE_SET_UP: string = '_page_set';
const CONTENT_CONTROL_ID: string = '_content_control';
const RICHTEXT_CONTENT_CONTROL_ID: string = '_richtext_content_control';
const PLAINTEXT_CONTENT_CONTROL_ID: string = '_plaintext_content_control';
const COMBOBOX_CONTENT_CONTROL_ID: string = '_combobox_content_control';
const DROPDOWNDOWN_CONTENT_CONTROL_ID: string = '_dropdown_content_control';
const DATEPICKER_CONTENT_CONTROL_ID: string = '_datepicker_content_control';
const CHECKBOX_CONTENT_CONTROL_ID: string = '_checkbox_content_control';
const PICTURE_CONTENT_CONTROL_ID: string = '_picture_content_control';
const XMLMAPPING_ID: string = '_xmlmapping';

/**
 * Toolbar Module
 */
export class Toolbar implements IToolbarHandler {
    /**
     * @private
     */
    public toolbar: EJ2Toolbar;
    /**
     * @private
     */
    public container: DocumentEditorContainer;
    /**
     * @private
     */
    public filePicker: HTMLInputElement;
    /**
     * @private
     */
    public imagePicker: HTMLInputElement;
    /**
     * @private
     */
    public propertiesPaneButton: Button;
    /**
     * @private
     */
    public importHandler: XmlHttpRequestHandler;
    /**
     * @private
     */
    public isCommentEditing: boolean = false;
    private restrictDropDwn: DropDownButton;
    private imgDropDwn: DropDownButton;
    private breakDropDwn: DropDownButton;
    private breakListView: ListView;
    private formFieldDropDown: DropDownButton;
    private toolbarItems: (CustomToolbarItemModel | ToolbarItem)[];
    private toolbarTimer: number;
    private buttonElement: HTMLButtonElement;
    private PageSetUpDropDwn: DropDownButton;
    private ContentControlDropDwn: DropDownButton;

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    /**
     * @private
     * @param {DocumentEditorContainer} container - DocumentEditorContainer object.
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.importHandler = new XmlHttpRequestHandler();
    }
    private getModuleName(): string {
        return 'toolbar';
    }

    /**
     * Enables or disables the specified Toolbar item.
     *
     * @param  {number} itemIndex - Index of the toolbar items that need to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the toolbar item should be enabled or disabled. By default, `isEnable` is set to true.
     * @returns {void}
     */
    public enableItems(itemIndex: number, isEnable: boolean): void {
        this.toolbar.enableItems(itemIndex, isEnable);
    }
    /**
     * @private
     * @param {CustomToolbarItemModel|ToolbarItem} items - Toolbar items
     * @returns {void}
     */
    public initToolBar(items: (CustomToolbarItemModel | ToolbarItem)[]): void {
        // items = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(items)));
        this.toolbarItems = items;
        this.renderToolBar();
        this.wireEvent();
    }

    private renderToolBar(): void {
        if (isNullOrUndefined(this.container)) {
            return;
        }
        const toolbarContainer: HTMLElement = this.container.toolbarContainer;
        const toolbarWrapper: HTMLElement = createElement('div', { className: 'e-de-tlbr-wrapper' });
        const toolbarTarget: HTMLElement = createElement('div', { className: 'e-de-toolbar' });
        this.initToolbarItems();
        toolbarWrapper.appendChild(toolbarTarget);
        toolbarContainer.appendChild(toolbarWrapper);

        // Show hide pane button initialization
        const locale: L10n = this.container.localObj;
        const propertiesPaneDiv: HTMLElement = createElement('div', { className: 'e-de-ctnr-properties-pane-btn'});
        this.buttonElement = createElement('button', { attrs: { type: 'button', 'aria-label': locale.getConstant('Hide properties pane'), 'aria-pressed': 'true' } }) as HTMLButtonElement;
        propertiesPaneDiv.appendChild(this.buttonElement);
        let cssClassName: string = 'e-tbar-btn e-tbtn-txt e-control e-btn e-de-showhide-btn';
        let iconCss: string = 'e-icons e-de-ctnr-showhide';
        if (this.container.enableRtl) {
            cssClassName += '-rtl';
            iconCss = 'e-icons e-de-ctnr-showhide e-de-flip';
        }
        this.propertiesPaneButton = new Button({
            cssClass: cssClassName,
            iconCss: iconCss
        });
        if (this.container.showPropertiesPane)
        {this.buttonElement.title = locale.getConstant('Hide properties pane'); }
        else {
            this.buttonElement.title = locale.getConstant('Show properties pane');
            classList(propertiesPaneDiv, this.container.restrictEditing ? ['e-de-overlay'] : [], this.container.restrictEditing ? [] : ['e-de-overlay']);
            propertiesPaneDiv.classList.add('e-de-pane-disable-clr');
        }
        this.propertiesPaneButton.appendTo(this.buttonElement);
        EventHandler.add(this.buttonElement, 'click', this.showHidePropertiesPane, this);
        toolbarContainer.appendChild(propertiesPaneDiv);
        this.toolbar.appendTo(toolbarTarget);
        this.initToolbarDropdown(toolbarTarget);
    }
    private initToolbarDropdown(toolbarTarget: HTMLElement): void {
        if (this.container) {
            const locale: L10n = this.container.localObj;
            const id: string = this.container.element.id + TOOLBAR_ID;
            if (this.toolbarItems.indexOf('Image') >= 0) {
                this.imgDropDwn = new DropDownButton({
                    items: [
                        {
                            text: locale.getConstant('Upload from computer'), iconCss: 'e-icons e-de-ctnr-upload',
                            id: id + INSERT_IMAGE_LOCAL_ID
                        }],
                    //,{ text: locale.getConstant('By URL'), iconCss: 'e-icons e-de-ctnr-link', id: id + INSERT_IMAGE_ONLINE_ID }],
                    cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                    select: this.onDropDownButtonSelect.bind(this)
                });
                this.imgDropDwn.appendTo('#' + id + INSERT_IMAGE_ID);
            }

            if (this.toolbarItems.indexOf('PageSetup') >= 0){
                this.PageSetUpDropDwn = new DropDownButton({
                    items : [
                        { text : locale.getConstant('Page Setup'), iconCss: 'e-icons e-de-ctnr-page-size', id: id + PAGE_SET_UP },
                        { text : locale.getConstant('Columns'), iconCss: 'e-icons e-de-ctnr-columns', id: id + COLUMNS_ID }],
                    cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                    select: this.onDropDownButtonSelect.bind(this)
                });
                this.PageSetUpDropDwn.appendTo('#' + id + PAGE_SET_UP_ID);
            }
            if (this.toolbarItems.indexOf('ContentControl') >= 0) {
                //e-btn-icon e-icons e-de-ctnr-image e-icon-left
                this.ContentControlDropDwn = new DropDownButton({
                    items: [
                        { text: locale.getConstant('Rich Text Content Control'), iconCss: 'e-icons e-de-ctnr-change-case', id: id + RICHTEXT_CONTENT_CONTROL_ID},
                        { text: locale.getConstant('Plain Text Content Control'), iconCss: 'e-icons e-de-ctnr-change-case', id: id + PLAINTEXT_CONTENT_CONTROL_ID },
                        { text: locale.getConstant('Picture Content Control'), iconCss: 'e-icons e-de-ctnr-image', id: id + PICTURE_CONTENT_CONTROL_ID },
                        { text: locale.getConstant('Combo Box Content Control'), iconCss: 'e-icons e-de-combo-box', id: id + COMBOBOX_CONTENT_CONTROL_ID },
                        { text: locale.getConstant('Drop-Down List Content Control'), iconCss: 'e-icons e-de-dropdown-list', id: id + DROPDOWNDOWN_CONTENT_CONTROL_ID },
                        { text: locale.getConstant('Date Picker Content Control'), iconCss: 'e-icons e-timeline-today', id: id + DATEPICKER_CONTENT_CONTROL_ID },
                        { text: locale.getConstant('Check Box Content Control'), iconCss: 'e-icons e-check-box', id: id + CHECKBOX_CONTENT_CONTROL_ID}],
                    cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                    select: this.onDropDownButtonSelect.bind(this)
                });
                this.ContentControlDropDwn.appendTo('#' + id + CONTENT_CONTROL_ID);
            }
            if (this.toolbarItems.indexOf('Break') >= 0) {
                const breakDataSource: any = [
                    { text: locale.getConstant('Page'), iconCss: 'e-de-listview e-de-listview-icon e-icons e-de-ctnr-page-break', id: PAGE_BREAK, category: locale.getConstant('Page Breaks') },
                    { text: locale.getConstant('Column'), iconCss: 'e-de-listview e-de-listview-icon e-icons e-de-ctnr-page-break-column', id: COLUMN_BREAK, category: locale.getConstant('Page Breaks') },
                    { text: locale.getConstant('Next Page'), iconCss: 'e-de-listview e-de-listview-icon e-icons e-de-ctnr-section-break', id: SECTION_BREAK, category: locale.getConstant('Section Breaks') },
                    { text: locale.getConstant('Continuous'), iconCss: 'e-de-listview e-de-listview-icon e-icons e-de-ctnr-section-break-continuous', id: SECTION_BREAK_CONTINUOUS, category: locale.getConstant('Section Breaks') }
                ];
                const ddbOption: DropDownButtonModel = {
                    target: '#' + id + BREAK_ID + LISTVIEW_ID,
                    cssClass: 'e-caret-hide'
                };
                this.breakDropDwn = new DropDownButton(ddbOption, '#' + id + BREAK_ID);
                this.breakListView = new ListView({
                    dataSource: breakDataSource,
                    width: '170px',
                    fields: { iconCss: 'iconCss', groupBy: 'category' },
                    showIcon: true,
                    select: this.onListViewSelection.bind(this)
                });
                this.breakListView.appendTo('#' + id + BREAK_ID + LISTVIEW_ID);
            }


            this.filePicker = createElement('input', {
                attrs: { type: 'file', accept: '.doc,.docx,.rtf,.txt,.htm,.html,.sfdt' }, className: 'e-de-ctnr-file-picker'
            }) as HTMLInputElement;
            if (Browser.isIE) {
                document.body.appendChild(this.filePicker);
            }
            this.imagePicker = createElement('input', {
                attrs: { type: 'file', accept: '.jpg,.jpeg,.png,.bmp,.svg' }, className: 'e-de-ctnr-file-picker'
            }) as HTMLInputElement;
            if (Browser.isIE) {
                document.body.appendChild(this.imagePicker);
            }
            if (this.toolbarItems.indexOf('LocalClipboard') >= 0) {
                this.toggleButton(id + CLIPBOARD_ID, this.container.enableLocalPaste);
            }
            if (this.toolbarItems.indexOf('TrackChanges') >= 0) {
                this.toggleButton(id + TRACK_ID, this.container.enableTrackChanges);
            }
            if (this.toolbarItems.indexOf('RestrictEditing') >= 0) {
                this.toggleButton(id + RESTRICT_EDITING_ID, this.container.restrictEditing);
                let restrictIconCss: string = '';
                if (this.container.restrictEditing) {
                    restrictIconCss = ' e-de-selected-item';
                }
                this.restrictDropDwn = new DropDownButton({
                    items: [
                        { text: locale.getConstant('Read only'), id: id + READ_ONLY, iconCss: 'e-icons' + restrictIconCss },
                        { text: locale.getConstant('Protections'), id: id + PROTECTIONS, iconCss: 'e-icons' }],
                    cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                    select: this.onDropDownButtonSelect.bind(this),
                    beforeItemRender: (args: MenuEventArgs) => {
                        this.onBeforeRenderRestrictDropdown(args, id);
                    }
                });
                this.restrictDropDwn.appendTo('#' + id + RESTRICT_EDITING_ID);
            }
            if (this.toolbarItems.indexOf('FormFields') >= 0) {
                this.formFieldDropDown = new DropDownButton({
                    items: [
                        { text: locale.getConstant('Text Form'), iconCss: 'e-icons e-de-textform', id: id + TEXT_FORM },
                        { text: locale.getConstant('Check Box'), iconCss: 'e-icons e-de-checkbox-form', id: id + CHECKBOX },
                        { text: locale.getConstant('DropDown'), iconCss: 'e-icons e-de-dropdownform', id: id + DROPDOWN }],
                    cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                    select: this.onDropDownButtonSelect.bind(this)
                });
                this.formFieldDropDown.appendTo('#' + id + FORM_FIELDS_ID);
            }
        }
    }
    private onListViewSelection(args: ListSelectEventArgs ): void {
        const parentId: string = this.container.element.id + TOOLBAR_ID;
        const id: string = args.item.id;
        if (id === parentId + BREAK_ID + LISTVIEW_ID + '_' + PAGE_BREAK) {
            this.container.documentEditor.editorModule.insertPageBreak();
        } else if (id === parentId + BREAK_ID + LISTVIEW_ID + '_' + SECTION_BREAK) {
            this.container.documentEditor.editorModule.insertSectionBreak();
        } else if (id === parentId + BREAK_ID + LISTVIEW_ID + '_' + SECTION_BREAK_CONTINUOUS) {
            this.container.documentEditor.editorModule.insertSectionBreak(SectionBreakType.Continuous);
        } else if (id === parentId + BREAK_ID + LISTVIEW_ID + '_' + COLUMN_BREAK) {
            this.container.documentEditor.editorModule.insertColumnBreak();
        }
        args.item.classList.remove('e-active');
    }
    private onBeforeRenderRestrictDropdown(args: MenuEventArgs, id: string): void {
        const selectedIcon: HTMLElement = args.element.getElementsByClassName('e-menu-icon')[0] as HTMLElement;
        if (!isNullOrUndefined(selectedIcon)) {
            if (args.item.id === id + READ_ONLY) {
                this.toggleRestrictIcon(selectedIcon, this.container.restrictEditing);
            }
            if (args.item.id === id + PROTECTIONS) {
                const restrictPane: HTMLElement = document.getElementsByClassName('e-de-restrict-pane')[0] as HTMLElement;
                if (!isNullOrUndefined(restrictPane)) {
                    const toggleProtection: boolean = !(restrictPane.style.display === 'none');
                    this.toggleRestrictIcon(selectedIcon, toggleProtection);
                }
            }
        }
    }
    private toggleRestrictIcon(icon: HTMLElement, toggle: boolean): void {
        if (toggle) {
            icon.classList.add('e-de-selected-item');
        } else {
            icon.classList.remove('e-de-selected-item');
        }
    }
    private showHidePropertiesPane(): void {
        const paneDiv: HTMLElement = document.getElementsByClassName('e-de-ctnr-properties-pane-btn')[0] as HTMLButtonElement;
        const locale: L10n = this.container.localObj;
        if (this.container.propertiesPaneContainer.style.display === 'none') {
            this.container.showPropertiesPane = true;
            paneDiv.classList.remove('e-de-pane-disable-clr');
            this.buttonElement.title = locale.getConstant('Hide properties pane');
            this.buttonElement.setAttribute('aria-label', locale.getConstant('Hide properties pane'));
            this.buttonElement.setAttribute('aria-pressed', 'true');
            classList(paneDiv, ['e-de-pane-enable-clr'], []);
            this.container.trigger(beforePaneSwitchEvent, { type: 'PropertiesPane' });
        } else if (this.container.previousContext.indexOf('Header') >= 0
            || this.container.previousContext.indexOf('Footer') >= 0) {
            this.container.showHeaderProperties = !this.container.showHeaderProperties;
        } else {
            this.container.showPropertiesPane = false;
            paneDiv.classList.remove('e-de-pane-enable-clr');
            this.buttonElement.title = locale.getConstant('Show properties pane');
            this.buttonElement.setAttribute('aria-label', locale.getConstant('Show properties pane'));
            this.buttonElement.setAttribute('aria-pressed', 'false');
            classList(paneDiv, ['e-de-pane-disable-clr'], []);
        }
        this.enableDisablePropertyPaneButton(this.container.showPropertiesPane);
        this.container.showPropertiesPaneOnSelection();
        this.documentEditor.focusIn();
    }
    private onWrapText(text: string): string {
        let content: string = '';
        const index: number = text.lastIndexOf(' ');
        if (index !== -1) {
            content = text.slice(0, index);
            text.slice(index);
            content += '<div class="e-de-text-wrap">' + text.slice(index) + '</div>';
        } else {
            content = text;
        }
        return content;
    }
    private wireEvent(): void {
        this.propertiesPaneButton.on('click', this.togglePropertiesPane.bind(this));
        EventHandler.add(this.filePicker, 'change', this.onFileChange, this);
        EventHandler.add(this.imagePicker, 'change', this.onImageChange, this);
    }
    private initToolbarItems(): void {
        this.toolbar = new EJ2Toolbar({
            enableRtl: this.container.enableRtl,
            clicked: this.clickHandler.bind(this),
            items: this.getToolbarItems()
        });
    }
    /**
     * @private
     * @param {CustomToolbarItemModel|ToolbarItem} items - Toolbar items
     * @returns {void}
     */
    public reInitToolbarItems(items: (CustomToolbarItemModel | ToolbarItem)[]): void {
        // items = JSON.parse(HelperMethods.sanitizeString(JSON.stringify(items)));
        for (let i: number = 0; i < items.length; i++) {
            switch (items[parseInt(i.toString(), 10)]) {
            case 'RestrictEditing':
                if (!isNullOrUndefined(this.restrictDropDwn)) {
                    this.restrictDropDwn.destroy();
                }
                break;
            case 'Break':
                if (!isNullOrUndefined(this.breakDropDwn)) {
                    this.breakDropDwn.destroy();
                }
                break;
            case 'PageSetup':
                if (!isNullOrUndefined(this.PageSetUpDropDwn)) {
                    this.PageSetUpDropDwn.destroy();
                }
                break;
            case 'Image':
                if (!isNullOrUndefined(this.imgDropDwn)) {
                    this.imgDropDwn.destroy();
                }
                break;
            case 'FormFields':
                if (!isNullOrUndefined(this.formFieldDropDown)) {
                    this.formFieldDropDown.destroy();
                }
                break;
            }
        }
        this.toolbarItems = items;
        const toolbarTarget: HTMLElement = this.container.toolbarContainer;
        this.toolbar.items = this.getToolbarItems();
        /* eslint-disable @typescript-eslint/indent */
        this.toolbarTimer = Number(setTimeout(() => {
            if (this.toolbarTimer) {
                clearTimeout(this.toolbarTimer);
            }
            this.initToolbarDropdown(toolbarTarget);
            if (items.indexOf('Open') >= 0) {
                EventHandler.add(this.filePicker, 'change', this.onFileChange, this);
            }
            if (items.indexOf('Image') >= 0) {
                EventHandler.add(this.imagePicker, 'change', this.onImageChange, this);
            }
        }, 200));
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private getToolbarItems(): ItemModel[] {
        const locale: L10n = this.container.localObj;
        const id: string = this.container.element.id + TOOLBAR_ID;
        const toolbarItems: any = [];
        let className: string;
        const tItem: (CustomToolbarItemModel | ToolbarItem)[] = this.toolbarItems;
        for (let i: number = 0; i < this.toolbarItems.length; i++) {
            if (i === 0) {
                className = 'e-de-toolbar-btn-start';
            } else if ((tItem[i + 1] === 'Separator') && (tItem[i - 1] === 'Separator')) {
                className = 'e-de-toolbar-btn';
            } else if (tItem[i + 1] === 'Separator') {
                className = 'e-de-toolbar-btn-last';
            } else if (tItem[i - 1] === 'Separator') {
                className = 'e-de-toolbar-btn-first';
            } else if (i === (this.toolbarItems.length - 1)) {
                className = 'e-de-toolbar-btn-end';
            } else {
                className = 'e-de-toolbar-btn-middle';
            }
            switch (tItem[parseInt(i.toString(), 10)]) {
                case 'Separator':
                    toolbarItems.push({
                        type: 'Separator', cssClass: 'e-de-separator'
                    });

                    break;
                case 'New':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-new', tooltipText: locale.getConstant('Create a new document'),
                        id: id + NEW_ID, text: locale.getConstant('New'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Create a new document')}
                    });
                    break;
                case 'Open':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-open', tooltipText: locale.getConstant('Open a document'), id: id + OPEN_ID,
                        text: locale.getConstant('Open'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Open a document')}
                    });
                    break;
                case 'Undo':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-undo', tooltipText: locale.getConstant('Undo Tooltip'),
                        id: id + UNDO_ID, text: locale.getConstant('Undo'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Undo Tooltip')}
                    });
                    break;
                case 'Redo':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-redo', tooltipText: locale.getConstant('Redo Tooltip'),
                        id: id + REDO_ID, text: locale.getConstant('Redo'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Redo Tooltip')}
                    });
                    break;
                case 'Comments':
                    toolbarItems.push({
                        prefixIcon: 'e-de-cnt-cmt-add',
                        tooltipText: locale.getConstant('Show comments'),
                        id: id + COMMENT_ID, text: locale.getConstant('Comments'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Show comments')}
                    });
                    break;
                case 'TrackChanges':
                    toolbarItems.push({
                        prefixIcon: 'e-de-cnt-track',
                        tooltipText: locale.getConstant('Track Changes'),
                        id: id + TRACK_ID, text: this.onWrapText(locale.getConstant('TrackChanges')), cssClass: className,
                        htmlAttributes: { 'aria-label': locale.getConstant('TrackChanges'), 'aria-pressed': this.container.enableTrackChanges, role: 'button', 'aria-hidden': 'true'}
                    });
                    break;
                case 'Image':
                    toolbarItems.push({
                        template: '<button title="' + locale.getConstant('Insert inline picture from a file') + '" class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib e-dropdown-btn e-de-toolbar-btn-first e-caret-hide" type="button" id="' + id + INSERT_IMAGE_ID + '"><span class="e-btn-icon e-icons e-de-ctnr-image e-icon-left"></span><span class="e-tbar-btn-text">' + locale.getConstant('Image') + '</span><span class="e-btn-icon e-icons e-icon-right e-caret"></span></button>',
                        id: id + INSERT_IMAGE_ID, htmlAttributes: {'aria-label': locale.getConstant('Insert inline picture from a file'), 'aria-haspopup': false}
                    });
                    break;
                case 'Table':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-table', tooltipText: locale.getConstant('Insert a table into the document'),
                        id: id + INSERT_TABLE_ID, text: locale.getConstant('Table'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Insert a table into the document'), 'aria-haspopup': true}
                    });
                    break;
                case 'Hyperlink':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-link',
                        tooltipText: locale.getConstant('Create Hyperlink'),
                        id: id + INSERT_LINK_ID, text: locale.getConstant('Link'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Create Hyperlink'), 'aria-haspopup': true}
                    });
                    break;
                case 'Bookmark':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-bookmark',
                        tooltipText: locale.getConstant('Insert a bookmark in a specific place in this document'),
                        id: id + BOOKMARK_ID, text: locale.getConstant('Bookmark'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Insert a bookmark in a specific place in this document'), 'aria-haspopup': true}
                    });
                    break;
                case 'TableOfContents':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-tableofcontent',
                        tooltipText: locale.getConstant('Provide an overview of your document by adding a table of contents'),
                        id: id + TABLE_OF_CONTENT_ID, text: this.onWrapText(locale.getConstant('Table of Contents')),
                        cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Table of Contents')}
                    });
                    break;
                case 'Header':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-header', tooltipText: locale.getConstant('Add or edit the header'),
                        id: id + HEADER_ID, text: locale.getConstant('Header'), cssClass: className,
                        htmlAttributes: {'aria-label': locale.getConstant('Add or edit the header')}
                    });
                    break;
                case 'Footer':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-footer', tooltipText: locale.getConstant('Add or edit the footer'),
                        id: id + FOOTER_ID, text: locale.getConstant('Footer'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Add or edit the footer')}
                    });
                    break;
                case 'PageSetup':
                    toolbarItems.push({
                        template: '<button title="' + locale.getConstant('Page Setup') + '" class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib e-dropdown-btn e-caret-hide" type="button" id="' + id + PAGE_SET_UP_ID + '"><span class="e-btn-icon e-icons e-de-ctnr-pagesetup e-icon-left"></span><span class="e-tbar-btn-text">' + this.onWrapText(locale.getConstant('Page Setup')) + '</span><span class="e-btn-icon e-icons e-icon-right e-caret"></span></button>',
                        id: id + PAGE_SET_UP_ID, htmlAttributes: {'aria-label': locale.getConstant('Page Setup')}
                    });
                    break;
                case 'PageNumber':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-pagenumber', tooltipText: locale.getConstant('Add page numbers'),
                        id: id + PAGE_NUMBER_ID, text: this.onWrapText(locale.getConstant('Page Number')),
                        cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Page Number')}
                    });
                    break;
                case 'Break':
                    toolbarItems.push({
                        template: '<button title="' + locale.getConstant('Break') + '" class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib e-dropdown-btn e-caret-hide" type="button" id="' + id + BREAK_ID + '"><span class="e-btn-icon e-icons e-de-ctnr-break e-icon-left"></span><span class="e-tbar-btn-text">' + locale.getConstant('Break') + '</span><span class="e-btn-icon e-icons e-icon-right e-caret"></span></button><div id="' + id + BREAK_ID + LISTVIEW_ID + '"></div>',
                        id: id + BREAK_ID, htmlAttributes: {'aria-label': locale.getConstant('Break')}
                    });
                    break;
                case 'Find':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-find', tooltipText: locale.getConstant('Find Text'),
                        id: id + FIND_ID, text: locale.getConstant('Find'), cssClass: className, htmlAttributes: {'aria-label': locale.getConstant('Find Text')}
                    });
                    break;
                case 'LocalClipboard':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-paste',
                        tooltipText: locale.getConstant('Toggle between the internal clipboard and system clipboard'),
                        id: id + CLIPBOARD_ID, text: this.onWrapText(locale.getConstant('Local Clipboard')),
                        cssClass: className,
                        htmlAttributes: {'aria-label': locale.getConstant('Local Clipboard'), 'aria-pressed': this.container.enableLocalPaste, role: 'button', 'aria-hidden': 'true'}
                    });
                    break;
                case 'RestrictEditing':
                    toolbarItems.push({
                        template: '<button title="' + locale.getConstant('Restrict editing') + '" class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib e-dropdown-btn e-de-toolbar-btn-first e-caret-hide" type="button" id="' + id + RESTRICT_EDITING_ID + '"><span class="e-btn-icon e-de-ctnr-lock e-icons e-icon-left"></span><span class="e-tbar-btn-text">' + this.onWrapText(locale.getConstant('Restrict Editing')) + '</span><span class="e-btn-icon e-icons e-icon-right e-caret"></span></button>',
                        htmlAttributes: {'aria-label': locale.getConstant('Restrict editing')}
                    });
                    break;
                case 'FormFields':
                    toolbarItems.push({
                        template: '<button title="' + locale.getConstant('Form Fields') + '" class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib e-dropdown-btn e-de-toolbar-btn-first e-caret-hide" type="button" id="' + id + FORM_FIELDS_ID + '"><span class="e-btn-icon e-de-formfield e-icons e-icon-left"></span><span class="e-tbar-btn-text">' + this.onWrapText(locale.getConstant('Form Fields')) + '</span><span class="e-btn-icon e-icons e-icon-right e-caret"></span></button>',
                        id : id + FORM_FIELDS_ID,
                        htmlAttributes: {'aria-label': locale.getConstant('Form Fields')}
                    });
                    break;
                case 'UpdateFields':
                    toolbarItems.push({
                        prefixIcon: 'e-de-update-field', tooltipText: locale.getConstant('Update cross reference fields'),
                        id: id + UPDATE_FIELDS_ID, text: this.onWrapText(locale.getConstant('Update Fields')),
                        cssClass: className + ' e-de-formfields',
                        htmlAttributes: {'aria-label': locale.getConstant('Update cross reference fields')}
                    });
                    break;
                case 'InsertFootnote':
                    toolbarItems.push({
                        prefixIcon: 'e-de-footnote', tooltipText: locale.getConstant('Footnote Tooltip'),
                        text: this.onWrapText(locale.getConstant('Insert Footnote')), id: id + FOOTNOTE_ID,
                        cssClass: className,
                        htmlAttributes: {'aria-label': locale.getConstant('Insert Footnote')}
                    });
                    break;
                case 'InsertEndnote':
                    toolbarItems.push({
                        prefixIcon: 'e-de-endnote', tooltipText: locale.getConstant('Endnote Tooltip'),
                        text: this.onWrapText(locale.getConstant('Insert Endnote')), id: id + ENDNOTE_ID,
                        cssClass: className,
                        htmlAttributes: {'aria-label': locale.getConstant('Insert Endnote')}
                    });
                    break;
                case 'ContentControl':
                    toolbarItems.push({
                        template: '<button title="' + locale.getConstant('Content Control') + '" class="e-tbar-btn e-tbtn-txt e-control e-btn e-lib e-dropdown-btn e-caret-hide" type="button" id="' + id + CONTENT_CONTROL_ID + '"><span class="e-btn-icon e-icons e-de-ctnr-content-control e-icon-left"></span><span class="e-tbar-btn-text">' + this.onWrapText(locale.getConstant('Content Control')) + '</span><span class="e-btn-icon e-icons e-icon-right e-caret"></span></button>',
                        id: id + CONTENT_CONTROL_ID, htmlAttributes: { 'aria-label': locale.getConstant('Content Control') }
                    });
                    break;
                case 'XML Mapping':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-xml-mapping', tooltipText: locale.getConstant('XML Mapping Pane'),
                        id: id + XMLMAPPING_ID, text: this.onWrapText(locale.getConstant('XML Mapping Pane')), cssClass: className,
                        htmlAttributes: { 'aria-label': locale.getConstant('XML Mapping Pane') }
                    });
                    break;
                default:
                    //Here we need to process the items
                    toolbarItems.push(tItem[parseInt(i.toString(), 10)]);
                    break;
            }
        }
        /* eslint-disable */
        for (let i: number = 0; i < toolbarItems.length; i++) {
            let tabindex: string;
            if (toolbarItems[i].text !== 'Separator') {
                tabindex = i.toString();
                toolbarItems[i].htmlattributes = { 'tabindex': tabindex };
            }
        }
        /* eslint-enable */
        return toolbarItems;
    }
    private clickHandler(args: ClickEventArgs): void {
        const id: string = this.container.element.id + TOOLBAR_ID;
        switch (args.item.id) {
        case id + NEW_ID:
            this.container.documentEditor.openBlank();
            this.documentEditor.focusIn();
            break;
        case id + OPEN_ID:
            this.filePicker.value = '';
            this.filePicker.click();
            this.documentEditor.focusIn();
            break;
        case id + UNDO_ID:
            this.container.documentEditor.editorHistoryModule.undo();
            break;
        case id + REDO_ID:
            this.container.documentEditor.editorHistoryModule.redo();
            break;
        case id + INSERT_TABLE_ID:
            this.container.documentEditor.showDialog('Table');
            break;
        case id + INSERT_LINK_ID:
            this.container.documentEditor.showDialog('Hyperlink');
            break;
        case id + BOOKMARK_ID:
            this.container.documentEditor.showDialog('Bookmark');
            break;
        case id + COMMENT_ID:
            this.documentEditor.editorModule.isUserInsert =  true;
            this.documentEditor.editorModule.insertComment('');
            this.documentEditor.editorModule.isUserInsert =  false;
            break;
        case id + TRACK_ID:
            this.toggleTrackChangesInternal(args.item.id);
            break;
        case id + HEADER_ID:
            this.container.documentEditor.selectionModule.goToHeader();
            this.container.statusBar.toggleWebLayout();
            break;
        case id + TABLE_OF_CONTENT_ID:
            this.onToc();
            break;
        case id + XMLMAPPING_ID:
            if (!this.container.documentEditor.isXmlPaneTool) {
                this.container.documentEditor.showXmlPane();
            }
            this.container.statusBar.toggleWebLayout();
            break;
        case id + FOOTER_ID:
            this.container.documentEditor.selectionModule.goToFooter();
            this.container.statusBar.toggleWebLayout();
            break;
            // case id + PAGE_SET_UP_ID:
            //     this.container.documentEditor.showDialog('PageSetup');
            //     break;
        case id + PAGE_NUMBER_ID:
            this.container.documentEditor.editorModule.insertPageNumber();
            break;
        case id + FIND_ID:
            this.container.documentEditor.showOptionsPane();
            break;
        case id + CLIPBOARD_ID:
            this.toggleLocalPaste(args.item.id);
            break;
        case id + UPDATE_FIELDS_ID:
            this.documentEditor.updateFields();
            break;
        case id + FOOTNOTE_ID:
            this.documentEditor.editorModule.insertFootnote();
            break;
        case id + ENDNOTE_ID:
            this.documentEditor.editorModule.insertEndnote();
            break;
        default:
            this.container.trigger(toolbarClickEvent, args);
            break;
        }

        if (args.item.id === id + NEW_ID || args.item.id === id + OPEN_ID || args.item.id === id + UNDO_ID || args.item.id === REDO_ID
            || args.item.id === id + XMLMAPPING_ID || args.item.id === id + COMMENT_ID || args.item.id === id + TRACK_ID
            || args.item.id === id + HEADER_ID || args.item.id === id + TABLE_OF_CONTENT_ID || args.item.id === id + FOOTER_ID
            || args.item.id === id + PAGE_NUMBER_ID || args.item.id === id + CLIPBOARD_ID || args.item.id === id + UPDATE_FIELDS_ID
            || args.item.id === id + FOOTNOTE_ID || args.item.id === id + ENDNOTE_ID || args.item.id === id + PAGE_SET_UP_ID ||
            args.item.id === id + BREAK_ID || args.item.id === id + RESTRICT_EDITING_ID || args.item.id === id + FORM_FIELDS_ID) {
            this.documentEditor.focusIn();
        }
    }
    private toggleLocalPaste(id: string): void {
        this.container.enableLocalPaste = !this.container.enableLocalPaste;
        this.toggleButton(id, this.container.enableLocalPaste);
    }
    private toggleEditing(): void {
        this.container.restrictEditing = !this.container.restrictEditing;
    }
    /**
     * @private
     * @param {boolean} enable - Enable/Disable restrictEditing changes toolbar item.
     * @returns {void}
     */
    public toggleRestrictEditing(enable: boolean): void {
        const restrictEditingId: string = this.container.element.id + TOOLBAR_ID + RESTRICT_EDITING_ID;
        const element: HTMLElement = this.container.element.querySelector('#' + restrictEditingId);
        if (element) {
            this.toggleButton(restrictEditingId, enable);
        }
    }
    private toggleButton(id: string, toggle: boolean): void {
        const element: HTMLElement = this.container.element.querySelector('#' + id) as HTMLElement;
        if (toggle) {
            classList(element, ['e-btn-toggle'], []);
            element.setAttribute('aria-pressed', 'true');
        } else {
            classList(element, [], ['e-btn-toggle']);
            element.setAttribute('aria-pressed', 'false');
        }
    }
    private toggleTrackChangesInternal(id: string, enable?: boolean): void {
        if (!isNullOrUndefined(enable)) {
            this.container.enableTrackChanges = !enable;
        }
        this.container.enableTrackChanges = !this.container.enableTrackChanges;
        this.toggleButton(id, this.container.enableTrackChanges);
    }
    private togglePropertiesPane(): void {
        this.container.showPropertiesPane = !this.container.showPropertiesPane;
    }
    private onDropDownButtonSelect(args: MenuEventArgs): void {
        const parentId: string = this.container.element.id + TOOLBAR_ID;
        const id: string = args.item.id;
        if (id === parentId + INSERT_IMAGE_LOCAL_ID) {
            this.imagePicker.value = '';
            this.imagePicker.click();
        } else if (id === parentId + PAGE_SET_UP){
            this.container.documentEditor.showDialog('PageSetup');
        } else if (id === parentId + COLUMNS_ID){
            this.container.documentEditor.showDialog('Columns');
        } else if (id === parentId + DATEPICKER_CONTENT_CONTROL_ID) {
            this.container.documentEditor.editor.insertContentControl('Date');
        } else if (id === parentId + CHECKBOX_CONTENT_CONTROL_ID) {
            this.container.documentEditor.editor.insertContentControl('CheckBox');
        }
        else if (id === parentId + COMBOBOX_CONTENT_CONTROL_ID) {
            this.container.documentEditor.editor.insertContentControl('ComboBox');
        }
        else if (id === parentId + RICHTEXT_CONTENT_CONTROL_ID) {
            this.container.documentEditor.editor.insertContentControl('RichText');
        }
        else if (id === parentId + PLAINTEXT_CONTENT_CONTROL_ID) {
            this.container.documentEditor.editor.insertContentControl('Text');
        } else if (id === parentId + PICTURE_CONTENT_CONTROL_ID) {
            this.container.documentEditor.showDialog('PictureContentControl');
        } else if (id === parentId + DROPDOWNDOWN_CONTENT_CONTROL_ID) {
            this.container.documentEditor.editor.insertContentControl('DropDownList');
        } else if (id === parentId + INSERT_IMAGE_ONLINE_ID) {
            // Need to implement image dialog;
        } else if (id === parentId + READ_ONLY) {
            this.toggleEditing();
        } else if (id === parentId + PROTECTIONS) {
            this.documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(true);
        } else if (id === parentId + CHECKBOX) {
            this.documentEditor.editorModule.insertFormField('CheckBox');
        } else if (id === parentId + DROPDOWN) {
            this.documentEditor.editorModule.insertFormField('DropDown');
        } else if (id === parentId + TEXT_FORM) {
            this.documentEditor.editorModule.insertFormField('Text');
        }
        setTimeout((): void => {
            this.documentEditor.focusIn();
        }, 30);
    }
    private onFileChange(): void {
        const file: File = this.filePicker.files[0];
        const filesize: number = file.size;
        let check: boolean;
        const eventArgs: BeforeFileOpenArgs = { fileSize: filesize, isCanceled: check };
        this.documentEditor.trigger(beforeFileOpenEvent, eventArgs);
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
                        if (this.documentEditor.documentEditorSettings.openAsyncSettings.enable) {
                            this.container.documentEditor.openAsync(fileReader.result as string);
                        } else {
                            this.container.documentEditor.open(fileReader.result as string);
                        }
                    }
                };
                fileReader.readAsText(file);
            } else {
                if (this.isSupportedFormatType(formatType.toLowerCase())) {
                    //this.convertToSfdt(file);
                    if (this.container.documentEditor.documentEditorSettings.openAsyncSettings.enable) {
                        this.container.documentEditor.openAsync(file);
                    } else {
                        this.container.documentEditor.open(file);
                    }
                }
                else {
                    const localizeValue: L10n = new L10n('documenteditor', this.documentEditor.defaultLocale);
                    DialogUtility.alert({
                        content: localizeValue.getConstant('Unsupported format'),
                        closeOnEscape: true, showCloseIcon: true,
                        position: { X: 'center', Y: 'center' }
                    }).enableRtl = this.container.enableRtl;
                }
            }
            this.container.documentEditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
        }
    }
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
    // private convertToSfdt(file: File): void {
    //     showSpinner(this.container.containerTarget);
    //     this.importHandler.url = this.container.serviceUrl + this.container.serverActionSettings.import;
    //     this.importHandler.onSuccess = this.successHandler.bind(this);
    //     this.importHandler.onFailure = this.failureHandler.bind(this);
    //     this.importHandler.onError = this.failureHandler.bind(this);
    //     this.importHandler.customHeaders = this.container.headers;
    //     const httprequestEventArgs: XmlHttpRequestEventArgs = { serverActionType: 'Import', headers: this.container.headers, timeout: 0, cancel: false, withCredentials: false  };
    //     this.container.trigger(beforeXmlHttpRequestSend, httprequestEventArgs);
    //     const formData: FormData = new FormData();
    //     formData.append('files', file);
    //     if (httprequestEventArgs.cancel) {
    //         hideSpinner(this.container.containerTarget);
    //     } else {
    //         this.importHandler.send(formData, httprequestEventArgs);
    //     }
    // }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private failureHandler(args: any): void {
        if (args.name === 'onError') {
            DialogUtility.alert({
                content: this.container.localObj.getConstant('Error in establishing connection with web server'),
                closeOnEscape: true, showCloseIcon: true,
                position: { X: 'center', Y: 'center' }
            }).enableRtl = this.container.enableRtl;
        } else {
            alert('Failed to load the file');
            this.documentEditor.fireServiceFailure(args);
        }
        hideSpinner(this.container.containerTarget);
    }
    private successHandler(result: any): void {
        /* eslint-disable */
        this.container.documentEditor.open(result.data as string);
        hideSpinner(this.container.containerTarget);
        /* eslint-enable */
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    private onImageChange(): void {
        const file: File = this.imagePicker.files[0];
        const fileReader: FileReader = new FileReader();
        fileReader.onload = (): void => {
            this.insertImage(fileReader.result as string);
        };
        fileReader.readAsDataURL(file);
    }
    private insertImage(data: string): void {
        const image: HTMLImageElement = document.createElement('img');
        const container: DocumentEditorContainer = this.container;
        image.addEventListener('load', function (): void {
            container.documentEditor.editorModule.insertImageInternal(data, true, this.width, this.height, this.alt);
        });
        image.src = data;
    }

    private enableDisableFormField(enable: boolean): void {
        const ele: HTMLElement = this.container.element.querySelector('#' + 'container_toolbar_form_fields');
        if (!isNullOrUndefined(ele)) {
            this.toolbar.enableItems(ele.parentElement, enable);
        }
    }
    /**
     * @private
     * @param {boolean} enable - Emable/Disable insert comment toolbar item.
     * @returns {void}
     */
    public enableDisableInsertComment(enable: boolean): void {
        this.isCommentEditing = !enable;
        const id: string = this.container.element.id + TOOLBAR_ID;
        const commentId: string = id + COMMENT_ID;
        const element: HTMLElement = this.container.element.querySelector('#' + commentId);
        if (!this.container.enableComment && element) {
            this.toolbar.removeItems(element.parentElement);
        } else if (element) {
            if (!isNullOrUndefined(this.documentEditor) && (this.documentEditor.isReadOnly ||
                this.documentEditor.documentHelper.isDocumentProtected)) {
                enable = this.documentEditor.documentHelper.isCommentOnlyMode || !this.documentEditor.isReadOnlyMode;
            }
            this.toolbar.enableItems(element.parentElement, enable);
        }
    }
    /**
     * @private
     * @param {boolean} enable - Emable/Disable track changes toolbar item.
     * @returns {void}
     */
    public toggleTrackChanges(enable: boolean): void {
        const trackId: string = this.container.element.id + TOOLBAR_ID + TRACK_ID;
        const element: HTMLElement = this.container.element.querySelector('#' + trackId);
        if (element) {
            this.toggleTrackChangesInternal(trackId, enable);
        }
    }

    // /**
    //  * @private
    //  */
    // public enableDisableTrackChanges(enable: boolean): void {
    //     let id: string = this.container.element.id + TOOLBAR_ID + TRACK_ID;
    //     if (!isNullOrUndefined(this.documentEditor) && (this.documentEditor.isReadOnly ||
    //         this.documentEditor.documentHelper.isDocumentProtected)) {
    //         enable = false;
    //     }
    //     this.toggleTrackChanges(id, enable);
    // }
    /**
     * @private
     * @param {boolean} enable - Enable/Diable toolbar items.
     * @param {boolean} isProtectedContent - Define whether document is protected.
     * @returns {void}
     */
    public enableDisableToolBarItem(enable: boolean, isProtectedContent: boolean): void {
        if (!isNullOrUndefined(this.container.element)) {
            const id: string = this.container.element.id + TOOLBAR_ID;
            for (const item of this.toolbar.items) {
                const itemId: string = item.id;
                if (itemId !== id + NEW_ID && itemId !== id + OPEN_ID && itemId !== id + FIND_ID &&
                    itemId !== id + CLIPBOARD_ID && itemId !== id + RESTRICT_EDITING_ID
                    && item.type !== 'Separator') {
                    if (enable && this.isCommentEditing && itemId === id + COMMENT_ID) {
                        continue;
                    }
                    if (itemId !== id + UNDO_ID && itemId !== id + REDO_ID && itemId !== id + INSERT_TABLE_ID &&
                        itemId !== id + INSERT_LINK_ID && itemId !== id + BOOKMARK_ID && itemId !== id + COMMENT_ID &&
                        itemId !== id + HEADER_ID && itemId !== id + XMLMAPPING_ID && itemId !== id + TABLE_OF_CONTENT_ID &&
                        itemId !== id + FOOTER_ID && itemId !== id + PAGE_SET_UP_ID && itemId !== id + CONTENT_CONTROL_ID
                        && itemId !== id + PAGE_NUMBER_ID && itemId !== id + INSERT_IMAGE_ID && itemId !== id + FORM_FIELDS_ID
                        && itemId !== id + BREAK_ID && itemId !== id + TRACK_ID && itemId !== id + FOOTNOTE_ID
                        && itemId !== id + ENDNOTE_ID &&
                        itemId !== id + UPDATE_FIELDS_ID) {
                        continue;
                    }
                    if (isProtectedContent && this.documentEditor.documentHelper.isFormFillProtectedMode
                        && itemId === id + UPDATE_FIELDS_ID) {
                        continue;
                    }
                    const element: HTMLElement = this.container.element.querySelector('#' + item.id);
                    if (!isNullOrUndefined(element) && !isNullOrUndefined(element.parentElement)) {
                        this.toolbar.enableItems(element.parentElement, enable);
                    }
                }
            }
            if (!isNullOrUndefined(this.documentEditor)) {
                this.enableDisableFormField(!this.documentEditor.enableHeaderAndFooter && enable
                    && (!this.documentEditor.isReadOnlyMode || this.documentEditor.documentHelper.isDocumentLoadAsynchronously));
            }
            const isPlainContetnControl: boolean = this.documentEditor.selectionModule.isPlainContentControl();
            if (this.documentEditor.selectionModule.isinFootnote || this.documentEditor.selectionModule.isinEndnote
                || this.documentEditor.enableHeaderAndFooter || isPlainContetnControl) {
                if (this.containsItem(id + ENDNOTE_ID)) {
                    this.toolbar.enableItems(this.container.element.querySelector('#' + id + ENDNOTE_ID).parentElement, false);
                }
                if (this.containsItem(id + FOOTNOTE_ID)) {
                    this.toolbar.enableItems(this.container.element.querySelector('#' + id + FOOTNOTE_ID).parentElement, false);
                }
                if (this.containsItem(id + BREAK_ID)) {
                    this.toolbar.enableItems(this.container.element.querySelector('#' + id + BREAK_ID).parentElement, false);
                }
                if (isPlainContetnControl) {
                    if (this.containsItem(id + INSERT_TABLE_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + INSERT_TABLE_ID).parentElement, false);
                    }
                    if (this.containsItem(id + INSERT_IMAGE_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + INSERT_IMAGE_ID).parentElement, false);
                    }
                    if (this.containsItem(id + COMMENT_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + COMMENT_ID).parentElement, false);
                    }
                    if (this.containsItem(id + BOOKMARK_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + BOOKMARK_ID).parentElement, false);
                    }
                    if (this.containsItem(id + INSERT_LINK_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + INSERT_LINK_ID).parentElement, false);
                    }
                    if (this.containsItem(id + FORM_FIELDS_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + FORM_FIELDS_ID).parentElement, false);
                    }
                    if (this.containsItem(id + CONTENT_CONTROL_ID)) {
                        this.toolbar.enableItems(this.container.element.querySelector('#' + id + CONTENT_CONTROL_ID).parentElement, false);
                    }
                }
            }
            if (this.documentEditor.selection.isCellOrRowSelected() && this.containsItem(id + INSERT_LINK_ID)) {
                this.toolbar.enableItems(this.container.element.querySelector('#' + id + INSERT_LINK_ID).parentElement, false);
            }
            if (!isProtectedContent || this.container.showPropertiesPane) {
                if (isProtectedContent) {
                    enable = this.container.showPropertiesPane;
                }
                classList(this.propertiesPaneButton.element.parentElement, !enable ? ['e-de-overlay'] : [], !enable ? [] : ['e-de-overlay']);
            }
            const protectionType: ProtectionType = this.documentEditor.documentHelper.protectionType;
            if (enable || (this.documentEditor.documentHelper.isDocumentProtected &&
                (protectionType === 'FormFieldsOnly' || protectionType === 'CommentsOnly'))) {
                this.enableDisableUndoRedo();
            }
            if (this.documentEditor.documentHelper.isTrackedOnlyMode && this.containsItem(id + TRACK_ID)) {
                this.toolbar.enableItems(this.container.element.querySelector('#' + id + TRACK_ID).parentElement, false);
            }
        }
    }
    private containsItem(id: string): boolean {
        for (const item of this.toolbar.items) {
            if (item.id === id) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     * @returns {void}
     */
    public enableDisableUndoRedo(): void {
        const id: string = this.container.element.id + TOOLBAR_ID;
        if (this.toolbarItems.indexOf('Undo') >= 0) {
            const undoElement: HTMLElement = this.container.element.querySelector('#' + id + UNDO_ID);
            // We can optimize this condition check to single bool validation instead of array collection.
            /* eslint-disable-next-line max-len */
            if (!isNullOrUndefined(undoElement)) {
                this.toolbar.enableItems(undoElement.parentElement, this.container.documentEditor.editorHistoryModule.canUndo());
            }
        }
        if (this.toolbarItems.indexOf('Redo') >= 0) {
            const redoElement: HTMLElement = this.container.element.querySelector('#' + id + REDO_ID);
            // We can optimize this condition check to single bool validation instead of array collection.
            /* eslint-disable-next-line max-len */
            if (!isNullOrUndefined(redoElement)) {
                this.toolbar.enableItems(redoElement.parentElement, this.container.documentEditor.editorHistoryModule.canRedo());
            }
        }
    }
    private onToc(): void {
        if (this.container.previousContext === 'TableOfContents' && this.container.propertiesPaneContainer.style.display === 'none') {
            this.container.showPropertiesPane = false;
            this.documentEditor.focusIn();
            return;
        }
        if (this.container.headerFooterProperties.element.style.display === 'block') {
            this.documentEditor.selectionModule.closeHeaderFooter();
        }
        this.enableDisablePropertyPaneButton(false);
        this.container.showProperties('toc');
    }
    /**
     * @private
     * @param {boolean} isShow - show/hide property pane.
     * @returns {void}
     */
    public enableDisablePropertyPaneButton(isShow: boolean): void {
        if (isShow) {
            classList(this.propertiesPaneButton.element.firstChild as HTMLElement, ['e-pane-enabled'], ['e-pane-disabled']);
        } else {
            classList(this.propertiesPaneButton.element.firstChild as HTMLElement, ['e-pane-disabled'], ['e-pane-enabled']);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onContentChange(): void {
        this.enableDisableUndoRedo();
    }

    /**
     * Handles document changes (like loading a new document)
     * @returns {void}
     * @private
     */
    public onDocumentChange(): void {
        this.isCommentEditing = false;
        this.enableDisableInsertComment(true);
        this.enableDisableUndoRedo();
    }
    /**
     * @param {boolean} isToggle - toggle track changes.
     * @returns {void}
     * @private
     */
    public initialize(isToggle?: boolean): void {
        this.initToolBar(this.container.toolbarItems);
        this.enableDisableInsertComment(this.container.enableComment);
        if (isToggle) {
            this.toggleTrackChanges(this.container.enableTrackChanges);
            this.container.initializePane();
            this.container.showHidePropertiesPane(this.container.showPropertiesPane);
        }
    }
    /**
     * @param {boolean} restrictEditing - restrict editing.
     * @returns {void}
     * @private
     */
    public restrictEditingToggleHelper(restrictEditing: boolean): void {
        this.enableDisableToolBarItem(!restrictEditing, false);
        this.toggleRestrictEditing(restrictEditing);
    }

    /**
     * @private
     * @returns { void }
     */
    public destroy(): void {
        if (this.restrictDropDwn) {
            this.restrictDropDwn.destroy();
            this.restrictDropDwn = undefined;
        }
        if (this.imgDropDwn) {
            this.imgDropDwn.destroy();
            this.imgDropDwn = undefined;
        }
        if (this.PageSetUpDropDwn){
            this.PageSetUpDropDwn.destroy();
            this.PageSetUpDropDwn = undefined;
        }
        if (this.breakDropDwn) {
            this.breakDropDwn.destroy();
            this.breakDropDwn = undefined;
        }
        if (this.formFieldDropDown) {
            this.formFieldDropDown.destroy();
            this.formFieldDropDown = undefined;
        }
        if (this.ContentControlDropDwn) {
            this.ContentControlDropDwn.destroy();
            this.ContentControlDropDwn = undefined;
        }
        if (this.toolbar) {
            const toolbarElement: HTMLElement = this.toolbar.element;
            this.toolbar.destroy();
            this.toolbar = undefined;
            toolbarElement.parentElement.removeChild(toolbarElement);
        }
        if (this.container.toolbarContainer) {
            this.container.containerTarget.removeChild(this.container.toolbarContainer);
            this.container.toolbarContainer = undefined;
        }
        if (this.container.toolbarModule) {
            this.container.toolbarModule = undefined;
        }
        if (this.propertiesPaneButton) {
            this.propertiesPaneButton.destroy();
        }
        if (this.breakListView) {
            this.breakListView.destroy();
            this.breakListView = undefined;
        }
        this.propertiesPaneButton = undefined;
        this.toolbarItems = [];
        this.toolbarItems = undefined;
        this.container = undefined;
    }
}
