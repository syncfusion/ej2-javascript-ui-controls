import { NotifyPropertyChanges, INotifyPropertyChanged, Property, addClass, removeClass, extend } from '@syncfusion/ej2-base';import { Event, EmitType, EventHandler, getComponent, getInstance, isNullOrUndefined, L10n, getUniqueID } from '@syncfusion/ej2-base';import { SignatureBase, Dimension, ActivePoint } from '@syncfusion/ej2-inputs';import { ItemModel, Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';import { DropDownButton, ItemModel as DropDownButtonItemModel, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';import { ColorPicker, ColorPickerEventArgs, Uploader } from '@syncfusion/ej2-inputs';import { createSpinner, showSpinner, hideSpinner, OpenEventArgs } from '@syncfusion/ej2-popups';import { compile, compile as templateCompiler, Browser } from '@syncfusion/ej2-base';
import {Theme,ImageEditorCommands,SaveEventArgs,BeforeSaveEventArgs,ZoomEventArgs,PanEventArgs,CropEventArgs,RotateEventArgs,FlipEventArgs,ShapeChangeEventArgs,ToolbarEventArgs} from "./image-editor";

/**
 * Interface for a class ImageEditor
 */
export interface ImageEditorModel {

    /**
     * Defines class/multiple classes separated by a space for customizing Image Editor UI.
     * default ''
     ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({cssClass: 'e-custom-img-editor'});
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    cssClass?: string;

    /**
     * Specifies whether the Image Editor is disabled.
     * default false
     */
    disabled?: boolean;

    /**
     * Specifies the height of the Image Editor.
     * default '100%'
     */
    height?: string;

    /**
     * Specifies the theme of the Image Editor. The shape selection appearance will be decided based on this property.
     * The property supports all the built-in themes of Syncfusion.
     * default 'Bootstrap5'
     * @isenumeration true
     * @default Theme.Bootstrap5
     * @asptype Theme
     * 
     */
    theme?: string | Theme;

    /**
     * Specifies the toolbar items to perform UI interactions. It accepts both string[] and ItemModel[] to configure its toolbar items.
     * If the property is defined as empty collection, the toolbar will not be rendered.
     * Suppose the property is not defined in control, an image editor’s toolbar will be rendered with preconfigured toolbar commands.
     * The preconfigured toolbar commands are
     *  Crop: helps to crop an image as ellipse, square, various ratio aspects, custom selection with resize, drag and drop.
     *  Annotate: help to insert a shape on image that supports rectangle, ellipse, line, text and freehand drawing with resize, drag and drop, and customize its appearance.
     *  Transform: helps to rotate and flip an image.
     *  ZoomIn: performs zoom-in an image.
     *  ZoomOut: performs zoom-out an image.
     *  Pan: performs panning once zoomed an image.
     *  Move: disable the pan action and move to perform other actions such as insert a shape, transform, and more.
     *  Save: save the modified image.
     *  Open: open an image to perform editing.
     *  Reset: reset the modification and restore the original image.
     * default null
     ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     toolbar[Crop, ZoomIn, ZoomOut, Transform, {text: 'Custom'}]
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    toolbar?: (string | ImageEditorCommands | ItemModel)[];

    /**
     * Specifies template to the Image Editor Toolbar.
     * If you want to customize the entire toolbar in own way by using this property.
     * The property is depending on ‘toolbar’.
     *
     * @default null
     ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     toolbarTemplate: '#toolbarTemplate'
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * <script id="toolbarTemplate" type="text/x-template">
     *    <div class = 'e-toolbar'>
     *      <button id= 'dltbtn'></button>
     *    </div>
     *  </script>
     * ```
     */
    toolbarTemplate?: string;

    /**
     * Specifies the width of the Image Editor.
     * default 100%
     */
    width?: string;

    /**
     * Triggers before an image is saved.
     *
     * @event beforeSave
     */
    beforeSave?: EmitType<BeforeSaveEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    created?: EmitType<Event>

    /**
     * Triggers once the component is destroyed with its elements and bound events.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Event>

    /**
     * Triggers while zooming an image.
     *
     * @event zooming
     */
    zooming?: EmitType<ZoomEventArgs>

    /**
     * Triggers while panning an image.
     *
     * @event panning
     */
    panning?: EmitType<PanEventArgs>

    /**
     * Triggers while cropping an image.
     *
     * @event cropping
     */
    cropping?: EmitType<CropEventArgs>

    /**
     * Triggers while rotating an image.
     *
     * @event rotating
     */
    rotating?: EmitType<RotateEventArgs>

    /**
     * Triggers while flipping an image.
     *
     * @event flipping
     */
    flipping?: EmitType<FlipEventArgs>

    /**
     * Triggers while changing shapes in an image.
     *
     * @event shapeChanging
     */
    shapeChanging?: EmitType<ShapeChangeEventArgs>

    /**
     * Triggers once an image is opened.
     *
     * @event fileOpened
     */
    fileOpened?: EmitType<OpenEventArgs>

    /**
     * Triggers once an image is saved.
     *
     * @event saved
     */
    saved?: EmitType<SaveEventArgs>;

    /**
     * Triggers once the toolbar is created.
     *
     * @event toolbarCreated
     */
    toolbarCreated?: EmitType<ToolbarEventArgs>

    /**
     * Triggers while updating/refreshing the toolbar
     *
     * @event toolbarUpdating
     */
    toolbarUpdating?: EmitType<ToolbarEventArgs>

    /**
     * Triggers once the toolbar item is clicked.
     *
     * @event toolbarItemClicked
     */
    toolbarItemClicked?: EmitType<ClickEventArgs>

}