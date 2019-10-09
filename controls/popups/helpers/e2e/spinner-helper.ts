import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class SpinnerHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id:string, wrapperFn:Function) {
        super();
        this.id = id;
        if(wrapperFn!==undefined){
            this.wrapperFn = wrapperFn
        }
        return this;
    }
    
    /**
     * The method which returns target element of the Spinner control.
     */
    getSpinner() {
        return this.selector('#' + this.id);
    }
    
    /**
     * The getSpinnerPane method which returns wrapper element of the Spinner control.
     */
    getSpinnerPane() {
        return this.selector('#' + this.id + ' div.e-spinner-pane');
    }
    
    /**
     * The method which returns Spinner image.
     */
    getSpinnerImage() {
        return this.selector('#' + this.id + ' div.e-spinner-pane .e-spinner-inner svg');
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
     * The invoke method is used to access the public methods available in Spinner control.
     * @param fName - Specifies method name of the Spinner control. It must be string type.
     * @param args - Specifies arguments. This is optional.
     */
    invoke(fName: string, args?: any[]) {
        this.invoke(fName, args);
    
    }
    
}
