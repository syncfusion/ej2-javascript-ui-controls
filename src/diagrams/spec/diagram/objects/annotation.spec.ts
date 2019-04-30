import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { AnnotationModel, HyperlinkModel, ShapeAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { Node } from '../../../src/diagram/objects/node';
import { HorizontalAlignment, VerticalAlignment, AnnotationConstraints } from '../../../src/diagram/enum/enum';
import { MouseEvents } from './../interaction/mouseevents.spec';
import { ConnectorModel, PathModel, BasicShapeModel } from '../../../src';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

/**
 * Annotations - Alignments
 */
describe('Diagram Control', () => {

    describe('Annotation alignment- horizontal center', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pathData: string = 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,'
            + '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z';
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram53' });
            document.body.appendChild(ele);
            let node: NodeModel = {
                id: 'node',
                width: 100, height: 100,
                offsetX: 100, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5, bold: true, italic: false },
                    content: 'center center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center',
                }]
            };

            let node2: NodeModel = {
                id: 'node2',
                width: 100, height: 100,
                offsetX: 300, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5, bold: false, italic: true },
                    content: 'top center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Top',
                }]
            };

            let node3: NodeModel = {
                id: 'node3',
                width: 100, height: 100,
                offsetX: 500, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5, strokeDashArray: '', fill: '' },
                    content: 'bottom center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Bottom',
                }]
            };

            let node4: NodeModel = {
                id: 'node4',
                width: 100, height: 100,
                offsetX: 700, offsetY: 100,
                shape: { type: 'Path', data: pathData },
                annotations: [{
                    style: { strokeColor: 'black', opacity: 0.5 },
                    content: 'stretch center',
                    height: 50,
                    offset: { x: 0.5, y: 0.5 },
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Stretch',
                }]
            };

            let node5: NodeModel = {
                id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,

                annotations: [{
                    hyperlink: { link: 'https://hr.syncfusion.com/home' }
                }]
            };
            let node6: NodeModel = {
                id: 'node6', width: 100, height: 100, offsetX: 500, offsetY: 500,

                annotations: [{
                    hyperlink: { link: 'https://hr.syncfusion.com/home', color: 'red', textDecoration: 'Underline', content: 'Link' }
                }]
            };

            diagram = new Diagram({ mode: 'SVG', width: 800, height: 500, nodes: [node, node2, node3, node4, node5, node6] });
            diagram.appendTo('#diagram53');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking horizontal center annotation alignment', (done: Function) => {
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 100
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 300 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 500 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 700 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            diagram.exportDiagram({ mode: 'Data' });
            done();
        });

        it('Checking horizontal left annotation alignment', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            (diagram.nodes[3] as NodeModel).annotations[0].horizontalAlignment = 'Left';
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 150
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 350 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 550 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 750 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });

        it('Checking horizontal right annotation alignment', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            (diagram.nodes[3] as NodeModel).annotations[0].horizontalAlignment = 'Right';
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 50
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 250 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 450 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 650 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });

        it('Checking horizontal stretch annotation alignment', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            (diagram.nodes[1] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            (diagram.nodes[2] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            (diagram.nodes[3] as NodeModel).annotations[0].horizontalAlignment = 'Stretch';
            diagram.dataBind();
            expect((diagram.nodes[0] as Node).wrapper.children[1].offsetX === 100
                && (diagram.nodes[0] as Node).wrapper.children[1].offsetY === 100 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetX === 300 &&
                (diagram.nodes[1] as Node).wrapper.children[1].offsetY === 125 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetX === 500 &&
                (diagram.nodes[2] as Node).wrapper.children[1].offsetY === 75 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetX === 700 &&
                (diagram.nodes[3] as Node).wrapper.children[1].offsetY === 100).toBe(true);
            done();
        });

        it('Checking annotation bold at the run time', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].style.bold = false
            diagram.dataBind();
            let value: HTMLElement = document.getElementById(diagram.nodes[0].wrapper.children[1].id + '_text');
            expect(value.style.fontWeight === 'normal').toBe(true);
            (diagram.nodes[0] as NodeModel).annotations[0].style.bold = true;
            diagram.dataBind();
            expect(value.style.fontWeight === 'bold').toBe(true);
            done();
        });

        it('checking hyperlink', (done: Function) => {

            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 108, 308, true);
            mouseEvents.mouseUpEvent(diagramCanvas, 108, 308, true);
            let element: HTMLElement = document.getElementById('diagram53content');
            expect(element.style.cursor === 'pointer').toBe(true);
            (diagram.nodes[4] as NodeModel).annotations[0].hyperlink.link = 'https://gitlab.syncfusion.com';
            diagram.dataBind();
            mouseEvents.clickEvent(diagramCanvas, 10, 10, true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 108, 308, true);
            mouseEvents.mouseUpEvent(diagramCanvas, 108, 308, true);

            let node: NodeModel = diagram.nodes[4];
            let link: HyperlinkModel = (node.wrapper.children[1]) as HyperlinkModel;
            expect((link as AnnotationModel).hyperlink.link === 'https://gitlab.syncfusion.com').toBe(true);
            done();
        });
        it('checking annotation hyperlink data bind', (done: Function) => {
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.color = 'blue';
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.textDecoration = 'Overline';
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.content = 'git';
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.link = 'https://gitlab.syncfusion.com';
            diagram.dataBind();
            let node: NodeModel = diagram.nodes[5];
            let element: HyperlinkModel = (node.wrapper.children[1]) as HyperlinkModel;
            expect((element as AnnotationModel).hyperlink.link === 'https://gitlab.syncfusion.com'
                && (element as AnnotationModel).hyperlink.content === 'git'
                && (element as AnnotationModel).hyperlink.textDecoration === 'Overline'
                && (element as AnnotationModel).hyperlink.color === 'blue')
            done();
        });
        it('checking annotation hyperlink data bind coverage', (done: Function) => {
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.color = 'blue';
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.textDecoration = 'Overline';
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.content = 'git';
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.link = 'https://gitlab.syncfusion.com';
            (diagram.nodes[4] as NodeModel).annotations[0].hyperlink.link = 'https://gitlab.syncfusion.com';
            diagram.dataBind();
            let node: NodeModel = diagram.nodes[5];
            let element: HyperlinkModel = (node.wrapper.children[1]) as HyperlinkModel;
            expect((element as AnnotationModel).hyperlink.link === 'https://gitlab.syncfusion.com'
                && (element as AnnotationModel).hyperlink.content === 'git'
                && (element as AnnotationModel).hyperlink.textDecoration === 'Overline'
                && (element as AnnotationModel).hyperlink.color === 'blue').toBe(true);
            diagram.exportDiagram({ mode: 'Data' });
            done();
        });
        it('changing annotation content url not changing', (done: Function) => {
            let node: NodeModel = diagram.nodes[5];
            diagram.nodes[5].annotations[0].hyperlink.link = 'https://gitlab.syncfusion.com/essential-studio/ej2-diagram-components';
            diagram.dataBind()
            let element: HyperlinkModel = (node.wrapper.children[1]) as HyperlinkModel;
            expect((element as AnnotationModel).hyperlink.link === 'https://gitlab.syncfusion.com/essential-studio/ej2-diagram-components'
                && (element as AnnotationModel).hyperlink.content === 'git'
                && (element as AnnotationModel).hyperlink.textDecoration === 'Overline'
                && (element as AnnotationModel).hyperlink.color === 'blue')
            done();
        });
        it('checking annotation hyperlink data bind coverage', (done: Function) => {
            (diagram.nodes[5] as NodeModel).annotations[0].hyperlink.link = '';
            diagram.dataBind();
            let node: NodeModel = diagram.nodes[5];
            let element: HyperlinkModel = (node.wrapper.children[1]) as HyperlinkModel;
            expect((element as AnnotationModel).style.textDecoration === 'None'
                && (element as AnnotationModel).style.color === 'black'
                && (element as AnnotationModel).hyperlink.content === '')
            done();
        });
        it('Checking annotation alinments and positions in SVG rendering Mode on propertychange', (done: Function) => {
            (diagram.nodes[0] as NodeModel).annotations[0].style.textAlign = 'Left';
            diagram.dataBind();
            let node: HTMLElement = document.getElementById(diagram.nodes[0].id + '_' + diagram.nodes[0].annotations[0].id + '_text');
            let valueX: string = (node.childNodes[0] as HTMLElement).getAttribute('x');
            let valueY: string = (node.childNodes[0] as HTMLElement).getAttribute('y');
            expect(valueX === '0' && (valueY === '28.6' || valueY === '27.400000000000002')).toBe(true);
            done();
        });
    });

    describe('Annotation editing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }

            ele = createElement('div', { id: 'diagramannotationEditing' });
            document.body.appendChild(ele);
            let node: NodeModel = { id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100 };
            diagram = new Diagram({
                width: '600px', height: '600px',
                nodes: [node]
            });
            diagram.appendTo('#diagramannotationEditing');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking without label', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            mouseEvents.dblclickEvent(diagramCanvas, 100, 100);
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            expect((diagram.nodes[0] as NodeModel).annotations.length > 0).toBe(true);
            done();
        });
    });
    describe('Annotation style update SVG mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramh' });
            document.body.appendChild(ele);

            let shape1: PathModel = { type: 'Path', data: 'M 0,0 L 100,0 L100,100 L0,100 Z' }
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 200,
                shape: shape1,
                annotations: [{ id: 'label1', content: 'label' }]
            };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node1], mode: 'SVG' });
            diagram.appendTo('#diagramh');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Testing label style in SVG mode', (done: Function) => {
            diagram.nodes[0].annotations[0].style.bold = true;
            diagram.nodes[0].annotations[0].style.italic = true;
            diagram.dataBind();
            expect(document.getElementById('node1_label1_text').style.fontWeight === 'bold').toBe(true);
            expect(document.getElementById('node1_label1_text').style.fontStyle === 'italic').toBe(true);
            diagram.nodes[0].annotations[0].style.bold = false;
            diagram.nodes[0].annotations[0].style.italic = false;
            diagram.dataBind();
            expect(document.getElementById('node1_label1_text').style.fontWeight === 'normal').toBe(true);
            expect(document.getElementById('node1_label1_text').style.fontStyle === 'normal').toBe(true);
            done();
        });

        it('Testing label line height in SVG mode', (done: Function) => {
            diagram.nodes[0].annotations[0].content
                = 'ssssssss sssssss sssssss sssssss sssssss sssssss sssssss sssssss sssssss sssssss sssssss ssssssss';
            diagram.nodes[0].annotations[0].offset = { x: 0.5, y: 0.5 };
            diagram.dataBind();
            let textElement: HTMLElement
                = document.getElementById(diagram.nodes[0].id + '_' + diagram.nodes[0].annotations[0].id + '_text');
            expect(textElement.childNodes.length === 6).toBe(true);
            function getAttributeX(i: number): string {
                return (textElement.childNodes[i] as HTMLElement).getAttribute('x');
            }
            function getAttributeY(i: number): string {
                return (textElement.childNodes[i] as HTMLElement).getAttribute('y');
            }
            expect(getAttributeX(0) === '0' && getAttributeY(0) === '10.800000000000004').toBe(true);
            expect(getAttributeX(1) === '3' && getAttributeY(1) === '25.200000000000003').toBe(true);
            expect(getAttributeX(2) === '3' && getAttributeY(2) === '39.6').toBe(true);
            expect(getAttributeX(3) === '3' && getAttributeY(3) === '54').toBe(true);
            expect(getAttributeX(4) === '3' && getAttributeY(4) === '68.4').toBe(true);
            expect(getAttributeX(5) === '0' && getAttributeY(5) === '82.80000000000001').toBe(true);
            done();
        });
    });

    describe('Annotation Position Issue', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramAnnotationPositionIssue' });
            document.body.appendChild(ele);

            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
            let node1: NodeModel = {
                id: 'node1', offsetX: 100, offsetY: 100, width: 40, height: 40,
                annotations: [{
                    content: 'Rectangle', id: 'label1',
                    verticalAlignment: 'Top', offset: { y: 1 }, margin: { top: 10 }
                }],
                shape: shape, borderColor: "red"
            };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = {
                id: 'node2', offsetX: 100, offsetY: 100, shape: shape2, width: 40, height: 40, annotations: [{
                    content: 'Ellipse', id: 'label1',
                    verticalAlignment: 'Top', offset: { y: 1 }, margin: { top: 10 }
                }],
            };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node1, node2], mode: 'SVG' });
            diagram.appendTo('#diagramAnnotationPositionIssue');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Testing label style in SVG mode', (done: Function) => {
            let transform: string = document.getElementById('node1_label1_text').getAttribute("transform");
            let transform2: string = document.getElementById('node2_label1_text').getAttribute("transform");
            expect(transform === 'rotate(0,100.5,136.5)translate(73.484375,130.5)' || transform == 'rotate(0,100.5,136.5)translate(73.3203125,130.5)' || transform == 'rotate(0,100.5,137.7)translate(73.3203125,130.5)').toBe(true);
            expect(transform2 === 'rotate(0,100.5,136.5)translate(82.828125,130.5)' || transform2 == 'rotate(0,100.5,136.5)translate(82.6640625,130.5)' || transform2 == 'rotate(0,100.5,137.7)translate(82.6640625,130.5)').toBe(true);
            done();
        });
    });

    describe('Annotation Template', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let htmlElement: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramAnnotationTemplate' });
            document.body.appendChild(ele);

            htmlElement = createElement('div', { id: 'element', className: 'domelement', styles: 'background:red; height:100%;width:100%;' });
            document.body.appendChild(htmlElement);

            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
            let node1: NodeModel = {
                id: 'node1', offsetX: 100, offsetY: 100, width: 40, height: 40,
                annotations: [{
                    id: 'label1', template: '<div style="background:red; height:100%;width:100%;"><div/>'
                }],
                shape: shape
            };
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = {
                id: 'node2', offsetX: 300, offsetY: 100, shape: shape2, width: 40, height: 40,
                annotations: [{
                    content: 'Ellipse', id: 'label1',
                }],
            };
            let node3: NodeModel = {
                id: 'node3', offsetX: 100, offsetY: 300, width: 40, height: 40,
                annotations: [{
                    id: 'label1', template: '<div style="background:red; height:100%;width:100%;"><div/>'
                }],
                shape: shape
            };
            let node4: NodeModel = {
                id: 'node4', offsetX: 100, offsetY: 500, width: 150, height: 150,
                annotations: [{
                    id: 'label1', height: 100, width: 100, template: htmlElement
                }],
                shape: shape
            };
            let node5: NodeModel = {
                id: 'node5', offsetX: 300, offsetY: 300, width: 150, height: 150,
                annotations: [{
                    id: 'label1', height: 100, width: 100, template: '<style>th {border: 5px solid #c1dad7}td {border: 5px solid #c1dad7}.c1 { background: #4b8c74 } .c2 { background: #74c476 }  .c3 { background: #a4e56d } .c4 { background: #cffc83 } </style> <table> <tbody> <tr> <th class="c1">ID</th> <th class="c2">X</th> <th class="c3">Y</th> </tr> <tr> <td id=${id}_id class="c1">${id}</td> <td id=${id}_offsetX class="c2">${offset.x}</td> <td id=${id}_offsetY class="c3">${offset.y}</td>  </tr> </tbody> </table>'
                }],
                shape: shape
            };
            let connector1: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 800, y: 100 }, targetPoint: { x: 600, y: 300 },
                annotations: [{
                    id: 'label1', height: 100, width: 100, template: '<div style="background:red; height:100%;width:100%;"><div/>'
                }],
            };
            diagram = new Diagram({ width: 1000, height: 1000, nodes: [node1, node2, node3, node4, node5], connectors: [connector1], mode: 'SVG' });
            diagram.appendTo('#diagramAnnotationTemplate');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Label temlpate rendering', function (done) {
            let html: HTMLElement = document.getElementById('node1_label1_html_element');
            let background = (html.children[0].children[0] as HTMLElement).style.background;
            expect(html && background === 'red').toBe(true);
            done();
        });
        it('Changing Label template to another template at runtime', function (done) {
            let annotation: AnnotationModel = diagram.nodes[0].annotations[0];
            annotation.template = '<div style="background:green; height:100%;width:100%;"><div/>';
            diagram.dataBind();
            let html: HTMLElement = document.getElementById('node1_label1_html_element');
            let background = (html.children[0].children[0] as HTMLElement).style.background;
            expect(html && background === 'green').toBe(true);
            done();
        });
        it('Delete Label with template', function (done) {
            let obj: Node = diagram.nodes[0] as Node;
            let annotation: AnnotationModel[] = diagram.nodes[0].annotations;
            diagram.removeLabels(obj, annotation);
            let html: HTMLElement = document.getElementById('node1_label1_html_element');
            expect(!html).toBe(true);
            done();
        });
        it('Checking undo-redo for Label with template', function (done) {
            diagram.undo();
            let html: HTMLElement = document.getElementById('node1_label1_html_element');
            let background = (html.children[0].children[0] as HTMLElement).style.background;
            expect(html && background === 'green').toBe(true);
            diagram.redo();
            html = document.getElementById('node1_label1_html_element');
            expect(!html).toBe(true);
            done();
        });
        it('Delete Label with template', function (done) {
            let obj: Node = diagram.nodes[0] as Node;
            let annotation: AnnotationModel[] = diagram.nodes[0].annotations;
            diagram.removeLabels(obj, annotation);
            let html: HTMLElement = document.getElementById('node1_label1_html_element');
            expect(!html).toBe(true);
            done();
        });
        it('Changing Label text to template at runtime', function (done) {
            let annotation: AnnotationModel = diagram.nodes[1].annotations[0];
            annotation.template = '<div style="background:green; height:100%;width:100%;"><div/>';
            diagram.dataBind();
            let text: HTMLElement = document.getElementById('node2_label1_text');
            let html: HTMLElement = document.getElementById('node2_label1_html_element');
            expect(html && !text).toBe(true);
            done();
        });
        it('Changing Label template to text at runtime', function (done) {
            let annotation: AnnotationModel = diagram.nodes[2].annotations[0];
            annotation.content = 'Rectangle';
            annotation.template = undefined;
            diagram.dataBind();
            let text: HTMLElement = document.getElementById('node3_label1_text');
            let html: HTMLElement = document.getElementById('node3_label1_html_element');
            expect(text && !html).toBe(true);
            done();
        });
        it('checking Label with template as dom element', function (done) {
            let html: HTMLElement = document.getElementById('node4_label1_html_element');
            let child: HTMLElement = (html.children[0].children[0] as HTMLElement);
            expect(html && child && child.id === 'element').toBe(true);
            done();
        });
        it('Label temlpate rendering connector', function (done) {
            let html: HTMLElement = document.getElementById('connector1_label1_html_element');
            let background = (html.children[0].children[0] as HTMLElement).style.background;
            expect(html && background === 'red').toBe(true);
            done();
        });
    });
    describe('Annotation Template dragging support ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 300, height: 160, offsetX: 250, offsetY: 180,
                    annotations: [
                        {
                            id: 'node_label', height: 60, width: 200,
                            constraints: AnnotationConstraints.Interaction,
                            content: 'node1'
                        }
                    ]
                }
            ];
            diagram = new Diagram({

                width: '1000px', height: '1000px', nodes: nodes, connectors: [
                    {
                        id: 'connector1',
                        type: 'Straight',
                        sourcePoint: { x: 100, y: 100 },
                        targetPoint: { x: 500, y: 200 },
                        annotations: [
                            {
                                id: 'node_lasssbel',
                                constraints: AnnotationConstraints.Interaction,
                                content: 'ddddddddddddddddd'
                            }
                        ]
                    },
                ]
            });

            diagram.appendTo('#diagram4');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Annotation template change during run time', (done: Function) => {
            diagram.nodes[0].annotations[0].template = '<div style="background:red; height:100%;width:100%;"><div/>';
            diagram.dataBind();
            let mouseEvents: MouseEvents = new MouseEvents();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseDownEvent(diagramCanvas, 250, 180);
            mouseEvents.mouseMoveEvent(diagramCanvas, 300, 250);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            expect(diagram.nodes[0].annotations[0].offset.x !== 0.5 && diagram.nodes[0].annotations[0].offset.y !== 0.5).toBe(true);
            diagram.clearSelection();
            done();
            diagram.connectors[0].annotations[0].template = '<div id="test-case" style="height:100%;width:100%;background:red;">';
            diagram.dataBind();
            var text: any = document.getElementById("test-case");
            expect(text !== undefined).toBe(true);
            done();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });
});