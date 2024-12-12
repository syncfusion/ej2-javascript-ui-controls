import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, addClass, removeClass, ModuleDeclaration, extend } from '@syncfusion/ej2-base';import { Event, EmitType, EventHandler, getComponent, isNullOrUndefined, getUniqueID, setValue } from '@syncfusion/ej2-base';import { ItemModel, Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';import { Dialog, createSpinner } from '@syncfusion/ej2-popups';import { Complex, Browser, ChildProperty, compile as templateCompiler, compile } from '@syncfusion/ej2-base';import { ToolbarModule, Crop, Draw, Filter, FreehandDrawing, Selection, Shape, Transform, UndoRedo, Export, SelectionChangeEventArgs, Transition, ArrowheadType, ResizeEventArgs, FrameType, FrameLineStyle, FrameChangeEventArgs, FrameSettings, ShapeType, ImageSettings, RedactType, TransformationCollection } from './../index';import { ZoomEventArgs, PanEventArgs, CropEventArgs, RotateEventArgs, FlipEventArgs, ShapeChangeEventArgs } from './../index';import { ToolbarEventArgs, OpenEventArgs, SaveEventArgs, BeforeSaveEventArgs, Point, ShapeSettings, ImageFilterEventArgs, RedactSettings } from './../index';import { FinetuneEventArgs, QuickAccessToolbarEventArgs, CurrentObject, ImageDimension, TransformValue, PanPoint } from './../index';import { Interaction, SelectionPoint, ImageFinetuneValue, Dimension, ActivePoint, ImageEditorClickEventArgs, FrameValue } from './../index';import { Direction, ZoomTrigger, Theme, ImageEditorCommand, ImageFilterOption, ImageFinetuneOption, EditCompleteEventArgs  } from './../index';import { ItemModel as DropDownButtonItemModel } from '@syncfusion/ej2-splitbuttons';import { ChangeEventArgs, NumericTextBox, Uploader } from '@syncfusion/ej2-inputs';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class UploadSettings
 */
export interface UploadSettingsModel {

    /**
     * Specifies the allowed file extensions for uploaded images.
     *
     * @type {string}
     * @default null
     * @remarks
     * Example: '.jpg, .png, .gif'
     * This property restricts the types of image files that can be uploaded based on their file extensions. Only files with the specified extensions will be allowed.
     */
    allowedExtensions?: string;

    /**
     * Specifies the minimum size (in bytes) for the uploaded image.
     *
     * @type {number}
     * @default null
     * @remarks
     * The value represents the file size in bytes. Any file smaller than this size will be rejected during the upload process. Use this property to ensure that images meet a certain quality or resolution standard.
     */
    minFileSize?: number;

    /**
     * Specifies the maximum size (in bytes) for the uploaded image.
     *
     * @type {number}
     * @default null
     * @remarks
     * The value represents the file size in bytes. Any file larger than this size will be rejected during the upload process. This property helps prevent the upload of excessively large files that may impact performance.
     */
    maxFileSize?: number;

}

/**
 * Interface for a class FinetuneSettings
 */
export interface FinetuneSettingsModel {

    /**
     * Represents a finetune setting for adjusting the brightness of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The brightness level of the image, from -100 to 100.
     * @property {number} min - The minimum brightness value allowed, typically -100.
     * @property {number} max - The maximum brightness value allowed, typically 100.
     * @default null
     */
    brightness?: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the contrast of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The contrast level of the image, from -100 to 100.
     * @property {number} min - The minimum contrast value allowed, typically -100.
     * @property {number} max - The maximum contrast value allowed, typically 100.
     * @default null
     */
    contrast?: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the hue of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The hue level of the image, from 0 to 100.
     * @property {number} min - The minimum hue value allowed, typically 0.
     * @property {number} max - The maximum hue value allowed, typically 100.
     * @default null
     */
    hue?: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the saturation of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The saturation level of the image, from -100 to 100.
     * @property {number} min - The minimum saturation value allowed, typically -100.
     * @property {number} max - The maximum saturation value allowed, typically 100.
     * @default null
     */
    saturation?: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the exposure of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The exposure level of the image, from -100 to 100.
     * @property {number} min - The minimum exposure value allowed, typically -100.
     * @property {number} max - The maximum exposure value allowed, typically 100.
     * @default null
     */
    exposure?: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the opacity of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The opacity level of the image, from 0 to 100.
     * @property {number} min - The minimum opacity value allowed, typically 0.
     * @property {number} max - The maximum opacity value allowed, typically 100.
     * @default null
     */
    opacity?: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the blur of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The blur level of the image, from 0 to 100.
     * @property {number} min - The minimum blur value allowed, typically 0.
     * @property {number} max - The maximum blur value allowed, typically 100.
     * @default null
     */
    blur?: ImageFinetuneValue;

}

/**
 * Interface for a class ZoomSettings
 */
export interface ZoomSettingsModel {

    /**
     * Specifies the available options for zooming in an image editor control.
     *
     * @remarks
     * Use this property to enable or disable specific types of zooming in the image editor. The following zooming options are available:
     * MouseWheel: Zooming is performed by scrolling the mouse wheel up and down.
     * Pinch: Zooming is performed using pinch gestures on touch-enabled devices.
     * Commands: Zooming is performed by clicking the CTRL key and either the plus (+) or minus (-) buttons on the keyboard.
     * Toolbar: Zooming is performed using toolbar buttons.
     *
     * By default, this property is set to `null`, which enables all types of zooming.
     *
     * @default null
     * @aspNumberEnum
     */
    zoomTrigger?: ZoomTrigger;

    /**
     * Specifies the minimum zooming level to limit the zooming.
     * An integer value that specifies the minimum zooming level. And the default value is 1 (100%).
     *
     * @remarks
     * The given value is considered as percentage.
     *
     */
    minZoomFactor?: number;

    /**
     * Specifies the maximum zooming level to limit the zooming.
     * An integer value that specifies the maximum zooming level. And the default value is 10 (1000 percent).
     *
     * @remarks
     * The given value is considered as percentage.
     *
     */
    maxZoomFactor?: number;

    /**
     * Specifies the default zoom factor to be applied on initial loading of image.
     * An integer value that specifies the current zooming level. And the default value is 1 (100 percent).
     *
     * @remarks
     * The given value is considered as percentage.
     *
     */
    zoomFactor?: number;

    /**
     * Specifies the point in which the zooming  has been performed in the image editor.
     * A point value that specifies the current zooming point.
     * And the default value is null, and it can be considered as center point of the image editor.
     *
     * @remarks
     * The given value is a point object which has x and y coordinates.
     *
     */
    zoomPoint?: Point;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Specifies a boolean value whether to show circle on selection in the image editor.
     *
     * @type {boolean}
     *
     * @default true
     */
    showCircle?: boolean;

    /**
     * Represents stroke color of circle selection in the image editor.
     *
     * @type {string}
     *
     * @default null
     */
    strokeColor?: string;

    /**
     * Represents fill color of circle selection in the image editor.
     *
     * @type {string}
     *
     * @default null
     */
    fillColor?: string;

}

/**
 * Interface for a class FontFamily
 */
export interface FontFamilyModel {

    /**
     * Specifies default font family selection
     *
     * @default 'Arial'
     */
    default?: string;

    /**
     * Specifies default font family items
     *
     * @default null
     */
    items?: DropDownButtonItemModel[];

}

/**
 * Interface for a class ImageEditor
 */
export interface ImageEditorModel extends ComponentModel{

    /**
     * Defines one or more CSS classes that can be used to customize the appearance of an Image Editor component.
     *
     * @remarks
     * One or more CSS classes to customize the appearance of the Image Editor component, such as by changing its toolbar appearance, borders, sizes, or other visual aspects.
     *
     * @default ''
     *
     */
    cssClass?: string;

    /**
     * Defines whether an Image Editor component is enabled or disabled.
     *
     * @remarks
     * A disabled Image Editor component may have a different visual appearance than an enabled one. When set to “true”, the Image Editor component will be disabled, and the user will not be able to interact with it.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the height of the Image Editor.
     *
     * @remarks
     * The value of height is specified either as a percentage (e.g. '100%') or as a fixed pixel value (e.g. '100px').
     *
     * @default '100%'
     */
    height?: string;

    /**
     * Specifies the theme of the Image Editor. The appearance of the shape selection in Image Editor is determined by this property.
     *
     * @remarks
     * The `theme` property supports all the built-in themes of Syncfusion, including:
     * - `Bootstrap5`
     * - `Fluent`
     * - `Tailwind`
     * - `Bootstrap4`
     * - `Material`
     * - `Fabric`
     * - `HighContrast`
     * - `Bootstrap5Dark`
     * - `Bootstrap4Dark`
     * - `MaterialDark`
     * - `FabricDark`
     * - `HighContrastDark`
     * - `Fluent2`
     *
     * The default value is set to `Theme.Bootstrap5`.
     *
     * @isenumeration true
     * @default Theme.Bootstrap5
     * @asptype Theme
     *
     */
    theme?: string | Theme;

    /**
     * Specifies the toolbar items to perform UI interactions.
     * It accepts both string[] and ItemModel[] to configure its toolbar items. The default value is null.
     * If the property is not defined in the control, the default toolbar will be rendered with preconfigured toolbar commands.
     * If the property is defined as empty collection, the toolbar will not be rendered.
     * The preconfigured toolbar commands are
     * - Crop: helps to crop an image as ellipse, square, various ratio aspects, custom selection with resize, drag and drop.
     * - Straightening: helps to rotate an image by a specified angle.
     * - Annotate: help to insert a shape on image that supports rectangle, ellipse, line, arrow, path, text, image and freehand drawing with resize, drag and drop, and customize its appearance.
     * - Transform: helps to rotate and flip an image.
     * - Finetunes: helps to perform adjustments on an image.
     * - Filters: helps to perform predefined color filters.
     * - Frame: helps to add decorative borders or frames around images.
     * - Resize: helps to modify the dimensions of an image.
     * - ZoomIn: performs zoom-in an image.
     * - ZoomOut: performs zoom-out an image.
     * - Save: save the modified image.
     * - Open: open an image to perform editing.
     * - Undo: helps to revert the last action.
     * - Redo: helps to redo the last action.
     * - Reset: reset the modification and restore the original image.
     *
     * {% codeBlock src='image-editor/toolbar/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * If the toolbarTemplate property is defined in the control, the toolbar will be rendered based on the toolbarTemplate property.
     * @default null
     *
     */
    toolbar?: (string | ImageEditorCommand | ItemModel)[];

    /**
     * Specifies a custom template for the toolbar of an image editor control.
     * A string that specifies a custom template for the toolbar of the image editor. If this property is defined, the 'toolbar' property will not have any effect.
     *
     * {% codeBlock src='image-editor/toolbarTemplate/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * Use this property if you want to customize the entire toolbar in your own way. The template should be a string that contains the HTML markup for the custom toolbar.
     *
     * @default null
     * @aspType string
     *
     *
     */
    toolbarTemplate?: string | Function;

    /**
     * Specifies the width of an Image Editor.
     *
     * @remarks
     * The value of width is specified either as a percentage (e.g. '100%') or as a fixed pixel value (e.g. '100px').
     *
     * @default '100%'
     */
    width?: string;

    /**
     * Specifies a boolean value whether enable undo/redo operations in the image editor.
     *
     * @remarks
     * If this property is true, the undo redo options will be enabled in toolbar and can also be accessed via keyboard shortcuts.
     * If set to false, both options will be disabled.
     * The undo redo history is limited to 16. Once the maximum limit is reached, the oldest history item will be removed to make space for the new item.
     *
     * @default true
     *
     */
    allowUndoRedo?: boolean;

    /**
     * Specifies whether to show/hide the quick access toolbar.
     *
     * @default true
     *
     * @remarks
     * Set this property to true to show the quick access toolbar, and false to hide it.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     showQuickAccessToolbar : true
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    showQuickAccessToolbar?: boolean;

    /**
     * Specifies a template for the quick access toolbar.
     * Use this property to customize the quick access toolbar.
     *
     * @default null
     * @aspType string
     *
     * @remarks
     * This property only works if the "showQuickToolbar" property is set to true.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     showQuickAccessToolbar : true,
     *     quickAccessToolbarTemplate: '#toolbarTemplate'
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
    quickAccessToolbarTemplate?: string | Function;

    /**
     * Specifies whether to prevent user interaction with the image editor control.
     * A boolean that specifies whether to prevent the interaction in image editor control. The default value is false.
     *
     * @remarks
     * If the property is true, the image editor control becomes read-only, and the user interaction will be prevented.
     *
     * @default false
     * @private
     */
    isReadOnly?: boolean;

    /**
     * Specifies whether to enable RTL mode in image editor control that displays the content in the right-to-left direction.
     * A boolean that specifies whether to enable RTL mode in image editor control. The default value is false.
     *
     * @default false
     * @private
     */
    enableRtl?: boolean;

    /**
     * Specifies a bool value whether enable or disable persist component's state between page reloads. The default value is false.
     *
     * @remarks
     * If this property is true, the controls's state persistence will be enabled.
     * Control's property will be stored in browser local storage to persist control's state when page reloads.
     *
     * @default false
     * @private
     */
    enablePersistence?: boolean;

    /**
     * Specifies the finetune settings option which can be used to perform color adjustments in the image editor control.
     *
     * {% codeBlock src='image-editor/finetuneSettings/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * A 'FinetuneSettingsModel' value that specifies the the finetune options which are enabled in image editor control.
     * If the property is not specified, then the default values will be applied for minimum, maximum, and value properties for all finetune options.
     *
     * The possible values are:
     * - Brightness: The intensity of the primary colors grows with increased brightness, but the color itself does not change. It can be done by changing brightness and opacity property.
     * - Contrast: The contrast of an image refers to the difference between the light pixels and dark pixels. Low contrast images contain either a narrow range of colors while high contrast images have bright highlights and dark shadows. It can be done by changing contrast property.
     * - Hue: Hue distinguishes one color from another and is described using common color names such as green, blue, red, yellow, etc. Value refers to the lightness or darkness of a color. It can be controlled by hue-rotate property.
     * - Saturation: If saturation increases, colors appear sharper or purer. As saturation decreases, colors appear more washed-out or faded. It can be controlled by saturation and brightness property.
     * - Exposure: If exposure increases, intensity of light appears brighter. As exposure decreases, intensity of light decreases. Exposure can be controlled by brightness property.
     * - Opacity: The state or quality of being opaque or transparent, not allowing light to pass through the image. Opacity can be controlled by opacity property.
     * - Blur : Adjusting the blur can make an image unfocused or unclear. Blur can be controlled by blur property.
     *
     */
    finetuneSettings?: FinetuneSettingsModel;

    /**
     * Specifies the zoom settings to perform zooming action.
     * A 'ZoomSettingsModel' value that specifies the the zoom related options which are enabled in image editor control. The default value is null.
     *
     * {% codeBlock src='image-editor/zoomSettings/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * If the property is not specified, then the default settings will be applied for all the properties available in zoom settings.
     *
     * The following options are available in `zoomSettings`.
     * - minZoomFactor: Specifies the minimum zoom factor level to control the zoom.
     * - maxZoomFactor: Specifies the maximum zoom factor level to control the zoom.
     * - zoomFactor: Specifies the zoom factor to be applied to the image.
     * - zoomTrigger: Specifies the types of zooming to be supported in the image editor.
     * - zoomPoint: Specifies the x and y coordinates in which the zooming performed on initial load.
     *
     */
    zoomSettings?: ZoomSettingsModel;

    /**
     * Specifies the selection settings to customize selection.
     * A 'SelectionSettingsModel' value that specifies the the customization related options which are enabled in image editor control. The default value is null.
     *
     * @remarks
     * If the property is not specified, then the default settings will be applied for all the properties available in selection settings.
     *
     * The following options are available in `selectionSettings`.
     * - showCircle: Specifies whether to show / hide circles on selection.
     * - strokeColor: Specifies the stroke color of circle selection.
     * - fillColor: Specifies the fill color of circle selection.
     *
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Predefine the font families that populate in font family dropdown list from the toolbar.
     */
    fontFamily?: FontFamilyModel;

    /**
     * Represents the settings for configuring image uploads.
     *
     * This object allows you to specify restrictions on the types and sizes of images that can be uploaded, ensuring that only valid files are accepted according to the defined criteria.
     *
     * The following options are available in `uploadSettings`.
     * - allowedExtensions: Specifies the allowed file extensions for uploaded images. The default value is null.
     * - minFileSize: Specifies the minimum size (in bytes) for the uploaded image. The default value is null.
     * - maxFileSize: Specifies the maximum size (in bytes) for the uploaded image. The default value is null.
     *
     */
    uploadSettings?: UploadSettingsModel;

    /**
     * Event callback that is raised before an image is saved.
     *
     * @event beforeSave
     */
    beforeSave?: EmitType<BeforeSaveEventArgs>;

    /**
     * Event callback that is raised after rendering the Image Editor component.
     *
     * @event created
     */
    created?: EmitType<Event>

    /**
     * Event callback that is raised once the component is destroyed with its elements and bound events.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Event>

    /**
     * Event callback that is raised while zooming an image.
     *
     * @event zooming
     */
    zooming?: EmitType<ZoomEventArgs>

    /**
     * Event callback that is raised while panning an image.
     *
     * @event panning
     */
    panning?: EmitType<PanEventArgs>

    /**
     * Event callback that is raised while cropping an image.
     *
     * @event cropping
     */
    cropping?: EmitType<CropEventArgs>

    /**
     * Event callback that is raised while rotating an image.
     *
     * @event rotating
     */
    rotating?: EmitType<RotateEventArgs>

    /**
     * Event callback that is raised while flipping an image.
     *
     * @event flipping
     */
    flipping?: EmitType<FlipEventArgs>

    /**
     * Event callback that is raised while changing shapes in an Image Editor.
     *
     * @event shapeChanging
     */
    shapeChanging?: EmitType<ShapeChangeEventArgs>

    /**
     * Event callback that is raised while changing selection in an Image Editor.
     *
     * @event selectionChanging
     */
    selectionChanging?: EmitType<SelectionChangeEventArgs>

    /**
     * Event callback that is raised once an image is opened in an Image Editor.
     *
     * @event fileOpened
     */
    fileOpened?: EmitType<OpenEventArgs>

    /**
     * Event callback that is raised once an image is saved.
     *
     * @event saved
     */
    saved?: EmitType<SaveEventArgs>;

    /**
     * Event callback that is raised once the toolbar is created.
     *
     * @event toolbarCreated
     */
    toolbarCreated?: EmitType<ToolbarEventArgs>

    /**
     * Event callback that is raised while updating/refreshing the toolbar
     *
     * {% codeBlock src='image-editor/toolbarUpdating/index.md' %}{% endcodeBlock %}
     *
     * @event toolbarUpdating
     *
     */
    toolbarUpdating?: EmitType<ToolbarEventArgs>

    /**
     * Event callback that is raised once the toolbar item is clicked.
     *
     * @event toolbarItemClicked
     */
    toolbarItemClicked?: EmitType<ClickEventArgs>

    /**
     * Event callback that is raised when applying filter to an image.
     *
     * @event imageFiltering
     */
    imageFiltering?: EmitType<ImageFilterEventArgs>;

    /**
     * Event callback that is raised when applying fine tune to an image.
     *
     * @event finetuneValueChanging
     */
    finetuneValueChanging?: EmitType<FinetuneEventArgs>

    /**
     * Event callback that is raised while clicking on an image in the Image Editor.
     *
     * @event click
     */
    click?: EmitType<ImageEditorClickEventArgs>

    /**
     * Event callback that is raised after shape changing action is performed in an image editor.
     *
     * @remarks
     * This event is triggered after changing stroke color, fill Color, and stroke width property for the shapes and after the shape is applied to the canvas while clicking the OK button in toolbar.
     *
     * @event shapeChange
     */
    shapeChange?: EmitType<ShapeChangeEventArgs>

    /**
     * Event callback that is raised when opening the quick access toolbar.
     *
     * @event quickAccessToolbarOpen
     *
     * @remarks
     * Use this event to customize the toolbar items that appear in the quick access toolbar.
     * To customize the toolbar items, modify the "toolbarItems" collection property of the event arguments.
     * The "toolbarItems" collection contains string and ItemModel values.
     * The string values representing the names of the built-in toolbar items to display.
     * The ItemModel values representing the ItemModel of custom toolbar items to display.
     *
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     showQuickAccessToolbar : true,
     *     quickAccessToolbarOpen: (args: QuickAccessToolbarEventArgs)=> {
     *         args.toolbarItems = [“Delete”, {text: “custom”}];
     *     }
     *
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     */
    quickAccessToolbarOpen?: EmitType<QuickAccessToolbarEventArgs>

    /**
     * Event callback that is raised while resizing an image.
     *
     * @event resizing
     */
    resizing?: EmitType<ResizeEventArgs>

    /**
     * Event callback that is raised once the quick access toolbar item is clicked.
     *
     * @event quickAccessToolbarItemClick
     *
     */
    quickAccessToolbarItemClick?: EmitType<ClickEventArgs>

    /**
     *  Event callback that is raised while applying frames on an image.
     *
     * @event frameChange
     */
    frameChange?: EmitType<FrameChangeEventArgs>

    /**
     * Event callback that is triggered after the completion of an editing action in the image editor.
     *
     * This event occurs after the image editor canvas has been updated through following actions such as cropping, drawing annotations, applying filters, fine-tuning, or other customizations.
     *
     * It provides an opportunity to perform additional tasks, such as comparing the current image data with previous states or triggering further processing based on the changes.
     *
     * @event editComplete
     *
     */
    editComplete?: EmitType<EditCompleteEventArgs >

}