import { select, detach } from '@syncfusion/ej2-base';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { RenderType } from '../base/enum';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { getIndex } from '../base/util';
import { templateItems, tools } from '../models/items';
import { IRichTextEditor, IRenderer, IColorPickerModel, IColorPickerRenderArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { Toolbar } from './toolbar';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
/**
 * `Color Picker` module is used to handle ColorPicker actions.
 */
export class ColorPickerInput {
    private fontColorPicker: ColorPicker;
    private backgroundColorPicker: ColorPicker;
    private fontColorDropDown: DropDownButton;
    private backgroundColorDropDown: DropDownButton;
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    protected toolbarRenderer: IRenderer;
    protected renderFactory: RendererFactory;

    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    private initializeInstance(): void {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
    }

    public renderColorPickerInput(args: IColorPickerRenderArgs): void {
        this.initializeInstance();
        let suffixID: string = args.containerType;
        let tbElement: HTMLElement = args.container;
        templateItems.forEach((item: string) => {
            if (getIndex(item, args.items) !== -1) {
                switch (item) {
                    case 'fontcolor':
                        let targetID: string = this.parent.getID() + '_' + suffixID + '_FontColor_Target';
                        let fontNode: HTMLInputElement = this.parent.createElement('input') as HTMLInputElement;
                        fontNode.id = targetID;
                        fontNode.classList.add(classes.CLS_FONT_COLOR_TARGET);
                        document.body.appendChild(fontNode);
                        let args: IColorPickerModel = {
                            cssClass: tools[item].icon + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_ICONS,
                            value: tools[item].value,
                            command: tools[item].command,
                            subCommand: tools[item].subCommand,
                            element: select('#' + this.parent.getID() + '_' + suffixID + '_FontColor', tbElement),
                            target: ('#' + targetID)
                        } as IColorPickerModel;
                        this.fontColorPicker = this.toolbarRenderer.renderColorPicker(args, 'fontcolor');
                        this.fontColorDropDown = this.toolbarRenderer.renderColorPickerDropDown(args, 'fontcolor', this.fontColorPicker);
                        break;
                    case 'backgroundcolor':
                        targetID = this.parent.getID() + '_' + suffixID + '_BackgroundColor_Target';
                        let backNode: HTMLInputElement = this.parent.createElement('input') as HTMLInputElement;
                        backNode.id = targetID;
                        backNode.classList.add(classes.CLS_BACKGROUND_COLOR_TARGET);
                        document.body.appendChild(backNode);
                        args = {
                            cssClass: tools[item].icon + ' ' + classes.CLS_RTE_ELEMENTS + ' ' + classes.CLS_ICONS,
                            value: tools[item].value,
                            command: tools[item].command,
                            subCommand: tools[item].subCommand,
                            element: select('#' + this.parent.getID() + '_' + suffixID + '_BackgroundColor', tbElement),
                            target: ('#' + targetID)
                        } as IColorPickerModel;
                        this.backgroundColorPicker = this.toolbarRenderer.renderColorPicker(args, 'backgroundcolor');
                        this.backgroundColorDropDown = this.toolbarRenderer.renderColorPickerDropDown(
                            args,
                            'backgroundcolor',
                            this.backgroundColorPicker);
                        break;
                }
            }
        });
    }

    private destroy(): void {
        this.removeEventListener();
        this.destroyColorPicker();
    }

    public destroyColorPicker(): void {
        if (this.fontColorPicker && !this.fontColorPicker.isDestroyed) { this.fontColorPicker.destroy(); }
        if (this.backgroundColorPicker && !this.backgroundColorPicker.isDestroyed) { this.backgroundColorPicker.destroy(); }
        if (this.fontColorDropDown && !this.fontColorDropDown.isDestroyed) {
            let innerEle: HTMLElement = this.fontColorDropDown.element.querySelector('.e-rte-color-content') as HTMLElement;
            if (innerEle) { detach(innerEle); }
            this.fontColorDropDown.destroy();
        }
        if (this.backgroundColorDropDown && !this.backgroundColorDropDown.isDestroyed) {
            let innerEle: HTMLElement = this.backgroundColorDropDown.element.querySelector('.e-rte-color-content') as HTMLElement;
            if (innerEle) { detach(innerEle); }
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

    protected addEventListener(): void {
        this.parent.on(events.toolbarRenderComplete, this.renderColorPickerInput, this);
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.destroyColorPicker, this.destroyColorPicker, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.toolbarRenderComplete, this.renderColorPickerInput);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.destroyColorPicker, this.destroyColorPicker);
    }

}