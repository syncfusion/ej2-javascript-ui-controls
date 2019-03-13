/**
 * Renderer Factory spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { getEnumValue } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { RenderType } from '../../../src/grid/base/enum';
import { IRenderer } from '../../../src/grid/base/interface';
import { RendererFactory } from '../../../src/grid/services/renderer-factory';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

describe('RendererFactory module', () => {
    describe('Register and get service', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('Check fallback', () => {
            expect(() => gridObj.serviceLocator.getService<RendererFactory>('rendererFactory')
                .getRenderer(RenderType.Summary)).toThrow('The renderer Summary is not found');
        });

        it('Check register', () => {
            class RenderMock implements IRenderer {
                public renderPanel(): void {
                    createElement('div');
                }
                public renderTable(): void {
                    createElement('div');
                }
                public setPanel(panel: Element): void {
                    createElement('div');
                }
                public setTable(table: Element): void {
                    createElement('div');
                }
                public getPanel(): Element {
                    return createElement('div');
                };
                public getTable(): Element {
                    return createElement('div');
                };
            }

            class DupRenderMock extends RenderMock { }

            let factory: RendererFactory = gridObj.serviceLocator.getService<RendererFactory>('rendererFactory');
            factory.addRenderer(RenderType.Summary, new RenderMock);
            factory.addRenderer(RenderType.Summary, new DupRenderMock);
            expect(<string>getEnumValue(RenderType, RenderType.Summary) in factory.rendererMap).toBeTruthy();
            expect(factory.getRenderer(RenderType.Summary) instanceof RenderMock).toBeTruthy();
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

        afterAll(() => {
            destroy(gridObj);
        });
    });

});