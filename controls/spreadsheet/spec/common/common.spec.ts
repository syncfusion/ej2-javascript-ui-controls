/**
 * Memory leak common definition.
 */
interface Window {
    // tslint:disable-next-line:no-any
    performance: { memory: any };
}

declare var window: Window;

// tslint:disable-next-line:no-any
export const inMB: any = (n: any) => n / 1000000;

// tslint:disable-next-line:no-any
function runningAverage(arr: any, newVal: any, oldAvg: any) {
    return ((oldAvg * (arr.length - 1) + newVal) / arr.length);
};

// tslint:disable-next-line:no-any
export const getMemoryProfile: any = () => {
    return window.performance.memory.usedJSHeapSize; // return used memory
};

// tslint:disable-next-line:no-any
export const profile: any = {
    // tslint:disable-next-line:no-any
    samples: [] as any,
    // tslint:disable-next-line:no-any
    diffs: [] as any,
    averageUsage: 0,
    averageChange: 0,
    // collects a sample of memory and updates all the values in the
    // profile object
    sample(): void {
        // tslint:disable-next-line:no-any
        let newSample: any = getMemoryProfile();
        this.samples.push(newSample);
        this.averageUsage = runningAverage(this.samples, newSample, this.averageUsage);
        // tslint:disable-next-line:no-any
        let sampleLen: any = this.samples.length;
        if (sampleLen >= 2) {
            // tslint:disable-next-line:no-any
            let newDiff: any = this.samples[sampleLen - 1] - this.samples[sampleLen - 2];
            this.diffs.push(newDiff);
            this.averageChange = runningAverage(this.diffs, newDiff, this.averageChange);
        }
    }
};