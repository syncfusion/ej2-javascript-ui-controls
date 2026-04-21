interface Window {
    performance: { memory: any };
}

declare var window: Window

export const inMB: any = (n: any) => n / 1000000;

function runningAverage(arr: any, newVal: any, oldAvg: any) {
    
    return ((oldAvg * (arr.length - 1) + newVal) / arr.length);
};

export const getMemoryProfile: any = () => {

    return window.performance.memory.usedJSHeapSize; // return used memory
};

export const profile: any = {
    samples: [] as any,
    diffs: [] as any,
    averageUsage: 0,
    averageChange: 0,
    // collects a sample of memory and updates all the values in the
    // profile object
    sample() {
        let newSample: any = getMemoryProfile();
        this.samples.push(newSample);
        this.averageUsage = runningAverage(this.samples, newSample, this.averageUsage);
        let sampleLen: any = this.samples.length;
        if (sampleLen >= 2) {
            let newDiff: any = this.samples[sampleLen - 1] - this.samples[sampleLen - 2];
            this.diffs.push(newDiff);
            this.averageChange = runningAverage(this.diffs, newDiff, this.averageChange);
        }
    }
};
