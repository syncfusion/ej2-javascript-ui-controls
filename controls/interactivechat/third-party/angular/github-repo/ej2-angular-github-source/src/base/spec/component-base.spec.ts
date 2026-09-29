import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DemoBaseComponent } from './sample.component';
import { AppComponent } from './app.module';

/**
 * Component base
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('=> Simple Component => ', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    beforeEach((done: Function) => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, DemoBaseComponent],
        });
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        fixture.detectChanges();
        setTimeout(() => { done(); }, 10);
    });

    it('directive initialize', () => {
        expect(el.firstElementChild.classList.contains('e-control')).toBe(true);
        expect((el.firstElementChild as any).ej2_instances[0].text).toBe(comp.text);
    });

    it('input change', (done: Function) => {
        comp.text = 'Test Title';
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(el.firstElementChild.textContent).toBe('Test Title');
                done();
            }, 10);
    });

    it('twoway binding from customer component', (done: Function) => {
        comp.text = 'Content';
        let sypFunction: Function = spyOn((el.firstElementChild as any).ej2_instances[0], 'onPropertyChanged');
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(sypFunction).toHaveBeenCalledWith({ text: 'Content' }, { text: 'EJButton' });
                done();
            },
            10);
    });

    
    it('twoway binding setter not called when old and newvalue same', (done: Function) => {
        let sypFunction: Function = spyOn((el.firstElementChild as any).ej2_instances[0], 'onPropertyChanged');
        (el.firstElementChild as any).ej2_instances[0].text = 'EJButton';
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(sypFunction).not.toHaveBeenCalled();
                done();
            },
            10);
    });

    it('twoway binding set undefined value', (done: Function) => {
        let sypFunction: Function = spyOn((el.firstElementChild as any).ej2_instances[0], 'onPropertyChanged');
        (el.firstElementChild as any).ej2_instances[0].text = undefined;
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(sypFunction).toHaveBeenCalled();
                done();
            },
            10);
    });

    it('twoway binding changes control component', (done: Function) => {
        comp.val = 'EJ Change';
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(comp.text).toBe('EJ Change');
                done();
            },
            10);
    });

    afterAll(() => {
        el.remove();
    });
});

describe('=> Simple Component => ', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let sypFunction: Function;
    let destroySpy: Function;
    beforeEach((done: Function) => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, DemoBaseComponent],
        });
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        sypFunction = spyOn(comp, 'onButtonClick');
        comp.val = 'Content';
        fixture.detectChanges();
        setTimeout(() => {
            destroySpy = spyOn((el.firstElementChild as any).ej2_instances[0], 'destroy');
            done();
        }, 50);
    });

    it('output callback', (done) => {
        comp.val = 'Test';
        fixture.detectChanges();
        setTimeout(() => {
            expect(sypFunction).toHaveBeenCalled();
            done();
        }, 50);
    });

    it('destroy testcase', (done) => {
        comp.val = 'Test';
        fixture.destroy();
        setTimeout(() => {
            expect(destroySpy).toHaveBeenCalled();
            done();
        }, 50);
    });

    afterAll(() => {
        el.remove();
    });
});

describe('=> Simple Component => ', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let spyFunction: Function;
    beforeEach((done: Function) => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, DemoBaseComponent],
        });
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        spyFunction = jasmine.createSpy('eventHandler');
        comp.val = 'Content';
        fixture.detectChanges();
        comp.component.addEventListener('updated', spyFunction)
        setTimeout(() => {
            done();
        }, 50);
    });

    it('component addEventListener', (done) => {
        comp.val = 'Test';
        fixture.detectChanges();
        setTimeout(() => {
            expect(spyFunction).toHaveBeenCalled();
            done();
        }, 50);
    });

    it('component removeEventListener', (done) => {
        comp.component.removeEventListener('updated', spyFunction);
        comp.val = 'Test';
        fixture.destroy();
        setTimeout(() => {
            expect(spyFunction).not.toHaveBeenCalled();
            done();
        }, 50);
    });

    afterAll(() => {
        el.remove();
    });
});