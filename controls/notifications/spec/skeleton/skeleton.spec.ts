import { Browser, createElement } from "@syncfusion/ej2-base";
import { Skeleton } from "../../src/skeleton/index";

let skeletonObj: Skeleton;
let ele: HTMLElement;

describe('Skeleton - ', () => {

    let skeleton: Skeleton;
    let skeletonElem: HTMLElement = createElement('div', { id: 'skeletonComp' });
    document.body.appendChild(skeletonElem);

    describe('DOM - ', () => {

        afterEach(() => {
            if (skeleton)
                skeleton.destroy();
        });

        it('Default rendering', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.classList.contains('e-skeleton')).toEqual(true);
            expect(skeletonElem.classList.contains('e-skeleton-text')).toEqual(true);
            expect(skeletonElem.classList.contains('e-shimmer-wave')).toEqual(true);
        });

        it('Unique ID checking', () => {
            skeletonElem.removeAttribute('id');
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo(skeletonElem);
            expect(skeletonElem.hasAttribute('id')).toEqual(true);
            skeletonElem.setAttribute('id', 'skeletonComp');
        });

        it('Aria checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.getAttribute('role')).toBe('alert');
            expect(skeletonElem.getAttribute('aria-busy')).toBe('true');
            expect(skeletonElem.getAttribute('aria-live')).toBe('polite');
            expect(skeletonElem.getAttribute('aria-label')).toBe('Loading...');
        });

        it('Circle shape checking', () => {
            skeleton = new Skeleton({
                width: "100px",
                shape: 'Circle'
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.style.height).toBe('100px');
            expect(skeletonElem.classList.contains('e-skeleton-circle')).toEqual(true);
        });

        it('Square shape checking', () => {
            skeleton = new Skeleton({
                width: "100px",
                shape: 'Square'
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.style.height).toBe('100px');
            expect(skeletonElem.classList.contains('e-skeleton-square')).toEqual(true);
        });

        it('Rectangle shape checking', () => {
            skeleton = new Skeleton({
                width: "300px",
                height: "150px",
                shape: 'Rectangle'
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.style.width).toBe('300px');
            expect(skeletonElem.style.height).toBe('150px');
            expect(skeletonElem.classList.contains('e-skeleton-rectangle')).toEqual(true);
        });

        it('Fade effect checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px",
                shimmerEffect: 'Fade'
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.classList.contains('e-shimmer-fade')).toEqual(true);
        });

        it('Pulse effect checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px",
                shimmerEffect: 'Pulse'
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.classList.contains('e-shimmer-pulse')).toEqual(true);
        });

        it('None effect checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px",
                shimmerEffect: 'None'
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.classList.contains('e-shimmer-wave')).toEqual(false);
        });
    });

    describe('API - ', () => {

        afterEach(() => {
            if (skeleton)
                skeleton.destroy();
        });

        it('shape checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.classList.contains('e-skeleton-text')).toEqual(true);
            skeleton.height = '100px';
            skeleton.dataBind();
            expect(skeletonElem.style.height).toBe('100px');
            skeleton.shape = 'Circle';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-skeleton-circle')).toEqual(true);
            skeleton.shape = 'Square';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-skeleton-square')).toEqual(true);
            skeleton.width = '300px';
            skeleton.dataBind();
            expect(skeletonElem.style.width).toBe('300px');
            skeleton.shape = 'Rectangle';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-skeleton-rectangle')).toEqual(true);
        });

        it('animation effect checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeletonElem.classList.contains('e-shimmer-wave')).toEqual(true);
            skeleton.shimmerEffect = 'Fade';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-shimmer-fade')).toEqual(true);
            skeleton.shimmerEffect = 'Pulse';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-shimmer-pulse')).toEqual(true);
            skeleton.shimmerEffect = 'None';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-shimmer-pulse')).toEqual(false);
            expect(skeletonElem.classList.contains('e-shimmer-wave')).toEqual(false);
        });

        it('visible checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            skeleton.visible = false;
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-visible-none')).toEqual(true);
            skeleton.visible = true;
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('e-visible-none')).toEqual(false);
        });

        it('label checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            skeleton.label = 'Please wait...';
            skeleton.dataBind();
            expect(skeletonElem.getAttribute('aria-label')).toBe('Please wait...');
            skeleton.label = 'Loading...';
            skeleton.dataBind();
            expect(skeletonElem.getAttribute('aria-label')).toBe('Loading...');
        });

        it('cssClass checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px", cssClass: "custom-css"
            });
            skeleton.appendTo('#skeletonComp');
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('custom-css')).toEqual(true);
            skeleton.cssClass = '';
            skeleton.dataBind();
            expect(skeletonElem.classList.contains('custom-css')).toEqual(false);
        });

    });

    describe('Methods - ', () => {

        afterEach(() => {
            if (skeleton)
                skeleton.destroy();
        });

        it('destroy checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            skeleton.destroy();
            expect(skeletonElem.classList.contains('e-skeleton')).toEqual(false);
            expect(skeletonElem.classList.contains('e-skeleton-text')).toEqual(false);
            expect(skeletonElem.classList.contains('e-shimmer-wave')).toEqual(false);
        });

        it('getModuleName checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px"
            });
            skeleton.appendTo('#skeletonComp');
            expect(((<any>skeletonElem).ej2_instances[0] as any).getModuleName()).toEqual('skeleton');
        });

        it('getPersistData checking', () => {
            skeleton = new Skeleton({
                width: "100px", height: "15px", enablePersistence: true
            });
            skeleton.appendTo('#skeletonComp');
            expect(skeleton.getPersistData()).toEqual('{}');
        });
    });

});

