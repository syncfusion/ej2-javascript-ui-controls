import { Component, ElementRef, Inject, ContentChild, Directive, ContentChildren, forwardRef, Injector } from '@angular/core';
import { ComponentBase, IComponentBase } from '../src/component-base';
import { ComplexBase, ArrayBase } from '../src/complex-array-base';
import { applyMixins, ComponentMixins } from '../src/util';
import { DemoBase } from './sample.core';


/**
 * Complex Component
 */
@Directive({
    selector: 'e-sub-childs>e-sub-child',
    inputs: ['header', 'text']
})
export class SubChildDirective extends ComplexBase<ChildDirective> {
    constructor() {
        super();
    }
}

@Directive({
    selector: 'e-childs>e-sub-childs',
    queries: {
        children: new ContentChildren(SubChildDirective)
    },
})
export class SubChildsDirective extends ArrayBase<SubChildsDirective> {
    constructor() {
        super('subChild');
    }
}

@Directive({
    selector: 'e-child2s>e-child2',
    inputs: ['header', 'text'],
})
export class Child2Directive extends ComplexBase<Child2Directive> {
    constructor() {
        super();
    }
}


@Directive({
    selector: 'ej2-control>e-child2s',
    queries: {
        children: new ContentChildren(Child2Directive)
    },
})
export class Child2sDirective extends ArrayBase<Child2sDirective> {
    constructor() {
        super('child2');
    }
}

@Directive({
    selector: 'e-childs>e-child',
    inputs: ['header', 'text', 'subChilds'],
    outputs:['click'],
    queries: {
        childSubChilds: new ContentChild(SubChildsDirective)
    }
})
export class ChildDirective extends ComplexBase<ChildDirective> {
    public tags: string[] = ['subChilds'];
    constructor() {
        super();
        this.registerEvents(['click'])
    }
}


@Directive({
    selector: 'ej2-control>e-childs',
    queries: {
        children: new ContentChildren(ChildDirective)
    },
})
export class ChildsDirective extends ArrayBase<ChildsDirective> {
    constructor() {
        super('child');
    }
}



@Component({
    selector: 'ej2-control',
    inputs: ['text', 'childs', 'width', 'value'],
    outputs: ['textChange'],
    template: '',
    queries: {
        childChilds: new ContentChild(ChildsDirective),
        childChild2s: new ContentChild(Child2sDirective)
    }
})
@ComponentMixins([ComponentBase])
export class ControlComponent extends DemoBase implements IComponentBase {

    public tags: string[] = ['childs', 'child2s'];

    constructor( @Inject(ElementRef) private ngEle: ElementRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.registerEvents(['click']);
        this.addTwoWay.call(this, ['text']);
        this.createElement('div');
    }

    public registerEvents: (eventList: string[]) => void;
    public addTwoWay: (propList: string[]) => void;

}

export const ControlComponents = [ControlComponent, ChildDirective, ChildsDirective, SubChildDirective, SubChildsDirective];