import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BlockEditor } from '../../base/blockeditor';
import { ColorPicker, ColorPickerEventArgs, ModeSwitchEventArgs, PaletteTileEventArgs } from '@syncfusion/ej2-inputs';
import { BackgroundColorSettingsModel, FontColorSettingsModel } from '../../../models';
import { IColorPickerRenderOptions } from '../../../common/interface';

export class ColorPickerRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders the colorpicker with the specified options.
     *
     * @param {IColorPickerRenderOptions} args - The options for rendering the colorpicker.
     * @returns {ColorPicker} - The rendered colorpicker instance.
     * @hidden
     */
    renderColorPicker(args: IColorPickerRenderOptions): ColorPicker {
        const isBackground: boolean = args.type === 'bgColor';
        const fontColor: FontColorSettingsModel = this.editor.fontColorSettings;
        const bgColor: BackgroundColorSettingsModel = this.editor.backgroundColorSettings;
        const mode: any = isBackground ? (bgColor.mode) : (fontColor.mode);
        const colorCode: any = isBackground ? (bgColor.colorCode) : (fontColor.colorCode);
        const modeSwitcher: boolean = isBackground ? !!bgColor.modeSwitcher : !!fontColor.modeSwitcher;
        const columns: number = isBackground ? (bgColor.columns) : (fontColor.columns);
        const value: string = isBackground ? (bgColor.default) : (fontColor.default);

        const colorPicker: ColorPicker = new ColorPicker({
            enableRtl: this.editor.enableRtl,
            inline: false,
            mode: mode,
            modeSwitcher: modeSwitcher,
            noColor: true,
            showButtons: false,
            cssClass: this.editor.cssClass + 'e-be-color-picker',
            columns: columns,
            presetColors: colorCode,
            created: () => {
                const host: HTMLElement = (args.element.parentElement as HTMLElement);
                host.tabIndex = -1;
                const cssClasses: string[] = colorPicker.cssClass.split(' ').filter(Boolean);
                const splitDiv: HTMLElement = host.childNodes[1] as HTMLElement;
                splitDiv.classList.add(...cssClasses);
                const dropdownCls: string = args.type === 'bgColor' ? 'e-be-bgcolor-dropdown' : 'e-be-fontcolor-dropdown';
                const splitPickerElem: HTMLElement = host.querySelector('.e-split-colorpicker') as HTMLElement;
                splitPickerElem.classList.add(...cssClasses);
                splitPickerElem.classList.add('e-dropdown', dropdownCls, 'e-icons');

                const dropdownBtn: HTMLElement = host.querySelector('.e-dropdown-btn') as HTMLElement;
                dropdownBtn.classList.add(...cssClasses);
                dropdownBtn.classList.add('e-dropdown', dropdownCls);
                colorPicker.setProperties({ value: value });
            },
            beforeTileRender: (args: PaletteTileEventArgs) => {
                args.element.classList.add('e-color-palette');
                args.element.classList.add('e-custom-tile');
                if (args.value === '') {
                    args.element.classList.add('e-no-color');
                }
            },
            change: (pickerArgs: ColorPickerEventArgs): void => {
                const colorpickerValue: string = pickerArgs.currentValue.rgba;
                args.onChange(colorpickerValue);
            },
            beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                const currentValue: string = colorPicker.value;
                if (currentValue === '') {
                    colorPicker.setProperties({ value: (args.mode === 'Picker') ? '#008000ff' : '' }, true);
                }
            }
        });
        colorPicker.appendTo(args.element);
        return colorPicker;
    }

    public updatePickerProperties(picker: ColorPicker, model: any): void {
        const props: { [key: string]: any } = {};
        if (!isNullOrUndefined(model.default)) { props.value = model.default; }
        if (!isNullOrUndefined(model.columns)) { props.columns = model.columns; }
        if (!isNullOrUndefined(model.modeSwitcher)) { props.modeSwitcher = model.modeSwitcher; }
        if (!isNullOrUndefined(model.colorCode)) { props.presetColors = model.colorCode; }
        if (!isNullOrUndefined(model.mode)) { props.mode = model.mode; }
        if (Object.keys(props).length) {
            picker.setProperties(props);
        }
    }
}
