import { createElement } from '@syncfusion/ej2-base';
import { DrawingElement } from '../src/drawing/core/elements/drawing-element';
import { Container } from '../src/drawing/core/containers/container'
import { refreshDiagramElements } from '../src/drawing/rendering/canvas-renderer';
import { DrawingRenderer } from '../src/drawing/rendering/renderer';
import { createMeasureElements, getAdornerLayerSvg, getSelectorElement, translatePoints } from '../src/drawing/utility/dom-util';
import { ImageElement } from '../src/drawing/core/elements/image-element';
import { PathElement } from '../src/drawing/core/elements/path-element';
import { TextElement } from '../src/drawing/core/elements/text-element';
import { Size } from '../src/drawing/primitives/size';
import { RadialGradientModel, LinearGradientModel, StopModel } from '../src/drawing/core/appearance-model';
import { Rect } from '../src/drawing/primitives/rect';
import { randomId, wordBreakToString, whiteSpaceToString, middleElement } from '../src/drawing/utility/base-util';
import { Canvas } from '../src/drawing/core/containers/canvas';

describe('Diagram Control', () => {
    let renderer = new DrawingRenderer('diagram', false);

    describe(' text wrapper Simple', () => {
        let ele: HTMLElement; let diagram: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);
            ele = document.getElementById('CursorLayer');
            createMeasureElements();

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with Wrapping and align - center';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.relativeMode = 'Object';
            element1.horizontalAlignment = 'Left';
            element1.verticalAlignment = 'Bottom'
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 60;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';   element1.horizontalAlignment = 'Auto';
            element1.verticalAlignment = 'Auto'
            let element11: TextElement = new TextElement();
            element11.content = 'Text element with Wrapping and align - center';
            element11.style.color = 'red';
            element11.style.italic = true;
            element11.style.fontSize = 12;
            element11.offsetX = 400;
            element11.offsetY = 100;
            element11.canMeasure=false;

            let element2: PathElement = new PathElement();
            element2.offsetX = 400;
            element2.offsetY = 300;
            element2.style.fill = 'transparent';
            element2.width = 100;
            element2.float= true;
            element2.height = 60;
            element2.relativeMode = 'Object';
            element2.horizontalAlignment = 'Stretch';
            element2.verticalAlignment = 'Stretch'

            let element3: PathElement = new PathElement();
            element3.offsetX = 400;
            element3.offsetY = 300;
            element3.style.fill = 'transparent';
            element3.width = 100;
            element3.float= true;
            element3.height = 60;
            element3.relativeMode = 'Object';
            element3.horizontalAlignment = 'Left';
            element3.verticalAlignment = 'Top'

            let element31: PathElement = new PathElement();
            element31.offsetX = 400;
            element31.offsetY = 300;
            element31.style.fill = 'transparent';
            element31.width = 100;
            element31.float= true;
            element31.height = 60;
            element31.relativeMode = 'Object';
            element31.horizontalAlignment = 'Right';
            element31.verticalAlignment = 'Bottom'

            let element5: PathElement = new PathElement();
            element5.offsetX = 400;
            element5.offsetY = 300;
            element5.style.fill = 'transparent';
            element5.width = 100;
            element5.float= true;
            element5.height = 60;
            element5.horizontalAlignment = 'Right';
            element5.verticalAlignment = 'Bottom'
            let element6: PathElement = new PathElement();
            element6.offsetX = 400;
            element6.offsetY = 300;
            element6.style.fill = 'transparent';
            element6.width = 100;
            element6.rotateAngle =50;
            element6.float= true;
            element6.height = 60;
            element6.horizontalAlignment = 'Left';
            element6.verticalAlignment = 'Center'
            let element7: PathElement = new PathElement();
            element7.offsetX = 400;
            element7.offsetY = 300;
            element7.style.fill = 'transparent';
            element7.width = 100;
            element7.rotateAngle =50;
            element7.float= true;
            element7.height = 60;
            element7.horizontalAlignment = 'Center';
            element7.verticalAlignment = 'Top'
            let element8: PathElement = new PathElement();
            element8.offsetX = 400;
            element8.offsetY = 300;
            element8.style.fill = 'transparent';
            element8.width = 100;
            element8.rotateAngle =50;
            element8.float= true;
            element8.height = 60;
            element8.horizontalAlignment = 'Stretch';
            element8.verticalAlignment = 'Stretch';

            let element9: PathElement = new PathElement();
            element9.offsetX = 400;
            element9.offsetY = 300;
            element9.style.fill = 'transparent';
            element9.width = 100;
            element9.rotateAngle =50;
            element9.float= true;
            element9.height = 60;
            element9.horizontalAlignment = 'Auto';
            element9.verticalAlignment = 'Auto'
            let container1: Canvas = new Canvas();
            container1.id='ggee';
            container1.pivot = { x: 0, y: 0 };
            container1.offsetX = 200;
            container1.offsetY = 100;
            container1.width = 500;
            container1.children = [element1, element2, element3,element31,element5,element6,element7,element8,element9,element11]
            container1.height = 500;
            container1.rotateAngle = 0;
            container1.style = { fill: 'red' };
            container1.measure(new Size());
            container1.arrange(container1.desiredSize);

           refreshDiagramElements(canvas as HTMLCanvasElement, [container1], renderer);

           let container11 = new Canvas();
           container11.pivot = { x: 0, y: 0 };
           container11.offsetX = 200;
           container11.offsetY = 100;
           container11.width = 500;
           container11.height = 500;
           container11.rotateAngle = 0;
           container11.style = { fill: 'red' };
           container11.measure(new Size());
           container11.arrange(container1.desiredSize);
           refreshDiagramElements(canvas, [container11], renderer);
        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            done();
        });
    });

    describe('Simple canvas panel with children', () => {
        let ele: HTMLElement; let diagram: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);

            ele = document.getElementById('CursorLayer');
            createMeasureElements();
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 500;
            elementimg.height = 500;
            elementimg.offsetX = 200;
            elementimg.imageScale = 'Slice';

            elementimg.imageAlign = 'XMaxYMid'
            elementimg.offsetY = 200;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Stretch';

            let pathele = new PathElement();
            pathele.width = 50;
            pathele.height = 50;
            pathele.offsetX = 100;
            pathele.offsetY = 100;
            pathele.style.strokeWidth = 1;
            pathele.data = 'm10 80 q 52.5 10, 95 80 t 180 80 ';

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with width/100 height/100';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 100;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';

            let elementimg1: ImageElement = new ImageElement();
            elementimg1.width = 280;
            elementimg1.height = 200;
            elementimg1.imageAlign = 'XMaxYMin';
            elementimg1.offsetX = 200;
            elementimg1.offsetY = 150;
            elementimg1.stretch = 'Meet';
            elementimg1.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            let elementimg2: ImageElement = new ImageElement();
            elementimg2.width = 2800;
            elementimg2.height = 2000;
            elementimg2.offsetX = 200;
            elementimg2.imageScale = 'Meet'
            elementimg2.imageAlign = 'XMidYMax';
            elementimg2.offsetY = 150;
            elementimg2.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg2.stretch = 'Slice';

            let elementimg3: ImageElement = new ImageElement();
            elementimg3.width = 280;
            elementimg3.height = 200;
            elementimg3.offsetX = 200;
            elementimg3.imageAlign = 'XMidYMid';
            elementimg3.imageScale = 'Slice'
            elementimg3.offsetY = 150;
            elementimg3.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg3.stretch = 'None';

            let digram1 = new DrawingElement();
            digram1.width = 100;
            digram1.height = 200;
            digram1.offsetX = 433;
            digram1.cornerRadius = 2;

            let digram2 = new DrawingElement();
            digram1.cornerRadius = 2;

            let container: Container = new Container();
            container.pivot = { x: 0, y: 0 };
            container.offsetX = 200;
            container.offsetY = 100;
            container.width = 500;
            container.children = [pathele, elementimg, element1, elementimg1, digram2, elementimg2, elementimg3, digram1];
            container.height = 500;
            container.cornerRadius = 10;
            container.style = { fill: 'red' };
            container.measure(new Size);
            container.arrange(container.desiredSize);
            refreshDiagramElements(canvas as HTMLCanvasElement, [container], renderer);
        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            let rec = new Rect(1, 2);
            let rect = new Rect();
            // let result = rec.intersects(rect);
            // let final = rect.containsRect(rec);
            // let res = rect.containsPoint({})
            // Rect.e
            done();
        });
    });

    describe('Simple canvas panel with children', () => {
        let ele: HTMLElement; let diagram: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);

            ele = document.getElementById('CursorLayer');
            createMeasureElements();
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 50;
            elementimg.height = 50;
            elementimg.imageAlign = 'XMaxYMax'
            elementimg.offsetX = 200;
            elementimg.offsetY = 200;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Stretch';

            let pathele = new PathElement();
            pathele.maxHeight = 110;
            pathele.maxHeight = 110;
            pathele.offsetX = 100;
            pathele.cornerRadius = 5;
            pathele.rotateAngle = 45;
            let stopscol: StopModel[] = [];
            let stops11: StopModel = { color: 'white', offset: 0 };
            stopscol.push(stops11);
            let stops12: StopModel = { color: 'red', offset: 50 };
            stopscol.push(stops12);
            let gradient1: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
            pathele.style.gradient = gradient1;
            pathele.offsetY = 100;
            pathele.style.strokeWidth = 1;
            pathele.data = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';

            let pathele1 = new PathElement();
            pathele1.maxHeight = 110;
            pathele1.maxHeight = 110;
            pathele1.offsetX = 100;
            pathele1.rotateAngle = 45;
            let stopscol1: StopModel[] = [];
            let stops1: StopModel = { color: 'white', offset: 0 };
            stopscol1.push(stops1);
            let stops2: StopModel = { color: 'red', offset: 50 };
            stopscol1.push(stops2);
            let gradient11: LinearGradientModel = { x1: 0, x2: 50, y1: 0, y2: 50, stops: stopscol1, type: 'Linear' };
            pathele1.style.gradient = gradient11;
            pathele1.style.strokeDashArray = '1 1'
            pathele1.offsetY = 100;
            pathele1.style.fill = 'none';
            pathele1.style.strokeColor = 'none';
            pathele1.style.strokeWidth = 1;
            pathele1.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200' + 'M300,200 h-150 a150,150 0 1,1 150,-150 z';

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with width/100 height/100';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.rotateAngle = 60;
            element1.style.fill = 'transparent';
            element1.minHeight = 40;
            element1.minWidth = 40;
            element1.width = 70;
            element1.height = 70;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';

            let container: Container = new Container();
            container.pivot = { x: 0, y: 0 };
            container.offsetX = 200;
            container.offsetY = 100;
            container.width = 500;
            container.horizontalAlignment = 'Stretch';
            container.verticalAlignment = 'Stretch';
            container.height = 500;
            container.style = { fill: 'red' };
            container.measure(new Size);
            container.arrange(container.desiredSize);


            let container1: Container = new Container();
            container1.pivot = { x: 0, y: 0 };
            container1.offsetX = 200;
            container1.offsetY = 100;
            container1.width = 500;
            container1.children = [pathele1, elementimg, element1, container, pathele1];
            container1.height = 500;
            container1.rotateAngle = 90;
            container1.style = { fill: 'red' };
            container1.measure(new Size());
            container1.arrange(container1.desiredSize);

            refreshDiagramElements(canvas as HTMLCanvasElement, [container1], renderer);

        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            debugger;
            let id = randomId();
            wordBreakToString('LineThrough');
            whiteSpaceToString('CollapseAll', 'NoWrap');
            middleElement(1, 2);
            // overFlow('cjbrdsvbirefvd pdkofvkmdvf',{width:40,textOverflow:'Ellipsis'} as any)
            done();
        });
    });

    describe('Simple text property ', () => {
        let ele: HTMLElement; let diagram: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);

            ele = document.getElementById('CursorLayer');
            createMeasureElements();

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with width/100 height/100';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 100;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';

            let element2: TextElement = new TextElement();
            element2.content = 'Text element without width and height';
            element2.style.fontSize = 12;
            element2.style.fill = 'transparent';
            element2.offsetX = 350;
            element2.offsetY = 250;
            element2.style.textAlign = 'Center';

            let element3: TextElement = new TextElement();
            element3.content = 'Text element align with left side';
            element3.style.fill = 'transparent';
            element3.style.fontSize = 12;
            element3.offsetX = 350;
            element3.offsetY = 400;
            element3.width = 100;
            element3.height = 100;
            element3.style.textAlign = 'Left';

            let element4: TextElement = new TextElement();
            element4.content = 'Text element align with center';
            element4.style.fontSize = 12;
            element4.style.fill = 'transparent';
            element4.offsetX = 400;
            element4.offsetY = 550;
            element4.width = 100;
            element4.height = 100;
            element4.style.textAlign = 'Center';

            let element5: TextElement = new TextElement();
            element5.content = 'Text element align with right side';
            element5.style.fontSize = 12;
            element5.style.fill = 'transparent';
            element5.offsetX = 400;
            element5.offsetY = 700;
            element5.width = 100;
            element5.height = 100;
            element5.style.textAlign = 'Right';

            let element6: TextElement = new TextElement();
            element6.offsetX = 400;
            element6.offsetY = 700;
            element6.style.bold = true;
            element6.style.italic = true;

            let element7: TextElement = new TextElement();
            element7.content = 'Text element align with height';
            element7.style.fontSize = 12;
            element7.style.fill = 'transparent';
            element7.offsetX = 600;
            element7.offsetY = 700;
            element7.height = 100;
            element7.style.textAlign = 'Right';
            let element71: TextElement = new TextElement();
            element71.content = 'Text element will not be wrapped - width/100';
            element71.offsetX = 400;
            element71.offsetY = 250;
            element71.style.fill = 'transparent';
            element71.width = 100;
            element71.height = 100;
            element71.style.fontSize = 12;
            element71.style.whiteSpace = 'CollapseAll';
            element71.style.textAlign = 'Center';

            let element8: TextElement = new TextElement();
            element8.content = 'Text element will not be wrapped - with out width and height';
            element8.offsetX = 250;
            element8.offsetY = 400;
            element8.style.fontSize = 12;
            element8.style.fill = 'transparent';
            element8.style.whiteSpace = 'CollapseAll';
            element8.style.textAlign = 'Center';

            let element9: TextElement = new TextElement();
            element9.content = 'Text element will be wrapped \n  on line breaks \n width and when necessary - without size';
            element9.offsetX = 250;
            element9.offsetY = 550;
            element9.style.fill = 'transparent';
            element9.style.fontSize = 12;
            element9.style.whiteSpace = 'CollapseSpace';
            element9.style.textAlign = 'Center';

            let element10: TextElement = new TextElement();
            element10.content = 'It will not collapse the        white space and \n will not wrap the text - with width and height';
            element10.offsetX = 450;
            element10.offsetY = 700;
            element10.style.fill = 'transparent';
            element10.style.fontSize = 12;
            element10.style.whiteSpace = 'PreserveAll';
            element10.width = 150;
            element10.height = 100;
            element10.style.textAlign = 'Center';

            let element11: TextElement = new TextElement();
            element11.content = 'It will not collapse the     white space and \n will wrap the text on breaks and when necessary - with width and height';
            element11.offsetX = 600;
            element11.offsetY = 100;
            element11.width = 150;
            element11.height = 100;
            element11.style.fill = 'transparent';
            element11.style.fontSize = 12;
            element11.style.whiteSpace = 'PreserveAll';
            element11.style.textAlign = 'Center';

            let element12: TextElement = new TextElement();
            element12.content = 'Text element will be wrapped based on characters with size(100)';
            element12.offsetX = 650;
            element12.offsetY = 250;
            element12.width = 100;
            element12.height = 100;
            element12.style.fill = 'transparent';
            element12.style.fontSize = 12;
            element12.style.whiteSpace = 'PreserveAll';
            element12.style.textWrapping = 'Wrap';
            element12.style.textAlign = 'Center';

            let element13: TextElement = new TextElement();
            element13.content = 'Text element(nl) \n style(nl) \ as keep-all(nl) \n and pre-line so text will be wrapped based on words ';
            element13.offsetX = 650;
            element13.offsetY = 400;
            element12.width = 100;
            element12.height = 100;
            element13.style.fontSize = 12;
            element13.style.fill = 'transparent';
            element13.style.whiteSpace = 'CollapseSpace';
            element13.style.textWrapping = 'NoWrap';
            element13.style.textAlign = 'Center';

            let element14: TextElement = new TextElement();
            element14.content = 'Text element\n style \ as wrap and preserve all';
            element14.offsetX = 600;
            element14.offsetY = 550;
            element14.style.fontSize = 12;
            element14.style.fill = 'transparent';
            element14.style.whiteSpace = 'PreserveAll';
            element14.style.textWrapping = 'WrapWithOverflow';
            element14.style.textAlign = 'Center';


            let container1: Container = new Container();
            container1.pivot = { x: 0, y: 0 };
            container1.offsetX = 200;
            container1.offsetY = 100;
            container1.width = 500;
            container1.children = [element1, element2, element3, element4, element5, element6, element7, element8, element9, element10, element11, element12, element13, element14, element71]
            container1.height = 500;
            container1.rotateAngle = 90;
            container1.style = { fill: 'red' };
            container1.measure(new Size());
            container1.arrange(container1.desiredSize);

            refreshDiagramElements(canvas as HTMLCanvasElement, [container1], renderer);

        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            debugger;
            done();
        });
    });


    describe('Simple text wrapper ', () => {
        let ele: HTMLElement; let diagram: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);

            ele = document.getElementById('CursorLayer');
            createMeasureElements();

            let element1: TextElement = new TextElement();
            element1.content = 'Text element with Wrapping and align - center';
            element1.style.color = 'red';
            element1.style.italic = true;
            element1.style.fontSize = 12;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style.fill = 'transparent';
            element1.width = 100;
            element1.height = 60;
            element1.style.bold = true;
            element1.style.fontFamily = 'Arial';
            element1.style.textAlign = 'Center';

            let element2: TextElement = new TextElement();
            element2.content = 'Text element with Wrapping and without align';
            element2.style.color = 'red';
            element2.style.italic = true;
            element2.style.fontSize = 12;
            element2.offsetX = 400;
            element2.offsetY = 300;
            element2.style.fill = 'transparent';
            element2.style.textDecoration = 'Underline';
            element2.width = 100;
            element2.height = 60;
            element2.style.bold = true;
            element2.style.fontFamily = 'Arial';

            let element3: TextElement = new TextElement();
            element3.content = 'Text element with Wrapping and align - right';
            element3.style.color = 'blue';
            element3.style.italic = false;
            element3.style.bold = true;
            element3.style.fontSize = 12;
            element3.offsetX = 600;
            element3.offsetY = 100;
            element3.style.fill = 'transparent';
            element3.width = 100;
            element3.height = 60;
            element3.style.textDecoration = 'Overline';

            element3.style.bold = true;
            element3.style.fontFamily = 'Arial';
            element3.style.textAlign = 'Right';

            let element4: TextElement = new TextElement();
            element4.content = 'Text element with Wrapping and align - left';
            element4.style.color = 'green';
            element4.style.italic = false;
            element4.style.bold = true;
            element4.style.fontSize = 12;
            element4.offsetX = 600;
            element4.offsetY = 300;
            element4.style.textDecoration = 'LineThrough';
            element4.style.fill = 'transparent';
            element4.width = 100;
            element4.height = 60;
            element4.style.bold = true;
            element4.style.fontFamily = 'Arial';
            element4.style.textAlign = 'Left';

            let container1: Container = new Container();
            container1.pivot = { x: 0, y: 0 };
            container1.offsetX = 200;
            container1.offsetY = 100;
            container1.width = 500;
            container1.children = [element1, element2, element3, element4]
            container1.height = 500;
            container1.rotateAngle = 90;
            container1.style = { fill: 'red' };
            container1.measure(new Size());
            container1.arrange(container1.desiredSize);

            refreshDiagramElements(canvas as HTMLCanvasElement, [container1], renderer);
        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            debugger;
            done();
        });
    });

    describe('Simple path element ', () => {
        let ele: HTMLElement; let diagram: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);

            ele = document.getElementById('CursorLayer');
            createMeasureElements();

            let element1 = new PathElement();
            element1.width = 50;
            element1.height = 50;
            element1.offsetX = 300;
            element1.offsetY = 100;
            element1.style.strokeWidth = 1;
            element1.data = 'm10 80 q 52.5 10, 95 80 t 180 80 ';

            let element2 = new PathElement();
            element2.width = 100;
            element2.height = 100;
            element2.offsetX = 700;
            element2.style.strokeWidth = 1;
            element2.offsetY = 100;
            element2.data = 'M300,200 h-150 a150,150 0 1,0 150,-150 z';
            element2.style.fill = 'red';

            let element3 = new PathElement();
            element3.width = 100;
            element3.height = 100;
            element3.offsetX = 500;
            element3.offsetY = 100;
            element3.style.strokeWidth = 1;
            element3.data = 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25';
            element3.style.fill = 'blue';

            let element4 = new PathElement();
            element4.width = 100;
            element4.height = 100;
            element4.offsetX = 350;
            element4.style.strokeWidth = 1;
            element4.offsetY = 300;
            element4.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200';

            let element5 = new PathElement();
            element5.width = 100;
            element5.height = 100;
            element5.offsetX = 500;
            element5.offsetY = 300;
            element5.style.strokeWidth = 1;
            element5.data = 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z';

            let element6 = new PathElement();
            element6.width = 50;
            element6.height = 50;
            element6.offsetX = 50;
            element6.offsetY = 50;
            element6.style.strokeWidth = 1;
            element6.data = 'M10 80 T 180 80 ';

            let element8 = new PathElement();
            element8.width = 50;
            element8.height = 50;
            element8.offsetX = 150;
            element8.style.strokeWidth = 1;
            element8.offsetY = 150;
            element8.data = 'M300,200 h-150 a150,150 0 0,1 150,-150 z';
            element8.style.fill = 'red';

            let element9 = new PathElement();
            element9.width = 50;
            element9.height = 50;
            element9.offsetX = 200;
            element9.style.strokeWidth = 1;
            element9.offsetY = 200;
            element9.data = 'M300,200 h-150 a150,150 0 0,0 150,-150 z';
            element9.style.fill = 'red';

            let element10 = new PathElement();
            element10.width = 50;
            element10.height = 50;
            element10.offsetX = 150;
            element10.style.strokeWidth = 1;
            element10.offsetY = 300;
            element10.data = 'M300,200 h-150 a150,150 0 1,1 150,-150 z';
            element10.style.fill = 'red';

            let element11 = new PathElement();
            element11.width = 50;
            element11.height = 50;
            element11.offsetX = 370;
            element11.offsetY = 130;
            element11.style.strokeWidth = 1;
            element11.style.strokeDashArray = '';
            element11.style.fill = '';
            element11.data = 'M10 80 Q 52.5 10, 95 80 T 180 80 ';
            element1 = new PathElement();
            element1.offsetX = 300;
            element1.offsetY = 100;
            element1.style.strokeWidth = 1;
            element1.data = 'M 0,0 L 100,0 M100,0 L100,100 M100,100 L0,100 M0,100 L0,0 Z ';
            element1.style.fill = 'red';

            let element12 = new PathElement();
            element12.offsetX = 700;
            element12.offsetY = 100;
            element12.data = 'M300,200 h-150 a150,150 0 1,0 150,-150 z';
            element12.style.fill = 'red';
            element12.style.strokeWidth = 1;

            let element13 = new PathElement();
            element13.offsetX = 500;
            element13.offsetY = 100;
            element13.data = 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25';
            element13.style.fill = 'blue';
            element13.style.strokeWidth = 1;

            let element14 = new PathElement();
            element14.offsetX = 350;
            element14.offsetY = 300;
            element14.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200';
            element14.style.strokeWidth = 1;

            let element15 = new PathElement();
            element15.offsetX = 100;
            element15.offsetY = 100;
            element15.style.strokeWidth = 1;
            element15.data = 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z';

            let element16 = new PathElement();
            element16.offsetX = 50;
            element16.offsetY = 50;
            element16.width = 50;
            element16.height = 50;
            element16.data = 'M100,200 S400,300 400,200';
            element16.style.strokeWidth = 1;

            let element17 = new PathElement();
            element17.width = 75;
            element17.height = 75;
            element17.offsetX = 75;
            element17.offsetY = 75;
            element17.style.strokeWidth = 1;
            element17.data = '';

            let container1: Container = new Container();
            container1.pivot = { x: 0, y: 0 };
            container1.offsetX = 200;
            container1.offsetY = 100;
            container1.width = 500;
            container1.children = [element1, element2, element3, element4, element5, element6, element8, element9,
                element10, element11, element12, element13, element14, element15, element16, element17];
            container1.height = 500;
            container1.rotateAngle = 90;
            container1.style = { fill: 'red' };
            container1.measure(new Size());
            container1.arrange(container1.desiredSize);
            container1.bounds.equals(element1.bounds, element2.bounds);
            container1.bounds.equals(element1.bounds, element1.bounds);
            element13.bounds.intersection(container1.bounds);
            container1.bounds.intersection(new Rect(container1.bounds.x - 10, container1.bounds.y - 10, container1.bounds.width - 10, container1.bounds.height - 10));
            container1.bounds.Inflate(10);
            container1.bounds.intersects(element1.bounds);
            container1.bounds.intersects(container1.bounds);
            container1.bounds.containsRect(element1.bounds);
            container1.bounds.containsRect(container1.bounds);
            container1.bounds.containsPoint(element1.bounds.center, 10);
            container1.bounds.containsPoint(element1.bounds.center);

            container1.bounds.toPoints();
            container1.bounds.scale(10, 10);
            container1.bounds.offset(100, 100);
            translatePoints(element17, [element17.bounds.center])

            refreshDiagramElements(canvas as HTMLCanvasElement, [container1], renderer);
        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            debugger;
            getAdornerLayerSvg('diagram');
            getSelectorElement('Diagram');
            done();
        });
    });

    describe('Simple path element ', () => {
        let ele: HTMLElement; let diagram: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip();
                return;
            }
            diagram = createElement('div', { id: 'diagram' });
            document.body.appendChild(diagram);
            var canvas = document.createElement('canvas');
            canvas.id = "CursorLayer";
            canvas.width = 1224;
            canvas.height = 768;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            diagram.appendChild(canvas);

            ele = document.getElementById('CursorLayer');
            createMeasureElements();

            let element1 = new PathElement();
            element1.width = 50;
            element1.height = 50;
            element1.offsetX = 300;
            element1.offsetY = 100;
            element1.style.strokeWidth = 1;
            element1.data = 'm10 80 q 52.5 10, 95 80 t 180 80 ';

            let element2 = new PathElement();
            element2.width = 100;
            element2.height = 100;
            element2.offsetX = 700;
            element2.style.strokeWidth = 1;
            element2.offsetY = 100;
            element2.data = 'M300,200 h-150 a150,150 0 1,0 150,-150 z';
            element2.style.fill = 'red';

            let element3 = new PathElement();
            element3.width = 100;
            element3.height = 100;
            element3.offsetX = 500;
            element3.offsetY = 100;
            element3.style.strokeWidth = 1;
            element3.data = 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25';
            element3.style.fill = 'blue';

            let element4 = new PathElement();
            element4.width = 100;
            element4.height = 100;
            element4.offsetX = 350;
            element4.style.strokeWidth = 1;
            element4.offsetY = 300;
            element4.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200';

            let element5 = new PathElement();
            element5.width = 100;
            element5.height = 100;
            element5.offsetX = 500;
            element5.offsetY = 300;
            element5.style.strokeWidth = 1;
            element5.data = 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z';

            let element6 = new PathElement();
            element6.width = 50;
            element6.height = 50;
            element6.offsetX = 50;
            element6.offsetY = 50;
            element6.style.strokeWidth = 1;
            element6.data = 'M10 80 T 180 80 ';

            let element8 = new PathElement();
            element8.width = 50;
            element8.height = 50;
            element8.offsetX = 150;
            element8.style.strokeWidth = 1;
            element8.offsetY = 150;
            element8.data = 'M300,200 h-150 a150,150 0 0,1 150,-150 z';
            element8.style.fill = 'red';

            let element9 = new PathElement();
            element9.width = 50;
            element9.height = 50;
            element9.offsetX = 200;
            element9.style.strokeWidth = 1;
            element9.offsetY = 200;
            element9.data = 'M300,200 h-150 a150,150 0 0,0 150,-150 z';
            element9.style.fill = 'red';

            let element10 = new PathElement();
            element10.width = 50;
            element10.height = 50;
            element10.offsetX = 150;
            element10.style.strokeWidth = 1;
            element10.offsetY = 300;
            element10.data = 'M300,200 h-150 a150,150 0 1,1 150,-150 z';
            element10.style.fill = 'red';

            let element11 = new PathElement();
            element11.width = 50;
            element11.height = 50;
            element11.offsetX = 370;
            element11.offsetY = 130;
            element11.style.strokeWidth = 1;
            element11.style.strokeDashArray = '';
            element11.style.fill = '';
            element11.data = 'M10 80 Q 52.5 10, 95 80 T 180 80 ';
            element1 = new PathElement();
            element1.offsetX = 300;
            element1.offsetY = 100;
            element1.style.strokeWidth = 1;
            element1.data = 'M 0,0 L 100,0 M100,0 L100,100 M100,100 L0,100 M0,100 L0,0 Z ';
            element1.style.fill = 'red';

            let element12 = new PathElement();
            element12.offsetX = 700;
            element12.offsetY = 100;
            element12.data = 'M300,200 h-150 a150,150 0 1,0 150,-150 z';
            element12.style.fill = 'red';
            element12.style.strokeWidth = 1;

            let element13 = new PathElement();
            element13.offsetX = 500;
            element13.offsetY = 100;
            element13.data = 'M35.2441,25 L22.7161,49.9937 L22.7161,0.00657536 L35.2441,25 z M22.7167,25 L-0.00131226,25 M35.2441,49.6337 L35.2441,0.368951 M35.2441,25 L49.9981,25';
            element13.style.fill = 'blue';
            element13.style.strokeWidth = 1;

            let element14 = new PathElement();
            element14.offsetX = 350;
            element14.offsetY = 300;
            element14.data = 'M100,200 C100,100 250,100 250,200 S400,300 400,200';
            element14.style.strokeWidth = 1;

            let element15 = new PathElement();
            element15.offsetX = 100;
            element15.offsetY = 100;
            element15.style.strokeWidth = 1;
            element15.data = 'M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z';

            let element16 = new PathElement();
            element16.offsetX = 50;
            element16.offsetY = 50;
            element16.width = 50;
            element16.height = 50;
            element16.data = 'M100,200 S400,300 400,200';
            element16.style.strokeWidth = 1;

            let element17 = new PathElement();
            element17.width = 75;
            element17.height = 75;
            element17.offsetX = 75;
            element17.offsetY = 75;
            element17.style.strokeWidth = 1;
            element17.data = '';

            let container1: Container = new Container();
            container1.pivot = { x: 0, y: 0 };
            container1.offsetX = 200;
            container1.offsetY = 100;
            container1.width = 500;
            container1.children = [element1, element2, element3, element4, element5, element6, element8, element9,
                element10, element11, element12, element13, element14, element15, element16, element17];
            container1.height = 500;
            container1.rotateAngle = 90;
            container1.style = { fill: 'red' };
            container1.measure(new Size());
            container1.arrange(container1.desiredSize);
            container1.bounds.equals(element1.bounds, element2.bounds);
            container1.bounds.equals(element1.bounds, element1.bounds);
            element13.bounds.intersection(container1.bounds);
            container1.bounds.intersection(new Rect(container1.bounds.x - 10, container1.bounds.y - 10, container1.bounds.width - 10, container1.bounds.height - 10));
            container1.bounds.Inflate(10);
            container1.bounds.intersects(element1.bounds);
            container1.bounds.intersects(container1.bounds);
            container1.bounds.containsRect(element1.bounds);
            container1.bounds.containsRect(container1.bounds);
            container1.bounds.containsPoint(element1.bounds.center, 10);
            container1.bounds.containsPoint(element1.bounds.center);

            container1.bounds.toPoints();
            container1.bounds.scale(10, 10);
            container1.bounds.offset(100, 100);
            translatePoints(element17, [element17.bounds.center])

            refreshDiagramElements(canvas as HTMLCanvasElement, [container1], renderer);
        });
        afterAll((): void => {
            diagram = undefined;
            ele.remove();
        });

        it('Checking container with chidlren', (done: Function) => {
            debugger;
            getAdornerLayerSvg('diagram');
            getSelectorElement('Diagram');
            done();
        });
    });
});