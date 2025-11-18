import { select, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { RenderType } from '../base/enum';
import { ToolbarItems } from '../../common/enum';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { getIndex, toObjectLowerCase } from '../base/util';
import { templateItems, tools } from '../models/items';
import { IRichTextEditor, ICssClassArgs, IRenderer } from '../base/interface';
import { IColorPickerRenderArgs, IToolsItems, IColorPickerModel } from '../../common/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
/**
 * `Color Picker` module is used to handle ColorPicker actions.
 */
export class ColorPickerInput {
    private fontColorPicker: ColorPicker;
    private backgroundColorPicker: ColorPicker;
    private borderColorPicker: ColorPicker;
    private tableBackgroundColorPicker: ColorPicker;
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    protected toolbarRenderer: IRenderer;
    protected renderFactory: RendererFactory;
    private tools: { [key: string]: IToolsItems } = {};

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        } else {
            this.tools = tools;
        }
    }

    private initializeInstance(): void {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    }

    /**
     * renderColorPickerInput method
     *
     * @param {IColorPickerRenderArgs} args - specify the arguments.
     * @param {HTMLElement} targetElement - specify the target element.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderColorPickerInput(args: IColorPickerRenderArgs, targetElement?: HTMLElement): void {
        this.initializeInstance();
        const suffixID: string = args.containerType;
        const tbElement: HTMLElement = args.container;
        let targetID: string;
        let options: IColorPickerModel;
        templateItems.forEach((item: string) => {
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                case 'fontcolor': {
                    options = {
                        cssClass: classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN + ' ' + classes.CLS_FONT_COLORPICKER + ' ' +
                                this.tools[item.toLocaleLowerCase() as ToolbarItems].icon
                                + ' ' + classes.CLS_ICONS + this.parent.getCssClass(true),
                        value: this.tools[item.toLocaleLowerCase() as ToolbarItems].value,
                        command: this.tools[item.toLocaleLowerCase() as ToolbarItems].command,
                        subCommand: this.tools[item.toLocaleLowerCase() as ToolbarItems].subCommand,
                        element: select('#' + this.parent.getID() + '_' + suffixID + '_FontColor', tbElement),
                        target: (targetID)
                    } as IColorPickerModel;
                    if (!isNullOrUndefined((options.element as HTMLElement).nextElementSibling) &&
                        (options.element as HTMLElement).nextElementSibling.classList.contains(classes.CLS_DROPDOWN)) {
                        return;
                    }
                    this.fontColorPicker = this.toolbarRenderer.renderColorPicker(options, 'fontcolor', args.containerType);
                    break; }
                case 'backgroundcolor': {
                    options = {
                        cssClass: classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN + ' ' + classes.CLS_BACKGROUND_COLORPICKER + ' ' +
                                this.tools[item.toLocaleLowerCase() as ToolbarItems].icon + ' ' +
                                classes.CLS_ICONS + this.parent.getCssClass(true),
                        value: this.tools[item.toLocaleLowerCase() as ToolbarItems].value,
                        command: this.tools[item.toLocaleLowerCase() as ToolbarItems].command,
                        subCommand: this.tools[item.toLocaleLowerCase() as ToolbarItems].subCommand,
                        element: select('#' + this.parent.getID() + '_' + suffixID + '_BackgroundColor', tbElement),
                        target: (targetID)
                    } as IColorPickerModel;
                    if (!isNullOrUndefined((options.element as HTMLElement).nextElementSibling) &&
                        (options.element as HTMLElement).nextElementSibling.classList.contains(classes.CLS_DROPDOWN)) {
                        return;
                    }
                    this.backgroundColorPicker = this.toolbarRenderer.renderColorPicker(options, 'backgroundcolor', args.containerType);
                    break;
                }
                case 'bordercolor': {
                    let bdrColor: string = targetElement.style.borderColor;
                    if (bdrColor.match(/\d+/g)) {
                        const hex: string = '#' + bdrColor.match(/\d+/g).slice(0, 3).map((n: string) => {
                            const h: string = parseInt(n, 10).toString(16);
                            return h.length === 1 ? '0' + h : h;
                        }).join('');
                        bdrColor = hex;
                    }
                    options = {
                        cssClass: classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN + ' ' + classes.CLS_BORDERCOLOR_COLORPICKER + this.parent.getCssClass(true),
                        value: bdrColor ? bdrColor : this.tools[item.toLocaleLowerCase() as ToolbarItems].value,
                        command: this.tools[item.toLocaleLowerCase() as ToolbarItems].command,
                        subCommand: this.tools[item.toLocaleLowerCase() as ToolbarItems].subCommand,
                        element: tbElement,
                        target: (targetID)
                    } as IColorPickerModel;
                    this.borderColorPicker = this.toolbarRenderer.renderColorPicker(options, 'bordercolor', args.containerType);
                    break;
                }
                case 'tablebackgroundcolor': {
                    let bgColor: string = targetElement.style.backgroundColor;
                    if (bgColor.match(/\d+/g)) {
                        const hex: string = '#' + bgColor.match(/\d+/g).slice(0, 3).map((n: string) => {
                            const h: string = parseInt(n, 10).toString(16);
                            return h.length === 1 ? '0' + h : h;
                        }).join('');
                        bgColor = hex;
                    }
                    options = {
                        cssClass: classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_DROPDOWN + ' ' + classes.CLS_TABLE_BGCOLOR_COLORPICKER + this.parent.getCssClass(true),
                        value: bgColor ? bgColor : this.tools[item.toLocaleLowerCase() as ToolbarItems].value,
                        command: this.tools[item.toLocaleLowerCase() as ToolbarItems].command,
                        subCommand: this.tools[item.toLocaleLowerCase() as ToolbarItems].subCommand,
                        element: tbElement,
                        target: (targetID)
                    } as IColorPickerModel;
                    this.tableBackgroundColorPicker = this.toolbarRenderer.renderColorPicker(options, 'tablebackgroundcolor', args.containerType);
                    break;
                }
                }
            }
        });
        if (this.parent.inlineMode.enable) {
            this.setCssClass({ cssClass: this.parent.getCssClass() });
        }
    }

    public destroy(): void {
        this.removeEventListener();
        this.destroyColorPicker();
        this.fontColorPicker = null;
        this.backgroundColorPicker = null;
        this.borderColorPicker = null;
        this.tableBackgroundColorPicker = null;
        this.tools = {};
    }

    /**
     * destroyColorPicker method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroyColorPicker(): void {
        if (this.fontColorPicker && !this.fontColorPicker.isDestroyed) {
            this.fontColorPicker.destroy();
        }
        if (this.backgroundColorPicker && !this.backgroundColorPicker.isDestroyed) {
            this.backgroundColorPicker.destroy();
        }
        if (this.borderColorPicker && !this.borderColorPicker.isDestroyed) {
            this.borderColorPicker.destroy();
        }
        if (this.tableBackgroundColorPicker && !this.tableBackgroundColorPicker.isDestroyed) {
            this.tableBackgroundColorPicker.destroy();
        }
    }

    private setRtl(args: { [key: string]: Object }): void {
        if (this.fontColorPicker) {
            this.fontColorPicker.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.backgroundColorPicker) {
            this.backgroundColorPicker.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.borderColorPicker) {
            this.borderColorPicker.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.tableBackgroundColorPicker) {
            this.tableBackgroundColorPicker.setProperties({ enableRtl: args.enableRtl });
        }
    }

    private setCssClass(e: ICssClassArgs): void {
        this.updateCss(this.fontColorPicker, e);
        this.updateCss(this.backgroundColorPicker, e);
        this.updateCss(this.borderColorPicker, e);
        this.updateCss(this.tableBackgroundColorPicker, e);
    }

    private updateCss(colorPickerObj: ColorPicker, e: ICssClassArgs): void {
        if (colorPickerObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                colorPickerObj.setProperties({ cssClass: (colorPickerObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                colorPickerObj.setProperties({ cssClass: (colorPickerObj.cssClass.replace(e.oldCssClass, '').replace('  ', ' ').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    protected addEventListener(): void {
        this.parent.on(events.toolbarRenderComplete, this.renderColorPickerInput, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.showColorPicker, this.showColorPicker, this);
    }

    private showColorPicker(e: { [key: string]: Object }): void {
        if (!isNullOrUndefined(this.fontColorPicker) && ((e as { [key: string]: Object }).toolbarClick === 'fontcolor')) {
            this.fontColorPicker.toggle();
        }
        else if (!isNullOrUndefined(this.backgroundColorPicker) && ((e as { [key: string]: Object }).toolbarClick === 'backgroundcolor')) {
            this.backgroundColorPicker.toggle();
        }
    }

    private onPropertyChanged(model: { [key: string]: Object }): void {
        const newProp: RichTextEditorModel = model.newProp;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'fontColor':
                if (this.fontColorPicker) {
                    for (const font of Object.keys(newProp.fontColor)) {
                        switch (font) {
                        case 'default': {
                            this.fontColorPicker.setProperties({ value: newProp.fontColor.default });
                            break;
                        }
                        case 'mode':
                            this.fontColorPicker.showButtons = newProp.fontColor.mode === 'Picker' ? true : false;
                            this.fontColorPicker.setProperties({ mode: newProp.fontColor.mode });
                            break;
                        case 'columns':
                            this.fontColorPicker.setProperties({ columns: newProp.fontColor.columns });
                            break;
                        case 'colorCode':
                            this.fontColorPicker.setProperties({ presetColors: newProp.fontColor.colorCode });
                            break;
                        case 'modeSwitcher':
                            this.fontColorPicker.setProperties({ modeSwitcher: newProp.fontColor.modeSwitcher });
                            break;
                        case 'showRecentColors':
                            this.fontColorPicker.setProperties({ showRecentColors: newProp.fontColor.showRecentColors });
                            break;
                        }
                    }
                }
                break;
            case 'backgroundColor':
                if (this.backgroundColorPicker) {
                    for (const background of Object.keys(newProp.backgroundColor)) {
                        switch (background) {
                        case 'default': {
                            this.backgroundColorPicker.setProperties({ value: newProp.backgroundColor.default });
                            break;
                        }
                        case 'mode':
                            this.backgroundColorPicker.showButtons = newProp.backgroundColor.mode === 'Picker' ? true : false;
                            this.backgroundColorPicker.setProperties({ mode: newProp.backgroundColor.mode });
                            break;
                        case 'columns':
                            this.backgroundColorPicker.setProperties({ columns: newProp.backgroundColor.columns });
                            break;
                        case 'colorCode':
                            this.backgroundColorPicker.setProperties({ presetColors: newProp.backgroundColor.colorCode });
                            break;
                        case 'modeSwitcher':
                            this.backgroundColorPicker.setProperties({ modeSwitcher: newProp.backgroundColor.modeSwitcher });
                            break;
                        case 'showRecentColors':
                            this.backgroundColorPicker.setProperties({ showRecentColors: newProp.backgroundColor.showRecentColors });
                            break;
                        }
                    }
                }
                break;
            }
        }
    }

    protected removeEventListener(): void {
        this.parent.off(events.toolbarRenderComplete, this.renderColorPickerInput);
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.showColorPicker, this.showColorPicker);
    }

}
