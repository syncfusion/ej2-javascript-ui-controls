import { LayoutViewer, DocumentHelper, ElementBox, ContentControl } from '../index';
import { createElement, isNullOrUndefined, L10n, classList } from '@syncfusion/ej2-base';
import { TreeView, ContextMenu as Menu, MenuItemModel, ContextMenuModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DocumentEditorContainer } from '../../../document-editor-container';
import { DropDownList, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';


/**
 * xml Pane class.
 */
export class XmlPane {

    private documentHelper: DocumentHelper;
    /**
     * @private
     */
    public element: HTMLElement;
    private positionLabelDiv: HTMLElement;
    private isRtl: boolean;
    /**
     * @private
     */
    public isXmlPaneShow: boolean = false;
    /**
     * @private
     */
    public mappedContentControl: ContentControl;
    /**
     * @private
     */
    public isAddedDocumentXml: boolean = false;
    /**
     * @private
     */
    public treeviewObject: TreeView;
    private alertDialog: Dialog;
    public ulelement: HTMLUListElement;
    /**
     * @private
     */
    public contextMenuInstance: Menu = undefined;
    private localeValue: L10n;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @param {boolean} isRtl - Specifies the Rtl.
     * @private
     */
    public constructor(documentHelper: DocumentHelper, isRtl?: boolean) {
        this.documentHelper = documentHelper;
        this.isRtl = isRtl;
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }

    private getModuleName(): string {
        return 'XmlPane';
    }
    /**
     * To set Drop Down List Data.
     *
     * @param {Object} key.
     * @private
     * @returns {void}
     */
    public DropDownListData: { [key: string]: Object }[] = [
        { ID: 'Choose', Value: 'Choose an XML file' },
        { ID: 'Add', Value: '(Add new part...)' }
    ];
    public dropDownListObject: DropDownList;
    /**
     * @private
     * @param {boolean} enable - enable/disable header footer pane.
     * @returns {void}
     */
    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }

    /**
     * Initialize the Xml Mapping.
     *
     * @private
     * @param {L10n} localeValue - Specifies the localization based on culture.
     * @param {boolean} isRtl - Specifies the Rtl.
     * @returns {void}
     */
    /* eslint-disable  */
    public initializeXmlMapping(): void {
        const localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale, this.documentHelper.owner.locale);
        const elementId: string = 'xml_mapping_properties';
        this.element = createElement('div', { id: this.documentHelper.owner.element.id + elementId, className: 'e-de-op' });
        const headerDiv: HTMLElement = this.createDivTemplate('_header_footer', this.element, 'padding-bottom:0');
        classList(headerDiv, ['e-de-cntr-pane-padding'], []);
        headerDiv.style.paddingLeft = '0px';
        const headerLabel: HTMLElement = createElement('label', { className: 'e-de-prop-header-label' });
        headerLabel.innerHTML = localObj.getConstant('XML Mapping');
        let closeButtonFloat: string;
        if (!this.isRtl) {
            closeButtonFloat = 'float:right;';
        } else {
            closeButtonFloat = 'float:left;';
        }
        const closeIcon: HTMLElement = createElement('span', {
            id: '_header_footer_close',
            className: 'e-de-ctnr-close e-de-close-icon e-icons',
            styles: 'display:inline-block;cursor:pointer;' + closeButtonFloat
        });
        closeIcon.addEventListener('click', (): void => {
            this.onClose();
        });
        headerDiv.appendChild(headerLabel);
        headerDiv.appendChild(closeIcon);
        // first div
        const optionsLabelDiv: HTMLElement = this.createDivTemplate(elementId + '_xml', this.element);
        classList(optionsLabelDiv, ['e-de-cntr-pane-padding'], []);
        optionsLabelDiv.style.paddingLeft = '0px';
        optionsLabelDiv.style.paddingRight = '5px';
        optionsLabelDiv.style.width = '275px';
        const optionsLabel: HTMLElement = createElement('label', { className: 'e-de-ctnr-prop-label', styles: 'height:20px;' });
        optionsLabel.innerHTML = localObj.getConstant('Custom XML Part');
        optionsLabelDiv.appendChild(optionsLabel);
        const optionsDiv: HTMLElement = this.createDivTemplate(elementId + '_xmlDiv', optionsLabelDiv);
        const firstPageDiv: HTMLElement = this.createDivTemplate(elementId + '_firstPageDiv', optionsDiv);
        classList(firstPageDiv, ['e-de-hdr-ftr-frst-div'], []);
        const firstPage: HTMLInputElement = createElement('input', { id: elementId + '_firstPageDiv' + '_dropdownlist', className: 'e-de-prop-sub-label' }) as HTMLInputElement;
        firstPage.type = 'text';
        firstPage.tabIndex = 1;
        firstPageDiv.appendChild(firstPage);
        // second div
        this.positionLabelDiv = createElement('div', { id: elementId + '_positionLabelDiv', className: 'e-de-scrollbar-hide', styles: 'width:270px;height:310px;list-style:none;padding-right:5px;overflow:auto;' });
        this.element.appendChild(this.positionLabelDiv);
        // second div tree view
        const tree = createElement('div', { id: 'tree', className: 'e-de-scrollbar-hide', styles: 'width:270px;height:310px;list-style:none;padding-right:5px;overflow:auto;' });
        let ul: HTMLUListElement = document.createElement('ul');
        ul.contentEditable = 'false';
        ul.style.width = 'auto';
        ul.className = 'e-list-parent e-ul';
        ul.style.paddingLeft = '0px'
        ul.id = 'e-de-pane-contextmenu-list';
        ul.style.listStyle = 'none';
        ul.style.margin = '0px';
        ul.style.maxHeight = 'auto';
        ul.oncontextmenu = this.disableBrowserContextmenu;
        this.treeviewObject = new TreeView({
            fields: this.field,
            cssClass: 'e-de-custom-treeview',
        });
        this.treeviewObject.appendTo(tree);
        this.positionLabelDiv.appendChild(tree);
        this.positionLabelDiv.appendChild(ul);
        this.documentHelper.owner.editor.dictionaryObject[this.documentHelper.owner.editor.dictionaryObjectIndexIncrement++] = {
            ID: 'Default',
            Data: this.hierarchicalData
        };
        if (this.documentHelper.owner.editor.xmlData && this.documentHelper.owner.editor.xmlData.length === 0) {
            this.documentHelper.owner.editor.xmlData = this.hierarchicalData;
        }
    }
    /**
* To set Default Treeview data.
* @param {Object} key.
* @returns {void}
*/
    private hierarchicalData: { [key: string]: Object }[] = [];
    public field: Object = {
        dataSource: this.hierarchicalData,
        id: 'id',
        text: 'displayText',
        hasChildren: 'hasChild',
        value: "displayValue",
        parentID: 'pid',
        tooltip: 'tooltip',
    };
    /**
    * To initialize Context Menu.
    * @returns {void}
    */
    private initializeContextMenu() {
        let menuItems: MenuItemModel[] = [
            {
                text: 'Insert Content control',
                id: 'Insert',
                items: [
                    {
                        text: 'Plain Text',
                        id: 'PlainText'
                    },
                    {
                        text: 'Picture',
                        id: 'Picture'
                    },
                    {
                        text: 'CheckBox',
                        id: 'CheckBox'
                    },
                    {
                        text: 'Combo Box',
                        id: 'ComboBox'
                    },
                    {
                        text: 'Dropdown List',
                        id: 'DropdownList'
                    },
                    {
                        text: 'Date Picker',
                        id: 'DatePicker'
                    },
                ]
            },
            {
                text: 'Map to selected content control',
                id: 'MapToSelectedContentControl'
            },
        ];
        let menuOptions: ContextMenuModel = {
            target: '#tree',
            items: menuItems,
            select: this.handleContextMenuItem.bind(this),
            beforeOpen: this.contextMenuBeforeOpen.bind(this)
        };
        this.contextMenuInstance = new Menu(menuOptions, '#e-de-pane-contextmenu-list');
    }
    /**
    * To intialize Drop Down List.
    * @returns {void}
    */
    private intializeDropDownList() {
        this.dropDownListObject = new DropDownList({
            dataSource: this.DropDownListData,
            fields: { text: 'Value', value: 'ID' },
            text: this.DropDownListData[0].Value as string,
            select: this.handleDropDownList.bind(this)
        });
        this.dropDownListObject.appendTo('#xml_mapping_properties_firstPageDiv_dropdownlist');

    }
    /**
    * To handle Drop Down List collection by selection.
    * @param {SelectEventArgs} args.
    * @private
    * @returns {void}
    */
    public handleDropDownList(args: SelectEventArgs) {
        let regx = /(no namespace)/;
        let currentID: string;
        let selectedItem: string = args.item.innerText;
        for (let i = 0; i < this.DropDownListData.length; i++) {
            if (this.dropDownListObject.dataSource[i].Value == selectedItem) {
                currentID = this.dropDownListObject.dataSource[i].ID;
            }
        }
        if (selectedItem === '(Add new part...)') {
            this.documentHelper.owner.prefixMappings = " ";
            this.handleFileSelect();
        }
        else if (regx.test(selectedItem)) {
            this.documentHelper.owner.prefixMappings = " ";
            for (let i = 0; i < this.documentHelper.owner.editor.dictionaryObject.length; i++) {
                if (currentID === this.documentHelper.owner.editor.dictionaryObject[i].ID) {
                    this.handleTreeviewObject(i);
                }
            }
        }
        else if (selectedItem === 'Choose an XML file'){
            this.documentHelper.owner.prefixMappings = " "
            this.handleTreeviewObject(0);
        }
        else {
            this.documentHelper.owner.prefixMappings = selectedItem;
            for (let i = 0; i < this.documentHelper.owner.editor.dictionaryObject.length; i++) {
                if (currentID === this.documentHelper.owner.editor.dictionaryObject[i].ID) {
                    this.handleTreeviewObject(i);
                }
            }
        }
    }
    /**
    * To handle Treeview object collection based on the xml Data.
    * @param {number} index.
    * @returns {void}
    */
    private handleTreeviewObject(index: number) {
        this.treeviewObject.fields.dataSource = this.documentHelper.owner.editor.dictionaryObject[index].Data;
        this.treeviewObject.dataBind();
        this.documentHelper.owner.editor.xmlData = this.documentHelper.owner.editor.dictionaryObject[index].Data;
    }
    /**
    * To context Menu scenario Before Open.
    * @param {BeforeOpenCloseMenuEventArgs} args.
    * @returns {void}
    */
    private contextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        let contentControl: ContentControl = this.documentHelper.owner.editor.getContentControl();
        let contentControlImage: ElementBox = this.documentHelper.owner.getImageContentControl();
        let content: string[] = this.treeviewObject.selectedNodes;
        let node = this.treeviewObject.getNode(content[0]);
        if ((node as any).hasChildren) {
            args.cancel = true;
        }
        if (!isNullOrUndefined(this.contextMenuInstance)) {
            if (!isNullOrUndefined(contentControl) || !isNullOrUndefined(contentControlImage)) {
                this.contextMenuInstance.enableItems(['Map to selected content control'], true);
            }
            else {
                this.contextMenuInstance.enableItems(['Map to selected content control'], false);
            }
        }
    }
    /**
    * To handle Context Menu Items based on Type of content control.
    * @param {MenuEventArgs} args.
    * @returns {void}
    */
    private handleContextMenuItem(args: MenuEventArgs): void {
        let item: string = args.element.id;
        switch (item) {
            case 'RichText':
            case 'PlainText':
            case 'Picture':
            case 'ComboBox':
            case 'DropdownList':
            case 'CheckBox':
            case 'DatePicker':
                this.applyContentControl(item);
                break;
            case 'MapToSelectedContentControl':
                let contentControl: ContentControl = this.documentHelper.owner.editor.getContentControl();
                let contentControlImage: ElementBox = this.documentHelper.owner.getImageContentControl();
                if (!isNullOrUndefined(contentControl) || !isNullOrUndefined(contentControlImage)) {
                    this.documentHelper.owner.isXmlMapCC = true;
                    if (this.documentHelper.owner.isXmlMapCC && !isNullOrUndefined(this.documentHelper.owner.editor.xmlData.length) && this.documentHelper.owner.editor.xmlData.length > 0) {
                        this.getXmlPath();
                    }
                    this.documentHelper.owner.selection.selectContentInternal(contentControl);
                    this.mappedContentControl = contentControl;
                    if (contentControl.contentControlProperties.type !== 'CheckBox') {
                        this.insertContent();
                    }
                }
                break;
        }
    }

    private disableBrowserContextmenu(): boolean {
        return false;
    }
    /**
    * To apply Content Control.
    * @param {string} args.
    * @returns {void}
    */
    private applyContentControl(args: string): void {
        this.documentHelper.owner.isXmlMapCC = true;
        if (this.documentHelper.owner.isXmlMapCC && !isNullOrUndefined(this.documentHelper.owner.editor.xmlData.length) && this.documentHelper.owner.editor.xmlData.length > 0) {
            this.getXmlPath();
        }
        let contentControl: ContentControl = this.documentHelper.owner.editor.getContentControl();
        let contentControlImage: ElementBox = this.documentHelper.owner.getImageContentControl();
        if (!isNullOrUndefined(contentControl) || !isNullOrUndefined(contentControlImage)) {
            const localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
            localObj.setLocale(this.documentHelper.owner.locale);
            this.alertDialog = DialogUtility.alert({
                title: localObj.getConstant('Information'),
                content: localObj.getConstant('Discard Content Control'),
                okButton: { text: localObj.getConstant('Ok') },
                showCloseIcon: true,
                closeOnEscape: true,
                animationSettings: { effect: 'Zoom' },
                position: { X: 'center', Y: 'center' },
                close: (): void => {
                    this.closeDialogUtils.bind(this);
                }
            });
        } else {
            switch (args) {
                case 'PlainText':
                    this.documentHelper.owner.editor.insertContentControl('Text');
                    this.insertContent();
                    break;
                case 'RichText':
                    this.documentHelper.owner.editor.insertContentControl('RichText');
                    this.insertContent();
                    break;
                case 'Picture':
                    this.documentHelper.owner.showDialog('PictureContentControl');
                    break;
                case 'ComboBox':
                    this.documentHelper.owner.editor.insertContentControl('ComboBox');
                    this.insertContent();
                    break;
                case 'DropdownList':
                    this.documentHelper.owner.editor.insertContentControl('DropDownList');
                    this.insertContent();
                    break;
                case 'CheckBox':
                    this.documentHelper.owner.editor.insertContentControl('CheckBox');
                    break;
                case 'DatePicker':
                    this.documentHelper.owner.editor.insertContentControl('Date');
                    this.insertContent();
                    break;
            }
        }
    }
    /**
    * To insert Content inside the content control.
    * @returns {void}
    */
    private insertContent() {
        let selectedNode = this.treeviewObject.selectedNodes.toString();
        for (let i = 1; i < this.documentHelper.owner.editor.xmlData.length; i++) {
            let xmlID = this.documentHelper.owner.editor.xmlData[i].id.toString();
            if (selectedNode == xmlID) {
                if (!isNullOrUndefined(this.documentHelper.owner.editor.xmlData[i].displayValue)) {
                    let content = this.documentHelper.owner.editor.xmlData[i].displayValue.toString();
                    this.documentHelper.owner.editor.insertText(content);
                }
            }
        }
        this.documentHelper.owner.isXmlMapCC = false;
    }
    /**
     * @private
     * @returns {void}
     */
    public updateContent(updatedText: string, xpath: string): void {
        if (updatedText === String.fromCharCode(9744) || updatedText === String.fromCharCode(9746)) {
            this.updateCheckBoxContentControl(updatedText, xpath);
        }
        else {
            if (this.documentHelper.owner.xmlPaneModule.isXmlPaneShow) {
                this.updateXMLData(updatedText);
            }
            const start = this.documentHelper.selection.start.clone();
            const end = this.documentHelper.selection.end.clone();
            for (let i = 0; i < this.documentHelper.contentControlCollection.length; i++) {
                let contentControl = this.documentHelper.contentControlCollection[i];
                if (contentControl.contentControlProperties.xmlMapping && contentControl.contentControlProperties.xmlMapping.xPath === xpath && contentControl.contentControlProperties.type !== 'CheckBox') {
                    this.updateContentControl(contentControl, updatedText);
                }
            }
            this.documentHelper.selection.selectRange(start, end);
        }
    }

    private updateContentControl(contentControl: ContentControl, updatedText: string): void {
        this.documentHelper.selection.selectContentControlInternal(contentControl);
        this.documentHelper.owner.editor.insertText(updatedText);
    }

    private updateCheckBoxContentControl(updatedText: string, xpath: string): void {
        let isChecked: string;
        if (updatedText === String.fromCharCode(9746)) {
            isChecked = 'true';
        }
        else if (updatedText === String.fromCharCode(9744)) {
            isChecked = 'false';
        }
        if (this.documentHelper.owner.xmlPaneModule.isXmlPaneShow) {
            this.updateXMLData(updatedText);
        }
        const start = this.documentHelper.selection.start.clone();
        const end = this.documentHelper.selection.end.clone();
        for (let i = 0; i < this.documentHelper.contentControlCollection.length; i++) {
            let contentControl = this.documentHelper.contentControlCollection[i];
            if (contentControl.contentControlProperties.xmlMapping && contentControl.contentControlProperties.xmlMapping.xPath === xpath && contentControl.contentControlProperties.type !== 'CheckBox') {
                this.updateContentControl(contentControl, isChecked);
            }
            else if (contentControl.contentControlProperties.xmlMapping && contentControl.contentControlProperties.xmlMapping.xPath === xpath && contentControl.contentControlProperties.type === 'CheckBox') {
                this.updateContentControl(contentControl, updatedText);
            }
        }
        this.documentHelper.selection.selectRange(start, end);
    }

    private updateXMLData(Text: String): void {
        let selectedNode = this.treeviewObject.selectedNodes.toString();
        for (let i = 1; i < this.documentHelper.owner.editor.xmlData.length; i++) {
            let xmlID = this.documentHelper.owner.editor.xmlData[i].id.toString();
            if (selectedNode === xmlID) {
                if (!isNullOrUndefined(this.documentHelper.owner.editor.xmlData[i].displayValue)) {
                    this.documentHelper.owner.editor.xmlData[i].displayValue = Text;
                }
            }
        }
    }
    /**
    * To get the XMLpath to bind in the XML mapping property
    * @returns {}
    */
    private getXmlPath() {
        let selectedNode = this.treeviewObject.selectedNodes.toString();
        let xPath = "";
        let nodeId = Number(selectedNode) - 1;
        for (var i = this.documentHelper.owner.editor.xmlData.length - 1; i >= 0; i--) {
            if (!isNullOrUndefined(this.documentHelper.owner.editor.xmlData[nodeId]) && this.documentHelper.owner.editor.xmlData[nodeId].pid == this.documentHelper.owner.editor.xmlData[i].id.toString()) {
                xPath = "\\" + this.documentHelper.owner.editor.xmlData[i].displayText + "[1]" + "\\" + xPath;
                nodeId = i;
            }
        }
        let nodeNumber = Number(selectedNode) - 1;
        if (this.documentHelper.owner.editor.xmlData[nodeNumber]) {
            xPath = xPath + this.documentHelper.owner.editor.xmlData[nodeNumber].displayText.toString() + "[1]";
            this.documentHelper.owner.xPathString = xPath;
        }
    }

    private closeDialogUtils(): void {
        this.alertDialog.close();
        this.alertDialog = undefined;
    }
    /**
    * To create Div Template.
    * @param {string} id.
    * @param {HTMLElement} parentDiv.
    * @param {string} style.
    * @returns {HTMLElement}
    */
    private createDivTemplate(id: string, parentDiv: HTMLElement, style?: string): HTMLElement {
        let divElement: HTMLElement;
        if (style) {
            divElement = createElement('div', { id: id, styles: style });
        } else {
            divElement = createElement('div', { id: id });
        }
        parentDiv.appendChild(divElement);
        return divElement;
    }
    /**
    * To handle File Selection.
    * @returns {void}
    */
    public handleFileSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const file = target.files[0];
                this.onFileSelect(file);
            }
        };
        input.click();
    }
    /**
    * To on File Selection.
    * @param {File} file.
    * @returns {void}
    */
    private onFileSelect(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            const xmlString = reader.result as string;
            this.addDataFromCustomXML(xmlString);
        };
        reader.readAsText(file);
    }
    /**
     * data from xml to the xml pane.
     *
     * @private
     * @param {string} xmlString - Specifies the custom xmlpart xml.
     * @returns {void}
     */
    public addDataFromCustomXML(xmlString: string): void {
        this.documentHelper.owner.editor.getPrefixMapping(xmlString);
        const parsedXml = this.documentHelper.owner.editor.parseXml(xmlString);
        const arr = this.documentHelper.owner.editor.objectToArray(parsedXml);
        this.documentHelper.owner.editor.setXmlData(parsedXml, arr);
        this.addingNewFileToDropDownList();
    }

    /**
    * To add New File To Drop Down List.
    * @param {File} file.
    * @private
    * @returns {void}
    */
    public addingNewFileToDropDownList() {
        if (this.documentHelper.owner.editor.XMLFilesNameSpaceCount == 1 && this.documentHelper.owner.prefixMappings == null) {
            this.DropDownListData.splice(this.DropDownListData.length - 1, 0, { ID: "(no namespace)_" + this.documentHelper.owner.editor.XMLFilesCount, Value: "(no namespace)" })
            this.documentHelper.owner.editor.XMLFilesNameSpaceCount++;
        }
        else if(this.documentHelper.owner.editor.XMLFilesNameSpaceCount > 1 && this.documentHelper.owner.prefixMappings == null) {
            this.DropDownListData.splice(this.DropDownListData.length - 1, 0, { ID: "(no namespace)_" + this.documentHelper.owner.editor.XMLFilesCount, Value: `(no namespace) (${this.documentHelper.owner.editor.XMLFilesNameSpaceCount})` });
            this.documentHelper.owner.editor.XMLFilesNameSpaceCount++;
        }
        else if(this.documentHelper.owner.prefixMappings) {
            this.DropDownListData.splice(this.DropDownListData.length - 1, 0, { ID: "(no namespace)_" + this.documentHelper.owner.editor.XMLFilesCount, Value: this.documentHelper.owner.prefixMappings  });
        }
        this.dropDownListObject.dataSource = this.DropDownListData;
        this.dropDownListObject.refresh();
        this.dropDownListObject.value = this.DropDownListData[0].ID as string;
        this.dropDownListObject.text = this.DropDownListData[0].Value as string;
        this.documentHelper.owner.editor.XMLFilesCount++;
    }
    /**
     * Close the xml pane.
     *
     * @private
     * @returns {void}
     */
    public onClose = (): void => {
        this.showXmlProperties(false);
        this.documentHelper.owner.selectionModule.closeXmlPane();
        this.documentHelper.owner.documentEditorSettings.showNavigationPane = false;
        this.documentHelper.updateFocus();
        this.destroyInternal();
    }
    /**
     * To show Xml Properties.
     *
     * @private
     * @param {boolean} show - Specifies showing or hiding the xml pane.
     * @returns {void}
     */
    public showXmlProperties(show: boolean): void {
        this.isXmlPaneShow = show;
        if (show) {
            this.localeValue = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
            this.localeValue.setLocale(this.documentHelper.owner.locale);
            if (!isNullOrUndefined(XmlPane)) {
                this.initializeXmlMapping();
                let isRtl: boolean = this.documentHelper.owner.enableRtl;
                let optionsPaneContainerStyle: string;
                if (isRtl) {
                    optionsPaneContainerStyle = 'display:inline-flex;direction:rtl;';
                } else {
                    optionsPaneContainerStyle = 'display:inline-flex;';
                }
                this.documentHelper.optionsPaneContainer.insertBefore(this.documentHelper.owner.xmlPaneModule.element, this.documentHelper.viewerContainer);
                this.documentHelper.owner.isXmlPaneTool = true;
            }
            this.documentHelper.owner.resize();
            if (show && !this.contextMenuInstance) {
                this.initializeContextMenu();
                this.intializeDropDownList();
                // To check whether the xml Mapping were newly added or the existing one for closing/opening xml pane.
                if (!this.isAddedDocumentXml) {
                    this.isAddedDocumentXml = true;
                    for (let i: number = 0; i < this.documentHelper.customXmlData.length; i++) {
                        const key: string = this.documentHelper.customXmlData.keys[i];
                        const xmlValue: string = this.documentHelper.customXmlData.get(key);
                        if (!isNullOrUndefined(xmlValue)) {
                            this.addDataFromCustomXML(xmlValue);
                        }
                    }
                }
            }
            this.documentHelper.updateViewerSize();
        } else {
            this.documentHelper.updateViewerSize();
            if (!isNullOrUndefined(this.element)) {
                if (this.element.style.display !== 'none') {
                    this.element.style.display = 'none';
                }
            }
            this.destroyInternal();
            this.documentHelper.owner.isXmlPaneTool = false;
            this.documentHelper.owner.triggerResize();
        }
    }
    /**
    * @private
    * @returns {void}
    */
    public clear(): void {
        if (this.DropDownListData.length > 2) {
            for (let i: number = 0; i < this.DropDownListData.length; i++) {
                const id: string = this.DropDownListData[i].ID as string;
                if (id !== "Choose" && id !== 'Add') {
                    this.DropDownListData.splice(i, 1);
                    i--;
                }
            }
        }
        this.isAddedDocumentXml = false;
    }
    /**
     * Dispose the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroyInternal(): void {
        if (this.treeviewObject) {
            this.treeviewObject.destroy();
            this.treeviewObject = undefined;
        }
        if (this.contextMenuInstance) {
            this.contextMenuInstance.destroy();
            this.contextMenuInstance = undefined;
        }
        if (this.positionLabelDiv) {
            this.positionLabelDiv.innerHTML = '';
            this.positionLabelDiv = undefined;
        }
        if (this.dropDownListObject) {
            this.dropDownListObject.destroy();
            this.dropDownListObject = undefined;
        }
        if (this.element) {
            this.element.innerHTML = '';
            if (this.element.parentElement) {
                this.element.parentElement.removeChild(this.element);
            }
        }
        this.element = undefined;
    }
    /**
     * Dispose the internal objects which are maintained.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.treeviewObject) {
            this.treeviewObject.destroy();
            this.treeviewObject = undefined;
        }
        if (this.contextMenuInstance) {
            this.contextMenuInstance.destroy();
            this.contextMenuInstance = undefined;
        }
        if (this.positionLabelDiv) {
            this.positionLabelDiv.innerHTML = '';
            this.positionLabelDiv = undefined;
        }
        if (this.dropDownListObject) {
            this.dropDownListObject.destroy();
            this.dropDownListObject = undefined;
        }
        if (this.element) {
            this.element.innerHTML = '';
            if (this.element.parentElement) {
                this.element.parentElement.removeChild(this.element);
            }
        }
        this.element = undefined;
        this.documentHelper = undefined;
    }
}
