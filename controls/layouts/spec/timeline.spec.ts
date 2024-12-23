import { Browser, createElement, remove, isNullOrUndefined} from '@syncfusion/ej2-base';
import { Timeline, TimelineAlign, TimelineItemModel, TimelineOrientation, TimelineRenderingEventArgs } from '../src/timeline/index';
import { getMemoryProfile, inMB, profile } from './common.spec';

let timelineObj: Timeline;
let ele: HTMLElement;

describe('Timeline', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    describe('DOM', () => {
        let timeline: Timeline;
        let timelineElement: HTMLElement;

        beforeEach(() => {
            timelineElement = createElement('div', { id: 'timeline'});
            document.body.appendChild(timelineElement);
        });

        afterEach(() => {
            if (timeline) {
                timeline.destroy();
                timeline = undefined;
            }
            remove(timelineElement);
        });

        it('Default timeline testing', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}]
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            timeline.orientation = 'horizontal';
            timeline.dataBind();
            expect(timelineElement.classList.contains('.e-vertical')).toEqual(false);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            timeline.orientation = 'vertical';
            timeline.dataBind();
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal')).toEqual(false);
            // null reference check
            timeline.orientation = '';
            timeline.dataBind();
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal')).toEqual(false);
        });

        it('Horizontal timeline testing', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}]
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
        });

        it('Dynamically change timeline items', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}]
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            let liElementArray: any = timelineElement.querySelectorAll('.e-dot');
            expect((liElementArray[0] as HTMLElement).classList.contains('e-dot')).toEqual(true);
            timeline.items = [
                {dotCss: 'e-icons e-people'},
                {dotCss: 'e-icons e-signature'},
                {dotCss: 'e-icons e-location'},
                {dotCss: 'e-icons e-cut'}
            ];
            timeline.dataBind();
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            liElementArray = timelineElement.querySelectorAll('.e-dot');
            expect((liElementArray[0] as HTMLElement).classList.contains('e-people')).toEqual(true);
            expect((liElementArray[1] as HTMLElement).classList.contains('e-signature')).toEqual(true);
            expect((liElementArray[2] as HTMLElement).classList.contains('e-location')).toEqual(true);
            expect((liElementArray[3] as HTMLElement).classList.contains('e-cut')).toEqual(true);
        });

        it('Custom Icon', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-people'},
                {dotCss: 'e-icons e-signature'},
                {dotCss: 'e-icons e-location'},
                {dotCss: 'e-icons e-cut'}
            ];
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-dot');
            expect((liElementArray[0] as HTMLElement).classList.contains('e-people')).toEqual(true);
            expect((liElementArray[1] as HTMLElement).classList.contains('e-signature')).toEqual(true);
            expect((liElementArray[2] as HTMLElement).classList.contains('e-location')).toEqual(true);
            expect((liElementArray[3] as HTMLElement).classList.contains('e-cut')).toEqual(true);
            timeline.items[0].dotCss = 'e-icons e-copy';
            timeline.dataBind();
            expect((liElementArray[0] as HTMLElement).classList.contains('e-people')).toEqual(false);
            expect((liElementArray[0] as HTMLElement).classList.contains('e-copy')).toEqual(true);
            // null reference check
            timeline.items[0].dotCss = '';
            timeline.dataBind();
            expect((liElementArray[0] as HTMLElement).classList.contains('e-dot')).toEqual(true);
            expect((liElementArray[0] as HTMLElement).classList.length).toBe(1);
        });

        it('Get component name testing', () => {
            timeline = new Timeline({items: [{}, {}, {}, {}]});
            timeline.appendTo('#timeline');
            expect(timeline.getModuleName()).toEqual('timeline');
        });

        it('Timeline testing with Persistence', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}],
                enablePersistence: true
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-timeline') != null).toEqual(true);
        });

        it('Generic div Element ID generation', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}]
            });
            const timelineEle1 = createElement('div', {});
            document.body.appendChild(timelineEle1);
            timeline.appendTo(timelineEle1);
            expect(timelineEle1.getAttribute('id') != timelineElement.getAttribute('id')).toEqual(true);
            expect(isNullOrUndefined(timelineEle1.id)).toBe(false);
            timeline.destroy();
            timeline = undefined;
            remove(timelineEle1);
        });
    });
    
    describe('DOM Properties', () => {
        let timeline: Timeline;
        let timelineElement: HTMLElement;

        beforeEach(() => {
            timelineElement = createElement('div', { id: 'timeline'});
            document.body.appendChild(timelineElement);
        });

        afterEach(() => {
            if (timeline) {
                timeline.destroy();
                timeline = undefined;
            }
            remove(timelineElement);
        });

        it('cssClass', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}],
                cssClass: 'testClass'
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.classList.contains('testClass')).toBe(true);
            timeline.cssClass = 'newClass';
            timeline.dataBind();
            expect(timelineElement.classList.contains('newClass')).toBe(true);
            expect(timelineElement.classList.contains('testClass')).toBe(false);
            // null reference check
            timeline.cssClass = '';
            timeline.dataBind();
            expect(timelineElement.classList.contains('newClass')).toBe(false);
        });

        it('Item with cssClass', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-people', cssClass: 'testClass'},
                {dotCss: 'e-icons e-signature'},
                {dotCss: 'e-icons e-location'},
                {dotCss: 'e-icons e-cut'}
            ];
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelector('.e-timeline-item').classList).toContain('testClass');
            timeline.items[0].cssClass = 'newClass';
            timeline.dataBind();
            expect(timelineElement.querySelector('.e-timeline-item').classList.contains('testClass')).toBe(false);
            expect(timelineElement.querySelector('.e-timeline-item').classList.contains('newClass')).toBe(true);
            // null reference check
            timeline.items[0].cssClass = '';
            timeline.dataBind();
            expect(timelineElement.querySelector('.e-timeline-item').classList.contains('newClass')).toBe(false);
        });

        it('Item with disabled', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-people', disabled: true},
                {dotCss: 'e-icons e-signature'},
                {dotCss: 'e-icons e-location'},
                {dotCss: 'e-icons e-cut'}
            ];
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelector('.e-timeline-item').classList).toContain('e-item-disabled');
            timeline.items[0].disabled = false;
            timeline.dataBind();
            expect(timelineElement.querySelector('.e-timeline-item').classList.contains('e-item-disabled')).toBe(false);
            timeline.items[0].disabled = true;
            timeline.dataBind();
            expect(timelineElement.querySelector('.e-timeline-item').classList.contains('e-item-disabled')).toBe(true);
        });

        it('RTL', () => {
            timeline = new Timeline({
                items: [{}, {}, {}, {}],
                enableRtl: true
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.classList.contains('e-rtl')).toEqual(true);
            timeline.enableRtl = false;
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-rtl')).toEqual(false);
            timeline.enableRtl = true;
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-rtl')).toEqual(true);
        });

        it('text content', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
            timeline.items[0].content = 'New Ordered';
            timeline.dataBind();
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('New Ordered');
            // null reference check
            timeline.items[0].content = '';
            timeline.dataBind();
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('');
        });

        it('text content with reverse feature', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, reverse: true });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-timeline-reverse')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
            timeline.reverse = false;
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-timeline-reverse')).toEqual(false);
            timeline.reverse = true;
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-timeline-reverse')).toEqual(true);
        });

        it('custom icon with text content', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-people', content: 'Ordered'},
                {dotCss: 'e-icons e-signature', content: 'Processing'},
                {dotCss: 'e-icons e-location', content: 'Shipped'},
                {dotCss: 'e-icons e-cut', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-dot');
            expect((liIconElementArray[0] as HTMLElement).classList.contains('e-people')).toEqual(true);
            expect((liIconElementArray[1] as HTMLElement).classList.contains('e-signature')).toEqual(true);
            expect((liIconElementArray[2] as HTMLElement).classList.contains('e-location')).toEqual(true);
            expect((liIconElementArray[3] as HTMLElement).classList.contains('e-cut')).toEqual(true);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with before position', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'before' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-before')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with alternate position', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternate' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternate')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with alternate reverse position', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternatereverse' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternatereverse')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
            timeline.items[0].oppositeContent = '09:00 am';
            timeline.dataBind();
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:00 am');
            // null reference check
            timeline.items[0].oppositeContent = '';
            timeline.dataBind();
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('');
        });

        it('timeline content as js renderer ', () => {
            const customData: TimelineItemModel[] = [
                {content: '#itemContent'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            let content = 'Ordered';
            const renderer = createElement('script', { id: 'itemContent', innerHTML: content });
            renderer.setAttribute('type', 'text/x-jsrender');
            document.body.appendChild(renderer);
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
            content = null;
            remove(renderer);
        });

        it('checking null condition for the content as js renderer ', () => {
            const customData: TimelineItemModel[] = [
                {content: '#itemContent', oppositeContent: 'oppContent 1'},
                {content: 'Processing', oppositeContent: 'oppContent 2'},
                {content: 'Shipped', oppositeContent: 'oppContent 3'},
                {content: 'Delivered', oppositeContent: 'oppContent 4'}
            ];
            let content = 'Ordered';
            const renderer = createElement('script', { id: 'itemContent', innerHTML: content });
            renderer.setAttribute('type', 'text/x-jsrender');
            document.body.appendChild(renderer);
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
            expect(timeline.items[0].content != null).toEqual(true);
            expect(timeline.items[1].content != null).toEqual(true);
            expect(timeline.items[2].content != null).toEqual(true);
            expect(timeline.items[3].content != null).toEqual(true);
            content = null;
            remove(renderer);
        });

        it('checking null condition for the opposite content as js renderer ', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '#itemContent', content: 'oppContent 1'},
                {oppositeContent: 'Processing', content: 'oppContent 2'},
                {oppositeContent: 'Shipped', content: 'oppContent 3'},
                {oppositeContent: 'Delivered', content: 'oppContent 4'}
            ];
            let oppositeContent = 'Ordered';
            const renderer = createElement('script', { id: 'itemContent', innerHTML: oppositeContent });
            renderer.setAttribute('type', 'text/x-jsrender');
            document.body.appendChild(renderer);
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            const liElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
            expect(timeline.items[0].oppositeContent != null).toEqual(true);
            expect(timeline.items[1].oppositeContent != null).toEqual(true);
            expect(timeline.items[2].oppositeContent != null).toEqual(true);
            expect(timeline.items[3].oppositeContent != null).toEqual(true);
            oppositeContent = null;
            remove(renderer);
        });

        it('timeline content with opposite content as js renderer ', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '#itemContent', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            let oppositeContent = '09:30 am';
            const renderer = createElement('script', { id: 'itemContent', innerHTML: oppositeContent });
            renderer.setAttribute('type', 'text/x-jsrender');
            document.body.appendChild(renderer);
            timeline = new Timeline({ items: customData });
            timeline.appendTo('#timeline');
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            oppositeContent = null;
            remove(renderer);
        });

        it('text content with opposite content with before', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'before' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-before')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content with alternate', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternate' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternate')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content with alternate reverse', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternatereverse' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternatereverse')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content with dynamic content position', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'before' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-before')).toEqual(true);
            expect(timelineElement.classList.contains('.e-vertical') != null).toEqual(true);
            timeline.align = 'alternate';
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-align-alternate')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-before')).toEqual(false);
            timeline.align = 'alternatereverse';
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-align-alternatereverse')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternate')).toEqual(false);
            timeline.align = 'after';
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternatereverse')).toEqual(false);
            // null reference check
            timeline.align = '';
            timeline.dataBind();
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
        });

        it('text content', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('custom icon with text content', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-people', content: 'Ordered'},
                {dotCss: 'e-icons e-signature', content: 'Processing'},
                {dotCss: 'e-icons e-location', content: 'Shipped'},
                {dotCss: 'e-icons e-cut', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-dot');
            expect((liIconElementArray[0] as HTMLElement).classList.contains('e-people')).toEqual(true);
            expect((liIconElementArray[1] as HTMLElement).classList.contains('e-signature')).toEqual(true);
            expect((liIconElementArray[2] as HTMLElement).classList.contains('e-location')).toEqual(true);
            expect((liIconElementArray[3] as HTMLElement).classList.contains('e-cut')).toEqual(true);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with before position', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'before', orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-before')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with alternate position', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternate', orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternate')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with alternate reverse position', () => {
            const customData: TimelineItemModel[] = [
                {content: 'Ordered'},
                {content: 'Processing'},
                {content: 'Shipped'},
                {content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternatereverse', orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternatereverse')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-after')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content with before', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'before', orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-before')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content with alternate', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternate', orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternate')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('text content with opposite content with alternate reverse', () => {
            const customData: TimelineItemModel[] = [
                {oppositeContent: '09:30 am', content: 'Ordered'},
                {oppositeContent: '10:30 am', content: 'Processing'},
                {oppositeContent: '11:30 am', content: 'Shipped'},
                {oppositeContent: '12:30 am', content: 'Delivered'}
            ];
            timeline = new Timeline({ items: customData, align: 'alternatereverse', orientation: 'horizontal' });
            timeline.appendTo('#timeline');
            expect(timelineElement.classList.contains('e-timeline')).toEqual(true);
            expect(timelineElement.classList.contains('e-align-alternatereverse')).toEqual(true);
            expect(timelineElement.classList.contains('.e-horizontal') != null).toEqual(true);
            expect(timelineElement.querySelector('.e-timeline-items') != null).toEqual(true);
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-opposite-content').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-dot').length).toBe(4);
            expect(timelineElement.querySelectorAll('.e-content').length).toBe(4);
            const liIconElementArray: any = timelineElement.querySelectorAll('.e-opposite-content');
            expect((liIconElementArray[0] as HTMLElement).innerText).toEqual('09:30 am');
            expect((liIconElementArray[1] as HTMLElement).innerText).toEqual('10:30 am');
            expect((liIconElementArray[2] as HTMLElement).innerText).toEqual('11:30 am');
            expect((liIconElementArray[3] as HTMLElement).innerText).toEqual('12:30 am');
            const liElementArray: any = timelineElement.querySelectorAll('.e-content');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Ordered');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Processing');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Shipped');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Delivered');
        });

        it('created Property', () => {
            let isCreated: boolean = false;
            timeline = new Timeline({
                items: [{}, {}, {}, {}],
                created: () => { isCreated = true; }
            });
            timeline.appendTo('#timeline');
            const liElementArray: any = timelineElement.querySelectorAll('.e-timeline-item');
            expect(isCreated).toEqual(true);
        });

        it('beforeItemRender Property', () => {
            let count: number = 0;
            timeline = new Timeline({
                items: [{}, {}, {}, {}],
                beforeItemRender: (e: TimelineRenderingEventArgs) => {
                    count++;
                    expect(e.element.classList).toContain('e-timeline-item');
                }
            });
            timeline.appendTo('#timeline');
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect(count).toBe(4);
        });

        it('timeline with template support', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-folder', content: 'Item 1'},
                {dotCss: 'e-icons e-folder', content: 'Item 2'},
                {dotCss: 'e-icons e-folder', content: 'Item 3'},
                {dotCss: 'e-icons e-folder', content: 'Item 4'}
            ];
            timeline = new Timeline({ items: customData, template: '<span>${itemIndex}</span>' });
            timeline.appendTo('#timeline');
            const liElementArray: any = timelineElement.querySelectorAll('.e-timeline-item');
            expect(timelineElement.querySelectorAll('.e-timeline-item').length).toBe(4);
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('0');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('1');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('2');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('3');
            timeline.template = '<span>Item ${itemIndex}</span>';
            timeline.dataBind();
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Item 0');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Item 1');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Item 2');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Item 3');
        });

        it('timeline Template as js renderer ', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-folder', content: 'Item 1'},
                {dotCss: 'e-icons e-folder', content: 'Item 2'},
                {dotCss: 'e-icons e-folder', content: 'Item 3'},
                {dotCss: 'e-icons e-folder', content: 'Item 4'}
            ];
            let template = '<span class="tempContent">Item ${itemIndex}</span>';
            const renderer = createElement('script', { id: 'itemTemp', innerHTML: template });
            renderer.setAttribute('type', 'text/x-jsrender');
            document.body.appendChild(renderer);
            timeline = new Timeline({ items: customData, template: '#itemTemp' });
            timeline.appendTo('#timeline');
            const liElementArray: any = timelineElement.querySelectorAll('.e-timeline-item');
            expect(timelineElement.querySelector('.e-timeline-item').firstElementChild.classList).toContain('tempContent');
            expect((liElementArray[0] as HTMLElement).innerText).toEqual('Item 0');
            expect((liElementArray[1] as HTMLElement).innerText).toEqual('Item 1');
            expect((liElementArray[2] as HTMLElement).innerText).toEqual('Item 2');
            expect((liElementArray[3] as HTMLElement).innerText).toEqual('Item 3');
            template = null;
            remove(renderer);
        });

        it('timeline Template as HTMLElement ', () => {
            const customData: TimelineItemModel[] = [
                {dotCss: 'e-icons e-folder', content: 'Item 1'},
                {dotCss: 'e-icons e-folder', content: 'Item 2'},
                {dotCss: 'e-icons e-folder', content: 'Item 3'},
                {dotCss: 'e-icons e-folder', content: 'Item 4'}
            ];
            const template = '<span class="tempContent">Item ${itemIndex}</span>';
            const tempContent = createElement('div', { id: 'itemTemp', className: 'tempContent', innerHTML: template });
            document.body.appendChild(tempContent);
            timeline = new Timeline({ items: customData, template: '#itemTemp' });
            timeline.appendTo('#timeline');
            expect(document.querySelector('.tempContent') === null).toEqual(false);
            timeline.template = '#labelTemp1';
            timeline.dataBind();
            remove(tempContent);
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
    });
});

