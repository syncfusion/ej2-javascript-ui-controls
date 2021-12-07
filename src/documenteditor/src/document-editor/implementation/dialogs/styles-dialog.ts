import { ListView, SelectEventArgs } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';

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
    public initStylesDialog(localValue: L10n, styles: string[], isRtl?: boolean): void {
        const id: string = this.documentHelper.owner.containerId + '_insert_styles';
        this.target = createElement('div', { id: id, className: 'e-de-styles' });
        const headerValue: string = localValue.getConstant('Styles');
        const dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-styles-dlgfields' });
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
            cssClass: 'e-styles-listview'
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
        const styles: string[] = this.updateStyleNames();
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
    private updateStyleNames(): string[] {
        const collection: string[] = this.documentHelper.owner.documentHelper.styles.getStyleNames('Paragraph');
        const styleNames: string[] = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
        const defaultStyleNames: string[] = this.defaultStyleName(styleNames);
        const finalList: string[] = collection.concat(defaultStyleNames).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
        return finalList;
    }
    private defaultStyleName(styleNames: string[]): string[] {
        const styleName: string[] = [];
        for (let index: number = 0; index < styleNames.length; index++) {
            styleName.push(styleNames[index]);
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
        this.styleName = args.text;
    };
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
    private addNewStyles = (): void => {
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
    }
}

