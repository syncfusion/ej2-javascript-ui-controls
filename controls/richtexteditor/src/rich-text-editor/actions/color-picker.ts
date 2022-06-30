import { select, detach, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { RenderType, ToolbarItems } from '../base/enum';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { getIndex, toObjectLowerCase } from '../base/util';
import { templateItems, tools } from '../models/items';
import { IRichTextEditor, IRenderer, IColorPickerModel, IColorPickerRenderArgs, IToolsItems, ICssClassArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
/**
 * `Color Picker` module is used to handle ColorPicker actions.
 */
export class ColorPickerInput {
    private defaultColorPicker: string;
    private fontColorPicker: ColorPicker;
    private backgroundColorPicker: ColorPicker;
    private fontColorDropDown: DropDownButton;
    private backgroundColorDropDown: DropDownButton;
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
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderColorPickerInput(args: IColorPickerRenderArgs): void {
        this.initializeInstance();
        const suffixID: string = args.containerType;
        const tbElement: HTMLElement = args.container;
        let targetID: string;
        let options: IColorPickerModel;
        templateItems.forEach((item: string) => {
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                case 'fontcolor': {
                    targetID = this.parent.getID() + '_' + suffixID + '_FontColor_Target';
                    const fontNode: HTMLInputElement = this.parent.createElement('input') as HTMLInputElement;
                    fontNode.id = targetID;
                    fontNode.classList.add(classes.CLS_FONT_COLOR_TARGET);
                    if (!isNullOrUndefined(this.parent.cssClass)) {
                        const allClassName: string[] = this.parent.cssClass.split(' ');
                        for (let i: number = 0; i < allClassName.length; i++) {
                            if (allClassName[i].trim() !== '') {
                                fontNode.classList.add(allClassName[i]);
                            }
                        }
                    }
                    document.body.appendChild(fontNode);
                    options = {
                        cssClass: this.tools[item.toLocaleLowerCase() as ToolbarItems].icon
                            + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_ICONS + ' ' + this.parent.cssClass,
                        value: this.tools[item.toLocaleLowerCase() as ToolbarItems].value,
                        command: this.tools[item.toLocaleLowerCase() as ToolbarItems].command,
                        subCommand: this.tools[item.toLocaleLowerCase() as ToolbarItems].subCommand,
                        element: select('#' + this.parent.getID() + '_' + suffixID + '_FontColor', tbElement),
                        target: (targetID)
                    } as IColorPickerModel;
                    this.fontColorPicker = this.toolbarRenderer.renderColorPicker(options, 'fontcolor');
                    this.fontColorDropDown = this.toolbarRenderer.renderColorPickerDropDown(options, 'fontcolor', this.fontColorPicker);
                    break; }
                case 'backgroundcolor': {
                    targetID = this.parent.getID() + '_' + suffixID + '_BackgroundColor_Target';
                    const backNode: HTMLInputElement = this.parent.createElement('input') as HTMLInputElement;
                    backNode.id = targetID;
                    backNode.classList.add(classes.CLS_BACKGROUND_COLOR_TARGET);
                    if (!isNullOrUndefined(this.parent.cssClass)) {
                        const allClassName: string[] = this.parent.cssClass.split(' ');
                        for (let i: number = 0; i < allClassName.length; i++) {
                            if (allClassName[i].trim() !== '') {
                                backNode.classList.add(allClassName[i]);
                            }
                        }
                    }
                    document.body.appendChild(backNode);
                    options = {
                        cssClass: this.tools[item.toLocaleLowerCase() as ToolbarItems].icon
                        + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_ICONS + ' ' + this.parent.cssClass,
                        value: this.tools[item.toLocaleLowerCase() as ToolbarItems].value,
                        command: this.tools[item.toLocaleLowerCase() as ToolbarItems].command,
                        subCommand: this.tools[item.toLocaleLowerCase() as ToolbarItems].subCommand,
                        element: select('#' + this.parent.getID() + '_' + suffixID + '_BackgroundColor', tbElement),
                        target: (targetID)
                    } as IColorPickerModel;
                    this.backgroundColorPicker = this.toolbarRenderer.renderColorPicker(options, 'backgroundcolor');
                    this.backgroundColorDropDown = this.toolbarRenderer.renderColorPickerDropDown(
                        options,
                        'backgroundcolor',
                        this.backgroundColorPicker, this.defaultColorPicker);
                    break; }
                }
            }
        });
        if(this.parent.inlineMode.enable) {
            this.setCssClass({cssClass: this.parent.cssClass});
        }
    }

    private destroy(): void {
        this.removeEventListener();
        this.destroyColorPicker();
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
        if (this.fontColorDropDown && !this.fontColorDropDown.isDestroyed) {
            const innerEle: HTMLElement = this.fontColorDropDown.element.querySelector('.e-rte-color-content') as HTMLElement;
            if (innerEle) {
                detach(innerEle);
            }
            this.fontColorDropDown.destroy();
        }
        if (this.backgroundColorDropDown && !this.backgroundColorDropDown.isDestroyed) {
            const innerEle: HTMLElement = this.backgroundColorDropDown.element.querySelector('.e-rte-color-content') as HTMLElement;
            if (innerEle) {
                this.defaultColorPicker = (innerEle.children[0] as HTMLElement).style.borderBottomColor;
                detach(innerEle);
            }
            this.backgroundColorDropDown.destroy();
        }
    }

    private setRtl(args: { [key: string]: Object }): void {
        if (this.fontColorPicker) {
            this.fontColorPicker.setProperties({ enableRtl: args.enableRtl });
            this.fontColorDropDown.setProperties({ enableRtl: args.enableRtl });
        }
        if (this.backgroundColorPicker) {
            this.backgroundColorPicker.setProperties({ enableRtl: args.enableRtl });
            this.backgroundColorDropDown.setProperties({ enableRtl: args.enableRtl });
        }
    }

    private setCssClass(e: ICssClassArgs): void {
        this.updateCss(this.fontColorPicker, this.fontColorDropDown, e);
        this.updateCss(this.backgroundColorPicker, this.backgroundColorDropDown, e);
    }

    private updateCss(colorPickerObj:  ColorPicker, dropDownObj: DropDownButton, e: ICssClassArgs) : void {
        if (colorPickerObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                colorPickerObj.setProperties({ cssClass: (colorPickerObj.cssClass + ' ' + e.cssClass).trim() });
                dropDownObj.setProperties({ cssClass: (dropDownObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                colorPickerObj.setProperties({ cssClass: (colorPickerObj.cssClass.replace(e.oldCssClass, '').replace('  ', ' ').trim() + ' ' + e.cssClass).trim() });
                dropDownObj.setProperties({ cssClass: (dropDownObj.cssClass.replace(e.oldCssClass, '').replace('  ', ' ').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    protected addEventListener(): void {
        this.parent.on(events.toolbarRenderComplete, this.renderColorPickerInput, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.destroyColorPicker, this.destroyColorPicker, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
    }

    private onPropertyChanged(model: { [key: string]: Object }): void {
        const newProp: RichTextEditorModel = model.newProp;
        let element: HTMLElement;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'fontColor':
                if (this.fontColorPicker) {
                    for (const font of Object.keys(newProp.fontColor)) {
                        switch (font) {
                        case 'default': {
                            this.fontColorPicker.setProperties({ value: newProp.fontColor.default });
                            element = <HTMLElement>this.fontColorDropDown.element;
                            const fontBorder: HTMLElement = element.querySelector('.' + this.tools['fontcolor' as ToolbarItems].icon);
                            fontBorder.style.borderBottomColor = newProp.fontColor.default;
                            break; }
                        case 'mode':
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
                            element = <HTMLElement>this.backgroundColorDropDown.element;
                            const backgroundBorder: HTMLElement = element.querySelector(
                                '.' + this.tools['backgroundcolor' as ToolbarItems].icon);
                            backgroundBorder.style.borderBottomColor = newProp.backgroundColor.default;
                            break; }
                        case 'mode':
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
                        }
                    }
                }
                break;
            }
        }
    }

    protected removeEventListener(): void {
        this.parent.off(events.toolbarRenderComplete, this.renderColorPickerInput);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.destroyColorPicker, this.destroyColorPicker);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.bindCssClass, this.setCssClass);
    }

}
