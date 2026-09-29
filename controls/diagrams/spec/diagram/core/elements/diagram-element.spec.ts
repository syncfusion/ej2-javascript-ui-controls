import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../../src/diagram/diagram';
import { DiagramElement } from '../../../../src/diagram/core/elements/diagram-element';
import { Size } from '../../../../src/diagram/primitives/size';
import { Rect } from '../../../../src/diagram/primitives/rect';
import { ElementAction } from '../../../../src/diagram/enum/enum';
import {
    profile,
    inMB,
    getMemoryProfile
} from '../../../../spec/common.spec';

describe('DiagramElement mutation coverage', () => {
    let diagram: Diagram;
    let hostElement: HTMLElement;
    let diagramElement: DiagramElement;

    const baseMeasure = (
        element: DiagramElement,
        availableSize: Size
    ): Size => {
        return DiagramElement.prototype.measure.call(
            element,
            availableSize
        );
    };

    const baseValidateDesiredSize = (
        element: DiagramElement,
        desiredSize: Size | undefined,
        availableSize: Size
    ): Size => {
        return (
            DiagramElement.prototype as any
        ).validateDesiredSize.call(
            element,
            desiredSize,
            availableSize
        ) as Size;
    };

    const resetElement = (): void => {
        diagramElement.id = 'diagramElementNode';

        diagramElement.width = 120;
        diagramElement.height = 80;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.maxHeight = undefined;

        diagramElement.margin.left = 0;
        diagramElement.margin.right = 0;
        diagramElement.margin.top = 0;
        diagramElement.margin.bottom = 0;

        diagramElement.offsetX = 250;
        diagramElement.offsetY = 180;
        diagramElement.pivot = {
            x: 0.5,
            y: 0.5
        };

        diagramElement.isRectElement = false;
        diagramElement.isCalculateDesiredSize = true;

        diagramElement.elementActions =
            ElementAction.None;

        diagramElement.actualSize =
            new Size(120, 80);

        diagramElement.desiredSize =
            new Size(120, 80);

        diagramElement.bounds =
            new Rect(190, 140, 120, 80);

        (diagramElement as any).floatingBounds =
            undefined;

        diagramElement.position = undefined;
        (diagramElement as any).unitMode = undefined;
    };

    beforeAll((): void => {
        hostElement = createElement('div', {
            id: 'diagram_element_mutation'
        });

        document.body.appendChild(hostElement);

        diagram = new Diagram({
            width: '800px',
            height: '600px',
            nodes: [
                {
                    id: 'diagramElementNode',
                    offsetX: 250,
                    offsetY: 180,
                    width: 120,
                    height: 80
                }
            ]
        });

        diagram.appendTo(
            '#diagram_element_mutation'
        );

        diagramElement = (
            diagram.nodes[0] as any
        ).wrapper as DiagramElement;

        expect(diagramElement).not.toBeNull();
    });

    beforeEach((): void => {
        resetElement();
    });

    afterAll((): void => {
        if (diagram) {
            diagram.destroy();
        }

        if (hostElement) {
            hostElement.remove();
        }

        diagramElement = null;
        diagram = null;
        hostElement = null;
    });

    it('checks DiagramElement constructor defaults', () => {
        const element: DiagramElement =
            new DiagramElement();

        expect(element.exportScaleValue).toEqual({
            x: 0,
            y: 0
        });

        expect(element.horizontalAlignment).toBe(
            'Auto'
        );

        expect(element.verticalAlignment).toBe(
            'Auto'
        );

        expect(element.preventContainer).toBe(false);
        expect(element.isSvgRender).toBe(false);
        expect(element.description).toBe('');
        expect(element.shapeType).toBe('');

        expect(
            element.isCalculateDesiredSize
        ).toBe(true);

        expect(element.flipOffset).toEqual({
            x: 0,
            y: 0
        });

        expect(element.float).toBe(false);

        expect(element.style.fill).toBe('white');
        expect(element.style.strokeColor).toBe(
            'black'
        );
        expect(element.style.opacity).toBe(1);
        expect(element.style.strokeWidth).toBe(1);
    });

    it('stores the offset position and unit mode', () => {
        diagramElement.setOffsetWithRespectToBounds(
            25,
            40,
            'Absolute' as any
        );

        expect((diagramElement as any).unitMode).toBe(
            'Absolute' as any
        );

        expect(diagramElement.position).toEqual({
            x: 25,
            y: 40
        });
    });

    it('returns undefined when no offset position exists', () => {
        diagramElement.position = undefined;

        const result: any =
            diagramElement.getAbsolutePosition(
                new Size(200, 100)
            );

        expect(result).toBeUndefined();
    });

    it('returns the original position in Absolute mode', () => {
        diagramElement.setOffsetWithRespectToBounds(
            25,
            40,
            'Absolute' as any
        );

        const result: any =
            diagramElement.getAbsolutePosition(
                new Size(200, 100)
            );

        expect(result).toBe(
            diagramElement.position
        );

        expect(result).toEqual({
            x: 25,
            y: 40
        });
    });

    it('calculates a relative absolute position', () => {
        diagramElement.setOffsetWithRespectToBounds(
            0.25,
            0.4,
            'Fraction' as any
        );

        const result: any =
            diagramElement.getAbsolutePosition(
                new Size(200, 100)
            );

        expect(result).toEqual({
            x: 50,
            y: 40
        });
    });

    it('checks the outerBounds getter, setter and descriptor', () => {
        const normalBounds: Rect =
            new Rect(10, 20, 100, 50);

        const floatingBounds: Rect =
            new Rect(30, 40, 120, 70);

        diagramElement.bounds = normalBounds;
        (diagramElement as any).floatingBounds = undefined;

        expect(diagramElement.outerBounds).toBe(
            normalBounds
        );

        diagramElement.outerBounds =
            floatingBounds;

        expect((diagramElement as any).floatingBounds).toBe(
            floatingBounds
        );

        expect(diagramElement.outerBounds).toBe(
            floatingBounds
        );

        (diagramElement as any).floatingBounds =
            null;

        expect(diagramElement.outerBounds).toBe(
            normalBounds
        );

        const descriptor: PropertyDescriptor =
            Object.getOwnPropertyDescriptor(
                DiagramElement.prototype,
                'outerBounds'
            );

        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBe(true);
        expect(descriptor.configurable).toBe(true);
        expect(typeof descriptor.get).toBe(
            'function'
        );
        expect(typeof descriptor.set).toBe(
            'function'
        );
    });

    it('measures explicit Diagram dimensions without subtracting margins', () => {
        const availableSize: Size =
            new Size(400, 300);

        const validateSpy: jasmine.Spy = spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.width = 125;
        diagramElement.height = 75;

        diagramElement.margin.left = 11;
        diagramElement.margin.right = 7;
        diagramElement.margin.top = 13;
        diagramElement.margin.bottom = 5;

        diagramElement.isCalculateDesiredSize =
            true;

        const result: Size = baseMeasure(
            diagramElement,
            availableSize
        );

        expect(result).toEqual(
            new Size(125, 75)
        );

        expect(validateSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                width: 125,
                height: 75
            }),
            availableSize
        );
    });

    it('measures available Diagram size after subtracting margins', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.margin.left = 11;
        diagramElement.margin.right = 7;
        diagramElement.margin.top = 13;
        diagramElement.margin.bottom = 5;

        const result: Size = baseMeasure(
            diagramElement,
            new Size(400, 300)
        );

        /*
         * Width: 400 - 11 - 7 = 382.
         * Height: 300 - 13 - 5 = 282.
         */
        expect(result).toEqual(
            new Size(382, 282)
        );
    });

    it('uses zero when available width and height are zero', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.margin.left = 0;
        diagramElement.margin.right = 0;
        diagramElement.margin.top = 0;
        diagramElement.margin.bottom = 0;

        const result: Size = baseMeasure(
            diagramElement,
            new Size(0, 0)
        );

        expect(result).toEqual(
            new Size(0, 0)
        );
    });

    it('uses zero when available width and height are undefined', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.margin.left = 0;
        diagramElement.margin.right = 0;
        diagramElement.margin.top = 0;
        diagramElement.margin.bottom = 0;

        const availableSize: Size = {
            width: undefined,
            height: undefined
        } as Size;

        const result: Size = baseMeasure(
            diagramElement,
            availableSize
        );

        expect(result).toEqual(
            new Size(0, 0)
        );
    });

    it('uses actual height for a horizontal lane header with zero height', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.id =
            'horizontalLaneHeader';

        diagramElement.width = 100;
        diagramElement.height = 0;

        diagramElement.actualSize =
            new Size(100, 45);

        diagramElement.elementActions =
            ElementAction.HorizontalLaneHeader;

        const result: Size = baseMeasure(
            diagramElement,
            new Size(300, 200)
        );

        expect(result).toEqual(
            new Size(100, 45)
        );
    });

    it('does not use lane actual height when the element has no id', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.id = '';
        diagramElement.width = 100;
        diagramElement.height = 0;

        diagramElement.actualSize =
            new Size(100, 45);

        diagramElement.elementActions =
            ElementAction.HorizontalLaneHeader;

        const result: Size = baseMeasure(
            diagramElement,
            new Size(300, 200)
        );

        expect(result).toEqual(
            new Size(100, 0)
        );
    });

    it('does not use actual height for a non-lane Diagram element', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.id = 'normalElement';
        diagramElement.width = 100;
        diagramElement.height = 0;

        diagramElement.actualSize =
            new Size(100, 45);

        diagramElement.elementActions =
            ElementAction.None;

        const result: Size = baseMeasure(
            diagramElement,
            new Size(300, 200)
        );

        expect(result).toEqual(
            new Size(100, 0)
        );
    });

    it('does not use actual height when lane height is nonzero', () => {
        spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.callFake((
            desiredSize: Size
        ): Size => {
            return desiredSize;
        });

        diagramElement.id =
            'horizontalLaneHeader';

        diagramElement.width = 100;
        diagramElement.height = 20;

        diagramElement.actualSize =
            new Size(100, 45);

        diagramElement.elementActions =
            ElementAction.HorizontalLaneHeader;

        const result: Size = baseMeasure(
            diagramElement,
            new Size(300, 200)
        );

        expect(result).toEqual(
            new Size(100, 20)
        );
    });

    it('validates measured size only when calculation is enabled', () => {
        const validateSpy: jasmine.Spy = spyOn(
            diagramElement as any,
            'validateDesiredSize'
        ).and.returnValue(
            new Size(60, 40)
        );

        diagramElement.width = 100;
        diagramElement.height = 50;

        diagramElement.isCalculateDesiredSize =
            true;

        let result: Size = baseMeasure(
            diagramElement,
            new Size(300, 200)
        );

        expect(validateSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(
            new Size(60, 40)
        );

        validateSpy.calls.reset();

        diagramElement.isCalculateDesiredSize =
            false;

        result = baseMeasure(
            diagramElement,
            new Size(300, 200)
        );

        expect(validateSpy).not.toHaveBeenCalled();

        expect(result).toEqual(
            new Size(100, 50)
        );
    });

    it('uses 50 by 50 for an unconstrained rectangular Diagram element', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(10, 20),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(50, 50)
        );
    });

    it('does not use rectangular defaults for a non-rectangular Diagram element', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(10, 20),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(10, 20)
        );
    });

    it('does not use rectangular width default when explicit width exists', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = 80;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.maxWidth = undefined;

        diagramElement.minHeight = 1;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(20, 30),
                new Size(400, 300)
            );

        expect(result.width).toBe(20);
    });

    it('does not use rectangular width default when minWidth exists', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = 35;
        diagramElement.maxWidth = undefined;

        diagramElement.minHeight = 1;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(20, 30),
                new Size(400, 300)
            );

        expect(result.width).toBe(35);
    });

    it('does not use rectangular width default when maxWidth exists', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.maxWidth = 40;

        diagramElement.minHeight = 1;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(20, 30),
                new Size(400, 300)
            );

        expect(result.width).toBe(20);
    });

    it('does not use rectangular height default when explicit height exists', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = undefined;
        diagramElement.height = 60;

        diagramElement.minWidth = 1;
        diagramElement.maxWidth = undefined;

        diagramElement.minHeight = undefined;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(20, 30),
                new Size(400, 300)
            );

        expect(result.height).toBe(30);
    });

    it('does not use rectangular height default when minHeight exists', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = 1;
        diagramElement.maxWidth = undefined;

        diagramElement.minHeight = 45;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(20, 30),
                new Size(400, 300)
            );

        expect(result.height).toBe(45);
    });

    it('does not use rectangular height default when maxHeight exists', () => {
        diagramElement.isRectElement = true;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = 1;
        diagramElement.maxWidth = undefined;

        diagramElement.minHeight = undefined;
        diagramElement.maxHeight = 40;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(20, 30),
                new Size(400, 300)
            );

        expect(result.height).toBe(30);
    });

    it('creates desired size from explicit dimensions when desiredSize is undefined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = 125;
        diagramElement.height = 75;

        diagramElement.margin.left = 11;
        diagramElement.margin.right = 7;
        diagramElement.margin.top = 13;
        diagramElement.margin.bottom = 5;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                undefined,
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(125, 75)
        );
    });

    it('creates desired size using available size when desiredSize is undefined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.margin.left = 11;
        diagramElement.margin.right = 7;
        diagramElement.margin.top = 13;
        diagramElement.margin.bottom = 5;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                undefined,
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(382, 282)
        );
    });

    it('uses zero fallback when desiredSize and available dimensions are undefined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.margin.left = 0;
        diagramElement.margin.right = 0;
        diagramElement.margin.top = 0;
        diagramElement.margin.bottom = 0;

        const availableSize: Size = {
            width: undefined,
            height: undefined
        } as Size;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                undefined,
                availableSize
            );

        expect(result).toEqual(
            new Size(0, 0)
        );
    });

    it('preserves supplied desired size when dimensions are not defined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.maxHeight = undefined;

        const desiredSize: Size =
            new Size(90, 55);

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                desiredSize,
                new Size(400, 300)
            );

        expect(result).toBe(desiredSize);

        expect(result).toEqual(
            new Size(90, 55)
        );
    });

    it('replaces supplied desired size when both dimensions are defined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = 125;
        diagramElement.height = 75;

        const desiredSize: Size =
            new Size(17, 19);

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                desiredSize,
                new Size(400, 300)
            );

        expect(result).toBe(desiredSize);

        expect(result).toEqual(
            new Size(125, 75)
        );
    });

    it('does not replace supplied desired size when only width is defined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = 125;
        diagramElement.height = undefined;

        const desiredSize: Size =
            new Size(17, 19);

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                desiredSize,
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(17, 19)
        );
    });

    it('does not replace supplied desired size when only height is defined', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = 75;

        const desiredSize: Size =
            new Size(17, 19);

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                desiredSize,
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(17, 19)
        );
    });

    it('applies minimum width independently', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = 120;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.maxHeight = undefined;

        let result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(80, 60),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(120, 60)
        );

        result = baseValidateDesiredSize(
            diagramElement,
            new Size(150, 60),
            new Size(400, 300)
        );

        expect(result).toEqual(
            new Size(150, 60)
        );
    });

    it('applies minimum height independently', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = 90;
        diagramElement.maxWidth = undefined;
        diagramElement.maxHeight = undefined;

        let result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(80, 40),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(80, 90)
        );

        result = baseValidateDesiredSize(
            diagramElement,
            new Size(80, 110),
            new Size(400, 300)
        );

        expect(result).toEqual(
            new Size(80, 110)
        );
    });

    it('applies nonzero maximum width independently', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = 120;
        diagramElement.maxHeight = undefined;

        let result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(180, 60),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(120, 60)
        );

        result = baseValidateDesiredSize(
            diagramElement,
            new Size(90, 60),
            new Size(400, 300)
        );

        expect(result).toEqual(
            new Size(90, 60)
        );
    });

    it('ignores zero maximum width', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = 0;
        diagramElement.maxHeight = undefined;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(180, 60),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(180, 60)
        );
    });

    it('applies nonzero maximum height independently', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.maxHeight = 90;

        let result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(80, 140),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(80, 90)
        );

        result = baseValidateDesiredSize(
            diagramElement,
            new Size(80, 70),
            new Size(400, 300)
        );

        expect(result).toEqual(
            new Size(80, 70)
        );
    });

    it('ignores zero maximum height', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = undefined;
        diagramElement.minHeight = undefined;
        diagramElement.maxWidth = undefined;
        diagramElement.maxHeight = 0;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(80, 140),
                new Size(400, 300)
            );

        expect(result).toEqual(
            new Size(80, 140)
        );
    });

    it('applies all minimum and maximum dimensions', () => {
        diagramElement.isRectElement = false;

        diagramElement.width = undefined;
        diagramElement.height = undefined;

        diagramElement.minWidth = 100;
        diagramElement.minHeight = 80;
        diagramElement.maxWidth = 160;
        diagramElement.maxHeight = 120;

        const result: Size =
            baseValidateDesiredSize(
                diagramElement,
                new Size(70, 150),
                new Size(400, 300)
            );

        /*
         * Width is raised to minimum width.
         * Height is lowered to maximum height.
         */
        expect(result).toEqual(
            new Size(100, 120)
        );
    });

    it('arranges the Diagram-created element and updates bounds', () => {
        diagramElement.offsetX = 250;
        diagramElement.offsetY = 180;

        diagramElement.pivot = {
            x: 0.5,
            y: 0.5
        };

        const desiredSize: Size =
            new Size(120, 80);

        const result: Size =
            DiagramElement.prototype.arrange.call(
                diagramElement,
                desiredSize
            );

        expect(result).toBe(desiredSize);

        expect(diagramElement.actualSize).toBe(
            desiredSize
        );

        expect(diagramElement.bounds.x).toBe(190);
        expect(diagramElement.bounds.y).toBe(140);
        expect(diagramElement.bounds.width).toBe(120);
        expect(diagramElement.bounds.height).toBe(80);
    });

    it('updates DiagramElement bounds using updateBounds', () => {
        diagramElement.offsetX = 300;
        diagramElement.offsetY = 200;

        diagramElement.actualSize =
            new Size(140, 100);

        diagramElement.pivot = {
            x: 0.25,
            y: 0.75
        };

        DiagramElement.prototype.updateBounds.call(
            diagramElement
        );

        /*
         * x = 300 - 140 * 0.25 = 265.
         * y = 200 - 100 * 0.75 = 125.
         */
        expect(diagramElement.bounds.x).toBe(265);
        expect(diagramElement.bounds.y).toBe(125);
        expect(diagramElement.bounds.width).toBe(140);
        expect(diagramElement.bounds.height).toBe(100);
    });

    it('updates the Diagram node wrapper after data binding', () => {
        const node: any = diagram.nodes[0];

        node.width = 150;
        node.height = 90;
        node.offsetX = 300;
        node.offsetY = 220;

        diagram.dataBind();

        diagramElement = node.wrapper as DiagramElement;

        expect(diagramElement.actualSize.width).toBe(
            120
        );

        expect(diagramElement.actualSize.height).toBe(
            80
        );

        expect(diagramElement.offsetX).toBe(300);
        expect(diagramElement.offsetY).toBe(220);

        /*
         * Restore the Diagram model for cleanup.
         */
        node.width = 120;
        node.height = 80;
        node.offsetX = 250;
        node.offsetY = 180;

        diagram.dataBind();

        diagramElement =
            node.wrapper as DiagramElement;
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