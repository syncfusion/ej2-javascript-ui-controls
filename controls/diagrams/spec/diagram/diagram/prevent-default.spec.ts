/**
 * PathElement Test Cases
 */

/* tslint:disable */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, UmlClassifierShapeModel, BpmnShapeModel, BpmnSubProcessModel, BpmnActivityModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Keys, KeyModifiers, PortVisibility, NodeConstraints, SnapConstraints } from '../../../src/diagram/enum/enum';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { ConnectorBridging } from '../../../src/diagram/objects/connector-bridging';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { ConnectorEditing, TextStyleModel, ShapeStyleModel, ActivityFlow } from '../../../src/diagram/index';
Diagram.Inject(ConnectorBridging, ConnectorEditing, BpmnDiagrams);

describe('Diagram Control', () => {

    describe('Prevent Defaults', () => {

        describe('Empty Diagram', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'emptydiagram_preventDefaults' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 600, height: 500,
                    serializationSettings: { preventDefaults: false }
                });
                diagram.appendTo('#emptydiagram_preventDefaults');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                diagram.serializationSettings.preventDefaults = true;
                diagram.dataBind();
                let sampleData = '{"width":600,"height":500,"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":600,"viewPortHeight":500}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        })

        describe('Nodes shapes basic, flow, text', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_shapes_bft' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                        shape: { type: 'Basic', shape: 'Rectangle' },
                        annotations: [{
                            id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                        }],
                        ports: [
                            {
                                id: 'port1', shape: 'Square', style: { fill: 'blue'}, visibility: PortVisibility.Visible
                            }
                        ]
                    }, {
                        id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
                        shape: { type: 'Flow', shape: 'Process' },
                        style: { gradient: {type: 'Radial',  stops: [{ color: '#00555b', offset: 0 }, { color: '#37909A', offset: 90 }]}},
                        annotations: [{
                            id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                        }]
                    }, {
                        id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 280,
                        shape: { type: 'Text', content: 'abc' },
                        annotations: [{
                            id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                            margin: { left: 25, right: 25 },
                            style: { whiteSpace: 'PreserveAll' }
                        }]
                    }, {
                        id: 'polygon', width: 248, height: 90, offsetX: 400, offsetY: 200,
                        shape: { type: 'Basic', shape: 'Polygon', points: [{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }] },
                        annotations: [{id: 'label4', content: '[{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }]' }],
                    }
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_shapes_bft');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                let sampleData = '{"width":1000,"height":1000,"nodes":[{"shape":{"type":"Basic"},"id":"NewIdea","width":150,"height":60,"offsetX":300,"offsetY":60,"annotations":[{"id":"label1","content":"New idea identified"}],"ports":[{"id":"port1","style":{"fill":"blue"},"visibility":1}],"zIndex":0},{"shape":{"type":"Flow","shape":"Process"},"id":"Meeting","width":150,"height":60,"offsetX":300,"offsetY":155,"style":{"gradient":{"type":"Radial","stops":[{"color":"#00555b"},{"color":"#37909A","offset":90}],"id":"Meeting_content_radial","cx":0,"cy":0,"r":50,"fx":0,"fy":0}},"annotations":[{"id":"label2","content":"Meeting with board"}],"zIndex":1},{"shape":{"type":"Text","content":"abc"},"id":"BoardDecision","width":150,"height":110,"offsetX":300,"offsetY":280,"annotations":[{"id":"label3","content":"Board decides whether to proceed","margin":{"left":25,"right":25},"style":{"whiteSpace":"PreserveAll"}}],"zIndex":2},{"shape":{"type":"Basic","shape":"Polygon","points":[{"x":35},{"x":65},{"x":100,"y":35},{"x":100,"y":65},{"x":65,"y":100},{"x":35,"y":100},{"y":65},{"y":35}]},"id":"polygon","width":248,"height":90,"offsetX":400,"offsetY":200,"annotations":[{"id":"label4","content":"[{ x: 35, y: 0 }, { x: 65, y: 0 }, { x: 100, y: 35 }, { x: 100, y: 65 }, { x: 65, y: 100 }, { x: 35, y: 100 }, { x: 0, y: 65 }, { x: 0, y: 35 }]"}],"zIndex":3}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('Nodes shapes image', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_shapes_i' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'Project', width: 150, height: 100, offsetX: 300, offsetY: 430,
                        shape: { type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg' },
                        annotations: [{
                            id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },
                    
                        }]
                    }
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_shapes_i');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string =
                    '{"width":1000,"height":1000,"nodes":[{"shape":{"type":"Image","source":"https://www.w3schools.com/images/w3schools_green.jpg"},"id":"Project","width":150,"height":100,"offsetX":300,"offsetY":430,"annotations":[{"id":"label4","content":"Find Project manager"}],"zIndex":0}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('Nodes shapes Native', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_shapes_n' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'End', width: 150, height: 60, offsetX: 300, offsetY: 555,
                        shape: { type: 'Native', content: '<g xmlns="http://www.w3.org/2000/svg">	<g transform="translate(1 1)">		<g>			<path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/>			<path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/>		</g>		<path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/>		<path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/>		<path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/>		<path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/>		<path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/>	</g>	<g>		<path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/>		<path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/>		<path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/>		<path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/>		<path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/>		<path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/>		<path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/>		<path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/>		<path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/>		<path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/>		<path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/>		<path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/>		<path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/>		<path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/>		<path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/>		<path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/>		<path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/>		<path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/>		<path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/>	</g></g>' },
                        annotations: [{
                            id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },
                        }],
                    }
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_shapes_n');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string = '{"width":1000,"height":1000,"nodes":[{"shape":{"type":"Native","content":"<g xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)"><g><path style="fill:#61443C;" d="M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,1.791-6.827,1.28     C62.726,435.13,62.354,435.072,61.979,435.057z"/><path style="fill:#61443C;" d="M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304     c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296     c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504     c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z"/></g><path style="fill:#8B685A;" d="M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z"/><path style="fill:#66993E;" d="M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z"/><path style="fill:#9ACA5C;" d="M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z"/><path style="fill:#66993E;" d="M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z"/><path style="fill:#9ACA5C;" d="M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z"/></g><g><path d="M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z"/><path d="M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z"/><path d="M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z"/><path d="M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z"/><path d="M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z"/><path d="M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z"/><path d="M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z"/><path d="M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z"/><path d="M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z"/><path d="M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z"/><path d="M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z"/><path d="M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z"/><path d="M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z"/><path d="M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z"/><path d="M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z"/><path d="M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z"/><path d="M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z"/><path d="M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z"/><path d="M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z"/></g></g>"},"id":"End","width":150,"height":60,"offsetX":300,"offsetY":555,"annotations":[{"id":"label5","content":"Implement and Deliver"}],"zIndex":0}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                savedata = savedata.replace(/\\"/g, '"');
                savedata = savedata.replace(/\\t/g, '');
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('Nodes shapes html path', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_shapes_hp' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'Decision', width: 250, height: 60, offsetX: 550, offsetY: 60,
                        shape: { type: 'HTML', content: '<div> <input type="button" value="Select" id="Select-node" /> </div>' },
                        annotations: [{
                            id: 'label6', content: 'Decision Process for new software ideas', offset: { x: 0.5, y: 0.5 },
                            style: { whiteSpace: 'PreserveAll' } as TextStyleModel
                        }]
                    }, {
                        id: 'Reject', width: 150, height: 60, offsetX: 550, offsetY: 280,
                        shape: { type: 'Path', data: 'M0,0 L100,100 L100,0 L0,100, L0,0 L100,0 L100,100 L0,100 Z' },
                        annotations: [{
                            id: 'label7', content: 'Reject and write report', offset: { x: 0.5, y: 0.5 },
                        }]
                    }
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_shapes_hp');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let  sampleData: string = '{"width":1000,"height":1000,"nodes":[{"shape":{"type":"HTML","content":"<div> <input type="button" value="Select" id="Select-node" /> </div>"},"id":"Decision","width":250,"height":60,"offsetX":550,"offsetY":60,"annotations":[{"id":"label6","content":"Decision Process for new software ideas","style":{"whiteSpace":"PreserveAll"}}],"zIndex":0},{"shape":{"type":"Path","data":"M0,0 L100,100 L100,0 L0,100, L0,0 L100,0 L100,100 L0,100 Z"},"id":"Reject","width":150,"height":60,"offsetX":550,"offsetY":280,"annotations":[{"id":"label7","content":"Reject and write report"}],"zIndex":1}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                savedata = savedata.replace(/\\"/g, '"');
                expect((savedata.replace(/\s/g, "")) === (sampleData.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('Nodes-Bpmn', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_bpmn' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'Resources', width: 150, height: 60, offsetX: 550, offsetY: 430,
                        shape: {
                            type: 'Bpmn', shape: 'DataObject',
                            dataObject: { collection: false, type: 'Input' },
                            annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
                            { id: 'right', angle: 30, length: 150, text: 'Right', },
                            { id: 'top', angle: 270, length: 150, text: 'Top' },
                            { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
                            ]
                        } as BpmnShapeModel,
                    }, {
                        id: 'node13', width: 400, height: 400, maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                        offsetX: 200, offsetY: 200,
                        shape: {
                            type: 'Bpmn', shape: 'Activity', activity: {
                                activity: 'SubProcess',
                                subProcess: {
                                    collapsed: false, type: 'Event',
                                    processes: ['start', 'end', 'nod1', 'nod']
                                } as BpmnSubProcessModel
                            } as BpmnActivityModel,
                        },
                    }, {
                        id: 'node14', width: 100, height: 100, offsetX: 300, offsetY: 300,
                        shape: {
                            type: 'Bpmn', shape: 'Event',
                            event: { event: 'NonInterruptingStart', trigger: 'Multiple' }
                        }
                    }, {
                        id: 'node15', width: 100, height: 100, offsetX: 500, offsetY: 300,
                        shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } } as BpmnShapeModel,
                    }, {
                        id: 'node16', width: 100, height: 100, offsetX: 300, offsetY: 450,
                        style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
                        shadow: { angle: 135 }, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                        shape: {
                            type: 'Bpmn', shape: 'DataObject',
                            dataObject: { collection: false, type: 'Input' },
                            annotations: [
                                { id: 'annot1', angle: 30, length: 150, text: 'textAnnotation1' },
                                { id: 'annot2', angle: 90, width: 100, height: 100, length: 150, text: 'textAnnotation2' },
                                { id: 'annot3', angle: 180, width: 100, height: 100, length: 150, text: 'textAnnotation3' },
                                { id: 'annot4', angle: 280, width: 100, height: 100, length: 150, text: 'textAnnotation4' }
                            ]
                        } as BpmnShapeModel,
                    }, {
                        id: 'node17', width: 100, height: 100, offsetX: 100, offsetY: 300,
                        style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 },
                        shape: {
                            type: 'Bpmn', shape: 'Activity', activity: {
                                activity: 'SubProcess',
                                subProcess: { collapsed: true, compensation: true }
                            },
                        }
                    }, {
                        id: 'node18', width: 100, height: 100, offsetX: 900, offsetY: 100,
                        style: { strokeWidth: 5, strokeDashArray: '2 2' },
                        shape: {
                            type: 'Bpmn', shape: 'Activity', activity: {
                                activity: 'Task', task: {
                                    type: 'Manual', compensation: false,
                                }
                            },
                        },
                    }, {
                        id: 'node19', width: 100, height: 100, offsetX: 100, offsetY: 100,
                        style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, } as ShapeStyleModel,
                        shape: {
                            type: 'Bpmn', shape: 'Activity', activity: {
                                activity: 'SubProcess',
                                subProcess: { type: 'Transaction', events: [{event: 'Start', trigger: 'Parallel', }] }
                            }
                        }
                    }
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_bpmn');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                let sampleData: string = '{"width":1000,"height":1000,"nodes":[{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"type":"Input"},"annotations":[{"id":"left","angle":170,"length":150,"text":"Left","nodeId":"Resources"},{"id":"right","angle":30,"length":150,"text":"Right","nodeId":"Resources"},{"id":"top","angle":270,"length":150,"text":"Top","nodeId":"Resources"},{"id":"bottom","angle":120,"length":150,"text":"Bottom","nodeId":"Resources"}]},"id":"Resources","width":150,"height":60,"offsetX":550,"offsetY":430,"zIndex":0,"outEdges":["Resources_left_connector","Resources_right_connector","Resources_top_connector","Resources_bottom_connector"]},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"SubProcess","subProcess":{"collapsed":false,"type":"Event","processes":["start","end","nod1","nod"]}}},"id":"node13","width":400,"height":400,"maxHeight":600,"maxWidth":600,"minWidth":300,"minHeight":300,"constraints":5242862,"offsetX":200,"offsetY":200,"zIndex":1},{"shape":{"type":"Bpmn","event":{"event":"NonInterruptingStart","trigger":"Multiple"}},"id":"node14","width":100,"height":100,"offsetX":300,"offsetY":300,"zIndex":2},{"shape":{"type":"Bpmn","shape":"Gateway","gateway":{"type":"None"}},"id":"node15","width":100,"height":100,"offsetX":500,"offsetY":300,"zIndex":3},{"shape":{"type":"Bpmn","shape":"DataObject","dataObject":{"type":"Input"},"annotations":[{"id":"annot1","angle":30,"length":150,"text":"textAnnotation1","nodeId":"node16"},{"id":"annot2","angle":90,"width":100,"height":100,"length":150,"text":"textAnnotation2","nodeId":"node16"},{"id":"annot3","angle":180,"width":100,"height":100,"length":150,"text":"textAnnotation3","nodeId":"node16"},{"id":"annot4","angle":280,"width":100,"height":100,"length":150,"text":"textAnnotation4","nodeId":"node16"}]},"id":"node16","width":100,"height":100,"offsetX":300,"offsetY":450,"style":{"fill":"red","strokeColor":"blue","strokeWidth":5},"shadow":{"angle":135},"constraints":5240830,"zIndex":4,"outEdges":["node16_annot1_connector","node16_annot2_connector","node16_annot3_connector","node16_annot4_connector"]},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"SubProcess","subProcess":{"compensation":true,"type":"None"}}},"id":"node17","width":100,"height":100,"offsetX":100,"offsetY":300,"style":{"fill":"red","strokeColor":"blue","strokeWidth":5},"zIndex":5},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"task":{"type":"Manual"}}},"id":"node18","width":100,"height":100,"offsetX":900,"offsetY":100,"style":{"strokeWidth":5,"strokeDashArray":"2 2"},"zIndex":6},{"shape":{"type":"Bpmn","shape":"Activity","activity":{"activity":"SubProcess","subProcess":{"type":"Transaction","events":[{"trigger":"Parallel"}],"transaction":{"success":{"id":"success","event":"End","offset":{"x":1,"y":0.5}},"cancel":{"id":"cancel","event":"Intermediate","trigger":"Cancel","offset":{"x":0.75,"y":1}},"failure":{"id":"failure","event":"Intermediate","trigger":"Error","offset":{"x":0.25,"y":1}}}}}},"id":"node19","width":100,"height":100,"offsetX":100,"offsetY":100,"style":{"fill":"red","strokeColor":"blue","strokeWidth":5},"zIndex":7}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                savedata = savedata.replace(/\\"/g, '"');
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
                done();
            });
            it('memory leak', () => {
                profile.sample();
                let average: any = inMB(profile.averageChange);
                //Check average change in memory samples to not be over 10MB
                expect(average).toBeLessThan(10);
                let memory: any = inMB(getMemoryProfile());
                //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
                expect(memory).toBeLessThan(profile.samples[0] + 0.25);
            });
        });

        describe('Nodes- uml', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_uml' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'node9', width: 100, height: 60, offsetX: 650, offsetY: 500,
                        shape: { type: 'UmlActivity', shape: 'AcceptingEvent' }
                    }, {
                        id: 'node10', width: 100, height: 60, offsetX: 550, offsetY: 600,
                        shape: {
                            type: 'UmlClassifier',
                            classShape: {
                                property: [
                                    { name: 'accepted', type: 'Date', style: {} },
                                    { name: 'sickness', type: 'History' },
                                    { name: 'prescription', type: 'String[*]' },
                                    { name: 'allergies', type: 'String[*]' }
                                ], methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
                                name: 'Patient',
                                attributes: [{ isSeparator: false, scope: 'Private'}]
                            },
                            classifier: 'Class',
                        } as UmlClassifierShapeModel,
                    }, {
                        id: 'node20', width: 90, height: 90, offsetX: 300, offsetY: 100,
                        shape: { type: 'UmlActivity', shape: 'Action' },
                        annotations: [{
                            id: 'label2', content: 'Action', style: { strokeColor: 'white' }
                        }]
                    }, {
                        id: 'node23',
                        offsetX: 300,
                        offsetY: 200, style: {
                            fill: '#26A0DA',
                        }, borderColor: 'white',
                        shape: {
                            type: 'UmlClassifier',
                            enumerationShape: {
                                name: 'AccountType',
                                //sets the members of enumeration
                                members: [
                                    {
                                        name: 'Checking Account', style: {}
                                    },
                                    {
                                        name: 'Savings Account'
                                    },
                                    {
                                        name: 'Credit Account'
                                    }]
                            },
                            classifier: 'Enumeration'
                        } as UmlClassifierShapeModel,
                    }, {
                        id: 'node24',
                        offsetX: 400,
                        offsetY: 300, style: {
                            fill: '#26A0DA',
                        }, borderColor: 'white',
                        shape: {
                            type: 'UmlClassifier',
                            interfaceShape: {
                                name: "Bank Account",
                                property: [{
                                    name: "owner",
                                    type: "String[*]", style: {}
                                },
                                {
                                    name: "balance",
                                    type: "Dollars"
                                }],
                                methods: [{
                                    name: "deposit", style: {},
                                    parameters: [{
                                        name: "amount",
                                        type: "Dollars",
                                        style: {}
                                    }],
                                }]
                            },
                            classifier: 'Interface'
                        } as UmlClassifierShapeModel,
                    }
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_uml');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                savedata = diagram.saveDiagram();
                expect((savedata.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('Nodes-swimlane', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_swimlane' });
                document.body.appendChild(ele);
                let darkColor: string = '#C7D4DF';
                let lightColor: string = '#f5f5f5';
                let pathData: string = 'M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135' +
                    ' 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C' +
                    '0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z';
                let nodes: NodeModel[] = [
                    {
                        id: 'swimlane',
                        shape: {
                            type: 'SwimLane',
                            header: {
                                annotation: { id: '1', content: 'ONLINE PURCHASE STATUS' },
                                height: 50, style: { fill: darkColor, fontSize: 11 },
                                orientation: 'Horizontal', id: 'SwimlaneHeader'
                            },
                            lanes: [
                                {
                                    id: 'stackCanvas1',
                                    header: {
                                        annotation: { id: '2', content: 'CUSTOMER' }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                    children: [
                                        {
                                            id: 'Order',
                                            shape: { type: 'Path', data: pathData },
                                            annotations: [
                                                {
                                                    id: 'annotation1',
                                                    content: 'ORDER',
                                                    style: { fontSize: 11 }
                                                }
                                            ],
                                            margin: { left: 60, top: 20 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas2',
                                    header: {
                                        annotation: {
                                            id: '3',
                                            content: 'ONLINE'
                                        }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor }, height: 100,
                                    children: [
                                        {
                                            id: 'selectItemaddcart',
                                            annotations: [{
                                                    id: 'annotation2',
                                                    content: 'Add cart'
                                                }],
                                            margin: { left: 190, top: 20 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'paymentondebitcreditcard',
                                            annotations: [{
                                                    id: 'annotation3',
                                                    content: 'Payment'
                                                }],
                                            margin: { left: 350, top: 20 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas3',
                                    header: {
                                        annotation: {
                                            id: '4',
                                            content: 'SHOP'
                                        }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                    children: [
                                        {
                                            id: 'getmaildetailaboutorder',
                                            annotations: [{
                                                    id: 'annotation4',
                                                    content: 'Get mail'
                                                }],
                                            margin: { left: 190, top: 20 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'pakingitem',
                                            annotations: [{
                                                    id: 'annotation5',
                                                    content: 'Paking item'
                                                }],
                                            margin: { left: 350, top: 20 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                                {
                                    id: 'stackCanvas4',
                                    header: {
                                        annotation: {
                                            id: '5',
                                            content: 'DELIVERY'
                                        }, width: 50,
                                        style: { fill: darkColor, fontSize: 11 }
                                    },
                                    style: { fill: lightColor },
                                    height: 100,
                                    children: [
                                        {
                                            id: 'sendcourieraboutaddress',
                                            annotations: [{
                                                    id: 'annotation6',
                                                    content: 'Send Courier'
                                                }],
                                            margin: { left: 190, top: 20 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'deliveryonthataddress',
                                            annotations: [{
                                                    id: 'annotation7',
                                                    content: 'Delivery'
                                                }],
                                            margin: { left: 350, top: 20 },
                                            height: 40, width: 100
                                        },
                                        {
                                            id: 'getitItem',
                                            shape: { type: 'Path', data: pathData },
                                            annotations: [{
                                                    id: 'annotation7',
                                                    content: 'GET IT ITEM', style: { fontSize: 11 }
                                                }],
                                            margin: { left: 500, top: 20 },
                                            height: 40, width: 100
                                        }
                                    ],
                                },
                            ],
                            phases: [
                                {
                                    id: 'phase1', offset: 170,
                                    header: {
                                        id: 'phase1',
                                        content: {
                                            id: 'phase1',
                                            content: 'Phase'
                                        }
                                    }
                                },
                                {
                                    id: 'phase2', offset: 450,
                                    header: {
                                        id: 'phase2',
                                        content: { content: 'Phase' }
                                    }
                                },
                            ],
                            phaseSize: 20,
                        },
                        offsetX: 420, offsetY: 270,
                        height: 100,
                        width: 650
                    },
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_swimlane');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                let sampleData = '{"width":1000,"height":1000,"nodes":[{"shape":{"type":"SwimLane","header":{"style":{"fill":"#C7D4DF","fontSize":11,"gradient":{"type":"None"}},"annotation":{"id":"1","content":"ONLINE PURCHASE STATUS"},"id":"SwimlaneHeader"},"lanes":[{"id":"stackCanvas1","header":{"style":{"fill":"#C7D4DF","fontSize":11},"annotation":{"id":"2","content":"CUSTOMER"},"id":"swimlanestackCanvas1_0_header"},"style":{"fill":"#f5f5f5"},"children":[{"shape":{"type":"Path","data":"M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z"},"id":"Order","annotations":[{"id":"annotation1","content":"ORDER","style":{"fontSize":11}}],"margin":{"left":70,"top":20},"height":40,"width":100,"offsetX":205,"offsetY":145,"zIndex":16,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":205,"offsetY":145},"parentId":"swimlanestackCanvas10"}]},{"id":"stackCanvas2","header":{"style":{"fill":"#C7D4DF","fontSize":11},"annotation":{"id":"3","content":"ONLINE"},"id":"swimlanestackCanvas2_0_header"},"style":{"fill":"#f5f5f5"},"children":[{"shape":{"type":"Basic"},"id":"selectItemaddcart","annotations":[{"id":"annotation2","content":"Add cart"}],"margin":{"left":20,"top":20},"height":40,"width":100,"offsetX":345,"offsetY":245,"zIndex":17,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":345,"offsetY":245},"parentId":"swimlanestackCanvas21"},{"shape":{"type":"Basic"},"id":"paymentondebitcreditcard","annotations":[{"id":"annotation3","content":"Payment"}],"margin":{"left":180,"top":20},"height":40,"width":100,"offsetX":505,"offsetY":245,"zIndex":18,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":505,"offsetY":245},"parentId":"swimlanestackCanvas21"}]},{"id":"stackCanvas3","header":{"style":{"fill":"#C7D4DF","fontSize":11},"annotation":{"id":"4","content":"SHOP"},"id":"swimlanestackCanvas3_0_header"},"style":{"fill":"#f5f5f5"},"children":[{"shape":{"type":"Basic"},"id":"getmaildetailaboutorder","annotations":[{"id":"annotation4","content":"Get mail"}],"margin":{"left":20,"top":20},"height":40,"width":100,"offsetX":345,"offsetY":345,"zIndex":19,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":345,"offsetY":345},"parentId":"swimlanestackCanvas31"},{"shape":{"type":"Basic"},"id":"pakingitem","annotations":[{"id":"annotation5","content":"Paking item"}],"margin":{"left":180,"top":20},"height":40,"width":100,"offsetX":505,"offsetY":345,"zIndex":20,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":505,"offsetY":345},"parentId":"swimlanestackCanvas31"}]},{"id":"stackCanvas4","header":{"style":{"fill":"#C7D4DF","fontSize":11},"annotation":{"id":"5","content":"DELIVERY"},"id":"swimlanestackCanvas4_0_header"},"style":{"fill":"#f5f5f5"},"children":[{"shape":{"type":"Basic"},"id":"sendcourieraboutaddress","annotations":[{"id":"annotation6","content":"Send Courier"}],"margin":{"left":20,"top":20},"height":40,"width":100,"offsetX":345,"offsetY":445,"zIndex":21,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":345,"offsetY":445},"parentId":"swimlanestackCanvas41"},{"shape":{"type":"Basic"},"id":"deliveryonthataddress","annotations":[{"id":"annotation7","content":"Delivery"}],"margin":{"left":180,"top":20},"height":40,"width":100,"offsetX":505,"offsetY":445,"zIndex":22,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":505,"offsetY":445},"parentId":"swimlanestackCanvas41"},{"shape":{"type":"Path","data":"M 120 24.9999 C 120 38.8072 109.642 50 96.8653 50 L 23.135 50 C 10.3578 50 0 38.8072 0 24.9999 L 0 24.9999 C0 11.1928 10.3578 0 23.135 0 L 96.8653 0 C 109.642 0 120 11.1928 120 24.9999 Z"},"id":"getitItem","annotations":[{"id":"annotation7","content":"GET IT ITEM","style":{"fontSize":11}}],"margin":{"left":330,"top":20},"height":40,"width":100,"offsetX":655,"offsetY":445,"zIndex":23,"wrapper":{"actualSize":{"width":100,"height":40},"offsetX":655,"offsetY":445},"parentId":"swimlanestackCanvas41"}]}],"phases":[{"id":"phase1","offset":190,"header":{"annotation":{"id":"phase1"},"id":"swimlanephase1_header"},"style":{"fill":"transparent"}},{"id":"phase2","offset":670,"header":{"annotation":{"id":"phase2"},"id":"swimlanephase2_header"},"style":{"fill":"transparent"}}],"orientation":"Horizontal"},"id":"swimlane","offsetX":420,"offsetY":270,"height":470,"width":670,"zIndex":0,"container":{"type":"Grid","orientation":"Horizontal"},"constraints":22018030}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
                done();
            });
        });

        describe('Nodes-container', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_nodes_container' });
                document.body.appendChild(ele);
                let nodes: NodeModel[] = [
                    {
                        id: 'node11', width: 100, height: 100, offsetX: 300, offsetY: 500, isExpanded: false,
                        collapseIcon: {
                            height: 20, width: 20, shape: "Template",
                            content:
                                '{"width":1000,"height":1000,"nodes":[{"id":"node11","width":100,"height":100,"offsetX":300,"offsetY":500,"isExpanded":false,"collapseIcon":{"height":20,"width":20,"shape":"Template","content":"<g><path d = "M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>","offset":{"x":0.5,"y":1}},"zIndex":0,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"}},{"id":"node12","width":100,"height":100,"offsetX":500,"offsetY":100,"tooltip":{"content":"b","position":"TopRight","relativeMode":"Object"},"constraints":7337966,"zIndex":1,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"}},{"id":"node21","width":88.88888888888889,"height":133.33333333333331,"offsetX":244.44,"offsetY":266.67,"zIndex":2,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"},"parentId":"group"},{"id":"node22","width":177.77777777777777,"height":133.33333333333331,"offsetX":511.11,"offsetY":533.33,"zIndex":3,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"},"parentId":"group"},{"children":["node21","node22"],"id":"group","width":400,"height":400,"offsetX":400,"offsetY":400,"style":{"strokeColor":"transparent"},"zIndex":4,"pivot":{"x":0.5,"y":0.5}}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000},"layout":{"fixedNode":"node11"},"layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["node11","node12","node21","node22","group"],"zIndex":0}]}'
                        }
                    },  {
                        id: 'node12', width: 100, height: 100, offsetX: 500, offsetY: 100,
                        tooltip: {
                            content: 'b',
                            position: 'TopRight',
                            relativeMode: 'Object'
                        },
                        constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
                    }, {
                        id: 'node21', width: 100, height: 100, offsetX: 100,
                        offsetY: 200,
                    }, {
                        id: 'node22', width: 200, height: 100, offsetX: 400,
                        offsetY: 400
                    },
                    { 
                        id: 'group',width: 400, height: 400, children: ['node21', 'node22'],  offsetX: 400, offsetY: 400
                    },
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, nodes: nodes,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_nodes_container');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                let sampleData: string =
'{"width":1000,"height":1000,"nodes":[{"shape":{"type":"Basic"},"id":"node11","width":100,"height":100,"offsetX":300,"offsetY":500,"isExpanded":false,"collapseIcon":{"height":20,"width":20,"shape":"Template","content":"{"width":1000,"height":1000,"nodes":[{"id":"node11","width":100,"height":100,"offsetX":300,"offsetY":500,"isExpanded":false,"collapseIcon":{"height":20,"width":20,"shape":"Template","content":"<g><path d = "M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></g>","offset":{"x":0.5,"y":1}},"zIndex":0,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"}},{"id":"node12","width":100,"height":100,"offsetX":500,"offsetY":100,"tooltip":{"content":"b","position":"TopRight","relativeMode":"Object"},"constraints":7337966,"zIndex":1,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"}},{"id":"node21","width":88.88888888888889,"height":133.33333333333331,"offsetX":244.44,"offsetY":266.67,"zIndex":2,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"},"parentId":"group"},{"id":"node22","width":177.77777777777777,"height":133.33333333333331,"offsetX":511.11,"offsetY":533.33,"zIndex":3,"pivot":{"x":0.5,"y":0.5},"style":{"fill":"white"},"parentId":"group"},{"children":["node21","node22"],"id":"group","width":400,"height":400,"offsetX":400,"offsetY":400,"style":{"strokeColor":"transparent"},"zIndex":4,"pivot":{"x":0.5,"y":0.5}}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000},"layout":{"fixedNode":"node11"},"layers":[{"id":"default_layer","visible":true,"lock":false,"objects":["node11","node12","node21","node22","group"],"zIndex":0}]}"},"zIndex":0},{"shape":{"type":"Basic"},"id":"node12","width":100,"height":100,"offsetX":500,"offsetY":100,"tooltip":{"content":"b","position":"TopRight","relativeMode":"Object"},"constraints":7337966,"zIndex":1},{"shape":{"type":"Basic"},"id":"node21","width":88.88888888888889,"height":133.33333333333331,"offsetX":244.44,"offsetY":266.67,"zIndex":2,"parentId":"group"},{"shape":{"type":"Basic"},"id":"node22","width":177.77777777777777,"height":133.33333333333331,"offsetX":511.11,"offsetY":533.33,"zIndex":3,"parentId":"group"},{"children":["node21","node22"],"shape":{"type":"Basic"},"id":"group","width":400,"height":400,"offsetX":400,"offsetY":400,"style":{"fill":"transparent","strokeColor":"transparent"},"zIndex":4}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000},"layout":{"fixedNode":"node11"}}';                savedata = diagram.saveDiagram();
                savedata = savedata.replace(/\\"/g, '"');
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('Conectors', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_connectors' });
                document.body.appendChild(ele);
                let connectors: ConnectorModel[] = [
                    {
                        id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting'
                    }, {
                        id: 'connector2', type: 'Orthogonal', sourceID: 'Meeting', targetID: 'BoardDecision'
                    }, {
                        id: 'connector3', type: 'Bezier', sourceID: 'BoardDecision', targetID: 'Project'
                    }, {
                        id: 'connector4', type: 'Orthogonal', sourceID: 'Project', targetID: 'End', segments: [{direction: 'Top', type: 'Orthogonal', length: 50}, {direction: 'Left', type: 'Orthogonal', length: 50}],
                    }, {
                        id: 'connector5', type: 'Bezier', sourceID: 'BoardDecision', targetID: 'Reject', segments: [{direction: 'Bottom', type: 'Bezier', length: 50}],
                    }, {
                        id: 'connector6', type: 'Straight', sourceID: 'Project', targetID: 'Resources', segments: [{direction: 'Left', type: 'Straight', length: 50}],
                    }, {
                        id: 'connector7', type: 'Bezier', segments: [{ type: 'Bezier', vector1: { distance: 100, angle: 90 }, vector2: { distance: 45, angle: 45 } }], sourcePoint: { x: 200, y: 100 }, targetPoint: { x: 300, y: 200 },
                    }, {
                        id: 'connector8', type: 'Bezier', segments: [{ type: 'Bezier', point1: { x: 500, y: 100 }, point2: { x: 600, y: 200 } }], sourcePoint: { x: 500, y: 200 }, targetPoint: { x: 600, y: 100 },
                    }, {
                        id: 'connector9', type: 'Straight', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 },
                    }, {
                        id: 'connector10', type: 'Straight', sourcePoint: { x: 300, y: 100 }, targetPoint: { x: 400, y: 200 }, sourceDecorator: { style: { fill: 'black' }, shape: 'Diamond', pivot: { x: 0, y: 0.5 } }, targetDecorator: { shape: 'None', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } }
                    }, {
                        id: 'connector11', type: 'Orthogonal', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 },
                        annotations: [{
                            id: 'label1', hyperlink: { 
                                content: 'syncfusion', link: 'https://hr.syncfusion.com'
                            }
                        }]
                    }, {
                        id: 'connector2', type: 'Straight', sourcePoint: { x: 300, y: 700 },
                        targetDecorator: { width: 1 },
                        targetPoint: { x: 500, y: 800 }, shape: { type: 'UmlActivity', flow: 'Control' } as ActivityFlow
                    },
                ];
                diagram = new Diagram({
                    width: 1000, height: 1000, connectors: connectors,
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_connectors');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                let sampleData: string = '{"width":1000,"height":1000,"connectors":[{"id":"connector1","sourceID":"NewIdea","targetID":"Meeting","zIndex":0},{"id":"connector2","type":"Orthogonal","sourceID":"Meeting","targetID":"BoardDecision","zIndex":1},{"id":"connector3","type":"Bezier","sourceID":"BoardDecision","targetID":"Project","zIndex":2,"segments":[{"type":"Bezier"}]},{"id":"connector4","type":"Orthogonal","sourceID":"Project","targetID":"End","segments":[{"direction":"Top","type":"Orthogonal","length":50},{"direction":"Left","type":"Orthogonal","length":50},{"type":"Orthogonal"}],"zIndex":3},{"id":"connector5","type":"Bezier","sourceID":"BoardDecision","targetID":"Reject","segments":[{"type":"Bezier"}],"zIndex":4},{"id":"connector6","sourceID":"Project","targetID":"Resources","zIndex":5},{"id":"connector7","type":"Bezier","segments":[{"type":"Bezier","vector1":{"angle":90,"distance":100},"vector2":{"angle":45,"distance":45}}],"sourcePoint":{"x":200,"y":100},"targetPoint":{"x":300,"y":200},"zIndex":6},{"id":"connector8","type":"Bezier","segments":[{"type":"Bezier","point1":{"x":500,"y":100},"point2":{"x":600,"y":200}}],"sourcePoint":{"x":500,"y":200},"targetPoint":{"x":600,"y":100},"zIndex":7},{"id":"connector9","sourcePoint":{"x":100,"y":100},"targetPoint":{"x":200,"y":200},"zIndex":8},{"id":"connector10","sourcePoint":{"x":300,"y":100},"targetPoint":{"x":400,"y":200},"sourceDecorator":{"shape":"Diamond"},"targetDecorator":{"shape":"None","style":{"fill":"blue"}},"zIndex":9},{"id":"connector11","type":"Orthogonal","sourcePoint":{"x":100,"y":300},"targetPoint":{"x":200,"y":400},"annotations":[{"id":"label1","hyperlink":{"content":"syncfusion","link":"https://hr.syncfusion.com"}}],"zIndex":10,"segments":[{"type":"Orthogonal"}]},{"shape":{"type":"UmlActivity","flow":"Control"},"id":"connector2","sourcePoint":{"x":300,"y":700},"targetDecorator":{"width":1},"targetPoint":{"x":500,"y":800},"zIndex":11}],"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('pageSettings', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_pageSettings' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    pageSettings: {
                        background: {
                            color: 'red',
                        },
                        height: 500,
                        margin: {bottom: 300, left: 100, top: 100, right:200 },
                        multiplePage: true,
                        orientation: 'Portrait',
                        showPageBreaks: true,
                        width: 500
                    },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_pageSettings');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string = '{"width":1000,"height":1000,"pageSettings":{"background":{"color":"red"},"height":500,"margin":{"bottom":300,"left":100,"top":100,"right":200},"multiplePage":true,"orientation":"Portrait","showPageBreaks":true,"width":500},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('contextMenuSettings', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_contextMenuSettings' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    contextMenuSettings: {
                        show: true,
                        items: [{
                            id: 'abc', text: 'copy', 
                        }]
                    },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_contextMenuSettings');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string = '{"width":1000,"height":1000,"contextMenuSettings":{"show":true,"items":[{"id":"abc","text":"copy"}]},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('dataSourceSettings', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_dataSourceSettings' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    dataSourceSettings: {
                        id: 'abcd'
                    },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_dataSourceSettings');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string = '{"width":1000,"height":1000,"dataSourceSettings":{"id":"abcd"},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('selectedItems', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_selectedItems' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    selectedItems: { userHandles: [
                        {
                            name: 'handle1', pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'
                            , side: "Top", horizontalAlignment: "Center", verticalAlignment: 'Center', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0
                            , backgroundColor: 'black'
                        }
                    ] },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_selectedItems');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                var sampleData : string= '{"width":1000,"height":1000,"selectedItems":{"userHandles":[{"name":"handle1","pathData":"M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889","backgroundColor":"black"}]},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('commandManager', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_commandManager' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    commandManager: {
                        commands: [
                            {
                                name: 'clone',
                                canExecute: function () {
                                    if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                                        return true;
                                    }
                                    return false;
                                },

                                execute: function () {
                                    diagram.copy();
                                    diagram.paste();
                                },

                                //Defines that the clone command has to be executed on the recognition of Shift+C key press.
                                gesture: {
                                    key: Keys.C,
                                    keyModifiers: KeyModifiers.Shift
                                }
                            },
                            {
                                name: 'copy',
                                canExecute: function () {
                                    if (diagram.selectedItems.nodes.length > 0 || diagram.selectedItems.connectors.length > 0) {
                                        return true;
                                    }
                                    return false;
                                }
                            },
                            {
                                name: 'undo',
                                gesture: {
                                    key: Keys.G,
                                    keyModifiers: KeyModifiers.Alt
                                }
                            }

                        ]
                    },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_commandManager');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string = '{"width":1000,"height":1000,"commandManager":{"commands":[{"name":"clone","gesture":{"key":67,"keyModifiers":4}},{"name":"copy"},{"name":"undo","gesture":{"key":71,"keyModifiers":2}}]},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('rulerSettings', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_rulerSettings' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    rulerSettings: {
                        showRulers: true,
                        horizontalRuler: {
                            thickness: 30,
                            tickAlignment: 'RightOrBottom',
                            segmentWidth: 50,
                            markerColor: 'blue',
                        },
                        verticalRuler: {
                            thickness: 20,
                            tickAlignment: 'LeftOrTop',
                            segmentWidth: 50,
                            markerColor: 'red',
                        }
                    },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_rulerSettings');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                let sampleData: string = '{"width":1000,"height":1000,"rulerSettings":{"showRulers":true,"horizontalRuler":{"thickness":30,"segmentWidth":50,"markerColor":"blue"},"verticalRuler":{"thickness":20,"tickAlignment":"LeftOrTop","segmentWidth":50}},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });

        describe('snapSettings', () => {
            let diagram: Diagram; let savedata: string;
            let ele: HTMLElement;
            beforeAll((): void => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        console.log('Unsupported environment, window.performance.memory is unavailable');
                        this.skip(); //Skips test (in Chai)
                        return;
                    }
                ele = createElement('div', { id: 'diagram_preventDefaults_snapSettings' });
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: 1000, height: 1000,
                    snapSettings: {
                        constraints: SnapConstraints.ShowHorizontalLines,
                        horizontalGridlines: {
                            lineIntervals: [ 1.5, 8.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5],
                            snapIntervals: [25],
                            lineColor: 'blue'
                        },
                        verticalGridlines: {
                            lineIntervals: [ 1.5, 8.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5, 0.5, 9.5],
                            snapIntervals: [50],
                            lineColor: 'green'
                        },
                        snapAngle: 90,
                        snapObjectDistance: 50
                    },
                    serializationSettings: { preventDefaults: true }
                });
                diagram.appendTo('#diagram_preventDefaults_snapSettings');
            });

            afterAll((): void => {
                diagram.destroy();
                ele.remove();
            });
            it('Checking Saving the diagram using prevent default', (done: Function) => {
                
                var sampleData:string = '{"width":1000,"height":1000,"snapSettings":{"constraints":1,"horizontalGridlines":{"lineIntervals":[1.5,8.5,0.5,9.5,0.5,9.5,0.5,9.5,0.5,9.5],"snapIntervals":[25],"lineColor":"blue"},"verticalGridlines":{"lineIntervals":[1.5,8.5,0.5,9.5,0.5,9.5,0.5,9.5,0.5,9.5],"snapIntervals":[50],"lineColor":"green"},"snapAngle":90,"snapObjectDistance":50},"serializationSettings":{"preventDefaults":true},"scrollSettings":{"viewPortWidth":1000,"viewPortHeight":1000}}';
                savedata = diagram.saveDiagram();
                expect((sampleData.replace(/\s/g, "")) === (savedata.replace(/\s/g, ""))).toBe(true);
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
            });
        });
    });
});