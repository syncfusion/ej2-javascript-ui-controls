/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppBar } from '../src/appbar/index';
import { profile, inMB, getMemoryProfile } from './common.spec';

/**
 *  AppBar spec document
 */

describe('AppBar Testing', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); // Skips test (in Chai)
            return;
        }
    });

    let appbar: AppBar;

    describe('AppBar Properties', () => {
        beforeEach((): void => {
            const appbarElement: HTMLElement = document.createElement('header');
            appbarElement.id = 'appbar';
            const buttonElement: HTMLElement = document.createElement('button');
            buttonElement.id = 'button';
            document.body.appendChild(appbarElement);
            appbarElement.appendChild(buttonElement);
        });
        afterEach(() => {
            appbar.destroy();
            appbar.element.remove();
            appbar = null;
        });
        it('checking component render', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ }, appbarElement);
            expect(document.getElementById('appbar').classList.contains('e-appbar')).toBe(true);
        });
        it('test case for cssClass', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ cssClass: 'appbar-custom' }, appbarElement);
            expect(appbarElement.classList.contains('appbar-custom')).toEqual(true);
        });
        it('test case for htmlAttributes', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ htmlAttributes: { 'data-custom': 'test' } }, appbarElement);
            expect(appbarElement.getAttribute('data-custom')).toEqual('test');
        });
        it('test case for passing class in htmlAttributes', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ htmlAttributes: { 'class': 'test' } }, appbarElement);
            expect(appbarElement.classList).toContain('test');
            expect(appbarElement.classList).toContain('e-appbar');
        });
        it('test case for prominent', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ mode: 'Prominent' }, appbarElement);
            expect(appbarElement.classList.contains('e-prominent')).toEqual(true);
        });
        it('test case for dense', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ mode: 'Dense' }, appbarElement);
            expect(appbarElement.classList.contains('e-dense')).toEqual(true);
        });
        it('test case for light color', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ colorMode: 'Light' }, appbarElement);
            expect(appbarElement.classList.contains('e-light')).toEqual(true);
        });
        it('test case for dark color', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ colorMode: 'Dark' }, appbarElement);
            expect(appbarElement.classList.contains('e-dark')).toEqual(true);
        });
        it('test case for primary color', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ colorMode: 'Primary' }, appbarElement);
            expect(appbarElement.classList.contains('e-primary')).toEqual(true);
        });
        it('test case for inherit color', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ colorMode: 'Inherit' }, appbarElement);
            expect(appbarElement.classList.contains('e-inherit')).toEqual(true);
        });
        it('test case for bottom position', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ position: 'Bottom' }, appbarElement);
            expect(appbarElement.classList.contains('e-horizontal-bottom')).toEqual(true);
        });
        it('test case for sticky', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ isSticky: true }, appbarElement);
            expect(appbarElement.classList.contains('e-sticky')).toEqual(true);
        });
        it('test cases for rtl mode enabled', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ enableRtl: true }, appbarElement);
            expect(appbar.element.classList.contains('e-rtl')).toBe(true);
        });
        it('test cases for rtl mode disabled', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ enableRtl: false }, appbarElement);
            expect(appbar.element.classList.contains('e-rtl')).toBe(false);
        });
        it('test cases for color mode property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ colorMode: 'Light' }, appbarElement);
            expect(appbarElement.classList.contains('e-light')).toEqual(true);
            appbar.colorMode = 'Dark';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-dark')).toEqual(true);
            appbar.colorMode = 'Primary';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-primary')).toEqual(true);
            appbar.colorMode = 'Inherit';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-inherit')).toEqual(true);
            appbar.colorMode = 'Light';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-light')).toEqual(true);
        });
        it('test cases for mode property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ mode: 'Regular' }, appbarElement);
            appbar.mode = 'Prominent';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-prominent')).toEqual(true);
            appbar.mode = 'Dense';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-dense')).toEqual(true);
            appbar.mode = 'Regular';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-dense')).toEqual(false);
            expect(appbarElement.classList.contains('e-prominent')).toEqual(false);
        });
        it('test cases for cssClass property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ cssClass: 'custom' }, appbarElement);
            expect(appbarElement.classList.contains('custom')).toEqual(true);
            appbar.cssClass = 'test-class';
            appbar.dataBind();
            expect(appbarElement.classList.contains('test-class')).toEqual(true);
        });
        it('test cases for isSticky property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ isSticky: true }, appbarElement);
            expect(appbarElement.classList.contains('e-sticky')).toEqual(true);
            appbar.isSticky = false;
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-sticky')).toEqual(false);
            appbar.isSticky = true;
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-sticky')).toEqual(true);
        });
        it('test cases for isSticky property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ enableRtl: true }, appbarElement);
            expect(appbar.element.classList.contains('e-rtl')).toBe(true);
            appbar.enableRtl = false;
            appbar.dataBind();
            expect(appbar.element.classList.contains('e-rtl')).toBe(false);
            appbar.enableRtl = true;
            appbar.dataBind();
            expect(appbar.element.classList.contains('e-rtl')).toBe(true);
        });
        it('test cases for position property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ position: 'Bottom' }, appbarElement);
            expect(appbarElement.classList.contains('e-horizontal-bottom')).toEqual(true);
            appbar.position = 'Top';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-horizontal-bottom')).toEqual(false);
            appbar.position = 'Bottom';
            appbar.dataBind();
            expect(appbarElement.classList.contains('e-horizontal-bottom')).toEqual(true);
        });
        it('test cases for htmlAttributes property change', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ }, appbarElement);
            appbar.htmlAttributes = { 'class': 'test' };
            appbar.dataBind();
            expect(appbarElement.classList).toContain('test');
            appbar.htmlAttributes = { 'class': 'test-class' };
            appbar.dataBind();
            expect(appbarElement.classList).toContain('test-class');
            appbar.htmlAttributes = { 'data-custom': 'test' };
            appbar.dataBind();
            expect(appbarElement.getAttribute('data-custom')).toEqual('test');
            appbar.htmlAttributes = { 'data-custom': 'data-test' };
            appbar.dataBind();
            expect(appbarElement.getAttribute('data-custom')).toEqual('data-test');
        });
    });

    describe('AppBar role', () => {
        beforeEach((): void => {
            const appbarElement: HTMLElement = document.createElement('div');
            appbarElement.id = 'appbar';
            document.body.appendChild(appbarElement);
        });
        afterEach(() => {
            appbar.destroy();
            appbar.element.remove();
            appbar = null;
        });
        it('test case for role', () => {
            const appbarElement: HTMLElement = document.getElementById('appbar');
            appbar = new AppBar({ }, appbarElement);
            expect(appbar.element.getAttribute('role')).toEqual('header');
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
