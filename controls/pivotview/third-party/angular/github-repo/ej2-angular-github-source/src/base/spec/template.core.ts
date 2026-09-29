import {
    Component, Complex, Collection, NotifyPropertyChanges,
    Property, INotifyPropertyChanged, ChildProperty
} from '@syncfusion/ej2-base';
import { append } from '@syncfusion/ej2-base';
import { compile } from '@syncfusion/ej2-base';

/**
 * Demo
 */
@NotifyPropertyChanges
export class TemplateBase extends Component<HTMLElement> implements INotifyPropertyChanged {

    @Property([])
    public dataSource: any;

    @Property('String')
    public template: any

    public tooltip: Object = {
        template: 'check'
    }

    public items: any = [];

    constructor(ele?: HTMLElement, properties?: Object) {
        super(properties, ele);
    }

    public onPropertyChanged(newProp: any, oldProp: any): void {
    }

    public preRender(): void {
        /** No Code */
    }

    public render(): void {
        this.controlRender();
        this.compileItem();
        /** No Code */
    }

    private controlRender(): void {
        let templateCompiler: Function = compile(this.template);
        for (let data of this.dataSource) {
            append(templateCompiler(data,this, 'template'), this.element);
        }

    }

    private compileItem(): void {
        for (let item of this.items) {
            if (item.template) {
                let templateCompiler: Function = compile(item.template);
                append(templateCompiler(item.dataSource), this.element);
            }

        }
    }

    public getModuleName(): string {
        return 'template';
    }

    public getPersistData(): string {
        return '';
    }

}
