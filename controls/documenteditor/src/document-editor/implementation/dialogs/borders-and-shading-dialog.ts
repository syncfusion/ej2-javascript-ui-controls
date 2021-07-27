import { Dialog } from '@syncfusion/ej2-popups';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WTableFormat, WBorder, WBorders, WShading, WCellFormat } from '../format/index';
import { LineStyle } from '../../base/types';
import { TablePropertiesDialog } from './table-properties-dialog';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TableCellWidget } from '../viewer/page';
import { Editor } from '../index';
import { ColorPicker, ColorPickerEventArgs } from '@syncfusion/ej2-inputs';
import { DocumentHelper } from '../viewer';

/**
 * The Borders and Shading dialog is used to modify borders and shading options for selected table or cells.
 */
export class BordersAndShadingDialog {
    public documentHelper: DocumentHelper;
    private dialog: Dialog;
    private target: HTMLElement;
    private tableFormatIn: WTableFormat;
    private cellFormatIn: WCellFormat;
    private applyTo: number;

    private cellFormat: WCellFormat = new WCellFormat();
    private tableFormat: WTableFormat = new WTableFormat();

    // Dialog elements
    private borderStyle: DropDownList;
    private borderColorPicker: ColorPicker;
    private noneDiv: HTMLDivElement;
    private boxDiv: HTMLDivElement;
    private allDiv: HTMLDivElement;
    private customDiv: HTMLDivElement;
    private noneDivTransparent: HTMLDivElement;
    private boxDivTransparent: HTMLDivElement;
    private allDivTransparent: HTMLDivElement;
    private customDivTransparent: HTMLDivElement;
    private previewDiv: HTMLDivElement;
    private previewRightDiagonalDiv: HTMLDivElement;
    private previewLeftDiagonalDiv: HTMLDivElement;
    private previewVerticalDiv: HTMLDivElement;
    private previewHorizontalDiv: HTMLDivElement;
    private previewDivTopTopContainer: HTMLDivElement;
    private previewDivTopTop: HTMLDivElement;
    private previewDivTopCenterContainer: HTMLDivElement;
    private previewDivTopCenter: HTMLDivElement;
    private previewDivTopBottomContainer: HTMLDivElement;
    private previewDivTopBottom: HTMLDivElement;
    private previewDivLeftDiagonalContainer: HTMLDivElement;
    private previewDivLeftDiagonal: HTMLDivElement;
    private previewDivBottomLeftContainer: HTMLDivElement;
    private previewDivBottomLeft: HTMLDivElement;
    private previewDivBottomcenterContainer: HTMLDivElement;
    private previewDivBottomcenter: HTMLDivElement;
    private previewDivBottomRightContainer: HTMLDivElement;
    private previewDivBottomRight: HTMLDivElement;
    private previewDivDiagonalRightContainer: HTMLDivElement;
    private previewDivDiagonalRight: HTMLDivElement;
    private previewDivTopTopTransParent: HTMLDivElement;
    private previewDivTopCenterTransParent: HTMLDivElement;
    private previewDivTopBottomTransParent: HTMLDivElement;
    private previewDivLeftDiagonalTransParent: HTMLDivElement;
    private previewDivBottomLeftTransparent: HTMLDivElement;
    private previewDivBottomcenterTransparent: HTMLDivElement;
    private previewDivBottomRightTransparent: HTMLDivElement;
    private previewDivDiagonalRightTransparent: HTMLDivElement;
    private shadingContiner: HTMLDivElement;
    private shadingColorPicker: ColorPicker;
    private ulelementShading: DropDownList;
    private borderWidth: NumericTextBox;
    private isShadingChanged: boolean = false;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private getModuleName(): string {
        return 'BordersAndShadingDialog';
    }

