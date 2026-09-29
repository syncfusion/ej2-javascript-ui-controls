import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TemplateComponent, ListItem, ListItems, SubListItem, SubListItems } from './template.component';
import { TemplateApp } from './app.template.component';

/**
 * Component base
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('=> Template Component => ', () => {
    let comp: TemplateApp;
    let fixture: ComponentFixture<TemplateApp>;
    let de: DebugElement;
    let el: HTMLElement;
    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [TemplateApp, TemplateComponent,
                ListItem, ListItems, SubListItem, SubListItems]
        });
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TemplateApp);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            fixture.detectChanges();
            setTimeout(() => { done(); }, 100);
        });
    });
    it('render template', () => {
        //Spec will throw the console error due to testbed issue
        // https://github.com/angular/angular/issues/17013
        expect(el.querySelectorAll('.text-template').length).toBe(2);
    });

    it('clear component all template', () => {
        let controlInstance: any = (el as any).querySelector('.e-control').ej2_instances[0];
        controlInstance.clearTemplate();
        let keys: string[] = Object.keys(controlInstance.registeredTemplate);
        expect(keys.length).toBe(0);
        keys = Object.keys(controlInstance.tagObjects[0].instance.list[0].registeredTemplate);
        expect(keys.length).toBe(0);
    });

    it('clear component template after remove element', () => {
        let controlInstance: any = (el as any).querySelector('.e-control').ej2_instances[0];
        controlInstance.clearTemplate(['template']);
        let keys: string[] = Object.keys(controlInstance.registeredTemplate);
        expect(keys.length).toBe(0);
        keys = Object.keys(controlInstance.tagObjects[0].instance.list[0].registeredTemplate);
        expect(keys.length).toBe(1);
    });


    it('clear child template after remove element', () => {
        let controlInstance: any = (el as any).querySelector('.e-control').ej2_instances[0];
        controlInstance.clearTemplate(['items.template']);
        let keys: string[] = Object.keys(controlInstance.tagObjects[0].instance.list[0].registeredTemplate);
        expect(keys.length).toBe(0);
    });

    it('clear 2nd level child template after remove element', () => {
        let controlInstance: any = (el as any).querySelector('.e-control').ej2_instances[0];
        controlInstance.clearTemplate(['items.template', 'items.subitems.template']);
        let keys: string[] = Object.keys(controlInstance.tagObjects[0].instance.list[0].registeredTemplate);
        expect(keys.length).toBe(0);
    });

    it('complex component template setting', () => {
        let controlInstance: any = (el as any).querySelector('.e-control').ej2_instances[0];
        expect(controlInstance.tooltip.template).toBe(controlInstance.tooltip_template);
    });

    afterEach(() => {
        el.remove();
    });
});

describe('=> Template Component => ', () => {
    let comp: TemplateApp;
    let fixture: ComponentFixture<TemplateApp>;
    let de: DebugElement;
    let el: HTMLElement;
    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [TemplateApp, TemplateComponent,
                ListItem, ListItems, SubListItem, SubListItems]
        });
        /* tslint:disable */
        TestBed.overrideComponent(TemplateApp, {
            set: {
                template: `<ej2-list #comp [dataSource]='data' [template]='commonTemplate'></ej2-list>
     <ng-template #commonTemplate let-data>
     <div class='text-template'> {{ data.name }}</div>
 </ng-template>`
            }
        });
        /* tslint:enable */
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TemplateApp);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            fixture.detectChanges();
            delete comp.compInstance.template.elementRef.nativeElement._viewContainerRef;            
            setTimeout(() => {
                done(); 
            }, 100);
        });
    });
    it('render with shared template', () => {
        //Spec will throw the console error due to testbed issue
        // https://github.com/angular/angular/issues/17013
        expect(el.querySelectorAll('.text-template').length).toBe(2);
    });

    afterEach(() => {
        el.remove();
    });
});

describe('=> String Template Component => ', () => {
    let comp: TemplateApp;
    let fixture: ComponentFixture<TemplateApp>;
    let de: DebugElement;
    let el: HTMLElement;
    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [TemplateApp, TemplateComponent,
                ListItem, ListItems, SubListItem, SubListItems]
        });

        /* tslint:disable */
        TestBed.overrideComponent(TemplateApp, {
            set: {
                template: `<ej2-list [dataSource]='data' [template]='tmpl'>
                
     </ej2-list>`
            }
        });
        /* tslint:enable */

        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TemplateApp);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            fixture.detectChanges();
            setTimeout(() => { done(); }, 100);
        });
    });
    it('string template', () => {
        expect((el.querySelector('.e-control') as any).ej2_instances[0].template).toBe('<div>dataCheck</div>');
    });

    
    afterEach(() => {
        el.remove();
    });
});