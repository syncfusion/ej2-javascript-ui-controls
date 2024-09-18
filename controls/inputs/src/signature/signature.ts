import { Event, EmitType, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, Property, addClass } from '@syncfusion/ej2-base';
import { SignatureBase, SignatureBeforeSaveEventArgs, SignatureChangeEventArgs } from '../common/signature-base';
import { SignatureModel } from './signature-model';

/**
 * The Signature component allows user to draw smooth signatures as vector outline of strokes using variable width bezier curve interpolation.
 * It allows to save signature as image.
 * You can use your finger, pen, or mouse on a tablet, touchscreen, etc., to draw your own signature on this Signature component.
 * Signature component is a user interface to draw the Signature or Text.
 * It provides supports for various Background color, Stroke color and Background Image.
 * ```html
 * <canvas id="signature"></canvas>
 * ```
 * ```typescript
 * <script>
 *   let signatureObj: Signature = new Signature(null , "#signature");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Signature extends SignatureBase implements INotifyPropertyChanged {

    /**
     * Gets or sets the background color of the component.
     * The background color of the component that accepts hex value, rgb and text (like 'red'). The default value is ''.
     *
     * @default ''
     */
    @Property('')
    public backgroundColor: string;

    /**
     * Gets or sets the background image for the component.
     * An image that used to fill the background of the component. The default value is ''.
     *
     * @default ''
     */
    @Property('')
    public backgroundImage: string;

    /**
     * Gets or sets whether to disable the signature component where the opacity is set to show disabled state.
     * True, if the signature component is disabled for user interaction. The default value is false.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Gets or sets whether to prevent the interaction in signature component.
     * True, if the signature component is read only state where the user interaction is prevented. The default value is false.
     *
     * @default false
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or sets whether to save the signature along with Background Color and background Image while saving.
     * True, if signature component to save with background. The default value is true.
     *
     * @default true
     */
    @Property(true)
    public saveWithBackground: boolean;

    /**
     * Gets or sets the stroke color of the signature.
     * The color of the signature stroke that accepts hex value, rgb and text (like 'red'). The default value is "#000000".
     *
     * @default '#000000'
     */
    @Property('#000000')
    public strokeColor: string;

    /**
     * Gets or sets the minimum stroke width for signature.
     * The signature component calculates stroke width based on Velocity, MinStrokeWidth and MaxStrokeWidth.
     * The minimum width of stroke. The default value is 0.5.
     *
     * @default 0.5
     */
    @Property(0.5)
    public minStrokeWidth: number;

    /**
     * Gets or sets the maximum stroke width for signature.
     * The signature component calculates stroke width based on Velocity, MinStrokeWidth and MaxStrokeWidth.
     * The maximum width of stroke. The default value is 2.0.
     *
     * @default 2
     */
    @Property(2)
    public maxStrokeWidth: number;

    /**
     * Gets or sets the velocity to calculate the stroke thickness based on the pressure of the contact on the digitizer surface.
     * The Signature component calculates stroke thickness based on Velocity, MinStrokeWidth and MaxStrokeWidth.
     * The default value is 0.7.
     *
     * @default 0.7
     */
    @Property(0.7)
    public velocity: number;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default 'en-US'
     * @private
     */
    @Property('en-US')
    public locale: string;

    /**
     * Specifies the Signature in RTL mode that displays the content in the right-to-left direction.
     *
     * @default false
     * @private
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Gets or sets whether to persist component's state between page reloads.
     * True, if the component's state persistence is enabled. The default value is false.
     * Component's property will be stored in browser local storage to persist component's state when page reloads.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Gets or sets an event callback that is raised while saving the signature.
     * The file name and the file type can be changed using SignatureBeforeSaveEventArgs and SignatureFileType.
     * The event callback is raised only for the keyboard action (Ctrl + S).
     *
     * @event beforeSave
     */
    @Event()
    public beforeSave: EmitType<SignatureBeforeSaveEventArgs>;

    /**
     * Gets or sets an event callback that is raised for the actions like undo, redo, clear and while user complete signing on signature component.
     *
     * @event change
     */
    @Event()
    public change: EmitType<SignatureChangeEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Constructor for creating the widget.
     *
     * @param {SignatureModel} options - Specifies the Signature model.
     * @param {string | HTMLCanvasElement} element - Specifies the element.
     * @private
     */
    constructor(options?: SignatureModel, element?: string | HTMLCanvasElement) {
        super(options, <HTMLCanvasElement | string> element);
    }

    protected preRender(): void {
        // pre render code snippets
    }

    /**
     * To Initialize the component rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
    }

    public initialize(): void {
        this.element.setAttribute('role', 'img');
        this.element.setAttribute('aria-label', 'signature');
        addClass([this.element], 'e-' + this.getModuleName());
        super.initialize(this.element);
        if (this.enablePersistence) {
            this.loadPersistedSignature();
        }
    }

    /**
     * To get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    protected getModuleName(): string {
        return super.getModuleName();
    }

    /**
     * To get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return super.getPersistData();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {SignatureModel} newProp - Specifies new properties
     * @param  {SignatureModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: SignatureModel, oldProp: SignatureModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'backgroundColor':
                super.propertyChanged(prop, newProp.backgroundColor);
                break;
            case 'backgroundImage':
                super.propertyChanged(prop, newProp.backgroundImage);
                break;
            case 'strokeColor':
                if (newProp.strokeColor !== oldProp.strokeColor) {
                    super.propertyChanged(prop, newProp.strokeColor);
                }
                break;
            case 'maxStrokeWidth':
                if (newProp.maxStrokeWidth !== oldProp.maxStrokeWidth) {
                    super.propertyChanged(prop, newProp.maxStrokeWidth);
                }
                break;
            case 'minStrokeWidth':
                if (newProp.minStrokeWidth !== oldProp.minStrokeWidth) {
                    super.propertyChanged(prop, newProp.minStrokeWidth);
                }
                break;
            case 'velocity':
                if (newProp.velocity !== oldProp.velocity) {
                    super.propertyChanged(prop, newProp.velocity);
                }
                break;
            case 'saveWithBackground':
                super.propertyChanged(prop, newProp.saveWithBackground);
                break;
            case 'isReadOnly':
                super.propertyChanged(prop, newProp.isReadOnly);
                break;
            case 'disabled':
                super.propertyChanged(prop, newProp.disabled);
                break;
            }
        }
    }
}
