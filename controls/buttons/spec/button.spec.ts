/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '../src/button/button';
import { Browser, createElement, detach } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';

/**
 * @param  {} 'Button'
 * @param  {} function(
 */
describe('Button', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });

    let button: Button;
    const element: any = createElement('button', { id: 'button' });
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

        it('Enable Html Sanitizer testing', () => {
            button = new Button({ content: 'Button<style>body{background:rgb(0, 0, 255)}</style>' }, '#button');
            const htmlele: Element = document.body;
            expect(button.content).toEqual('Button<style>body{background:rgb(0, 0, 255)}</style>');
            expect(window.getComputedStyle(htmlele).backgroundColor).not.toBe('rgb(0, 0, 255)');
        });

        it('Enable Html Sanitizer disabled testing', () => {
            button = new Button({ content: '<style>body{background:rgb(0, 0, 255)}</style>', enableHtmlSanitizer: false }, '#button');
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).toBe('rgb(0, 0, 255)');
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

        it('destroy method with extra space of cssClass property', () => {
            button = new Button({cssClass: 'e-custom '});
            button.appendTo('#button');
            button.cssClass = "e-custom e-css ";
            button.dataBind();
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
        it('Native methods - Click and Focus ', () => {
            button = new Button();
            button.appendTo('#button');
            button.click();
            button.focusIn();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    describe('Null or undefined value testing', () => {
        afterEach(() => {
            button.destroy();
        });

        it('Primary button testing', () => {
            button = new Button({ isPrimary: null });
            button.appendTo('#button');
            expect(button.isPrimary).toEqual(null);
            button = new Button({ isPrimary: undefined });
            button.appendTo('#button');
            expect(button.isPrimary).toEqual(false);
        });

        it('Disable state testing', () => {
            button = new Button({ disabled: null });
            button.appendTo('#button');
            expect(button.disabled).toEqual(null);
            button = new Button({ disabled: undefined });
            button.appendTo('#button');
            expect(button.disabled).toEqual(false);
        });

        it('Icon button testing', () => {
            button = new Button({ iconCss: null });
            button.appendTo('#button');
            expect(button.iconCss).toEqual(null);
            button = new Button({ iconCss: undefined });
            button.appendTo('#button');
            expect(button.iconCss).toEqual('');
        });

        it('Icon Position button testing', () => {
            button = new Button({ iconPosition: null });
            button.appendTo('#button');
            expect(button.iconCss).toEqual('');
            button = new Button({ iconPosition: undefined });
            button.appendTo('#button');
            expect(button.iconCss).toEqual('');
        });

        it('RTL testing', () => {
            button = new Button({ enableRtl: null });
            button.appendTo('#button');
            expect(button.enableRtl).toEqual(false);
            button = new Button({ enableRtl: undefined });
            button.appendTo('#button');
            expect(button.enableRtl).toEqual(false);
        });

        it('CSS class testing', () => {
            button = new Button({ cssClass: null });
            button.appendTo('#button');
            expect(button.cssClass).toEqual(null);
            button = new Button({ cssClass: undefined });
            button.appendTo('#button');
            expect(button.cssClass).toEqual('');
        });

        it('Content testing', () => {
            button = new Button({ content: null }, '#button');
            expect(button.content).toEqual(null);
            button = new Button({ content: undefined }, '#button');
            expect(button.content).toEqual('');
        });

        it('Toggle Button Testing', () => {
            button = new Button({ isToggle: null }, '#button');
            expect(button.isToggle).toEqual(null);
            button = new Button({ isToggle: undefined }, '#button');
            expect(button.isToggle).toEqual(false);
        });

        it('EnablePersistence Button Testing', () => {
            button = new Button({ enablePersistence: null }, '#button');
            expect(button.enablePersistence).toEqual(null);
            button = new Button({ enablePersistence: undefined }, '#button');
            expect(button.enablePersistence).toEqual(false);
        });

        it('Enable Html Sanitizer testing', () => {
            button = new Button({ enableHtmlSanitizer: null }, '#button');
            expect(button.enableHtmlSanitizer).toEqual(null);
            button = new Button({ enableHtmlSanitizer: undefined }, '#button');
            expect(button.enableHtmlSanitizer).toEqual(true);
        });

    });

});