import { ColorPicker as ColorPickerComponent, BeforeOpenCloseEventArgs, OpenEventArgs } from '@syncfusion/ej2-inputs';
import { ColorPickerEventArgs, ModeSwitchEventArgs } from '@syncfusion/ej2-inputs';
import { addClass, L10n } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { spreadsheetDestroyed, fontColor, fillColor, beforeRibbonCreate, locale } from '../common/index';
import { setCellFormat, SetCellFormatArgs } from '../../workbook/common/index';
/**
 * `Color Picker` module is used to handle ColorPicker functionality.
 * @hidden
 */
export class ColorPicker {
    private parent: Spreadsheet;
    private fontColorPicker: ColorPickerComponent;
    private filColorPicker: ColorPickerComponent;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private render(): void {
        let id: string = this.parent.element.id;
        let input: HTMLInputElement = this.parent.createElement('input', { attrs: { 'type': 'color' } }) as HTMLInputElement;
        this.fontColorPicker = new ColorPickerComponent({
            value: '#000000ff',
            mode: 'Palette',
            showButtons: false,
            presetColors: fontColor,
            enableOpacity: false,
            beforeClose: (args: BeforeOpenCloseEventArgs): void => this.beforeCloseHandler(this.fontColorPicker),
            open: this.openHandler.bind(this),
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => this.beforeModeSwitch(this.fontColorPicker, args),
            change: (args: ColorPickerEventArgs): void => {
                let color: string = this.fontColorPicker.getValue(args.currentValue.rgba);
                let eventArgs: SetCellFormatArgs = { style: { color: color }, onActionUpdate: true };
                this.parent.notify(setCellFormat, eventArgs);
                if (eventArgs.cancel) {
                    this.fontColorPicker.setProperties({ 'value': this.fontColorPicker.getValue(args.previousValue.rgba, 'HEXA') }, true);
                } else {
                    this.updateSelectedColor(eventArgs.style.color, this.fontColorPicker.element);
                }
                this.parent.element.focus();
            },
            created: (): void => this.wireFocusEvent(this.fontColorPicker.element, '#000000')
        });
        this.fontColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        this.fontColorPicker.appendTo(input);
        input.parentElement.id = `${id}_font_color_picker`;
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-font-color']);
        input = this.parent.createElement('input', { attrs: { 'type': 'color' } }) as HTMLInputElement;
        this.filColorPicker = new ColorPickerComponent({
            value: '#ffff00ff',
            mode: 'Palette',
            presetColors: fillColor,
            showButtons: false,
            enableOpacity: false,
            open: this.openHandler.bind(this),
            beforeClose: (args: BeforeOpenCloseEventArgs): void => this.beforeCloseHandler(this.filColorPicker),
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => this.beforeModeSwitch(this.filColorPicker, args),
            change: (args: ColorPickerEventArgs): void => {
                let color: string = this.filColorPicker.getValue(args.currentValue.rgba);
                let eventArgs: SetCellFormatArgs = { style: { backgroundColor: color }, onActionUpdate: true };
                this.parent.notify(setCellFormat, eventArgs);
                if (eventArgs.cancel) {
                    this.filColorPicker.setProperties({ 'value': this.filColorPicker.getValue(args.previousValue.rgba, 'HEXA') }, true);
                } else {
                    this.updateSelectedColor(eventArgs.style.backgroundColor, this.filColorPicker.element);
                }
                this.parent.element.focus();
            },
            created: (): void => this.wireFocusEvent(this.filColorPicker.element, '#ffff00')
        });
        this.filColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        this.filColorPicker.appendTo(input);
        input.parentElement.id = `${id}_fill_color_picker`;
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-fill-color']);
    }
    private updateSelectedColor(color: string, ele: HTMLElement): void {
        (ele.nextElementSibling.querySelector('.e-selected-color') as HTMLElement).style.borderBottomColor = color;
    }
    private wireFocusEvent(element: HTMLElement, color: string): void {
        this.updateSelectedColor(color, element);
        element = element.parentElement.querySelector('.e-split-colorpicker');
        element.addEventListener('focus', (): void => {
            this.parent.element.focus();
        });
    }
    private openHandler(args: OpenEventArgs): void {
        (args.element.querySelector('.e-mode-switch-btn') as HTMLElement).title =
            (this.parent.serviceLocator.getService(locale) as L10n).getConstant('MoreColors');
    }
    private beforeCloseHandler(inst: ColorPickerComponent): void {
        if (!inst.modeSwitcher) { inst.setProperties({ modeSwitcher: true }, true); }
        if (inst.showButtons) { inst.setProperties({ showButtons: false }, true); }
    }
    private beforeModeSwitch(inst: ColorPickerComponent, args: ModeSwitchEventArgs): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (args.mode === 'Picker') {
            inst.showButtons = true; inst.dataBind();
            (args.element.querySelector('.e-apply') as HTMLElement).title = l10n.getConstant('Apply');
            (args.element.querySelector('.e-cancel') as HTMLElement).title = l10n.getConstant('Cancel');
            (args.element.querySelector('.e-mode-switch-btn') as HTMLElement).title = l10n.getConstant('StandardColors');
        } else {
            inst.showButtons = false; inst.dataBind();
            (args.element.querySelector('.e-mode-switch-btn') as HTMLElement).title = l10n.getConstant('MoreColors');
        }
    }
    private destroy(): void {
        if (this.parent) {
            this.removeEventListener();
            this.fontColorPicker.destroy(); this.fontColorPicker = null;
            this.filColorPicker.destroy(); this.filColorPicker = null;
            this.parent = null;
        }
    }

    private addEventListener(): void {
        this.parent.on(beforeRibbonCreate, this.render, this);
        this.parent.on('destroyRibbonComponents', this.destroy, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    private removeEventListener(): void {
        this.parent.off(beforeRibbonCreate, this.render);
        this.parent.off('destroyRibbonComponents', this.destroy);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
}