import { createElement } from "@syncfusion/ej2-base";
import { ProgressButton } from "../src/progress-button/progress-button";

describe('Progress Button', () => {
    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('Progress and Spinner', () => {
        let ele: any = createElement('button', { id: 'progressbtn1' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Progress', iconCss: 'e-icons e-add-icon', enableProgress: true }, '#progressbtn1');
        expect(ele.childNodes[1].classList).toContain('e-btn-content');
        expect(ele.childNodes[0].classList).toContain('e-spinner');
        expect(ele.childNodes[2].classList).toContain('e-progress');
        expect(ele.childNodes[1].textContent).toEqual('Progress');
        expect(ele.getElementsByClassName('e-btn-content')[0].childNodes[0].classList).toContain('e-btn-icon');
    });

    it('Hide Progress', () => {
        let ele: any = createElement('button', { id: 'progressbtn2' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Progress' }, '#progressbtn2');
        expect(ele.getElementsByClassName('e-progress').length).toBe(0);
    });

    it('Hide Spinner', () => {
        let ele: any = createElement('button', { id: 'progressbtn3' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Progress', cssClass: 'e-hide-spinner' }, '#progressbtn3');
        expect(ele.classList).toContain('e-hide-spinner');
    });

    it('Spinner Only', () => {
        let ele: any = createElement('button', { id: 'progressbtn4' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Spinner', duration: 1000 }, '#progressbtn4');
        ele.click();
        expect(ele.classList).toContain('e-progress-active');
        setTimeout(() => {
            expect(ele.getElementsByClassName('e-spinner-pane')[0].classList).toContain('e-spin-hide');
            expect(ele.classList).not.toContain('e-progress-active');
        }, 1000);
        jasmine.clock().tick(20000);

    });

    it('Progress Only', () => {
        let ele: any = createElement('button', { id: 'progressbtn5' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Progress', duration: 1000, enableProgress: true, cssClass: 'e-hide-spinner', begin: begin, progress: progress, end: end }, '#progressbtn5');

        ele.click();
        expect(ele.classList).toContain('e-progress-active');
        jasmine.clock().tick(20000);

        function begin(args: any) {
            expect(args.percent).toBe(0);
            expect(args.currentDuration).toBe(0);
        }

        function progress(args: any) {
            expect(args.percent).toBeGreaterThan(0);
            expect(args.currentDuration).toBeGreaterThan(0);
            expect(args.percent).toBeLessThan(100);
            expect(args.currentDuration).toBeLessThan(1000);
        }
        function end(args: any) {
            expect(args.percent).toBe(100);
            expect(args.currentDuration).toBe(1000);
        }

    });

    it('Progress methods', () => {
        let ele: any = createElement('button', { id: 'progressbtn6' });
        document.body.appendChild(ele);
        let button: ProgressButton = new ProgressButton({ content: 'Progress', enableProgress: true, duration: 1000, cssClass: 'e-hide-spinner', progress: progress, end: end }, '#progressbtn6');
        ele.click();
        jasmine.clock().tick(20000);
        button.start();
        function progress(args: any) {
            if (args.percent === 50) {
                this.stop();
            }
        }

        function end(args: any) {
            expect(args.percent).toBe(100);
        }
    });

    it('Progress Step', () => {
        let ele: any = createElement('button', { id: 'progressbtn7' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Progress', duration: 1000, enableProgress: true, cssClass: 'e-hide-spinner', begin: begin, progress: progress, end: end }, '#progressbtn7');
        ele.click();
        jasmine.clock().tick(10000);
        function begin(args: any) {
            args.step = 25;
        }
        function progress(args: any) {
            if (args.currentDuration >= 250 && args.currentDuration < 500) {
                expect(args.percent).toBe(25);
            } else if (args.currentDuration > 500 && args.currentDuration < 750) {
                expect(args.percent).toBe(50);
            } else if (args.currentDuration > 750 && args.currentDuration < 1000) {
                expect(args.percent).toBe(75);
            }
        }

        function end(args: any) {
            expect(args.percent).toBe(100);
            expect(args.currentDuration).toBe(1000);
        }
    });

    it('Progress percent', () => {
        let ele: any = createElement('button', { id: 'progressbtn8' });
        document.body.appendChild(ele);
        ele.textContent = 'Progress';
        new ProgressButton({ duration: 1000, enableProgress: true, begin: begin }, '#progressbtn8');
        ele.click();
        jasmine.clock().tick(10000);
        function begin(args: any) {
            args.percent = 98;
        }
        function end(args: any) {
            expect(args.percent).toBe(100);
            expect(args.currentDuration).toBeLessThan(1000);
        }
    });

    it('Progress stop', () => {
        let ele: any = createElement('button', { id: 'progressbtn9' });
        document.body.appendChild(ele);
        let button: any = new ProgressButton({ content: 'Progress', enableProgress: true, duration: 1000 }, '#progressbtn9');
        button.start(10);
        jasmine.clock().tick(2000);
        button.stop();
        expect(button.percent).toBeGreaterThan(0);
        expect(button.progressTime).toBeGreaterThan(0);
        button.start(30);
        jasmine.clock().tick(2000);
        expect(button.percent).toBeGreaterThanOrEqual(30);
        expect(button.progressTime).toBeGreaterThan(0);
    });


    it('content property change', () => {
        let ele: any = createElement('button', { id: 'progressbtn10' });
        document.body.appendChild(ele);
        let button: ProgressButton = new ProgressButton({ content: 'Progress', enableProgress: true }, '#progressbtn10');
        button.content = 'Progress2';
        button.iconCss = 'e-icons e-add-icon';
        button.dataBind();
        expect(button.content).toBe('Progress2');
        expect(ele.getElementsByClassName('e-btn-content')[0].textContent).toBe('Progress2');
        expect(ele.getElementsByClassName('e-btn-content')[0].childNodes[0].classList).toContain('e-btn-icon');
        button.iconPosition = 'Right';
        button.dataBind();
        expect(ele.getElementsByClassName('e-btn-content')[0].childNodes[1].classList).toContain('e-btn-icon');
        button.iconPosition = 'Left';
        button.dataBind();
        expect(ele.getElementsByClassName('e-btn-content')[0].childNodes[0].classList).toContain('e-btn-icon');
        button.enableProgress = false;
        button.dataBind();
        expect(ele.getElementsByClassName('e-progress')[0]).toBe(undefined);
        button.content = 'Progress3';
        button.dataBind();
        expect(ele.getElementsByClassName('e-btn-content')[0].textContent).toBe('Progress3');
        button.iconCss = 'e-icons e-add-icon1';
        button.dataBind();
        expect(ele.getElementsByClassName('e-btn-content')[0].childNodes[0].classList).toContain('e-add-icon1');
        button.enableProgress = true;
        button.dataBind();
        expect(ele.childNodes[2].classList).toContain('e-progress');
    });

    it('destroy method', () => {
        let ele: any = createElement('button', { id: 'progressbtn11' });
        document.body.appendChild(ele);
        let button: any = new ProgressButton({ content: 'Progress', enableProgress: true }, '#progressbtn11');
        button.destroy();
        expect(ele.innerHTML).toBe('');
        button = new ProgressButton({ enableProgress: true }, '#progressbtn11');
        button.destroy();
        expect(ele.innerHTML).toBe('');
        button = new ProgressButton({ cssClass: 'e-hide-spinner', enableProgress: true }, '#progressbtn11');
        button.destroy();
        expect(ele.innerHTML).toBe('');
    });

    it('Spin Position', () => {
        let ele: any = createElement('button', { id: 'progressbtn13' });
        document.body.appendChild(ele);
        let button: any = new ProgressButton({ content: 'Spin Right', spinSettings: { position: 'Right' } }, '#progressbtn13');
        expect(ele.childNodes[1].classList).toContain('e-spinner');
        button.destroy();
        button = new ProgressButton({ content: 'Spin Top', spinSettings: { position: 'Top' } }, '#progressbtn13');
        expect(ele.childNodes[0].classList).toContain('e-spinner');
        button.destroy();
        button = new ProgressButton({ content: 'Spin bottom', spinSettings: { position: 'Bottom' } }, '#progressbtn13');
        expect(ele.childNodes[1].classList).toContain('e-spinner');
    });

    it('Animation settings - SlideLeft', () => {
        let ele: any = createElement('button', { id: 'progressbtn14' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Slide Left', duration: 1000, spinSettings: { position: 'Center' }, animationSettings: { effect: 'SlideLeft', duration: 400 } }, '#progressbtn14');
        ele.click();
        setTimeout(() => {
            expect(ele.getElementsByClassName('e-btn-content')[0].classList).not.toContain('e-cont-animate');
        }, 2000);
        jasmine.clock().tick(20000);
    });

    it('Animation settings - Center', () => {
        let ele: any = createElement('button', { id: 'progressbtn15' });
        document.body.appendChild(ele);
        new ProgressButton({ content: 'Spin Center', duration: 1000, spinSettings: { position: 'Center' } }, '#progressbtn15');
        ele.click();
        expect(ele.getElementsByClassName('e-btn-content')[0].classList).toContain('e-cont-animate');
        setTimeout(() => {
            expect(ele.getElementsByClassName('e-btn-content')[0].classList).not.toContain('e-cont-animate');
        }, 2000);
        jasmine.clock().tick(20000);
    });
});