/**
 * Import section
 */
import { SvgRenderer } from '../src/svg-renderer';
import {
    LineAttributes, PathAttributes, CircleAttributes, EllipseAttributes, PolylineAttributes,
    BaseAttibutes, TextAttributes, ImageAttributes, SVGCanvasAttributes, PatternAttributes,
    LinearGradient, RadialGradient, RectAttributes, GradientColor
} from '../src/svg-canvas-interface';

function checkAttributes(element: Element, options: { [key: string]: string }): boolean {
    let result: boolean;
    let i: number;
    let keys: string[] = Object.keys(options);
    let values: string[] = Object.keys(options).map((key: string) => { return options[key]; });
    for (i = 0; i < keys.length; i++) {
        result = true;
        if (values[i].toString() !== element.getAttribute(keys[i])) {
            result = false;
            break;
        }
    }
    return result;
}

describe('SVG element', () => {
    it('SVG attributes test by passing args', () => {
        let options: BaseAttibutes = {
            'width': 200,
            'height': 200
        };
        let render: SvgRenderer = new SvgRenderer('');
        render.height = 500;
        render.width = 500;
        let element: Element = render.createSvg(options);
        expect(element.attributes[0].value).toEqual('500');
        expect(element.attributes[1].value).toEqual('500');
    });

    it('SVG attributes test without passing args', function (): void {
        let root: HTMLDivElement = document.createElement('div');
        root.setAttribute('id', 'container');
        document.body.appendChild(root);
        let render: SvgRenderer = new SvgRenderer('container');
        let svg: any = document.createElementNS(this.svgLink, 'svg');
        svg.setAttribute('id', 'container_svg');
        root.appendChild(svg);
        let element: Element = render.createSvg({});
        expect(element.attributes[2].value).toEqual('450');
        root.parentNode.removeChild(root);
    });
});

