import { BlazorDotnetObject, EventHandler} from '@syncfusion/ej2-base';
/**
 * Blazor texbox interop handler
 */
const BLUR: string = 'blur';
class SfTextBox {
    public element: BlazorInputElement | HTMLInputElement;
    public dotNetRef: BlazorDotnetObject;
    public isDestroyed: boolean;
    constructor(element: BlazorInputElement, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.isDestroyed = false;
    }
    public initialize(): void {
        EventHandler.add(this.element, BLUR, this.blurHandler, this);
    }
    private blurHandler(): void {
        if (!this.isDestroyed) {
            this.dotNetRef.invokeMethodAsync('BlurHandler');
        } else {
            EventHandler.remove(this.element, BLUR, this.blurHandler);
        }
    }
}

// tslint:disable
let TextBox: object = {
    initialize(element: BlazorInputElement, dotnetRef: BlazorDotnetObject): void {
        if (element) { new SfTextBox(element, dotnetRef); }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    focusIn(element: HTMLElement): void {
        element.focus();
    },
    focusOut(element: HTMLElement): void {
        element.blur();
    },
    destroyInput(element: BlazorInputElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.isDestroyed = true;
         }
    }
}
interface BlazorInputElement extends HTMLElement {
    blazor__instance: SfTextBox;
}
export default TextBox;