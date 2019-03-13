
/**
 * Base E2E Helper Function
 */
export abstract class TestHelper {

    public abstract id: string;
    public abstract wrapperFn: Function;
    
    public selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    public setModel(property: string, value: any) {
        return Mapper.setModel(this.id, this.selector, property, value);
    }

    public getModel(property: string, ) {
        return Mapper.getModel(this.id, this.selector, property);
    }

    public invoke(fName: string, args: any[] = []) {
        return Mapper.invoke(this.id, this.selector, fName, args);
    }

    public eventHandler(eventName: string, callback: any) {
        return this.selector('#' + this.id).then((ele: HTMLElement) => {
            var inst = ele[0].ej2_instances[0];
            return inst[eventName] = callback;
        });
    }

}

declare let cy: any;

class Mapper {

    public static setModel(id: string, selector: Function, property: string, value: any) {
        let result;
        if (cy) {
            result = selector('#' + id).then((ele: any) => {
                return ele[0].ej2_instances[0][property] = value;
            });
        }
        return result;
    }

    public static getModel(id: string, selector: Function, property: string) {
        let result;
        if (cy) {
            result = selector('#' + id).then((ele: any) => {
                return ele[0].ej2_instances[0][property];
            });
        }
        return result;
    }

    public static invoke(id: string, selector: Function, fName: string, args: any[] = []) {
        let result;
        if (cy) {
            result = selector('#' + id).then((ele: any) => {
                var inst = ele[0].ej2_instances[0];
                return inst[fName].call(inst, args);
            });
        }
        return result;
    }

}



