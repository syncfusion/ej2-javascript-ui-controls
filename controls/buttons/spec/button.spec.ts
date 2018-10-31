import { Button } from '../src/button/button';
import { createElement, detach } from '@syncfusion/ej2-base';
/**
 * @param  {} 'Button'
 * @param  {} function(
 */
describe('Button', () => {
    let button: Button;
    let element: any = createElement('button', { id: 'button' });
    document.body.appendChild(element);

    describe('DOM', () => {
        afterEach(() => {
            button.destroy();
        });

        it('Normal button testing', () => {
            button = new Button();
            button.appendTo('#button');
            expect(element.classList.contains('e-btn')).toEqual(true);
        });

        it('Primary button testing', () => {
            button = new Button({ isPrimary: true });
            button.appendTo('#button');
            expect(element.classList.contains('e-primary')).toEqual(true);
        });

        it('Disable state testing', () => {
            button = new Button({ disabled: true });
            button.appendTo('#button');
            expect(element.getAttribute('disabled')).toEqual('');
        });

        it('Small button testing', () => {
            button = new Button({ cssClass: 'e-small' });
            button.appendTo('#button');
            expect(element.classList.contains('e-small')).toEqual(true);
        });

        it('Icon button testing', () => {
            button = new Button({ iconCss: 'iconcss' });
            button.appendTo('#button');
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
        });

        it('Icon and text button testing', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss' });
            button.appendTo('#button');
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
            expect(element.textContent).toEqual('Button');
        });

        it('Text and Icon button testing', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss', iconPosition: 'Right' });
            button.appendTo('#button');
            expect(element.textContent).toEqual('Button');
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
        });

        it('Text and Top Icon button testing', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss', iconPosition: 'Top' });
            button.appendTo('#button');
            expect(element.classList).toContain('e-top-icon-btn');
            expect(element.childNodes[0].classList).toContain('e-icon-top');
        });

        it('Text and Bottom Icon button testing', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss', iconPosition: 'Bottom' });
            button.appendTo('#button');
            expect(element.classList).toContain('e-bottom-icon-btn');
            expect(element.childNodes[1].classList).toContain('e-icon-bottom');
        });

        it('RTL testing', () => {
            button = new Button({ enableRtl: true });
            button.appendTo('#button');
            expect(element.classList.contains('e-rtl')).toEqual(true);
        });

        it('CSS class testing', () => {
            button = new Button({ cssClass: 'e-secondary' });
            button.appendTo('#button');
            expect(element.classList.contains('e-secondary')).toEqual(true);
        });

        it('Content testing', () => {
            button = new Button({ content: '<span class="e-icons e-btn-icon e-add-icon e-icon-left"></span>Button' }, '#button');
            expect(element.childNodes[0].nodeName).toEqual('SPAN');
            expect(element.textContent).toEqual('Button');
        });

        it('Content and IconCss Testing', () => {
            button = new Button({ content: 'Button', iconCss: 'e-icons e-add-icon' }, '#button');
            expect(element.childNodes[0].nodeName).toEqual('SPAN');
            expect(element.textContent).toEqual('Button');
            button.destroy();
            button = new Button({ content: '<div>Button</div>', iconCss: 'e-icons e-add-icon', iconPosition: 'Right' }, '#button');
            expect(element.childNodes[0].nodeName).toEqual('DIV');
            expect(element.childNodes[1].nodeName).toEqual('SPAN');
            expect(element.textContent).toEqual('Button');
        });

        it('Toggle Button Testing', () => {
            button = new Button({ content: 'Button', isToggle: true }, '#button');
            button.element.click();
            expect(element.classList).toContain('e-active');
            button.element.click();
            expect(element.classList).not.toContain('e-active');
        });
    });

    describe('Property', () => {
        afterEach(() => {
            button.destroy();
        });

        it('Primary button testing', () => {
            button = new Button({ isPrimary: true });
            button.appendTo('#button');
            expect(button.isPrimary).toEqual(true);
        });

        it('Disable state testing', () => {
            button = new Button({ disabled: true });
            button.appendTo('#button');
            expect(button.disabled).toEqual(true);
        });

        it('Icon button testing', () => {
            button = new Button({ iconCss: 'iconcss' });
            button.appendTo('#button');
            expect(button.iconCss).toEqual('iconcss');
        });

        it('Icon and text button testing', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss' });
            button.appendTo('#button');
            expect(button.iconCss).toEqual('iconcss');
            expect(button.iconPosition).toEqual('Left');
        });

        it('Text and Icon button testing', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss', iconPosition: 'Right' });
            button.appendTo('#button');
            expect(button.iconCss).toEqual('iconcss');
            expect(button.iconPosition).toEqual('Right');
        });

        it('RTL testing', () => {
            button = new Button({ enableRtl: true });
            button.appendTo('#button');
            expect(button.enableRtl).toEqual(true);
        });

        it('CSS class testing', () => {
            button = new Button({ cssClass: 'e-secondary' });
            button.appendTo('#button');
            expect(button.cssClass).toEqual('e-secondary');
        });

        it('Content testing', () => {
            button = new Button({ content: '<span class="e-icons e-btn-icon e-add-icon e-icon-left"></span>Button' }, '#button');
            expect(button.content).toEqual('<span class="e-icons e-btn-icon e-add-icon e-icon-left"></span>Button');
        });

        it('Toggle Button Testing', () => {
            button = new Button({ isToggle: true }, '#button');
            expect(button.isToggle).toEqual(true);
        });
    });

    describe('notify property changes of', () => {
        afterEach(() => {
            button.destroy();
        });

        it('Primary in onPropertyChanged', () => {
            button = new Button();
            button.appendTo('#button');
            button.isPrimary = true;
            button.dataBind();
            expect(element.classList.contains('e-primary')).toEqual(true);
            button.isPrimary = false;
            button.dataBind();
            expect(element.classList.contains('e-primary')).toEqual(false);
        });

        it('Disabled in onPropertyChanged', () => {
            button = new Button();
            button.appendTo('#button');
            button.disabled = true;
            button.dataBind();
            expect(element.getAttribute('disabled')).toEqual('');
            button.disabled = false;
            button.dataBind();
            expect(element.getAttribute('disabled')).toEqual(null);
        });

        it('IconCss in onPropertyChanged', () => {
            button = new Button({ iconCss: 'icon', content: 'iconcss' });
            button.appendTo('#button');
            button.iconCss = 'iconcss';
            button.dataBind();
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
            element.innerHTML = '';
            button.iconCss = 'iconclass';
            button.dataBind();
            expect(element.children[0].classList.contains('iconclass')).toEqual(true);
            button.destroy();
            button.iconPosition = 'Right';
            button.iconCss = 'iconcss';
            button.dataBind();
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
        });

        it('IconPosition right in onPropertyChanged', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss' });
            button.appendTo('#button');
            button.iconCss = 'icon-right';
            button.iconPosition = 'Right';
            button.dataBind();
            expect(element.textContent).toEqual('Button');
            expect(element.children[0].classList.contains('icon-right')).toEqual(true);
            expect(element.children[0].classList.contains('e-icon-right')).toEqual(true);
        });

        it('IconPosition left in onPropertyChanged', () => {
            element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss', iconPosition: 'Right' });
            button.appendTo('#button');
            button.iconPosition = 'Left';
            button.dataBind();
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
            expect(element.textContent).toEqual('Button');
            button.destroy();
            button.element.innerHTML = '';
            button.element.textContent = 'Button';
            button = new Button({ iconCss: 'iconcss' });
            button.appendTo('#button');
            detach(button.element.getElementsByTagName('span')[0]);
            button.iconPosition = 'Right';
            button.dataBind();
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
            expect(element.textContent).toEqual('Button');
        });

        it('CssClass in onPropertyChanged', () => {
            button = new Button({ cssClass: 'class' });
            button.appendTo('#button');
            button.cssClass = 'styleclass';
            button.dataBind();
            expect(element.classList.contains('styleclass')).toEqual(true);
            button = new Button();
            button.appendTo('#button');
            button.cssClass = 'styleclass';
            button.dataBind();
            expect(element.classList.contains('styleclass')).toEqual(true);
        });

        it('EnableRtl in onPropertyChanged', () => {
            button = new Button();
            button.appendTo('#button');
            button.enableRtl = true;
            button.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
            button.enableRtl = false;
            button.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
        });

        it('Content in onPropertyChanged', () => {
            button = new Button();
            button.appendTo('#button');
            button.content = 'play';
            button.dataBind();
            expect(element.textContent).toEqual('play');
            button.iconCss = 'e-icons e-add-icon';
            button.iconPosition = 'Left';
            button.dataBind();
            expect(element.childNodes[0].nodeName).toEqual('SPAN');
            expect(element.childNodes[1].nodeName).toEqual('#text');
            expect(element.textContent).toEqual('play');
            button.element.innerHTML = '';
            button.content = 'Content';
            button.dataBind();
            expect(element.childNodes[0].nodeName).toEqual('SPAN');
            expect(element.textContent).toEqual('Content');
        });

        it('Toggle in onPropertyChanged', () => {
            button = new Button({}, '#button');
            button.isToggle = true;
            button.dataBind();
            button.element.click();
            expect(element.classList).toContain('e-active');
            button.isToggle = false;
            button.dataBind();
            button.element.click();
            expect(element.classList).not.toContain('e-active');
        });
    });

    describe('methods', () => {
        it('destroy method', () => {
            button = new Button();
            button.appendTo('#button');
            button.destroy();
            expect(element.classList.contains('e-btn')).toEqual(false);
        });

        it('getModuleName method', () => {
            button = new Button();
            button.appendTo('#button');
            expect(button.getModuleName()).toEqual('btn');
        });

        it('getPersistData & inject method', () => {
            button = new Button({ enablePersistence: true });
            button.appendTo('#button');
            expect(button.getPersistData()).toEqual('{}');
            Button.Inject();
        });
    });
});