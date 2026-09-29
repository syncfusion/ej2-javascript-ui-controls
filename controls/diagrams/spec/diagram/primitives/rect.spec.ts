import { Rect } from '../../../src/diagram/primitives/rect';

describe('Rect', () => {
    it('initializes defaults and calculates all accessors', () => {
        const empty: Rect = new Rect();
        const partial: Rect = new Rect(10, 20);
        const rect: Rect = new Rect(10, 20, 30, 40);

        expect(empty.x).toBe(Number.MAX_VALUE);
        expect(empty.y).toBe(Number.MAX_VALUE);
        expect(empty.width).toBe(0);
        expect(empty.height).toBe(0);
        expect(new Rect(undefined, 20, 30, 40).width).toBe(0);
        expect(partial.width).toBe(0);
        expect(partial.height).toBe(0);
        expect(rect.left).toBe(10);
        expect(rect.right).toBe(40);
        expect(rect.top).toBe(20);
        expect(rect.bottom).toBe(60);
        expect(rect.topLeft).toEqual({ x: 10, y: 20 });
        expect(rect.topRight).toEqual({ x: 40, y: 20 });
        expect(rect.bottomLeft).toEqual({ x: 10, y: 60 });
        expect(rect.bottomRight).toEqual({ x: 40, y: 60 });
        expect(rect.middleLeft).toEqual({ x: 10, y: 40 });
        expect(rect.middleRight).toEqual({ x: 40, y: 40 });
        expect(rect.topCenter).toEqual({ x: 25, y: 20 });
        expect(rect.bottomCenter).toEqual({ x: 25, y: 60 });
        expect(rect.center).toEqual({ x: 25, y: 40 });
    });

    it('compares rectangles and unites rectangles and points', () => {
        const base: Rect = new Rect(10, 20, 30, 40);
        expect(base.equals(base, new Rect(10, 20, 30, 40))).toBe(true);
        expect(base.equals(base, new Rect(11, 20, 30, 40))).toBe(false);
        expect(base.equals(base, new Rect(10, 21, 30, 40))).toBe(false);
        expect(base.equals(base, new Rect(10, 20, 31, 40))).toBe(false);
        expect(base.equals(base, new Rect(10, 20, 30, 41))).toBe(false);

        const united: Rect = new Rect(10, 20, 30, 40).uniteRect(new Rect(-5, 0, 50, 80));
        expect(united).toEqual(new Rect(-5, 0, 50, 80));
        expect(new Rect().uniteRect(new Rect(10, 20, 30, 40))).toEqual(new Rect(10, 20, 30, 40));

        const fromEmpty: Rect = new Rect();
        expect(fromEmpty.unitePoint({ x: 5, y: 7 })).toBeUndefined();
        expect(fromEmpty).toEqual(new Rect(5, 7, 0, 0));
        const pointBounds: Rect = new Rect(5, 7, 0, 0);
        pointBounds.unitePoint({ x: -3, y: 20 });
        expect(pointBounds).toEqual(new Rect(-3, 7, 8, 13));
    });

    it('inflates by moving the origin and expanding both dimensions', () => {
        const rect: Rect = new Rect(10, 20, 30, 40);
        const result: Rect = rect.Inflate(5);

        expect(result).toBe(rect);
        expect(rect).toEqual(new Rect(5, 15, 40, 50));
        rect.Inflate(-2);
        expect(rect).toEqual(new Rect(7, 17, 36, 46));
    });

    it('distinguishes touching, disjoint, and overlapping rectangles', () => {
        const rect: Rect = new Rect(0, 0, 10, 10);

        expect(rect.intersects(new Rect(10, 0, 5, 5))).toBe(true);
        expect(rect.intersects(new Rect(11, 0, 5, 5))).toBe(false);
        expect(rect.intersects(new Rect(-5, 0, 5, 5))).toBe(true);
        expect(rect.intersects(new Rect(0, 10, 5, 5))).toBe(true);
        expect(rect.intersects(new Rect(0, 11, 5, 5))).toBe(false);
        expect(rect.intersects(new Rect(0, -5, 5, 5))).toBe(true);
        expect(rect.intersects(new Rect(2, 2, 3, 3))).toBe(true);

        expect(rect.containsRect(new Rect(0, 0, 10, 10))).toBe(true);
        expect(rect.containsRect(new Rect(1, 1, 8, 8))).toBe(true);
        expect(rect.containsRect(new Rect(-1, 1, 8, 8))).toBe(false);
        expect(rect.containsRect(new Rect(1, -1, 8, 8))).toBe(false);
        expect(rect.containsRect(new Rect(1, 1, 10, 8))).toBe(false);
        expect(rect.containsRect(new Rect(1, 1, 8, 10))).toBe(false);
    });

    it('checks point containment on every edge with padding', () => {
        const rect: Rect = new Rect(10, 20, 30, 40);

        expect(rect.containsPoint({ x: 10, y: 20 })).toBe(true);
        expect(rect.containsPoint({ x: 40, y: 60 })).toBe(true);
        expect(rect.containsPoint({ x: 9, y: 30 })).toBe(false);
        expect(rect.containsPoint({ x: 41, y: 30 })).toBe(false);
        expect(rect.containsPoint({ x: 20, y: 19 })).toBe(false);
        expect(rect.containsPoint({ x: 20, y: 61 })).toBe(false);
        expect(rect.containsPoint({ x: 9, y: 19 }, 1)).toBe(true);
        expect(rect.containsPoint({ x: 41, y: 61 }, 1)).toBe(true);
        expect(rect.containsPoint({ x: 8, y: 30 }, 1)).toBe(false);
    });

    it('builds bounds from empty, single, and multiple points', () => {
        const empty: Rect = Rect.toBounds([]);
        expect(empty.x).toBe(Number.MAX_VALUE);
        expect(empty.y).toBe(Number.MAX_VALUE);
        expect(empty.width).toBe(0);
        expect(empty.height).toBe(0);
        expect(Rect.toBounds([{ x: 4, y: 6 }])).toEqual(new Rect(4, 6, 0, 0));
        expect(Rect.toBounds([{ x: 4, y: 6 }, { x: -2, y: 12 }, { x: 10, y: 1 }]))
            .toEqual(new Rect(-2, 1, 12, 11));
    });
});