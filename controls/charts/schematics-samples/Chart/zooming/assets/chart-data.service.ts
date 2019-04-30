/**
 * chart data source
 */
export class ChartDataService {
    GetCrosshairData(): any {
        let series1: Object[] = [];
        let series2: Object[] = [];
        let point1: Object;
        let point2: Object;
        let value: number = 60;
        let value1: number = 50;
        let i: number;
        for (i = 1; i < 250; i++) {

            if (Math.random() > .5) {
                value += Math.random();
                value1 += Math.random();
            } else {
                value -= Math.random();
                value1 -= Math.random();
            }
            point1 = { x: new Date(2000, i, 1), y: value };
            point2 = { x: new Date(2000, i, 1), y: value1 };
            series1.push(point1);
            series2.push(point2);
        }
        return { 'series1': series1, 'series2': series2 };
    }
    GetScatterData(): any {
        let series1: Object[] = [];
        let series2: Object[] = [];
        let point1: Object;
        let value: number = 80;
        let value1: number = 70;
        let i: number;
        for (i = 1; i < 120; i++) {
            if (Math.random() > 0.5) {
                value += Math.random();
            } else {
                value -= Math.random();
            }
            value = value < 60 ? 60 : value > 90 ? 90 : value;
            point1 = { x: (145 + (i / 3)).toFixed(1), y: value.toFixed(1) };
            series1.push(point1);
        }
        for (i = 1; i < 120; i++) {
            if (Math.random() > 0.5) {
                value1 += Math.random();
            } else {
                value1 -= Math.random();
            }
            value1 = value1 < 60 ? 60 : value1 > 90 ? 90 : value1;
            point1 = { x: (145 + (i / 3)).toFixed(1), y: value1.toFixed(1) };
            series2.push(point1);
        }
        return { 'series1': series1, 'series2': series2 };
    }
    GetLocalData(): any {
        let series1: Object[] = [];
        let series2: Object[] = [];
        let point1: Object;
        let point2: Object;
        let value: number = 80;
        let value1: number = 90;
        let i: number;
        for (i = 1; i < 500; i++) {

            if (Math.random() > .5) {
                value += Math.random();
                value1 += Math.random();
            } else {
                value -= Math.random();
                value1 -= Math.random();
            }
            point1 = { x: new Date(1960, (i + 1), i), y: Math.round(value) };
            point2 = { x: new Date(1960, (i + 1), i), y: Math.round(value1) };
            series1.push(point1);
            series2.push(point2);
        }
        return { 'series1': series1, 'series2': series2 };
    }
    GetZoomingData(): any {
        let series1: Object[] = [];
        let point1: Object;
        let value: number = 80;
        let i: number;
        for (i = 1; i < 500; i++) {
            if (Math.random() > .5) {
                value += Math.random();
            } else {
                value -= Math.random();
            }
            point1 = { x: new Date(1950, i + 2, i), y: value.toFixed(1) };
            series1.push(point1);
        }
        return { 'series1': series1 };
    }
    GetPolarSplineData(): any {
        let cardData: Object[] = [];
        let biDirData: Object[] = [];
        let omniDirData: Object[] = [];
        let point1: Object;
        let point2: Object;
    
        for (let x: number = -180; x < 180; x++) {
          point1 = { x: x, y: -12.6 * (1 - Math.cos(x * 3.14 / 180)) };
          cardData.push(point1);
          point2 = { x: x, y: -3};
          omniDirData.push(point2);
        }
    
        for (let x: number = -180; x < -90; x++) {
          point1 = { x: x, y: -26 * (1 + Math.cos(x * 3.14 / 180))};
          biDirData.push(point1);
        }
    
        for (let x: number = -90; x < 90; x++) {
          point1 = { x: x, y: -26 * (1 - Math.cos(x * 3.14 / 180))};
          biDirData.push(point1);
        }
    
        for (let x: number = 90; x < 180; x++) {
          point1 = { x: x, y: -26 * (1 + Math.cos(x * 3.14 / 180))};
          biDirData.push(point1);
        }
        return { 'series1': cardData, 'series2': omniDirData, 'series3': biDirData };
    }
}