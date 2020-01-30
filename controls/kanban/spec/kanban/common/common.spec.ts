/**
 * Memory Leak Unit Testing
 */

// tslint:disable:no-any
interface Window {
    performance: { memory: any };
}

declare var window: Window;

export const inMB: (n: any) => number = (n: any) => n / 1000000;

let runningAverage: any = (arr: any, newVal: any, oldAvg: any) => ((oldAvg * (arr.length - 1) + newVal) / arr.length);

export const profile: any = {
    samples: [] as any,
    diffs: [] as any,
    averageUsage: 0,
    averageChange: 0,
    //Collects a sample of memory and updates all the values in the profile object
    sample(): void {
        let newSample: any = getMemoryProfile();
        this.samples.push(newSample);
        this.averageUsage = runningAverage(this.samples, newSample, this.averageUsage);
        let sampleLen: any = this.samples.length;
        if (sampleLen >= 2) {
            let newDiff: number = this.samples[sampleLen - 1] - this.samples[sampleLen - 2];
            this.diffs.push(newDiff);
            this.averageChange = runningAverage(this.diffs, newDiff, this.averageChange);
        }
    }
};

export const getMemoryProfile: any = () => window.performance.memory.usedJSHeapSize; //Return used memory

// tslint:enable:no-any
