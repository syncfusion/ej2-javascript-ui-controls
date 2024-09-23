import { ListView, SelectEventArgs } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
import { StyleType } from '../../base';

/**
 * The Styles dialog is used to create or modify styles.
 */
export class StylesDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private target: HTMLElement;
    private listviewInstance: ListView;
    private styleName: string;
    private localValue: L10n;

    private dlgFields: HTMLElement;
    private commonDiv: HTMLElement;
    private searchDiv: HTMLElement;
    private listviewDiv: HTMLElement;
    private buttonDiv: HTMLElement;
    private newButtonDiv: HTMLElement;
    private newButtonElement: HTMLElement;
    private newbutton: Button;
    private modifybuttonDiv: HTMLElement;
    private modifyButtonElement: HTMLElement;
    private addbutton: Button;

    private selecHandlerClickHandler: EventListener = this.onSelecHandlerClick.bind(this);
    private addNewStyleClickHandler: EventListenerOrEventListenerObject = this.onAddNewStyleClick.bind(this);
    private modifyStyleClickHandler: EventListenerOrEventListenerObject = this.onModifyStyleClick.bind(this);
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'StylesDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value.
     * @param {string[]} styles - Specifies the styles.
     * @param {boolean} isRtl - Specifies the is rtl.
     * @returns {void}
     */
    public initStylesDialog(localValue: L10n, styles: {[key: string]: string}[], isRtl?: boolean): void {
        const id: string = this.documentHelper.owner.containerId + '_insert_styles';
        this.target = createElement('div', { id: id, className: 'e-de-styles' });
        const headerValue: string = localValue.getConstant('Styles');
        this.dlgFields = createElement('div', { innerHTML: headerValue, className: 'e-de-para-dlg-heading' });
        this.target.appendChild(this.dlgFields);

        this.commonDiv = createElement('div', { className: 'e-styles-common' });
        this.target.appendChild(this.commonDiv);

        this.searchDiv = createElement('div', { className: 'e-styles-list' });
        this.commonDiv.appendChild(this.searchDiv);
        if (isRtl) {
            this.searchDiv.classList.add('e-de-rtl');
        }

        this.listviewDiv = createElement('div', { className: 'e-styles-listViewDiv', id: 'styles_listview' });
        this.searchDiv.appendChild(this.listviewDiv);

        this.listviewInstance = new ListView({
            dataSource: styles,
            cssClass: 'e-styles-listview',
            fields: { text: 'StyleName', iconCss: 'IconClass' },
            showIcon: true
        });

        this.listviewInstance.appendTo(this.listviewDiv);
        this.listviewInstance.addEventListener('select', this.selecHandlerClickHandler);

        this.buttonDiv = createElement('div', { className: 'e-styles-button' });
        this.commonDiv.appendChild(this.buttonDiv);

        this.newButtonDiv = createElement('div', { className: 'e-styles-addbutton' });
        this.buttonDiv.appendChild(this.newButtonDiv);
        this.newButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('New') + '...', id: 'new',
            attrs: { type: 'button' }
        });
        this.newButtonDiv.appendChild(this.newButtonElement);
        this.newbutton = new Button({ cssClass: 'e-button-custom' });
        this.newbutton.appendTo(this.newButtonElement);
        this.newButtonElement.addEventListener('click', this.addNewStyleClickHandler);

        this.modifybuttonDiv = createElement('div', { className: 'e-styles-addbutton' });
        this.buttonDiv.appendChild(this.modifybuttonDiv);
        this.modifyButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('Modify') + '...', id: 'modify',
            attrs: { type: 'button' }
        });
        this.modifybuttonDiv.appendChild(this.modifyButtonElement);
        this.addbutton = new Button({ cssClass: 'e-button-custom' });
        this.addbutton.appendTo(this.modifyButtonElement);
        this.modifyButtonElement.addEventListener('click', this.modifyStyleClickHandler);
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        const paraStyles: {[key: string]: string}[] = this.updateStyleNames('Paragraph').filter((obj: any) => (obj as any).Type === 'Paragraph');
        const linkedStyles: {[key: string]: string}[] = this.updateStyleNames('Paragraph').filter((obj: any) => (obj as any).Type === 'Linked');
        const charStyles: {[key: string]: string}[] = this.updateStyleNames('Character').filter((obj: any) => (obj as any).Type === 'Character');
        for (const linkedStyle of linkedStyles) {
            for (const charStyle of charStyles) {
                if (linkedStyle['StyleName'] + ' Char' === charStyle['StyleName']) {
                    charStyles.splice(charStyles.indexOf(charStyle), 1);
                    break;
                }
            }
        }
        const styles: {[key: string]: string}[] = paraStyles.concat(linkedStyles, charStyles);
        this.localValue = localValue;
        this.initStylesDialog(localValue, styles, this.documentHelper.owner.enableRtl);
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.header = localValue.getConstant('Styles');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.buttons = [{
            click: this.hideObjects.bind(this),
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }
    private updateStyleNames(type: StyleType): {[key: string]: string}[] {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        const collection: object[] = this.documentHelper.owner.documentHelper.styles.getStyles(type);
        const paraIcon: string = 'e-de-listview-icon e-de-e-paragraph-style-mark e-icons';
        const charIcon: string = 'e-de-listview-icon e-de-e-character-style-mark e-icons';
        const linkedIcon: string = 'e-de-listview-icon e-de-e-linked-style-mark e-icons';
        const finalList: {[key: string]: string}[] = [];
        for (let i: number = 0; i < collection.length; i++) {
            let styleName : string = localValue.getConstant((collection[parseInt(i.toString(), 10)] as any).name);
            if (styleName === '') {
                styleName = (collection[parseInt(i.toString(), 10)] as any).name;
            }
            if ((collection[parseInt(i.toString(), 10)] as any).type === 'Paragraph') {
                finalList.push({ StyleName: styleName, IconClass: paraIcon, Type: (collection[parseInt(i.toString(), 10)] as any).type });
            } else if ((collection[parseInt(i.toString(), 10)] as any).type === 'Character'){
                finalList.push({ StyleName: styleName, IconClass: charIcon, Type: (collection[parseInt(i.toString(), 10)] as any).type });
            } else {
                finalList.push({ StyleName: styleName, IconClass: linkedIcon, Type: (collection[parseInt(i.toString(), 10)] as any).type });
            }
        }
        return finalList;
    }
    private defaultStyleName(styleNames: string[]): string[] {
        const styleName: string[] = [];
        for (let index: number = 0; index < styleNames.length; index++) {
            styleName.push(styleNames[parseInt(index.toString(), 10)]);
        }
        return styleName;
    }
    private onModifyStyleClick(): void {
        this.modifyStyles();
    }
    /**
     * @private
     * @returns {void}
     */
    private modifyStyles = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.owner.styleDialogModule.show(this.styleName, this.localValue.getConstant('Modify Style'));
    };
    private onSelecHandlerClick(args: SelectEventArgs): void {
        this.selectHandler(args);
    }
    /**
     * @param {SelectEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private selectHandler = (args: SelectEventArgs): void => {
        this.styleName = this.getStyleName(args.text);
    };
    /**
     * @param {string} styleName - Specifies the style name.
     * @private
     * @returns {string} - Returns the style name.
     */
    public getStyleName(styleName: string): string {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (localValue.getConstant('Heading 1') === styleName) {
            styleName = 'Heading 1';
        } else if (localValue.getConstant('Heading 2') === styleName) {
            styleName = 'Heading 2';
        } else if (localValue.getConstant('Heading 3') === styleName) {
            styleName = 'Heading 3';
        } else if (localValue.getConstant('Heading 4') === styleName) {
            styleName = 'Heading 4';
        } else if (localValue.getConstant('Heading 5') === styleName) {
            styleName = 'Heading 5';
        } else if (localValue.getConstant('Heading 6') === styleName) {
            styleName = 'Heading 6';
        } else if (localValue.getConstant('Normal') === styleName) {
            styleName = 'Normal';
        } else if (localValue.getConstant('Header') === styleName) {
            styleName = 'Header';
        } else if (localValue.getConstant('Footer') === styleName) {
            styleName = 'Footer';
        }
        return styleName;
    }
    /**
     * @private
     * @returns {void}
     */
    private hideObjects(): void {
        this.documentHelper.dialog.hide();
        this.documentHelper.updateFocus();
    }
    private onAddNewStyleClick(): void {
        this.addNewStyles();
    }
    /**
     * @private
     * @returns {void}
     */
    public addNewStyles = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.owner.styleDialogModule.show();
    };

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
        this.removeEvents();
        this.removeElements();
        this.documentHelper = undefined;
        this.styleName = undefined;
        this.localValue = undefined;
        this.target = undefined;
    }
    private removeEvents(): void {
        if (this.newButtonElement) {
            this.newButtonElement.removeEventListener('click', this.addNewStyleClickHandler);
        }
        if (this.modifyButtonElement) {
            this.modifyButtonElement.removeEventListener('click', this.modifyStyleClickHandler);
        }
        if (this.listviewInstance) {
            this.listviewInstance.removeEventListener('select', this.selecHandlerClickHandler);
        }
    }
    private removeElements(): void {
        if (this.dlgFields) {
            this.dlgFields.remove();
            this.dlgFields = undefined;
        }
        if (this.commonDiv) {
            this.commonDiv.remove();
            this.commonDiv = undefined;
        }
        if (this.searchDiv) {
            this.searchDiv.remove();
            this.searchDiv = undefined;
        }
        if (this.listviewDiv) {
            this.listviewDiv.remove();
            this.listviewDiv = undefined;
        }
        if (this.buttonDiv) {
            this.buttonDiv.remove();
            this.buttonDiv = undefined;
        }
        if (this.newButtonDiv) {
            this.newButtonDiv.remove();
            this.newButtonDiv = undefined;
        }
        if (this.newButtonElement) {
            this.newButtonElement.remove();
            this.newButtonElement = undefined;
        }
        if (this.newbutton) {
            this.newbutton.destroy();
            this.newbutton = undefined;
        }
        if (this.modifybuttonDiv) {
            this.modifybuttonDiv.remove();
            this.modifybuttonDiv = undefined;
        }
        if (this.modifyButtonElement) {
            this.modifyButtonElement.remove();
            this.modifyButtonElement = undefined;
        }
        if (this.addbutton) {
            this.addbutton.destroy();
            this.addbutton = undefined;
        }
    }
}

