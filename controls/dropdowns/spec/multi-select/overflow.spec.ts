/**
 * MultiSelect spec document
 */
import { MultiSelect } from '../../src/multi-select/multi-select';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';


describe('MultiSelect Overflow', () => {

    beforeAll(() => {
        let css: string = `
            .e-input-group, .e-input-group.e-control-wrapper {
                display: -ms-inline-flexbox;
                display: inline-flex;
                vertical-align: middle;
            }
            .e-multi-select-wrapper {
                cursor: text;
                line-height: normal;
                min-height: 30px;
                position: relative;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                width: 100%;
            }
        `;
        let style: HTMLStyleElement = document.createElement('style');
        style.type = "text/css";
        style.id = "wrapper-css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    afterAll(() => {
        document.head.getElementsByClassName('wrapper-css')[0].remove();
    });

    describe('EJ2-14587 - Disable overflow mode', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "sports", value: "id" },
                width: 200,
                text: 'Tennis,Football,Hockey,American Football,Basketball',
                showDropDownIcon: true
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Check Non- auto width adjustment - enableOverflowTemplate - true', () => {
            let containerEle: HTMLElement = listObj.element.parentElement.parentElement;
            expect((<HTMLElement>containerEle.querySelector('.e-delim-view.e-delim-values')).offsetWidth).toBeLessThan(200);
        });
    });

    describe('EJ2-14587 - Disable overflow mode - auto flow- - enableOverflowTemplate - true', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        let parentEle: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: "width:500px" });
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            parentEle.appendChild(element);
            document.body.appendChild(parentEle);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "sports", value: "id" },
                width: 'auto',
                text: 'Tennis,Football,Hockey,American Football,Basketball,Badminton,Cricket,Rugby',
                showDropDownIcon: true
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (parentEle) {
                listObj.destroy();
                parentEle.remove();
            }
        });

        it('Check the Max width', () => {
            let containerEle: HTMLElement = listObj.element.parentElement.parentElement;
            expect((<HTMLElement>containerEle.querySelector('.e-delim-view.e-delim-values')).offsetWidth).toBeLessThan(500);
        });
        it('Check the adjusted width based on text size', (done) => {
            listObj.change = (): void => {
                let containerEle: HTMLElement = listObj.element.parentElement.parentElement;
                expect((<HTMLElement>containerEle.querySelector('.e-delim-view.e-delim-values')).offsetWidth).toBeLessThan(50);
                done();
            }
            listObj.text = 'Tennis';
        });
        it('Check the min width', (done) => {
            let containerEle: HTMLElement = listObj.element.parentElement.parentElement;
            containerEle.parentElement.style.minWidth = '200px';
            listObj.change = (): void => {
                let containerEle: HTMLElement = listObj.element.parentElement.parentElement;
                expect(containerEle.offsetWidth).toBe(200);
                done();
            }
            listObj.text = null;
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});