describe("Null or undefined value testing", () => {
    beforeAll(() => {
        ele = createElement('div', { id: 'timeline' });
        document.body.appendChild(ele);
    });
    beforeEach((): void => {
        let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
        Browser.userAgent = Chromebrowser;
    });
    afterAll(() => {
        document.body.innerHTML = "";
    });
    it('align', () => {
        timelineObj = new Timeline({ align: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.align).toBe(null);
        timelineObj.destroy();
        timelineObj = new Timeline({ align: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.align).toBe(TimelineAlign.After);
        timelineObj.destroy();
    })
    it('cssClass', () => {
        timelineObj = new Timeline({ cssClass: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.cssClass).toBe(null);
        timelineObj.destroy();
        timelineObj = new Timeline({ cssClass: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.cssClass).toBe('');
        timelineObj.destroy();
    })
    it('enablePersistence', () => {
        timelineObj = new Timeline({ enablePersistence: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.enablePersistence).toBe(null);
        timelineObj.destroy();
        timelineObj = new Timeline({ enablePersistence: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.enablePersistence).toBe(false);
        timelineObj.destroy();
    })
    it('enableRtl', () => {
        timelineObj = new Timeline({ enableRtl: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.enableRtl).toBe(false);
        timelineObj.destroy();
        timelineObj = new Timeline({ enableRtl: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.enableRtl).toBe(false);
        timelineObj.destroy();
    })
    it('items', () => {
        timelineObj = new Timeline({ items: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.items).toEqual([]);
        timelineObj.destroy();
        timelineObj = new Timeline({ items: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.items).toEqual([]);
        timelineObj.destroy();
    })
    it('locale', () => {
        timelineObj = new Timeline({ locale: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.locale).toBe('en-US');
        timelineObj.destroy();
        timelineObj = new Timeline({ locale: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.locale).toBe('en-US');
        timelineObj.destroy();
    })
    it('orientation', () => {
        timelineObj = new Timeline({ orientation: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.orientation).toBe(null);
        timelineObj.destroy();
        timelineObj = new Timeline({ orientation: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.orientation).toBe(TimelineOrientation.Vertical);
        timelineObj.destroy();
    })
    it('reverse', () => {
        timelineObj = new Timeline({ reverse: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.reverse).toBe(null);
        timelineObj.destroy();
        timelineObj = new Timeline({ reverse: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.reverse).toBe(false);
        timelineObj.destroy();
    })
    it('template', () => {
        timelineObj = new Timeline({ template: null });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.template).toBe(null);
        timelineObj.destroy();
        timelineObj = new Timeline({ template: undefined });
        timelineObj.appendTo('#timeline');
        expect(timelineObj.template).toBe('');
        timelineObj.destroy();
    })
});