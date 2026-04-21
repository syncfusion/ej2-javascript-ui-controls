/**
 * Common spec - core team provided codes
 */
interface Window {
    performance: { memory: any };
}

declare var window: Window

export const inMB = (n: any) => n / 1000000;

function runningAverage(arr: any, newVal: any, oldAvg: any) {
    return ((oldAvg * (arr.length - 1) + newVal) / arr.length);
};
export const profile = {
    samples: [] as any,
    diffs: [] as any,
    averageUsage: 0,
    averageChange: 0,
    //Collects a sample of memory and updates all the values in the
    //profile object
    sample() {
        let newSample = getMemoryProfile();
        this.samples.push(newSample);
        this.averageUsage = runningAverage(this.samples, newSample, this.averageUsage);
        let sampleLen: any = this.samples.length;
        if (sampleLen >= 2) {
            let newDiff = this.samples[sampleLen - 1] - this.samples[sampleLen - 2];
            this.diffs.push(newDiff);
            this.averageChange = runningAverage(this.diffs, newDiff, this.averageChange);
        }
    }
}

export const getMemoryProfile = () => {
    return window.performance.memory.usedJSHeapSize; //Return used memory
};
