import { ColorPicker as ColorPickerComponent, BeforeOpenCloseEventArgs, OpenEventArgs } from '@syncfusion/ej2-inputs';
import { ColorPickerEventArgs, ModeSwitchEventArgs } from '@syncfusion/ej2-inputs';
import { addClass, L10n } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { spreadsheetDestroyed, fontColor, fillColor, beforeRibbonCreate, locale } from '../common/index';
import { destroyComponent } from '../common/index';
/**
 * `Color Picker` module is used to handle ColorPicker functionality.
 * @hidden
 */
export class ColorPicker {
    private parent: Spreadsheet;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private render(): void {
        let id: string = this.parent.element.id;
        let input: HTMLInputElement = this.parent.createElement('input', { attrs: { 'type': 'color' } }) as HTMLInputElement;
        let fontColorPicker: ColorPickerComponent = new ColorPickerComponent({
            value: '#000000ff',
            mode: 'Palette',
            showButtons: false,
            presetColors: fontColor,
            enableOpacity: false,
            beforeClose: (args: BeforeOpenCloseEventArgs): void => this.beforeCloseHandler(fontColorPicker),
            open: this.openHandler.bind(this),
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => this.beforeModeSwitch(fontColorPicker, args),
            change: (args: ColorPickerEventArgs): void => {
                let color: string = fontColorPicker.getValue(args.currentValue.rgba);
                this.updateSelectedColor(color, fontColorPicker.element);
                this.parent.cellFormat({ color: color });
                this.parent.element.focus();
            },
            created: (): void => this.wireFocusEvent(fontColorPicker.element, '#000000')
        });
        fontColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        fontColorPicker.appendTo(input);
        input.parentElement.id = `${id}_font_color_picker`;
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-font-color']);
        input = this.parent.createElement('input', { attrs: { 'type': 'color' } }) as HTMLInputElement;
        let filColorPicker: ColorPickerComponent = new ColorPickerComponent({
            value: '#ffff00ff',
            mode: 'Palette',
            presetColors: fillColor,
            showButtons: false,
            enableOpacity: false,
            open: this.openHandler.bind(this),
            beforeClose: (args: BeforeOpenCloseEventArgs): void => this.beforeCloseHandler(filColorPicker),
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => this.beforeModeSwitch(filColorPicker, args),
            change: (args: ColorPickerEventArgs): void => {
                let color: string = filColorPicker.getValue(args.currentValue.rgba);
                this.updateSelectedColor(color, filColorPicker.element);
                this.parent.cellFormat({ backgroundColor: color });
                this.parent.element.focus();
            },
            created: (): void => this.wireFocusEvent(filColorPicker.element, '#ffff00')
        });
        filColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        filColorPicker.appendTo(input);
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
        this.removeEventListener();
        let id: string = this.parent.element.id;
        this.destroyColorPicker(`${id}_font_color_picker`);
        this.destroyColorPicker(`${id}_fill_color_picker`);
        this.parent = null;
    }
    private destroyColorPicker(id: string): void {
        let ele: HTMLElement = document.getElementById(id);
        if (ele) { destroyComponent(ele.firstElementChild as HTMLElement, ColorPickerComponent); }
    }
    private addEventListener(): void {
        this.parent.on(beforeRibbonCreate, this.render, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(beforeRibbonCreate, this.render);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    }
}