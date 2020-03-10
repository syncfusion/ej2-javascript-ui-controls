import { ListView } from '@syncfusion/ej2-lists';
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
     * @private
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'StylesDialog';
    }
    /**
     * @private
     */
    public initStylesDialog(localValue: L10n, styles: string[], isRtl?: boolean): void {
        let instance: StylesDialog = this;
        let id: string = this.documentHelper.owner.containerId + '_insert_styles';
        this.target = createElement('div', { id: id, className: 'e-de-styles' });
        let headerValue: string = localValue.getConstant('Styles');
        let dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-styles-dlgfields' });
        this.target.appendChild(dlgFields);

        let commonDiv: HTMLElement = createElement('div', { className: 'e-styles-common' });
        this.target.appendChild(commonDiv);

        let searchDiv: HTMLElement = createElement('div', { className: 'e-styles-list' });
        commonDiv.appendChild(searchDiv);
        if (isRtl) {
            searchDiv.classList.add('e-de-rtl');
        }

        let listviewDiv: HTMLElement = createElement('div', { className: 'e-styles-listViewDiv', id: 'styles_listview' });
        searchDiv.appendChild(listviewDiv);

        this.listviewInstance = new ListView({
            dataSource: styles,
            cssClass: 'e-styles-listview',
        });

        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);

        let buttonDiv: HTMLElement = createElement('div', { className: 'e-styles-button' });
        commonDiv.appendChild(buttonDiv);

        let newButtonDiv: HTMLElement = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(newButtonDiv);
        let newButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('New') + '...', id: 'new',
            attrs: { type: 'button' }
        });
        newButtonDiv.appendChild(newButtonElement);
        let newbutton: Button = new Button({ cssClass: 'e-button-custom' });
        newbutton.appendTo(newButtonElement);
        newButtonElement.addEventListener('click', this.addNewStyles);

        let modifybuttonDiv: HTMLElement = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(modifybuttonDiv);
        let modifyButtonElement: HTMLElement = createElement('button', {
            innerHTML: localValue.getConstant('Modify') + '...', id: 'modify',
            attrs: { type: 'button' }
        });
        modifybuttonDiv.appendChild(modifyButtonElement);
        let addbutton: Button = new Button({ cssClass: 'e-button-custom' });
        addbutton.appendTo(modifyButtonElement);
        modifyButtonElement.addEventListener('click', this.modifyStyles);
    }
    /**
     * @private
     */
    public show(): void {
        let localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        let styles: string[] = this.updateStyleNames(localValue);
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
    private updateStyleNames = (localValue: L10n): string[] => {
        let collection: string[] = this.documentHelper.owner.documentHelper.styles.getStyleNames('Paragraph');
        let styleNames: string[] = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
        let defaultStyleNames: string[] = this.defaultStyleName(styleNames, localValue);
        let finalList: string[] = collection.concat(defaultStyleNames).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
        return finalList;
    }
    private defaultStyleName = (styleNames: string[], localValue: L10n): string[] => {
        let styleName: string[] = [];
        for (let index: number = 0; index < styleNames.length; index++) {
            styleName.push(localValue.getConstant(styleNames[index]));
        }
        return styleName;
    }
    private modifyStyles = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.owner.styleDialogModule.show(this.styleName, this.localValue.getConstant('Modify Style'));
    }
    /* tslint:disable:no-any */
    private selectHandler = (args: any): void => {
        this.styleName = args.text;
    }
    private hideObjects(): void {
        this.documentHelper.dialog.hide();
    }

    private addNewStyles = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.owner.styleDialogModule.show();
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
    }
}

