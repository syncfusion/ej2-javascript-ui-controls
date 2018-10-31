import { ColorPicker, ColorPickerEventArgs, BeforeOpenCloseEventArgs, OpenEventArgs, PaletteTileEventArgs } from '../src/color-picker/color-picker';
import { createElement, Browser, select, L10n, setStyleAttribute } from '@syncfusion/ej2-base';

function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
    let mouseEve: MouseEvent = document.createEvent("MouseEvents");
    if (x && y) {
        mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
    } else {
        mouseEve.initEvent(eventType, true, true);
    }
    node.dispatchEvent(mouseEve);
}

function setStyles(element: HTMLElement) {
    setStyleAttribute(element, { 'width': '200px' });
    setStyleAttribute(element.querySelector('.e-hsv-color'), { 'width': '200px', 'height': '150px' });
}


function triggerTouchEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
    let touchEvent: UIEvent = document.createEvent('UIEvent');
    touchEvent.initUIEvent(eventType, true, true, window, null);
    node.dispatchEvent(touchEvent);
}

/**
 * @param  {} 'ColorPicker'
 * @param  {} function
 */
describe('ColorPicker', () => {
    let colorPicker: any;
    let element: HTMLInputElement = createElement('input', { id: 'color-picker', attrs: { 'type': 'color' } }) as HTMLInputElement;
    let target: HTMLElement;

    describe('Dom', () => {
        let ele: Element;
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        it('Default Testing', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            expect(element.classList.contains('e-colorpicker')).toBeTruthy();
            expect(element.parentElement.classList.contains('e-colorpicker-wrapper')).toBeTruthy();
            expect(element.parentElement.querySelector('.e-split-btn').classList.contains('e-split-colorpicker')).toBeTruthy();
            expect(element.parentElement.querySelector('.e-btn-icon').classList.contains('e-selected-color')).toBeTruthy();
            let popup: HTMLElement = document.getElementById(element.parentElement.querySelector('.e-split-btn').getAttribute('aria-owns'));
            ele = popup.children[0];
            expect(ele.classList.contains('e-colorpicker-container'));
            (colorPicker.splitBtn.element.nextElementSibling as HTMLElement).click();
            expect(ele.children[0].classList.contains('e-hsv-container')).toBeTruthy();
            expect(ele.children[1].classList.contains('e-slider-preview')).toBeTruthy();
            expect(ele.children[2].classList.contains('e-selected-value')).toBeTruthy();
            expect(ele.children[2].querySelector('e-hex-value')).toBeDefined();
            expect(ele.children[3].classList.contains('e-switch-ctrl-btn')).toBeTruthy();
            expect(ele.children[3].children[0].classList.contains('e-mode-switch-btn')).toBeTruthy();
            expect(ele.children[3].children[1].classList.contains('e-ctrl-btn')).toBeTruthy();
            expect(ele.children[3].children[1].children[0].classList.contains('e-apply')).toBeTruthy();
            expect(ele.children[3].children[1].children[1].classList.contains('e-cancel')).toBeTruthy();
        });

        it('Flat Picker', () => {
            colorPicker = new ColorPicker({ mode: 'Picker', inline: true, modeSwitcher: false, showButtons: false }, '#color-picker');
            ele = element.nextElementSibling;
            expect(ele.classList.contains('e-color-picker')).toBeTruthy();
            expect(ele.children[0].classList.contains('e-hsv-container')).toBeTruthy();
            expect(ele.children[0].children[0].classList.contains('e-hsv-color')).toBeTruthy();
            expect(ele.children[0].children[1].classList.contains('e-handler')).toBeTruthy();
            expect(ele.children[1].classList.contains('e-slider-preview')).toBeTruthy();
            expect(ele.children[1].children[0].children[0].children[0].classList.contains('e-hue-slider')).toBeTruthy();
            expect(ele.children[1].children[0].children[1].children[0].classList.contains('e-opacity-slider')).toBeTruthy();
            expect(ele.querySelector('.e-switch-ctrl-btn')).toBeNull();
        });

        it('Flat Palette', () => {
            colorPicker = new ColorPicker({ mode: 'Palette', inline: true }, '#color-picker');
            ele = element.nextElementSibling;
            expect(ele.classList.contains('e-color-palette')).toBeTruthy();
            expect(ele.children[0].classList.contains('e-palette')).toBeTruthy();
            expect(ele.children[0].children[0].classList.contains('e-row')).toBeTruthy();
            expect(ele.children[0].children[0].children[0].classList.contains('e-tile')).toBeTruthy();
        });
    });

    describe('Property', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        it('Type testing', () => {
            colorPicker = new ColorPicker({ mode: 'Picker' }, '#color-picker');
            expect(colorPicker.mode).toBe('Picker');
        });

        it('Inline testing', () => {
            colorPicker = new ColorPicker({ inline: true }, '#color-picker');
            expect(colorPicker.inline).toBe(true);
        });

        it('Value testing', () => {
            colorPicker = new ColorPicker({ mode: 'Palette', value: '#5f2796' }, '#color-picker');
            expect(colorPicker.value).toEqual('#5f2796ff');
            colorPicker.destroy();
            //ColorPicker with no value
            colorPicker = new ColorPicker({}, '#color-picker');
            expect(colorPicker.value).toEqual('#008000ff');
            //ColorPicker with null value
            colorPicker = new ColorPicker({ value: '' }, '#color-picker');
            expect(colorPicker.value).toEqual('#008000ff');
        });

        it('presetColors testing', () => {
            colorPicker = new ColorPicker({ mode: 'Palette', presetColors: { 'custom': ['#EF5350', '#D81B60'] } }, '#color-picker');
            expect(colorPicker.presetColors).toEqual({ 'custom': ['#EF5350', '#D81B60'] });
            (colorPicker.splitBtn.element.nextElementSibling as HTMLElement).click();
            expect(colorPicker.container.querySelectorAll('.e-palette')[0].children[0].children[0].getAttribute('aria-label')).toBe('#ef5350ff');
            colorPicker.destroy();
            //Palettes with multiple custom tiles.
            colorPicker = new ColorPicker(
                {
                    mode: 'Palette',
                    inline: true,
                    presetColors: { 'custom1': ['#EF5350', '#D81B60'], 'custom2': ['#5f2796'] }
                },
                '#color-picker');
            expect(colorPicker.container.querySelectorAll('.e-palette')[1].children[0].children[0].getAttribute('aria-label')).toBe('#5f2796ff');
        });

        it('cssClass testing', () => {
            colorPicker = new ColorPicker({ cssClass: 'e-demo' }, '#color-picker');
            expect(colorPicker.cssClass).toBe('e-demo');
            expect(element.parentElement.classList.contains('e-demo')).toBeTruthy();
        });

        it('Disabled testing', () => {
            colorPicker = new ColorPicker({ inline: true, disabled: true }, '#color-picker');
            expect(colorPicker.disabled).toBe(true);
            expect(element.parentElement.classList.contains('e-disabled')).toBeTruthy();
            ([].slice.call(element.nextElementSibling.querySelectorAll('.e-switch-ctrl-btn button')) as Element[]).forEach(ele => {
                expect(ele.hasAttribute('disabled')).toBeTruthy();
            });
            colorPicker.disabled = false;
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-disabled')).toBeFalsy();
            ([].slice.call(element.nextElementSibling.querySelectorAll('.e-switch-ctrl-btn button')) as Element[]).forEach(ele => {
                expect(ele.hasAttribute('disabled')).toBeFalsy();
            });
            colorPicker.disabled = true;
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-disabled')).toBeTruthy();
            ([].slice.call(element.nextElementSibling.querySelectorAll('.e-switch-ctrl-btn button')) as Element[]).forEach(ele => {
                expect(ele.hasAttribute('disabled')).toBeTruthy();
            });
            colorPicker.mode = 'Palette';
            colorPicker.disabled = false;
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-disabled')).toBeFalsy();
            colorPicker.disabled = true;
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-disabled')).toBeTruthy();
        });

        it('Rtl testing', () => {
            colorPicker = new ColorPicker({ enableRtl: true }, '#color-picker');
            expect(colorPicker.enableRtl).toBe(true);
            expect(element.parentElement.classList.contains('e-rtl')).toBeTruthy();
            expect(element.nextElementSibling.classList.contains('e-rtl')).toBeTruthy();
            expect(colorPicker.container.parentElement.classList.contains('e-rtl')).toBeTruthy();
        });

        it('ShowButtons Testing', () => {
            colorPicker = new ColorPicker({ showButtons: false }, '#color-picker');
            expect(colorPicker.container.querySelector('e-ctrl-btn')).toBeNull();
        });

        it('modeSwitcher Testing', () => {
            colorPicker = new ColorPicker({ modeSwitcher: false }, '#color-picker');
            expect(colorPicker.container.querySelector('e-mode-switch-btn')).toBeNull();
        });

        it('noColor Testing', () => {
            colorPicker = new ColorPicker({ mode: 'Palette', modeSwitcher: false, noColor: true }, '#color-picker');
            colorPicker.toggle();
            target = colorPicker.container.querySelectorAll('.e-row')[0].children[0];
            expect(target.classList.contains('e-nocolor-item')).toBeTruthy();
        });

        it('enableOpacity Property changes', () => {
            colorPicker = new ColorPicker({ enableOpacity: false }, '#color-picker');
            expect(colorPicker.enableOpacity).toBeFalsy();
            expect(colorPicker.container.parentElement.classList.contains('e-hide-opacity')).toBeTruthy();
        });
    });

    describe('Methods', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        it('Get value', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            expect(colorPicker.getValue('rgba(225, 76, 20, 0.5)', 'hexa')).toEqual('#e14c1480');
            expect(colorPicker.getValue('rgb(225, 76, 20)', 'HEX')).toEqual('#e14c14');
            expect(colorPicker.getValue('rgb(225, 76, 20)', 'HSV')).toEqual('hsv(16,91.1,88.2)');
            expect(colorPicker.getValue('rgb(225, 76, 20, 0.5)', 'HSVA')).toEqual('hsva(16,91.1,88.2,0.5)');
            expect(colorPicker.getValue('rgb(225, 76, 20, 0.5)', 'HSL')).toEqual('null');
            expect(colorPicker.getValue('hsva(302, 76, 20, 0.5)', 'HEXA')).toEqual('#330c3280');
            expect(colorPicker.getValue('hsv(302, 76, 20)', 'HEX')).toEqual('#330c32');
            expect(colorPicker.getValue('hsv(302, 76, 20)', 'RGB')).toEqual('rgb(51,12,50)');
            expect(colorPicker.getValue('hsva(302, 76, 20)', 'RGB')).toEqual('rgb(51,12,50)');
            expect(colorPicker.getValue('hsva(302, 76, 20, 0.5)', 'RGBA')).toEqual('rgba(51,12,50,0.5)');
            expect(colorPicker.getValue('hsv(302, 76, 20, 0.5)', 'HSL')).toEqual('null');
            expect(colorPicker.getValue('a207f580', 'HSVA')).toEqual('hsva(279,97.1,96.1,0.5)');
            expect(colorPicker.getValue('#a207f580', 'HSV')).toEqual('hsv(279,97.1,96.1)');
            expect(colorPicker.getValue('#ff39a5', 'RGB')).toEqual('rgb(255,57,165)');
            expect(colorPicker.getValue('#ff39a532', 'RGBA')).toEqual('rgba(255,57,165,0.2)');
            expect(colorPicker.getValue('#ff39a532', 'A')).toEqual('0.2');
            expect(colorPicker.getValue('#ff39a532', 'HEX_CODE')).toEqual('null');
            expect(colorPicker.getValue()).toEqual('#008000');
            expect(colorPicker.getValue('', 'rgb')).toEqual('rgb(0,128,0)');
            expect(colorPicker.getValue('', 'hsva')).toEqual('hsva(120,100,50.2,1)');
            // For covering the method.
            colorPicker.getPersistData();
        });

        it('Toggle', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
            colorPicker.toggle();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
        });

        it('Localization Testing', () => {
            L10n.load({
                'de': {
                    'colorpicker': {
                        Apply: 'Sich bewerben',
                        Cancel: 'Stornieren'
                    }
                }
            });
            colorPicker = new ColorPicker({ locale: 'de' }, '#color-picker');
            colorPicker.toggle();
            expect(colorPicker.container.querySelector('.e-apply').innerHTML).toEqual('Sich bewerben');
            expect(colorPicker.container.querySelector('.e-cancel').innerHTML).toEqual('Stornieren');
        });
    });

    describe('On property changes', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        it('mode property changes', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            colorPicker.splitBtn.toggle();
            expect(colorPicker.container.classList.contains('e-color-picker')).toBeTruthy();
            colorPicker.mode = 'Palette';
            colorPicker.dataBind();
            expect(colorPicker.container.classList.contains('e-color-palette')).toBeTruthy();
            colorPicker.mode = 'Picker';
            colorPicker.dataBind();
            expect(colorPicker.container.classList.contains('e-color-picker')).toBeTruthy();
        });

        it('Inline property changes', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            expect(element.nextElementSibling.classList.contains('e-split-btn-wrapper')).toBeTruthy();
            colorPicker.inline = true;
            colorPicker.dataBind();
            expect(element.nextElementSibling.classList.contains('e-container')).toBeTruthy();
            colorPicker.inline = false;
            colorPicker.dataBind();
            expect(element.nextElementSibling.classList.contains('e-split-btn-wrapper')).toBeTruthy();
        });

        it('Value property changes', () => {
            colorPicker = new ColorPicker({ mode: 'Palette' }, '#color-picker');
            colorPicker.splitBtn.toggle();
            colorPicker.value = '#e57373';
            colorPicker.dataBind();
            expect(colorPicker.value).toBe('#e57373');
            colorPicker.value = '#5e35b1';
            colorPicker.dataBind();
            expect(colorPicker.value).toBe('#5e35b1');
            colorPicker.destroy();
            //For Picker type
            colorPicker = new ColorPicker({ mode: 'Picker' }, '#color-picker');
            colorPicker.splitBtn.toggle();
            colorPicker.value = '#F44436';
            colorPicker.dataBind();
            expect(colorPicker.value).toBe('#F44436');
            colorPicker.value = '#E57373';
            colorPicker.dataBind();
            expect(colorPicker.value).toBe('#E57373');
            colorPicker.splitBtn.toggle();
            colorPicker.value = '#F44473';
            colorPicker.dataBind();
        });

        it('cssClass property changes', () => {
            colorPicker = new ColorPicker({ inline: true }, '#color-picker');
            expect(colorPicker.container.children[2].classList.contains('e-selected-value')).toBeTruthy();
            colorPicker.cssClass = 'e-hide-value';
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-hide-value')).toBeTruthy();
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeNull();
            colorPicker.cssClass = 'e-hide-value e-show-value';
            colorPicker.inline = false;
            colorPicker.dataBind();
            colorPicker.toggle();
            expect(colorPicker.container.parentElement.classList.contains('e-show-value')).toBeTruthy();
            (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeDefined();
            colorPicker.cssClass = 'e-show-value';
            colorPicker.dataBind();
            expect(colorPicker.container.children[1].classList.contains('e-selected-value')).toBeTruthy();
            colorPicker.cssClass = '';
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeNull();
            colorPicker.toggle();
            colorPicker.cssClass = 'e-hide-valueswitcher e-hide-hex-value';
            colorPicker.dataBind();
            colorPicker.toggle();
            expect(colorPicker.container.querySelector('.e-selected-value .e-hex')).toBeNull();
            colorPicker.cssClass = 'e-hide-switchable-value';
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-selected-value .e-numeric')).toBeNull();
        });

        it('enableRtl property changes', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            colorPicker.splitBtn.toggle();
            colorPicker.enableRtl = true;
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-rtl')).toBeTruthy();
            expect(colorPicker.getPopupEle().classList.contains('e-rtl')).toBeTruthy();
            colorPicker.enableRtl = false;
            colorPicker.dataBind();
            expect(element.parentElement.classList.contains('e-rtl')).toBeFalsy();
            colorPicker.mode = 'Palette';
            colorPicker.enableRtl = true;
            colorPicker.dataBind();
        });

        it('ShowButtons property changes', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            colorPicker.splitBtn.toggle();
            expect(colorPicker.showButtons).toBe(true);
            colorPicker.showButtons = false;
            colorPicker.dataBind();
            let target: Element = colorPicker.container.querySelector('.e-ctrl-btn');
            expect(target).toBeNull();
            expect(colorPicker.showButtons).toBe(false);
            colorPicker.showButtons = true;
            colorPicker.dataBind();
            expect(colorPicker.showButtons).toBe(true);
            colorPicker.dataBind();
            colorPicker.showButtons = false;
            colorPicker.dataBind();
            colorPicker.mode = 'Palette';
            colorPicker.modeSwitcher = false;
            colorPicker.showButtons = true;
            colorPicker.dataBind();
            expect(colorPicker.showButtons).toBe(true);
            colorPicker.showButtons = false;
            colorPicker.dataBind();
            expect(colorPicker.showButtons).toBe(false);
        });

        it('modeSwitcher Testing', () => {
            colorPicker = new ColorPicker({ inline: true, mode: 'Palette' }, '#color-picker');
            expect(colorPicker.modeSwitcher).toBe(true);
            colorPicker.modeSwitcher = false;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('e-mode-switch-btn')).toBeNull();
            colorPicker.modeSwitcher = true;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('e-mode-switch-btn')).toBeDefined();
            colorPicker.showButtons = false;
            colorPicker.modeSwitcher = false;
            colorPicker.mode = 'Picker';
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('e-switch-ctrl-btn')).toBeNull();
            colorPicker.modeSwitcher = true;
            colorPicker.showButtons = true;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('e-switch-ctrl-btn')).toBeDefined();
            expect(colorPicker.container.querySelector('e-mode-switch-btn')).toBeDefined();
            colorPicker.mode = 'Palette';
            colorPicker.showButtons = false;
            colorPicker.modeSwitcher = false;
            colorPicker.dataBind();
            colorPicker.modeSwitcher = true;
            colorPicker.dataBind();
        });

        it('columns, and prestColors property changes', () => {
            colorPicker = new ColorPicker({ mode: 'Palette', inline: true }, '#color-picker');
            expect(colorPicker.columns).toBe(10);
            colorPicker.columns = 12;
            colorPicker.presetColors = { 'custom1': ['#ffffff', '#000000'] };
            colorPicker.dataBind();
            expect(colorPicker.columns).toBe(12);
            let target: Element = colorPicker.container.querySelectorAll('.e-row')[0];
            expect(target.childElementCount).toBe(2);
            expect((target.children[0] as HTMLElement).style.backgroundColor).toEqual('rgb(255, 255, 255)');
            colorPicker.mode = 'Picker';
            colorPicker.columns = 14;
            colorPicker.dataBind();
            colorPicker.columns = 4;
            colorPicker.mode = 'Palette';
            colorPicker.presetColors = {
                'custom1': ['#f0d0c9', '#e2a293', '#d4735e', '#65281a',
                    '#eddfda', '#dcc0b6', '#cba092', '#7b4b3a',
                    '#fcecd5', '#f9d9ab', '#f6c781', '#c87d0e',
                    '#e1dca5', '#d0c974', '#a29a36', '#514d1b',
                    '#c6d9f0', '#8db3e2', '#548dd4', '#17365d'],
                'custom2': ['#ffffff', '#292934', '#f3f2dc', '#d2533c',
                    '#93a299', '#ad8f67', '#726056', '#4c5a6a',
                    '#808da0', '#79463d', '#f2f2f2', '#e7e7ec',
                    '#e7e5b9', '#f6dcd8', '#e9ecea', '#eee8e0',
                    '#e4dedb', '#d8dde3', '#e5e8ec', '#e9d6d3'],
                'custom3': ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373',
                    '#EF534F', '#F44436', '#E53934', '#D32E30', '#C62928',
                    '#B71B1C', '#FF8A80', '#FF5252', '#FF1644', '#D50002',
                    '#FCE4EB', '#F8BBD2', '#F48FB1', '#EF6190', '#EF3E7A',
                    '#EC1965']
            };
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-custom-palette').classList.contains('e-palette-group')).toBeTruthy();
        });

        it('noColor Property changes', () => {
            colorPicker = new ColorPicker({ mode: 'Palette', modeSwitcher: false }, '#color-picker');
            colorPicker.toggle();
            colorPicker.noColor = true;
            colorPicker.dataBind();
            target = colorPicker.container.querySelectorAll('.e-row')[0].children[0];
            expect(target.classList.contains('e-nocolor-item')).toBeTruthy();
            target.click();
            colorPicker.container.querySelector('.e-apply').click();
            expect(colorPicker.value).toEqual('');
            colorPicker.toggle();
            target = colorPicker.container.querySelectorAll('.e-row')[0].children[0];
            expect(target.classList.contains('e-selected')).toBeTruthy();
            target.click();
            colorPicker.noColor = false;
            colorPicker.dataBind();
            target = colorPicker.container.querySelectorAll('.e-row')[0].children[0];
            expect(target.classList.contains('e-nocolor-item')).toBeFalsy();
        });

        it('enableOpacity Property changes', () => {
            colorPicker = new ColorPicker({}, '#color-picker');
            colorPicker.toggle();
            expect(colorPicker.container.querySelector('.e-opacity-slider')).toBeDefined();
            expect(colorPicker.container.querySelector('.e-opacity-value')).toBeDefined();
            colorPicker.enableOpacity = false;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-opacity-slider')).toBeNull();
            expect(colorPicker.container.querySelector('.e-opacity-value')).toBeNull();
            colorPicker.enableOpacity = true;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-opacity-slider')).toBeDefined();
            expect(colorPicker.container.querySelector('.e-opacity-value')).toBeDefined();
            colorPicker.cssClass = 'e-hide-value';
            colorPicker.enableOpacity = false;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-opacity-slider')).toBeNull();
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeNull();
            colorPicker.cssClass = 'e-hide-switchable-value';
            colorPicker.enableOpacity = true;
            colorPicker.dataBind();
            expect(colorPicker.container.querySelector('.e-opacity-slider')).toBeDefined();
            expect(colorPicker.container.querySelector('.e-opacity-value')).toBeNull();

        });
    });

    describe('Click Events', () => {
        describe('For Palette type', () => {
            beforeEach((): void => {
                document.body.appendChild(element);
            });
            afterEach(() => {
                colorPicker.destroy();
                document.body.innerHTML = '';
            });

            it('noColor Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', modeSwitcher: false, showButtons: false, noColor: true, value: '#9C27B0' }, '#color-picker');
                colorPicker.toggle();
                target = colorPicker.container.querySelectorAll('.e-row')[0].children[0] as HTMLElement;
                expect(colorPicker.value).toEqual('#9c27b0ff');
                target.click();
                expect(colorPicker.splitBtn.element.style.backgroundColor).toEqual('');
                expect(colorPicker.value).toEqual('');
            });

            it('Tiles with no selected value', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true, showButtons: false }, '#color-picker');
                target = colorPicker.container.children[0].children[0].children[3] as HTMLElement;
                target.click();
                expect(target.classList.contains('e-selected')).toBeTruthy();
                expect(target.getAttribute('aria-selected')).toEqual('true');
            });

            it('Tiles with selected value', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                target = colorPicker.container.children[0].children[0].children[3] as HTMLElement;
                target.click();
                expect(target.classList.contains('e-selected')).toBeTruthy();
                expect(target.getAttribute('aria-selected')).toEqual('true');
            });

            it('Apply button click', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                target = colorPicker.container.children[0].children[0].children[3] as HTMLElement;
                target.click();
                (colorPicker.container.querySelector('.e-apply') as HTMLElement).click();
                colorPicker.toggle();
                target = colorPicker.container.children[0].children[0].children[3] as HTMLElement;
                expect(target.classList.contains('e-selected')).toBeTruthy();
                expect(target.getAttribute('aria-selected')).toEqual('true');
                expect(target.getAttribute('aria-label').toLowerCase()).toBe(colorPicker.value);
            });

            it('Cancel button click', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', value: '#9575CD' }, '#color-picker');
                colorPicker.toggle();
                colorPicker.paletteClickHandler({
                    preventDefault: (): void => { /** NO Code */ },
                    target: colorPicker.container.querySelector('.e-switch-ctrl-btn') as HTMLElement
                });
                (colorPicker.container.querySelector('.e-cancel') as HTMLElement).click();
                colorPicker.toggle();
                target = colorPicker.container.children[0].children[0].children[3] as HTMLElement;
                target.click();
                (colorPicker.container.querySelector('.e-cancel') as HTMLElement).click();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
            });

            it('Palette with opacity', () => {
                colorPicker = new ColorPicker({
                    inline: true,
                    mode: 'Palette',
                    showButtons: false,
                    value: '#0234c2',
                    presetColors: {
                        'custom': ['#0450c21a', '#0234c2', '#0450c24D', '#0450c266', '#045af2', '#0450c299', '#0450c2B3', '#0450c2CC', '#0450c2E6', '#0450c2FF',
                            '#0080001a', '#00800033', '#00832d', '#00800066', '#00800080', '#00800099', '#008000B3', '#008000CC', '#00832a', '#008000FF']
                    }
                }, '#color-picker');
                target = colorPicker.container.querySelectorAll('.e-row')[0].children[1] as HTMLElement;
                expect(target.classList.contains('e-selected')).toBeTruthy();
                expect(target.getAttribute('aria-selected')).toEqual('true');
                expect(colorPicker.value).toEqual('#0234c2ff');
            });
        });

        describe('For Picker type', () => {
            beforeEach((): void => {
                document.body.appendChild(element);
            });
            afterEach(() => {
                colorPicker.destroy();
                document.body.innerHTML = '';
            });

            it('Mouse down in hsvArea', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', showButtons: false, value: '#7B1FA2' }, '#color-picker');
                colorPicker.toggle();
                expect(colorPicker.value).toBe('#7b1fa2ff');
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 70, 50);
                expect(colorPicker.value).toBe('#eabaffff');
                triggerMouseEvent(target, 'mouseup');
            });

            it('Mouse down in hsvArea - RTL', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', showButtons: false, enableRtl: true, value: '#7B1FA2' }, '#color-picker');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 50, 100);
                expect(colorPicker.value).toBe('#c640ffff');
                triggerMouseEvent(target, 'mouseup');
            });

            it('Mouse move in hsvArea', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', showButtons: false, value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 120, 70);
                expect(colorPicker.value).toBe('#d77affff');
                triggerMouseEvent(target, 'mousemove', 40, 30);
                expect(colorPicker.value).toBe('#f6e0ffff');
                triggerMouseEvent(target, 'mouseup');
            });

            it('Device mode Touch start and move in hsvArea', () => {
                let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
                Browser.userAgent = androidUserAgent;
                colorPicker = new ColorPicker({ value: '#4391a6', showButtons: false }, '#color-picker');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                let EventArgs: any = {
                    preventDefault: (): void => { /** NO Code */ },
                    type: 'touchstart',
                    pageXOffset: 0,
                    pageYOffset: 0,
                    target: target,
                    changedTouches: [{ pageX: 20, pageY: 80 }]
                };
                colorPicker.handlerDown(EventArgs);
                expect(colorPicker.value).toBe('#fafeffff');
                EventArgs.type = 'touchmove';
                EventArgs.changedTouches = [{ pageX: 93, pageY: 36 }];
                colorPicker.handlerMove(EventArgs);
                EventArgs.type = 'touchend';
                colorPicker.handlerEnd(EventArgs);
                expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
                expect(colorPicker.value).toBe('#9deaffff');
            });

            it('Apply button click', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', value: '#7B1FA2' }, '#color-picker');
                colorPicker.toggle();
                expect(colorPicker.value).toBe('#7b1fa2ff');
                (colorPicker.container.querySelector('.e-apply') as HTMLElement).click();
                expect(colorPicker.value).toBe('#7b1fa2ff');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 50, 90);
                triggerMouseEvent(target, 'mouseup');
                (colorPicker.container.querySelector('.e-switch-ctrl-btn') as HTMLElement).click();
                (colorPicker.container.querySelector('.e-apply') as HTMLElement).click();
                expect(colorPicker.value).toBe('#f2d4ffff');
                expect(colorPicker.getPopupEle().classList.contains('e-popup-close')).toBeTruthy();
            });

            it('Cancel button click', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', value: '#a273f1' }, '#color-picker');
                colorPicker.toggle();
                expect(colorPicker.value).toBe('#a273f1ff');
                (colorPicker.container.querySelector('.e-cancel') as HTMLElement).click();
                expect(colorPicker.value).toBe('#a273f1ff');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 45, 33);
                triggerMouseEvent(target, 'mouseup');
                (colorPicker.container.querySelector('.e-cancel') as HTMLElement).click();
                expect(colorPicker.value).toBe('#a273f1ff');
            });

            it('In Preview area testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', value: '#7B1FA2' }, '#color-picker');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-previous') as HTMLElement;
                target.click();
                triggerMouseEvent(document.body, 'mousedown');
                expect(colorPicker.value).toEqual('#7b1fa2ff');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-previous') as HTMLElement;
                colorPicker.hueSlider.value = 20;
                colorPicker.hueSlider.dataBind();
                expect(colorPicker.hsv[0]).toEqual(20);
                target.click();
                expect(colorPicker.hsv[0]).toEqual(282);
                expect(colorPicker.value).toEqual('#7b1fa2ff');
                colorPicker.opacitySlider.value = 35;
                colorPicker.opacitySlider.dataBind();
                expect(colorPicker.rgb[3]).toEqual(0.35);
                target.click();
                expect(colorPicker.rgb[3]).toEqual(1);
                expect(colorPicker.value).toEqual('#7b1fa2ff');
            });

            it('Preview without opacity testing', () => {
                colorPicker = new ColorPicker({ value: '#8321a4', enableOpacity: false }, '#color-picker');
                colorPicker.toggle();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 17, 53);
                triggerMouseEvent(target, 'mouseup');
                target = colorPicker.container.querySelector('.e-previous') as HTMLElement;
                target.click();
                expect(colorPicker.value).toEqual('#8321a4ff');
            });
        });

        describe('For Both type', () => {
            beforeEach((): void => {
                document.body.appendChild(element);
            });
            afterEach(() => {
                colorPicker.destroy();
                document.body.innerHTML = '';
            });

            it('Custom value Testing', () => {
                colorPicker = new ColorPicker({ value: '7B1' }, '#color-picker');
                expect(colorPicker.value).toEqual('#77bb11ff');
                colorPicker.value = '#7B1';
                colorPicker.refresh();
                expect(colorPicker.value).toEqual('#77bb11ff');
                colorPicker.value = '#7B1F';
                colorPicker.refresh();
                expect(colorPicker.value).toEqual('#77bb11ff');
                colorPicker.value = '#7B1FA2';
                colorPicker.refresh();
                expect(colorPicker.value).toEqual('#7b1fa2ff');
                colorPicker.value = '#7B1FA2f1a';
                colorPicker.refresh();
                expect(colorPicker.value).toEqual('#7b1fa2f1a');
            });

            it('Device mode Popup open/close Testing', () => {
                let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
                Browser.userAgent = androidUserAgent;
                colorPicker = new ColorPicker({ value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.element.nextElementSibling.click();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
                expect(document.body.classList.contains('e-colorpicker-overflow')).toBeTruthy();
                expect(document.body.querySelector('.e-modal')).toBeTruthy();
                colorPicker.container.querySelector('.e-cancel').click();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
            });

            it('Color Value Switching', () => {
                colorPicker = new ColorPicker({ value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                target = colorPicker.container.querySelector('.e-value-switch-btn') as HTMLElement;
                expect(colorPicker.isRgb).toBeTruthy();
                target.click();
                expect(colorPicker.isRgb).toBeFalsy();
                target.click();
                expect(colorPicker.isRgb).toBeTruthy();
            });

            it('Type Switching', () => {
                colorPicker = new ColorPicker({ value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                expect(colorPicker.container.classList.contains('e-color-picker')).toBeTruthy();
                (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
                expect(colorPicker.container.classList.contains('e-color-palette')).toBeTruthy();
                expect(colorPicker.container.children[0].classList.contains('e-palette')).toBeTruthy();
                (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
                expect(colorPicker.container.classList.contains('e-color-picker')).toBeTruthy();
                expect(colorPicker.container.children[0].classList.contains('e-hsv-container')).toBeTruthy();
                expect(colorPicker.container.children[1].classList.contains('e-slider-preview')).toBeTruthy();
            });

            it('Without showButtons closing', () => {
                colorPicker = new ColorPicker({ showButtons: false }, '#color-picker');
                colorPicker.toggle();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                setStyles(colorPicker.container);
                triggerMouseEvent(target, 'mousedown', 102, 27);
                triggerMouseEvent(target, 'mouseup');
                expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
                colorPicker.toggle();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
                (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
                expect(colorPicker.container.children[0].classList.contains('e-palette')).toBeTruthy();
                (colorPicker.container.querySelectorAll('.e-row')[0].children[0] as HTMLElement).click();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
            });

            it('Device mode close Testing', () => {
                let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
                Browser.userAgent = androidUserAgent;
                colorPicker = new ColorPicker({ value: '#7B1FA2' }, '#color-picker');
                colorPicker.splitBtn.element.nextElementSibling.click();
                triggerTouchEvent(document.body.querySelector('.e-modal') as HTMLElement, 'touchstart');
                expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
            });
        });
    });

    describe('Public events', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });

        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        it('SplitButton Primary click Testing', () => {
            colorPicker = new ColorPicker(
                {
                    value: '#7B1FA2',
                    change: (args: ColorPickerEventArgs) => {
                        expect(args.name).toBe('change');
                        expect(args.currentValue.hex).toBe('#7b1fa2');
                        expect(args.currentValue.rgba).toBe('rgba(123,31,162,1)');
                        expect(args.previousValue.hex).toBeNull();
                        expect(args.previousValue.rgba).toBeNull();
                    }
                },
                '#color-picker');
            colorPicker.splitBtn.element.click();
        });

        it('select and change event testing', () => {
            colorPicker = new ColorPicker(
                {
                    value: '#7e57c2',
                    mode: 'Palette',
                    select: (args: ColorPickerEventArgs) => {
                        expect(args.name).toBe('select');
                        expect(args.currentValue.hex).toBe('#9c27b0');
                        expect(args.currentValue.rgba).toBe('rgba(156,39,176,1)');
                        expect(args.previousValue.hex).toBe('#7e57c2');
                        expect(args.previousValue.rgba).toBe('rgba(126,87,194,1)');
                    },
                    change: (args: ColorPickerEventArgs) => {
                        expect(args.name).toBe('change');
                        expect(args.currentValue.hex).toBe('#9c27b0');
                        expect(args.currentValue.rgba).toBe('rgba(156,39,176,1)');
                        expect(args.previousValue.hex).toBe('#7e57c2');
                        expect(args.previousValue.rgba).toBe('rgba(126,87,194,1)');
                    }
                },
                '#color-picker');
            colorPicker.toggle();
            // Selecting new tile.
            (colorPicker.container.querySelectorAll('.e-row')[0].children[3] as HTMLElement).click();
            // Applying the newly selected tile color.
            (colorPicker.container.querySelector('.e-apply') as HTMLElement).click();
        });

        it('change event testing without control buttons', () => {
            colorPicker = new ColorPicker(
                {
                    inline: true,
                    value: '#1e1ed5',
                    showButtons: false,
                    change: (args: ColorPickerEventArgs) => {
                        expect(args.name).toBe('change');
                        expect(args.currentValue.hex).toBe('#fafaff');
                        expect(args.currentValue.rgba).toBe('rgba(250,250,255,1)');
                        expect(args.previousValue.hex).toBe('#1e1ed5');
                        expect(args.previousValue.rgba).toBe('rgba(30,30,213,1)');
                    }
                },
                '#color-picker');
                setStyles(colorPicker.container);
                target = colorPicker.container.querySelector('.e-hsv-container') as HTMLElement;
                triggerMouseEvent(target, 'mousedown', 20, 54);
                triggerMouseEvent(target, 'mouseup');
        });
        
        it('beforeTileRender event testing', () => {
            let count: number = 0;
            let presets: { [key: string]: string[] } = {
                    custom: ['#f0d0c9', '#e2a293', '#d4735e', '#65281a',
                    '#eddfda', '#dcc0b6', '#cba092', '#7b4b3a']
                };
            colorPicker = new ColorPicker(
                {
                    value: '#dcc0b6',
                    inline: true,
                    mode: 'Palette',
                    modeSwitcher: false,
                    showButtons: false,
                    presetColors: presets,
                    beforeTileRender: (args: PaletteTileEventArgs) => {
                        expect(args.name).toBe('beforeTileRender');
                        expect(args.element.getAttribute('aria-label')).toBe(presets.custom[count] + 'ff');
                        expect(args.presetName).toBe('custom');
                        expect(args.value).toBe(presets.custom[count]);
                        count++;
                    }
                },
                '#color-picker');
        });

        it('beforeOpen event testing', () => {
            colorPicker = new ColorPicker(
                {
                    value: '#7B1FA2',
                    beforeOpen: (args: BeforeOpenCloseEventArgs) => {
                        expect(args.name).toBe('beforeOpen');
                        expect(args.element).toBe(colorPicker.container);
                        expect(args.event.target).toBe(target);
                        expect(args.cancel).toBeFalsy();
                        args.cancel = true;
                    }
                },
                '#color-picker');
            expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
            target = colorPicker.splitBtn.element.nextElementSibling;
            target.click();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
        });

        it('open event testing', () => {
            colorPicker = new ColorPicker(
                {
                    value: '#7B1FA2',
                    open: (args: OpenEventArgs) => {
                        expect(args.name).toBe('open');
                        expect(args.element).toBe(colorPicker.container);
                    }
                },
                '#color-picker');
            colorPicker.splitBtn.element.nextElementSibling.click();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
        });

        it('beforeClose event testing', () => {
            colorPicker = new ColorPicker(
                {
                    value: '#7B1FA2',
                    beforeClose: (args: BeforeOpenCloseEventArgs) => {
                        expect(args.name).toBe('beforeClose');
                        expect(args.element).toBe(colorPicker.container);
                        expect(args.event.target).toBe(target);
                        expect(args.cancel).toBeFalsy();
                        args.cancel = true;
                    }
                },
                '#color-picker');
            target = colorPicker.splitBtn.element.nextElementSibling;
            target.click();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
            target.click();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeFalsy();
            target = colorPicker.container.querySelector('.e-cancel') as HTMLElement;
            target.click();
            expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeFalsy();
        });
    });

    describe('Input area customization using cssClass property', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        it('Hide inputs', () => {
            colorPicker = new ColorPicker({ cssClass: 'e-hide-value', showButtons: false }, '#color-picker');
            colorPicker.toggle();
            setStyles(colorPicker.container);
            target = (colorPicker.container.querySelector('.e-hsv-container') as HTMLElement);
            triggerMouseEvent(target, 'mousedown', 1, 2);
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeNull();
            triggerMouseEvent(target, 'mouseup');
            colorPicker.toggle();
            setStyles(colorPicker.container);
            target = colorPicker.opacitySlider.element;
            target.style.width = '100%';
            target.style.height = '20px';
            triggerMouseEvent(target, 'mousedown', 10, 1);
            triggerMouseEvent(target, 'mouseup');
            (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
            expect(colorPicker.container.classList.contains('e-color-palette')).toBeTruthy();
        });

        it('Show inputs in palette', () => {
            colorPicker = new ColorPicker({ cssClass: 'e-show-value' }, '#color-picker');
            colorPicker.toggle();
            (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
            expect(colorPicker.container.classList.contains('e-color-palette')).toBeTruthy();
            expect(colorPicker.container.children[0].classList.contains('e-palette')).toBeTruthy();
            expect(colorPicker.container.children[1].classList.contains('e-selected-value')).toBeTruthy();
            target = (colorPicker.container.querySelectorAll('.e-row')[0].children[0] as HTMLElement);
            target.click();
            expect(target.classList.contains('e-selected')).toBeTruthy();
            (colorPicker.container.querySelector('.e-value-switch-btn') as HTMLElement).click();
            (colorPicker.container.querySelector('.e-mode-switch-btn') as HTMLElement).click();
            expect(colorPicker.container.classList.contains('e-color-picker')).toBeTruthy();
        });

        it('Hide hex input', () => {
            colorPicker = new ColorPicker({ cssClass: 'e-hide-hex-value' }, '#color-picker');
            colorPicker.toggle();
            target = (colorPicker.container.querySelector('.e-hsv-container') as HTMLElement);
            triggerMouseEvent(target, 'mousedown', 1, 2);
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeTruthy();
            expect(colorPicker.container.querySelector('.e-selected-value .e-hex')).toBeNull();
            triggerMouseEvent(target, 'mouseup');
        });

        it('Hide switchable inputs', () => {
            colorPicker = new ColorPicker({ cssClass: 'e-hide-switchable-value' }, '#color-picker');
            colorPicker.toggle();
            target = (colorPicker.container.querySelector('.e-hsv-container') as HTMLElement);
            triggerMouseEvent(target, 'mousedown', 1, 2);
            expect(colorPicker.container.querySelector('.e-selected-value')).toBeTruthy();
            expect(colorPicker.container.querySelector('.e-selected-value .e-numeric')).toBeNull();
            triggerMouseEvent(target, 'mouseup');
        });

        it('Hide value switcher', () => {
            colorPicker = new ColorPicker({ cssClass: 'e-hide-valueswitcher', inline: true }, '#color-picker');
            expect(colorPicker.container.querySelector('.e-value-switch-btn')).toBeNull();
            (colorPicker.container.querySelector('.e-cancel') as HTMLElement).click();
        });
    });

    describe('Input Change Events', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            colorPicker.destroy();
            document.body.innerHTML = '';
        });

        let EventArgs: any = {
            target: null
        };

        it('HEX value', () => {
            colorPicker = new ColorPicker({ value: '#1cbc51', showButtons: false }, '#color-picker');
            colorPicker.splitBtn.toggle();
            EventArgs.target = colorPicker.container.querySelector('.e-hex');
            expect(colorPicker.value).toBe('#1cbc51ff');
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '#17bd4e';
            colorPicker.inputHandler(EventArgs);
            expect(colorPicker.value).toBe('#17bd4eff');
            (EventArgs.target as HTMLInputElement).value = '#17bd4';
            colorPicker.inputHandler(EventArgs);
            expect(colorPicker.value).toBe('#17bd4eff');
            (EventArgs.target as HTMLInputElement).value = '';
            colorPicker.inputHandler(EventArgs);
            expect(colorPicker.value).toBe('#17bd4eff');
            (EventArgs.target as HTMLInputElement).value = '#306';
            colorPicker.inputHandler(EventArgs);
            expect(colorPicker.value).toBe('#330066ff');
            (EventArgs.target as HTMLInputElement).value = '#2038';
            colorPicker.inputHandler(EventArgs);
            expect(colorPicker.value).toBe('#330066ff');
            (EventArgs.target as HTMLInputElement).value = '2038';
            colorPicker.inputHandler(EventArgs);
            expect(colorPicker.value).toBe('#330066ff');
        });

        it('Red & Hue value change', () => {
            colorPicker = new ColorPicker({ value: '#1cbc51', showButtons: false }, '#color-picker');
            colorPicker.splitBtn.toggle();
            EventArgs.target = colorPicker.container.querySelector('.e-rh-value');
            //Red value change
            expect(colorPicker.rgb[0]).toBe(28);
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '179';
            colorPicker.inputHandler(EventArgs);
            //expect(colorPicker.value).toBe('#b3bc51ff');
            //Hue value change
            (colorPicker.container.querySelector('.e-value-switch-btn') as HTMLElement).click();
            select('.e-float-text', EventArgs.target.parentElement).textContent = 'H';
            expect(colorPicker.hsv[0]).toBe(65);
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '303';
            colorPicker.inputHandler(EventArgs);
            colorPicker.hueSlider.dataBind();
            expect(colorPicker.hsv[0]).toBe(303);
        });

        it('Green & Saturation value change', () => {
            colorPicker = new ColorPicker({ value: '#1cbc51', showButtons: false }, '#color-picker');
            colorPicker.splitBtn.toggle();
            EventArgs.target = colorPicker.container.querySelector('.e-gs-value');
            //Green value change
            expect(colorPicker.rgb[1]).toBe(188);
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '49';
            colorPicker.inputHandler(EventArgs);
            //Saturation value change
            (colorPicker.container.querySelector('.e-value-switch-btn') as HTMLElement).click();
            select('.e-float-text', EventArgs.target.parentElement).textContent = 'S';
            colorPicker.hsv[1] = 49;
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '30';
            colorPicker.inputHandler(EventArgs);
        });

        it('Blue & Value value change', () => {
            colorPicker = new ColorPicker({ value: '#1cbc51', showButtons: false }, '#color-picker');
            colorPicker.splitBtn.toggle();
            EventArgs.target = colorPicker.container.querySelector('.e-bv-value');
            //Blue value change
            expect(colorPicker.rgb[2]).toBe(81);
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '20';
            colorPicker.inputHandler(EventArgs);
            //expect(colorPicker.value).toBe('#1cbc14ff');
            //Value value change
            (colorPicker.container.querySelector('.e-value-switch-btn') as HTMLElement).click();
            select('.e-float-text', EventArgs.target.parentElement).textContent = 'V';
            colorPicker.hsv[2] = 20;
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '30';
            colorPicker.inputHandler(EventArgs);
            //expect(colorPicker.value).toBe('#0c4d08ff');
        });

        it('Opacity value change', () => {
            colorPicker = new ColorPicker({ value: '#1cbc51' }, '#color-picker');
            colorPicker.splitBtn.toggle();
            EventArgs.target = colorPicker.container.querySelector('.e-opacity-value');
            expect(colorPicker.rgb[3]).toBe(1);
            colorPicker.inputHandler(EventArgs);
            (EventArgs.target as HTMLInputElement).value = '50';
            colorPicker.inputHandler(EventArgs);
            colorPicker.opacitySlider.dataBind();
            expect(colorPicker.rgb[3]).toBe(.5);
            (EventArgs.target as HTMLInputElement).value = '20';
            (colorPicker.container.querySelector('.e-apply') as HTMLElement).click();
        });
    });

    describe('Keyboard Events', () => {
        describe('For Picker', () => {
            beforeEach((): void => {
                document.body.appendChild(element);
            });
            afterEach(() => {
                colorPicker.destroy();
                document.body.innerHTML = '';
            });

            let EventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 39,
                ctrlKey: false,
                target: null
            };

            it('Right arrow Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', inline: true, showButtons: false, value: '#1cbc51' }, '#color-picker');
                EventArgs.target = element.nextElementSibling.querySelector('.e-handler');
                expect(colorPicker.value).toBe('#1cbc51ff');
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#16bc4eff');
            });

            it('Right and up arrow Testing with saturation and value exceeds the limit', () => {
                colorPicker = new ColorPicker({ value: '#00ff00' }, '#color-picker');
                colorPicker.toggle();
                EventArgs.keyCode = 38;
                EventArgs.target = element.nextElementSibling.querySelector('.e-handler');
                expect(colorPicker.value).toBe('#00ff00ff');
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#00ff00ff');
                EventArgs.keyCode = 39;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#00ff00ff');
            });

            it('Right and Left arrow Rtl Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', enableRtl: true, inline: true, showButtons: false, value: '#1cbc513b' }, '#color-picker');
                EventArgs.target = element.nextElementSibling.querySelector('.e-handler');
                expect(colorPicker.value).toBe('#1cbc513b');
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#22bc553b');
                EventArgs.keyCode = 37;
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1cbc513b');
            });

            it('Left arrow Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', showButtons: false, value: '#1cbc51ff' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                expect(colorPicker.value).toBe('#1cbc51ff');
                EventArgs.target = colorPicker.container.querySelector('.e-handler');
                EventArgs.keyCode = 37;
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#22bc55ff');
            });

            it('Left arrow from start Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', showButtons: false, value: '#000000' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                expect(colorPicker.value).toBe('#000000ff');
                EventArgs.target = colorPicker.container.querySelector('.e-handler');
                EventArgs.keyCode = 37;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#000000ff');
            });

            it('Ctrl + right and left arrow Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', inline: true, showButtons: false, value: '#1cbc51' }, '#color-picker');
                EventArgs.target = element.nextElementSibling.querySelector('.e-handler');
                EventArgs.ctrlKey = true;
                expect(colorPicker.value).toBe('#1cbc51ff');
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1ebc53ff');
                EventArgs.keyCode = 39;
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1cbc51ff');
            });

            it('Down arrow Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', inline: true, showButtons: false, value: '#1cbc51' }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-handler');
                expect(colorPicker.value).toBe('#1cbc51ff');
                EventArgs.keyCode = 40;
                EventArgs.ctrlKey = false;
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1bb44eff');
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
            });

            it('Up arrow Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', inline: true, showButtons: false, value: '#1cbc51' }, '#color-picker');
                EventArgs.target = element.nextElementSibling.querySelector('.e-handler');
                expect(colorPicker.value).toBe('#1cbc51ff');
                EventArgs.keyCode = 38;
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1dc455ff');
            });

            it('Enter key Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', value: '#1cbc51' }, '#color-picker');
                colorPicker.splitBtn.toggle();
                EventArgs.target = element.nextElementSibling.querySelector('.e-handler');
                EventArgs.keyCode = 38;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeTruthy();
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.container.parentElement.classList.contains('e-popup-open')).toBeFalsy();
                expect(colorPicker.container.parentElement.classList.contains('e-popup-close')).toBeTruthy();
            });

            it('Ctrl + Up and Down arrow Testing', () => {
                colorPicker = new ColorPicker({ mode: 'Picker', inline: true, showButtons: false, value: '#1cbc51' }, '#color-picker');
                EventArgs.ctrlKey = true;
                EventArgs.target = colorPicker.container.querySelector('.e-handler');
                EventArgs.keyCode = 38;
                expect(colorPicker.value).toBe('#1cbc51ff');
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1cbe52ff');
                EventArgs.keyCode = 40;
                colorPicker.pickerKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.pickerKeyDown(EventArgs);
                expect(colorPicker.value).toBe('#1cbc51ff');
            });
        });

        describe('For Palette', () => {
            beforeEach((): void => {
                document.body.appendChild(element);
            });
            afterEach(() => {
                colorPicker.destroy();
                document.body.innerHTML = '';
            });

            let EventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 13,
                altKey: false
            };
            let selectedEle: Element;

            it('Left Arrow navigation', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                colorPicker.paletteKeyDown(EventArgs);
                EventArgs.keyCode = 37;
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[9].children[9];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = selectedEle.previousElementSibling;
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
            });

            it('Left Arrow navigation RTL', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true, enableRtl: true }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[0];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = selectedEle.nextElementSibling;
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
            });

            it('Right Arrow navigation', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true, value: '#009688', cssClass: 'e-show-value' }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[8];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                EventArgs.keyCode = 39;
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = selectedEle.nextElementSibling;
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[9].children[9];
                colorPicker.paletteKeyDown(EventArgs);
            });

            it('Right Arrow navigation with RTL', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true, enableRtl: true, value: '#009688' }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[8];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = selectedEle.previousElementSibling;
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
            });

            it('Down Arrow navigation', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true, value: '#009688' }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[8];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                EventArgs.keyCode = 40;
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[1].children[8];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
            });

            it('Up Arrow navigation', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', inline: true, value: '#009688' }, '#color-picker');
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[8];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                EventArgs.keyCode = 38;
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[9].children[8];
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                EventArgs.keyCode = 13;
                colorPicker.paletteKeyDown(EventArgs);
            });

            it('Enter key action', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', value: '#009688', showButtons: false }, '#color-picker');
                colorPicker.toggle();
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                EventArgs.keyCode = 13;
                colorPicker.paletteKeyDown(EventArgs);
                colorPicker.toggle();
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[8];
                EventArgs.keyCode = 40;
                colorPicker.paletteKeyDown(EventArgs);
                EventArgs.keyCode = 13;
                colorPicker.paletteKeyDown(EventArgs);
                expect(colorPicker.value).toEqual('#f57f17ff');
                EventArgs.target = colorPicker.container;
                colorPicker.paletteKeyDown(EventArgs);
            });

            it('Right Arrow navigation with no color enabled', () => {
                colorPicker = new ColorPicker({ mode: 'Palette', modeSwitcher: false, showButtons: false, noColor: true }, '#color-picker');
                colorPicker.toggle();
                EventArgs.target = colorPicker.container.querySelector('.e-palette');
                EventArgs.keyCode = 39;
                colorPicker.paletteKeyDown(EventArgs);
                selectedEle = (EventArgs.target as HTMLElement).querySelectorAll('.e-row')[0].children[0];
                expect(selectedEle.classList.contains('e-nocolor-item')).toBeTruthy();
                expect(selectedEle.classList.contains('e-selected')).toBeTruthy();
                expect(selectedEle.getAttribute('aria-selected')).toEqual('true');
                EventArgs.keyCode = 13;
                colorPicker.paletteKeyDown(EventArgs);
                expect(colorPicker.value).toEqual('');
            });
        });
    });
});