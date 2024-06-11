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
        const dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-de-para-dlg-heading' });
        this.target.appendChild(dlgFields);

        const commonDiv: HTMLElement = createElement('div', { className: 'e-styles-common' });
        this.target.appendChild(commonDiv);

        const searchDiv: HTMLElement = createElement('div', { className: 'e-styles-list' });
        commonDiv.appendChild(searchDiv);
        if (isRtl) {
            searchDiv.classList.add('e-de-rtl');
        }

        const listviewDiv: HTMLElement = createElement('div', { className: 'e-styles-listViewDiv', id: 'styles_listview' });
        searchDiv.appendChild(listviewDiv);

        this.listviewInstance = new ListView({
            dataSource: styles,
            cssClass: 'e-styles-listview',
            fields: { text: 'StyleName', iconCss: 'IconClass' },
            showIcon: true
        });

        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);

        const buttonDiv: HTMLElement = createElement('div', { className: 'e-styles-button' });
        commonDiv.appendChild(buttonDiv);

        const newButtonDiv: HTMLElement = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(newButtonDiv);
        const newButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('New') + '...', id: 'new',
            attrs: { type: 'button' }
        });
        newButtonDiv.appendChild(newButtonElement);
        const newbutton: Button = new Button({ cssClass: 'e-button-custom' });
        newbutton.appendTo(newButtonElement);
        newButtonElement.addEventListener('click', this.addNewStyles);

        const modifybuttonDiv: HTMLElement = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(modifybuttonDiv);
        const modifyButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('Modify') + '...', id: 'modify',
            attrs: { type: 'button' }
        });
        modifybuttonDiv.appendChild(modifyButtonElement);
        const addbutton: Button = new Button({ cssClass: 'e-button-custom' });
        addbutton.appendTo(modifyButtonElement);
        modifyButtonElement.addEventListener('click', this.modifyStyles);
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
    /**
     * @private
     * @returns {void}
     */
    private modifyStyles = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.owner.styleDialogModule.show(this.styleName, this.localValue.getConstant('Modify Style'));
    };
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
        this.documentHelper = undefined;
        this.styleName = undefined;
        this.localValue = undefined;
        this.target = undefined;
    }
}

