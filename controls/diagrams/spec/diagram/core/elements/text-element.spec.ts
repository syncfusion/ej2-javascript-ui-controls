import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../../src/diagram/diagram';
import { TextElement } from '../../../../src/diagram/core/elements/text-element';
import { Size } from '../../../../src/diagram/primitives/size';
import { Rect } from '../../../../src/diagram/primitives/rect';
import * as domUtil from '../../../../src/diagram/utility/dom-util';
import {
    profile,
    inMB,
    getMemoryProfile
} from '../../../../spec/common.spec';

describe('TextElement mutation coverage through Diagram annotation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let textElement: TextElement;

    /**
     * Finds the TextElement created by Diagram for the node annotation.
     * This avoids depending on a fixed wrapper child index.
     */
    const findTextElement = (wrapper: any): TextElement => {
        if (wrapper instanceof TextElement) {
            return wrapper;
        }

        if (wrapper && wrapper.children) {
            for (const child of wrapper.children) {
                const result: TextElement =
                    findTextElement(child);

                if (result) {
                    return result;
                }
            }
        }

        return null;
    };

    beforeAll((): void => {
        ele = createElement('div', {
            id: 'diagram_text_element_mutation'
        });

        document.body.appendChild(ele);

        diagram = new Diagram({
            width: '800px',
            height: '600px',
            nodes: [
                {
                    id: 'textNode',
                    offsetX: 250,
                    offsetY: 180,
                    width: 200,
                    height: 100,
                    annotations: [
                        {
                            id: 'annotation1',
                            content: 'Diagram annotation',
                            width: 160,
                            height: 50,
                            horizontalAlignment: 'Center',
                            verticalAlignment: 'Center',
                            margin: {
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0
                            }
                        }
                    ]
                }
            ]
        });

        diagram.appendTo(
            '#diagram_text_element_mutation'
        );

        textElement = findTextElement(
            diagram.nodes[0].wrapper
        );
    });

    afterAll((): void => {
        if (diagram) {
            diagram.destroy();
        }

        if (ele) {
            ele.remove();
        }

        textElement = null;
        diagram = null;
        ele = null;
    });

    beforeEach((): void => {
        /*
         * Restore the Diagram-generated TextElement before every test.
         */
        textElement.content = 'Diagram annotation';
        textElement.width = 160;
        textElement.height = 50;
        textElement.horizontalAlignment = 'Center' as any;
        textElement.verticalAlignment = 'Center' as any;
        textElement.isLaneOrientation = false;
        textElement.canMeasure = true;
        textElement.canConsiderBounds = true;
        textElement.margin.left = 0;
        textElement.margin.right = 0;
        textElement.margin.top = 0;
        textElement.margin.bottom = 0;
        (textElement as any).isDirt = false;
        textElement.doWrap = false;
        textElement.desiredSize = new Size(160, 50);
        textElement.actualSize = new Size(160, 50);
    });

    it('checks the Diagram-created annotation TextElement defaults', () => {
        expect(textElement).not.toBeNull();
        expect(textElement instanceof TextElement).toBe(true);

        expect(textElement.content).toBe(
            'Diagram annotation'
        );

        /*
         * Observable TextElement defaults.
         */
        expect(textElement.rotationReference).toBe(
            'Parent'
        );
        expect(textElement.isLaneOrientation).toBe(
            false
        );
        expect(textElement.canConsiderBounds).toBe(
            true
        );
        expect(textElement.annotationVisibility).toBe(
            'Visible'
        );
        expect(textElement.hyperlink.color).toBe('blue');
        expect(textElement.isLabelResizing).toBe(false);

        expect(textElement.style.color).toBe('black');
        expect(textElement.style.fill).toBe(
            'transparent'
        );
        expect(textElement.style.strokeColor).toBe(
            'transparent'
        );
        expect(textElement.style.fontFamily).toBe(
            'Arial'
        );
        expect(textElement.style.fontSize).toBe(12);
        expect(textElement.style.whiteSpace).toBe(
            'CollapseSpace'
        );
        expect(textElement.style.textWrapping).toBe(
            'WrapWithOverflow'
        );
        expect(textElement.style.textAlign).toBe(
            'Center'
        );
        expect(textElement.style.italic).toBe(false);
        expect(textElement.style.bold).toBe(false);
        expect(textElement.style.textDecoration).toBe(
            'None'
        );
        expect(textElement.style.textOverflow).toBe(
            'Wrap'
        );
    });

    it('updates annotation content through Diagram data binding', () => {
        const node: any = diagram.nodes[0];
        const updatedContent: string =
            'Updated Diagram annotation';

        node.annotations[0].content = updatedContent;

        diagram.dataBind();

        textElement = findTextElement(
            diagram.nodes[0].wrapper
        );

        /*
         * Verify the final Diagram state.
         *
         * Do not expect isDirt or doWrap to remain true after dataBind().
         * Diagram completes measure and arrange during data binding,
         * and arrange() resets isDirt to false.
         */
        expect(textElement).not.toBeNull();
        expect(textElement.content).toBe(updatedContent);
        expect((textElement as any).textContent).toBe(updatedContent);

        /*
         * Verify the content setter behavior independently on the
         * Diagram-generated TextElement.
         */
        (textElement as any).isDirt = false;
        textElement.doWrap = false;

        textElement.content =
            'Direct Diagram annotation update';

        expect(textElement.content).toBe(
            'Direct Diagram annotation update'
        );
        expect((textElement as any).textContent).toBe(
            'Direct Diagram annotation update'
        );
        expect((textElement as any).isDirt).toBe(true);
        expect(textElement.doWrap).toBe(true);

        /*
         * Restore the annotation using the Diagram model.
         */
        node.annotations[0].content =
            'Diagram annotation';

        diagram.dataBind();

        textElement = findTextElement(
            diagram.nodes[0].wrapper
        );
    });

    it('does not mark the Diagram annotation dirty when assigning identical content', () => {
        const currentContent: string =
            textElement.content;

        (textElement as any).isDirt = false;
        textElement.doWrap = false;

        textElement.content = currentContent;

        /*
         * Kills the mutation that forces the content condition
         * to true.
         */
        expect(textElement.content).toBe(
            currentContent
        );
        expect((textElement as any).isDirt).toBe(false);
        expect(textElement.doWrap).toBe(false);
    });

    it('checks annotation property descriptors on the Diagram TextElement', () => {
        const contentDescriptor: any =
            Object.getOwnPropertyDescriptor(
                TextElement.prototype,
                'content'
            );

        const childDescriptor: any =
            Object.getOwnPropertyDescriptor(
                TextElement.prototype,
                'childNodes'
            );

        const wrapDescriptor: any =
            Object.getOwnPropertyDescriptor(
                TextElement.prototype,
                'wrapBounds'
            );

        /*
         * Kills enumerable and configurable mutations.
         */
        expect(contentDescriptor.enumerable).toBe(true);
        expect(contentDescriptor.configurable).toBe(true);

        expect(childDescriptor.enumerable).toBe(true);
        expect(childDescriptor.configurable).toBe(true);

        expect(wrapDescriptor.enumerable).toBe(true);
        expect(wrapDescriptor.configurable).toBe(true);

        const nodes: any[] = [
            {
                text: 'Diagram annotation line',
                x: 10,
                y: 20
            }
        ];

        textElement.childNodes = nodes as any;

        expect(textElement.childNodes).toBe(nodes as any);
        expect((textElement as any).textNodes).toBe(nodes as any);

        const wrapBounds: Rect =
            new Rect(10, 20, 100, 40);

        textElement.wrapBounds = wrapBounds;

        expect(textElement.wrapBounds).toBe(
            wrapBounds
        );
    });

    it('refreshes the Diagram annotation TextElement', () => {
        (textElement as any).isDirt = false;

        textElement.refreshTextElement();

        expect((textElement as any).isDirt).toBe(true);
    });

    it('measures the Diagram annotation only when dirty and measurable', () => {
        const measureTextSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureText'
        ).and.returnValue(new Size(90, 40));

        const availableSize: Size =
            new Size(300, 200);

        textElement.width = undefined;
        textElement.height = undefined;
        textElement.horizontalAlignment = 'Left' as any;
        textElement.isLaneOrientation = false;

        /*
         * Dirty and measurable.
         */
        (textElement as any).isDirt = true;
        textElement.canMeasure = true;

        let result: Size =
            textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(new Size(90, 40));

        /*
         * Clean and measurable.
         */
        measureTextSpy.calls.reset();

        (textElement as any).isDirt = false;
        textElement.canMeasure = true;
        textElement.desiredSize = new Size(75, 35);

        result = textElement.measure(availableSize);

        expect(measureTextSpy).not.toHaveBeenCalled();
        expect(result).toEqual(new Size(75, 35));

        /*
         * Dirty but canMeasure is false.
         */
        measureTextSpy.calls.reset();

        (textElement as any).isDirt = true;
        textElement.canMeasure = false;
        textElement.desiredSize = new Size(65, 25);

        result = textElement.measure(availableSize);

        expect(measureTextSpy).not.toHaveBeenCalled();
        expect(result).toEqual(new Size(65, 25));
    });

    it('uses annotation width or Diagram available width as base measure', () => {
        const measureTextSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureText'
        ).and.returnValue(new Size(80, 30));

        const availableSize: Size =
            new Size(300, 200);

        textElement.content = 'Width measurement';
        textElement.canMeasure = true;
        textElement.isLaneOrientation = false;
        textElement.horizontalAlignment = 'Left' as any;
        textElement.height = undefined;

        /*
         * Explicit annotation width.
         */
        textElement.width = 180;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Width measurement',
            180
        );

        /*
         * Undefined width uses available width.
         */
        measureTextSpy.calls.reset();

        textElement.width = undefined;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Width measurement',
            300
        );

        /*
         * Zero width also uses available width because the
         * implementation uses width || availableSize.width.
         */
        measureTextSpy.calls.reset();

        textElement.width = 0;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Width measurement',
            300
        );
    });

    it('subtracts vertical margins for lane-oriented centered text', () => {
        const measureTextSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureText'
        ).and.returnValue(new Size(80, 30));

        const availableSize: Size =
            new Size(300, 200);

        textElement.content =
            'Lane Diagram annotation';

        textElement.width = undefined;
        textElement.height = undefined;
        textElement.canMeasure = true;
        textElement.isLaneOrientation = true;
        textElement.verticalAlignment = 'Center' as any;

        /*
         * Top margin only:
         * 200 - 11 = 189.
         */
        textElement.margin.top = 11;
        textElement.margin.bottom = 0;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            textElement.content,
            189
        );

        /*
         * Bottom margin only:
         * 200 - 7 = 193.
         */
        measureTextSpy.calls.reset();

        textElement.margin.top = 0;
        textElement.margin.bottom = 7;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            textElement.content,
            193
        );

        /*
         * Both margins:
         * 200 - (11 + 7) = 182.
         */
        measureTextSpy.calls.reset();

        textElement.margin.top = 11;
        textElement.margin.bottom = 7;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            textElement.content,
            182
        );

        /*
         * Both zero margins must retain the full available height.
         */
        measureTextSpy.calls.reset();

        textElement.margin.top = 0;
        textElement.margin.bottom = 0;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            textElement.content,
            200
        );

        /*
         * Noncenter vertical alignment must not subtract margins.
         */
        measureTextSpy.calls.reset();

        textElement.verticalAlignment = 'Top' as any;
        textElement.margin.top = 11;
        textElement.margin.bottom = 7;
        (textElement as any).isDirt = true;

        textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            textElement.content,
            200
        );
    });

    it('uses measured annotation size when width or height is undefined', () => {
        const measureTextSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureText'
        ).and.returnValue(new Size(96, 38));

        const availableSize: Size =
            new Size(300, 200);

        textElement.content = 'Measured annotation';
        textElement.canMeasure = true;
        textElement.isLaneOrientation = false;
        textElement.horizontalAlignment = 'Left' as any;
        textElement.margin.left = 0;
        textElement.margin.right = 0;

        /*
         * Width undefined and height defined.
         *
         * Since one dimension is undefined, the measured size must
         * be used for both dimensions.
         */
        textElement.width = undefined;
        textElement.height = 70;
        (textElement as any).isDirt = true;

        let result: Size =
            textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalled();
        expect(result).toEqual(new Size(96, 38));

        /*
         * Width defined and height undefined.
         */
        measureTextSpy.calls.reset();

        textElement.width = 150;
        textElement.height = undefined;
        (textElement as any).isDirt = true;

        result = textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalled();
        expect(result).toEqual(new Size(96, 38));

        /*
         * Both width and height undefined.
         */
        measureTextSpy.calls.reset();

        textElement.width = undefined;
        textElement.height = undefined;
        (textElement as any).isDirt = true;

        result = textElement.measure(availableSize);

        expect(measureTextSpy).toHaveBeenCalled();
        expect(result).toEqual(new Size(96, 38));
    });

    it('uses explicit annotation dimensions when width and height are defined', () => {
        const measureTextSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureText'
        ).and.returnValue(new Size(96, 38));

        const availableSize: Size =
            new Size(300, 200);

        textElement.content =
            'Explicit Diagram annotation';

        textElement.canMeasure = true;
        textElement.isLaneOrientation = false;
        textElement.horizontalAlignment = 'Left' as any;
        textElement.margin.left = 0;
        textElement.margin.right = 0;

        /*
         * The measured size differs deliberately from the explicitly
         * assigned width and height.
         */
        textElement.width = 150;
        textElement.height = 70;
        (textElement as any).isDirt = true;

        const result: Size =
            textElement.measure(availableSize);

        /*
         * measureText may run, but the final desired size must use
         * the explicit annotation dimensions.
         */
        expect(measureTextSpy).toHaveBeenCalled();
        expect(result).toEqual(new Size(150, 70));
    });

    it('validates the Diagram annotation desired size', () => {
        textElement.width = 300;
        textElement.height = 200;
        textElement.maxWidth = 180;
        textElement.maxHeight = 110;
        (textElement as any).isDirt = false;
        textElement.canMeasure = false;
        textElement.desiredSize =
            new Size(300, 200);

        const result: Size = textElement.measure(
            new Size(1000, 1000)
        );

        expect(result).toEqual(new Size(180, 110));

        /*
         * Restore constraints for the shared Diagram wrapper.
         */
        textElement.maxWidth = undefined;
        textElement.maxHeight = undefined;
    });

    it('sets doWrap for dirty and changed annotation sizes', () => {
        /*
         * Dirty state alone must set doWrap.
         */
        textElement.actualSize =
            new Size(100, 50);

        (textElement as any).isDirt = true;
        textElement.doWrap = false;

        textElement.arrange(
            new Size(100, 50)
        );

        expect(textElement.doWrap).toBe(true);
        expect((textElement as any).isDirt).toBe(false);

        /*
         * Width change alone must set doWrap.
         */
        textElement.actualSize =
            new Size(100, 50);

        (textElement as any).isDirt = false;
        textElement.doWrap = false;

        textElement.arrange(
            new Size(120, 50)
        );

        expect(textElement.doWrap).toBe(true);
        expect((textElement as any).isDirt).toBe(false);

        /*
         * Height change alone must set doWrap.
         */
        textElement.actualSize =
            new Size(120, 50);

        (textElement as any).isDirt = false;
        textElement.doWrap = false;

        textElement.arrange(
            new Size(120, 80)
        );

        expect(textElement.doWrap).toBe(true);
        expect((textElement as any).isDirt).toBe(false);

        /*
         * Clean state with unchanged dimensions must preserve
         * doWrap as false.
         */
        textElement.actualSize =
            new Size(120, 80);

        (textElement as any).isDirt = false;
        textElement.doWrap = false;

        textElement.arrange(
            new Size(120, 80)
        );

        expect(textElement.doWrap).toBe(false);
        expect((textElement as any).isDirt).toBe(false);
    });

    it('updates Diagram annotation size and bounds during arrange', () => {
        textElement.offsetX = 250;
        textElement.offsetY = 180;
        textElement.pivot = {
            x: 0.5,
            y: 0.5
        };

        textElement.actualSize =
            new Size(100, 50);

        (textElement as any).isDirt = true;
        textElement.doWrap = false;

        const desiredSize: Size =
            new Size(120, 80);

        const result: Size =
            textElement.arrange(desiredSize);

        /*
         * arrange must assign the supplied size as actualSize.
         */
        expect(result).toBe(textElement.actualSize);
        expect(textElement.actualSize).toBe(
            desiredSize
        );

        /*
         * The centered bounds for a 120 x 80 element at
         * offset 250 x 180 are:
         *
         * x = 250 - 120 * 0.5 = 190
         * y = 180 - 80 * 0.5 = 140
         */
        expect(textElement.bounds.x).toBe(190);
        expect(textElement.bounds.y).toBe(140);
        expect(textElement.bounds.width).toBe(120);
        expect(textElement.bounds.height).toBe(80);

        expect(textElement.doWrap).toBe(true);
        expect((textElement as any).isDirt).toBe(false);
    });

    it('updates annotation content, size and wrapping through Diagram data binding', () => {
        const node: any = diagram.nodes[0];

        node.annotations[0].content =
            'Data-bound Diagram annotation';

        node.annotations[0].width = 140;
        node.annotations[0].height = 60;

        diagram.dataBind();

        textElement = findTextElement(
            diagram.nodes[0].wrapper
        );

        expect(textElement).not.toBeNull();

        expect(textElement.width).toBe(140);
        expect(textElement.height).toBe(60);

        expect(textElement.desiredSize.width).toBe(140);
        expect(textElement.desiredSize.height).toBe(60);

        expect(textElement.actualSize.width).toBe(140);
        expect(textElement.actualSize.height).toBe(60);
    });

    it('updates the content of the Diagram-created annotation TextElement', () => {
        const originalContent: string = textElement.content;
        const updatedContent: string =
            'Data-bound Diagram annotation';

        (textElement as any).isDirt = false;
        textElement.doWrap = false;

        /*
         * Update the TextElement generated by Diagram.
         *
         * Updating node.annotations[0].content followed by dataBind()
         * does not refresh the existing TextElement wrapper in this
         * Diagram lifecycle, so the setter is exercised directly on
         * the Diagram-created annotation element.
         */
        textElement.content = updatedContent;

        expect(textElement.content).toBe(updatedContent);
        expect((textElement as any).textContent).toBe(updatedContent);
        expect((textElement as any).isDirt).toBe(true);
        expect(textElement.doWrap).toBe(true);

        /*
         * Arrange completes the TextElement lifecycle and clears isDirt.
         */
        textElement.desiredSize = new Size(160, 50);
        textElement.arrange(textElement.desiredSize);

        expect(textElement.actualSize).toBe(
            textElement.desiredSize
        );
        expect((textElement as any).isDirt).toBe(false);

        /*
         * Restore the shared Diagram-created TextElement.
         */
        textElement.content = originalContent;
        (textElement as any).isDirt = false;
        textElement.doWrap = false;
    });

    it('restores the Diagram annotation fixture', () => {
        const node: any = diagram.nodes[0];

        node.annotations[0].content =
            'Diagram annotation';

        node.annotations[0].width = 160;
        node.annotations[0].height = 50;

        node.annotations[0].horizontalAlignment =
            'Center';

        node.annotations[0].verticalAlignment =
            'Center';

        node.annotations[0].margin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        diagram.dataBind();

        textElement = findTextElement(
            diagram.nodes[0].wrapper
        );

        expect(textElement.content).toBe(
            'Diagram annotation'
        );

        expect(textElement.width).toBe(160);
        expect(textElement.height).toBe(50);
    });

    it('covers TextElement measurement branches using the Diagram annotation', () => {
        const availableSize: Size = new Size(400, 300);

        const measureTextSpy: jasmine.Spy = spyOn(
            domUtil,
            'measureText'
        ).and.returnValue(new Size(96, 38));

        /*
         * Capture the desired size passed into validateDesiredSize.
         * This prevents validation from hiding a wrong branch result.
         */
        const validateSpy: jasmine.Spy = spyOn(
            textElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size,
            currentAvailableSize: Size
        ): Size => {
            return desiredSize;
        });

        /*
         * Case 1:
         * Dirty and measurable, non-lane, centered, right margin only.
         *
         * baseMeasure = 200 - 13 = 187.
         *
         * Kills horizontal Center condition and right-margin checks.
         */
        textElement.content = 'Horizontal annotation';
        textElement.width = 200;
        textElement.height = undefined;
        textElement.isLaneOrientation = false;
        textElement.horizontalAlignment = 'Center' as any;
        textElement.verticalAlignment = 'Top' as any;
        textElement.margin.left = 0;
        textElement.margin.right = 13;
        textElement.margin.top = 0;
        textElement.margin.bottom = 0;
        textElement.canMeasure = true;
        (textElement as any).isDirt = true;

        let result: Size = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Horizontal annotation',
            187
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 2:
         * Left margin only.
         *
         * baseMeasure = 200 - 5 = 195.
         *
         * Independently kills the left-margin condition mutations
         * and OR-to-AND mutation.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.margin.left = 5;
        textElement.margin.right = 0;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Horizontal annotation',
            195
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 3:
         * Both horizontal margins, using unequal values.
         *
         * baseMeasure = 200 - (5 + 13) = 182.
         *
         * Kills block removal, += replacement and arithmetic mutation.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.margin.left = 5;
        textElement.margin.right = 13;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Horizontal annotation',
            182
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 4:
         * Noncenter alignment with margins.
         *
         * Margins must not be subtracted.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.horizontalAlignment = 'Left' as any;
        textElement.margin.left = 5;
        textElement.margin.right = 13;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Horizontal annotation',
            200
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 5:
         * Lane-oriented centered annotation with top margin only.
         *
         * baseMeasure = availableSize.height - top
         *             = 300 - 11
         *             = 289.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.content = 'Lane annotation';
        textElement.width = undefined;
        textElement.height = undefined;
        textElement.isLaneOrientation = true;
        textElement.verticalAlignment = 'Center' as any;
        textElement.margin.top = 11;
        textElement.margin.bottom = 0;
        textElement.margin.left = 0;
        textElement.margin.right = 0;
        textElement.canMeasure = true;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Lane annotation',
            289
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 6:
         * Lane-oriented centered annotation with bottom margin only.
         *
         * baseMeasure = 300 - 7 = 293.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.margin.top = 0;
        textElement.margin.bottom = 7;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Lane annotation',
            293
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 7:
         * Lane-oriented centered annotation with both margins.
         *
         * baseMeasure = 300 - (11 + 7) = 282.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.margin.top = 11;
        textElement.margin.bottom = 7;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Lane annotation',
            282
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 8:
         * Noncenter lane annotation with nonzero margins.
         *
         * Vertical margins must not be subtracted.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.verticalAlignment = 'Top' as any;
        textElement.margin.top = 11;
        textElement.margin.bottom = 7;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledWith(
            textElement,
            textElement.style,
            'Lane annotation',
            300
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 9:
         * Dirty but canMeasure is false.
         *
         * The existing desiredSize must be reused.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.width = undefined;
        textElement.height = undefined;
        textElement.desiredSize = new Size(81, 37);
        (textElement as any).isDirt = true;
        textElement.canMeasure = false;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).not.toHaveBeenCalled();
        expect(validateSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                width: 81,
                height: 37
            }),
            availableSize
        );
        expect(result).toEqual(new Size(81, 37));

        /*
         * Case 10:
         * Clean but canMeasure is true.
         *
         * isDirt && canMeasure must still be false.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.desiredSize = new Size(82, 36);
        (textElement as any).isDirt = false;
        textElement.canMeasure = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).not.toHaveBeenCalled();
        expect(result).toEqual(new Size(82, 36));

        /*
         * Case 11:
         * Width undefined and height defined.
         *
         * The measured size must be used.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.content = 'Partial annotation';
        textElement.width = undefined;
        textElement.height = 71;
        textElement.isLaneOrientation = false;
        textElement.horizontalAlignment = 'Left' as any;
        textElement.margin.left = 0;
        textElement.margin.right = 0;
        textElement.canMeasure = true;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledTimes(1);
        expect(validateSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                width: 96,
                height: 38
            }),
            availableSize
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 12:
         * Width defined and height undefined.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.width = 151;
        textElement.height = undefined;
        (textElement as any).isDirt = true;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).toHaveBeenCalledTimes(1);
        expect(validateSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                width: 96,
                height: 38
            }),
            availableSize
        );
        expect(result).toEqual(new Size(96, 38));

        /*
         * Case 13:
         * Both dimensions defined and measurement skipped.
         *
         * Existing desiredSize is deliberately different.
         *
         * Correct final else branch: 151 x 71.
         * Forced true condition: 17 x 19.
         * Removed else block: 17 x 19.
         */
        measureTextSpy.calls.reset();
        validateSpy.calls.reset();

        textElement.width = 151;
        textElement.height = 71;
        textElement.desiredSize = new Size(17, 19);
        (textElement as any).isDirt = false;
        textElement.canMeasure = false;

        result = textElement.measure(
            availableSize
        );

        expect(measureTextSpy).not.toHaveBeenCalled();

        expect(validateSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                width: 151,
                height: 71
            }),
            availableSize
        );

        expect(result).toEqual(new Size(151, 71));

        /*
         * Restore the Diagram-created annotation TextElement.
         */
        textElement.content = 'Diagram annotation';
        textElement.width = 160;
        textElement.height = 50;
        textElement.isLaneOrientation = false;
        textElement.horizontalAlignment = 'Center' as any;
        textElement.verticalAlignment = 'Center' as any;
        textElement.margin.left = 0;
        textElement.margin.right = 0;
        textElement.margin.top = 0;
        textElement.margin.bottom = 0;
        textElement.canMeasure = true;
        (textElement as any).isDirt = false;
        textElement.desiredSize = new Size(160, 50);
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