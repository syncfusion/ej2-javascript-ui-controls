import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class InPlaceEditorHelper extends TestHelper {
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
     * The method which returns In-place Editor's root element.
     */
    getElement() {
        return this.selector('#' + this.id);
    }
    
    /**
     * The method which returns In-place Editor's editable element.
     */
    getValueElement() {
        return this.selector('#' + this.id + ' .e-editable-value');
    }
    
    /**
     * The method which returns In-place Editor's edit icons's element.
     */
    getEditIconElement() {
        return this.selector('#' + this.id + ' .e-editable-overlay-icon');
    }
    
    /**
     * The method which returns In-place Editor's popup element.
     */
    getPopupElement() {
        return this.selector('.e-inplaceeditor-tip');
    }

    /**
     * The method which returns In-place Editor's loading element, during editing.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getLoadingElement(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-editable-loading') : this.selector('#' + this.id + ' .e-editable-loading'));
    }
    
    /**
     * The method which returns In-place Editor's error element, on updating new value.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getErrorElement(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-editable-error') : this.selector('#' + this.id + ' .e-editable-error'));
    }

    /**
     * The method which returns In-place Editor's form element.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getFormElement(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-editable-form') : this.selector('#' + this.id + ' .e-editable-form'));
    }
    
    /**
     * The method which returns In-place Editor's action buttons container.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getButtonsWrapper(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-editable-action-buttons') : this.selector('#' + this.id + ' .e-editable-action-buttons'));
    }

    /**
     * The method which returns In-place Editor's save action button container element.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getSaveButton(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-btn-save') : this.selector('#' + this.id + ' .e-btn-save'));
    }

    /**
     * The method which returns In-place Editor's cancel action buttons container element.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getCancelButton(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-btn-cancel') : this.selector('#' + this.id + ' .e-btn-cancel'));
    }
    
    /**
     * The method which returns In-place Editor's root container element.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getComponentWrapper(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip .e-editable-component') : this.selector('#' + this.id + ' .e-editable-component'));
    }
    
    /**
     * The method which returns In-place Editor's editable element.
     * @param mode - It specifies the rendering mode. Type of this parameter is string.
     */
    getComponentElement(mode: string) {
        return (mode === 'Popup' ? this.selector('.e-inplaceeditor-tip #' + this.id + '_editor') : this.selector('#' + this.id + '  #' + this.id + '_editor'));
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
     * The invoke method is used to access the public methods available in In-place Editor control.
     * @param fName - Specifies method name of the In-place Editor control. It must be string type.
     * @param args - Specifies arguments. This is optional.
     */
    invoke(fName: string, args?: any[]) {
        this.invoke(fName, args);
    }
}