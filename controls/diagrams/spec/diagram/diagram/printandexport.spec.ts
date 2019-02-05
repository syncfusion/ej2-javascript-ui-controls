import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { Rect } from '../../../src/index';
import { PrintAndExport } from '../../../src/diagram/print-settings';
import { PageSettingsModel, BackgroundModel } from '../../../src/diagram/diagram/page-settings-model';
import { IExportOptions } from '../../../src/diagram/objects/interface/interfaces';
import { DiagramModel } from '../../../src/diagram/index';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
Diagram.Inject(PrintAndExport, UndoRedo);

/**
 * Print and Export Spec
 */
describe('Print and export', () => {

    describe('Print and Export Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
                annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            background.color = 'yellow';
            pageSettings.multiplePage = true;
            pageSettings.background = background;
            pageSettings.height = 300; pageSettings.width = 300;
            pageSettings.orientation = 'Portrait';
            diagram = new Diagram({
                width: '1200px', height: '600px', nodes: [node, node2, node3], connectors: [connector],
                mode: 'Canvas'
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Export settings with bounds and margin - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            let rect: Rect = new Rect();
            rect.x = 5; rect.y = 5; rect.height = 500; rect.width = 500;
            options.bounds = rect;
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export settings with default functions with margin as zero - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.margin = { left: null, right: null, top: null, bottom: null };
            options.region = 'PageSettings';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings with default functions with bounds as zero - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.bounds = new Rect();
            options.region = 'PageSettings';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export settings with mode svg and format SVG - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'SVG';
            diagram.mode = 'Canvas';
            options.region = 'PageSettings';
            options.margin = { left: 5, right: 5, top: 5, bottom: 5 };
            options.multiplePage = false;
            options.pageHeight = 300;
            options.pageWidth = 300;
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings with mode Data and format SVG', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            options.multiplePage = false;
            options.margin = { left: 5, top: 5, bottom: 5, right: 5 };
            options.pageHeight = 300;
            options.pageWidth = 300;
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with mode PNG and multiple page false - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            diagram.mode = 'Canvas';
            diagram.dataBind();
            options.region = 'PageSettings';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'Content';
            options.multiplePage = true;
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true with page height and page width - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true with page height and width as null - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.height = null;
            diagram.pageSettings.width = null;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page false with page height and page width - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.multiplePage = false;
            diagram.pageSettings.height = 300;
            diagram.pageSettings.width = 400;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page false with page height ,width as null- Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.multiplePage = false;
            diagram.pageSettings.height = null;
            diagram.pageSettings.width = null;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true with page height,width(Landscape) - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageOrientation = 'Landscape';
            options.pageHeight = 300;
            options.pageWidth = 500;
            diagram.pageSettings = pageSettings;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Strectch - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.stretch = 'Stretch';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Meet - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.stretch = 'Meet';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Slice - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 500;
            options.pageWidth = 300;
            options.pageOrientation = 'Landscape';
            options.stretch = 'Slice';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Slice (Portrait) - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.stretch = 'Meet';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Print and Export Settings with Format PNG and Multiple page true with Slice (Portrait) - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.stretch = 'Meet';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export Settings with Fromat PNG and mode Data', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export Settings with Format PNG and mode Data with background image with color', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            let background: BackgroundModel = {};
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Meet';
            background.align = 'XMinYMin';
            background.color = 'grey';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export Settings with Format PNG and mode Data with background image with color,scale slice', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            let background: BackgroundModel = {};
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Slice';
            background.align = 'XMinYMin';
            background.color = 'grey';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and mode Data with background image with no color', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            let background: BackgroundModel = {};
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Meet';
            background.align = 'XMinYMin';
            background.color = 'none';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and mode Data with  image(Slice)', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            let background: BackgroundModel = {};
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Slice';
            background.align = 'None';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings with default functions - Default', (done: Function) => {
            let options: IExportOptions = {};
            options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            let rect: Rect = new Rect();
            rect.x = 5; rect.y = 5; rect.height = 500; rect.width = 500;
            options.bounds = rect;
            options.region = 'PageSettings';
            options.mode = 'Data';
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings without Margin - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 300;
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings without Margin - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.margin = { left: 5, right: 5, top: 5, bottom: 5 };
            options.fileName = 'export';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 300;
            let svg: string | SVGElement;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings without Margin - Download', (done: Function) => {
            let rect: Rect = new Rect();
            rect.x = null;
            rect.y = null;
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'SVG';
            options.bounds = rect;
            options.region = 'PageSettings';
            options.fileName = 'export';
            let data: SVGElement | string;
            data = diagram.exportDiagram(options);
            expect(data).not.toBeNull();
            done();
        });
        it('undo redo the background color', (done: Function) => {
            diagram.pageSettings.background.color = 'black';
            diagram.dataBind();
            expect(diagram.pageSettings.background.color).toBe('black');
            done();
            diagram.undo();
            expect(diagram.pageSettings.background.color).toBe('none');
            done();
        });
    });

    describe('Print and Export Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
                annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            background.color = 'none';
            pageSettings.multiplePage = true;
            pageSettings.background = background;
            pageSettings.height = 300; pageSettings.width = 300;
            pageSettings.orientation = 'Portrait';
            diagram = new Diagram({
                width: '1200px', height: '600px', nodes: [node, node2, node3], connectors: [connector]
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Export settings With diagram mode SVG and format SVG - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            let data: SVGElement | string;
            data = diagram.exportDiagram(options);
            expect(data).not.toBeNull();
            done();
        });

        it('Print Settings with Fromat PNG and mode Data', (done: Function) => {
            let options: IExportOptions = {};
            options.multiplePage = true;
            options.pageHeight = 500;
            options.pageWidth = 300;
            options.pageOrientation = 'Landscape';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data', (done: Function) => {
            let options: IExportOptions = {};
            options.multiplePage = false;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Width', (done: Function) => {
            let options: IExportOptions = {};
            options.multiplePage = true;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            let svg: string | SVGElement = null;
            done();
        });
        it('Print Settings with mode Data with page Height', (done: Function) => {
            let options: IExportOptions = {};
            options.multiplePage = true;
            options.pageHeight = 500;
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Width without Format', (done: Function) => {
            let options: IExportOptions = {};
            options.multiplePage = true;
            options.pageWidth = 500;
            options.format = 'SVG';
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Height without format', (done: Function) => {
            let options: IExportOptions = {};
            options.multiplePage = true;
            options.pageHeight = 500;
            options.format = 'SVG';
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });

    });
    describe('Print and Export Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let scroller: DiagramScroller;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350,
                annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            background.color = 'yellow';
            pageSettings.multiplePage = true;
            pageSettings.background = background;
            pageSettings.height = 300; pageSettings.width = 300;
            pageSettings.orientation = 'Portrait';
            diagram = new Diagram({
                width: '1200px', height: '600px'
            } as DiagramModel);
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('No elements in diagram - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            let data: SVGElement | string;
            data = diagram.exportDiagram(options);
            done();
        });

        it('Page Settings in diagram - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            diagram.pageSettings = pageSettings;
            options.fileName = 'export';
            let data: SVGElement | string;
            data = diagram.exportDiagram(options);
            done();
        });

        it('Page Settings color as none in diagram - Download', (done: Function) => {
            let options: IExportOptions = {};
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.background.color = 'none';
            options.fileName = 'export';
            let data: SVGElement | string;
            data = diagram.exportDiagram(options);
            done();
        });

    });
});