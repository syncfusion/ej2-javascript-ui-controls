import { BlazorDotnetObject, extend, isNullOrUndefined } from '@syncfusion/ej2-base';

class SfSpinner {
    private element: BlazorSpinnerElement;
    private dotNetRef: BlazorDotnetObject;
    constructor(element: BlazorSpinnerElement, target: string, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(target);
        this.element.blazor__instance = this;
    }
    public initialize(element: HTMLElement, target: string): string {
        this.appendTarget(target);
        let theme: string = window.getComputedStyle(element as Element, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    }
    public appendTarget(target: string): void {
        if (!isNullOrUndefined(target)) {
            let targetElement: HTMLElement = <HTMLElement>document.querySelector(target);
            targetElement.appendChild(this.element);
        }
    }
    private updateContext(target: string): void {
        extend(this, this, target);
    }
}
// tslint:disable-next-line
let Spinner : object = {
    initialize(element: BlazorSpinnerElement, target: string, dotnetRef: BlazorDotnetObject): string {
        if (!isNullOrUndefined(element)) {
            new SfSpinner(element, target, dotnetRef);
            return (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) ?
            element.blazor__instance.initialize(element, target) : null;
        } else {
            return null;
        }
    },
    updateTarget(element: BlazorSpinnerElement, target: string): void {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.appendTarget(target);
        }
    }
};
interface BlazorSpinnerElement extends HTMLElement {
    blazor__instance: SfSpinner;
}
export default Spinner;