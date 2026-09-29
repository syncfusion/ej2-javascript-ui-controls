import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoFormComponent } from './form.component';
import { AppComponent } from './app.module';
import { FormBase } from '../src/form-base'

/**
 * Form Spec
 */

describe('=> Form Component => ', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    beforeEach((done: Function) => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, DemoFormComponent],
            imports: [FormsModule]
        });

        TestBed.overrideComponent(AppComponent, {
            set: {
                template: `<form #heroForm='ngForm' (ngSubmit)='onFormSubmit(heroForm.value)' >
                            <div class='form-group'>
                                <label for='name'>Name</label>
                                <input type='text' class='form-control' id='name' value='Smith' [ngModel]='uName'  name='fname' required />
                            </div>
                            <div class='form-group'>
                                <label for='alterEgo'>Destination</label>
                                <input type='text' class='form-control' 
                                id='alterEgo' [ngModel]='dest'  name='developer' value='Developer' />
                            </div>
                            <ej2-button [value]='text' name='button' [ngModel]='text'> </ej2-button>
                            <input type='submit' value='Submit' id='butsubmit'>
                             <pre id='formData'>{{ heroForm.value | json }}</pre>
                           </form>
                           <input ej2-button />`
            }
        });
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(AppComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
            comp.dest = 'Developer';
            comp.uName = 'Sam';
            comp.text = 'Employee';
            fixture.detectChanges();
            setTimeout(() => { done(); }, 1000);
        });
    });

    it('template from initialize', () => {
        fixture.detectChanges();
        let dataJson: string = document.getElementById('formData').innerText;
        expect(JSON.parse(dataJson)).toEqual({ 'fname': 'Sam', 'developer': 'Developer', 'button': 'Employee' });
    });

    it('onFocus and onBlur event call', () => {
        let fixr = TestBed.createComponent(AppComponent);
        let instance = de.nativeElement.querySelector('.e-control').ej2_instances[0];
        let spyFun = jasmine.createSpy('focus');
        instance.focus = { emit: spyFun };
        instance.ngOnFocus();
        expect(spyFun).toHaveBeenCalled();
        let spyFun1 = jasmine.createSpy('blur');
        instance.blur = { emit: spyFun1 };
        instance.ngOnBlur();
        expect(spyFun1).toHaveBeenCalled();
    });




    // To cover coverage;

    afterAll(() => {
        el.remove();
    });

});

describe('Form Base Coverage Test', () => {
    it("Check state test case with true", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.propagateChange = jasmine.createSpy('propagateChange');
        formCmpt.localChange({ checked: true });
        expect(formCmpt.propagateChange).toHaveBeenCalledWith(true);
    });
    it("Check state test case with false", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.propagateChange = jasmine.createSpy('propagateChange');
        formCmpt.localChange({ checked: false });
        expect(formCmpt.propagateChange).toHaveBeenCalledWith(false);
    });
    it("Check state test case with value", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.propagateChange = jasmine.createSpy('propagateChange');
        formCmpt.localChange({ value: 'one' });
        expect(formCmpt.propagateChange).toHaveBeenCalledWith('one');
    });
    it("Check state test case with propagate touch", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.propagateTouch();
        formCmpt.localChange({ checked: true });
        expect(formCmpt.propagateTouch()).toEqual(undefined);
    });
    it("write value test for checkbox", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.writeValue('check')
        expect(formCmpt.value).toBe('check');
    });
    it("write value test for checked with boolean input", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.checked = false;
        formCmpt.writeValue(true)
        expect(formCmpt.checked).toBe(true);
    });
    it("write value test for checked with value input", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.checked = false;
        formCmpt.value = 'name';
        formCmpt.writeValue('name')
        expect(formCmpt.checked).toBe(true);
    });
    it("write value test for checked with value false input", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.checked = true;
        formCmpt.value = 'name';
        formCmpt.writeValue('not')
        expect(formCmpt.checked).toBe(false);
    });
    it("write value test to check with angularValue", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.value = 'name';
        formCmpt.writeValue(formCmpt.value);
        expect(formCmpt.angularValue).toBe('name');
    });
    it("write value test to check with preventChange Value", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.value = 'names';
        formCmpt.writeValue(formCmpt.value);
        expect(formCmpt.preventChange).toBe(true);
    });
    it("checking value type, if obj type do stringify", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.value = {value:{check:'hello'}};
        formCmpt.writeValue(formCmpt.value);
        formCmpt.localChange(formCmpt.value);
        let check = formCmpt.objCheck;
        let stringy = JSON.stringify(formCmpt.value.value);
        expect(check).toBe(true);
        expect(stringy).toBe(formCmpt.duplicateValue);
    });
    it("test for setDisableState", () => {
        let formCmpt: FormBase<any> = new FormBase();
        formCmpt.setDisabledState(true);
        expect(formCmpt.enabled).toEqual(false);
        expect(formCmpt.disabled).toEqual(true);
    });
})

describe('=> Form base => ', () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    beforeEach((done: Function) => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, DemoFormComponent],
            imports: [FormsModule]
        });
        TestBed.overrideComponent(AppComponent, {
            set: {
                template: `<form #heroForm='ngForm' (ngSubmit)='onFormSubmit(heroForm.value)' >
                <input ej2-button />
                           </form>
                       `
            }
        });
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        fixture.detectChanges();
        setTimeout(() => { done(); }, 10);
    });
    it('twoway binding setter called when old and newvalue same', (done: Function) => {
        let sypFunction: Function = spyOn((el.firstElementChild.children[0] as any).ej2_instances[0], 'onPropertyChanged');
        (el.firstElementChild.children[0] as any).ej2_instances[0].text = 'Text';
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(sypFunction).not.toHaveBeenCalled();
                done();
            },
            10);
    });
    it('twoway binding setter not called when old and newvalue same', (done: Function) => {
        let sypFunction: Function = spyOn((el.firstElementChild.children[0] as any).ej2_instances[0], 'onPropertyChanged');
        (el.firstElementChild.children[0] as any).ej2_instances[0].text = 'input';
        fixture.detectChanges();
        setTimeout(
            () => {
                expect(sypFunction).toHaveBeenCalled();
                done();
            },
            10);
    });


    afterAll(() => {
        el.remove();
    });
});