    /**
     * @private
     * @param {L10n} localeValue - Specifies the locale.
     * @param {boolean} isRtl - Specifies is rtl.
     * @returns {void}
     */
    public initBordersAndShadingsDialog(localeValue: L10n, isRtl?: boolean): void {
        this.target = createElement('div', {
            id: this.documentHelper.owner.containerId + '_table_border_shadings',
            className: 'e-de-table-border-shading-dlg'
        });
        const displayText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Borders'), styles: 'position: absolute;top: 65px;',
            id: this.target.id + '_border_label', className: 'e-de-table-border-heading'
        });
        const settingsContiner: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline-block;position: absolute;top: 105px;width: 100px;height: 235px;border-style: none;',
            id: this.target.id + '_border_settings'
        });
        let styleContainerPosition: string;
        if (isRtl) {
            styleContainerPosition = 'left: 148px;';
        } else {
            styleContainerPosition = 'left: 125px;';
        }
        const styleContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline-block;position: absolute;' + styleContainerPosition + 'top: 125px;width: 150px;height: 235px;padding-left: 40px;border-style: none;padding-right: 40px;',
            id: this.target.id + '_border_style'
        });
        let previewContinerPosition: string;
        if (isRtl) {
            previewContinerPosition = 'right: 342px;';
        } else {
            previewContinerPosition = 'left: 339px;';
        }
        const previewContiner: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'display: inline-block;position: absolute;' + previewContinerPosition + 'top: 87px;width: 180px;height: 235px;padding: 0px;border-style: none;',
            id: this.target.id + '_border_preview'
        });
        const styleText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Style'), styles: 'width: 100%;padding-bottom: 10px;',
            className: 'e-de-table-element-subheading'
        });
        const dropDownList: HTMLSelectElement = <HTMLSelectElement>createElement('select', {
            id: this.target.id + '_border_style_dropDown'
        });
        dropDownList.innerHTML = '<option>' + 'None' + '</option><option>'
            + 'Single' + '</option><option>' + 'Dot' + '</option><option>'
            + 'DashSmallGap' + '</option><option>' + 'DashLargeGap' + '</option><option>'
            + 'DashDot' + '</option><option>' + 'DashDotDot' + '</option><option>'
            + 'Double' + '</option><option>' + 'Triple' + '</option><option>'
            + 'ThinThickSmallGap' + '</option><option>'
            + 'ThickThinSmallGap' + '</option><option>' + 'ThinThickThinSmallGap'
            + '</option><option>' + 'ThinThickMediumGap' + '</option><option>'
            + 'ThickThinMediumGap' + '</option><option>' + 'ThinThickThinMediumGap'
            + '</option><option>' + 'ThinThickLargeGap' + '</option><option>'
            + 'ThickThinLargeGap' + '</option><option>' + 'ThinThickThinLargeGap'
            + '</option><option>' + 'SingleWavy' + '</option><option>'
            + 'DoubleWavy' + '</option><option>' + 'DashDotStroked'
            + '</option><option>' + 'Emboss3D' + '</option><option>' + 'Engrave3D'
            + '</option><option>' + 'Outset' + '</option><option>'
            + 'Inset' + '</option><option>' + 'Thick' + '</option>';
        const widthText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Width'), styles: 'width:100%;padding-top: 20px;padding-bottom: 10px;',
            className: 'e-de-table-element-subheading'
        });
        const widthNumeric: HTMLInputElement = <HTMLInputElement>createElement('input', {
            id: this.target.id + '_width'
        });
        const colorText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Color'), styles: 'padding-top: 25px;',
            className: 'e-de-table-setting-heading'
        });
        const borderColorPickerElement: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'color' },
            id: this.target.id + '_border_color',
            styles: 'width: 30px;position: absolute;left: 90px;',
            className: 'e-dlg-clr-pkr-top'
        });
        const settingText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Setting'), styles: 'width: 100%;position: absolute;',
            className: 'e-de-table-setting-heading'
        });
        const noneDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_None_Div_Container', className: 'e-de-table-border-none'
        });
        let divLabelPadding: string;
        if (isRtl) {
            divLabelPadding = 'padding-right:10px;';
        } else {
            divLabelPadding = 'padding-left:10px;';
        }
        this.noneDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_None_Div',
            className: 'e-de-table-border-inside-setting e-de-table-border-setting-genral'
        });
        const noneDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('None'), className: 'e-de-table-setting-labels-heading',
            styles: divLabelPadding + 'top: 20px;position: absolute;',
            id: this.target.id + '_None_Div_Label'
        });
        const boxDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Box_Div_Container', className: 'e-de-table-border-box'
        });
        this.boxDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Box_Div',
            className: 'e-de-table-border-inside-setting e-de-table-border-setting-genral'
        });
        const boxDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('Box'), className: 'e-de-table-setting-labels-heading',
            styles: divLabelPadding + 'top: 20px;position: absolute;',
            id: this.target.id + '_Box_Div_Label'
        });
        const allDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_All_Div_Container', className: 'e-de-table-border-all'
        });
        this.allDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_All_Div',
            className: 'e-de-table-border-inside-setting e-de-table-border-setting-genral'
        });
        const allDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('All'), className: 'e-de-table-setting-labels-heading',
            styles: divLabelPadding + 'top: 25px;position: absolute;',
            id: this.target.id + '_All_Div_Label'
        });
        const customDivContainer: HTMLDivElement = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Custom_Div_Container', className: 'e-de-table-border-custom'
        });
        this.customDiv = <HTMLDivElement>createElement('div', {
            id: this.target.id + '_Custom_Div',
            className: 'e-de-table-border-inside-setting e-de-table-border-setting-genral'
        });
        const customDivLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
            innerHTML: localeValue.getConstant('Custom'), className: 'e-de-table-setting-labels-heading',
            styles: divLabelPadding + 'top: 25px;position: absolute;',
            id: this.target.id + '_Custom_Div_Label'
        });
        this.noneDivTransparent = createElement('div', {
            id: this.target.id + '_None_Div_Transparent', className: 'e-icons e-de-table-border-setting e-de-table-border-none-setting'
        }) as HTMLDivElement;
        this.boxDivTransparent = createElement('div', {
            id: this.target.id + '_Box_Div_Transparent', className: 'e-icons e-de-table-border-setting e-de-table-border-box-setting'
        }) as HTMLDivElement;
        this.allDivTransparent = createElement('div', {
            id: this.target.id + '_All_Div_Transparent', className: 'e-icons e-de-table-border-setting e-de-table-border-all-setting'
        }) as HTMLDivElement;
        this.customDivTransparent = createElement('div', {
            id: this.target.id + '_Custom_Div_Transparent', className: 'e-icons e-de-table-border-setting e-de-table-border-custom-setting'
        }) as HTMLDivElement;
        if (isRtl) {
            this.noneDivTransparent.classList.add('e-de-rtl');
            this.boxDivTransparent.classList.add('e-de-rtl');
            this.allDivTransparent.classList.add('e-de-rtl');
            this.customDivTransparent.classList.add('e-de-rtl');
        }
        let previewTextPosition: string;
        if (isRtl) {
            previewTextPosition = 'margin-right: 10px;';
        } else {
            previewTextPosition = 'margin-left: 10px;';
        }
        const previewText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Preview'), className: 'e-de-table-setting-heading',
            styles: 'position: absolute;top: 20px;' + previewTextPosition
        });
        this.previewDiv = createElement('div', {
            styles: 'width: 80px;height: 80px;position: absolute; left: 50px;top: 50px;',
            id: this.target.id + '_Preview_Div', className: 'e-de-border-dlg-preview-div'
        }) as HTMLDivElement;
        this.previewRightDiagonalDiv = createElement('div', {
            styles: 'position: absolute;width:1px;height:113px;left: 90px;top: 34px;transform: rotate(135deg);',
            id: this.target.id + '_Preview_Div_Right_Diagonal',
            className: 'e-de-border-dlg-preview-inside-divs'
        }) as HTMLDivElement;
        this.previewLeftDiagonalDiv = createElement('div', {
            styles: 'position: absolute;width: 1px;height: 113px;left: 90px;top: 34px;transform:rotate(45deg);',
            id: this.target.id + '_Preview_Div_Left_Diagonal',
            className: 'e-de-border-dlg-preview-inside-divs'
        }) as HTMLDivElement;
        this.previewVerticalDiv = createElement('div', {
            styles: 'width: 1px;height: 81px;position: absolute;left: 90px;top: 50px;',
            id: this.target.id + '_Preview_Div_Vertical',
            className: 'e-de-border-dlg-preview-inside-divs'
        }) as HTMLDivElement;
        this.previewHorizontalDiv = createElement('div', {
            styles: 'width: 81px;height: 1px;position: absolute;left: 50px;top: 90px;',
            id: this.target.id + '_Preview_Div_Horizontal',
            className: 'e-de-border-dlg-preview-inside-divs'
        }) as HTMLDivElement;
        let previewDivTopPosition: string;
        if (isRtl) {
            previewDivTopPosition = 'right: 10px;';
        } else {
            previewDivTopPosition = 'left: 10px;';
        }
        this.previewDivTopTopContainer = createElement('div', {
            styles: 'top: 50px;position: absolute;' + previewDivTopPosition, id: this.target.id + '_Preview_Div_TopTop_Container'
        }) as HTMLDivElement;
        this.previewDivTopTop = createElement('div', {
            id: this.target.id + '_Preview_Div_TopTop',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivTopCenterContainer = createElement('div', {
            styles: 'top: 80px;position: absolute;' + previewDivTopPosition, id: this.target.id + '_Preview_Div_TopCenter_Container'
        }) as HTMLDivElement;
        this.previewDivTopCenter = createElement('div', {
            id: this.target.id + '_Preview_Div_TopCenter',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivTopBottomContainer = createElement('div', {
            styles: 'top: 110px;position: absolute;' + previewDivTopPosition, id: this.target.id + '_Preview_Div_TopBottom_Container'
        }) as HTMLDivElement;
        this.previewDivTopBottom = createElement('div', {
            id: this.target.id + '_Preview_Div_TopBottom',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivLeftDiagonalContainer = createElement('div', {
            styles: 'top: 145px;position: absolute;left: 10px;', id: this.target.id + '_Preview_Div_LeftDiagonal_Container'
        }) as HTMLDivElement;
        this.previewDivLeftDiagonal = createElement('div', {
            id: this.target.id + '_Preview_Div_LeftDiagonal',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        let previewDivBottomLeftPosition: string;
        let previewDivBottomCenterPosition: string;
        let previewDivBottomRightPosition: string;
        if (isRtl) {
            previewDivBottomLeftPosition = 'left: 104px';
            previewDivBottomCenterPosition = 'left: 74px';
            previewDivBottomRightPosition = 'left: 44px';
        } else {
            previewDivBottomLeftPosition = 'left: 50px;';
            previewDivBottomCenterPosition = 'left : 80px;';
            previewDivBottomRightPosition = 'left : 110px';
        }
        this.previewDivBottomLeftContainer = createElement('div', {
            styles: 'top: 145px;position: absolute;' + previewDivBottomLeftPosition,
            id: this.target.id + '_Preview_Div_BottomLeft_Container'
        }) as HTMLDivElement;
        this.previewDivBottomLeft = createElement('div', {
            id: this.target.id + '_Preview_Div_BottomLeft',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivBottomcenterContainer = createElement('div', {
            styles: 'top: 145px;position: absolute;' + previewDivBottomCenterPosition,
            id: this.target.id + '_Preview_Div_BottomCenter_Container'
        }) as HTMLDivElement;
        this.previewDivBottomcenter = createElement('div', {
            id: this.target.id + '_Preview_Div_BottomCenter',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivBottomRightContainer = createElement('div', {
            styles: 'top: 145px;position: absolute;' + previewDivBottomRightPosition,
            id: this.target.id + '_Preview_Div_BottomRight_Container'
        }) as HTMLDivElement;
        this.previewDivBottomRight = createElement('div', {
            id: this.target.id + '_Preview_Div_BottomRight',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivDiagonalRightContainer = createElement('div', {
            styles: 'top: 145px; position: absolute; left: 110px;', id: this.target.id + '_Preview_Div_RightDiagonal_Container'
        }) as HTMLDivElement;
        this.previewDivDiagonalRight = createElement('div', {
            id: this.target.id + '_Preview_Div_RightDiagonal',
            className: 'e-de-table-border-inside-preview e-de-table-border-preview-genral'
        }) as HTMLDivElement;
        this.previewDivTopTopTransParent = createElement('div', {
            id: this.target.id + '_previewDivTopTopTransParent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-toptop-alignment'
        }) as HTMLDivElement;
        this.previewDivTopCenterTransParent = createElement('div', {
            id: this.target.id + '_previewDivTopCenterTransParent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-topcenter-alignment'
        }) as HTMLDivElement;
        this.previewDivTopBottomTransParent = createElement('div', {
            id: this.target.id + '_previewDivTopBottomTransParent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-topbottom-alignment'
        }) as HTMLDivElement;
        this.previewDivLeftDiagonalTransParent = createElement('div', {
            id: this.target.id + '_previewDivLeftDiagonalTransParent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-diagionalup-alignment'
        }) as HTMLDivElement;
        this.previewDivBottomLeftTransparent = createElement('div', {
            id: this.target.id + '_previewDivBottomLeftTransparent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-bottomleft-alignment'
        }) as HTMLDivElement;
        this.previewDivBottomcenterTransparent = createElement('div', {
            id: this.target.id + '_previewDivBottomcenterTransparent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-bottomcenter-alignment'
        }) as HTMLDivElement;
        this.previewDivBottomRightTransparent = createElement('div', {
            id: this.target.id + '_previewDivBottomRightTransparent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-bottomright-alignment'
        }) as HTMLDivElement;
        this.previewDivDiagonalRightTransparent = createElement('div', {
            id: this.target.id + '_previewDivDiagonalRightTransparent',
            className: 'e-icons e-de-table-border-preview e-de-table-border-diagionaldown-alignment'
        }) as HTMLDivElement;
        let shadingContainerPosition: string;
        if (isRtl) {
            shadingContainerPosition = 'left:60px;';
        } else {
            shadingContainerPosition = 'left:17px;';
        }
        this.shadingContiner = createElement('div', {
            /* eslint-disable max-len */
            styles: 'display:inline-block;position:absolute;' + shadingContainerPosition + ';width:400px;height:100px;padding:0px;border-style: none;margin-left:10px;',
            id: this.target.id + '_shading_preview', className: 'e-de-table-shading-preview'
        }) as HTMLDivElement;
        const shadingText: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Shading'), className: 'e-de-table-border-heading',
            styles: 'padding-top: 30px;left: 5px;'
        });
        const shadings: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'display:flex;' });
        const label: HTMLDivElement = <HTMLDivElement>createElement('div', {
            innerHTML: localeValue.getConstant('Fill'), className: 'e-de-table-setting-heading e-de-table-border-fill',
            styles: 'top: 50px;left: 10px;'
        });
        const shadingColorPickerElement: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'color' },
            id: this.target.id + '_shading_color', styles: 'position: absolute;top: 75px;left: 40px;width: 30px;'
        });
        let shdApplyPosition: string;
        if (isRtl) {
            shdApplyPosition = 'left: 75px;';
        } else {
            shdApplyPosition = 'left: 150px;';
        }
        const shdApply: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'position:absolute;top:44px;' + shdApplyPosition + 'width:180px;'
        });
        const div: HTMLDivElement = <HTMLDivElement>createElement('div', {
            styles: 'width:100px;padding-bottom: 10px;', innerHTML: localeValue.getConstant('Apply To'),
            className: 'e-de-table-element-subheading'
        });
        const divsion: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width:100px;position:absolute;' });
        const ulelementShading: HTMLSelectElement = <HTMLSelectElement>createElement('select', {
            innerHTML: '<option value="Cell">' + localeValue.getConstant('Cell') + '</option>'
                + '<option value="Table">' + localeValue.getConstant('Table') + '</option>',
            id: this.target.id + '_shading'
        });
        divsion.appendChild(ulelementShading);

        this.noneDiv.appendChild(this.noneDivTransparent);
        this.boxDiv.appendChild(this.boxDivTransparent);
        this.allDiv.appendChild(this.allDivTransparent);
        this.customDiv.appendChild(this.customDivTransparent);
        noneDivContainer.appendChild(this.noneDiv);
        noneDivContainer.appendChild(noneDivLabel);
        boxDivContainer.appendChild(this.boxDiv);
        boxDivContainer.appendChild(boxDivLabel);
        allDivContainer.appendChild(this.allDiv);
        allDivContainer.appendChild(allDivLabel);
        customDivContainer.appendChild(this.customDiv);
        customDivContainer.appendChild(customDivLabel);

        settingsContiner.appendChild(settingText);
        settingsContiner.appendChild(noneDivContainer);
        settingsContiner.appendChild(boxDivContainer);
        settingsContiner.appendChild(allDivContainer);
        settingsContiner.appendChild(customDivContainer);

        this.previewDivBottomcenter.appendChild(this.previewDivBottomcenterTransparent);
        this.previewDivBottomRight.appendChild(this.previewDivBottomRightTransparent);
        this.previewDivBottomLeft.appendChild(this.previewDivBottomLeftTransparent);
        this.previewDivTopTop.appendChild(this.previewDivTopTopTransParent);
        this.previewDivTopCenter.appendChild(this.previewDivTopCenterTransParent);
        this.previewDivTopBottom.appendChild(this.previewDivTopBottomTransParent);
        this.previewDivDiagonalRight.appendChild(this.previewDivDiagonalRightTransparent);
        this.previewDivLeftDiagonal.appendChild(this.previewDivLeftDiagonalTransParent);

        this.previewDivBottomcenterContainer.appendChild(this.previewDivBottomcenter);
        this.previewDivBottomLeftContainer.appendChild(this.previewDivBottomLeft);
        this.previewDivBottomRightContainer.appendChild(this.previewDivBottomRight);
        this.previewDivDiagonalRightContainer.appendChild(this.previewDivDiagonalRight);
        this.previewDivLeftDiagonalContainer.appendChild(this.previewDivLeftDiagonal);
        this.previewDivTopBottomContainer.appendChild(this.previewDivTopBottom);
        this.previewDivTopCenterContainer.appendChild(this.previewDivTopCenter);
        this.previewDivTopTopContainer.appendChild(this.previewDivTopTop);

        previewContiner.appendChild(previewText);
        previewContiner.appendChild(this.previewDiv);
        previewContiner.appendChild(this.previewRightDiagonalDiv);
        previewContiner.appendChild(this.previewHorizontalDiv);
        previewContiner.appendChild(this.previewLeftDiagonalDiv);
        previewContiner.appendChild(this.previewVerticalDiv);
        previewContiner.appendChild(this.previewDivBottomcenterContainer);
        previewContiner.appendChild(this.previewDivBottomLeftContainer);
        previewContiner.appendChild(this.previewDivBottomRightContainer);
        previewContiner.appendChild(this.previewDivDiagonalRightContainer);
        previewContiner.appendChild(this.previewDivLeftDiagonalContainer);
        previewContiner.appendChild(this.previewDivTopBottomContainer);
        previewContiner.appendChild(this.previewDivTopCenterContainer);
        previewContiner.appendChild(this.previewDivTopTopContainer);

        shdApply.appendChild(div);
        shdApply.appendChild(divsion);
        shadings.appendChild(label);
        shadings.appendChild(shadingColorPickerElement);
        shadings.appendChild(shdApply);

        this.shadingContiner.appendChild(shadingText);
        this.shadingContiner.appendChild(shadings);


        styleContainer.appendChild(styleText);
        styleContainer.appendChild(dropDownList);
        styleContainer.appendChild(widthText);
        styleContainer.appendChild(widthNumeric);
        styleContainer.appendChild(colorText);
        styleContainer.appendChild(borderColorPickerElement);

        this.target.appendChild(displayText);
        this.target.appendChild(settingsContiner);
        this.target.appendChild(styleContainer);
        this.target.appendChild(previewContiner);
        this.target.appendChild(this.shadingContiner);

        // Handling Setting Container
        noneDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        boxDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        allDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);
        customDivContainer.addEventListener('click', this.handleSettingCheckBoxAction);

        // Handling Preview Div Container
        this.previewDivBottomcenterContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivBottomLeftContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivBottomRightContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivTopTopContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivTopBottomContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivTopCenterContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivDiagonalRightContainer.addEventListener('click', this.handlePreviewCheckBoxAction);
        this.previewDivLeftDiagonalContainer.addEventListener('click', this.handlePreviewCheckBoxAction);

        // handling dropdown change
        this.borderWidth = new NumericTextBox({
            value: 0, min: 0, max: 6, decimals: 2,
            width: 150, enablePersistence: false
        });
        this.borderWidth.appendTo(widthNumeric);
        this.borderStyle = new DropDownList({
            width: '150px', popupHeight: '150px', index: 1,
            enableRtl: isRtl
        });
        this.borderStyle.appendTo(dropDownList);
        this.ulelementShading = new DropDownList({
            width: '150px', change: this.applyTableCellPreviewBoxes, index: 1,
            enableRtl: isRtl
        });
        this.ulelementShading.appendTo(ulelementShading);
        this.borderColorPicker = new ColorPicker({
            value: '#000000', change: this.applyPreviewTableBorderColor,
            enableRtl: isRtl, locale: this.documentHelper.owner.locale, cssClass: 'e-de-dlg-clr-picker'
        });
        this.borderColorPicker.appendTo(borderColorPickerElement);
        this.shadingColorPicker = new ColorPicker({
            value: '#FFFFFF', change: this.applyPreviewTableBackgroundColor,
            enableRtl: isRtl, locale: this.documentHelper.owner.locale, cssClass: 'e-de-dlg-clr-picker'
        });
        this.shadingColorPicker.appendTo(shadingColorPickerElement);
        if (isRtl) {
            label.classList.add('e-de-rtl');
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private applyBordersShadingsProperties = (): void => {
        const tablePropertiesDialog: TablePropertiesDialog = this.documentHelper.owner.tablePropertiesDialogModule;
        const selectedCell: TableCellWidget = this.documentHelper.selection.start.paragraph.associatedCell;
        //Need to bind the properties with current cell and current table formats.
        let borders: WBorders = undefined;
        if (this.checkClassName(this.previewDivTopTop) || this.checkClassName(this.previewDivTopBottom)
            || this.checkClassName(this.previewDivTopCenter) || this.checkClassName(this.previewDivBottomcenter)
            || this.checkClassName(this.previewDivBottomLeft) || this.checkClassName(this.previewDivBottomRight)
            || this.checkClassName(this.previewDivDiagonalRight) || this.checkClassName(this.previewDivLeftDiagonal)) {
            borders = new WBorders();
            if (this.checkClassName(this.previewDivTopTop)) {
                borders.top = this.getBorder();
            }
            if (this.checkClassName(this.previewDivTopBottom)) {
                borders.bottom = this.getBorder();
            }
            if (this.checkClassName(this.previewDivBottomLeft)) {
                borders.left = this.getBorder();
            }
            if (this.checkClassName(this.previewDivBottomRight)) {
                borders.right = this.getBorder();
            }
            if (this.checkClassName(this.previewDivTopCenter)) {
                borders.horizontal = this.getBorder();
            }
            if (this.checkClassName(this.previewDivBottomcenter)) {
                borders.vertical = this.getBorder();
            }
            if (this.checkClassName(this.previewDivLeftDiagonal)) {
                borders.diagonalDown = this.getBorder();
            }
            if (this.checkClassName(this.previewDivDiagonalRight)) {
                borders.diagonalUp = this.getBorder();
            }
        }
        const shading: WShading = new WShading();
        const editorModule: Editor = this.documentHelper.owner.editorModule;
        shading.backgroundColor = this.shadingColorPicker.value;
        if (this.ulelementShading.index === 0) {
            this.applyTo = 0;
            if (tablePropertiesDialog) {
                tablePropertiesDialog.isCellBordersAndShadingUpdated = true;
            }
            this.cellFormat.borders = new WBorders();
            if (!isNullOrUndefined(borders)) {
                editorModule.applyBordersInternal(this.cellFormat.borders, borders);
            } else if (this.noneDiv.classList.contains('e-de-table-border-inside-setting-click')) {
                editorModule.applyBordersInternal(this.cellFormat.borders, new WBorders());
            }
            // Once option has been added for texture and foreground, need to handle this similar to Shading Fill.
            if (!isNullOrUndefined(selectedCell.cellFormat.shading)) {
                shading.foregroundColor = selectedCell.cellFormat.shading.foregroundColor;
                shading.textureStyle = selectedCell.cellFormat.shading.textureStyle;
            }
            this.cellFormat.shading = new WShading();
            editorModule.applyShading(this.cellFormat.shading, shading);
        } else {
            if (tablePropertiesDialog) {
                tablePropertiesDialog.isTableBordersAndShadingUpdated = true;
            }
            this.applyTo = 1;
            const currentTableFormat: WTableFormat = this.documentHelper.owner.selection.tableFormat.table.tableFormat;
            this.tableFormat.copyFormat(currentTableFormat);
            this.tableFormat.borders = new WBorders();
            if (!isNullOrUndefined(borders)) {
                editorModule.applyBordersInternal(this.tableFormat.borders, borders);
            } else if (this.noneDiv.classList.contains('e-de-table-border-inside-setting-click')) {
                editorModule.applyBordersInternal(this.tableFormat.borders, new WBorders());
            }
            // Once option has been added for texture and foreground, need to handle this similar to Shading Fill.
            if (!isNullOrUndefined(currentTableFormat.shading)) {
                shading.foregroundColor = currentTableFormat.shading.foregroundColor;
                shading.textureStyle = currentTableFormat.shading.textureStyle;
            }
            this.tableFormat.shading = new WShading();
            this.isShadingChanged = currentTableFormat.shading.backgroundColor !== shading.backgroundColor;
            editorModule.applyShading(this.tableFormat.shading, shading);
        }
        this.applyFormat();
        this.closeDialog();
    };
    private applyFormat(): void {
        // const selection: Selection = this.documentHelper.selection;
        const editorModule: Editor = this.documentHelper.owner.editorModule;
        editorModule.initComplexHistory('BordersAndShading');
        editorModule.isBordersAndShadingDialog = true;
        if (this.applyTo === 0) {
            editorModule.onCellFormat(this.cellFormat);
        } else {
            editorModule.onTableFormat(this.tableFormat, this.isShadingChanged);
        }
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistory.currentHistoryInfo)) {
            this.documentHelper.owner.editorHistory.updateComplexHistory();
        }
        editorModule.isBordersAndShadingDialog = false;
    }
    private getBorder(): WBorder {
        const border: WBorder = new WBorder();
        border.color = this.borderColorPicker.value;
        border.lineStyle = <LineStyle>this.borderStyle.text;
        border.lineWidth = this.borderWidth.value;
        return border;
    }
    private checkClassName(element: HTMLDivElement): boolean {
        return element.classList.contains('e-de-table-border-inside-preview-click');
    }
    /**
     * @private
     * @returns {void}
     */
    public closeDialog = (): void => {
        this.documentHelper.dialog.hide();
        this.closeBordersShadingsDialog();
    };
    /**
     * @private
     * @returns {void}
     */
    private closeBordersShadingsDialog = (): void => {
        this.documentHelper.dialog2.element.style.pointerEvents = '';
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localeValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localeValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initBordersAndShadingsDialog(localeValue, this.documentHelper.owner.enableRtl);
        }
        this.loadBordersShadingsPropertiesDialog();
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.header = localeValue.getConstant('Borders and Shading');
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.closeBordersShadingsDialog;
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.buttons = [{
            click: this.applyBordersShadingsProperties,
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
        const tableBorderDialogId: string = this.target.id;
        // let targetDiv: HTMLDivElement;
        if (targetId === tableBorderDialogId + '_None_Div' || targetId === tableBorderDialogId + '_None_Div_Container'
            || targetId === tableBorderDialogId + '_None_Div_Transparent') {
            this.updateClassForSettingDivElements();
            this.noneDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('none');
        } else if (targetId === tableBorderDialogId + '_Box_Div' || targetId === tableBorderDialogId + '_Box_Div_Container'
            || targetId === tableBorderDialogId + '_Box_Div_Transparent') {
            this.updateClassForSettingDivElements();
            this.boxDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('box');
        } else if (targetId === tableBorderDialogId + '_All_Div' || targetId === tableBorderDialogId + '_All_Div_Container'
            || targetId === tableBorderDialogId + '_All_Div_Transparent') {
            this.updateClassForSettingDivElements();
            this.allDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('all');
        } else {
            this.updateClassForSettingDivElements();
            this.customDiv.classList.add('e-de-table-border-inside-setting-click');
            this.setSettingPreviewDivElement('customDiv');
        }
    };
    private updateClassForSettingDivElements(): void {
        const settingDivs: HTMLCollectionOf<Element> = this.target.getElementsByClassName('e-de-table-border-inside-setting');
        for (let j: number = 0; j < settingDivs.length; j++) {
            if (settingDivs[j].className.indexOf('e-de-table-border-inside-setting-click') !== -1) {
                let tempClassName: string = settingDivs[j].className;
                tempClassName = tempClassName.replace('e-de-table-border-inside-setting-click', '');
                settingDivs[j].className = tempClassName;
            }
        }
    }
    private setSettingPreviewDivElement(position: string): void {
        switch (position) {
        case 'none':
            this.previewDivTopTop.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivTopCenter.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivTopBottom.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivLeftDiagonal.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivDiagonalRight.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivBottomRight.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivBottomLeft.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivBottomcenter.classList.remove('e-de-table-border-inside-preview-click');
            this.isShowHidePreviewTableElements('none');
            break;
        case 'box':
            this.previewDivTopCenter.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivLeftDiagonal.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivDiagonalRight.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivBottomcenter.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivTopTop.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivTopBottom.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivBottomRight.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivBottomLeft.classList.add('e-de-table-border-inside-preview-click');
            this.isShowHidePreviewTableElements('box');
            break;
        case 'all':
            this.previewDivLeftDiagonal.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivDiagonalRight.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivBottomcenter.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivTopTop.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivTopBottom.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivBottomRight.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivBottomLeft.classList.add('e-de-table-border-inside-preview-click');
            this.previewDivTopCenter.classList.add('e-de-table-border-inside-preview-click');
            this.isShowHidePreviewTableElements('all');
            break;
        }
    }
    private isShowHidePreviewTableElements(settingDiv: string): void {
        switch (settingDiv) {
        case 'none':
            this.previewDiv.style.border = 'none';
            this.previewRightDiagonalDiv.style.display = 'none';
            this.previewLeftDiagonalDiv.style.display = 'none';
            this.previewHorizontalDiv.style.display = 'none';
            this.previewVerticalDiv.style.display = 'none';
            break;
        case 'box':
            this.previewDiv.style.border = '1px solid rgba(0, 0, 0, .54)';
            this.previewRightDiagonalDiv.style.display = 'none';
            this.previewLeftDiagonalDiv.style.display = 'none';
            this.previewHorizontalDiv.style.display = 'none';
            this.previewVerticalDiv.style.display = 'none';
            break;
        case 'all':
            this.previewDiv.style.border = '1px solid rgba(0, 0, 0, .54)';
            this.previewRightDiagonalDiv.style.display = 'none';
            this.previewLeftDiagonalDiv.style.display = 'none';
            this.previewHorizontalDiv.style.display = 'block';
            this.previewVerticalDiv.style.display = 'block';
            break;
        }
    }
    /**
     * @private
     * @param {Event} event - Specifies the event args.
     * @returns {void}
     */
    private handlePreviewCheckBoxAction = (event: Event): void => {
        const target: HTMLElement = event.target as HTMLElement;
        const targetId: string = target.id;
        // const tableBorderDialog: HTMLElement = this.target;
        const tableBorderDialogId: string = this.target.id;
        const compareClass: string = 'e-de-table-border-inside-preview-click';
        this.customDiv.click();
        if (targetId === tableBorderDialogId + '_Preview_Div_TopTop_Container' || targetId === tableBorderDialogId + '_Preview_Div_TopTop'
            || targetId === tableBorderDialogId + '_previewDivTopTopTransParent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivTopTop);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div', '_Preview_Div_TopTop', 'TopTop');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_TopCenter_Container'
            || targetId === tableBorderDialogId + '_Preview_Div_TopCenter'
            || targetId === tableBorderDialogId + '_previewDivTopCenterTransParent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivTopCenter);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div_Horizontal', '_Preview_Div_TopCenter', 'TopCenter');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_TopBottom_Container' || targetId === tableBorderDialogId + '_Preview_Div_TopBottom'
            || targetId === tableBorderDialogId + '_previewDivTopBottomTransParent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivTopBottom);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div', '_Preview_Div_TopBottom', 'TopBottom');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_LeftDiagonal_Container'
            || targetId === tableBorderDialogId + '_Preview_Div_LeftDiagonal'
            || targetId === tableBorderDialogId + '_previewDivLeftDiagonalTransParent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivLeftDiagonal);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div_Left_Diagonal', '_Preview_Div_LeftDiagonal', 'LeftDiagonal');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_BottomLeft_Container' || targetId === tableBorderDialogId + '_Preview_Div_BottomLeft'
            || targetId === tableBorderDialogId + '_previewDivBottomLeftTransparent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivBottomLeft);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div', '_Preview_Div_BottomLeft', 'BottomLeft');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_BottomCenter_Container'
            || targetId === tableBorderDialogId + '_Preview_Div_BottomCenter'
            || targetId === tableBorderDialogId + '_previewDivBottomcenterTransparent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivBottomcenter);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div_Vertical', '_Preview_Div_BottomCenter', 'BottomCenter');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_BottomRight_Container' || targetId === tableBorderDialogId + '_Preview_Div_BottomRight'
            || targetId === tableBorderDialogId + '_previewDivBottomRightTransparent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivBottomRight);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div', '_Preview_Div_BottomRight', 'BottomRight');
        } else if (targetId === tableBorderDialogId + '_Preview_Div_RightDiagonal_Container'
            || targetId === tableBorderDialogId + '_Preview_Div_RightDiagonal'
            || targetId === tableBorderDialogId + '_previewDivDiagonalRightTransparent') {
            this.handlePreviewCheckBoxShowHide(tableBorderDialogId, compareClass, this.previewDivDiagonalRight);
            this.showHidePreviewDivElements(tableBorderDialogId, compareClass, '_Preview_Div_Right_Diagonal', '_Preview_Div_RightDiagonal', 'RightDiagonal');
        }
    };
    private handlePreviewCheckBoxShowHide(tableBorderDialogId: string, compareClass: string, element: HTMLDivElement): void {
        if (element.classList.contains(compareClass)) {
            element.classList.remove(compareClass);
        } else {
            element.classList.add(compareClass);
        }
    }

    private showHidePreviewDivElements(tableBorderDialogId: string, compareClass: string, elementClass: string, compareElementClass: string, position: string): void {
        const setElement: HTMLDivElement = document.getElementById(tableBorderDialogId + elementClass) as HTMLDivElement;
        const compareElement: HTMLDivElement = document.getElementById(tableBorderDialogId + compareElementClass) as HTMLDivElement;
        if (position === 'TopTop') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'border-top');
        } else if (position === 'TopCenter') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'display');
        } else if (position === 'TopBottom') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'border-bottom');
        } else if (position === 'LeftDiagonal') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'display');
        } else if (position === 'BottomLeft') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'border-left');
        } else if (position === 'BottomCenter') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'display');
        } else if (position === 'BottomRight') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'border-right');
        } else if (position === 'RightDiagonal') {
            this.setPropertyPreviewDivElement(setElement, compareElement, compareClass, 'display');
        }
    }

    private setPropertyPreviewDivElement(ele: HTMLDivElement, compareElement: HTMLElement, compareClass: string, property: string): void {
        if (compareElement.classList.contains(compareClass) && property.split('-')[0] === 'border') {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            (ele as any).style[property] = '1px solid rgba(0, 0, 0, .54)';
        } else if (compareElement.classList.contains(compareClass) && property === 'display') {
            (ele as any).style[property] = 'block';
        } else {
            (ele as any).style[property] = 'none';
            /* eslint-enable @typescript-eslint/no-explicit-any */
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private applyTableCellPreviewBoxes = (): void => {
        this.customDiv.click();
        if (!isNullOrUndefined(this.ulelementShading)) {
            if (this.ulelementShading.index === 0) {
                this.previewDivBottomcenterContainer.style.display = 'none';
                this.previewDivTopCenterContainer.style.display = 'none';
                this.previewVerticalDiv.style.display = 'none';
                this.previewHorizontalDiv.style.display = 'none';
                this.previewDivLeftDiagonal.style.display = '';
                this.previewDivDiagonalRight.style.display = '';
                this.previewDivBottomRightContainer.style.left = '80px';
            } else {
                this.previewDivLeftDiagonal.style.display = 'none';
                this.previewDivDiagonalRight.style.display = 'none';
                this.previewDivBottomcenterContainer.style.display = '';
                this.previewDivTopCenterContainer.style.display = '';
                this.previewVerticalDiv.style.display = '';
                this.previewHorizontalDiv.style.display = '';
                this.previewDivBottomRightContainer.style.left = '110px';
            }
        }
    };
    /**
     * @private
     * @param {ColorPickerEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private applyPreviewTableBackgroundColor = (args: ColorPickerEventArgs): void => {
        if (!isNullOrUndefined(args.currentValue)) {
            const color: string = args.currentValue.hex;
            this.previewDiv.style.backgroundColor = color;
        }
    };
    /**
     * @private
     * @param {ColorPickerEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private applyPreviewTableBorderColor = (args: ColorPickerEventArgs): void => {
        if (!isNullOrUndefined(args.currentValue)) {
            const color: string = args.currentValue.hex;
            this.previewDiv.style.borderColor = color;
            this.previewRightDiagonalDiv.style.backgroundColor = color;
            this.previewLeftDiagonalDiv.style.backgroundColor = color;
            this.previewVerticalDiv.style.backgroundColor = color;
            this.previewHorizontalDiv.style.backgroundColor = color;
        }
    };
    private loadBordersShadingsPropertiesDialog(): void {
        const tableFormat: WTableFormat = this.documentHelper.selection.tableFormat.table.tableFormat;
        let lineStyle: number;
        let borderColor: string;
        let fillColor: string;
        let borderWidth: number;
        if (!isNullOrUndefined(tableFormat) && !isNullOrUndefined(tableFormat.borders)) {
            this.cloneBorders(tableFormat.borders);
            if (isNullOrUndefined(tableFormat.borders) || isNullOrUndefined(tableFormat.borders.top)) {
                lineStyle = 1;
                borderColor = '#000000';
                borderWidth = 0;
                fillColor = '#000000';
            } else {
                lineStyle = this.getLineStyle(tableFormat.borders.top.lineStyle);
                borderColor = tableFormat.borders.top.color;
                borderWidth = tableFormat.borders.top.getLineWidth();
                fillColor = tableFormat.shading.backgroundColor;
            }
        }
        this.borderColorPicker.value = borderColor;
        this.shadingColorPicker.value = fillColor;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const colorPickerEvent: any = {
            target: this.borderColorPicker, ctrlKey: false,
            shiftKey: false, which: 0
        };
        const fillColorEvent: any = {
            target: this.shadingColorPicker, ctrlKey: false,
            shiftKey: false, which: 0
        };
        /* eslint-enable @typescript-eslint/no-explicit-any */
        this.applyPreviewTableBackgroundColor(fillColorEvent);
        this.applyPreviewTableBorderColor(colorPickerEvent);
        this.ulelementShading.index = 1;
        this.previewDivLeftDiagonal.style.display = 'none';
        this.previewDivDiagonalRight.style.display = 'none';
        this.borderWidth.value = borderWidth;
        this.borderStyle.index = lineStyle;
    }

    /* eslint-disable  */
    private cloneBorders(borders: WBorders): void {
        let topBorder: boolean = false;
        let bottomBorder: boolean = false;
        let leftBorder: boolean = false;
        let rightBorder: boolean = false;
        let horizontalBorder: boolean = false;
        let verticalBorder: boolean = false;
        let diagonalDownBorder: boolean = false;
        let customBorder: boolean = false;
        let diagonalUpBorder: boolean = false;
        if (borders !== null) {
            if (borders.top && (borders.top.hasNoneStyle || borders.top.lineStyle !== 'None')) {
                topBorder = true;
            }
            if (borders.bottom && (borders.bottom.hasNoneStyle || borders.bottom.lineStyle !== 'None')) {
                bottomBorder = true;
            }
            if (borders.left && (borders.left.hasNoneStyle || borders.left.lineStyle !== 'None')) {
                leftBorder = true;
            }
            if (borders.right && (borders.right.hasNoneStyle || borders.right.lineStyle !== 'None')) {
                rightBorder = true;
            }
            if (borders.horizontal && (borders.horizontal.hasNoneStyle || borders.horizontal.lineStyle !== 'None')) {
                horizontalBorder = true;
            }
            if (borders.vertical && (borders.vertical.hasNoneStyle || borders.vertical.lineStyle !== 'None')) {
                verticalBorder = true;
            }
            if (borders.diagonalDown && (borders.diagonalDown.hasNoneStyle || borders.diagonalDown.lineStyle !== 'None')) {
                diagonalDownBorder = true;
            }
            if (borders.diagonalUp && (borders.diagonalUp.hasNoneStyle || borders.diagonalUp.lineStyle !== 'None')) {
                diagonalUpBorder = true;
            }


            if (!(!topBorder || !bottomBorder || !leftBorder || !rightBorder)) {
                if (!(!topBorder || !bottomBorder || !leftBorder || !rightBorder || !horizontalBorder
                    || !verticalBorder || diagonalUpBorder || diagonalDownBorder)) {
                    if ((topBorder && bottomBorder && leftBorder && rightBorder && horizontalBorder && verticalBorder
                        && !diagonalUpBorder && !diagonalDownBorder)) {
                        if (borders.top.hasNoneStyle && borders.bottom.hasNoneStyle && borders.left.hasNoneStyle
                            && borders.right.hasNoneStyle && borders.horizontal.hasNoneStyle && borders.vertical.hasNoneStyle) {
                            this.setSettingPreviewDivElement('none');
                            this.customDiv.classList.remove('e-de-table-border-inside-setting-click');
                            this.noneDiv.classList.add('e-de-table-border-inside-setting-click');
                            this.boxDiv.classList.remove('e-de-table-border-inside-setting-click');
                            this.allDiv.classList.remove('e-de-table-border-inside-setting-click');
                        } else {
                            this.setSettingPreviewDivElement('all');
                            this.allDiv.classList.add('e-de-table-border-inside-setting-click');
                            this.customDiv.classList.remove('e-de-table-border-inside-setting-click');
                            this.noneDiv.classList.remove('e-de-table-border-inside-setting-click');
                            this.boxDiv.classList.remove('e-de-table-border-inside-setting-click');
                        }
                    }
                } else if ((leftBorder && bottomBorder && topBorder && rightBorder && !horizontalBorder && !verticalBorder)) {
                    if (borders.top.hasNoneStyle && borders.bottom.hasNoneStyle && borders.left.hasNoneStyle
                        && borders.right.hasNoneStyle && borders.horizontal.hasNoneStyle && borders.vertical.hasNoneStyle) {
                        this.setSettingPreviewDivElement('none');
                        this.boxDiv.classList.remove('e-de-table-border-inside-setting-click');
                        this.allDiv.classList.remove('e-de-table-border-inside-setting-click');
                        this.customDiv.classList.remove('e-de-table-border-inside-setting-click');
                        this.noneDiv.classList.add('e-de-table-border-inside-setting-click');
                    } else {
                        this.setSettingPreviewDivElement('box');
                        this.customDiv.classList.remove('e-de-table-border-inside-setting-click');
                        this.noneDiv.classList.remove('e-de-table-border-inside-setting-click');
                        this.boxDiv.classList.add('e-de-table-border-inside-setting-click');
                        this.allDiv.classList.remove('e-de-table-border-inside-setting-click');
                    }
                } else {
                    customBorder = true;
                }
            } else {
                customBorder = true;
            }
            this.previewDivLeftDiagonal.classList.remove('e-de-table-border-inside-preview-click');
            this.previewDivDiagonalRight.classList.remove('e-de-table-border-inside-preview-click');
            if (customBorder) {
                this.customDiv.classList.add('e-de-table-border-inside-setting-click');
                this.noneDiv.classList.remove('e-de-table-border-inside-setting-click');
                this.boxDiv.classList.remove('e-de-table-border-inside-setting-click');
                this.allDiv.classList.remove('e-de-table-border-inside-setting-click');
                if (topBorder) {
                    this.previewDivTopTop.classList.add('e-de-table-border-inside-preview-click');
                } else {
                    this.previewDivTopTop.classList.remove('e-de-table-border-inside-preview-click');
                }
                if (bottomBorder) {
                    this.previewDivTopBottom.classList.add('e-de-table-border-inside-preview-click');
                } else {
                    this.previewDivTopBottom.classList.remove('e-de-table-border-inside-preview-click');
                }
                if (leftBorder) {
                    this.previewDivBottomLeft.classList.add('e-de-table-border-inside-preview-click');
                } else {
                    this.previewDivBottomLeft.classList.remove('e-de-table-border-inside-preview-click');
                }
                if (rightBorder) {
                    this.previewDivBottomRight.classList.add('e-de-table-border-inside-preview-click');
                } else {
                    this.previewDivBottomRight.classList.remove('e-de-table-border-inside-preview-click');
                }
                if (verticalBorder) {
                    this.previewDivBottomcenter.classList.add('e-de-table-border-inside-preview-click');
                } else {
                    this.previewDivBottomcenter.classList.remove('e-de-table-border-inside-preview-click');
                }
                if (horizontalBorder) {
                    this.previewDivTopCenter.classList.add('e-de-table-border-inside-preview-click');
                } else {
                    this.previewDivTopCenter.classList.remove('e-de-table-border-inside-preview-click');
                }
            }
        }
    }
    private getLineStyle(lineStyle: LineStyle): number {
        switch (lineStyle) {
            case 'Single': return 1;
            case 'Dot': return 2;
            case 'DashSmallGap': return 3;
            case 'DashLargeGap': return 4;
            case 'DashDot': return 5;
            case 'DashDotDot': return 6;
            case 'Double': return 7;
            case 'Triple': return 8;
            case 'ThinThickSmallGap': return 9;
            case 'ThickThinSmallGap': return 10;
            case 'ThinThickThinSmallGap': return 11;
            case 'ThinThickMediumGap': return 12;
            case 'ThickThinMediumGap': return 13;
            case 'ThinThickThinMediumGap': return 14;
            case 'ThinThickLargeGap': return 15;
            case 'ThickThinLargeGap': return 16;
            case 'ThinThickThinLargeGap': return 17;
            case 'SingleWavy': return 18;
            case 'DoubleWavy': return 19;
            case 'DashDotStroked': return 20;
            case 'Emboss3D': return 21;
            case 'Engrave3D': return 22;
            case 'Outset': return 23;
            case 'Inset': return 24;
            case 'Thick': return 25;
        }
        return 0;
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let k: number = 0; k < this.target.childNodes.length; k++) {
                this.target.removeChild(this.target.childNodes[k]);
                k--;
            }
            this.target = undefined;
        }
        if (this.cellFormat) {
            this.cellFormat.destroy();
            this.cellFormat = undefined;
        }
        if (this.tableFormat) {
            this.tableFormat.destroy();
            this.tableFormat = undefined;
        }
        this.dialog = undefined;
        this.target = undefined;
        if (!isNullOrUndefined(this.borderStyle)) {
            this.borderStyle.destroy();
        }
        this.borderStyle = undefined;
        if (!isNullOrUndefined(this.borderColorPicker)) {
            this.borderColorPicker.destroy();
        }
        this.borderColorPicker = undefined;
        if (!isNullOrUndefined(this.shadingColorPicker)) {
            this.shadingColorPicker.destroy();
        }
        this.shadingColorPicker = undefined;
        if (!isNullOrUndefined(this.ulelementShading)) {
            this.ulelementShading.destroy();
        }
        this.ulelementShading = undefined;
        this.noneDivTransparent = undefined;
        this.boxDivTransparent = undefined;
        this.allDivTransparent = undefined;
        this.customDivTransparent = undefined;
        this.previewDiv = undefined;
        this.previewRightDiagonalDiv = undefined;
        this.previewLeftDiagonalDiv = undefined;
        this.previewVerticalDiv = undefined;
        this.previewHorizontalDiv = undefined;
        this.previewDivTopTopContainer = undefined;
        this.previewDivTopTop = undefined;
        this.previewDivTopCenterContainer = undefined;
        this.previewDivTopCenter = undefined;
        this.previewDivTopBottomContainer = undefined;
        this.previewDivTopBottom = undefined;
        this.previewDivLeftDiagonalContainer = undefined;
        this.previewDivLeftDiagonal = undefined;
        this.previewDivBottomLeftContainer = undefined;
        this.previewDivBottomLeft = undefined;
        this.previewDivBottomcenterContainer = undefined;
        this.previewDivBottomcenter = undefined;
        this.previewDivBottomRightContainer = undefined;
        this.previewDivBottomRight = undefined;
        this.previewDivDiagonalRightContainer = undefined;
        this.previewDivDiagonalRight = undefined;
        this.previewDivTopTopTransParent = undefined;
        this.previewDivTopCenterTransParent = undefined;
        this.previewDivTopBottomTransParent = undefined;
        this.previewDivLeftDiagonalTransParent = undefined;
        this.previewDivBottomLeftTransparent = undefined;
        this.previewDivBottomcenterTransparent = undefined;
        this.previewDivBottomRightTransparent = undefined;
        this.previewDivDiagonalRightTransparent = undefined;
        this.shadingContiner = undefined;
        this.noneDiv = undefined;
        this.customDiv = undefined;
        this.allDiv = undefined;
        this.boxDiv = undefined;
    }
}
