/* eslint-disable */
import { createElement, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-buttons';
import { MenuEventArgs, Toolbar as Tool } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase, Toolbar } from '../index';
import { DropDownButton, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, ItemModel, DropDownButtonModel } from '@syncfusion/ej2-splitbuttons';

/* eslint-disable */
/**
 * @hidden
 */
export class FormDesignerToolbar {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    /**
     * @private
    */
    public primaryToolbar: Toolbar;
    public toolbarElement: HTMLElement;
    private textboxItem: HTMLElement;
    private passwordItem: HTMLElement;
    private checkboxItem: HTMLElement;
    private radioButtonItem: HTMLElement;
    private dropdownItem: HTMLElement;
    private listboxItem: HTMLElement;
    private signatureItem: HTMLElement;
    private deleteItem: HTMLElement;
    private closeItem: HTMLElement;
    /**
     * @private
     */
    public toolbar: Tool;

    /**
     * @private
    */
    public isToolbarHidden: boolean = false;

    private isTextboxBtnVisible: boolean = true;
    private isPasswordBtnVisible: boolean = true;
    private isCheckboxBtnVisible: boolean = true;
    private isRadiobuttonBtnVisible: boolean = true;
    private isDropdownBtnVisible: boolean = true;
    private isListboxBtnVisible: boolean = true;
    private isSignatureBtnVisible: boolean = true;
    private isDeleteBtnVisible: boolean = true;
    private toolbarBorderHeight: number = 1;
    /**
     * @private
    */
    public handWrittenSignatureItem: HTMLElement;


    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase, toolbar: Toolbar) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.primaryToolbar = toolbar;
    }

    public initializeFormDesignerToolbar(): void {
         // eslint-disable-next-line max-len
         this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_formdesigner_toolbar', className: 'e-pv-formdesigner-toolbar' });
         this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
         this.toolbar = new Tool({
             width: '', height: '', overflowMode: 'Popup',
             items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this),
             created: () => {
                 this.createDropDowns();
             }
         });
         //this.toolbar.isStringTemplate = true;
         if (this.pdfViewer.enableRtl) {
             this.toolbar.enableRtl = true;
         }
         this.toolbar.appendTo(this.toolbarElement);
         this.afterToolbarCreation(); 
         this.createSignContainer();
         this.applyFormDesignerToolbarSettings();
         //this.updateToolbarItems();
         this.showFormDesignerToolbar(null, true);
    }

    /**
     * @param element
     * @param isInitialLoading
     * @param element
     * @param isInitialLoading
     * @private
     */
    public showFormDesignerToolbar(element?: HTMLElement, isInitialLoading?: boolean): void {
        if (!this.isToolbarHidden) {
                // eslint-disable-next-line
                let formDesignerModule: any = this.pdfViewer.formDesignerModule;
                if (element) {
                    this.primaryToolbar.deSelectItem(element);
                } else {
                    if (this.pdfViewer.enableToolbar) {
                        this.primaryToolbar.deSelectItem(this.primaryToolbar.formDesignerItem);
                    }
                }
                this.adjustViewer(false);
                // eslint-disable-next-line max-len
                
                    //this.deselectAllItems();
                
                this.toolbarElement.style.display = 'none';
                this.pdfViewer.formDesignerModule.setMode("edit");
                this.pdfViewer.designerMode = false;
                if (!isInitialLoading) {
                    this.pdfViewer.isFormDesignerToolbarVisible = false;
                }
            } else {
                const toolBarInitialStatus: string = this.toolbarElement.style.display;
                this.toolbarElement.style.display = 'block';
                this.pdfViewer.designerMode =true;
                this.pdfViewer.formDesignerModule.setMode("designer");
                if (!isInitialLoading) {
                    this.pdfViewer.isFormDesignerToolbarVisible = true;
                }
                if (element) {
                    this.primaryToolbar.selectItem(element);
                } else {
                    if (this.pdfViewer.enableToolbar) {
                        this.primaryToolbar.selectItem(this.primaryToolbar.formDesignerItem);
                    }
                }
                if (toolBarInitialStatus === 'none') {
                    this.adjustViewer(true);
                }
            }
            // eslint-disable-next-line max-len
            if (this.pdfViewer.magnification && this.pdfViewer.magnification.fitType === 'fitToPage') {
                this.pdfViewer.magnification.fitToPage();
            }
            //this.enableAnnotationAddTools(true);
            this.isToolbarHidden = !this.isToolbarHidden;
    }

    /**
     * @param isAdjust
     * @private
    */
    public adjustViewer(isAdjust: boolean): void {
            let splitterElement: HTMLElement;
            let toolbarContainer: HTMLElement;
            let formDesignerToolbarHeight: number;
            if (isBlazor()) {
                splitterElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
                toolbarContainer = this.pdfViewer.element.querySelector('.e-pv-toolbar');
                const formDesignerToolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-formDesigner-toolbar');
                formDesignerToolbarHeight = this.getToolbarHeight(formDesignerToolbarContainer);
            } else {
                splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
                toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
                formDesignerToolbarHeight = this.getToolbarHeight(this.toolbarElement);
            }
            let toolbarHeight: number = this.getToolbarHeight(toolbarContainer);
            const sideBarToolbar: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
            const sideBarContentContainer: HTMLElement = this.pdfViewerBase.navigationPane.sideBarContentContainer;
            const commentsContainer: HTMLElement = this.pdfViewerBase.navigationPane.commentPanelContainer;
            const commentPanelResizer: HTMLElement = this.pdfViewerBase.navigationPane.commentPanelResizer;
            if (isAdjust) {
                if (this.pdfViewer.enableToolbar) {
                    sideBarToolbar.style.top = (toolbarHeight + formDesignerToolbarHeight) + 'px';
                    sideBarContentContainer.style.top = (toolbarHeight + formDesignerToolbarHeight) + 'px';
                    splitterElement.style.top = (toolbarHeight + formDesignerToolbarHeight) + 'px';
                    commentsContainer.style.top = (toolbarHeight + formDesignerToolbarHeight) + 'px';
                    commentPanelResizer.style.top = (toolbarHeight + formDesignerToolbarHeight) + 'px';
                } else {
                    sideBarToolbar.style.top = (formDesignerToolbarHeight) + 'px';
                    sideBarContentContainer.style.top = (formDesignerToolbarHeight) + 'px';
                    splitterElement.style.top = (formDesignerToolbarHeight) + 'px';
                    commentsContainer.style.top = (formDesignerToolbarHeight) + 'px';
                    commentPanelResizer.style.top = (toolbarHeight + formDesignerToolbarHeight) + 'px';
                }
                if (!this.pdfViewer.enableToolbar) {
                    toolbarHeight = 0;
                }
                // eslint-disable-next-line max-len
                this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (formDesignerToolbarHeight + toolbarHeight)) + 'px';
                sideBarToolbar.style.height = this.getNavigationToolbarHeight(formDesignerToolbarHeight + toolbarHeight) + 'px';
                splitterElement.style.height = this.getNavigationToolbarHeight(formDesignerToolbarHeight + toolbarHeight) + 'px';
            } else {
                if (this.pdfViewer.enableToolbar) {
                    // eslint-disable-next-line max-len
                    sideBarToolbar.style.top = toolbarHeight + 'px';
                    sideBarContentContainer.style.top = toolbarHeight + 'px';
                    splitterElement.style.top = toolbarHeight + 'px';
                    commentsContainer.style.top = toolbarHeight + 'px';
                    commentPanelResizer.style.top = toolbarHeight + 'px';
                } else {
                    sideBarToolbar.style.top = 1 + 'px';
                    sideBarToolbar.style.height = '100%';
                    sideBarContentContainer.style.top = 1 + 'px';
                    sideBarContentContainer.style.height = '100%';
                    splitterElement.style.top = 1 + 'px';
                    splitterElement.style.height = '100%';
                    commentsContainer.style.top = 1 + 'px';
                    commentsContainer.style.height = '100%';
                    commentPanelResizer.style.top = 1 + 'px';
                    commentPanelResizer.style.height = '100%';
                }
                if (!this.pdfViewer.enableToolbar) {
                    toolbarHeight = 0;
                }
                // eslint-disable-next-line max-len
                this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), formDesignerToolbarHeight) + 'px';
                sideBarToolbar.style.height = this.getNavigationToolbarHeight(toolbarHeight);
                splitterElement.style.height = this.getNavigationToolbarHeight(toolbarHeight);
                if (this.pdfViewerBase.viewerContainer.style.height === '0px') {
                    // eslint-disable-next-line
                    this.pdfViewerBase.viewerContainer.style.height = (parseInt(this.pdfViewer.element.style.height) - parseInt(sideBarToolbar.style.top)) + 'px';
                }
            }
            if (isBlazor()) {
                this.updateContentContainerHeight(isAdjust, true);
            } else {
                this.updateContentContainerHeight(isAdjust);
            }
    }

    private getElementHeight(element: HTMLElement): number {
        try {
            return element.getBoundingClientRect().height;
        } catch (error) {
            return 0;
        }
    }

    private updateViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return this.getElementHeight(this.pdfViewer.element) - toolbarHeight;
    }

    private resetViewerHeight(viewerHeight: number, toolbarHeight: number): number {
        return viewerHeight + toolbarHeight;
    }

    private getNavigationToolbarHeight(toolbarHeight: number): string {
        const height: number = this.pdfViewer.element.getBoundingClientRect().height;
        return (height !== 0) ? height - toolbarHeight + 'px' : '';
    }

    private updateContentContainerHeight(isAdjust: boolean, isBlazor?: boolean): void {
        let formDesignerToolbarHeight: number;
        if (isBlazor) {
            const formDesignerToolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-formDesigner-toolbar');
            formDesignerToolbarHeight = this.getToolbarHeight(formDesignerToolbarContainer);
        } else {
            formDesignerToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        }
        const sideBarClientRect: ClientRect = this.pdfViewerBase.navigationPane.sideBarContentContainer.getBoundingClientRect();
        if (sideBarClientRect.height !== 0) {
            if (isAdjust) {
                // eslint-disable-next-line max-len
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height - formDesignerToolbarHeight + 'px';
            } else {
                // eslint-disable-next-line max-len
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height + formDesignerToolbarHeight + 'px';
            }
        }
    }

    private getToolbarHeight(element: HTMLElement): number {
        let toolbarHeight: number = element.getBoundingClientRect().height;
        if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
            // getComputedStyle gets the value from style and toolbar border height is added to it.
            // eslint-disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(element)['height']) + this.toolbarBorderHeight;
        }
        return toolbarHeight;
    }

    // eslint-disable-next-line
    private createToolbarItems(): any[] {
        const signTemplate: string = this.getTemplate('span', '_formfield_signature', 'e-pv-annotation-handwritten-container');
        // eslint-disable-next-line
        let items: any[] = [];
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-textbox-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_formdesigner_textbox', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-password-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_formdesigner_passwordfield', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-checkbox-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_formdesigner_checkbox', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-radiobutton-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_formdesigner_radiobutton', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-dropdown-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_formdesigner_dropdown', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-listbox-icon e-pv-icon', className: 'e-pv-annotation-shapes-container', id: this.pdfViewer.element.id + '_formdesigner_listbox', align: 'Left' });
        items.push({ template: signTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_formdesigner_delete', align: 'Left' });
     
        items.push({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_formdesigner_close', align: 'Right' });
        return items;
    }

    private createSignContainer(): void {
        this.handWrittenSignatureItem = this.pdfViewerBase.getElement('_formfield_signature');
        // eslint-disable-next-line max-len
        this.primaryToolbar.createTooltip(this.pdfViewerBase.getElement('_formfield_signature'), this.pdfViewer.localeObj.getConstant('HandwrittenSignatureDialogHeaderText'));
        // eslint-disable-next-line
        let proxy: any = this;
        let items: ItemModel[] =[]; 
        items=[
            {
                text: 'ADD SIGNATURE'
            },
            {
                separator: true
            },
            {
                text: 'ADD INITIAL'
            }];  
        
        const saveOptions: DropDownButtonModel = {
            items: items,
            iconCss: 'e-pv-handwritten-icon e-pv-icon',
            cssClass: 'e-pv-handwritten-popup',
            beforeItemRender: (args: MenuEventArgs): void => {
                this.pdfViewer.clearSelection(this.pdfViewerBase.currentPageNumber - 1);
                if(args.element && args.element.className.indexOf("e-separator")!==-1) {
                    args.element.style.margin = "8px 0";
                }
                if (args.item.text === 'ADD SIGNATURE') {
                    args.element.innerHTML = '';
                    let addInitialSpan: HTMLElement = createElement('button');
                    addInitialSpan.classList.add("e-control", "e-btn", "e-lib", "e-outline", "e-primary");
                    addInitialSpan.textContent = this.pdfViewer.localeObj.getConstant('SignatureFieldDialogHeaderText');
                    this.pdfViewer.locale === 'en-US' ? addInitialSpan.style.width = "130px" : addInitialSpan.style.width = "auto";
                    addInitialSpan.style.height = "36px";
                    addInitialSpan.addEventListener('click', this.clickSignature.bind(this));
                    args.element.appendChild(addInitialSpan);
                    args.element.addEventListener('mouseover', this.hoverInitialBtn.bind(this));
                    args.element.style.width = '206px';
                    args.element.style.display = 'flex';
                    args.element.style.flexDirection = 'column';
                    args.element.style.height = 'auto';
                    args.element.style.alignItems = 'center';
                }

                if (args.item.text === 'ADD INITIAL') { 
                    args.element.innerHTML = ''; 
                    let addInitialSpan: HTMLElement = createElement('button');
                    addInitialSpan.classList.add("e-control", "e-btn", "e-lib", "e-outline", "e-primary");
                    addInitialSpan.textContent = this.pdfViewer.localeObj.getConstant('InitialFieldDialogHeaderText');
                    this.pdfViewer.locale === 'en-US' ? addInitialSpan.style.width = "130px" : addInitialSpan.style.width = "auto";
                    addInitialSpan.style.height = "36px";
                    addInitialSpan.addEventListener('click', this.clickInitial.bind(this));
                    args.element.appendChild(addInitialSpan);
                    args.element.addEventListener('mouseover', this.hoverInitialBtn.bind(this));
                    args.element.style.width = '206px';
                    args.element.style.display = 'flex';
                    args.element.style.flexDirection = 'column';
                    args.element.style.height = 'auto';
                    args.element.style.alignItems = 'center';
                }
            },
        };
        const drpDownBtn: DropDownButton = new DropDownButton(saveOptions); 
        if (this.pdfViewer.enableRtl) {
            drpDownBtn.enableRtl = this.pdfViewer.enableRtl;
        }
        drpDownBtn.appendTo(this.handWrittenSignatureItem); 
    }

    private hoverInitialBtn(event:any): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        let currentFieldID: string = isNullOrUndefined(event.path) ? event.composedPath()[0].id : event.path[0].id;
        if(currentFieldID!=='sign_'+currentFieldID.split("_")[1] && currentFieldID!=='delete_'+currentFieldID.split("_")[1]){
        let liElement: HTMLElement = document.getElementById(eventTarget.id);
        if (isNullOrUndefined(liElement)) {
            liElement = document.getElementById(eventTarget.parentElement.id);
        }
        if ((liElement as HTMLLIElement) != null && (eventTarget.id !== 'sign_' + eventTarget.id.split('_')[1] || eventTarget.id !== 'sign_border_' + eventTarget.id.split('_')[2])) {
            liElement.style.background = 'transparent';
            liElement.style.cursor = 'default';
        } else if ((liElement.parentElement as HTMLLIElement) != null && (eventTarget.id !== 'sign_' + eventTarget.id.split('_')[1] || eventTarget.id !== 'sign_border_' + eventTarget.id.split('_')[2])) {
            liElement.parentElement.style.background = 'transparent';
            liElement.parentElement.style.cursor='default';
        }
    }
    }
    private getTemplate(elementName: string, id: string, className: string): string {
        const element: HTMLElement = createElement(elementName, { id: this.pdfViewer.element.id + id });
        if (className) {
            element.className = className;
        }
        return element.outerHTML;
    }

    private onToolbarClicked(args: ClickEventArgs): void {
         // eslint-disable-next-line
         if(args && (args as IToolbarClick).item) {
              if((args as IToolbarClick).item.id.indexOf("textbox")!==-1) {
                  this.pdfViewer.formDesignerModule.setFormFieldMode('Textbox');
              } else if((args as IToolbarClick).item.id.indexOf("passwordfield")!==-1) {
                  this.pdfViewer.formDesignerModule.setFormFieldMode('Password');
              } else if((args as IToolbarClick).item.id.indexOf("checkbox")!==-1) {
                this.pdfViewer.formDesignerModule.setFormFieldMode('CheckBox');
              } else if((args as IToolbarClick).item.id.indexOf("radiobutton")!==-1) {
                this.pdfViewer.formDesignerModule.setFormFieldMode('RadioButton');
              } else if((args as IToolbarClick).item.id.indexOf("dropdown")!==-1) {
                this.pdfViewer.formDesignerModule.setFormFieldMode('DropDown');
              } else if((args as IToolbarClick).item.id.indexOf("listbox")!==-1) {
                this.pdfViewer.formDesignerModule.setFormFieldMode('ListBox');
              } else if((args as IToolbarClick).item.id.indexOf("signature")!==-1) {
                this.pdfViewer.formDesignerModule.setFormFieldMode('SignatureField');
            } else if((args as IToolbarClick).item.id.indexOf("close")!==-1) {
                this.pdfViewer.toolbarModule.formDesignerToolbarModule.showFormDesignerToolbar(this.pdfViewer.toolbarModule.formDesignerItem);
            } else if((args as IToolbarClick).item.id.indexOf("delete")!==-1) {
                this.pdfViewer.formDesignerModule.deleteFormField(this.pdfViewer.selectedItems.formFields[0]);
                this.showHideDeleteIcon(false);
            }
            if (this.pdfViewer.selectedItems.formFields.length > 0) {
                this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.formFields[0].pageIndex);
            }
         }
    }

    private clickSignature(args: any): void {
        this.pdfViewer.formDesignerModule.setFormFieldMode('SignatureField');
    }

    private clickInitial(args: any): void {
        this.pdfViewer.isInitialFieldToolbarSelection = true;
        this.pdfViewer.formDesignerModule.setFormFieldMode('InitialField');
        this.pdfViewer.isInitialFieldToolbarSelection = false;
    }

    private afterToolbarCreation(): void {
        // eslint-disable-next-line max-len
        this.textboxItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_textbox', 'e-pv-formdesigner-textbox', this.pdfViewer.localeObj.getConstant('Textbox'));
        this.passwordItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_passwordfield', 'e-pv-formdesigner-passwordfield', this.pdfViewer.localeObj.getConstant('Password'));
        this.checkboxItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_checkbox', 'e-pv-formdesigner-checkbox', this.pdfViewer.localeObj.getConstant('Check Box'));
        this.radioButtonItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_radiobutton', 'e-pv-formdesigner-radiobutton', this.pdfViewer.localeObj.getConstant('Radio Button'));
        this.dropdownItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_dropdown', 'e-pv-formdesigner-dropdown', this.pdfViewer.localeObj.getConstant('Dropdown'));
        this.listboxItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_listbox', 'e-pv-formdesigner-listbox', this.pdfViewer.localeObj.getConstant('List Box'));
        //this.signatureItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_signature', 'e-pv-formdesigner-signature', this.pdfViewer.localeObj.getConstant('Signature'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_delete', 'e-pv-formdesigner-delete', this.pdfViewer.localeObj.getConstant('Delete FormField'));
        
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_formdesigner_close', 'e-pv-annotation-tools-close', null);
        this.showHideDeleteIcon(false);
        //this.enableTextMarkupAnnotationPropertiesTools(false); 
    }

    public showHideDeleteIcon(isEnable: boolean): void {
        if (this.toolbar)
            this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
    }

    private applyFormDesignerToolbarSettings(): void {
        if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems) {
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('TextboxTool') !== -1) {
                this.showTextboxTool(true);
            } else {
                this.showTextboxTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('PasswordTool') !== -1) {
                this.showPasswordTool(true);
            } else {
                this.showPasswordTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('CheckBoxTool') !== -1) {
                this.showCheckboxTool(true);
            } else {
                this.showCheckboxTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('RadioButtonTool') !== -1) {
                this.showRadioButtonTool(true);
            } else {
                this.showRadioButtonTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('DropdownTool') !== -1) {
                this.showDropdownTool(true);
            } else {
                this.showDropdownTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('ListboxTool') !== -1) {
                this.showListboxTool(true);
            } else {
                this.showListboxTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('DrawSignatureTool') !== -1) {
                this.showDrawSignatureTool(true);
            } else {
                this.showDrawSignatureTool(false);
            }
            if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.indexOf('DeleteTool') !== -1) {
                this.showDeleteTool(true);
            } else {
                this.showDeleteTool(false);
            }
            this.showSeparator();
        }
    }

    private showTextboxTool(isShow: boolean): void {
        this.isTextboxBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 0, 0);
    }

    private showPasswordTool(isShow: boolean): void {
        this.isPasswordBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 1, 1);
    }

    private showCheckboxTool(isShow: boolean): void {
        this.isCheckboxBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 2, 2);
    }

    private showRadioButtonTool(isShow: boolean): void {
        this.isRadiobuttonBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 3, 3);
    }

    private showDropdownTool(isShow: boolean): void {
        this.isDropdownBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 4, 4);
    }

    private showListboxTool(isShow: boolean): void {
        this.isListboxBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 5, 5);
    }

    private showDrawSignatureTool(isShow: boolean): void {
        this.isSignatureBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 6, 6);
    }

    private showDeleteTool(isShow: boolean): void {
        this.isDeleteBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 8, 8);
    }

    private showSeparator(): void {
        if(!this.isSignatureBtnVisible && !this.isDeleteBtnVisible)
          this.applyHideToToolbar(false, 7, 7);
    }
    
    private applyHideToToolbar(show: boolean, startIndex: number, endIndex: number): void {
        const isHide: boolean = !show;
        for (let index: number = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    }

    private createDropDowns(): void {

    }

    /**
     * @private
     */
    public destroy(): void { 
        let componentElement: any = [this.textboxItem, this.passwordItem, this.checkboxItem, this.radioButtonItem,
        this.listboxItem, this.dropdownItem, this.handWrittenSignatureItem, this.deleteItem]; 
        for (let i: number = 0; i < componentElement.length; i++) {
            if (componentElement[i]) {
                this.destroyDependentComponent(componentElement[i]);
            }
        } 
    }

    private destroyDependentComponent(component: any): void {
        if (component.ej2_instances) {
           for (let i: number = component.ej2_instances.length - 1; i >=0; i--) {
                 component.ej2_instances[i].destroy();
            }
        }
    }
}

interface IToolbarClick extends ClickEventArgs {
    item: any
}