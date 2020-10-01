import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { ConnectorFixedUserHandle } from '../../../src/diagram/objects/fixed-user-handle';


describe('Diagram Control', () => {

    describe('Fixed User Handle', () => {
        var diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];
        let mouseEvents: MouseEvents = new MouseEvents();
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
            let node1: NodeModel = { id: 'node', offsetX: 100, offsetY: 100, width: 50, height: 50, shape: shape, fixedUserHandles:[{offset:{x:0,y:0} ,visibility:true, iconStrokeColor:'red', fill:'green', margin:{right:20},width:20,handleStrokeColor:'orange', height:20,pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}]};
            let shape2: BasicShapeModel = { type: 'Basic', shape: 'Ellipse' };
            let node2: NodeModel = { id: 'node2', offsetX: 300, offsetY: 100, shape: shape2, fixedUserHandles:[{visibility:true, iconStrokeColor:'red', fill:'green', margin:{right:20},width:20,handleStrokeColor:'orange', height:20,pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'}] };
            let shape3: BasicShapeModel = { type: 'Basic', shape: 'Hexagon' };
            let node3: NodeModel = { id: 'node3', offsetX: 600, offsetY: 100, shape: shape3, rotateAngle: 100 , fixedUserHandles:[{visibility:true, iconStrokeColor:'red', fill:'green', margin:{right:20},width:20,handleStrokeColor:'orange', height:20,pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}]};
            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
                fixedUserHandles:[{offset:0.3 ,visibility:true, iconStrokeColor:'red', fill:'green', width:20,handleStrokeColor:'orange', height:20,pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}]
            },
            {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 400, y: 200 },
                fixedUserHandles:[{offset:0.5 ,visibility:true, iconStrokeColor:'red', fill:'green',width:20,handleStrokeColor:'orange', height:20,pathData: 'M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889'}]
            },]
            
            diagram = new Diagram({
                width: 800, height: 800, nodes: [node1, node2, node3], connectors: connectors,
                fixedUserHandleClick: function(args){
                    if(args)
                    console.log(true);
                }                
            });
            diagram.appendTo('#diagram');
        });

        it('Checking connector Fixed User Handle action ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 154, 153);
            mouseEvents.clickEvent(diagramCanvas, 132, 132);
            let eventhandler: any = diagram['eventHandler'];
            let action: any = eventhandler['action'];       
            expect(action === 'FixedUserHandle').toBe(true);
            done();
        });
       
        it('Checking node Fixed User Handle action ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 99, 92);
            mouseEvents.clickEvent(diagramCanvas, 55, 77);
            let eventhandler: any = diagram['eventHandler'];
            let action: any = eventhandler['action']; 
            expect(action === 'FixedUserHandle').toBe(true);
            done();
        });

        it('Checking node Fixed User Handle styles', (done: Function) => {
            expect(diagram.nodes[0].wrapper.children[1].style.fill === 'green' && diagram.nodes[0].wrapper.children[1].style.strokeColor === 'orange' && diagram.nodes[0].wrapper.children[1].style.strokeWidth === 1 ).toBe(true);
            diagram.nodes[0].fixedUserHandles[0].fill = 'black';
            diagram.nodes[0].fixedUserHandles[0].handleStrokeColor = 'red';
            diagram.nodes[0].fixedUserHandles[0].handleStrokeWidth = 2;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].style.fill === 'black' && diagram.nodes[0].wrapper.children[1].style.strokeColor === 'red' && diagram.nodes[0].wrapper.children[1].style.strokeWidth === 2 ).toBe(true);         
            done();
        });
        
        it('Checking node Fixed User Handle width and height', (done: Function) => {
            let fixedUserHandle = diagram.nodes[0].fixedUserHandles[0];
            expect(diagram.nodes[0].wrapper.children[1].width === 20 &&diagram.nodes[0].wrapper.children[1].cornerRadius === 0 && diagram.nodes[0].wrapper.children[1].height === 20  && diagram.nodes[0].wrapper.children[1].offsetX === 55 && diagram.nodes[0].wrapper.children[1].offsetY === 75).toBe(true);
            fixedUserHandle.width = 30;
            fixedUserHandle.height = 30;
            fixedUserHandle.offset.x = 1;
            fixedUserHandle.cornerRadius = 3;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].width === 30 && diagram.nodes[0].wrapper.children[1].cornerRadius === 3 && diagram.nodes[0].wrapper.children[1].height === 30  && diagram.nodes[0].wrapper.children[1].offsetX === 105).toBe(true);
            fixedUserHandle.offset.y = 1;            
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetY === 125).toBe(true);
            done();
        });

        it('Checking Fixed User Handle margin', (done: Function) => {
            let fixedUserHandle = diagram.nodes[0].fixedUserHandles[0];
            expect(diagram.nodes[0].wrapper.children[1].margin.right === 20 ).toBe(true);
            fixedUserHandle.margin.right = 40;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetX === 85 ).toBe(true);
            fixedUserHandle.margin.left = 10;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetX === 95 ).toBe(true);
            fixedUserHandle.margin.top = 10;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetY === 135 ).toBe(true);
            fixedUserHandle.margin.bottom = 10;
            diagram.dataBind();
            expect(diagram.nodes[0].wrapper.children[1].offsetY === 125 ).toBe(true);
            done();
        });

        it('Checking connector Fixed User Handle style property change', (done: Function) => {
            expect(diagram.connectors[0].wrapper.children[3].style.fill === 'green' && diagram.connectors[0].wrapper.children[3].style.strokeColor === 'orange' && diagram.connectors[0].wrapper.children[3].style.strokeWidth === 1 ).toBe(true);
            diagram.connectors[0].fixedUserHandles[0].fill = 'black';
            diagram.connectors[0].fixedUserHandles[0].handleStrokeColor = 'red';
            diagram.connectors[0].fixedUserHandles[0].handleStrokeWidth = 2;
            diagram.dataBind();
            expect(diagram.connectors[0].wrapper.children[3].style.fill === 'black' && diagram.connectors[0].wrapper.children[3].style.strokeColor === 'red' && diagram.connectors[0].wrapper.children[3].style.strokeWidth === 2 ).toBe(true);         
            done();
        });

        it('Checking node Fixed User Handle visibility', (done: Function) => {
            let fixedUserHandle = diagram.nodes[0].fixedUserHandles[0];
            expect(document.getElementById(diagram.nodes[0].id +'_'+ fixedUserHandle.id).getAttribute("visibility") == 'visible').toBe(true);
            diagram.nodes[0].fixedUserHandles[0].visibility = false;
            diagram.dataBind();
            expect(document.getElementById(diagram.nodes[0].id +'_'+ fixedUserHandle.id).getAttribute("visibility") == 'hidden').toBe(true);     
            diagram.nodes[0].fixedUserHandles[0].visibility = true;
            diagram.dataBind();
            done();
        });
	it('Checking connector Fixed User Handle visibility', (done: Function) => {
            let fixedUserHandle = diagram.connectors[0].fixedUserHandles[0];
            expect(document.getElementById(diagram.connectors[0].id +'_'+ fixedUserHandle.id).getAttribute("visibility") == 'visible').toBe(true);
            diagram.connectors[0].fixedUserHandles[0].visibility = false;
            diagram.dataBind();
            expect(document.getElementById(diagram.connectors[0].id +'_'+ fixedUserHandle.id).getAttribute("visibility") == 'hidden').toBe(true);     
            diagram.connectors[0].fixedUserHandles[0].visibility = true;
            diagram.dataBind();
	    done();
        });
        it('adding Fixed User Handle to node', (done: Function) => {
            expect(diagram.nodes[0].fixedUserHandles.length === 1).toBe(true);
            diagram.nodes[0].fixedUserHandles = [{offset:{x:0.5,y:0} ,visibility:true, iconStrokeColor:'red', fill:'green', margin:{right:20},width:20,handleStrokeColor:'orange', height:20,id:'user5',pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'},{offset:{x:0.5,y:0} ,visibility:true, iconStrokeColor:'red', fill:'green', margin:{right:20},width:20,handleStrokeColor:'orange', height:20,id:'user6',pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z'}];
            diagram.dataBind();
            expect(diagram.nodes[0].fixedUserHandles.length === 2).toBe(true);
            done();
        });                
        
        it('Checking connector Fixed User Handle offset value change', (done: Function) => {
            let fixedUserHandle = diagram.connectors[0].fixedUserHandles[0];
            expect(diagram.connectors[0].wrapper.children[3].width === 20 && diagram.connectors[0].wrapper.children[3].cornerRadius === 0 && diagram.connectors[0].wrapper.children[3].height === 20  && diagram.connectors[0].wrapper.children[3].offsetX === 130 && diagram.connectors[0].wrapper.children[3].offsetY === 130).toBe(true);
            fixedUserHandle.width = 30;
            fixedUserHandle.height = 30;
            fixedUserHandle.offset = 0.7;
            fixedUserHandle.cornerRadius = 3;
            diagram.dataBind();
            expect(diagram.connectors[0].wrapper.children[3].width === 30 && diagram.connectors[0].wrapper.children[3].cornerRadius === 3 && diagram.connectors[0].wrapper.children[3].height === 30  && diagram.connectors[0].wrapper.children[3].offsetX === 170 && diagram.connectors[0].wrapper.children[3].offsetY === 170).toBe(true);
            done();
        });
        it('Checking connector Fixed User Handle offset value change', (done: Function) => {
            let fixedUserHandle = diagram.connectors[1].fixedUserHandles[0];
            expect(diagram.connectors[1].wrapper.children[3].offsetX === 380 && diagram.connectors[1].wrapper.children[3].offsetY === 120 ).toBe(true);
            fixedUserHandle.alignment = 'Before';
            fixedUserHandle.displacement.y = 10;
            diagram.dataBind();
            expect(diagram.connectors[1].wrapper.children[3].offsetX === 380 && diagram.connectors[1].wrapper.children[3].offsetY === 100 ).toBe(true);
            fixedUserHandle.alignment = 'After';
            fixedUserHandle.displacement.x = 10;
            diagram.dataBind();
            expect(diagram.connectors[1].wrapper.children[3].offsetX === 380 && diagram.connectors[1].wrapper.children[3].offsetY === 140 ).toBe(true);
            done();
        });
        
    });
});