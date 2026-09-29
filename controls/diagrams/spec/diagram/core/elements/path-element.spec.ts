import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../../src/diagram/diagram';
import { PathElement } from '../../../../src/diagram/core/elements/path-element';
import { Size } from '../../../../src/diagram/primitives/size';
import { Rect } from '../../../../src/diagram/primitives/rect';
import * as domUtil from '../../../../src/diagram/utility/dom-util';
import * as pathUtil from '../../../../src/diagram/utility/path-util';
import {
    profile,
    inMB,
    getMemoryProfile
} from '../../../../spec/common.spec';

describe('PathElement mutation coverage', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    const pathData: string =
        'M 10 20 L 110 20 L 110 70 L 10 70 Z';

    beforeAll((): void => {
        ele = createElement('div', {
            id: 'diagram_path_element_mutation'
        });

        document.body.appendChild(ele);

        diagram = new Diagram({
            width: '800px',
            height: '600px',
            nodes: [
                {
                    id: 'pathNode',
                    offsetX: 200,
                    offsetY: 150,
                    width: 100,
                    height: 50,
                    shape: {
                        type: 'Path',
                        data: pathData
                    }
                }
            ]
        });

        diagram.appendTo('#diagram_path_element_mutation');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();

        diagram = null;
        ele = null;
    });

    it('checks constructor defaults and data property behavior', () => {
        const element: PathElement = new PathElement();

        expect((element as any).pathData).toBe('');
        expect(element.transformPath).toBe(true);
        expect(element.absolutePath).toBe('');
        expect(element.canMeasurePath).toBe(false);
        expect(element.absoluteBounds).toEqual(new Rect());

        const descriptor: PropertyDescriptor =
            Object.getOwnPropertyDescriptor(
                PathElement.prototype,
                'data'
            );

        expect(descriptor).toBeDefined();
        expect(typeof descriptor.get).toBe('function');
        expect(typeof descriptor.set).toBe('function');
        expect(descriptor.enumerable).toBe(true);
        expect(descriptor.configurable).toBe(true);

        (element as any).pathData = 'old-path';
        (element as any).isDirt = false;
        element.data = 'new-path';

        expect((element as any).pathData).toBe('new-path');
        expect(element.data).toBe('new-path');
        expect((element as any).isDirt).toBe(true);

        /*
         * Assigning the same value must not set isDirt.
         */
        (element as any).isDirt = false;
        element.data = 'new-path';

        expect((element as any).isDirt).toBe(false);
    });

    it('checks getPoints timer, point cache and translation', () => {
        jasmine.clock().install();

        try {
            const element: PathElement = new PathElement();

            const segmentPoints: any[] = [
                { x: 10, y: 20 },
                { x: 30, y: 40 }
            ];

            const translatedPoints: any[] = [
                { x: 110, y: 120 },
                { x: 130, y: 140 }
            ];

            const findPointsSpy: jasmine.Spy = spyOn(
                domUtil,
                'findSegmentPoints'
            ).and.returnValue(segmentPoints as any);

            const translatePointsSpy: jasmine.Spy = spyOn(
                domUtil,
                'translatePoints'
            ).and.returnValue(translatedPoints as any);

            (element as any).points = null;
            (element as any).pointTimer = null;

            const firstResult: any[] =
                element.getPoints() as any[];

            expect(findPointsSpy).toHaveBeenCalledWith(element);
            expect(translatePointsSpy).toHaveBeenCalledWith(
                element,
                segmentPoints
            );
            expect(firstResult).toBe(translatedPoints);
            expect((element as any).points).toBe(segmentPoints);
            expect((element as any).pointTimer).not.toBeNull();

            /*
             * Reuse the active timer and cached points.
             */
            const activeTimer: any =
                (element as any).pointTimer;

            findPointsSpy.calls.reset();
            translatePointsSpy.calls.reset();

            element.getPoints();

            expect(findPointsSpy).not.toHaveBeenCalled();
            expect((element as any).pointTimer).toBe(
                activeTimer
            );
            expect(translatePointsSpy).toHaveBeenCalledWith(
                element,
                segmentPoints
            );

            /*
             * Cache must remain before 200 milliseconds.
             */
            jasmine.clock().tick(199);

            expect((element as any).points).toBe(
                segmentPoints
            );
            expect((element as any).pointTimer).toBe(
                activeTimer
            );

            /*
             * The timeout callback must clear both values.
             */
            jasmine.clock().tick(1);

            expect((element as any).points).toBeNull();
            expect((element as any).pointTimer).toBeNull();

            /*
             * Points must be calculated again after expiration.
             */
            findPointsSpy.calls.reset();

            element.getPoints();

            expect(findPointsSpy).toHaveBeenCalledWith(element);
        } finally {
            jasmine.clock().uninstall();
        }
    });

    it('checks static path measurement and pivot arithmetic', () => {
        const element: PathElement = new PathElement();

        const measurePathSpy: jasmine.Spy = spyOn(
            domUtil,
            'measurePath'
        );

        element.staticSize = true;
        element.offsetX = 250;
        element.offsetY = 180;
        element.pivot = {
            x: 0.25,
            y: 0.75
        };
        element.width = 120;
        element.height = 80;
        element.relativeMode = 'Point' as any;
        (element as any).isDirt = true;

        const result: Size = element.measure(
            new Size(1000, 1000)
        );

        /*
         * x = 250 - 120 * 0.25 = 220
         * y = 180 - 80 * 0.75 = 120
         */
        expect(measurePathSpy).not.toHaveBeenCalled();

        expect(element.absoluteBounds).toEqual(
            new Rect(220, 120, 120, 80)
        );

        expect(result).toEqual(new Size(120, 80));
        expect(element.canMeasurePath).toBe(false);
    });

    it('does not use static bounds when width or height is undefined', () => {
        const availableSize: Size =
            new Size(1000, 1000);

        const widthUndefined: PathElement =
            new PathElement();

        widthUndefined.staticSize = true;
        widthUndefined.width = undefined;
        widthUndefined.height = 75;
        widthUndefined.offsetX = 250;
        widthUndefined.offsetY = 180;
        widthUndefined.pivot = {
            x: 0.25,
            y: 0.75
        };
        widthUndefined.absoluteBounds =
            new Rect(10, 20, 90, 60);
        widthUndefined.relativeMode = 'Point' as any;
        widthUndefined.transformPath = false;
        (widthUndefined as any).pathData = false;
        widthUndefined.canMeasurePath = false;

        let result: Size =
            widthUndefined.measure(availableSize);

        expect(widthUndefined.absoluteBounds).toEqual(
            new Rect(10, 20, 90, 60)
        );
        expect(result).toEqual(new Size(90, 75));

        const heightUndefined: PathElement =
            new PathElement();

        heightUndefined.staticSize = true;
        heightUndefined.width = 125;
        heightUndefined.height = undefined;
        heightUndefined.offsetX = 250;
        heightUndefined.offsetY = 180;
        heightUndefined.pivot = {
            x: 0.25,
            y: 0.75
        };
        heightUndefined.absoluteBounds =
            new Rect(10, 20, 90, 60);
        heightUndefined.relativeMode = 'Point' as any;
        heightUndefined.transformPath = false;
        (heightUndefined as any).pathData = false;
        heightUndefined.canMeasurePath = false;

        result = heightUndefined.measure(availableSize);

        expect(heightUndefined.absoluteBounds).toEqual(
            new Rect(10, 20, 90, 60)
        );
        expect(result).toEqual(new Size(125, 60));
    });

    it('checks all measurePath condition combinations', () => {
        const element: PathElement = new PathElement();
        const availableSize: Size =
            new Size(1000, 1000);

        const measurePathSpy: jasmine.Spy = spyOn(
            domUtil,
            'measurePath'
        ).and.returnValue(
            new Rect(10, 20, 90, 60)
        );

        const checkMeasure = (
            isDirt: boolean,
            transformPath: boolean,
            width: number | undefined,
            height: number | undefined,
            bounds: Rect,
            canMeasurePath: boolean,
            expectedCall: boolean
        ): void => {
            measurePathSpy.calls.reset();

            (element as any).pathData = pathData;
            element.staticSize = false;
            (element as any).isDirt = isDirt;
            element.transformPath = transformPath;
            element.width = width;
            element.height = height;
            element.absoluteBounds = bounds;
            element.canMeasurePath = canMeasurePath;
            element.relativeMode = 'Point' as any;

            element.measure(availableSize);

            expect(
                measurePathSpy.calls.any()
            ).toBe(expectedCall);

            expect(element.canMeasurePath).toBe(false);
        };

        /*
         * Clean element with existing bounds.
         */
        checkMeasure(
            false,
            true,
            undefined,
            undefined,
            new Rect(1, 2, 30, 40),
            false,
            false
        );

        /*
         * Dirty element with transformPath enabled.
         */
        checkMeasure(
            true,
            true,
            100,
            50,
            new Rect(),
            false,
            true
        );

        /*
         * Dirty element with transformPath disabled and both
         * dimensions defined.
         */
        checkMeasure(
            true,
            false,
            100,
            50,
            new Rect(),
            false,
            false
        );

        /*
         * Dirty element with undefined width.
         */
        checkMeasure(
            true,
            false,
            undefined,
            50,
            new Rect(),
            false,
            true
        );

        /*
         * Dirty element with undefined height.
         */
        checkMeasure(
            true,
            false,
            100,
            undefined,
            new Rect(),
            false,
            true
        );

        /*
         * Existing nonzero bounds must prevent measurement.
         */
        checkMeasure(
            true,
            true,
            100,
            50,
            new Rect(1, 2, 30, 40),
            false,
            false
        );

        /*
         * canMeasurePath must force measurement.
         */
        checkMeasure(
            false,
            false,
            100,
            50,
            new Rect(1, 2, 30, 40),
            true,
            true
        );
    });

    it('passes path data and empty fallback to measurePath', () => {
        const element: PathElement = new PathElement();

        const measurePathSpy: jasmine.Spy = spyOn(
            domUtil,
            'measurePath'
        ).and.returnValue(
            new Rect(10, 20, 90, 60)
        );

        element.staticSize = false;
        element.transformPath = true;
        element.width = undefined;
        element.height = undefined;
        element.relativeMode = 'Point' as any;

        (element as any).pathData = pathData;
        (element as any).isDirt = true;
        element.absoluteBounds = new Rect();

        element.measure(new Size(1000, 1000));

        expect(measurePathSpy).toHaveBeenCalledWith(
            pathData
        );

        measurePathSpy.calls.reset();

        (element as any).pathData = '';
        (element as any).isDirt = true;
        element.absoluteBounds = new Rect();

        element.measure(new Size(1000, 1000));

        expect(measurePathSpy).toHaveBeenCalledWith('');
    });

    it('checks zero bounds, relative mode and stroke width', () => {
        const element: PathElement = new PathElement();
        const availableSize: Size =
            new Size(1000, 1000);

        element.staticSize = false;
        element.transformPath = false;
        (element as any).isDirt = false;
        element.canMeasurePath = false;
        element.width = undefined;
        element.height = undefined;
        element.style.strokeWidth = 7;

        element.relativeMode = 'Object' as any;
        element.absoluteBounds =
            new Rect(10, 20, 0, 0);

        let result: Size =
            element.measure(availableSize);

        expect(element.absoluteBounds).toEqual(
            new Rect(10, 20, 7, 7)
        );
        expect(result).toEqual(new Size(7, 7));

        /*
         * Zero width only.
         */
        element.absoluteBounds =
            new Rect(10, 20, 0, 40);

        result = element.measure(availableSize);

        expect(element.absoluteBounds).toEqual(
            new Rect(10, 20, 7, 40)
        );
        expect(result).toEqual(new Size(7, 40));

        /*
         * Zero height only.
         */
        element.absoluteBounds =
            new Rect(10, 20, 30, 0);

        result = element.measure(availableSize);

        expect(element.absoluteBounds).toEqual(
            new Rect(10, 20, 30, 7)
        );
        expect(result).toEqual(new Size(30, 7));

        /*
         * Point mode must preserve zero dimensions.
         */
        element.relativeMode = 'Point' as any;
        element.absoluteBounds =
            new Rect(10, 20, 0, 0);

        result = element.measure(availableSize);

        expect(element.absoluteBounds).toEqual(
            new Rect(10, 20, 0, 0)
        );
        expect(result).toEqual(new Size(0, 0));
    });

    it('checks every desiredSize dimension branch', () => {
        const element: PathElement = new PathElement();
        const availableSize: Size =
            new Size(1000, 1000);

        element.staticSize = false;
        element.transformPath = false;
        (element as any).isDirt = false;
        element.canMeasurePath = false;
        element.relativeMode = 'Point' as any;
        element.absoluteBounds =
            new Rect(10, 20, 90, 60);

        /*
         * Width undefined and height defined.
         */
        element.width = undefined;
        element.height = 75;

        let result: Size =
            element.measure(availableSize);

        expect(result).toEqual(new Size(90, 75));

        /*
         * Height zero must use absoluteBounds.height.
         */
        element.width = undefined;
        element.height = 0;

        result = element.measure(availableSize);

        expect(result).toEqual(new Size(90, 60));

        /*
         * Height undefined and width defined.
         */
        element.width = 125;
        element.height = undefined;

        result = element.measure(availableSize);

        expect(result).toEqual(new Size(125, 60));

        /*
         * Width zero must use absoluteBounds.width.
         */
        element.width = 0;
        element.height = undefined;

        result = element.measure(availableSize);

        expect(result).toEqual(new Size(90, 60));

        /*
         * Both dimensions defined must use the final else branch.
         */
        element.width = 130;
        element.height = 85;

        result = element.measure(availableSize);

        expect(result).toEqual(new Size(130, 85));
    });

    it('validates desired size against maximum dimensions', () => {
        const element: PathElement = new PathElement();

        element.staticSize = false;
        element.transformPath = false;
        (element as any).isDirt = false;
        element.relativeMode = 'Point' as any;
        element.absoluteBounds =
            new Rect(10, 20, 300, 200);

        element.width = 300;
        element.height = 200;
        element.maxWidth = 180;
        element.maxHeight = 110;

        const result: Size = element.measure(
            new Size(1000, 1000)
        );

        expect(result).toEqual(new Size(180, 110));
    });

    it('checks arrange dirty, width, height and unchanged conditions', () => {
        const element: PathElement = new PathElement();

        const updatePathSpy: jasmine.Spy = spyOn(
            element,
            'updatePath'
        ).and.returnValue('updated-path');

        (element as any).pathData = pathData;
        element.staticSize = false;
        element.absoluteBounds =
            new Rect(0, 0, 100, 50);

        /*
         * Dirty state alone.
         */
        (element as any).isDirt = true;
        element.actualSize = new Size(100, 50);
        element.desiredSize = new Size(100, 50);
        (element as any).points = [{ x: 1, y: 2 }];

        element.arrange(new Size(100, 50));

        expect(updatePathSpy).toHaveBeenCalledTimes(1);
        expect(element.absolutePath).toBe('updated-path');
        expect((element as any).points).toBeNull();
        expect((element as any).isDirt).toBe(false);

        /*
         * Width change alone.
         */
        updatePathSpy.calls.reset();

        (element as any).isDirt = false;
        element.actualSize = new Size(100, 50);
        element.desiredSize = new Size(120, 50);
        (element as any).points = [{ x: 3, y: 4 }];

        element.arrange(new Size(120, 50));

        expect(updatePathSpy).toHaveBeenCalledTimes(1);
        expect((element as any).points).toBeNull();

        /*
         * Height change alone.
         */
        updatePathSpy.calls.reset();

        (element as any).isDirt = false;
        element.actualSize = new Size(120, 50);
        element.desiredSize = new Size(120, 80);
        (element as any).points = [{ x: 5, y: 6 }];

        element.arrange(new Size(120, 80));

        expect(updatePathSpy).toHaveBeenCalledTimes(1);
        expect((element as any).points).toBeNull();

        /*
         * Clean and unchanged.
         */
        updatePathSpy.calls.reset();

        const cachedPoints: any[] = [
            { x: 7, y: 8 }
        ];

        (element as any).isDirt = false;
        element.actualSize = new Size(120, 80);
        element.desiredSize = new Size(120, 80);
        (element as any).points = cachedPoints;

        element.arrange(new Size(120, 80));

        expect(updatePathSpy).not.toHaveBeenCalled();
        expect((element as any).points).toBe(
            cachedPoints
        );
        expect(element.actualSize).toBe(
            element.desiredSize
        );
    });

    it('preserves cached points while arranging a static path', () => {
        const element: PathElement = new PathElement();

        const cachedPoints: any[] = [
            { x: 10, y: 20 }
        ];

        spyOn(
            element,
            'updatePath'
        ).and.returnValue('static-path');

        (element as any).pathData = pathData;
        element.staticSize = true;
        (element as any).isDirt = true;
        element.absoluteBounds =
            new Rect(0, 0, 100, 50);
        element.actualSize = new Size(100, 50);
        element.desiredSize = new Size(100, 50);
        (element as any).points = cachedPoints;

        element.arrange(new Size(100, 50));

        expect(element.absolutePath).toBe('static-path');
        expect((element as any).points).toBe(
            cachedPoints
        );
        expect((element as any).isDirt).toBe(false);
    });

    it('sets isDirt before updatePath during arrange', () => {
        const element: PathElement = new PathElement();

        const processed: any[] = [
            {
                command: 'M',
                x: 0,
                y: 0
            }
        ];

        const split: any[] = [processed];

        spyOn(
            pathUtil,
            'processPathData'
        ).and.returnValue(processed as any);

        spyOn(
            pathUtil,
            'splitArrayCollection'
        ).and.returnValue(split as any);

        const transformSpy: jasmine.Spy = spyOn(
            pathUtil,
            'transformPath'
        ).and.returnValue('transformed-path');

        const getPathStringSpy: jasmine.Spy = spyOn(
            pathUtil,
            'getPathString'
        ).and.returnValue('original-path');

       (element as any).pathData = pathData;
        element.staticSize = false;
        element.transformPath = true;
        element.absoluteBounds =
            new Rect(0, 0, 100, 50);

        /*
         * desiredSize equals absoluteBounds, so updatePath does not
         * apply scaling. arrange must set isDirt to true before
         * updatePath executes.
         */
        element.desiredSize = new Size(100, 50);

        /*
         * The different previous width causes arrange to enter its
         * update block.
         */
        element.actualSize = new Size(90, 50);
        (element as any).isDirt = false;

        element.arrange(new Size(100, 50));

        expect(transformSpy).toHaveBeenCalledTimes(1);

        const transformArgs: any[] =
            transformSpy.calls.mostRecent().args;

        expect(transformArgs[0]).toBe(split);

        /*
         * updatePath initializes these arguments using:
         *
         * scaleX = -bounds.x
         * scaleY = -bounds.y
         *
         * Negating zero produces negative zero.
         */
        expect(transformArgs[1]).toBe(-0);
        expect(transformArgs[2]).toBe(-0);

        expect(transformArgs[3]).toBe(false);
        expect(transformArgs[4]).toBe(0);
        expect(transformArgs[5]).toBe(0);
        expect(transformArgs[6]).toBe(0);
        expect(transformArgs[7]).toBe(0);

        /*
         * transformPath being called instead of getPathString proves
         * that arrange set isDirt to true before calling updatePath.
         */
        expect(getPathStringSpy).not.toHaveBeenCalled();
        expect(element.absolutePath).toBe(
            'transformed-path'
        );

        /*
         * arrange resets isDirt after updating the path.
         */
        expect((element as any).isDirt).toBe(false);
    });

    it('checks updatePath scaling and transform conditions', () => {
        const element: PathElement = new PathElement();

        const processed: any[] = [
            {
                command: 'M',
                x: 10,
                y: 20
            }
        ];

        const split: any[] = [processed];

        spyOn(
            pathUtil,
            'processPathData'
        ).and.returnValue(processed as any);

        spyOn(
            pathUtil,
            'splitArrayCollection'
        ).and.returnValue(split as any);

        const transformSpy: jasmine.Spy = spyOn(
            pathUtil,
            'transformPath'
        ).and.returnValue('transformed-path');

        const getPathStringSpy: jasmine.Spy = spyOn(
            pathUtil,
            'getPathString'
        ).and.returnValue('original-path');

        /*
         * Clean and unscaled.
         */
        (element as any).isDirt = false;
        element.transformPath = true;

        let result: string = element.updatePath(
            pathData,
            new Rect(10, 20, 100, 50),
            new Size(100, 50)
        );

        expect(transformSpy).not.toHaveBeenCalled();
        expect(getPathStringSpy).toHaveBeenCalledWith(
            split
        );
        expect(result).toBe('original-path');

        /*
         * Width scaling only.
         */
        transformSpy.calls.reset();
        getPathStringSpy.calls.reset();

        result = element.updatePath(
            pathData,
            new Rect(10, 20, 100, 50),
            new Size(200, 50)
        );

        expect(transformSpy).toHaveBeenCalledWith(
            split,
            2,
            1,
            true,
            10,
            20,
            0,
            0
        );
        expect(result).toBe('transformed-path');

        /*
         * Height scaling only.
         */
        transformSpy.calls.reset();

        result = element.updatePath(
            pathData,
            new Rect(10, 20, 100, 50),
            new Size(100, 150)
        );

        expect(transformSpy).toHaveBeenCalledWith(
            split,
            1,
            3,
            true,
            10,
            20,
            0,
            0
        );

        /*
         * Dirty and unscaled.
         */
        transformSpy.calls.reset();

        (element as any).isDirt = true;
        element.transformPath = true;

        result = element.updatePath(
            pathData,
            new Rect(10, 20, 100, 50),
            new Size(100, 50)
        );

        expect(transformSpy).toHaveBeenCalledWith(
            split,
            -10,
            -20,
            false,
            10,
            20,
            0,
            0
        );

        /*
         * Transformation disabled.
         */
        transformSpy.calls.reset();
        getPathStringSpy.calls.reset();

        element.transformPath = false;

        result = element.updatePath(
            pathData,
            new Rect(10, 20, 100, 50),
            new Size(200, 150)
        );

        expect(transformSpy).not.toHaveBeenCalled();
        expect(getPathStringSpy).toHaveBeenCalledWith(
            split
        );
        expect(result).toBe('original-path');
    });

    it('uses one as divisor for zero path bounds', () => {
        const element: PathElement = new PathElement();
        const processed: any[] = [];
        const split: any[] = [];

        spyOn(
            pathUtil,
            'processPathData'
        ).and.returnValue(processed as any);

        spyOn(
            pathUtil,
            'splitArrayCollection'
        ).and.returnValue(split as any);

        const transformSpy: jasmine.Spy = spyOn(
            pathUtil,
            'transformPath'
        ).and.returnValue('zero-bounds-path');

        (element as any).isDirt = false;
        element.transformPath = true;

        /*
         * Both bounds dimensions are zero.
         */
        element.updatePath(
            pathData,
            new Rect(5, 6, 0, 0),
            new Size(20, 30)
        );

        expect(transformSpy).toHaveBeenCalledWith(
            split,
            20,
            30,
            true,
            5,
            6,
            0,
            0
        );

        /*
         * Width bound is zero.
         */
        transformSpy.calls.reset();

        element.updatePath(
            pathData,
            new Rect(5, 6, 0, 10),
            new Size(20, 30)
        );

        expect(transformSpy).toHaveBeenCalledWith(
            split,
            20,
            3,
            true,
            5,
            6,
            0,
            0
        );

        /*
         * Height bound is zero.
         */
        transformSpy.calls.reset();

        element.updatePath(
            pathData,
            new Rect(5, 6, 10, 0),
            new Size(20, 30)
        );

        expect(transformSpy).toHaveBeenCalledWith(
            split,
            2,
            30,
            true,
            5,
            6,
            0,
            0
        );
    });

    it('memory leak', () => {
        profile.sample();

        const average: number = inMB(
            profile.averageChange
        );

        expect(average).toBeLessThan(10);

        const memory: number = inMB(
            getMemoryProfile()
        );

        expect(memory).toBeLessThan(
            profile.samples[0] + 0.25
        );
    });
});