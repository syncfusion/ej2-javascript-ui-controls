import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper} from '../viewer';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Editor } from '../editor';
import { WSectionFormat } from '../format/section-format';
import { FootEndNoteNumberFormat } from '../../base/types';
import { SelectionSectionFormat } from '../selection';
/**
 * The notes dialog is used to insert footnote.
 */
export class NotesDialog {
    private footCount: HTMLInputElement;
    private target: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    public editor: Editor;
    private notesList: DropDownList;
    private startValueTextBox: NumericTextBox;
    private list: string = undefined;
    /**
     * @private
     */
    private noteNumberFormat: string = undefined;
    private sectionFormat: WSectionFormat = undefined;
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'FootNotesDialog';
    }
    /**
     * @private
     */
    public notesDialog(localValue: L10n, isRtl?: boolean): void {
        let idName: string = this.documentHelper.owner.containerId + '_insert_Footnote';
        this.target = createElement('div', { id: idName, className: 'e-de-insert-footnote' });
        let firstDiv: HTMLElement = createElement('div');

        let container: HTMLElement = createElement('div', {
            className: 'e-de-insert-footnote-dlg-sub-header', innerHTML: localValue.getConstant('Start at')
        });
        let startatValue: HTMLElement = createElement('div');
        this.footCount = createElement('input', {
            attrs: { type: 'text' }, id: this.documentHelper.owner.containerId + 'row'
        }) as HTMLInputElement;
        startatValue.appendChild(this.footCount);
        let numberformat: HTMLElement = createElement('div', {
            className: 'e-de-insert-footnote-dlg-sub-header', innerHTML: localValue.getConstant('Number format')
        });
        // tslint:disable-next-line:max-line-length
        let numberFormatDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { id: '_paperSizeDiv', styles: 'height:37px;', className: 'e-de-page-setup-dlg-sub-container' });
        let formatType: HTMLElement = createElement('select', {
            id: this.target.id + '_papersize', styles: 'padding-bottom: 20px;',
            innerHTML: '<option value="1, 2, 3, ...">' + localValue.getConstant('1, 2, 3, ...') +
                '</option><option value="a, b, c, ...">' + localValue.getConstant('a, b, c, ...') +
                '</option><option value="A, B, C, ...">' + localValue.getConstant('A, B, C, ...') +
                '</option><option value="I, II, III, ...">' + localValue.getConstant('I, II, III, ...') +
                '</option><option value="i, ii, iii, ...">' + localValue.getConstant('i, ii, iii, ...') + '</option>'
        }) as HTMLSelectElement;
        numberFormatDiv.appendChild(formatType);
        this.notesList = new DropDownList({ enableRtl: isRtl });
        this.notesList.appendTo(formatType);
        firstDiv.appendChild(numberformat);
        firstDiv.appendChild(numberFormatDiv);
        firstDiv.appendChild(container);
        firstDiv.appendChild(startatValue);

        this.target.appendChild(firstDiv);

        this.startValueTextBox = new NumericTextBox({
            format: '#',
            min: 1,
            max: 99999,
            enablePersistence: false
        });
        this.startValueTextBox.appendTo(this.footCount);
    }

    /**
     * @private
     */
    public show(): void {
        let localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.notesDialog(localValue);
        }
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        // tslint:disable-next-line
        //let footType: any = this.documentHelper.selection.startInternal.currentWidget.paragraph.containerWidget;
        if (this.documentHelper.selection.isinFootnote) {
        this.documentHelper.dialog.header = localValue.getConstant('Footnote');
        } else {
            this.documentHelper.dialog.header = localValue.getConstant('Endnote');
        }
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.loadFontDialog;
        this.documentHelper.dialog.buttons = [{
            click: this.onInsertFootnoteClick,
            buttonModel: { content: localValue.getConstant('Apply'), cssClass: 'e-flat e-table-ok', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-table-cancel' }
        }];
        this.startValueTextBox.value = 1;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
        if (this.documentHelper.selection.isinEndnote) {
            let alignValue: number = this.endnoteListValue(this.list);
            this.notesList.index = alignValue;
        }
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.updateFocus();
        this.unWireEventsAndBindings();
    }
    /**
     * @private
     */
    public loadFontDialog = (): void => {
        this.documentHelper.updateFocus();
        let format: string;
        let section: WSectionFormat | SelectionSectionFormat;
        if (this.sectionFormat) {
            section = this.sectionFormat;
        } else {
            section = this.documentHelper.owner.selection.sectionFormat;
        }
        if (this.documentHelper.selection.isinFootnote) {
            let footnotesFormat: string = section.footNoteNumberFormat;
            let startAt: number = section.initialFootNoteNumber;
            format = this.reversetype(footnotesFormat);
            this.notesList.value = format;
            this.startValueTextBox.value = startAt;
        } else {
            let endnotesFormat: string = section.endnoteNumberFormat;
            format = this.reversetype(endnotesFormat);
            let startAt: number = section.initialEndNoteNumber;
            this.notesList.value = format;
            this.startValueTextBox.value = startAt;
        }
    }
    /**
     * @private
     */
    public onInsertFootnoteClick = (): void => {
        let format: WSectionFormat | SelectionSectionFormat;
        format = new WSectionFormat(undefined);
        if (!isNullOrUndefined(this.notesList)) {
            let renderFormat: FootEndNoteNumberFormat;
            let formats: string = (this.notesList.value).toString();
            renderFormat = this.types(formats);
            let startValue: number = this.startValueTextBox.value;
            if (!isNullOrUndefined(this.notesList)) {
                if (this.documentHelper.selection.isinFootnote) {
                    format.footNoteNumberFormat = renderFormat;
                    format.footNoteNumberFormat = renderFormat;
                    format.initialFootNoteNumber = startValue;
                    this.documentHelper.owner.editorModule.onApplySectionFormat(undefined, format);

                } else {
                    format.endnoteNumberFormat = renderFormat;
                    format.endnoteNumberFormat = renderFormat;
                    format.initialEndNoteNumber = startValue;
                    this.documentHelper.owner.editorModule.onApplySectionFormat(undefined, format);
                }
            }
        }
        this.documentHelper.hideDialog();
    }
    private types(type: string): FootEndNoteNumberFormat {
        switch (type) {
            case '1, 2, 3, ...':
                return 'Arabic';
            case 'A, B, C, ...':
                return 'UpperCaseLetter';
            case 'a, b, c, ...':
                return 'LowerCaseLetter';
            case 'I, II, III, ...':
                return 'LowerCaseRoman';
            case 'i, ii, iii, ...':
                return 'UpperCaseRoman';
            default:
                return 'Arabic';

        }

    }
    private reversetype(type: string): string {
        switch (type) {
            case 'Arabic':
                return '1, 2, 3, ...';
            case 'UpperCaseLetter':
                return 'A, B, C, ...';
            case 'LowerCaseLetter':
                return 'a, b, c, ...';
            case 'UpperCaseRoman':
                return 'I, II, III, ...';
            case 'LowerCaseRoman':
                return 'i, ii, iii, ...';
            default:
                return '1, 2, 3, ...';
        }

    }
    // tslint:disable-next-line
    private endnoteListValue(listFocus: any): number {
        let value: number;
        if (listFocus === 'A, B, C, ...') {
            value = 0;
        } else if (listFocus === '1, 2, 3, ...') {
            value = 1;
        } else if (listFocus === 'a, b, c, ...') {
            value = 2;
        } else if (listFocus === 'A, B, C, ...') {
            value = 3;
        } else {
            value = 4;
        }
        return value;
    }
    /**
     * @private
     */
    public unWireEventsAndBindings = (): void => {
        this.notesList.value = undefined;
    }
    /**
     * @private
     */
    public destroy(): void {
        if (this.footCount) {
            if (this.footCount.parentElement) {
                this.footCount.parentElement.removeChild(this.footCount);
            }
            this.footCount = undefined;
        }
        if (this.startValueTextBox) {
            this.startValueTextBox.destroy();
            this.startValueTextBox = undefined;
        }
        if (this.notesList) {
            this.notesList.destroy();
            this.notesList = undefined;
        }
        this.footCount = undefined;
    }

}