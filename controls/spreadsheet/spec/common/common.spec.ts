/**
 * Memory leak common definition.
 */
interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    performance: { memory: any };
}

declare var window: Window;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inMB: any = (n: any) => n / 1000000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function runningAverage(arr: any, newVal: any, oldAvg: any) {
    return ((oldAvg * (arr.length - 1) + newVal) / arr.length);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMemoryProfile: any = () => {
    return window.performance.memory.usedJSHeapSize; // return used memory
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const profile: any = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    samples: [] as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    diffs: [] as any,
    averageUsage: 0,
    averageChange: 0,
    // collects a sample of memory and updates all the values in the
    // profile object
    sample(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let newSample: any = getMemoryProfile();
        this.samples.push(newSample);
        this.averageUsage = runningAverage(this.samples, newSample, this.averageUsage);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sampleLen: any = this.samples.length;
        if (sampleLen >= 2) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let newDiff: any = this.samples[sampleLen - 1] - this.samples[sampleLen - 2];
            this.diffs.push(newDiff);
            this.averageChange = runningAverage(this.diffs, newDiff, this.averageChange);
        }
    }
};