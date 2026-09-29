import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../../src/diagram/diagram';
import { NodeModel } from '../../../../src/diagram/objects/node-model';
import { ImageElement } from '../../../../src/diagram/core/elements/image-element';
import { Size } from '../../../../src/diagram/primitives/size';
import * as domUtil from '../../../../src/diagram/utility/dom-util';
import {
    profile,
    inMB,
    getMemoryProfile
} from '../../../../spec/common.spec';

describe('Image element mutation coverage', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    const imageSource: string =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" ' +
            'width="120" height="80">' +
            '<rect width="120" height="80" fill="blue"/>' +
            '</svg>'
        );

    beforeAll((): void => {
        ele = createElement('div', {
            id: 'diagram_image_element_mutation'
        });

        document.body.appendChild(ele);

        diagram = new Diagram({
            width: '800px',
            height: '600px',
            nodes: [
                {
                    id: 'imageNode',
                    offsetX: 200,
                    offsetY: 150,
                    width: 120,
                    height: 80,
                    shape: {
                        type: 'Image',
                        source: imageSource,
                        scale: 'None',
                        align: 'None'
                    }
                }
            ]
        });

        diagram.appendTo('#diagram_image_element_mutation');
    });

    afterAll((): void => {
        if (diagram) {
            diagram.destroy();
        }

        if (ele) {
            ele.remove();
        }

        diagram = null;
        ele = null;
    });

    it('kills ImageElement measure condition and fallback mutants using the Diagram image wrapper', () => {
        const node: NodeModel = diagram.nodes[0];
        const image: ImageElement =
            node.wrapper.children[0] as ImageElement;

        const originalSource: string = image.source;
        const availableSize: Size = new Size(1000, 1000);

        const measureImageSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureImage'
        ).and.returnValue(new Size(77, 55));

        let result: Size;

        /*
         * Case 1:
         * Clean + Stretch + width and height defined.
         *
         * isDirt is false, so measureImage must not run.
         * The explicit-size branch must set desiredSize and contentSize.
         */
        (image as any).isDirt = false;
        image.stretch = 'Stretch';
        image.width = 201;
        image.height = 101;
        image.contentSize = new Size(9, 8);

        result = image.measure(
            availableSize,
            image.id,
            null
        );

        expect(measureImageSpy).not.toHaveBeenCalled();
        expect((image as any).isDirt).toBe(false);
        expect(result).toBe(image.desiredSize);
        expect(result).toEqual(new Size(201, 101));
        expect(image.contentSize).toBe(image.desiredSize);

        /*
         * Case 2:
         * Dirty + Stretch + width and height defined.
         *
         * The dirty flag alone must not invoke measureImage because
         * stretch is Stretch and both dimensions are defined.
         */
        measureImageSpy.calls.reset();

        (image as any).isDirt = true;
        image.stretch = 'Stretch';
        image.width = 202;
        image.height = 102;
        image.contentSize = new Size(10, 9);

        result = image.measure(
            availableSize,
            image.id,
            null
        );

        expect(measureImageSpy).not.toHaveBeenCalled();
        expect((image as any).isDirt).toBe(true);
        expect(result).toBe(image.desiredSize);
        expect(result).toEqual(new Size(202, 102));
        expect(image.contentSize).toBe(image.desiredSize);

        /*
         * Case 3:
         * Dirty + Meet + width and height defined.
         *
         * A non-Stretch value must invoke measureImage.
         * Explicit dimensions must still determine desiredSize.
         */
        measureImageSpy.calls.reset();

        const meetContentSize: Size = new Size(11, 10);

        (image as any).isDirt = true;
        image.stretch = 'Meet';
        image.width = 203;
        image.height = 103;
        image.contentSize = meetContentSize;

        result = image.measure(
            availableSize,
            image.id,
            null
        );

        expect(measureImageSpy).toHaveBeenCalledWith(
            image.source,
            meetContentSize,
            image.id,
            null
        );

        expect((image as any).isDirt).toBe(false);
        expect(result).toBe(image.desiredSize);
        expect(result).toEqual(new Size(203, 103));
        expect(image.contentSize).toBe(image.desiredSize);

        /*
         * Case 4:
         * Dirty + Stretch + width and height undefined.
         *
         * Both dimensions being undefined must invoke measureImage.
         * desiredSize must use the measured contentSize.
         */
        measureImageSpy.calls.reset();

        const naturalContentSize: Size = new Size(12, 11);

        (image as any).isDirt = true;
        image.stretch = 'Stretch';
        image.width = undefined;
        image.height = undefined;
        image.contentSize = naturalContentSize;

        result = image.measure(
            availableSize,
            image.id,
            null
        );

        expect(measureImageSpy).toHaveBeenCalledWith(
            image.source,
            naturalContentSize,
            image.id,
            null
        );

        expect((image as any).isDirt).toBe(false);
        expect(result).toBe(image.contentSize);
        expect(image.desiredSize).toBe(image.contentSize);
        expect(result).toEqual(new Size(77, 55));

        /*
         * Case 5:
         * Dirty + Stretch + width defined and height undefined.
         *
         * measureImage must not run because both dimensions are not
         * undefined. The missing height must use the fallback value 50.
         */
        measureImageSpy.calls.reset();

        const widthOnlyContentSize: Size = new Size(31, 41);

        (image as any).isDirt = true;
        image.stretch = 'Stretch';
        image.width = 204;
        image.height = undefined;
        image.contentSize = widthOnlyContentSize;

        result = image.measure(
            availableSize,
            image.id,
            null
        );

        expect(measureImageSpy).not.toHaveBeenCalled();
        expect((image as any).isDirt).toBe(true);
        expect(result).toBe(image.desiredSize);
        expect(result).toEqual(new Size(204, 50));
        expect(image.contentSize).toBe(widthOnlyContentSize);
        expect(image.contentSize).not.toBe(image.desiredSize);

        /*
         * Case 6:
         * Dirty + Stretch + width undefined and height defined.
         *
         * measureImage must not run because both dimensions are not
         * undefined. The missing width must use the fallback value 50.
         */
        measureImageSpy.calls.reset();

        const heightOnlyContentSize: Size = new Size(32, 42);

        (image as any).isDirt = true;
        image.stretch = 'Stretch';
        image.width = undefined;
        image.height = 104;
        image.contentSize = heightOnlyContentSize;

        result = image.measure(
            availableSize,
            image.id,
            null
        );

        expect(measureImageSpy).not.toHaveBeenCalled();
        expect((image as any).isDirt).toBe(true);
        expect(result).toBe(image.desiredSize);
        expect(result).toEqual(new Size(50, 104));
        expect(image.contentSize).toBe(heightOnlyContentSize);
        expect(image.contentSize).not.toBe(image.desiredSize);

        /*
         * Restore the shared Diagram wrapper.
         */
        image.source = originalSource;
        image.width = 120;
        image.height = 80;
        image.stretch = 'Stretch';
        image.contentSize = new Size(120, 80);
        (image as any).isDirt = false;

        image.measure(
            availableSize,
            image.id,
            null
        );
    });

    it('arranges the Diagram image wrapper using desiredSize and updates bounds', () => {
        const node: NodeModel = diagram.nodes[0];
        const image: ImageElement =
            node.wrapper.children[0] as ImageElement;

        image.offsetX = 325;
        image.offsetY = 225;
        image.pivot = {
            x: 0.5,
            y: 0.5
        };

        image.desiredSize = new Size(150, 90);

        const arrangeArgument: Size = new Size(1, 2);
        const result: Size = image.arrange(arrangeArgument);

        /*
         * arrange() must create actualSize using this.desiredSize,
         * rather than using the arrange method argument.
         */
        expect(result).toBe(image.actualSize);
        expect(result).not.toBe(image.desiredSize);
        expect(result).not.toBe(arrangeArgument);
        expect(result).toEqual(new Size(150, 90));

        /*
         * updateBounds() must run after actualSize is assigned.
         */
        expect(image.bounds.x).toBe(250);
        expect(image.bounds.y).toBe(180);
        expect(image.bounds.width).toBe(150);
        expect(image.bounds.height).toBe(90);

        /*
         * Restore the wrapper position and size.
         */
        image.offsetX = 200;
        image.offsetY = 150;
        image.desiredSize = new Size(120, 80);
        image.arrange(image.desiredSize);
    });
    it('checks ImageElement source property getter, setter and descriptor', () => {
        const image: ImageElement =
            diagram.nodes[0].wrapper.children[0] as ImageElement;

        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                ImageElement.prototype,
                'source'
            );

        // Kills mutation of the "source" property name.
        expect(descriptor).toBeDefined();

        // Kills removal of getter and setter blocks.
        expect(typeof descriptor.get).toBe('function');
        expect(typeof descriptor.set).toBe('function');

        // Kills enumerable and configurable BooleanLiteral mutants.
        expect(descriptor.enumerable).toBe(true);
        expect(descriptor.configurable).toBe(true);

        const updatedSource: string = 'updated-image-source';

        (image as any).isDirt = false;

        // Invoke the property setter.
        image.source = updatedSource;

        // Kills removal or mutation of:
        // this.imageSource = value;
        expect(image.source).toBe(updatedSource);

        // Kills removal or mutation of:
        // this.isDirt = true;
        expect((image as any).isDirt).toBe(true);

        // Kills removal or mutation of:
        // return this.imageSource;
        expect(image.source).toBe(updatedSource);

        // Verifies that source is exposed through enumeration.
        expect(Object.keys(image)).toContain('imageSource');

        // Restore the Diagram image source.
        image.source = imageSource;
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