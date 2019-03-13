import { Toolbar, HtmlEditor, RichTextEditor, Count, Link, Image, QuickToolbar } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent } from './../../render.spec';
import { FormValidator, ErrorOption, FormValidatorModel } from "@syncfusion/ej2-inputs";
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE  with EJ2 FormValidator - ', () => {

    let innerHtmlRule: string = `<form id="form-element" class="form-vertical">
<div class="form-group">
    <textarea id="defaultRTE" name="defaultRTE"> 
    </textarea>
</div>
<div style="text-align: center">
    <button id="validateSubmit" class="samplebtn e-control e-btn" type="submit" data-ripple="true">Submit</button>
    <button id="resetbtn" class="samplebtn e-control e-btn" type="reset" data-ripple="true">Reset</button>
</div>
</form>`;
    describe(' reset  - ', () => {
        let rteObj: RichTextEditor;
        let form: FormValidator;
        let editNode: HTMLElement;
        let containerEle: HTMLElement;
        let formEle: HTMLElement;
        let onChange: jasmine.Spy;
        beforeEach((done: Function) => {
            containerEle = document.createElement('div');
            containerEle.innerHTML = innerHtmlRule;
            onChange = jasmine.createSpy('change');
            document.body.appendChild(containerEle);
            rteObj = new RichTextEditor({
                showCharCount: true,
                maxLength: 100,
                change: onChange,
                placeholder: 'Type something'
            });
            rteObj.appendTo("#defaultRTE");
            editNode = (rteObj as any).inputElement;
            form = new FormValidator('#form-element', {
                rules: {
                    defaultRTE: {
                        required: true,
                        maxLength: "100",
                        minLength: "20"
                    }
                }
            });
            formEle = document.getElementById("form-element");
            done();
        })
        afterEach((done: Function) => {
            rteObj.destroy();
            detach(containerEle);
            done();
        });

        it(' test the reset the form ', () => {
            editNode.focus();
            dispatchEvent(editNode, 'focusin');
            editNode.innerHTML = '<p>EJ2 RichTextEditor Component</p>';
            editNode.blur();
            dispatchEvent(editNode, 'focusout');
            let element: HTMLElement = rteObj.element.querySelector('#defaultRTE-info');
            expect(rteObj.value === '<p>EJ2 RichTextEditor Component</p>').toBe(true);
            expect(isNullOrUndefined(element)).toBe(true);
            expect(onChange).toHaveBeenCalled();
            form.reset();
            expect(rteObj.value === null).toBe(true);
            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });
});
