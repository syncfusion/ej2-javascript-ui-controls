import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/circular-gauge/model/interface';

describe('Circular-Gauge Control', () => {
    let gauge: CircularGauge;
    let ele: HTMLElement;
    let svg: HTMLElement;

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
           this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Gauge axis pointer behavior - Marker Pointer', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                    axes: [{
                        lineStyle: { width: 1.5, color: ' #9E9E9E' },
                        radius: '80%',

                        minimum: 0, maximum: 160, startAngle: 220, endAngle: 140,
                        pointers: [{
            animation: { enable: false }, textStyle: {size: '30px', color: 'red', fontFamily: 'Times New Roman', fontStyle: 'normal', fontWeight: 'normal', opacity: 1},
            value: 20,position:"Inside"  ,color: 'red',
            markerHeight: 15, markerWidth: 15, type: 'Marker',
            markerShape: 'Text',text:"Text"
        }]
                    }],
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });



it('Checking default pointer - text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].ranges[0].radius = '80%';
            gauge.refresh();
        });
        it('Checking Text pointer - color of the text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking Text pointer -font family of the text type pointer', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.style.fontFamily).toBe('"Times New Roman"');
              done();
            };
            gauge.refresh();
        });
        it('Checking Text type pointer - font-weight of the text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.style.fontWeight).toBe('normal');
                done();
            };
            gauge.refresh();
});

it('Checking Text type pointer - dominant-baseline property of the text', (done: Function) => {
    gauge.loaded = (args: ILoadedEventArgs): void => {
        svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
        expect(svg.getAttribute('dominant-baseline')).toBe('auto');
        done();
    };
    gauge.refresh();
});



it('Checking Text type pointer - opacity of the text', (done: Function) => {
    gauge.loaded = (args: ILoadedEventArgs): void => {
        svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
        expect(svg.getAttribute('opacity')).toBe('1');
        done();
    };
    gauge.refresh();
});

it('Checking Text type pointer - anchor property of the text', (done: Function) => {
    gauge.loaded = (args: ILoadedEventArgs): void => {
        svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
        expect(svg.getAttribute('text-anchor')).toBe('middle');
        done();
    };
    gauge.refresh();
});


it('Checking Text type pointer - font size of the text', (done: Function) => {
    gauge.loaded = (args: ILoadedEventArgs): void => {
        svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
        expect(svg.style.fontSize).toBe('30px');
        done();
    };
    gauge.refresh();
});


it('Checking Text type pointer - x location of the marker', (done: Function) => {
    gauge.loaded = (args: ILoadedEventArgs): void => {
        svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
        expect(svg.getAttribute('x') == '243.95779227494057' ||
        svg.getAttribute('x') ==  "416.4744027906085" ||
        svg.getAttribute('x') ==  '238.45779227494057').
        toBe(true);
        done();
    };
    gauge.refresh();
});


it('Checking Text type pointer - font style of the text', (done: Function) => {
    gauge.loaded = (args: ILoadedEventArgs): void => {
        svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
        expect(svg.style.fontStyle).toBe('normal');
        done();
    };
    gauge.refresh();
});
});
})

