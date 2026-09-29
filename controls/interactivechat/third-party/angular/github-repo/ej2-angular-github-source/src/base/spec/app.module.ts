import { Component, ViewChild } from '@angular/core';
import { DemoBaseComponent } from './sample.component'
/**
 * App Module
 */
@Component({
    selector: 'app-component',
    template: `
    <ej2-button #component [(value)]='val' [(text)]='text' (updated)='onButtonClick()' ></ej2-button>
    <p>{{text}}</p>
    `
})
export class AppComponent {
    public uName: string = '';
    public dest: string = '';
    public text: string = 'EJButton';
    public val: string = '';
    public check: boolean = false;
    public child1: Object = { text: 'Child1', header: true };
    public child2: Object = { text: 'Child2', header: false };
    public child3: Object = { text: 'Child3', header: true };
    public new: any = [
        this.child1,
        this.child2,
        this.child3
    ];

    @ViewChild('component')
    public component: DemoBaseComponent;

    constructor() {
        //Todo
    }

    public onButtonClick(): void {
        // Todo 
    }

    public onFocus(): void {
        // Todo 
    }

    public onBlur(): void {
        // Todo 
    }

    public onFormSubmit(data: any): void {
        //Todo
    }


}
