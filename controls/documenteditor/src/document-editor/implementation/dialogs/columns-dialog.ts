import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
import { CheckBox, ChangeEventArgs as CheckBoxChangeArgs, classNames } from '@syncfusion/ej2-buttons';
import { NumericTextBox, ChangeEventArgs as NumericChangeEventArgs, TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';
import { SelectionSectionFormat, WSectionFormat, WColumnFormat, HelperMethods, ParagraphInfo } from '../index';
import { SectionBreakType } from '../../base/types';


/**
 * @private
 */
class Column {
    public index: NumericTextBox;
    public width: NumericTextBox;
    public space: NumericTextBox;

}
export class ColumnsDialog {
    private oneDiv: HTMLDivElement;
    private twoDiv: HTMLDivElement;
    private threeDiv: HTMLDivElement;
    private leftDiv: HTMLDivElement;
    private rightDiv: HTMLDivElement;
    private target: HTMLElement;
    private columnsCountBox: HTMLInputElement;
    private columnValueTexBox: NumericTextBox;
    private lineCheckbox: CheckBox = undefined;
    private equalCheckbox: CheckBox = undefined;

    private columnCountBox1: HTMLInputElement;
    private widthCountBox1: HTMLInputElement;
    private spacingCountBox1: HTMLInputElement;

    //public subWidthAndSpacingContainerDiv :HTMLDivElement;
    public columnElementDiv : HTMLDivElement

    private widthcontainerDiv1 : HTMLDivElement;
    private columnTable: HTMLTableElement;
    private widthContainer: HTMLDivElement ;
    // private containerHead :HTMLDivElement;

    // private columnCountSI: HTMLInputElement;
    // private columnValueSI: NumericTextBox;
    // private widthCountSI: HTMLInputElement;
    // private widthValueSI: NumericTextBox;
    // private spaceCountSI: HTMLInputElement;
    // private spaceValueSI: NumericTextBox;
    private columns: Column[];
    public numberOfColumns: number;
    private section: SelectionSectionFormat ;
    private pageWidth: number;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private getModuleName(): string {
        return 'ColumnsDialog';
    }
    /**
     * @private
     * @param {L10n} localeValue - Specifies the locale.
     * @param {boolean} isRtl - Specifies is rtl.
     * @returns {void}
     */
    public initColumnsDialog(localeValue: L10n , isRtl?: boolean): void {
        this.columns = [];
        this.target = createElement('div', {
            id: this.documentHelper.owner.containerId + '_Columns',
            className: 'e-de-table-border-shading-dlg'
        });
        const displayText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Presets'),
            className: 'e-de-para-dlg-heading'
        });
        const PresetsContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-dlg-row'
        });
        const oneDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_One_Div_Container', className: 'e-de-preset-container'
        });
        this.oneDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_One_Div',
            className: 'e-icons e-de-ctnr-columns-one e-de-columns-presets-genral'
        });
        const oneDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('One'), className: 'e-de-column-label',
            id: this.target.id + '_One_Div_Label'
        });
        const twoDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Two_Div_Container', className: 'e-de-preset-container'
        });
        this.twoDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Two_Div',
            className: 'e-icons e-de-ctnr-columns-two e-de-columns-presets-genral'
        });
        const twoDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('Two'), className: 'e-de-column-label',
            id: this.target.id + '_Two_Div_Label'
        });
        const threeDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Three_Div_Container', className: 'e-de-preset-container'
        });
        this.threeDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Three_Div',
            className: 'e-icons e-de-ctnr-columns-three  e-de-columns-presets-genral'
        });
        const threeDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('Three'), className: 'e-de-column-label',
            id: this.target.id + '_Three_Div_Label'
        });
        const leftDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Left_Div_Container', className: 'e-de-preset-container'
        });
        this.leftDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Left_Div',
            className: 'e-icons e-de-ctnr-columns-left e-de-columns-presets-genral'
        });
        const leftDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('Left'), className: 'e-de-column-label',
            id: this.target.id + '_Left_Div_Label'
        });
        const rightDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Right_Div_Container', className: 'e-de-preset-container'
        });
        this.rightDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Right_Div',
            className: 'e-icons e-de-ctnr-columns-right e-de-columns-presets-genral'
        });
        const rightDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('Right'), className: 'e-de-column-label' ,
            id: this.target.id + '_Right_Div_Label'
        });
        const nuberOfColumnsContainer: HTMLElement = createElement('div', {
            className: 'e-de-container-row e-de-columns-padding-alignment'
        });
        const subcontainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-subcontainer-left'
        });

        oneDivContainer.setAttribute('aria-label', localeValue.getConstant('One'));
        twoDivContainer.setAttribute('aria-label', localeValue.getConstant('Two'));
        threeDivContainer.setAttribute('aria-label', localeValue.getConstant('Three'));
        leftDivContainer.setAttribute('aria-label', localeValue.getConstant('Left'));
        rightDivContainer.setAttribute('aria-label', localeValue.getConstant('Right'));
        if (isRtl) {
            this.oneDiv.classList.add('e-de-rtl');
            this.twoDiv.classList.add('e-de-rtl');
            this.threeDiv.classList.add('e-de-rtl');
            this.leftDiv.classList.add('e-de-rtl');
            this.rightDiv.classList.add('e-de-rtl');
            oneDivContainer.classList.add('e-de-rtl');
            twoDivContainer.classList.add('e-de-rtl');
            threeDivContainer.classList.add('e-de-rtl');
            leftDivContainer.classList.add('e-de-rtl');
            rightDivContainer.classList.add('e-de-rtl');
            oneDivLabel.classList.add('e-de-rtl');
            twoDivLabel.classList.add('e-de-rtl');
            threeDivLabel.classList.add('e-de-rtl');
            leftDivLabel.classList.add('e-de-rtl');
            rightDivLabel.classList.add('e-de-rtl');
        }

        this.columnsCountBox = createElement('input', {
            attrs: { type: 'text' }
        }) as HTMLInputElement;
        subcontainer.appendChild(this.columnsCountBox);
        nuberOfColumnsContainer.appendChild(subcontainer);
        this.section = this.documentHelper.selection.sectionFormat;
        this.pageWidth = this.section.pageWidth - this.section.leftMargin - this.section.rightMargin;
        this.columnValueTexBox = new NumericTextBox({
            format: '#',
            value: 1,
            min: 1,
            strictMode: true,
            placeholder: localeValue.getConstant('Number of columns'),
            floatLabelType: 'Always',
            change:  this.createTextBox
        });
        this.columnValueTexBox.appendTo(this.columnsCountBox);
        const subcontainer1: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-subcontainer-right'
        });

        const lineCheckDiv: HTMLDivElement = createElement('div', {
            className: 'e-de-columns-padding-alignment'
        }) as HTMLDivElement;
        const lineCheck: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' } }) as HTMLInputElement;
        subcontainer1.appendChild(lineCheckDiv);
        lineCheckDiv.appendChild(lineCheck);
        lineCheck.setAttribute('aria-labelledby', localeValue.getConstant('Line between column'));
        this.columnsCountBox.setAttribute('aria-labelledby', localeValue.getConstant('Number of columns'));
        this.lineCheckbox = new CheckBox({
            label: localeValue.getConstant('Line between column')
        });
        const widthAndSpacingContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-dlg-row'
        });
        const widthAndSpacingContainerDiv: HTMLDivElement = <HTMLDivElement>createElement('div', {
        });
        const widthAndSpacingText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Width and Spacing'),
            className: 'e-de-para-dlg-heading'
        });
        //  this.subWidthAndSpacingContainerDiv = <HTMLDivElement>createElement('div',{
        //     className:'e-bookmark-listview e-width-space-div',
        //     styles: "width:100%;"
        // });
        this.columnElementDiv = <HTMLDivElement>createElement('div', {
            className: 'e-width-space-div '
        });
        this.widthcontainerDiv1 = <HTMLDivElement>createElement('div', {
            className: 'e-de-container-row'
        });
        this.widthContainer = <HTMLDivElement>createElement('div', {
            className: 'e-de-container-row'
        });
        // Heading
        // this.containerHead = <HTMLDivElement>createElement('div', {
        //     className: 'e-de-container-row'
        // });

        const tableElement: HTMLTableElement = createElement('table') as HTMLTableElement;
        tableElement.style.width = '96%';
        const row: HTMLTableRowElement = tableElement.insertRow();
        let cell: HTMLTableCellElement = row.insertCell();
        cell.innerHTML = localeValue.getConstant('Column');
        cell.style.width = '20%';
        cell.style.display = 'table-cell';
        cell.classList.add('e-de-dlg-sub-header');
        cell = row.insertCell();
        cell.innerHTML = localeValue.getConstant('Width');
        cell.style.width = '40%';
        cell.style.display = 'table-cell';
        cell.classList.add('e-de-dlg-sub-header');
        cell = row.insertCell();
        cell.innerHTML = localeValue.getConstant('Spacing');
        cell.style.width = '40%';
        cell.style.display = 'table-cell';
        cell.classList.add('e-de-dlg-sub-header');
        //wC
        //this.columnCountSI = <HTMLInputElement>createElement('input', {
        //});
        // this.columnValueSI = new NumericTextBox({
        //     //placeholder: localeValue.getConstant('Column'),
        //     enabled: false,
        //     showSpinButton: false

        // });
        //this.containerHead.appendChild(this.columnCountSI);
        // this.columnValueSI.appendTo(this.columnCountSI);
        //wSi
        //this.widthCountSI = <HTMLInputElement>createElement('input', {
        //});
        // this.widthValueSI = new NumericTextBox({
        //     //placeholder: localeValue.getConstant('Width'),
        //     enabled: false,
        //     showSpinButton: false

        // });
        //this.containerHead.appendChild(this.widthCountSI);
        //this.widthValueSI.appendTo(this.widthCountSI);
        //ws
        //this.spaceCountSI = <HTMLInputElement>createElement('input', {
        //});
        // this.spaceValueSI = new NumericTextBox({
        //     //placeholder: localeValue.getConstant('Spacing'),
        //     enabled: false,
        //     showSpinButton: false

        // });
        //this.containerHead.appendChild(this.spaceCountSI);
        //this.spaceValueSI.appendTo(this.spaceCountSI);
        const columnDiv: HTMLDivElement =  createElement('div', {styles: 'width:100%;height:100px;overflow-y: scroll;overflow-x: hidden;'}) as HTMLDivElement;
        this.columnTable = createElement('table', {styles: 'width:100%;'}) as HTMLTableElement;

        const row1: HTMLTableRowElement = this.columnTable.insertRow();
        const cell1: HTMLTableCellElement = row1.insertCell();
        cell1.style.width = '20%';
        //NUMERIC TEXT BOX
        // column
        const col: Column = new Column();
        this.columnCountBox1 = <HTMLInputElement>createElement('input', {
        });
        col.index = new NumericTextBox({
            format: '#',
            min: 1,
            value: 1,
            enabled: false,
            cssClass: 'index1',
            showSpinButton: false,
            floatLabelType: 'Always',
            change: this.spaceChange
        });
        cell1.appendChild(this.columnCountBox1);
        col.index.appendTo(this.columnCountBox1);

        // width
        const cell2: HTMLTableCellElement = row1.insertCell();
        cell2.style.width = '40%';
        this.widthCountBox1 = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        col.width = new NumericTextBox({
            min: 36,
            decimals: 2,
            strictMode: true,
            enablePersistence: false,
            cssClass: 'width1',
            floatLabelType: 'Always',
            change: this.widthChange
        });
        cell2.appendChild(this.widthCountBox1);
        cell2.style.width = '40%';
        col.width.appendTo(this.widthCountBox1);

        //spacing
        const cell3: HTMLTableCellElement = row1.insertCell();
        cell3.style.width = '40%';
        this.spacingCountBox1 = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        col.space = new NumericTextBox({
            min: 0,
            decimals: 2,
            strictMode: true,
            enablePersistence: false,
            cssClass: 'space1',
            floatLabelType: 'Always',
            change: this.spaceChange
        });
        cell3.appendChild(this.spacingCountBox1);
        col.space.appendTo(this.spacingCountBox1);
        this.columns.push(col);
        col.space.enabled = false;
        this.widthCountBox1.setAttribute('aria-labelledby', 'Width');
        this.spacingCountBox1.setAttribute('aria-labelledby', 'Space');
        const equalCheckDiv: HTMLDivElement = createElement('div', {
            className: 'e-de-columns-padding-alignment'
        }) as HTMLDivElement;
        const equalCheck: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' } }) as HTMLInputElement;
        equalCheckDiv.appendChild(equalCheck);
        equalCheckDiv.setAttribute('aria-label', localeValue.getConstant('Equal column width'));
        this.equalCheckbox = new CheckBox({
            label: localeValue.getConstant('Equal column width'),
            change: this.checkBox
        });
        this.equalCheckbox.appendTo(equalCheck);


        this.lineCheckbox.appendTo(lineCheck);
        nuberOfColumnsContainer.appendChild(subcontainer1);

        oneDivContainer.appendChild(this.oneDiv);
        oneDivContainer.appendChild(oneDivLabel);
        twoDivContainer.appendChild(this.twoDiv);
        twoDivContainer.appendChild(twoDivLabel);
        threeDivContainer.appendChild(this.threeDiv);
        threeDivContainer.appendChild(threeDivLabel);
        leftDivContainer.appendChild(this.leftDiv);
        leftDivContainer.appendChild(leftDivLabel);
        rightDivContainer.appendChild(this.rightDiv);
        rightDivContainer.appendChild(rightDivLabel);

        PresetsContainer.appendChild(oneDivContainer);
        PresetsContainer.appendChild(twoDivContainer);
        PresetsContainer.appendChild(threeDivContainer);
        PresetsContainer.appendChild(leftDivContainer);
        PresetsContainer.appendChild(rightDivContainer);
        //this.subWidthAndSpacingContainerDiv.appendChild(this.containerHead);
        //this.subWidthAndSpacingContainerDiv.appendChild(this.widthcontainerDiv1);//<- First add

        widthAndSpacingContainerDiv.appendChild(widthAndSpacingText);
        widthAndSpacingContainerDiv.appendChild(tableElement);
        columnDiv.appendChild(this.columnTable);
        widthAndSpacingContainerDiv.appendChild(columnDiv);
        //widthAndSpacingContainerDiv.appendChild(this.subWidthAndSpacingContainerDiv);
        widthAndSpacingContainer.appendChild(widthAndSpacingContainerDiv);

        this.target.appendChild(displayText);
        this.target.appendChild(PresetsContainer);
        this.target.appendChild(nuberOfColumnsContainer);
        this.target.appendChild(widthAndSpacingContainer);
        this.target.appendChild(equalCheckDiv);

        // Handling clicking
        oneDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        twoDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        threeDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        leftDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        rightDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        this.widthcontainerDiv1.style.display = 'flex';

        this.equalCheckbox.checked = true;
        this.equalCheckbox.disabled = true;
        this.lineCheckbox.disabled = true;


    }
    public checkBox = (args: ChangedEventArgs): void => {
        for (let i: number = 0; i < this.columns.length; i++) {
            const col: Column = this.columns[parseInt(i.toString(), 10)];
            if (this.equalCheckbox.checked === true) {
                if (i !== 0) {
                    col.width.enabled = false;
                    col.space.enabled = false;
                }
            } else {
                col.width.enabled = true;
                col.space.enabled = true;
            }
        }
    }
    public createTextBox = (args: NumericChangeEventArgs): void => {

        if (this.columnValueTexBox.value === 1) {
            this.oneDiv.classList.add('e-de-table-border-inside-setting-click');
            this.twoDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
        }
        else if (this.columnValueTexBox.value === 2) {
            this.oneDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.twoDiv.classList.add('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
        }
        else if (this.columnValueTexBox.value === 3) {
            this.oneDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.twoDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.add('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
        }
        this.numberOfColumns = args.value;
        if (args.value >= 1) {
            this.equalCheckbox.disabled = false;
            this.lineCheckbox.disabled = false;
            let i: number = args.previousValue;
            while (i < this.numberOfColumns) {
                this.createColumn(i + 1);
                i++;
            }
            while (i > this.numberOfColumns) {
                this.columnTable.deleteRow(this.columnTable.rows.length - 1);
                this.columns.splice(this.columns.length - 1, this.columns.length);
                if (this.numberOfColumns === 1) {
                    this.equalCheckbox.disabled = true;
                    this.columns[0].space.enabled = false;
                }
                i--;
            }
            this.canUpdateColumnWidthAndSpacing(args.value, undefined, undefined, undefined);
        }

    }
    private createColumn(index: number, width?: number, space?: number) : void{
        this.widthContainer = <HTMLDivElement>createElement('div', {
            className: 'e-de-container-row'
        });
        this.widthContainer.style.display = 'flex';
        const row: HTMLTableRowElement = this.columnTable.insertRow();
        const cell1: HTMLTableCellElement = row.insertCell();
        cell1.style.width = '20%';
        const col: Column = new Column();
        // column
        const columnCount: HTMLInputElement = <HTMLInputElement>createElement('input', {

        });
        col.index = new NumericTextBox({
            format: '#',
            min: 1,
            value: index,
            enabled: false,
            cssClass: 'column1',
            showSpinButton: false,
            floatLabelType: 'Always'
        });
        cell1.appendChild(columnCount);
        col.index.appendTo(columnCount);

        // width
        const cell2: HTMLTableCellElement = row.insertCell();
        cell2.style.width = '40%';
        const widthCountBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        col.width = new NumericTextBox({
            min: 36,
            decimals: 2,
            strictMode: true,
            enablePersistence: false,
            cssClass: 'width1',
            floatLabelType: 'Always',
            change: this.widthChange
        });
        if (!isNullOrUndefined(width)){
            col.width.value = width;
        }
        cell2.appendChild(widthCountBox);
        col.width.appendTo(widthCountBox);

        //spacing
        const cell3: HTMLTableCellElement = row.insertCell();
        cell3.style.width = '40%';
        const spacingCountBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }
        });
        col.space = new NumericTextBox({
            min: 0,
            decimals: 2,
            strictMode: true,
            enablePersistence: false,
            cssClass: 'space1',
            floatLabelType: 'Always',
            change: this.spaceChange
        });
        if (!isNullOrUndefined(space)){
            col.space.value = space;
        }
        cell3.appendChild(spacingCountBox);
        col.space.appendTo(spacingCountBox);
        //this.columnElementDiv.appendChild(this.widthContainer);
        //this.subWidthAndSpacingContainerDiv.appendChild(this.columnElementDiv);//<- Second Add
        this.columns.push(col);
    }
    private widthChange = (args: NumericChangeEventArgs): void => {
        if (args.isInteracted === true) {
            const val: DOMTokenList = ((args.event.target) as HTMLElement).parentElement.classList;
            val.replace('width1', 'Width');
            this.checkAndApplyColumnFormatWidth(args.value);

        }
    }
    private spaceChange = (args: NumericChangeEventArgs): void => {
        if (args.isInteracted === true) {
            const val: DOMTokenList = ((args.event.target) as HTMLElement).parentElement.classList;
            val.replace('space1', 'Space');
            this.checkAndApplyColumnFormatSpace(args.value);

        }
    }
    public checkAndApplyColumnFormatWidth = (columnWidth: number): void => {
        if (this.numberOfColumns === 1) {
            if (columnWidth > this.pageWidth) {
                this.columns[0].width.value = columnWidth - 1;
            } else {
                this.columns[0].width.value = columnWidth + 1;
            }
        } else {
            if (this.equalCheckbox.checked === true) {

                for (let i: number = 0; i < this.columns.length; i++) {
                    const col: Column = this.columns[parseInt(i.toString(), 10)];
                    if (columnWidth >= 36 && this.columns[0].space.value >= 0) {
                        const spaceCal: number = (this.pageWidth - (this.numberOfColumns * columnWidth)) / (this.numberOfColumns - 1);
                        col.width.value = columnWidth;
                        if (i < this.columns.length - 1) {
                            col.space.value = spaceCal;
                        }
                    } else {
                        this.columns[0].width.value = this.columns[1].width.value;
                    }
                }
            }
            if (this.equalCheckbox.checked === false) {
                for (let i: number = 0; i < this.columns.length; i++) {
                    const col: Column = this.columns[parseInt(i.toString(), 10)];
                    let updatedNumber: number;
                    if (columnWidth === this.columns[parseInt(i.toString(), 10)].width.value) {
                        updatedNumber = i;

                        if (updatedNumber + 1 !== this.columns.length) {
                            if (columnWidth > this.columns[0].width.value
                                || columnWidth > this.columns[this.columns.length - 1].width.value) {
                                for (let y: number = updatedNumber + 1; y <= this.columns.length; y++) {
                                    const col: Column = this.columns[parseInt(y.toString(), 10)];
                                    //1
                                    if (y < this.columns.length) {
                                        if (col.width.value > 36) {
                                            col.width.value = col.width.value - 1;
                                        }
                                    }
                                    //2
                                    if (this.columns[0].space.value === 0) {
                                        for (let k: number = updatedNumber - 1; k >= 0; k--) {
                                            const col: Column = this.columns[parseInt(k.toString(), 10)];
                                            if (col.width.value > 36) {
                                                col.width.value = col.width.value - 1;
                                            }
                                        }
                                    }
                                    //3
                                    if ((y >= this.columns.length && this.columns[0].width.value === 36)
                                        || (this.columns[y - 1].width.value === 36 && this.columns[0].space.value !== 0)) {
                                        for (let j: number = 0; j < this.columns.length - 1; j++) {
                                            const col: Column = this.columns[parseInt(j.toString(), 10)];
                                            if (col.space.value > 0) {
                                                if (j < this.columns.length - 1) {
                                                    col.space.value = col.space.value - 1;
                                                }
                                            }
                                        }
                                    }
                                    //4
                                    if (this.columns[0].width.value === 36 && this.columns[0].space.value === 0
                                        || this.columns[y - 1].width.value === 36 && this.columns[0].space.value === 0) {
                                        for (let j: number = 0; j < this.columns.length; j++) {
                                            const col: Column = this.columns[parseInt(j.toString(), 10)];
                                            if (col.width.value !== 36 && columnWidth
                                                > (this.pageWidth - ((this.numberOfColumns - 1) * 36))) {
                                                col.width.value = columnWidth - 1;
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (let y: number = updatedNumber + 1; y < this.columns.length; y++) {
                                    const col: Column = this.columns[parseInt(y.toString(), 10)];
                                    if (col.width.value > 36) {
                                        col.width.value = col.width.value + 1;
                                    }
                                }

                            }
                        } else {
                            if (columnWidth > this.columns[0].width.value
                                || columnWidth > this.columns[this.columns.length - 1].width.value) {
                                for (let y: number = updatedNumber + 1; y <= this.columns.length; y++) {
                                    //2
                                    if (this.columns[0].space.value === 0) {
                                        for (let k: number = updatedNumber - 1; k >= 0; k--) {
                                            const col: Column = this.columns[parseInt(k.toString(), 10)];
                                            if (col.width.value > 36) {
                                                col.width.value = col.width.value - 1;
                                            }
                                        }
                                    }
                                    //3
                                    if ((y <= this.columns.length && this.columns[0].space.value !== 0)) {
                                        for (let j: number = 0; j < this.columns.length - 1; j++) {
                                            const col: Column = this.columns[parseInt(j.toString(), 10)];
                                            if (col.space.value > 0) {
                                                if (j < this.columns.length - 1) {
                                                    col.space.value = col.space.value - 1;
                                                }
                                            }
                                        }
                                    }
                                    //4
                                    if (this.columns[0].width.value === 36 && this.columns[0].space.value === 0) {
                                        for (let j: number = 0; j < this.columns.length; j++) {
                                            const col: Column = this.columns[parseInt(j.toString(), 10)];
                                            if (col.width.value !== 36 && columnWidth
                                                > (this.pageWidth - ((this.numberOfColumns - 1) * 36))) {
                                                col.width.value = columnWidth - 1;
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (let y: number = updatedNumber + 1; y < this.columns.length; y++) {
                                    const col: Column = this.columns[parseInt(y.toString(), 10)];
                                    if (col.width.value > 36) {
                                        col.width.value = col.width.value + 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public checkAndApplyColumnFormatSpace = (columnSpace: number): void => {
        if (this.equalCheckbox.checked === true) {
            for (let i: number = 0; i < this.columns.length; i++) {
                const col: Column = this.columns[parseInt(i.toString(), 10)];
                if (columnSpace >= 0 && this.columns[0].width.value >= 36) {
                    const widthCal: number = (this.pageWidth - (columnSpace * (this.numberOfColumns - 1))) / (this.numberOfColumns);
                    col.width.value = widthCal;
                    if (i < this.columns.length - 1) {
                        col.space.value = columnSpace;
                    }
                } else {
                    this.columns[0].space.value = this.columns[1].space.value;
                }
            }
        }
        if (this.equalCheckbox.checked === false) {
            for (let i: number = 0; i < this.columns.length; i++) {
                const col: Column = this.columns[parseInt(i.toString(), 10)];
                let updatedNumber: number;
                if (columnSpace === this.columns[parseInt(i.toString(), 10)].space.value) {
                    updatedNumber = i;
                    if (updatedNumber + 1 !== this.columns.length) {
                        this.columns[this.columns.length - 1 ].space.value = 0;
                        if (columnSpace > this.columns[0].space.value || columnSpace > this.columns[this.columns.length - 2].space.value) {
                            //1
                            for (let y: number = updatedNumber + 1; y <= this.columns.length; y++) {
                                const col: Column = this.columns[parseInt(y.toString(), 10)];
                                if (y < this.columns.length) {
                                    if (col.width.value > 36) {
                                        col.width.value = col.width.value - 1;
                                    }
                                }
                                //2
                                if ((this.columns[updatedNumber + 1].width.value === 36
                                    && this.columns[parseInt(updatedNumber.toString(), 10)].width.value > 36)) {
                                    for (let j: number = updatedNumber; j >= 0; j--) {
                                        const col: Column = this.columns[parseInt(j.toString(), 10)];
                                        if (col.width.value > 36) {
                                            col.width.value = col.width.value - 1;
                                        }
                                    }
                                }
                                //3
                                if (this.columns[parseInt(updatedNumber.toString(), 10)].width.value === 36 ) {
                                    if (this.columns[0].space.value !== 0 || this.columns[updatedNumber + 1].space.value !== 0){
                                        for (let k: number = 0; k < this.columns.length - 1; k++) {
                                            const col: Column = this.columns[parseInt(k.toString(), 10)];
                                            if (col.space.value > 0) {
                                                if (k < this.columns.length - 1) {
                                                    col.space.value = col.space.value - 1;
                                                    this.columns[parseInt(updatedNumber.toString(), 10)].space.value = columnSpace;
                                                }
                                            }
                                        }
                                    }
                                }
                                //4
                                if (this.columns[0].width.value === 36 && (this.columns[0].space.value === 0
                                    || this.columns[updatedNumber + 1].space.value === 0)) {
                                    for (let j: number = 0; j < this.columns.length; j++) {
                                        const col: Column = this.columns[parseInt(j.toString(), 10)];
                                        if (col.space.value !== 0 && columnSpace > (this.pageWidth - ((this.numberOfColumns) * 36))) {
                                            col.space.value = columnSpace - 1;
                                        }
                                    }
                                }
                            }
                        } else {
                            for (let y: number = updatedNumber + 1; y < this.columns.length; y++) {
                                const col: Column = this.columns[parseInt(y.toString(), 10)];
                                if (col.width.value > 36) {
                                    col.width.value = col.width.value + 0.5;
                                }
                            }
                        }
                    }else{
                        this.columns[parseInt(updatedNumber.toString(), 10)].space.value = 0;
                    }
                }
            }
        }
    }
    public canUpdateColumnWidthAndSpacing = (numberOfColumns: number, colIndex: number, colWidth: number, colSpace: number): void => {
        const spaceValue: number = 36;
        const valueWidthEqualFirst: number = (this.pageWidth - 36 * (numberOfColumns - 1)) / numberOfColumns;
        const valueWidthEqualsecond: number = (this.pageWidth - 36 * (numberOfColumns)) / (numberOfColumns - 1);
        if (numberOfColumns === 2) {
            this.equalCheckbox.checked = true;
        }
        if (this.equalCheckbox.checked === true) {
            if (numberOfColumns > 1) {
                const col: Column = this.columns[numberOfColumns - 1];
                col.index.value = numberOfColumns;
                for (let i: number = 0; i < numberOfColumns; i++) {
                    const col: Column = this.columns[parseInt(i.toString(), 10)];
                    if (numberOfColumns <= 6) {
                        col.width.value = valueWidthEqualFirst;
                    } else{
                        col.width.value = spaceValue;
                    }
                    col.width.value = valueWidthEqualFirst;
                    if (i < numberOfColumns - 1) {
                        if (numberOfColumns <= 6) {
                            col.space.value = spaceValue;
                        } else {
                            col.space.value = valueWidthEqualsecond;
                        }
                    }

                    col.width.enabled = false;
                    col.space.enabled = false;
                }
            } else {
                this.columns[0].width.value = this.pageWidth;
            }
            this.columns[0].width.enabled = true;
            if (numberOfColumns > 1) {
                this.columns[0].space.enabled = true;
            } else {
                this.columns[0].space.enabled = false;
            }
        }
        if (this.equalCheckbox.checked === false) {
            if (numberOfColumns > 2) {
                const col: Column = this.columns[numberOfColumns - 1];
                col.index.value = numberOfColumns;
                for (let i: number = 0; i < numberOfColumns; i++) {
                    const col: Column = this.columns[parseInt(i.toString(), 10)];
                    col.width.value = valueWidthEqualFirst;
                    if (i < numberOfColumns - 1) {
                        if (col.width.value <= 36) {
                            col.space.value = valueWidthEqualsecond;
                        } else {
                            col.space.value = spaceValue;
                        }
                    }
                    col.width.enabled = true;
                    col.space.enabled = true;
                }
            } else {
                this.columns[0].width.value = this.pageWidth;
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public closeDialog = (): void => {
        this.documentHelper.dialog.hide();
        this.unWireEventsAndBindings();
        this.closeColumnsDialog();
    };
    /**
     * @private
     * @returns {void}
     */
    private closeColumnsDialog = (): void => {
        this.documentHelper.dialog2.element.style.pointerEvents = '';
        this.unWireEventsAndBindings();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public unWireEventsAndBindings = (): void => {
        this.equalCheckbox.checked = true;
        this.lineCheckbox.checked = false;
        this.equalCheckbox.disabled = true;
        const cols: WColumnFormat[] = [];
        for (let i: number = 0; i < this.columns.length; i++) {
            this.columns.splice(1, this.columns.length - 1);
            this.columns[0].space.enabled = false;
        }
        while (this.columnTable.rows.length > 1){
            this.columnTable.deleteRow(this.columnTable.rows.length - 1);
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public openColumnsDialog = (): void => {
        const sectionFormat: SelectionSectionFormat = this.documentHelper.selection.sectionFormat;
        const pageWidthBox: number = sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin;
        this.columnValueTexBox.max = pageWidthBox / 36;
        this.columns[0].width.value = pageWidthBox;
        this.documentHelper.updateFocus();
        this.equalCheckbox.checked = sectionFormat.equalWidth;
        this.lineCheckbox.checked = sectionFormat.lineBetweenColumns;
        this.columnValueTexBox.value = sectionFormat.columns.length === 0 ? 1 : sectionFormat.columns.length;
        switch (this.columnValueTexBox.value) {
        case 1:
            this.oneDiv.classList.add('e-de-table-border-inside-setting-click');
            this.twoDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
            break;
        case 2:
            this.twoDiv.classList.add('e-de-table-border-inside-setting-click');
            this.oneDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
            break;
        case 3:
            this.threeDiv.classList.add('e-de-table-border-inside-setting-click');
            this.twoDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.oneDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
            break;
        }
        if (this.columnValueTexBox.value !== 1) {
            this.columns[0].space.value = sectionFormat.columns[0].space;
            this.columns[0].width.value = sectionFormat.columns[0].width;
        }
        if (this.columnValueTexBox.value === 1) {
            this.columns[0].space.value = 0;
        }
        /* eslint-disable */
        for (let i = 1; i < this.columnValueTexBox.value; i++) {
            this.createColumn(i + 1, sectionFormat.columns[i].width, sectionFormat.columns[i].space);
        }
        /* eslint-enable */
    };
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localeValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localeValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initColumnsDialog(localeValue, this.documentHelper.owner.enableRtl);
        }
        // this.loadColumnsDialog(localeValue);
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.header = localeValue.getConstant('Columns');
        this.documentHelper.dialog.beforeOpen = this.openColumnsDialog;
        this.documentHelper.dialog.close = this.closeColumnsDialog;
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.buttons = [{
            click: this.applyColumnDialog,
            buttonModel: { content: localeValue.getConstant('Ok'), cssClass: 'e-flat e-table-border-shading-okay', isPrimary: true }
        },
        {
            click: this.closeDialog,
            buttonModel: { content: localeValue.getConstant('Cancel'), cssClass: 'e-flat e-table-border-shading-cancel' }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }

    /**
     * @private
     * @param {Event} event - Specifies the event args.
     * @returns {void}
     */
    private handleSettingCheckBoxAction = (event: Event): void => {
        const targetId: string = (event.target as HTMLElement).id;
        const columnDialogId: string = this.target.id;
        if (targetId === columnDialogId + '_One_Div' || targetId === columnDialogId + '_One_Div_Container') {
            this.oneDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('one');
        } else if (targetId === columnDialogId + '_Two_Div' || targetId === columnDialogId + '_Two_Div_Container') {
            this.twoDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('two');
        } else if (targetId === columnDialogId + '_Three_Div' || targetId === columnDialogId + '_Three_Div_Container') {
            this.threeDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('three');
        } else if (targetId === columnDialogId + '_Left_Div' || targetId === columnDialogId + '_Left_Div_Container') {
            this.oneDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.rightDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('two', 'left');
        } else if (targetId === columnDialogId + '_Right_Div' || targetId === columnDialogId + '_Right_Div_Container') {
            this.oneDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.threeDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.leftDiv.classList.remove('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('two', 'right');
        }

    };
    private setSettingPreviewDivElement(position: string, type?: string): void {
        this.equalCheckbox.checked = true;
        switch (position) {
        case 'one':
            this.columnValueTexBox.value = 1;
            break;
        case 'two':
            this.columnValueTexBox.value = 2;
            setTimeout(() => {
                if (type === 'left' || type === 'right') {
                    this.equalCheckbox.checked = false;
                }
                if (type === 'left') {
                    this.numberOfColumns = 2;
                    this.leftDiv.classList.add('e-de-table-border-inside-setting-click');
                    this.twoDiv.classList.remove('e-de-table-border-inside-setting-click');
                    const colWidth: number = ((this.pageWidth - (2 * 36)) / 3);
                    this.columns[0].width.value = colWidth;
                    this.columns[1].width.value = colWidth + colWidth + 36;
                    this.columns[1].space.value = undefined;
                } else if (type === 'right') {
                    this.numberOfColumns = 2;
                    this.rightDiv.classList.add('e-de-table-border-inside-setting-click');
                    this.twoDiv.classList.remove('e-de-table-border-inside-setting-click');
                    const colWidth: number = ((this.pageWidth - (2 * 36)) / 3);
                    this.columns[0].width.value = colWidth + colWidth + 36;
                    this.columns[1].width.value = colWidth;
                    this.columns[1].space.value = undefined;
                }
            }, 5);
            break;
        case 'three':
            this.columnValueTexBox.value = 3;
            break;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public applyColumnDialog = (): void => {
        if (!this.documentHelper.selection.isEmpty) {
            if (this.documentHelper.owner.editorHistory) {
                this.documentHelper.owner.editor.initComplexHistory('InsertSectionBreak');
            }
            const startParagraphInfo: ParagraphInfo = this.documentHelper.selection.getParagraphInfo(this.documentHelper.selection.start);
            const endParagraphInfo: ParagraphInfo = this.documentHelper.selection.getParagraphInfo(this.documentHelper.selection.end);
            const startIndex: string = this.documentHelper.selection.getHierarchicalIndex(startParagraphInfo.paragraph, startParagraphInfo.offset.toString());
            const endIndex: string = this.documentHelper.selection.getHierarchicalIndex(endParagraphInfo.paragraph, endParagraphInfo.offset.toString());
            this.documentHelper.selection.select(endIndex, endIndex);
            this.documentHelper.owner.editorModule.insertSectionBreak(SectionBreakType.Continuous);
            this.documentHelper.selection.select(startIndex, startIndex);
            this.documentHelper.owner.editorModule.insertSectionBreak(SectionBreakType.Continuous);
        }
        const sectionFormat: WSectionFormat = new WSectionFormat();
        const currentSectionFormat: SelectionSectionFormat = this.documentHelper.selection.sectionFormat;
        sectionFormat.bottomMargin = currentSectionFormat.bottomMargin;
        sectionFormat.topMargin = currentSectionFormat.topMargin;
        sectionFormat.leftMargin = currentSectionFormat.leftMargin;
        sectionFormat.rightMargin = currentSectionFormat.rightMargin;
        sectionFormat.pageWidth = currentSectionFormat.pageWidth;
        sectionFormat.pageHeight = currentSectionFormat.pageHeight;
        sectionFormat.differentOddAndEvenPages = currentSectionFormat.differentOddAndEvenPages;
        sectionFormat.differentFirstPage = currentSectionFormat.differentFirstPage;
        sectionFormat.headerDistance = currentSectionFormat.headerDistance;
        sectionFormat.footerDistance = currentSectionFormat.footerDistance;
        sectionFormat.numberOfColumns = this.numberOfColumns;
        sectionFormat.equalWidth = this.equalCheckbox.checked;
        sectionFormat.lineBetweenColumns = this.lineCheckbox.checked;
        const cols: WColumnFormat[] = [];
        for (let i: number = 0; i < this.columns.length; i++)
        {
            const colFormat: WColumnFormat = new WColumnFormat();
            colFormat.width =  HelperMethods.convertPointToPixel(this.columns[parseInt(i.toString(), 10)].width.value as number);
            colFormat.space =  HelperMethods.convertPointToPixel(this.columns[parseInt(i.toString(), 10)].space.value as number);
            cols.push(colFormat);
        }
        sectionFormat.columns = cols;
        sectionFormat.breakCode = currentSectionFormat.breakCode;
        this.documentHelper.owner.editorModule.onApplySectionFormat(undefined, sectionFormat);
        if(this.documentHelper.owner.editorHistory){
            this.documentHelper.owner.editorHistory.updateComplexHistory();
        }
        this.documentHelper.hideDialog();
    };
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.target = undefined;
        this.oneDiv = undefined;
        this.twoDiv = undefined;
        this.threeDiv = undefined;
        this.leftDiv = undefined;
        this.rightDiv = undefined;
        this.documentHelper = undefined;
    }
}



