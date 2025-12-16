import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { DiagramScroller } from '../../../src/diagram/interaction/scroller';
import { Rect } from '../../../src/index';
import { PrintAndExport } from '../../../src/diagram/print-settings';
import { PageSettingsModel, BackgroundModel } from '../../../src/diagram/diagram/page-settings-model';
import { IExportOptions } from '../../../src/diagram/objects/interface/interfaces';
import { GroupableView, DataBinding, DiagramModel, HierarchicalTree, ImageElement, StackPanel, TextElement, TreeInfo, ZoomOptions } from '../../../src/diagram/index';
import { UndoRedo } from '../../../src/diagram/objects/undo-redo';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
import { DataManager, Query } from '@syncfusion/ej2-data';
Diagram.Inject(PrintAndExport, UndoRedo, DataBinding, HierarchicalTree);
/**
 * Print and Export Spec
 */
describe('Print and export', () => {

    describe('Print and Export Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};
        let options: IExportOptions = {};
        let svg: string | SVGElement;
        let data: SVGElement | string;
        let rect: Rect = new Rect();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram1' });
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
            diagram.appendTo('#diagram1');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });

        it('Export settings with bounds and margin - Download', (done: Function) => {
            options.mode = 'Data';
            options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            let rect: Rect = new Rect();
            rect.x = 5; rect.y = 5; rect.height = 500; rect.width = 500;
            options.bounds = rect;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export settings with default functions with margin as zero - Download', (done: Function) => {

            options.mode = 'Data';
            options.format = 'PNG';
            options.margin = { left: null, right: null, top: null, bottom: null };
            options.region = 'PageSettings';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings with default functions with bounds as zero - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.bounds = new Rect();
            options.region = 'PageSettings';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export settings with mode svg and format SVG - Download', (done: Function) => {
            options.mode = 'Data';

            options.format = 'SVG';
            diagram.mode = 'Canvas';
            options.region = 'PageSettings';
            options.margin = { left: 5, right: 5, top: 5, bottom: 5 };
            options.multiplePage = false;
            options.pageHeight = 300;
            options.pageWidth = 300;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings with mode Data and format SVG', (done: Function) => {
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            options.multiplePage = false;
            options.margin = { left: 5, top: 5, bottom: 5, right: 5 };
            options.pageHeight = 300;
            options.pageWidth = 300;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with mode PNG and multiple page false - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            diagram.mode = 'Canvas';
            diagram.dataBind();
            options.region = 'PageSettings';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'Content';
            options.multiplePage = true;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true with page height and page width - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true with page height and width as null - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.height = null;
            diagram.pageSettings.width = null;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page false with page height and page width - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.multiplePage = false;
            diagram.pageSettings.height = 300;
            diagram.pageSettings.width = 400;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page false with page height ,width as null- Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.multiplePage = false;
            diagram.pageSettings.height = null;
            diagram.pageSettings.width = null;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Fromat PNG and Multiple page true with page height,width(Landscape) - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageOrientation = 'Landscape';
            options.pageHeight = 300;
            options.pageWidth = 500;
            diagram.pageSettings = pageSettings;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Strectch - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.stretch = 'Stretch';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Meet - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.stretch = 'Meet';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Slice - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 500;
            options.pageWidth = 300;
            options.pageOrientation = 'Landscape';
            options.stretch = 'Slice';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and Multiple page true with Slice (Portrait) - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.stretch = 'Meet';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Print and Export Settings with Format PNG and Multiple page true with Slice (Portrait) - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.stretch = 'Meet';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export Settings with Fromat PNG and mode Data', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export Settings with Format PNG and mode Data with background image with color', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Meet';
            background.align = 'XMinYMin';
            background.color = 'grey';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });

        it('Export Settings with Format PNG and mode Data with background image with color,scale slice', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Slice';
            background.align = 'XMinYMin';
            background.color = 'grey';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and mode Data with background image with no color', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Meet';
            background.align = 'XMinYMin';
            background.color = 'none';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export Settings with Format PNG and mode Data with  image(Slice)', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            background.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            background.scale = 'Slice';
            background.align = 'None';
            diagram.pageSettings.background = background;
            diagram.dataBind();
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings with default functions - Default', (done: Function) => {
            options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            rect.x = 5; rect.y = 5; rect.height = 500; rect.width = 500;
            options.bounds = rect;
            options.region = 'PageSettings';
            options.mode = 'Data';
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings without Margin - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 300;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings without Margin - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            options.margin = { left: 5, right: 5, top: 5, bottom: 5 };
            options.fileName = 'export';
            options.multiplePage = true;
            options.pageHeight = 300;
            options.pageWidth = 300;
            svg = diagram.exportDiagram(options);
            expect(svg).not.toBeNull();
            done();
        });
        it('Export settings without Margin - Download', (done: Function) => {
            rect.x = null;
            rect.y = null;
            options.mode = 'Data';
            options.format = 'SVG';
            options.bounds = rect;
            options.region = 'PageSettings';
            options.fileName = 'export';
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
        it('Export settings with Stretch', (done: Function) => {
            rect.x = null;
            rect.y = null;
            options.mode = 'Data';
            options.bounds = rect;
            options.region = 'PageSettings';
            options.fileName = 'export';
            options.pageHeight = 500;
            options.pageWidth = 500;
            options.pageOrientation = 'Landscape';
            options.multiplePage = false;
            data = diagram.exportDiagram(options);
            expect(data).not.toBeNull();
            done();
        });
    });

    describe('Print and Export Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};
        let options: IExportOptions = {};
        let data: SVGElement | string;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram2' });
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
            diagram.appendTo('#diagram2');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });

        it('Export settings With diagram mode SVG and format SVG - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            data = diagram.exportDiagram(options);
            expect(data).not.toBeNull();
            done();
        });

        it('Print Settings with Fromat PNG and mode Data', (done: Function) => {
            options.multiplePage = true;
            options.pageHeight = 500;
            options.pageWidth = 300;
            options.pageOrientation = 'Landscape';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data', (done: Function) => {
            options.multiplePage = false;
            options.pageHeight = 300;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Width', (done: Function) => {
            options.multiplePage = true;
            options.pageWidth = 500;
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Height', (done: Function) => {
            options.multiplePage = true;
            options.pageHeight = 500;
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Width without Format', (done: Function) => {
            options.multiplePage = true;
            options.pageWidth = 500;
            options.format = 'SVG';
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Print Settings with mode Data with page Height without format', (done: Function) => {
            options.multiplePage = true;
            options.pageHeight = 500;
            options.format = 'SVG';
            options.pageOrientation = 'Portrait';
            options.region = 'PageSettings';
            diagram.print(options);
            done();
        });
        it('Exported data returns same png format for all other format', (done: Function) => {
            options.mode = 'Data';
            options.region = 'Content';
            options.fileName = 'export';
            options.format = 'JPG';
            let image: string | SVGElement = diagram.exportDiagram(options);
            expect(image).not.toBeNull();
            done();
        });
        it('Export settings With diagram mode Download and format JPG - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'JPG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            let data: any = diagram.exportDiagram(options);
            let imageData = data.substring(data.indexOf(":") + 1, data.indexOf(";"));
            let imageFormat = imageData.substring(imageData.indexOf("/") + 1);
            expect(imageFormat).toBe('jpeg');
            done();
        });
    });
    describe('Print and Export Settings', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};
        let options: IExportOptions = {};
        let data: SVGElement | string;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram3' });
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
            diagram.appendTo('#diagram3');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });

        it('No elements in diagram - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            options.fileName = 'export';
            data = diagram.exportDiagram(options);
            done();
        });

        it('Page Settings in diagram - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'SVG';
            options.region = 'PageSettings';
            diagram.pageSettings = pageSettings;
            options.fileName = 'export';
            data = diagram.exportDiagram(options);
            done();
        });

        it('Page Settings color as none in diagram - Download', (done: Function) => {
            options.mode = 'Data';
            options.format = 'PNG';
            options.region = 'PageSettings';
            diagram.pageSettings = pageSettings;
            diagram.pageSettings.background.color = 'none';
            options.fileName = 'export';
            data = diagram.exportDiagram(options);
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
    describe('tesing the native node export and print', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};
        let options: IExportOptions = {};
        let htmlData: string;
        let imBound: Rect;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
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
                id: 'nativenode', width: 150, height: 100, offsetX: 700, offsetY: 300, style: { fill: 'none' },
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>',
                }
            };
            background.color = 'yellow';
            pageSettings.multiplePage = true;
            pageSettings.background = background;
            pageSettings.height = 300; pageSettings.width = 300;
            pageSettings.orientation = 'Portrait';
            diagram = new Diagram({
                width: '1200px', height: '600px', nodes: [node, node2, node3], pageSettings: pageSettings
            } as DiagramModel);
            diagram.appendTo('#diagram4');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });

        it('export the diagram with native node', (done: Function) => {
            options.mode = 'Data';
            options.region = 'Content';
            options.fileName = 'export';
            options.format = 'PNG';
            htmlData = diagram.getDiagramContent();
            imBound = diagram.getDiagramBounds();
            let jsonResult: {} = { htmlData: { htmlData: htmlData, width: imBound.width } };

            let image: string = "data:image/png;base64,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…"
            diagram.exportImage(image, options);
            done();
        });

        it('export the diagram with native node which is zoomed and with in custombounds', (done: Function) => {
            options.mode = 'Data';
            options.region = 'CustomBounds';
            options.fileName = 'export';
            options.bounds = new Rect(100, 100, 100, 100);
            options.format = 'PNG';
            diagram.zoom(0.5);
            htmlData = diagram.getDiagramContent();
            imBound = diagram.getDiagramBounds();
            let jsonResult: {} = { htmlData: { htmlData: htmlData, width: imBound.width } };
            let image: string = "data:image/png;base64,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…"
            diagram.exportImage(image, options);
            done();
        });

        it('print the diagram with native node', (done: Function) => {
            options.mode = 'Data';
            options.region = 'Content';
            options.fileName = 'export';
            options.format = 'PNG';
            htmlData = diagram.getDiagramContent();
            imBound = diagram.getDiagramBounds();
            let jsonResult: {} = { htmlData: { htmlData: htmlData, width: imBound.width } };

            let image: string = "data:image/png;base64,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…"
            diagram.printImage(image, options);
            done();
        });
    });

    describe('tesing the native node export and print with multiple page', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let pageSettings: PageSettingsModel = {};
        let background: BackgroundModel = {};
        let options: IExportOptions = {};
        let htmlData: string;
        let imBound: Rect;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram5' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let node: NodeModel = {
                id: 'node1', width: 150, height: 100, offsetX: 0, offsetY: 0,
                annotations: [{ content: 'Node1', height: 50, width: 50 }]
            };
            let node2: NodeModel = {
                id: 'node2', width: 80, height: 130, offsetX: 200, offsetY: 200,
                annotations: [{ content: 'Node2', height: 50, width: 50 }]
            };
            let node3: NodeModel = {
                id: 'nativenode', width: 150, height: 100, offsetX: 700, offsetY: 300, style: { fill: 'none' },
                shape: {
                    type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>',
                }
            };
            background.color = 'yellow';
            pageSettings.multiplePage = true;
            pageSettings.background = background;
            pageSettings.height = 1000; pageSettings.width = 1000;
            pageSettings.orientation = 'Portrait';
            diagram = new Diagram({
                width: '600px', height: '600px', nodes: [node, node2, node3], pageSettings: pageSettings
            } as DiagramModel);
            diagram.appendTo('#diagram5');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });

        it('export the diagram with native node', (done: Function) => {
            options.mode = 'Data';
            options.region = 'Content';
            options.fileName = 'export';
            options.format = 'PNG';
            htmlData = diagram.getDiagramContent();
            imBound = diagram.getDiagramBounds();
            let jsonResult: {} = { htmlData: { htmlData: htmlData, width: imBound.width } };
            let image: string = "data:image/png;base64,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…"
            diagram.exportImage(image, options);
            done();
        });
    });

    describe('Gradient not applied for the node in export functionality', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        var options: IExportOptions = {};

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram6' });
            document.body.appendChild(ele);
            let connector: ConnectorModel = {
                id: 'connector1', sourcePoint: { x: 300, y: 400 }, targetPoint: { x: 500, y: 500 }
            };
            let nodes: any = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                    style: {
                        fill: 'red', opacity: 0.8, gradient: {
                            x1: 0, y1: 0, x2: 0, y2: 100, stops: [{ color: 'red', offset: 0 }, { color: 'blue', offset: 1 }],
                            type: 'Linear'
                        }
                    }
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 700,
                    style: {
                        fill: 'red', opacity: 0.8, gradient: {
                            x1: 0, y1: 0, x2: 0, y2: 100, stops: [{ color: 'red', offset: 0 }, { color: 'blue', offset: 1 }],
                            type: 'Linear'
                        }
                    }
                },
                {
                    id: 'nodesss2', width: 100, height: 100, offsetX: 400, offsetY: 100,
                    style: {
                        strokeColor: '#8f908f', fill: '#e2f3fa', gradient: {
                            cx: 50, cy: 50, fx: 50, fy: 50,
                            stops: [{ color: '#00555b', offset: 0 },
                            { color: '#37909A', offset: 90 }],
                            type: 'Radial'
                        }
                    }
                }
            ]
            diagram = new Diagram({
                width: '100%', height: '600px', nodes: nodes,
                mode: 'SVG',

                pageSettings: { width: 500, height: 200 }
            });
            diagram.appendTo('#diagram6');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });
    });

    describe('tesing the native node export and print with multiple page', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram7' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: "node1",
                    height: 100,
                    width: 100,
                    offsetX: 100,
                    offsetY: 100,
                    shape: {
                        type: "HTML",
                        content:
                            '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> New-Button</button></div>'
                    }
                },
                {
                    id: "node2",
                    height: 100,
                    width: 100,
                    offsetX: 300,
                    offsetY: 100,
                    shape: {
                        type: "HTML",
                        content:
                            '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> SVG</button></div>'
                    }
                },
                {
                    id: "node3",
                    height: 100,
                    width: 100,
                    offsetX: 500,
                    offsetY: 100,
                    shape: {
                        type: "Native",
                        content:
                            '<g xmlns="http://www.w3.org/2000/svg">' +
                            '<rect height="256" width="256" fill="#34353F"/>' +
                            '<path id="path1" transform="rotate(0,128,128) translate(59,61.2230899333954) scale(4.3125,4.3125)  " fill="#FFFFFF" d="M18.88501,23.042998L26.804993,23.042998 26.804993,30.969001 18.88501,30.969001z M9.4360352,23.042998L17.358032,23.042998 17.358032,30.969001 9.4360352,30.969001z M0.014038086,23.042998L7.9360352,23.042998 7.9360352,30.969001 0.014038086,30.969001z M18.871033,13.609001L26.791016,13.609001 26.791016,21.535994 18.871033,21.535994z M9.4219971,13.609001L17.342041,13.609001 17.342041,21.535994 9.4219971,21.535994z M0,13.609001L7.9219971,13.609001 7.9219971,21.535994 0,21.535994z M9.4219971,4.1859968L17.342041,4.1859968 17.342041,12.113998 9.4219971,12.113998z M0,4.1859968L7.9219971,4.1859968 7.9219971,12.113998 0,12.113998z M25.846008,0L32,5.2310026 26.773987,11.382995 20.619019,6.155998z"/>' +
                            "</g>"
                    }
                }
            ];
            diagram = new Diagram({
                width: '100%', height: '700px', nodes: nodes
            } as DiagramModel);
            diagram.appendTo('#diagram7');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });

        it('export the diagram with native node', (done: Function) => {
            let htmlData: string = diagram.getDiagramContent();
            done();
        });
    });
    describe('884801-After zooming and exporting the HTML content, the scroll Padding value is not Considered', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let data: object[] = [
            {
                'Id': 'parent', 'Name': 'Maria Anders', 'Designation': 'Managing Director',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true', 'RatingColor': '#C34444'
            },
            {
                'Id': 1, 'Name': 'Ana Trujillo', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
            },
            {
                'Id': 2, 'Name': 'Anto Moreno', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 1
            },
            {
                'Id': 3, 'Name': 'Thomas Hardy', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 2
            },
            {
                'Id': 4, 'Name': 'Christina kaff', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 3
            },
            {
                'Id': 5, 'Name': 'Hanna Moos', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'true',
                'RatingColor': '#D46E89', 'ReportingPerson': 4
            },
            {
                'Id': 6, 'Name': 'Peter Citeaux', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 4
            },
            {
                'Id': 7, 'Name': 'Martín Kloss', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 1
            },
            {
                'Id': 9, 'Name': 'Elizabeth Mary', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 8
            },
            {
                'Id': 10, 'Name': 'Victoria Ash', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 8
            },
            {
                'Id': 12, 'Name': 'Francisco Yang', 'Designation': 'CSR',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 7
            },
            {
                'Id': 13, 'Name': 'Yang Wang', 'Designation': 'CSR',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 6
            },
            {
                'Id': 27, 'Name': 'Lino Rodri', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Robin.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
            },
            {
                'Id': 38, 'Name': 'Philip Cramer', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Robin.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
            },
            {
                'Id': 14, 'Name': 'Pedro Afonso', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Paul.png', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 'parent'
            },
            {
                'Id': 15, 'Name': 'Elizabeth Roel', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Maria.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 38
            },
            {
                'Id': 17, 'Name': 'Janine Labrune', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 48
            },
            {
                'Id': 18, 'Name': 'Ann Devon', 'Designation': 'CSR',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 31
            },
            {
                'Id': 19, 'Name': 'Roland Mendel', 'Designation': 'CSR',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 31
            },
            {
                'Id': 20, 'Name': 'Aria Cruz', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 14
            },
            {
                'Id': 22, 'Name': 'Martine Rancé', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 21
            },
            {
                'Id': 23, 'Name': 'Maria Larsson', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'false',
                'RatingColor': '#EBB92E', 'ReportingPerson': 20
            },
            {
                'Id': 21, 'Name': 'Diego Roel', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
                'RatingColor': '#D46E89', 'ReportingPerson': 20
            },
            {
                'Id': 24, 'Name': 'Peter Franken', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 23
            },
            {
                'Id': 25, 'Name': 'Carine Schmitt', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 21
            },
            {
                'Id': 26, 'Name': 'Paolo Accorti', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 21
            },
            {
                'Id': 28, 'Name': 'Eduardo Roel', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'true',
                'RatingColor': '#93B85A', 'ReportingPerson': 38
            },
            {
                'Id': 29, 'Name': 'José Pedro ', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
                'RatingColor': '#D46E89', 'ReportingPerson': 28
            },
            {
                'Id': 30, 'Name': 'André Fonseca', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/John.png', 'IsExpand': 'true',
                'RatingColor': '#EBB92E', 'ReportingPerson': 29
            },
            {
                'Id': 31, 'Name': 'Howard Snyd', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 14
            },
            {
                'Id': 32, 'Name': 'Manu Pereira', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image56.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 8
            },
            {
                'Id': 33, 'Name': 'Mario Pontes', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 19
            },
            {
                'Id': 34, 'Name': 'Carlos Schmitt', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 19
            },
            {
                'Id': 35, 'Name': 'Yoshi Latimer', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/eric.png', 'IsExpand': 'true',
                'RatingColor': '#D46E89', 'ReportingPerson': 18
            },
            {
                'Id': 36, 'Name': 'Patricia Kenna', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/Maria.png', 'IsExpand': 'true',
                'RatingColor': '#EBB92E', 'ReportingPerson': 55
            },
            {
                'Id': 37, 'Name': 'Helen Bennett', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 15
            },
            {
                'Id': 39, 'Name': 'Daniel Tonini', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
                'RatingColor': '#93B85A', 'ReportingPerson': 27
            },
            {
                'Id': 40, 'Name': 'Annette Roel', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 39
            },
            {
                'Id': 41, 'Name': 'Yoshi Wilson', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
                'RatingColor': '#EBB92E', 'ReportingPerson': 40
            },
            {
                'Id': 42, 'Name': 'John Steel', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Maria.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 41
            },
            {
                'Id': 43, 'Name': 'Renate Jose', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 42
            },
            {
                'Id': 44, 'Name': 'Jaime Yorres', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 42
            },
            {
                'Id': 45, 'Name': 'Carlos Nagy', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 40
            },
            {
                'Id': 46, 'Name': 'Felipe Kloss', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'false',
                'RatingColor': '#EBB92E', 'ReportingPerson': 17
            },
            {
                'Id': 47, 'Name': 'Fran Wilson', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 46
            },
            {
                'Id': 48, 'Name': 'John Rovelli', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 46
            },
            {
                'Id': 49, 'Name': 'Catherine Kaff', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 51
            },
            {
                'Id': 50, 'Name': 'Jean Fresnière', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
                'RatingColor': '#D46E89', 'ReportingPerson': 49
            },
            {
                'Id': 51, 'Name': 'Alex Feuer', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 50
            },
            {
                'Id': 52, 'Name': 'Simon Roel', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 50
            },
            {
                'Id': 53, 'Name': 'Yvonne Wong', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 50
            },
            {
                'Id': 54, 'Name': 'Rene Phillips', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 7
            },
            {
                'Id': 55, 'Name': 'Yoshi Kenna', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
                'RatingColor': '#EBB92E', 'ReportingPerson': 15
            },
            {
                'Id': 56, 'Name': 'Helen Marie', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'true',
                'RatingColor': '#EBB92E', 'ReportingPerson': 55
            },
            {
                'Id': 57, 'Name': 'Joseph Kaff', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 7
            },
            {
                'Id': 58, 'Name': 'Georg Pipps', 'Designation': 'SR',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 5
            },
            {
                'Id': 60, 'Name': 'Nardo Batista', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Maria.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 59
            },
            {
                'Id': 61, 'Name': 'Lúcia Carvalho', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Robin.PNG', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 60
            },
            {
                'Id': 62, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Clayton.PNG', 'IsExpand': 'None',
                'RatingColor': '#68C2DE', 'ReportingPerson': 74
            },
            {
                'Id': 63, 'Name': 'Sergio roel', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image55.PNG', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 61
            },
            {
                'Id': 64, 'Name': 'Paula Wilson', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/eric.PNG', 'IsExpand': 'None',
                'RatingColor': '#68C2DE', 'ReportingPerson': 7
            },
            {
                'Id': 65, 'Name': 'Mauri Moroni', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.PNG', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 6
            },
            {
                'Id': 66, 'Name': 'Janete Limeira', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image51.PNG', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 7
            },
            {
                'Id': 67, 'Name': 'Michael Holz', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 59
            },
            {
                'Id': 68, 'Name': 'Alej Camino', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.PNG', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 67
            },
            {
                'Id': 69, 'Name': 'Jonas Bergsen', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.PNG', 'IsExpand': 'None',
                'RatingColor': '#68C2DE', 'ReportingPerson': 19
            },
            {
                'Id': 70, 'Name': 'Jose Pavarotti', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Maria.PNG', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 56
            },
            {
                'Id': 71, 'Name': 'Miguel Angel', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/eric.PNG', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 16
            },
            {
                'Id': 72, 'Name': 'Jytte Petersen', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/image55.PNG', 'IsExpand': 'true',
                'RatingColor': '#68C2DE', 'ReportingPerson': 59
            },
            {
                'Id': 73, 'Name': 'Kloss Perrier', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 23
            },
            {
                'Id': 74, 'Name': 'Art Nancy', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
                'RatingColor': '#D46E89', 'ReportingPerson': 29
            },
            {
                'Id': 75, 'Name': 'Pascal Cartrain', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/John.png', 'IsExpand': 'true',
                'RatingColor': '#EBB92E', 'ReportingPerson': 36
            },
            {
                'Id': 76, 'Name': 'Liz Nixon', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 72
            },
            {
                'Id': 77, 'Name': 'Liu Wong', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 75
            },
            {
                'Id': 78, 'Name': 'Karin Josephs', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 76
            },
            {
                'Id': 79, 'Name': 'Ruby Anabela ', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 23
            },
            {
                'Id': 80, 'Name': 'Helvetis Nagy', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 75
            },
            {
                'Id': 81, 'Name': 'Palle Ibsen', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 35
            },
            {
                'Id': 82, 'Name': 'Mary Saveley', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'false',
                'RatingColor': '#93B85A', 'ReportingPerson': 59
            },
            {
                'Id': 83, 'Name': 'Paul Henriot', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'false',
                'RatingColor': '#D46E89', 'ReportingPerson': 30
            },
            {
                'Id': 84, 'Name': 'Rita Müller', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Paul.png', 'IsExpand': 'None',
                'RatingColor': '#68C2DE', 'ReportingPerson': 83
            },
            {
                'Id': 85, 'Name': 'Pirkko King', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 83
            },
            {
                'Id': 86, 'Name': 'Paula Parente', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/John.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 74
            },
            {
                'Id': 87, 'Name': 'Karl Jablonski', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 23
            },
            {
                'Id': 88, 'Name': 'Matti Kenna', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 23
            },
            {
                'Id': 89, 'Name': 'Zbyszek Yang', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 23
            },
            {
                'Id': 90, 'Name': 'Nancy', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image56.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 23
            },
            {
                'Id': 91, 'Name': 'Robert King', 'Designation': 'Project Manager',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'true',
                'RatingColor': '#D46E89', 'ReportingPerson': 59
            },
            {
                'Id': 92, 'Name': 'Laura Callahan', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Robin.png', 'IsExpand': 'false',
                'RatingColor': '#D46E89', 'ReportingPerson': 91
            },
            {
                'Id': 93, 'Name': 'Anne', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 92
            },
            {
                'Id': 94, 'Name': 'Georg Pipps', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 5
            },
            {
                'Id': 95, 'Name': 'Isabel Castro', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 93
            },
            {
                'Id': 96, 'Name': 'Nardo Batista', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
                'RatingColor': '#EBB92E', 'ReportingPerson': 93
            },
            {
                'Id': 97, 'Name': 'Rene Phillips', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'false',
                'RatingColor': '#68C2DE', 'ReportingPerson': 92
            },
            {
                'Id': 98, 'Name': 'Lúcia Carvalho', 'Designation': 'S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 97
            },
            {
                'Id': 99, 'Name': 'Horst Kloss', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Paul.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 56
            },
            {
                'Id': 101, 'Name': 'Simon Roel', 'Designation': 'Project Lead',
                'ImageUrl': '../content/images/orgchart/Clayton.png', 'IsExpand': 'true',
                'RatingColor': '#93B85A', 'ReportingPerson': 91
            },
            {
                'Id': 102, 'Name': 'Rita Pfalzheim', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/Thomas.png', 'IsExpand': 'false',
                'RatingColor': '#D46E89', 'ReportingPerson': 101
            },
            {
                'Id': 103, 'Name': 'Paula Wilson', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/Jenny.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 750
            },
            {
                'Id': 104, 'Name': ' Jose Michael', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/eric.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 102
            },
            {
                'Id': 105, 'Name': 'Mauri Moroni', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image55.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 35
            },
            {
                'Id': 106, 'Name': 'Janete Limeira', 'Designation': 'Senior S/w Engg',
                'ImageUrl': '../content/images/orgchart/image57.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 35
            },
            {
                'Id': 107, 'Name': 'Michael Holz', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image53.png', 'IsExpand': 'None',
                'RatingColor': '#D46E89', 'ReportingPerson': 35
            },
            {
                'Id': 108, 'Name': 'Alej Camino', 'Designation': 'Project Trainee',
                'ImageUrl': '../content/images/orgchart/image51.png', 'IsExpand': 'None',
                'RatingColor': '#93B85A', 'ReportingPerson': 35
            },
        ];
        let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram8' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '1250px', height: '590px',
                snapSettings: { constraints: 0 },
                scrollSettings: {
                    padding: { left: 150, right: 150, top: 150, bottom: 150 }
                },
                layout: {
                    type: 'OrganizationalChart', margin: { top: 20 },
                    getLayoutInfo: (node: NodeModel, tree: TreeInfo) => {
                        if (!tree.hasSubTree) {
                            tree.orientation = 'Vertical';
                            tree.type = 'Alternate';
                        }
                    }
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataSource: items
                },

                getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                    obj.height = 50;
                    obj.backgroundColor = 'lightgrey';
                    obj.style = { fill: 'transparent', strokeWidth: 2 };
                    return obj;
                },
                getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    return connector;
                },

                setNodeTemplate: (obj: NodeModel, diagram: Diagram): GroupableView => {
                    let content: StackPanel = new StackPanel();
                    content.id = obj.id + '_outerstack';
                    content.style.strokeColor = 'darkgreen';
                    content.orientation = 'Horizontal';
                    content.padding = { left: 5, right: 10, top: 5, bottom: 5 };
                    let image: ImageElement = new ImageElement();
                    image.width = 50;
                    image.height = 50;
                    image.style.strokeColor = 'none';
                    image.id = obj.id + '_pic';
                    let innerStack: StackPanel = new StackPanel();
                    innerStack.style.strokeColor = 'none';
                    innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
                    innerStack.id = obj.id + '_innerstack';

                    let text: TextElement = new TextElement();
                    text.content = obj.data['Name'];

                    text.style.color = 'blue';
                    text.style.strokeColor = 'none';
                    text.style.fill = 'none';
                    text.id = obj.id + '_text1';

                    let desigText: TextElement = new TextElement();
                    desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
                    desigText.content = obj.data['Designation'];
                    desigText.style.color = 'blue';
                    desigText.style.strokeColor = 'none';
                    desigText.style.fill = 'none';
                    desigText.style.textWrapping = 'Wrap';
                    desigText.id = obj.id + '_desig';
                    innerStack.children = [text, desigText];

                    content.children = [image, innerStack];

                    return content;
                }
            } as DiagramModel);
            diagram.appendTo('#diagram8');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });
        it('export the diagram check the padding attached', (done: Function) => {
            let zoomin: ZoomOptions = { type: 'ZoomIn', zoomFactor: 0.2 };
            diagram.zoomTo(zoomin);
            const htmlData: string = diagram.getDiagramContent();
            const parser: DOMParser = new DOMParser();
            const doc: Document = parser.parseFromString(htmlData, 'text/html');
            const diargamSvgLayer: HTMLElement = doc.getElementById('diagram_diagramLayer_svg');
            if (diargamSvgLayer) {
                const diagramHeight = Number(diargamSvgLayer.getAttribute('height'));
                expect(diagramHeight === 960).toBe(true);
            }
            done();
        });
    });


    describe('Code coverage fixing', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let exportOptions: IExportOptions = {};

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramCode' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: "node1",
                    height: 100,
                    width: 100,
                    offsetX: 100,
                    offsetY: 100,
                },
                {
                    id: "node2",
                    height: 100,
                    width: 100,
                    offsetX: 300,
                    offsetY: 100,
                },
                {
                    id: "node3",
                    height: 100,
                    width: 100,
                    offsetX: 500,
                    offsetY: 100,
                }
            ];
            diagram = new Diagram({
                width: '100%', height: '700px', nodes: nodes
            } as DiagramModel);
            diagram.appendTo('#diagramCode');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });
        it('Exporting node in SVG format', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.format = 'SVG';
            let data = diagram.exportDiagram(exportOptions);
            expect(data).toBe(null);
            done();
        });
        it('Exporting node in SVG format without region', (done: Function) => {
            exportOptions.format = 'SVG';
            let data = diagram.exportDiagram(exportOptions);
            expect(data).toBe(null);
            done();
        });
        it('Exporting node with BMP format', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.format = 'BMP';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            expect(data !== null).toBe(true);
            done();
        });
        it('Exporting node with JPG format', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.format = 'JPG';
            exportOptions.mode = 'Download';
            let data = diagram.exportDiagram(exportOptions);
            expect(data === null).toBe(true);
            done();
        });
        it('Exporting image with base64', (done: Function) => {
            let base64 = 'data:image/png;base64,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';
            exportOptions.mode = 'Download';
            exportOptions.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            exportOptions.bounds = new Rect(NaN, NaN, NaN, NaN);
            let data = diagram.exportImage(base64, exportOptions);
            expect(data === undefined).toBe(true);
            done();
        });
        it('Exporting nodes with pageHeight and pageWidth', (done: Function) => {
            exportOptions.mode = 'Download';
            exportOptions.multiplePage = true;
            exportOptions.pageHeight = 500;
            exportOptions.pageWidth = 500;
            let data = diagram.exportDiagram(exportOptions);
            expect(data === null).toBe(true);
            done();
        });
        it('Exporting nodes with margin', (done: Function) => {
            exportOptions.mode = 'Download';
            exportOptions.multiplePage = false;
            exportOptions.margin = { left: 10, right: 10, top: 10, bottom: 10 };
            let data = diagram.exportDiagram(exportOptions);
            expect(data === null).toBe(true);
            done();
        });
        it('Exporting node without setting format with multiple page', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.multiplePage = true;
            exportOptions.pageOrientation = 'Landscape';
            let data = diagram.exportDiagram(exportOptions);
            expect(data).toBe(null);
            done();
        });
        it('Zoom diagram without setting zoom factor', (done: Function) => {
            let zoomOption = { type: 'ZoomOut' };
            diagram.zoomTo(zoomOption as ZoomOptions);
            expect(diagram.scrollSettings.currentZoom !== 1).toBe(true);
            done();
        });
        it('Nudging connector', (done: Function) => {
            let connector: ConnectorModel = { type: 'Straight', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 } };
            diagram.add(connector);
            diagram.select([diagram.connectors[0]]);
            diagram.nudge('Down');
            expect(diagram.connectors[0].sourcePoint.y !== 100).toBe(true);
            done();
        });
    });
    describe('898304 - exportImage function export images only in "PNG" format', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let exportOptions: IExportOptions = {};

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramExportImage' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: "node1",
                    height: 100,
                    width: 100,
                    offsetX: 100,
                    offsetY: 100,
                },
                {
                    id: "node2",
                    height: 100,
                    width: 100,
                    offsetX: 300,
                    offsetY: 100,
                },
                {
                    id: "node3",
                    height: 100,
                    width: 100,
                    offsetX: 500,
                    offsetY: 100,
                }
            ];
            diagram = new Diagram({
                width: '100%', height: '700px', nodes: nodes
            } as DiagramModel);
            diagram.appendTo('#diagramExportImage');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
            (diagram as any) = null; (ele as any) = null; 
        });
        it('Exporting node in SVG format', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.format = 'SVG';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "SVG",
                mode: 'Download',
                region: 'Content'
            });
            expect(data !== null).toBe(true);
            done();
        });
        it('Exporting node in JPG format', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.format = 'JPG';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "JPG",
                mode: 'Download',
                region: 'Content'
            });
            expect(data !== null).toBe(true);
            done();
        });
        it('Exporting node with PNG format', (done: Function) => {
            exportOptions.region = 'Content';
            exportOptions.format = 'PNG';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "PNG",
                mode: 'Download',
                region: 'Content'
            });
            expect(data !== null).toBe(true);
            done();
        });

    });

    describe('990395 - Exported diagram image includes excessive blank space and misaligned content', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramExportImageContent45' });
            document.body.appendChild(ele);
            let data: object[] = [
                {
                    "Id": "parent", "Name": "Maria Anders", "Designation": "Managing Director",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image30.png", "IsExpand": "true", "RatingColor": "#C34444"
                },
                {
                    "Id": 1, "Name": "Ana Trujillo", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image2.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": "parent"
                },
                {
                    "Id": 2, "Name": "Anto Moreno", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image1.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 1
                },
                {
                    "Id": 3, "Name": "Thomas Hardy", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image3.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": 2
                },
                {
                    "Id": 4, "Name": "Christina kaff", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image4.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 3
                },
                {
                    "Id": 5, "Name": "Hanna Moos", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image6.png", "IsExpand": "true",
                    "RatingColor": "#D46E89", "ReportingPerson": 4
                },
                {
                    "Id": 6, "Name": "Peter Citeaux", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image5.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 5
                },
                {
                    "Id": 7, "Name": "Martín Kloss", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image18.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 6
                },
                {
                    "Id": 8, "Name": "Elizabeth Mary", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image7.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 6
                },
                {
                    "Id": 9, "Name": "Victoria Ash", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image8.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 5
                },
                {
                    "Id": 10, "Name": "Francisco Yang", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image19.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 3
                },
                {
                    "Id": 11, "Name": "Yang Wang", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image21.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": "parent"
                },
                {
                    "Id": 12, "Name": "Lino Rodri", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image9.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 11
                },
                {
                    "Id": 13, "Name": "Philip Cramer", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image23.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 24
                },
                {
                    "Id": 14, "Name": "Pedro Afonso", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image10.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 15
                },
                {
                    "Id": 15, "Name": "Elizabeth Roel", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image11.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 13
                },
                {
                    "Id": 16, "Name": "Janine Labrune", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image12.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 12
                },
                {
                    "Id": 17, "Name": "Ann Devon", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image13.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": 25
                },
                {
                    "Id": 18, "Name": "Roland Mendel", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image24.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 17
                },
                {
                    "Id": 19, "Name": "Aria Cruz", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image14.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 18
                },
                {
                    "Id": 20, "Name": "Martine Rancé", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image26.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 18
                },
                {
                    "Id": 21, "Name": "Maria Larsson", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image15.png", "IsExpand": "false",
                    "RatingColor": "#EBB92E", "ReportingPerson": 19
                },
                {
                    "Id": 22, "Name": "Diego Roel", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image17.png", "IsExpand": "false",
                    "RatingColor": "#D46E89", "ReportingPerson": 21
                },
                {
                    "Id": 23, "Name": "Peter Franken", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image27.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 21
                },
                {
                    "Id": 24, "Name": "Howard Snyder", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image20.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 16
                },
                {
                    "Id": 25, "Name": "Carine Schmitt", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image22.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": "parent"
                },
                {
                    "Id": 26, "Name": "Paolo Accorti", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image28.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 36
                },
                {
                    "Id": 27, "Name": "Eduardo Roel", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image31.png", "IsExpand": "true",
                    "RatingColor": "#93B85A", "ReportingPerson": 26
                },
                {
                    "Id": 28, "Name": "José Pedro ", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image25.png", "IsExpand": "true",
                    "RatingColor": "#D46E89", "ReportingPerson": 27
                },
                {
                    "Id": 29, "Name": "André Fonseca", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image32.png", "IsExpand": "true",
                    "RatingColor": "#EBB92E", "ReportingPerson": 28
                },
                {
                    "Id": 30, "Name": "Howard Snyd", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image33.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": 29
                },
                {
                    "Id": 31, "Name": "Manu Pereira", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image34.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 29
                },
                {
                    "Id": 32, "Name": "Mario Pontes", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image29.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 29
                },
                {
                    "Id": 33, "Name": "Carlos Schmitt", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image30.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 29
                },
                {
                    "Id": 34, "Name": "Yoshi Latimer", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image4.png", "IsExpand": "true",
                    "RatingColor": "#D46E89", "ReportingPerson": 29
                },
                {
                    "Id": 35, "Name": "Patricia Kenna", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image6.png", "IsExpand": "true",
                    "RatingColor": "#EBB92E", "ReportingPerson": 29
                },
                {
                    "Id": 36, "Name": "Helen Bennett", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image7.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 25
                },
                {
                    "Id": 37, "Name": "Daniel Tonini", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image1.png", "IsExpand": "true",
                    "RatingColor": "#93B85A", "ReportingPerson": "parent"
                },
                {
                    "Id": 38, "Name": "Annette Roel", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image2.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 37
                },
                {
                    "Id": 39, "Name": "Yoshi Wilson", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image8.png", "IsExpand": "false",
                    "RatingColor": "#EBB92E", "ReportingPerson": 38
                },
                {
                    "Id": 40, "Name": "John Steel", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image3.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 38
                },
                {
                    "Id": 41, "Name": "Renate Jose", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image9.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 40
                },
                {
                    "Id": 42, "Name": "Jaime Yorres", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image10.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 41
                },
                {
                    "Id": 43, "Name": "Carlos Nagy", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image5.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 42
                },
                {
                    "Id": 44, "Name": "Felipe Kloss", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image16.png", "IsExpand": "false",
                    "RatingColor": "#EBB92E", "ReportingPerson": 43
                },
                {
                    "Id": 45, "Name": "Fran Wilson", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image18.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 43
                },
                {
                    "Id": 46, "Name": "John Rovelli", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image19.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 43
                },
                {
                    "Id": 47, "Name": "Catherine Kaff", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image11.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 43
                },
                {
                    "Id": 48, "Name": "Jean Fresnière", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image21.png", "IsExpand": "false",
                    "RatingColor": "#D46E89", "ReportingPerson": 43
                },
                {
                    "Id": 49, "Name": "Alex Feuer", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image23.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 43
                },
                {
                    "Id": 50, "Name": "Simon Roel", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image24.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": 42
                },
                {
                    "Id": 51, "Name": "Yvonne Wong", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image12.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 52
                },
                {
                    "Id": 52, "Name": "Rene Phillips", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image25.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 39
                },
                {
                    "Id": 53, "Name": "Yoshi Kenna", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image14.png", "IsExpand": "false",
                    "RatingColor": "#EBB92E", "ReportingPerson": 52
                },
                {
                    "Id": 54, "Name": "Helen Marie", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image15.png", "IsExpand": "true",
                    "RatingColor": "#EBB92E", "ReportingPerson": 52
                },
                {
                    "Id": 55, "Name": "Joseph Kaff", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image26.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": 52
                },
                {
                    "Id": 56, "Name": "Georg Pipps", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image27.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": 57
                },
                {
                    "Id": 57, "Name": "Nardo Batista", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image17.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 12
                },
                {
                    "Id": 58, "Name": "Lúcia Carvalho", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image20.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 57
                },
                {
                    "Id": 59, "Name": "Horst Kloss", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image28.png", "IsExpand": "None",
                    "RatingColor": "#68C2DE", "ReportingPerson": 57
                },
                {
                    "Id": 60, "Name": "Sergio roel", "Designation": "CSR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image22.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": 57
                },
                {
                    "Id": 61, "Name": "Paula Wilson", "Designation": "CSR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image31.png", "IsExpand": "None",
                    "RatingColor": "#68C2DE", "ReportingPerson": 57
                },
                {
                    "Id": 62, "Name": "Mauri Moroni", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image25.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 57
                },
                {
                    "Id": 63, "Name": "Janete Limeira", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image29.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 57
                },
                {
                    "Id": 64, "Name": "Michael Holz", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image32.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 57
                },
                {
                    "Id": 65, "Name": "Alej Camino", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image33.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": "parent"
                },
                {
                    "Id": 66, "Name": "Jonas Bergsen", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image34.png", "IsExpand": "None",
                    "RatingColor": "#68C2DE", "ReportingPerson": 65
                },
                {
                    "Id": 67, "Name": "Jose Pavarotti", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image30.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 68
                },
                {
                    "Id": 68, "Name": "Miguel Angel", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image4.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 66
                },
                {
                    "Id": 69, "Name": "Jytte Petersen", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image1.png", "IsExpand": "true",
                    "RatingColor": "#68C2DE", "ReportingPerson": 68
                },
                {
                    "Id": 70, "Name": "Kloss Perrier", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image2.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 72
                },
                {
                    "Id": 71, "Name": "Art Nancy", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image6.png", "IsExpand": "true",
                    "RatingColor": "#D46E89", "ReportingPerson": 27
                },
                {
                    "Id": 72, "Name": "Pascal Cartrain", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image3.png", "IsExpand": "true",
                    "RatingColor": "#EBB92E", "ReportingPerson": 65
                },
                {
                    "Id": 73, "Name": "Liz Nixon", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image7.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": 68
                },
                {
                    "Id": 74, "Name": "Liu Wong", "Designation": "Project Manager",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image8.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": "parent"
                },
                {
                    "Id": 75, "Name": "Karin Josephs", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image9.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 74
                },
                {
                    "Id": 76, "Name": "Ruby Anabela ", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image10.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 75
                },
                {
                    "Id": 77, "Name": "Helvetis Nagy", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image11.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 82
                },
                {
                    "Id": 78, "Name": "Palle Ibsen", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image5.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 76
                },
                {
                    "Id": 79, "Name": "Mary Saveley", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image12.png", "IsExpand": "false",
                    "RatingColor": "#93B85A", "ReportingPerson": 82
                },
                {
                    "Id": 80, "Name": "Paul Henriot", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image16.png", "IsExpand": "false",
                    "RatingColor": "#D46E89", "ReportingPerson": 79
                },
                {
                    "Id": 81, "Name": "Rita Müller", "Designation": "SR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image13.png", "IsExpand": "None",
                    "RatingColor": "#68C2DE", "ReportingPerson": 79
                },
                {
                    "Id": 82, "Name": "Pirkko King", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image18.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 78
                },
                {
                    "Id": 83, "Name": "Paula Parente", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image19.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": 75
                },
                {
                    "Id": 84, "Name": "Karl Jablonski", "Designation": "S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image14.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 83
                },
                {
                    "Id": 85, "Name": "Matti Kenna", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image15.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 84
                },
                {
                    "Id": 86, "Name": "Zbyszek Yang", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image21.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 84
                },
                {
                    "Id": 87, "Name": "Nancy", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image17.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 74
                },
                {
                    "Id": 88, "Name": "Robert King", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image23.png", "IsExpand": "true",
                    "RatingColor": "#D46E89", "ReportingPerson": 85
                },
                {
                    "Id": 89, "Name": "Laura Callahan", "Designation": "CSR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image20.png", "IsExpand": "false",
                    "RatingColor": "#D46E89", "ReportingPerson": 88
                },
                {
                    "Id": 90, "Name": "Anne", "Designation": "CSR",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image24.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": 86
                },
                {
                    "Id": 91, "Name": "Georg Pipps", "Designation": "Senior S/w Engg",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image26.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": "parent"
                },
                {
                    "Id": 92, "Name": "Isabel Castro", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image27.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 89
                },
                {
                    "Id": 93, "Name": "Nardo Batista", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image28.png", "IsExpand": "None",
                    "RatingColor": "#EBB92E", "ReportingPerson": 88
                },
                {
                    "Id": 94, "Name": "Rene Phillips", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image22.png", "IsExpand": "false",
                    "RatingColor": "#68C2DE", "ReportingPerson": 89
                },
                {
                    "Id": 95, "Name": "Lúcia Carvalho", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image25.png", "IsExpand": "None",
                    "RatingColor": "#93B85A", "ReportingPerson": 89
                },
                {
                    "Id": 96, "Name": "Horst Kloss", "Designation": "Project Trainee",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image29.png", "IsExpand": "None",
                    "RatingColor": "#D46E89", "ReportingPerson": 89
                },
                {
                    "Id": 97, "Name": "Simon Roel", "Designation": "Project Lead",
                    "ImageUrl": "//ej2.syncfusion.com/demos/src/diagram/employees/image28.png", "IsExpand": "true",
                    "RatingColor": "#93B85A", "ReportingPerson": 89
                }
            ];
            let items: DataManager = new DataManager(data as JSON[], new Query().take(7));
            diagram = new Diagram({
                width: '100%', height: '980px',
                rulerSettings: { showRulers: true },
                pageSettings: {
                    width: 5000, height: 5000,
                    multiplePage: true,

                },
                layout: {
                    type: 'OrganizationalChart', margin: { top: 20 },
                    getLayoutInfo: (node: NodeModel, tree: TreeInfo) => {
                        if (!tree.hasSubTree) {
                            tree.orientation = 'Vertical';
                            tree.type = 'Right';
                        }
                    }
                },
                dataSourceSettings: {
                    id: 'Id', parentId: 'ReportingPerson', dataManager: items
                },

                getNodeDefaults: (node: NodeModel, diagram: Diagram) => {
                    node.height = 50;
                    node.width = 100;
                    node.annotations = [{ content: (node.data as any).Name }]
                    node.style = { fill: (node.data as any).RatingColor, strokeWidth: 2 };
                    return node;
                },
                getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                    connector.targetDecorator.shape = 'None';
                    connector.type = 'Orthogonal';
                    connector.style.strokeColor = 'gray';
                    return connector;
                },
            } as DiagramModel);
            diagram.appendTo('#diagramExportImageContent45');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Exporting diagram with export region as PageSettings and multiplePage as true with pageHeight, pageWidth ', (done: Function) => {
            let exportOptions: IExportOptions = {};
            exportOptions.region = 'PageSettings';
            exportOptions.multiplePage = true;
            exportOptions.format = 'PNG';
            exportOptions.mode = 'Data';
            exportOptions.pageHeight = 1500;
            exportOptions.pageWidth = 500;
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "PNG",
                mode: 'Download',
                region: 'PageSettings',
                multiplePage: true,
                pageWidth: 1500,
                pageHeight: 500,
            });
            expect(data !== null).toBe(true);
            done();
        });
        it('Exporting diagram with export region as PageSettings and multiplePage as true ', (done: Function) => {
            let exportOptions: IExportOptions = {};
            exportOptions.region = 'PageSettings';
            exportOptions.multiplePage = true;
            exportOptions.format = 'PNG';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "PNG",
                mode: 'Download',
                region: 'PageSettings',
                multiplePage: true,

            });
            expect(data !== null).toBe(true);
            done();
        });
        it('Exporting diagram with export region as Content and multiplePage as true', (done: Function) => {
            let exportOptions: IExportOptions = {};
            exportOptions.region = 'Content';
            exportOptions.multiplePage = true;
            exportOptions.format = 'PNG';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "PNG",
                mode: 'Download',
                region: 'Content',
                multiplePage: true
            });
            expect(data !== null).toBe(true);
            done();
        });
        it('Exporting diagram with export region as Content and without enabling multiplePage', (done: Function) => {
            let exportOptions: IExportOptions = {};
            exportOptions.region = 'Content';
            exportOptions.format = 'PNG';
            exportOptions.mode = 'Data';
            let data = diagram.exportDiagram(exportOptions);
            diagram.exportImage(
                (data as any), {
                fileName: 'diagram2',
                format: "PNG",
                mode: 'Download',
                region: 'Content'
            });
            expect(data !== null).toBe(true);
            done();
        });

    });
});