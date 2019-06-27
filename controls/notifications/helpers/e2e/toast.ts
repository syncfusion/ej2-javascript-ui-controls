import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class ToastHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    /**
     * The method which returns Toast's target element.
     */
    getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * The method which returns Toast's root element.
     */
    getToastElement() {
        return this.selector('#' + this.id + ' .e-toast');
    }

    /**
     * The method which returns Toast's message container element.
     */
    getMessageWrapper() {
        return this.selector('#' + this.id + ' .e-toast-message');
    }

    /**
     * The method which returns Toast's title container element.
     */
    getTitleElement() {
        return this.selector('#' + this.id + ' .e-toast-title');
    }

    /**
     * The method which returns Toast's content container element.
     */
    getContentElement() {
        return this.selector('#' + this.id + ' .e-toast-content');
    }

    /**
     * The method which returns Toast's progress-bar element.
     */
    getProgressElement() {
        return this.selector('#' + this.id + ' .e-toast-progress');
    }
    
    /**
     * The method which returns Toast's action buttons wrapper element.
     */
    getButtonWrapper() {
        return this.selector('#' + this.id + ' .e-toast-actions');
    }
    
    /**
     * The method which returns Toast's action buttons element.
     */
    getButtons() {
        return this.selector('#' + this.id + ' .e-toast-btn');
    }
    
    /**
     * The method which returns Toast's Close action button element.
     */
    getCloseButton() {
        return this.selector('#' + this.id + ' .e-toast-close-icon');
    }
    
    /**
     * The getModel method is used to return value of the property.
     * @param property - Specifies name of the property. It must be string type.
     */
    getModel(property: string) {
        this.getModel(property);
    }
    
    /**
     * The setModel method is used to set value for the property. It will accepts two arguments.
     * @param property - Specifices name of the property which value is to be updated.
     * @param value - Specifies corresponding value of the property.
     */
    setModel(property: string, value: any) {
        this.setModel(property, value);
    }
    
    /**
     * The invoke method is used to access the public methods available in Toast control.
     * @param fName - Specifies method name of the Toast control. It must be string type.
     * @param args - Specifies arguments. This is optional.
     */
    invoke(fName: string, args?: any[]) {
        this.invoke(fName, args);

    }
}