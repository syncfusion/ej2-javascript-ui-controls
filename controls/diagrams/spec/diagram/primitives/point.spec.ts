import { Point } from '../../../src/diagram/primitives/point';
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';

describe('Point', () => {
    it('compares points and identifies empty coordinates', () => {
        const point: { x: number, y: number } = { x: 2, y: 3 };
        const missing: any = undefined;

        expect(Point.equals(point, point)).toBe(true);
        expect(Point.equals(point, missing)).toBe(false);
        expect(Point.equals(missing, point)).toBe(false);
        expect(Point.equals(point, { x: 2, y: 3 })).toBe(true);
        expect(Point.equals(point, { x: 2, y: 4 })).toBe(false);
        expect(Point.equals(point, { x: 4, y: 3 })).toBe(false);
        expect(Point.isEmptyPoint({ x: 0, y: 0 })).toBe(true);
        expect(Point.isEmptyPoint({ x: 0, y: 3 })).toBe(true);
        expect(Point.isEmptyPoint({ x: 2, y: 0 })).toBe(true);
        expect(Point.isEmptyPoint(point)).toBe(false);
    });

    it('transforms points and calculates angles', () => {
        expect(Point.transform({ x: 1, y: 2 }, 0, 5)).toEqual({ x: 6, y: 2 });
        expect(Point.transform({ x: 1, y: 2 }, 90, 5)).toEqual({ x: 1, y: 7 });
        expect(Point.transform({ x: 1, y: 2 }, 45, Math.sqrt(2))).toEqual({ x: 2, y: 3 });
        expect(Point.findAngle({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(0);
        expect(Point.findAngle({ x: 0, y: 0 }, { x: 0, y: 1 })).toBe(90);
        expect(Point.findAngle({ x: 0, y: 0 }, { x: -1, y: 0 })).toBe(180);
        expect(Point.findAngle({ x: 0, y: 0 }, { x: 0, y: -1 })).toBe(270);
    });

    it('calculates distances and polyline length', () => {
        expect(Point.findLength({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
        expect(Point.findLength({ x: 2, y: 1 }, { x: 7, y: 4 })).toBeCloseTo(Math.sqrt(34), 10);
        expect(Point.distancePoints({ x: 3, y: 4 }, { x: 0, y: 0 })).toBe(5);
        expect(Point.distancePoints({ x: 2, y: 1 }, { x: 7, y: 4 })).toBeCloseTo(Math.sqrt(34), 10);
        expect(Point.getLengthFromListOfPoints([])).toBe(0);
        expect(Point.getLengthFromListOfPoints([{ x: 1, y: 1 }])).toBe(0);
        expect(Point.getLengthFromListOfPoints([{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 6, y: 4 }])).toBe(8);
    });

    it('adjusts vertical, horizontal, and diagonal points', () => {
        expect(Point.adjustPoint({ x: 0, y: 0 }, { x: 0, y: 10 }, true, 2)).toEqual({ x: 0, y: 2 });
        expect(Point.adjustPoint({ x: 0, y: 0 }, { x: 0, y: 10 }, false, 2)).toEqual({ x: 0, y: 8 });
        expect(Point.adjustPoint({ x: 0, y: 10 }, { x: 0, y: 0 }, true, 2)).toEqual({ x: 0, y: 8 });
        expect(Point.adjustPoint({ x: 0, y: 10 }, { x: 0, y: 0 }, false, 2)).toEqual({ x: 0, y: 2 });
        expect(Point.adjustPoint({ x: 0, y: 0 }, { x: 10, y: 0 }, true, 2)).toEqual({ x: 2, y: 0 });
        expect(Point.adjustPoint({ x: 0, y: 0 }, { x: 10, y: 0 }, false, 2)).toEqual({ x: 8, y: 0 });
        expect(Point.adjustPoint({ x: 0, y: 0 }, { x: 3, y: 4 }, true, 5)).toEqual({ x: 3, y: 4 });
            const adjustedEnd = Point.adjustPoint({ x: 0, y: 0 }, { x: 3, y: 4 }, false, 5);
            expect(adjustedEnd.x!).toBeCloseTo(0, 10);
            expect(adjustedEnd.y!).toBeCloseTo(0, 10);
            expect(Point.adjustPoint({ x: 5, y: 5 }, { x: 5, y: 5 }, true, 2)).toEqual({ x: 5, y: 3 });
            expect(Point.adjustPoint({ x: 5, y: 5 }, { x: 5, y: 5 }, false, 2)).toEqual({ x: 5, y: 3 });
    });

    it('returns cardinal direction and resolves equal deltas vertically', () => {
        expect(Point.direction({ x: 0, y: 0 }, { x: 5, y: 1 })).toBe('Right');
        expect(Point.direction({ x: 5, y: 0 }, { x: 0, y: 1 })).toBe('Left');
        expect(Point.direction({ x: 0, y: 0 }, { x: 1, y: 5 })).toBe('Bottom');
        expect(Point.direction({ x: 0, y: 5 }, { x: 1, y: 0 })).toBe('Top');
        expect(Point.direction({ x: 0, y: 0 }, { x: 3, y: 3 })).toBe('Bottom');
        expect(Point.direction({ x: 0, y: 0 }, { x: -3, y: 3 })).toBe('Bottom');
        expect(Point.direction({ x: 0, y: 0 }, { x: 3, y: -3 })).toBe('Top');
    });

    it('provides the Point class name and default properties', () => {
        const point: Point = Object.create(Point.prototype) as Point;
        expect(point.getClassName()).toBe('Point');
    });

    it('calculates connector geometry in a real Diagram', () => {
        const host: HTMLElement = createElement('div', { id: 'point-diagram' });
        document.body.appendChild(host);
        const diagram: Diagram = new Diagram({
            width: 600,
            height: 400,
            connectors: [
                { id: 'horizontal', type: 'Straight', sourcePoint: { x: 50, y: 100 }, targetPoint: { x: 250, y: 100 } },
                { id: 'vertical', type: 'Straight', sourcePoint: { x: 100, y: 50 }, targetPoint: { x: 100, y: 250 } },
                { id: 'diagonal', type: 'Straight', sourcePoint: { x: 50, y: 50 }, targetPoint: { x: 250, y: 250 } }
            ]
        });

        diagram.appendTo(host);

        expect(diagram.connectors.length).toBe(3);
        const connectors: any[] = diagram.connectors as any[];
        expect(connectors[0].sourcePoint.x).toBe(50);
        expect(connectors[0].sourcePoint.y).toBe(100);
        expect(connectors[0].targetPoint.x).toBe(250);
        expect(connectors[0].targetPoint.y).toBe(100);
        expect(connectors[1].sourcePoint.x).toBe(100);
        expect(connectors[1].sourcePoint.y).toBe(50);
        expect(connectors[1].targetPoint.x).toBe(100);
        expect(connectors[1].targetPoint.y).toBe(250);
        expect(connectors[2].sourcePoint.x).toBe(50);
        expect(connectors[2].sourcePoint.y).toBe(50);
        expect(connectors[2].targetPoint.x).toBe(250);
        expect(connectors[2].targetPoint.y).toBe(250);
        expect(connectors[0].segments.length).toBeGreaterThan(0);
        expect(connectors[1].segments.length).toBeGreaterThan(0);
        expect(connectors[2].segments.length).toBeGreaterThan(0);

        diagram.destroy();
        host.remove();
    });
});