describe('SVG Rendering', () => {
    beforeEach(function (): void {
        this.render = new SvgRenderer('');
        this.SVGEle = this.render.createSvg({ id: 'container_svg', width: 600, height: 100 });
        document.body.appendChild(this.SVGEle);
    });

    describe('Circle', () => {
        it('Create circle element test', function (): void {
            let options: CircleAttributes = {
                'id': 'container_circle',
                'cx': 10,
                'cy': 10,
                'r': 50,
                'fill': 'blue',
                'stroke': '#2988d6',
                'stroke-width': 2
            };
            let element: Element = this.render.drawCircle(options);
            this.SVGEle.appendChild(element);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });

        it('Update circle element attributes test', function (): void {
            let options: CircleAttributes = {
                'id': 'container_circle',
                'cx': 20,
                'cy': 20,
                'r': 40,
                'fill': 'red',
                'stroke': '#2988d6',
                'stroke-width': 1
            };
            let element: Element = this.render.drawCircle(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Rectangle', () => {
        it('Create rectangle element test', function (): void {
            let options: RectAttributes = {
                'id': 'container_rect',
                'x': 20,
                'y': 20,
                'width': 50,
                'height': 50,
                'fill': 'red',
                'stroke': 'black',
                'stroke-width': 2
            };
            let element: Element = this.render.drawRectangle(options);
            this.SVGEle.appendChild(element);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });

        it('Update rectangle element attributes test', function (): void {
            let options: RectAttributes = {
                'id': 'container_rect',
                'x': 10,
                'y': 10,
                'width': 100,
                'height': 70,
                'fill': 'green',
                'stroke': 'black',
                'stroke-width': 1
            };
            let element: Element = this.render.drawRectangle(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Line', () => {
        it('Create Line element test', function (): void {
            let options: LineAttributes = {
                'id': 'container_line',
                'x1': 10,
                'y1': 10,
                'x2': 100,
                'y2': 100,
                'fill': 'red',
                'stroke-width': 2,
                'stroke': 'blue'
            };
            let element: Element = this.render.drawLine(options);
            this.SVGEle.appendChild(element);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });

        it('Update line element attributes test', function (): void {
            let options: LineAttributes = {
                'id': 'container_line',
                'x1': 0,
                'y1': 0,
                'x2': 90,
                'y2': 110,
                'fill': 'blue',
                'stroke-width': 3,
                'stroke': 'blue'
            };
            let element: Element = this.render.drawLine(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Path', () => {
        it('Create Path element test', function (): void {
            let options: PathAttributes = {
                'id': 'container_path',
                'fill': 'green',
                'opacity': 0.5,
                'stroke': 'black',
                'stroke-width': 3,
                'd': 'M50 0 L75 100 L125 100 Z'
            };
            let element: Element = this.render.drawPath(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            this.SVGEle.appendChild(element);
            expect(result).toBe(true);
        });

        it('Update path element attributes test', function (): void {
            let options: PathAttributes = {
                'id': 'container_path',
                'fill': 'red',
                'opacity': 0.8,
                'stroke': 'red',
                'stroke-width': 1,
                'd': 'M55 0 L95 120 L105 50 Z'
            };
            let element: Element = this.render.drawPath(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Polyline', () => {
        it('Create polyline element test', function (): void {
            let options: PolylineAttributes = {
                'id': 'container_polyline',
                'fill': 'green',
                'stroke': 'red',
                'stroke-width': 2,
                'points': '20,20 40,25 60,40 80,120 120,140 200,180'
            };
            let element: Element = this.render.drawPolyline(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            this.SVGEle.appendChild(element);
            expect(result).toBe(true);
        });

        it('Update polyline element attributes test', function (): void {
            let options: PolylineAttributes = {
                'id': 'container_polyline',
                'fill': 'red',
                'stroke': 'green',
                'stroke-width': 3,
                'points': '10,10 30,55 40,50 60,100 100,120 190,190'
            };
            let element: Element = this.render.drawPolyline(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Ellipse', () => {
        it('Create ellipse element test', function (): void {
            let options: EllipseAttributes = {
                'id': 'container_ellipse',
                'cx': 200,
                'cy': 80,
                'rx': 100,
                'ry': 50,
                'fill': 'yellow',
                'stroke': 'white',
                'stroke-width': 2
            };
            let element: Element = this.render.drawEllipse(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            this.SVGEle.appendChild(element);
            expect(result).toBe(true);
        });

        it('Update ellipse attributes test', function (): void {
            let options: EllipseAttributes = {
                'id': 'container_ellipse',
                'cx': 100,
                'cy': 40,
                'rx': 200,
                'ry': 80,
                'fill': 'blue',
                'stroke': 'red',
                'stroke-width': 1
            };
            let element: Element = this.render.drawEllipse(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Polygon', () => {
        it('Create polygon element test', function (): void {
            let options: PolylineAttributes = {
                'id': 'container_polygon',
                'fill': 'green',
                'stroke': 'red',
                'stroke-width': 2,
                'points': '200,10 250,190 160,210'
            };
            let element: Element = this.render.drawPolygon(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            this.SVGEle.appendChild(element);
            expect(result).toBe(true);
        });

        it('Update polygon element attributes test', function (): void {
            let options: PolylineAttributes = {
                'id': 'container_polygon',
                'fill': 'red',
                'stroke': 'black',
                'stroke-width': 3,
                'points': '100,30 150,290 260,110'
            };
            let element: Element = this.render.drawPolygon(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            element.remove();
            expect(result).toBe(true);
        });
    });

    describe('Text', () => {
        it('Create text element test', function (): void {
            let options: TextAttributes = {
                'id': 'container_text',
                'x': 0,
                'y': 15,
                'fill': 'green'
            };
            let element: Element = this.render.createText(options, 'test case');
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
            expect(element.textContent).toEqual('test case');
        });

        it('Content of the text element test', function (): void {
            let options: TextAttributes = {
                'id': 'container_text',
                'x': 0,
                'y': 15,
                'fill': 'green'
            };
            let element: Element = this.render.createText(options, null);
            expect(element.textContent).toEqual('');
        });
    });

    describe('TSpan', () => {
        it('Create tspan element test', function (): void {
            let options: TextAttributes = {
                'id': 'container_tspan',
                'x': 0,
                'y': 25,
                'fill': 'red'
            };
            let element: Element = this.render.createTSpan(options, 'test case');
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
            expect(element.textContent).toEqual('test case');
        });

        it('Content of the tspan element test', function (): void {
            let options: TextAttributes = {
                'id': 'container_tspan',
                'x': 0,
                'y': 25,
                'fill': 'red'
            };
            let element: Element = this.render.createTSpan(options, null);
            expect(element.textContent).toEqual('');
        });
    });

    describe('Title', () => {
        it('Title element attributes test', function (): void {
            let element: Element = this.render.createTitle('Title text');
            expect(element.textContent).toEqual('Title text');
        });
    });

    describe('Defs', () => {
        it('Defs element attributes test', function (): void {
            let element: Element = this.render.createDefs();
            expect(element.tagName).toEqual('defs');
        });
    });

    describe('ClipPath', () => {
        it('ClipPath element attributes test', function (): void {
            let element: Element = this.render.createDefs();
            expect(element.tagName).toEqual('defs');
        });
    });

    describe('ForeignObject', () => {
        it('Foreign Object element attributes test', function (): void {
            let options: BaseAttibutes = {
                'x': 10,
                'y': 20,
                'width': 100,
                'height': 100
            };
            let element: Element = this.render.createForeignObject(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });
    });

    describe('Group', () => {
        it('Group element attributes test', function (): void {
            let options: BaseAttibutes = {
                'fill': 'white',
                'stroke': 'black',
                'stroke-width': 5
            };
            let element: Element = this.render.createGroup(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });
    });

    describe('Pattern', () => {
        it('Pattern element attributes test', function (): void {
            let options: PatternAttributes = {
                'patternUnits': 'userSpaceOnUse',
                'width': 8,
                'height': 8
            };
            let element: Element = this.render.createPattern(options, 'pattern');
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
            expect(element.tagName).toEqual('pattern');
        });
    });

    describe('Image', () => {
        it('Image element attributes test', function (): void {
            let options: ImageAttributes = {
                'height': 100,
                'width': 200,
                'href': '',
                'id': '',
                'clip-path': '',
                'x': 0,
                'y': 0,
                'visibility': 'visible',
                'preserveAspectRatio': 'none'
            };
            let element: Element = this.render.drawImage(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });

        it('Image element attributes test', function (): void {
            let options: ImageAttributes = {
                'height': 100,
                'width': 200,
                'href': '',
                'id': '',
                'x': 0,
                'y': 0,
                'visibility': 'visible'
            };
            let element: Element = this.render.drawImage(options);
            let result: boolean = checkAttributes(element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });
    });

    describe('Radial Gradient', () => {
        it('Radial gradient test by passing array of colors', function (): void {
            let color: GradientColor[] = [{ color: 'green', colorStop: '0%' }, { color: 'blue', colorStop: '100%' }];
            let options: RadialGradient = {
                'cx': '50',
                'cy': '50',
                'r': '50',
                'fx': '50',
                'fy': '50'
            };
            expect(this.render.createRadialGradient(color, 'new', options)).toEqual('url(#_newradialGradient)');
        });

        it('Radial gradient test by passing a color', function (): void {
            let color: GradientColor[] = [{ color: 'green' }];
            let options: RadialGradient = {
                'cx': '50',
                'cy': '50',
                'r': '50',
                'fx': '50',
                'fy': '50'
            };
            expect(this.render.createRadialGradient(color, 'new', options)).toEqual('green');
        });
    });

    describe('Linear Gradient', () => {
        it('Linear gradient test by passing array of colors', function (): void {
            let color: GradientColor[] = [{ color: 'green', colorStop: '0%' }, { color: 'blue', colorStop: '100%' }];
            let options: LinearGradient = {
                'x1': '0',
                'y1': '0',
                'x2': '100',
                'y2': '0'
            };
            expect(this.render.createLinearGradient(color, 'new', options)).toEqual('url(#_newlinearGradient)');
        });

        it('Linear gradient test by passing a color', function (): void {
            let color: GradientColor[] = [{ color: 'green' }];
            let options: LinearGradient = {
                'x1': '0',
                'y1': '0',
                'x2': '100',
                'y2': '0'
            };
            expect(this.render.createLinearGradient(color, 'new', options)).toEqual('green');
        });
    });

    describe('DrawClipPath', () => {
        it('DrawClipPath method test', function (): void {
            let options: BaseAttibutes = {
                'x': 10,
                'y': 10,
                'width': 100,
                'height': 100,
                'fill': 'white',
                'stroke-width': 1,
                'stroke': 'gray'
            };
            let element: Element = this.render.drawClipPath(options);
            let result: boolean = checkAttributes(element.childNodes[0].childNodes[0] as Element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });
    });

    describe('DrawCircularClipPath', () => {
        it('DrawCircularClipPath method test', function (): void {
            let options: CircleAttributes = {
                'cx': 10,
                'cy': 10,
                'r': 50,
                'fill': 'blue',
                'stroke': '#2988d6',
                'stroke-width': 2
            };
            let element: Element = this.render.drawCircularClipPath(options);
            let result: boolean = checkAttributes(element.childNodes[0].childNodes[0] as Element, options as SVGCanvasAttributes);
            expect(result).toBe(true);
        });
    });
});
