// spec/maps/common.spec.ts

interface Window {
  performance: {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
    measureUserAgentSpecificMemory?: () => Promise<{ bytes: number }>;
  };
  gc?: () => void;
}

declare const window: Window;

// Convert bytes to MB
export const inMB = (n: number) => n / (1024 * 1024);

// Small async delay
export const wait = (ms = 20) => new Promise<void>(r => setTimeout(r, ms));

// Try to force GC when available (requires chrome flag --js-flags=--expose-gc)
// Will safely no-op if not available.
export async function forceGC(): Promise<void> {
  try {
    if (typeof window.gc === 'function') {
      window.gc();
      window.gc();
      await wait(20);
    }
  } catch {
    // Ignore if not permitted
  }
}

// Get current memory usage in bytes using best available API.
// - Prefer measureUserAgentSpecificMemory (more stable; async)
// - Fallback to performance.memory.usedJSHeapSize (sync)
export async function currentMemoryBytes(): Promise<number> {
  await forceGC();
  if (typeof window.performance.measureUserAgentSpecificMemory === 'function') {
    try {
      const res = await window.performance.measureUserAgentSpecificMemory();
      return res.bytes;
    } catch {
      // Fall through to performance.memory if measure fails
    }
  }
  const used = window.performance.memory.usedJSHeapSize;
  return typeof used === 'number' ? used : 0;
}

// Convenience: get current memory usage in MB
export async function sampleMemoryMB(): Promise<number> {
  const bytes = await currentMemoryBytes();
  return inMB(bytes);
}

// Legacy sync accessor used by older tests; fallback only.
// Returns bytes (for compatibility with inMB(getMemoryProfile()))
export function getMemoryProfile(): number {
  const memory = (performance as any).memory;
  
  if (memory && typeof memory.usedJSHeapSize === 'number') {
    return memory.usedJSHeapSize;
  }
  
  return 0;
}

// Simple profiler to collect MB samples and average delta between samples
export class MemoryProfiler {
  public samples: number[] = [];
  public diffs: number[] = [];
  public averageUsageMB = 0;
  public averageChangeMB = 0;

  private runningAverage(arr: number[], newVal: number, oldAvg: number) {
    return ((oldAvg * (arr.length - 1) + newVal) / arr.length);
  }

  async sample(): Promise<void> {
    const mb = await sampleMemoryMB(); // GC is triggered inside sampleMemoryMB
    this.samples.push(mb);
    this.averageUsageMB = this.runningAverage(this.samples, mb, this.averageUsageMB);
    if (this.samples.length >= 2) {
      const newDiff = this.samples[this.samples.length - 1] - this.samples[this.samples.length - 2];
      this.diffs.push(newDiff);
      this.averageChangeMB = this.runningAverage(this.diffs, newDiff, this.averageChangeMB);
    }
  }
}

// Keep old 'profile' export name but make it async-capable under the hood.
// This avoids touching any other tests that might import 'profile' elsewhere.
export const profile = new MemoryProfiler();