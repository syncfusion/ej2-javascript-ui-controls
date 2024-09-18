/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/tslint/config */

import { createElement } from "@syncfusion/ej2-base";
import { CircularChart3D } from "../../../src/circularchart3d/circularchart3d";
import { getElement, removeElement } from "../../../src/common/utils/helper";
import { CircularChart3DPoints, PieSeries3D } from "../../../src/circularchart3d/renderer/series";
import { CircularChartLegend3D} from "../../../src/circularchart3d/legend/legend";
import { CircularChartDataLabel3D } from "../../../src/circularchart3d/renderer/dataLabel";
import { getMemoryProfile, inMB, profile } from "../../common.spec";

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D, CircularChartDataLabel3D);

export const piedata: Object[] = [
    { y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18' }, { y: 23, x: 2, name: 'Bison', text: 'Bison : 23' },
    { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30' }, { y: 44, x: 4, name: 'Elk', text: 'Elk : 44' },
    { y: 52, x: 5, name: 'Pronghorn', text: 'Pronghorn : 52' }, { y: 62, x: 6, name: 'Turkey', text: 'Turkey : 62' },
    { y: 74, x: 7, name: 'Alligator', text: 'Alligator : 74' }, { y: 85, x: 8, name: 'Prairie Dog', text: 'Prairie Dog : 85' },
    { y: 96, x: 9, name: 'Mountain Lion', text: 'Mountain Lion : 96' }, { y: 102, x: 10, name: 'Beaver', text: 'Beaver : 102' }
];

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: unknown) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Pie Series checking', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: false }
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('Check pie series without points', (done: Function) => {
            pie.loaded = () => {
                const Element: Element = getElement(id + '-svg-0-series-0-point-0');
                expect(Element).toBe(null);
                done();
            };
            pie.refresh();
        });
        it('Check pie series with single point', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-25-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 165.59285733265511 277.6 L 165.59285733265511 277.6 L 165.59285733265511 277.6 L 158.21774497386838 263.12552700536423 L 158.21774497386838 263.12552700536423 ');
                Element = getElement(id + '-svg-40-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 222.39999999999992 65.59285733265514 L 222.39999999999992 65.59285733265514 L 222.39999999999992 65.59285733265514 L 236.87447299463582 58.21774497386832 L 236.87447299463582 58.21774497386832 ');
                Element = getElement(id + '-svg-12-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 347.95943752699185 347.6039713290079 L 347.95943752699185 347.6039713290079 L 347.95943752699185 347.6039713290079 L 332.26789441491627 351.8085076338866 L 332.26789441491627 351.8085076338866 ');
                done();
            };
            pie.series = [{ dataSource: [{ x: 1, y: 10 }], xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with single point and radius', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-25-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 232.79642866632753 238.8 L 232.79642866632753 238.8 L 232.79642866632753 238.8 L 229.10887248693416 231.56276350268212 L 229.10887248693416 231.56276350268212 ');
                Element = getElement(id + '-svg-40-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 261.19999999999993 132.79642866632759 L 261.19999999999993 132.79642866632759 L 261.19999999999993 132.79642866632759 L 268.4372364973179 129.10887248693416 L 268.4372364973179 129.10887248693416 ');
                Element = getElement(id + '-svg-12-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 323.979718763496 273.80198566450395 L 323.979718763496 273.80198566450395 L 323.979718763496 273.80198566450395 L 316.13394720745816 275.9042538169433 L 316.13394720745816 275.9042538169433 ');
                done();
            };
            pie.series = [{ dataSource: [{ x: 1, y: 10 }], radius: '40%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 454.4779384803277 214.95347862097958 L 454.4779384803277 214.95347862097958 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 454.4779384803277 214.95347862097958 L 454.4779384803277 214.95347862097958 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 300 200 L 300 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.92986820867128 298.33719261608474 L 179.92986820867128 298.33719261608474 L 170.78283091408892 285.9648952388303 L 162.90581830469617 272.747682748628 L 156.37625043643627 258.81546192373844 L 151.25830386134933 244.3051670778626 L 147.60228086150687 229.35941418667906 L 145.44411504768422 214.1250991715646 L 144.80501818204638 198.75195411741163 L 145.69127169608828 183.3910756149123 L 300 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 218.589215391562 67.86626415090461 L 218.589215391562 67.86626415090461 L 232.5969957948145 60.200590043749656 L 247.31829059344983 54.014803853254335 L 262.5972631763056 49.37438704490706 L 278.2721734694328 46.32846212047727 L 294.1770900833875 44.90927261727404 L 310.1436468289284 45.13184178466517 L 326.0028250070084 46.99381355103677 L 341.58674260609916 50.47547746468453 L 356.73043146677645 55.53997734461831 L 371.27358360086214 62.13370143254397 L 300 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 278.2721734694328 46.32846212047727 L 278.2721734694328 46.32846212047727 L 278.2721734694328 46.32846212047727 L 294.1770900833875 44.90927261727404 L 294.1770900833875 44.90927261727404 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.92986820867128 298.33719261608474 L 179.92986820867128 298.33719261608474 L 179.92986820867128 298.33719261608474 L 170.78283091408892 285.9648952388303 L 170.78283091408892 285.9648952388303 ');
                done();
            };
            pie.series = [{ dataSource: piedata, radius: '80%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various radius', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 377.6 200 L 377.6 200 L 377.6 200 L 377.2389692401639 207.4767393104898 L 377.2389692401639 207.4767393104898 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 377.6 200 L 377.6 200 L 377.6 200 L 377.2389692401639 207.4767393104898 L 377.2389692401639 207.4767393104898 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 377.6 200 L 377.6 200 L 377.6 200 L 300 200 L 300 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 239.96493410433564 249.1685963080424 L 239.96493410433564 249.1685963080424 L 235.39141545704447 242.98244761941515 L 231.45290915234807 236.37384137431403 L 228.18812521821812 229.40773096186922 L 225.62915193067465 222.15258353893128 L 223.80114043075343 214.67970709333954 L 222.72205752384212 207.0625495857823 L 222.4025090910232 199.37597705870581 L 222.84563584804414 191.69553780745616 L 300 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 259.294607695781 133.9331320754523 L 259.294607695781 133.9331320754523 L 266.29849789740723 130.10029502187484 L 273.6591452967249 127.00740192662717 L 281.29863158815283 124.68719352245353 L 289.1360867347164 123.16423106023863 L 297.08854504169375 122.45463630863702 L 305.0718234144642 122.56592089233258 L 313.00141250350424 123.49690677551838 L 320.7933713030496 125.23773873234227 L 328.3652157333882 127.76998867230917 L 335.636791800431 131.06685071627197 L 300 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 289.1360867347164 123.16423106023863 L 289.1360867347164 123.16423106023863 L 289.1360867347164 123.16423106023863 L 297.08854504169375 122.45463630863702 L 297.08854504169375 122.45463630863702 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 239.96493410433564 249.1685963080424 L 239.96493410433564 249.1685963080424 L 239.96493410433564 249.1685963080424 L 235.39141545704447 242.98244761941515 L 235.39141545704447 242.98244761941515 ');
                done();
            };
            pie.series = [{ dataSource: piedata, radius: '40%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various 100% radius', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 494 200 L 494 200 L 494 200 L 493.0974231004096 218.69184827622445 L 493.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 494 200 L 494 200 L 494 200 L 493.0974231004096 218.69184827622445 L 493.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 494 200 L 494 200 L 494 200 L 300 200 L 300 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 149.9123352608391 322.92149077010595 L 149.9123352608391 322.92149077010595 L 138.47853864261117 307.45611904853786 L 128.6322728808702 290.93460343578494 L 120.47031304554534 273.51932740467305 L 114.07287982668669 255.38145884732825 L 109.50285107688362 236.69926773334882 L 106.80514380960531 217.65637396445572 L 106.00627272755798 198.43994264676454 L 107.11408962011038 179.23884451864038 L 300 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 198.2365192394525 34.832830188630766 L 198.2365192394525 34.832830188630766 L 215.7462447435181 25.250737554687078 L 234.14786324181227 17.518504816567912 L 253.24657897038202 11.717983806133844 L 272.840216836791 7.910577650596622 L 292.7213626042344 6.13659077159258 L 312.67955853616047 6.414802230831498 L 332.5035312587605 8.742266938795979 L 351.983428257624 13.094346830855699 L 370.9130393334705 19.424971680772927 L 389.0919795010776 27.667126790679987 L 300 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.840216836791 7.910577650596622 L 272.840216836791 7.910577650596622 L 272.840216836791 7.910577650596623 L 292.7213626042344 6.136590771592581 L 292.7213626042344 6.13659077159258 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 149.9123352608391 322.92149077010595 L 149.9123352608391 322.92149077010595 L 149.9123352608391 322.92149077010595 L 138.47853864261117 307.45611904853786 L 138.47853864261117 307.45611904853786 ');
                done();
            };
            pie.series = [{ dataSource: piedata, radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various 100% radius with legend position as left', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 523 200 L 523 200 L 523 200 L 522.0974231004096 218.69184827622445 L 522.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 523 200 L 523 200 L 523 200 L 522.0974231004096 218.69184827622445 L 522.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 523 200 L 523 200 L 523 200 L 329 200 L 329 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 178.9123352608391 322.92149077010595 L 178.9123352608391 322.92149077010595 L 167.47853864261117 307.45611904853786 L 157.6322728808702 290.93460343578494 L 149.47031304554534 273.51932740467305 L 143.0728798266867 255.38145884732825 L 138.50285107688362 236.69926773334882 L 135.8051438096053 217.65637396445572 L 135.00627272755798 198.43994264676454 L 136.11408962011038 179.23884451864038 L 329 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 227.2365192394525 34.832830188630766 L 227.2365192394525 34.832830188630766 L 244.7462447435181 25.250737554687078 L 263.1478632418123 17.518504816567912 L 282.246578970382 11.717983806133844 L 301.84021683679106 7.910577650596622 L 321.7213626042344 6.13659077159258 L 341.6795585361605 6.414802230831498 L 361.5035312587605 8.742266938795979 L 380.9834282576239 13.094346830855699 L 399.9130393334705 19.424971680772927 L 418.09197950107756 27.667126790679987 L 329 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 301.84021683679106 7.910577650596622 L 301.84021683679106 7.910577650596622 L 301.84021683679106 7.910577650596623 L 321.7213626042344 6.136590771592581 L 321.7213626042344 6.13659077159258 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 178.9123352608391 322.92149077010595 L 178.9123352608391 322.92149077010595 L 178.9123352608391 322.92149077010595 L 167.47853864261117 307.45611904853786 L 167.47853864261117 307.45611904853786 ');
                done();
            };
            pie.legendSettings = { visible: true, position: 'Left' };
            pie.series = [{ dataSource: piedata, radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various 100% radius with legend position as Right', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489 200 L 489 200 L 489 200 L 488.0974231004096 218.69184827622445 L 488.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489 200 L 489 200 L 489 200 L 488.0974231004096 218.69184827622445 L 488.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489 200 L 489 200 L 489 200 L 295 200 L 295 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 144.9123352608391 322.92149077010595 L 144.9123352608391 322.92149077010595 L 133.47853864261117 307.45611904853786 L 123.6322728808702 290.93460343578494 L 115.47031304554535 273.51932740467305 L 109.0728798266867 255.38145884732825 L 104.50285107688362 236.69926773334882 L 101.80514380960531 217.65637396445572 L 101.00627272755798 198.43994264676454 L 102.11408962011039 179.23884451864038 L 295 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 193.2365192394525 34.832830188630766 L 193.2365192394525 34.832830188630766 L 210.7462447435181 25.250737554687078 L 229.14786324181227 17.518504816567912 L 248.24657897038202 11.717983806133844 L 267.840216836791 7.910577650596622 L 287.7213626042344 6.13659077159258 L 307.67955853616047 6.414802230831498 L 327.5035312587605 8.742266938795979 L 346.9834282576239 13.094346830855699 L 365.9130393334705 19.424971680772927 L 384.09197950107756 27.667126790679987 L 295 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 267.840216836791 7.910577650596622 L 267.840216836791 7.910577650596622 L 267.840216836791 7.910577650596623 L 287.7213626042344 6.136590771592581 L 287.7213626042344 6.13659077159258 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 144.9123352608391 322.92149077010595 L 144.9123352608391 322.92149077010595 L 144.9123352608391 322.92149077010595 L 133.47853864261117 307.45611904853786 L 133.47853864261117 307.45611904853786 ');
                done();
            };
            pie.legendSettings.position = 'Right';
            pie.series = [{ dataSource: piedata, radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various 100% radius with legend position as Top', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.15 205 L 489.15 205 L 489.15 205 L 488.2699875228994 223.22455206931883 L 488.2699875228994 223.22455206931883 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.15 205 L 489.15 205 L 489.15 205 L 488.2699875228994 223.22455206931883 L 488.2699875228994 223.22455206931883 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.15 205 L 489.15 205 L 489.15 205 L 300 205 L 300 205 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 153.66452687931812 324.84845350085334 L 153.66452687931812 324.84845350085334 L 142.51657517654587 309.7697160723244 L 132.91646605884847 293.6612383498903 L 124.95855521940669 276.6813442195562 L 118.72105783101954 258.996922376145 L 114.26527979996152 240.7817860400151 L 111.63501521436515 222.21496461534434 L 110.85611590936904 203.47894408059545 L 111.9362373796076 184.7578734056744 L 300 205 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 200.78060625846618 43.962009433915 L 200.78060625846618 43.962009433915 L 217.85258862493015 34.619469115819896 L 235.79416666076696 27.080542196153715 L 254.41541449612248 21.4250342109805 L 273.5192114158712 17.7128132093317 L 292.9033285391285 15.98317600230277 L 312.36256957275646 16.254432175060714 L 331.6909429772915 18.523710265326063 L 350.6838425511833 22.76698816008428 L 369.14021335013376 28.93934738875359 L 386.86468001355064 36.97544862091297 L 300 205 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 273.5192114158712 17.7128132093317 L 273.5192114158712 17.7128132093317 L 273.5192114158712 17.7128132093317 L 292.9033285391285 15.98317600230277 L 292.9033285391285 15.98317600230277 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 153.66452687931812 324.84845350085334 L 153.66452687931812 324.84845350085334 L 153.66452687931812 324.84845350085334 L 142.51657517654587 309.7697160723244 L 142.51657517654587 309.7697160723244 ');
                done();
            };
            pie.legendSettings.position = 'Top';
            pie.series = [{ dataSource: piedata, radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various 100% radius with legend position as Bottom', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 473.63000000000005 179 L 473.63000000000005 179 L 473.63000000000005 179 L 472.82219367486664 195.72920420722087 L 472.82219367486664 195.72920420722087 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 473.63000000000005 179 L 473.63000000000005 179 L 473.63000000000005 179 L 472.82219367486664 195.72920420722087 L 472.82219367486664 195.72920420722087 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 473.63000000000005 179 L 473.63000000000005 179 L 473.63000000000005 179 L 300 179 L 300 179 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 165.671540058451 289.0147342392448 L 165.671540058451 289.0147342392448 L 155.438292085137 275.1732265484414 L 146.62588422837885 260.38647007502755 L 139.32093017576307 244.79979802718236 L 133.59522744488459 228.56640566835875 L 129.50505171381084 211.8458446213472 L 127.09060370959676 194.80245469818786 L 126.37561409116441 177.60374866885428 L 127.36711020999877 160.41876584418316 L 300 179 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 208.92168471931 31.175383018824533 L 208.92168471931 31.175383018824533 L 224.59288904544871 22.59941011144494 L 241.062337601422 15.679061810828301 L 258.1556881784919 10.48759550648981 L 275.6919940689279 7.079966997283975 L 293.4856195307898 5.4922487405753495 L 311.34820488986367 5.741247996594183 L 329.0906604765907 7.824328910222391 L 346.5251682905734 11.719440413615843 L 363.4671702034562 17.38534965429176 L 379.73732165346445 24.762078477658577 L 300 179 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 275.6919940689279 7.079966997283975 L 275.6919940689279 7.079966997283975 L 275.6919940689279 7.079966997283976 L 293.4856195307898 5.49224874057535 L 293.4856195307898 5.4922487405753495 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 165.671540058451 289.0147342392448 L 165.671540058451 289.0147342392448 L 165.671540058451 289.0147342392448 L 155.438292085137 275.1732265484414 L 155.438292085137 275.1732265484414 ');
                done();
            };
            pie.legendSettings.position = 'Bottom';
            pie.series = [{ dataSource: piedata, radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with multiple points and various 100% radius with legend position as Custom', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 494 200 L 494 200 L 494 200 L 493.0974231004096 218.69184827622445 L 493.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 494 200 L 494 200 L 494 200 L 493.0974231004096 218.69184827622445 L 493.0974231004096 218.69184827622445 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 494 200 L 494 200 L 494 200 L 300 200 L 300 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 149.9123352608391 322.92149077010595 L 149.9123352608391 322.92149077010595 L 138.47853864261117 307.45611904853786 L 128.6322728808702 290.93460343578494 L 120.47031304554534 273.51932740467305 L 114.07287982668669 255.38145884732825 L 109.50285107688362 236.69926773334882 L 106.80514380960531 217.65637396445572 L 106.00627272755798 198.43994264676454 L 107.11408962011038 179.23884451864038 L 300 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 198.2365192394525 34.832830188630766 L 198.2365192394525 34.832830188630766 L 215.7462447435181 25.250737554687078 L 234.14786324181227 17.518504816567912 L 253.24657897038202 11.717983806133844 L 272.840216836791 7.910577650596622 L 292.7213626042344 6.13659077159258 L 312.67955853616047 6.414802230831498 L 332.5035312587605 8.742266938795979 L 351.983428257624 13.094346830855699 L 370.9130393334705 19.424971680772927 L 389.0919795010776 27.667126790679987 L 300 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.840216836791 7.910577650596622 L 272.840216836791 7.910577650596622 L 272.840216836791 7.910577650596623 L 292.7213626042344 6.136590771592581 L 292.7213626042344 6.13659077159258 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 149.9123352608391 322.92149077010595 L 149.9123352608391 322.92149077010595 L 149.9123352608391 322.92149077010595 L 138.47853864261117 307.45611904853786 L 138.47853864261117 307.45611904853786 ');
                done();
            };
            pie.legendSettings.position = 'Custom';
            pie.series = [{ dataSource: piedata, radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with depth', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 454.4779384803277 214.95347862097958 L 454.4779384803277 214.95347862097958 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 454.4779384803277 214.95347862097958 L 454.4779384803277 214.95347862097958 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 300 200 L 300 200 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.92986820867128 298.33719261608474 L 179.92986820867128 298.33719261608474 L 170.78283091408892 285.9648952388303 L 162.90581830469617 272.747682748628 L 156.37625043643627 258.81546192373844 L 151.25830386134933 244.3051670778626 L 147.60228086150687 229.35941418667906 L 145.44411504768422 214.1250991715646 L 144.80501818204638 198.75195411741163 L 145.69127169608828 183.3910756149123 L 300 200 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 218.589215391562 67.86626415090461 L 218.589215391562 67.86626415090461 L 232.5969957948145 60.200590043749656 L 247.31829059344983 54.014803853254335 L 262.5972631763056 49.37438704490706 L 278.2721734694328 46.32846212047727 L 294.1770900833875 44.90927261727404 L 310.1436468289284 45.13184178466517 L 326.0028250070084 46.99381355103677 L 341.58674260609916 50.47547746468453 L 356.73043146677645 55.53997734461831 L 371.27358360086214 62.13370143254397 L 300 200 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 278.2721734694328 46.32846212047727 L 278.2721734694328 46.32846212047727 L 278.2721734694328 46.32846212047727 L 294.1770900833875 44.90927261727404 L 294.1770900833875 44.90927261727404 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.92986820867128 298.33719261608474 L 179.92986820867128 298.33719261608474 L 179.92986820867128 298.33719261608474 L 170.78283091408892 285.9648952388303 L 170.78283091408892 285.9648952388303 ');
                done();
            };
            pie.depth = 100;
            pie.series = [{ dataSource: piedata, xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check pie series with rotation and tilt', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 303.00044685599744 195.65879555832672 L 296.99955314400256 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.90545586968122 301.18443413944834 L 179.90545586968122 301.18443413944834 L 170.56477182920614 289.0000997597555 L 162.46676547987892 275.98368642619454 L 155.6910289381125 262.26312734116516 L 150.30415825092828 247.97327647845353 L 146.3590988496263 233.25458315661137 L 143.8946251699851 218.25171161789635 L 142.93495955359663 203.11211918038526 L 143.48953417600652 187.98460693804535 L 296.99955314400256 204.34120444167323 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 213.3993266084406 74.21487694301695 L 213.3993266084406 74.21487694301695 L 227.14047116028888 66.66566165022581 L 241.62112964376954 60.57385145135018 L 256.6880127744594 56.00393300128161 L 272.1816256139047 53.00428252061003 L 287.9379559503684 51.60665369486195 L 303.7902104985057 51.8258415364902 L 319.5705805389169 53.65952576790279 L 335.1120183068757 57.08829538344593 L 350.2500053257484 62.075854130334115 L 364.82429396588634 68.56940473334666 L 296.99955314400256 204.34120444167323 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.1816256139047 53.00428252061003 L 272.1816256139047 53.00428252061003 L 278.18251932589953 44.32187363726351 L 293.9388496623632 42.92424481151543 L 287.9379559503684 51.60665369486195 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.90545586968122 301.18443413944834 L 179.90545586968122 301.18443413944834 L 185.90634958167604 292.50202525610183 L 176.56566554120096 280.317690876409 L 170.56477182920614 289.0000997597555 ');
                done();
            };
            pie.depth = 50;
            pie.rotation = 7;
            pie.tilt = 10;
            pie.series = [{ dataSource: piedata, xName: 'x', yName: 'y' }];
            pie.refresh();
        });




        it('Check donut series with single point and radius', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-25-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 231.1180077487687 242.55174525854693 L 231.1180077487687 242.55174525854693 L 237.1189014607635 233.8693363752004 L 233.30567454903996 226.7420497622588 L 227.30478083704517 235.42445864560534 ');
                Element = getElement(id + '-svg-40-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 257.06657431496967 138.15860636216365 L 257.06657431496967 138.15860636216365 L 263.0674680269645 129.47619747881714 L 270.1727217611084 125.84466356368242 L 264.17182804911357 134.52707244702893 ');
                Element = getElement(id + '-svg-12-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 322.36235707896486 277.0219721117725 L 322.36235707896486 277.0219721117725 L 328.36325079095974 268.339563228426 L 320.62044944361367 270.409893203859 L 314.6195557316188 279.0923020872055 ');
                done();
            };
            pie.series = [{ dataSource: [{ x: 1, y: 10 }], innerRadius: '30%', radius: '40%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 450.6424878335352 219.06750612211619 L 448.8126251116743 233.6567807952069 L 342.5434747343041 213.13587734773333 L 343.0924335508623 208.75909494580614 L 343.21250196442253 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 261.87132396170614 233.39417335100575 L 261.87132396170614 233.39417335100575 L 267.87221767370096 224.71176446765924 L 265.07001246155846 221.0564641537514 L 259.06911874956364 229.7388730370979 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 271.91948518333396 165.30330619207632 L 271.91948518333396 165.30330619207632 L 277.9203788953287 156.6208973087298 L 282.0427222608833 154.3561327208925 L 276.0418285488885 163.03854160423901 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.1816256139047 53.00428252061003 L 272.1816256139047 53.00428252061003 L 278.18251932589953 44.32187363726351 L 293.9388496623632 42.92424481151543 L 287.9379559503684 51.60665369486195 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.90545586968122 301.18443413944834 L 179.90545586968122 301.18443413944834 L 185.90634958167604 292.50202525610183 L 176.56566554120096 280.317690876409 L 170.56477182920614 289.0000997597555 ');
                done();
            };
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '80%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various radius', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 374.02113451136916 204.34120444167323 L 374.02113451136916 204.34120444167323 L 380.02202822336403 195.65879555832672 L 379.8219142007637 203.02194639854815 L 373.82102048876885 211.7043552818947 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 374.02113451136916 204.34120444167323 L 374.02113451136916 204.34120444167323 L 380.02202822336403 195.65879555832672 L 379.8219142007637 203.02194639854815 L 373.82102048876885 211.7043552818947 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 374.02113451136916 204.34120444167323 L 374.02113451136916 204.34120444167323 L 373.82102048876885 211.7043552818947 L 372.90608912783847 218.99899261844007 L 319.7715139391534 208.73854089470328 L 320.04599334743244 206.55014969373968 L 320.10602755421246 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 279.43543855285435 218.8676888963395 L 279.43543855285435 218.8676888963395 L 285.4363322648492 210.18528001299296 L 284.0352296587779 208.35762985603907 L 278.0343359467831 217.04003873938558 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 284.4595191636683 184.8222553168748 L 284.4595191636683 184.8222553168748 L 290.4604128756631 176.13984643352828 L 292.52158455844034 175.0074641396096 L 286.5206908464455 183.6898730229561 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 284.59058937895367 128.67274348114162 L 284.59058937895367 128.67274348114162 L 290.5914830909485 119.99033459779511 L 298.4696482591803 119.29152018492107 L 292.4687545471855 127.97392906826758 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 238.45250450684188 252.76281929056077 L 238.45250450684188 252.76281929056077 L 244.4533982188367 244.08041040721426 L 239.78305619859913 237.98824321736788 L 233.7821624866043 246.6706521007144 ');
                done();
            };
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '40%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various 100% radius', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.55350656241905 204.34120444167323 L 489.55350656241905 204.34120444167323 L 495.55440027441387 195.65879555832672 L 495.0541152179132 214.06667265888044 L 489.0532215059183 222.74908154222695 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.55350656241905 204.34120444167323 L 489.55350656241905 204.34120444167323 L 495.55440027441387 195.65879555832672 L 495.0541152179132 214.06667265888044 L 489.0532215059183 222.74908154222695 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.55350656241905 204.34120444167323 L 489.55350656241905 204.34120444167323 L 489.0532215059183 222.74908154222695 L 486.7658931035923 240.98567488359035 L 353.92945513187954 215.33454557424835 L 354.6156536525773 209.86356757183935 L 354.7657391695275 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 253.08926666613206 240.65741557833888 L 253.08926666613206 240.65741557833888 L 259.0901603781269 231.97500669499237 L 255.58740386294872 227.40588130260755 L 249.5865101509539 236.0882901859541 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 265.6494681931668 155.54383162967713 L 265.6494681931668 155.54383162967713 L 271.6503619051616 146.86142274633062 L 276.8032911121048 144.03046701153391 L 270.80239740010995 152.71287589488045 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 265.97714373138024 15.170052040344267 L 265.97714373138024 15.170052040344267 L 271.97803744337506 6.487643156997749 L 291.6734503639547 4.740607124812639 L 285.6725566519599 13.423016008159156 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 150.63193155110085 325.39524156389217 L 150.63193155110085 325.39524156389217 L 156.63282526309567 316.71283268054566 L 144.9569702125019 301.48241470592967 L 138.95607650050707 310.1648235892761 ');
                done();
            };
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various 100% radius with legend position as left', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 518.3373449600174 204.34120444167323 L 518.3373449600174 204.34120444167323 L 524.3382386720122 195.65879555832672 L 523.8379536155115 214.06667265888044 L 517.8370599035167 222.74908154222695 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 518.3373449600174 204.34120444167323 L 518.3373449600174 204.34120444167323 L 524.3382386720122 195.65879555832672 L 523.8379536155115 214.06667265888044 L 517.8370599035167 222.74908154222695 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 518.3373449600174 204.34120444167323 L 518.3373449600174 204.34120444167323 L 517.8370599035167 222.74908154222695 L 515.5497315011906 240.98567488359035 L 382.7132935294778 215.33454557424835 L 383.39949205017564 209.86356757183935 L 383.5495775671258 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 281.87310506373035 240.65741557833888 L 281.87310506373035 240.65741557833888 L 287.8739987757252 231.97500669499237 L 284.3712422605471 227.40588130260755 L 278.3703485485523 236.0882901859541 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 294.43330659076514 155.54383162967713 L 294.43330659076514 155.54383162967713 L 300.43420030275996 146.86142274633062 L 305.5871295097031 144.03046701153391 L 299.58623579770824 152.71287589488045 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 294.7609821289786 15.170052040344267 L 294.7609821289786 15.170052040344267 L 300.76187584097346 6.487643156997749 L 320.45728876155306 4.740607124812639 L 314.4563950495582 13.423016008159156 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.41576994869916 325.39524156389217 L 179.41576994869916 325.39524156389217 L 185.41666366069398 316.71283268054566 L 173.74080861010023 301.48241470592967 L 167.7399148981054 310.1648235892761 ');
                done();
            };
            pie.legendSettings = { visible: true, position: 'Left' };
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various 100% radius with legend position as Right', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 484.5907758042124 204.34120444167323 L 484.5907758042124 204.34120444167323 L 490.5916695162073 195.65879555832672 L 490.09138445970655 214.06667265888044 L 484.0904907477117 222.74908154222695 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 484.5907758042124 204.34120444167323 L 484.5907758042124 204.34120444167323 L 490.5916695162073 195.65879555832672 L 490.09138445970655 214.06667265888044 L 484.0904907477117 222.74908154222695 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 484.5907758042124 204.34120444167323 L 484.5907758042124 204.34120444167323 L 484.0904907477117 222.74908154222695 L 481.80316234538566 240.98567488359035 L 348.9667243736729 215.33454557424835 L 349.65292289437065 209.86356757183935 L 349.80300841132083 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 248.12653590792542 240.65741557833888 L 248.12653590792542 240.65741557833888 L 254.12742961992024 231.97500669499237 L 250.62467310474213 227.40588130260755 L 244.6237793927473 236.0882901859541 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 260.6867374349602 155.54383162967713 L 260.6867374349602 155.54383162967713 L 266.687631146955 146.86142274633062 L 271.8405603538982 144.03046701153391 L 265.83966664190336 152.71287589488045 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 261.0144129731736 15.170052040344267 L 261.0144129731736 15.170052040344267 L 267.0153066851684 6.487643156997749 L 286.71071960574807 4.740607124812639 L 280.70982589375325 13.423016008159156 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 145.66920079289426 325.39524156389217 L 145.66920079289426 325.39524156389217 L 151.67009450488908 316.71283268054566 L 139.99423945429527 301.48241470592967 L 133.99334574230045 310.1648235892761 ');
                done();
            };
            pie.legendSettings.position = 'Right';
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various 100% radius with legend position as Top', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 484.84546967393743 209.26524320673425 L 484.84546967393743 209.26524320673425 L 490.8463633859323 200.58283432338774 L 490.35858545584415 218.5305144964276 L 484.3576917438493 227.21292337977414 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 484.84546967393743 209.26524320673425 L 484.84546967393743 209.26524320673425 L 490.8463633859323 200.58283432338774 L 490.35858545584415 218.5305144964276 L 484.3576917438493 227.21292337977414 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 484.84546967393743 209.26524320673425 L 484.84546967393743 209.26524320673425 L 484.3576917438493 227.21292337977414 L 482.1275465515815 244.99360188760343 L 352.61201952916144 219.98375081099502 L 353.28106308684175 214.6495472586462 L 353.4273964658682 209.26524320673425 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 254.29283577505763 244.6735490649833 L 254.29283577505763 244.6735490649833 L 260.2937294870524 235.99114018163678 L 256.87854188475376 231.5362429240616 L 250.8776481727589 240.21865180740812 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 266.53903226391657 161.68780471503808 L 266.53903226391657 161.68780471503808 L 272.5399259759114 153.00539583169154 L 277.5640319526809 150.2452139902648 L 271.5631382406861 158.9276228736113 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 266.85851591367464 24.823369615438526 L 266.85851591367464 24.823369615438526 L 272.85940962566946 16.140960732092005 L 292.06243722323455 14.437600600711535 L 286.06154351123973 23.120009484058055 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 154.39693403790227 327.29292940089766 L 154.39693403790227 327.29292940089766 L 160.3978277498971 318.6105205175512 L 149.01386907556807 303.7608629923006 L 143.01297536357325 312.4432718756471 ');
                done();
            };
            pie.legendSettings.position = 'Top';
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various 100% radius with legend position as Bottom', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 468.8909312761742 183.66024162841686 L 468.8909312761742 183.66024162841686 L 474.891824988169 174.97783274507034 L 474.44406986260094 191.45288275006592 L 468.44317615060606 200.13529163341244 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 468.8909312761742 183.66024162841686 L 468.8909312761742 183.66024162841686 L 474.891824988169 174.97783274507034 L 474.44406986260094 191.45288275006592 L 468.44317615060606 200.13529163341244 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 468.8909312761742 183.66024162841686 L 468.8909312761742 183.66024162841686 L 468.44317615060606 200.13529163341244 L 466.39601723052425 216.45704267393265 L 347.5074052458412 193.4992819420716 L 348.1215529218657 188.60275662991555 L 348.2558794595362 183.66024162841686 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 257.2554365689973 216.16325059573262 L 257.2554365689973 216.16325059573262 L 263.25633028099213 207.4808417123861 L 260.1213631999077 203.39147448620173 L 254.12046948791289 212.07388336954824 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 268.4968169356934 139.98659296168034 L 268.4968169356934 139.98659296168034 L 274.4977106476882 131.30418407833383 L 279.1095822879023 128.7704786956908 L 273.1086885759075 137.45288757903734 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 268.79008654239436 14.352060229227439 L 268.79008654239436 14.352060229227439 L 274.7909802543892 5.66965134588092 L 292.41837481830805 4.106054097075237 L 286.4174811063132 12.788462980421754 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 165.55612164104443 292.0036048528027 L 165.55612164104443 292.0036048528027 L 171.55701535303922 283.3211959694562 L 161.10712508275776 269.6899718821749 L 155.10623137076294 278.3723807655215 ');
                done();
            };
            pie.legendSettings.position = 'Bottom';
            pie.series = [{ dataSource: piedata, innerRadius: '30%', radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with multiple points and various 100% radius with legend position as Custom', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.55350656241905 204.34120444167323 L 489.55350656241905 204.34120444167323 L 495.55440027441387 195.65879555832672 L 495.0541152179132 214.06667265888044 L 489.0532215059183 222.74908154222695 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.55350656241905 204.34120444167323 L 489.55350656241905 204.34120444167323 L 495.55440027441387 195.65879555832672 L 495.0541152179132 214.06667265888044 L 489.0532215059183 222.74908154222695 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 489.55350656241905 204.34120444167323 L 489.55350656241905 204.34120444167323 L 489.0532215059183 222.74908154222695 L 486.7658931035923 240.98567488359035 L 353.92945513187954 215.33454557424835 L 354.6156536525773 209.86356757183935 L 354.7657391695275 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 253.08926666613206 240.65741557833888 L 253.08926666613206 240.65741557833888 L 259.0901603781269 231.97500669499237 L 255.58740386294872 227.40588130260755 L 249.5865101509539 236.0882901859541 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 265.6494681931668 155.54383162967713 L 265.6494681931668 155.54383162967713 L 271.6503619051616 146.86142274633062 L 276.8032911121048 144.03046701153391 L 270.80239740010995 152.71287589488045 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 265.97714373138024 15.170052040344267 L 265.97714373138024 15.170052040344267 L 271.97803744337506 6.487643156997749 L 291.6734503639547 4.740607124812639 L 285.6725566519599 13.423016008159156 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 150.63193155110085 325.39524156389217 L 150.63193155110085 325.39524156389217 L 156.63282526309567 316.71283268054566 L 144.9569702125019 301.48241470592967 L 138.95607650050707 310.1648235892761 ');
                done();
            };
            pie.legendSettings.position = 'Custom';
            pie.series = [{ dataSource: piedata, animation: { enable: true }, innerRadius: '30%', radius: '100%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with data label', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 450.6424878335352 219.06750612211619 L 448.8126251116743 233.6567807952069 L 342.5434747343041 213.13587734773333 L 343.0924335508623 208.75909494580614 L 343.21250196442253 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 261.87132396170614 233.39417335100575 L 261.87132396170614 233.39417335100575 L 267.87221767370096 224.71176446765924 L 265.07001246155846 221.0564641537514 L 259.06911874956364 229.7388730370979 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 271.91948518333396 165.30330619207632 L 271.91948518333396 165.30330619207632 L 277.9203788953287 156.6208973087298 L 282.0427222608833 154.3561327208925 L 276.0418285488885 163.03854160423901 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.1816256139047 53.00428252061003 L 272.1816256139047 53.00428252061003 L 278.18251932589953 44.32187363726351 L 293.9388496623632 42.92424481151543 L 287.9379559503684 51.60665369486195 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.90545586968122 301.18443413944834 L 179.90545586968122 301.18443413944834 L 185.90634958167604 292.50202525610183 L 176.56566554120096 280.317690876409 L 170.56477182920614 289.0000997597555 ');
                done();
            };
            pie.series = [
                {
                    dataSource: piedata, innerRadius: '30%', xName: 'x', yName: 'y',
                    dataLabel: { visible: true, position: 'Inside' }
                }
            ];
            pie.refresh();
        });
        it('Check donut series with depth', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 448.04226902273837 208.6824088833465 L 448.04226902273837 208.6824088833465 L 460.04405644672795 191.31759111665346 L 459.6438284015274 206.04389279709642 L 447.64204097753776 223.40871056378947 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 448.04226902273837 208.6824088833465 L 448.04226902273837 208.6824088833465 L 460.04405644672795 191.31759111665346 L 459.6438284015274 206.04389279709642 L 447.64204097753776 223.40871056378947 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 448.04226902273837 208.6824088833465 L 448.04226902273837 208.6824088833465 L 447.64204097753776 223.40871056378947 L 445.81217825567694 237.9979852368802 L 339.54302787830665 217.4770817894066 L 340.0919866948649 213.10029938747942 L 340.2120551084251 208.6824088833465 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 258.87087710570876 237.73537779267903 L 258.87087710570876 237.73537779267903 L 270.87266452969834 220.37056002598598 L 268.07045931755584 216.71525971207814 L 256.0686718935662 234.0800774787712 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 268.9190383273365 169.6445106337496 L 268.9190383273365 169.6445106337496 L 280.92082575132616 152.27969286705655 L 285.04316911688073 150.01492827921925 L 273.04138169289104 167.3797460459123 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 269.1811787579073 57.34548696228331 L 269.1811787579073 57.34548696228331 L 281.1829661818969 39.98066919559027 L 296.9392965183606 38.58304036984219 L 284.93750909437097 55.947858136535224 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 176.90500901368378 305.52563858112165 L 176.90500901368378 305.52563858112165 L 188.90679643767342 288.1608208144286 L 179.56611239719837 275.9764864347358 L 167.56432497320873 293.34130420142884 ');
                done();
            };
            pie.depth = 100;
            pie.series = [{ dataSource: piedata, innerRadius: '30%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with rotation and tilt', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 450.6424878335352 219.06750612211619 L 448.8126251116743 233.6567807952069 L 342.5434747343041 213.13587734773333 L 343.0924335508623 208.75909494580614 L 343.21250196442253 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 261.87132396170614 233.39417335100575 L 261.87132396170614 233.39417335100575 L 267.87221767370096 224.71176446765924 L 265.07001246155846 221.0564641537514 L 259.06911874956364 229.7388730370979 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 271.91948518333396 165.30330619207632 L 271.91948518333396 165.30330619207632 L 277.9203788953287 156.6208973087298 L 282.0427222608833 154.3561327208925 L 276.0418285488885 163.03854160423901 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.1816256139047 53.00428252061003 L 272.1816256139047 53.00428252061003 L 278.18251932589953 44.32187363726351 L 293.9388496623632 42.92424481151543 L 287.9379559503684 51.60665369486195 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.90545586968122 301.18443413944834 L 179.90545586968122 301.18443413944834 L 185.90634958167604 292.50202525610183 L 176.56566554120096 280.317690876409 L 170.56477182920614 289.0000997597555 ');
                done();
            };
            pie.depth = 50;
            pie.rotation = 7;
            pie.tilt = 10;
            pie.series = [{ dataSource: piedata, innerRadius: '30%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with explodeIndex', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 457.0436095907306 195.65879555832672 L 456.64338154553 210.38509723876967 L 450.6424878335352 219.06750612211619 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 451.04271587873575 204.34120444167323 L 451.04271587873575 204.34120444167323 L 450.6424878335352 219.06750612211619 L 448.8126251116743 233.6567807952069 L 342.5434747343041 213.13587734773333 L 343.0924335508623 208.75909494580614 L 343.21250196442253 204.34120444167323 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 261.87132396170614 233.39417335100575 L 261.87132396170614 233.39417335100575 L 267.87221767370096 224.71176446765924 L 265.07001246155846 221.0564641537514 L 259.06911874956364 229.7388730370979 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 271.91948518333396 165.30330619207632 L 271.91948518333396 165.30330619207632 L 277.9203788953287 156.6208973087298 L 282.0427222608833 154.3561327208925 L 276.0418285488885 163.03854160423901 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 272.1816256139047 53.00428252061003 L 272.1816256139047 53.00428252061003 L 278.18251932589953 44.32187363726351 L 293.9388496623632 42.92424481151543 L 287.9379559503684 51.60665369486195 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 179.90545586968122 301.18443413944834 L 179.90545586968122 301.18443413944834 L 185.90634958167604 292.50202525610183 L 176.56566554120096 280.317690876409 L 170.56477182920614 289.0000997597555 ');
                done();
            };
            pie.series = [{ dataSource: piedata, explode: true, explodeIndex: 1, innerRadius: '30%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
        it('Check donut series with explodeAll', (done: Function) => {
            pie.loaded = () => {
                let Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 497.13559628559557 208.75909494580614 L 497.13559628559557 208.75909494580614 L 503.13648999759045 200.07668606245963 L 502.7362619523898 214.8029877429026 L 496.7353682403949 223.4853966262491 ');
                Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 497.13559628559557 208.75909494580614 L 497.13559628559557 208.75909494580614 L 503.13648999759045 200.07668606245963 L 502.7362619523898 214.8029877429026 L 496.7353682403949 223.4853966262491 ');
                Element = getElement(id + '-svg-4-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 497.13559628559557 208.75909494580614 L 497.13559628559557 208.75909494580614 L 496.7353682403949 223.4853966262491 L 494.90550551853414 238.0746712993398 L 388.63635514116385 217.55376785186624 L 389.1853139577221 213.17698544993902 L 389.30538237128235 208.75909494580614 ');
                Element = getElement(id + '-svg-8-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 217.86270549378386 246.48379496203987 L 217.86270549378386 246.48379496203987 L 223.86359920577868 237.80138607869333 L 221.06139399363616 234.1460857647855 L 215.06050028164134 242.82849464813202 ');
                Element = getElement(id + '-svg-10-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 269.2010060252437 119.48294096803293 L 269.2010060252437 119.48294096803293 L 275.20189973723853 110.80053208468642 L 279.324243102793 108.53576749684909 L 273.32334939079817 117.21817638019562 ');
                Element = getElement(id + '-svg-4-region-series-0-point-8');
                expect(Element.getAttribute('d')).toBe('M 269.4631464558144 7.183917296566642 L 269.4631464558144 7.183917296566642 L 275.46404016780923 -1.4984915867798756 L 291.220370504273 -2.896120412527959 L 285.2194767922781 5.78628847081856 ');
                Element = getElement(id + '-svg-0-region-series-0-point-6');
                expect(Element.getAttribute('d')).toBe('M 135.8968374017589 314.27405575048243 L 135.8968374017589 314.27405575048243 L 141.8977311137537 305.5916468671359 L 132.55704707327868 293.40731248744316 L 126.55615336128386 302.0897213707897 ');
                done();
            };
            pie.series = [{ dataSource: piedata, explode: true, explodeAll: true, innerRadius: '30%', xName: 'x', yName: 'y' }];
            pie.refresh();
        });
    });
    describe('Checking Pie series themes and palletes', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: true, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: false }
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('Check Material theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#404041');
                expect(points[3].color).toBe('#e56590');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#00AA9C');
                done();
            };
            pie.theme = 'Material';
            pie.refresh();
        });
        it('Check Fabric theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#ed7d31');
                expect(points[3].color).toBe('#70ad47');
                const Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('fill')).toBe('#3D66B0');
                done();
            };
            pie.theme = 'Fabric';
            pie.refresh();
        });
        it('Check Bootstrap theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#f7ce69');
                expect(points[3].color).toBe('#7ddf1e');
                const Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('fill')).toBe('#9063CE');
                done();
            };
            pie.theme = 'Bootstrap';
            pie.refresh();
        });
        it('Check HighcontrastLight theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#E98272');
                expect(points[3].color).toBe('#C6E773');
                const Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('fill')).toBe('#6CD4CD');
                done();
            };
            pie.theme = 'HighContrastLight';
            pie.refresh();
        });
        it('Check MaterialDark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#56AEFF');
                expect(points[3].color).toBe('#61EAA9');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#8EB607');
                done();
            };
            pie.theme = 'MaterialDark';
            pie.refresh();
        });
        it('Check FabricDark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#ed7d31');
                expect(points[3].color).toBe('#70ad47');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#3D66B0');
                done();
            };
            pie.theme = 'FabricDark';
            pie.refresh();
        });
        it('Check Highcontrast theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#E98272');
                expect(points[3].color).toBe('#C6E773');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#6CD4CD');
                done();
            };
            pie.theme = 'HighContrast';
            pie.refresh();
        });
        it('Check BootstrapDark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#f7ce69');
                expect(points[3].color).toBe('#7ddf1e');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#9063CE');
                done();
            };
            pie.series[0].dataLabel.position = 'Outside';
            pie.theme = 'BootstrapDark';
            pie.refresh();
        });
        it('Check Bootstrap4 theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#f7ce69');
                expect(points[3].color).toBe('#7ddf1e');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#9063CE');
                done();
            };
            pie.theme = 'Bootstrap4';
            pie.refresh();
        });
        it('Check Tailwind theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#65A30D');
                expect(points[3].color).toBe('#14B8A6');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#5157DD');
                done();
            };
            pie.theme = 'Tailwind';
            pie.refresh();
        });
        it('Check TailwindDark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#22D3EE');
                expect(points[3].color).toBe('#4ADE80');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#7D52DD');
                done();
            };
            pie.theme = 'TailwindDark';
            pie.refresh();
        });
        it('Check Bootstrap5 theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#6610F2');
                expect(points[3].color).toBe('#D63384');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#E37112');
                done();
            };
            pie.theme = 'Bootstrap5';
            pie.refresh();
        });
        it('Check Bootstrap5Dark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#6610F2');
                expect(points[3].color).toBe('#D63384');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#E37112');
                done();
            };
            pie.theme = 'Bootstrap5Dark';
            pie.refresh();
        });
        it('Check Fluent theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#DA4CB2');
                expect(points[3].color).toBe('#AF4BCF');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#17B4CF');
                done();
            };
            pie.theme = 'Fluent';
            pie.refresh();
        });
        it('Check FluentDark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#DA4CB2');
                expect(points[3].color).toBe('#AF4BCF');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#17B4CF');
                done();
            };
            pie.theme = 'FluentDark';
            pie.refresh();
        });
        it('Check Material3 theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#00AEE0');
                expect(points[3].color).toBe('#F7523F');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#594CB3');
                done();
            };
            pie.theme = 'Material3';
            pie.refresh();
        });
        it('Check Material3Dark theme  ', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[1].color).toBe('#FA4EAB');
                expect(points[3].color).toBe('#17EA58');
                const element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(element.getAttribute('fill')).toBe('#4699E5');
                done();
            };
            pie.theme = 'Material3Dark';
            pie.refresh();
        });
        it('Checking with pallets', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].color).toBe('red');
                expect(points[1].color).toBe('green');
                expect(points[2].color).toBe('blue');
                expect(points[3].color).toBe('yellow');
                expect(points[4].color).toBe('orange');
                expect(points[5].color).toBe('pink');
                expect(points[6].color).toBe('black');
                expect(points[7].color).toBe('violet');
                expect(points[8].color).toBe('purple');
                done();
            };
            pie.series[0].palettes = ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'black', 'violet', 'purple'];
            pie.refresh();
        });
        it('Checking with Fluent2 theme', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].color).toBe('#6200EE');
                expect(points[1].color).toBe('#09AF74');
                expect(points[2].color).toBe('#0076E5');
                expect(points[3].color).toBe('#CB3587');
                expect(points[4].color).toBe('#E7910F');
                expect(points[5].color).toBe('#0364DE');
                expect(points[6].color).toBe('#66CD15');
                expect(points[7].color).toBe('#F3A93C');
                expect(points[8].color).toBe('#107C10');
                done();
            };
            pie.theme = 'Fluent2';
            pie.series[0].palettes = [];
            pie.refresh();
        });
        it('Checking with Fluent2 dark theme', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].color).toBe('#9BB449');
                expect(points[1].color).toBe('#2A72D5');
                expect(points[2].color).toBe('#43B786');
                expect(points[3].color).toBe('#3F579A');
                expect(points[4].color).toBe('#584EC6');
                expect(points[5].color).toBe('#E85F9C');
                expect(points[6].color).toBe('#6E7A89');
                expect(points[7].color).toBe('#EA6266');
                expect(points[8].color).toBe('#0B6A0B');
                done();
            };
            pie.theme = 'Fluent2Dark';
            pie.refresh();
        });
    });
    describe('Checking empty point settings', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: [{ x: 'America', y: null }, { x: 'England', y: 14 }, { x: 'Germany', y: 12 }], xName: 'x', yName: 'y', animation: { enable: false },
                        innerRadius: '40%',
                        radius: '80%',
                        palettes: ['red', 'green', 'blue', 'yellow', 'brown', 'black', 'orange', 'pink', 'purple', 'skyblue'],
                        dataLabel: {
                            name: 'text', visible: true, position: 'Inside'
                        },
                        emptyPointSettings: { mode: 'Average', fill: 'red' }
                    }
                ], width: '600', height: '400', legendSettings: { visible: false }
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('Checking empty point settings mode as Zero', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].y).toBe(0);
                expect(points[0].color).toBe('blue');
                const Element: Element = getElement(id + '-svg-0-region-series-0-point-1');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 454.38506585076016 215.8836847820795 L 454.38506585076016 215.8836847820795 ');
                done();
            };
            pie.series[0].emptyPointSettings.mode = 'Zero';
            pie.series[0].emptyPointSettings.fill = 'blue';
            pie.refresh();
        });
        it('Checking empty point settings mode as Average', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].y).toBe(7);
                expect(points[0].color).toBe('green');
                const Element: Element = getElement(id + '-svg-0-region-series-0-point-0');
                expect(Element.getAttribute('d')).toBe('M 455.2000000000001 200 L 455.2000000000001 200 L 455.2000000000001 200 L 454.38506585076016 215.8836847820795 L 454.38506585076016 215.8836847820795 ');
                done();
            };
            pie.series[0].emptyPointSettings.mode = 'Average';
            pie.series[0].emptyPointSettings.fill = 'green';
            pie.refresh();
        });
        it('Checking empty point settings mode as Drop', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].y).toBe(null);
                done();
            };
            pie.rotation = 180;
            pie.series[0].emptyPointSettings.mode = 'Drop';
            pie.refresh();
        });
        it('Checking empty point settings mode as Gap', (done: Function) => {
            pie.loaded = () => {
                const points: CircularChart3DPoints[] = pie.visibleSeries[0].points;
                expect(points[0].y).toBe(null);
                done();
            };
            pie.tilt = 180;
            pie.series[0].emptyPointSettings.mode = 'Gap';
            pie.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
