/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { GridlinesModel, SnapSettingsModel } from '../../../src/diagram/diagram/grid-lines-model';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
/**
 * Path
 */

const GRIDLINE_INTERVALS: number[] = [1, 14, 0.5, 14.5];
const GRIDLINE_COLOR: string = 'red';
const DIAGRAM_WIDTH: number = 1000;
const DIAGRAM_HEIGHT: number = 1000;
let suiteCounter: number = 0;

// Helper: safely check if value is defined
function isDefined<T>(o: T): o is NonNullable<T> {
  return o !== undefined && o !== null;
}

function createDiagramContainer(): HTMLElement {
  suiteCounter = suiteCounter + 1;
  const id: string = 'diagram-grid-' + suiteCounter;
  const el: HTMLElement = createElement('div', { id: id });
  document.body.appendChild(el);
  return el;
}

function removeContainer(el: HTMLElement | null): void {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

describe('Diagram Control', () => {

    describe('GridLines property', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let horizontalGridlines: GridlinesModel;
        let verticalGridlines: GridlinesModel;
        beforeAll((): void => {
            // Bootstrap: check environment support; log for CI reproducibility
            if (!isDefined(window.performance)) {
                console.log('Environment: window.performance unavailable; skipping suite');
                pending();
                return;
            }
            console.log('Environment: devicePixelRatio=' + window.devicePixelRatio + ', viewport=' + window.innerWidth + 'x' + window.innerHeight);
        });
        beforeEach((done: Function): void => {
            ele = createDiagramContainer();
            horizontalGridlines = {
                lineIntervals: GRIDLINE_INTERVALS,
                lineColor: GRIDLINE_COLOR
            };
            verticalGridlines = {
                lineIntervals: GRIDLINE_INTERVALS,
                lineColor: GRIDLINE_COLOR
            };

            const snapSettings: SnapSettingsModel = {
                horizontalGridlines: horizontalGridlines,
                verticalGridlines: verticalGridlines
            };
            diagram = new Diagram({
                mode: 'Canvas',  // Canvas mode renders gridlines in SVG <pattern>
                width: DIAGRAM_WIDTH,
                height: DIAGRAM_HEIGHT,
                snapSettings: snapSettings,
                created: (): void => {
                    done();  // ← Signal test is ready
                }
            });
            diagram.appendTo('#' + ele.id);
        });

        afterEach((): void => {
            // Teardown: clear event handlers (defensive) and destroy resources
            if (diagram) {
                diagram.created = undefined;
                diagram.destroy();
                diagram = null;
            }
            removeContainer(ele);
            ele = null;
        });

        it('Checking customized gridlines line color in SVG rendering Mode', (done: Function) => {
            diagram.dataBind();
            let path: HTMLElement = (document.getElementById(ele.id + '_pattern') as HTMLElement).firstChild as HTMLElement;
            expect(path.getAttribute('stroke')).toBe(GRIDLINE_COLOR);
            done();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            expect(average).toBeLessThan(25);
            let memory: any = inMB(getMemoryProfile());
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });
});