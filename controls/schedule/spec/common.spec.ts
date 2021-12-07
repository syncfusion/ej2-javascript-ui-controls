/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Memory Leak Unit Testing
 */

interface Window {
    performance: { memory: any };
}

declare let window: Window;

export const inMB: (n: any) => number = (n: any) => n / 1000000;

const runningAverage: any = (arr: any, newVal: any, oldAvg: any) => ((oldAvg * (arr.length - 1) + newVal) / arr.length);

export const profile: any = {
    samples: [] as any,
    diffs: [] as any,
    averageUsage: 0,
    averageChange: 0, //Collects a sample of memory and updates all the values in the profile object
    sample(): void {
        const newSample: any = getMemoryProfile();
        this.samples.push(newSample);
        this.averageUsage = runningAverage(this.samples, newSample, this.averageUsage);
        const sampleLen: any = this.samples.length;
        if (sampleLen >= 2) {
            const newDiff: number = this.samples[sampleLen - 1] - this.samples[sampleLen - 2];
            this.diffs.push(newDiff);
            this.averageChange = runningAverage(this.diffs, newDiff, this.averageChange);
        }
    }
};

export const getMemoryProfile: any = () => window.performance.memory.usedJSHeapSize; //Return used memory

//Check average change in memory samples to not be over 10MB
//Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
