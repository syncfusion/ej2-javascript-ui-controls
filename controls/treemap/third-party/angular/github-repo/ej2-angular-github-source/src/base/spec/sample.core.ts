import { Component,Complex, Collection, NotifyPropertyChanges, Property, Event, INotifyPropertyChanged, ChildProperty } from "@syncfusion/ej2-base";

/**
 * Demo
 */

export class SubChildProp extends ChildProperty<ChildProp>{

    @Property('Child')
    public text?: string;

    @Property(true)
    public header?: string;

}

export class ChildProp extends ChildProperty<ChildProp>{

    @Property('Child')
    public text: string;

    @Property(true)
    public header: string;

    @Collection<SubChildProp>([], SubChildProp)
    public subChilds: SubChildProp[];

    @Complex<Object>({}, SubChildProp)
    public subComplexChilds: SubChildProp;

}


@NotifyPropertyChanges
export class DemoBase extends Component<HTMLElement> implements INotifyPropertyChanged {

    @Property('Text')
    public text: string;

    @Property('10px')
    public width: string;

    @Property('10px')
    public height: string;

    @Property('10px')
    public size: string;

    @Property('Button')
    public value: string;

    @Collection<ChildProp>([], ChildProp)
    public childs: ChildProp[];

    @Collection<ChildProp>([], ChildProp)
    public child2s: ChildProp[];

    @Event()
    public change: Object;

    @Event()
    public updated: Object;

    constructor(ele?: HTMLElement, properties?: Object) {
        super(properties, ele);
    }

    public onPropertyChanged(newProp: any, oldProp: any): void {
        /** No Code */
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'text':
                    this.setProperties({ value: this.text }, true);
                    this.element.innerHTML = '<span>' + this.text + '</span>';
                    this.trigger('change', { value: this.value });
                    break;
                case 'value':
                    this.setProperties({ text: this.value }, true);
                    this.element.innerHTML = '<span>' + this.text + '</span>';
                    this.trigger('change', { value: this.value });
                    this.trigger('updated', { value: this.value });
                    break;
                case 'childs':
                    this.controlRender();
                    break;
            }
        }
    }

    public preRender(): void {
        /** No Code */
    }

    public render(): void {
        this.controlRender();
        /** No Code */
    }

    private controlRender(): void {
        let content: string = '<span>' + this.text + '</span>';
        if (this.childs) {
            for (let child of this.childs) {
                content = content + '<div>' + child.text + (child.header ? 'Header' : '');
                if (child.subChilds) {
                    for (let subChild of child.subChilds) {
                        content = content + '<span>' + subChild.text + '</span>';
                    }
                }
                content = content + '</div>';
            }
        }
        this.element.innerHTML = content;
    }

    public getModuleName(): string {
        return 'sample';
    }

    public getPersistData(): string {
        return '';
    }

}