describe("Null or undefined value testing", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'skeletonComp' });
        document.body.appendChild(ele);
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it("width", () => {
        skeletonObj = new Skeleton({ width: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.width).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ width: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.width).toBe('');
        skeletonObj.destroy();
    });
    it('height', () => {
        skeletonObj = new Skeleton({ height: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.height).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ height: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.height).toBe('');
        skeletonObj.destroy();
    })
    it('visible', () => {
        skeletonObj = new Skeleton({ visible: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.visible).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ visible: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.visible).toBe(true);
        skeletonObj.destroy();
    })
    it('shape', () => {
        skeletonObj = new Skeleton({ shape: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.shape).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ shape: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.shape).toBe('Text');
        skeletonObj.destroy();
    })
    it('shimmerEffect', () => {
        skeletonObj = new Skeleton({ shimmerEffect: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.shimmerEffect).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ shimmerEffect: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.shimmerEffect).toBe('Wave');
        skeletonObj.destroy();
    })
    it('label', () => {
        skeletonObj = new Skeleton({ label: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.label).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ label: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.label).toBe('Loading...');
        skeletonObj.destroy();
    })
    it('cssClass', () => {
        skeletonObj = new Skeleton({ cssClass: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.cssClass).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ cssClass: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.cssClass).toBe('');
        skeletonObj.destroy();
    })
    it('enablePersistence', () => {
        skeletonObj = new Skeleton({ enablePersistence: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.enablePersistence).toBe(null);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ enablePersistence: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.enablePersistence).toBe(false);
        skeletonObj.destroy();
    })
    it('enableRtl', () => {
        skeletonObj = new Skeleton({ enableRtl: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.enableRtl).toBe(false);
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ enableRtl: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.enableRtl).toBe(false);
        skeletonObj.destroy();
    })
    it('locale', () => {
        skeletonObj = new Skeleton({ locale: null });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.locale).toBe('en-US');
        skeletonObj.destroy();
        skeletonObj = new Skeleton({ locale: undefined });
        skeletonObj.appendTo('#skeletonComp');
        expect(skeletonObj.locale).toBe('en-US');
        skeletonObj.destroy();
    })
});