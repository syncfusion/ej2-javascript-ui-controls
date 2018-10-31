import { ListView } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { LayoutViewer } from '../index';
import { createElement, L10n, setCulture } from '@syncfusion/ej2-base';

/**
 * The Styles dialog is used to create or modify styles.
 */
export class StylesDialog {
    /**
     * @private
     */
    public owner: LayoutViewer;
    private target: HTMLElement;
    private listviewInstance: ListView;
    private styleName: string;
    private localValue: L10n;
    /**
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
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
    public initStylesDialog(localValue: L10n, styles: string[]): void {
        let instance: StylesDialog = this;
        let id: string = this.owner.owner.containerId + '_insert_styles';
        this.target = createElement('div', { id: id, className: 'e-de-styles' });
        let headerValue: string = localValue.getConstant('Styles');
        let dlgFields: HTMLElement = createElement('div', { innerHTML: headerValue, className: 'e-styles-dlgfields' });
        this.target.appendChild(dlgFields);

        let commonDiv: HTMLElement = createElement('div', { className: 'e-styles-common' });
        this.target.appendChild(commonDiv);

        let searchDiv: HTMLElement = createElement('div', { className: 'e-styles-list' });
        commonDiv.appendChild(searchDiv);

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
        let newButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('New'), id: 'new' });
        newButtonDiv.appendChild(newButtonElement);
        let newbutton: Button = new Button({ cssClass: 'e-button-custom' });
        newbutton.appendTo(newButtonElement);
        newButtonElement.addEventListener('click', this.addNewStyles);

        let modifybuttonDiv: HTMLElement = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(modifybuttonDiv);
        let modifyButtonElement: HTMLElement = createElement('button', { innerHTML: localValue.getConstant('Modify'), id: 'modify' });
        modifybuttonDiv.appendChild(modifyButtonElement);
        let addbutton: Button = new Button({ cssClass: 'e-button-custom' });
        addbutton.appendTo(modifyButtonElement);
        modifyButtonElement.addEventListener('click', this.modifyStyles);

    }
    /**
     * @private
     */
    public show(): void {
        let styles: string[] = this.updateStyleNames();
        let localValue: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        localValue.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        this.localValue = localValue;
        this.initStylesDialog(localValue, styles);
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = this.owner.updateFocus;
        this.owner.dialog.close = this.owner.updateFocus;
        this.owner.dialog.header = 'Styles';
        this.owner.dialog.height = 'auto';
        this.owner.dialog.width = 'auto';
        this.owner.dialog.buttons = [{
            click: this.hideObjects.bind(this),
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
        }];
        this.owner.dialog.dataBind();
        this.owner.dialog.show();
    }
    private updateStyleNames = (): string[] => {
        let collection: string[] = this.owner.owner.viewer.styles.getStyleNames('Paragraph');
        let defaultStyleNames: string[] = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
        let finalList: string[] = collection.concat(defaultStyleNames).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
        return finalList;
    }
    private modifyStyles = (): void => {
        this.owner.dialog.hide();
        this.owner.owner.styleDialogModule.show(this.styleName, this.localValue.getConstant('Modify Style'));
    }
    /* tslint:disable:no-any */
    private selectHandler = (args: any): void => {
        this.styleName = args.text;
    }
    private hideObjects(): void {
        this.owner.dialog.hide();
    }

    private addNewStyles = (): void => {
        this.owner.dialog.hide();
        this.owner.owner.styleDialogModule.show();
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

