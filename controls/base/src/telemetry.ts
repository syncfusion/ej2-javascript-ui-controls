/**
 * Product to components map - groups components by their product
 * More efficient than component-to-product as it avoids duplication
 */
const sdkMap: { [key: string]: string[] } = {
    'PDFViewerSDK': ['PDFViewer'],
    'DocumentSDK': ['PDFLibrary'],
    'DOCXEditorSDK': ['DOCXEditor'],
    'SpreadsheetEditorSDK': ['SpreadsheetEditor'],
    'SchedulerSDK': ['Scheduler'],
    'GanttSDK': ['Gantt', 'Kanban'],
    'DiagramSDK': ['Diagram'],
    'FileManagerSDK': ['FileManager'],
    'GridSDK': ['DataGrid', 'PivotTable', 'TreeGrid'],
    'RichTextEditorSDK': ['RichTextEditor', 'BlockEditor', 'RichTextEditorUI', 'HeadlessEditor'],
    'ChartSDK': ['Charts']
};

export let SDK_VERSION: string = '35.1.37';

/**
 * Gets the SDK name for a given component by looking it up in the sdkMap
 * @param {string} componentName - The name of the component
 * @returns {string} - The SDK name if found, defaults to 'Syncfusion.Telemetry'
 */
export function getSdkNameForComponent(componentName: string): string {
    if (!componentName) {
        return 'ESUISDK';
    }
    // eslint-disable-next-line security/detect-object-injection
    for (const sdkName in sdkMap) {
        if (sdkMap.hasOwnProperty(sdkName)) {
            const components: string[] = sdkMap[sdkName];
            if (components.indexOf(componentName) !== -1) {
                return sdkName;
            }
        }
    }
    return 'ESUISDK';
}

/**
 * Initialize and configure telemetry for component tracking
 * @param {string} componentName - The name of the component to track
 * @returns {void}
 * @private
 */
export function initializeTelemetry(componentName: string): void {
    if (typeof window !== 'undefined' && (window as Window & { __karma__?: any }).__karma__) {
        return;
    }
    const componentSdkName: string = getSdkNameForComponent(componentName);
    Telemetry.configure(function (options) {
        options.sdkVersion = SDK_VERSION;
    });
    Telemetry.trackComponent(componentName, componentSdkName);
}

/**
 * Initialize and configure telemetry for feature tracking
 * @param {string} featureName - The name of the feature to track
 * @param {string} componentName - The name of the component to track
 * @returns {void}
 * @private
 */
export function initializeTelemetryFeature(featureName: string, componentName: string): void {
    if (typeof window !== 'undefined' && (window as Window & { __karma__?: any }).__karma__) {
        return;
    }
    const featureSdkName: string = getSdkNameForComponent(componentName);
    Telemetry.configure(function (options) {
        options.sdkVersion = SDK_VERSION;
    });
    Telemetry.trackFeature(featureName, componentName, featureSdkName);
}

// Provides static access to telemetry configuration and tracking.
export class Telemetry {
    private static client: TelemetryClient | null = null;
    public static isTelemetryEnable: boolean = false;
    static disable(): void {
        this.isTelemetryEnable = false;
    }
    static enable(): void {
        this.isTelemetryEnable = true;
    }
    static configure(configure: (options: TelemetryOptions) => void): void {
        if (this.client) {
            return;
        }
        const options: TelemetryOptions = new TelemetryOptions();
        configure(options);
        if (this.isTelemetryEnable) {
            this.client = new TelemetryClient(options);
        }
    }

    static trackComponent(componentName: string, componentSdkName: string): void {
        try {
            if (this.client && this.client.options.getEnvironment().toLowerCase().includes('development')) {
                this.client.trackComponent(componentName, componentSdkName);
            }
        } catch {
            /* ignore */
        }
    }

    static trackFeature(featureName: string, componentName: string, featureSdkName: string): void {
        try {
            if (this.client && this.client.options.getEnvironment().toLowerCase().includes('development')) {
                this.client.trackFeature(featureName, componentName, featureSdkName);
            }
        } catch {
            /* ignore */
        }
    }

    static async flushAsync(): Promise<void> {
        try {
            if (this.client) {
                await this.client.flushAsync();
            }
        } catch {
            /* ignore */
        }
    }

    static shutdown(): void {
        try {
            if (this.client) {
                this.client.dispose();
            }
        } catch {
            /* ignore */
        }
        this.client = null;
    }
}
// Configuration options that control telemetry collection and transport behavior.
export class TelemetryOptions {
    enabled: boolean;
    connectionString: string;
    sdkName: string;
    sdkVersion: string;
    framework: string;
    frameworkVersion: string;
    platform: string;
    readonly endpoint: string;
    readonly operatingSystem: string;
    readonly architecture: string;
    readonly environmentName: string;
    readonly maxQueueSize: number;
    readonly batchSize: number;
    readonly batchInterval: number;
    readonly requestTimeout: number;
    readonly maxRetries: number;
    readonly enableGzip: boolean;
    readonly productionNoOpByDefault: boolean;

    // Initializes a new instance of the <see cref="TelemetryOptions"/> class.
    constructor() {
        this.enabled = true;
        this.connectionString = 'SW5zdHJ1bWVudGF0aW9uS2V5PWQ0ODg0NjhiLTEyNzYtNGJhNS04NGY0LTE3ZmZjNzMzNjQ1ZTtJbmdlc3Rpb25FbmRwb2ludD1odHRwczovL2Vhc3R1cy04LmluLmFwcGxpY2F0aW9uaW5zaWdodHMuYXp1cmUuY29tLzs=';
        this.endpoint = 'https://dc.services.visualstudio.com';
        this.sdkName = 'ESUISDK';
        this.sdkVersion = SDK_VERSION;
        this.framework = this.getFrameWork();
        this.frameworkVersion = this.getFrameWorkVersion();
        this.platform = 'EJ2';
        this.operatingSystem = this.getOperatingSystem();
        this.architecture = this.getArchitecture();
        this.environmentName = this.getEnvironment();
        this.maxQueueSize = 250;
        this.batchSize = 25;
        this.batchInterval = 6000;
        this.requestTimeout = 120_000;
        this.maxRetries = 2;
        this.enableGzip = true;
        this.productionNoOpByDefault = true;
    }
    private getFrameWorkVersion(): string {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return '7';
        }
        if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
            document.querySelector('[data-reactroot], [data-reactid]')) {
            try {
                const hook: any = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
                if (hook && hook.renderers) {
                    const renderers: any[] = Array.from(hook.renderers.values());
                    if (renderers.length > 0 &&
                        renderers[0] &&
                        renderers[0].version) {
                        return renderers[0].version;
                    }
                }
            } catch {

            }
            return '19';
        }
        if (
            (window as any).ng ||
            document.querySelector('[ng-version]') ||
            document.querySelector('[ng-app]')) {
            const ngVersionEl: Element | null = document.querySelector('[ng-version]');
            if (ngVersionEl) {
                return ngVersionEl.getAttribute('ng-version') as string;
            }
            return '22.1.1';
        }
        // Vue
        const vueRoot: any =
            document.querySelector('[data-v-app]') ||
            document.querySelector('#app');
        if ((window as any).__VUE__ ||
            vueRoot && vueRoot.__vue__ ||
            vueRoot && vueRoot.__vue_app__) {

            if (vueRoot && vueRoot.__vue_app__ && vueRoot.__vue_app__.version) {
                return vueRoot.__vue_app__.version;
            }

            if (vueRoot && vueRoot.__vue__ && vueRoot.__vue__.$options && vueRoot.__vue__.$options._base && vueRoot.__vue__.$options._base.version) {
                return vueRoot.__vue__.$options._base.version;
            }
            if (vueRoot && vueRoot.__vue__ && vueRoot.__vue__.constructor && vueRoot.__vue__.constructor.version) {
                return vueRoot.__vue__.constructor.version;
            }

            return '3';
        }
        return '7';
    }
    private getFrameWork(): string {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return 'JavaScript';
        }
        if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
            document.querySelector('[data-reactroot], [data-reactid]')) {
            return 'React';
        } else if (
            (window as any).ng ||
            document.querySelector('[ng-version]') ||
            document.querySelector('[ng-app]')) {
            return 'Angular';
        } else {
            const appEl: any = document.querySelector('#app');
            if ((window as any).__VUE__ || document.querySelector('[data-v-app]') ||
                (appEl && appEl.__vue__) || (appEl && appEl.__vue_app__)) {
                return 'Vue';
            }
            // Detect TypeScript by checking for common TypeScript globals
            const ts: { version?: string } | undefined = (window as Window & {
                ts?: { version?: string };
            }).ts;
            if (ts && ts.version) {
                return 'TypeScript';
            }
            return 'JavaScript';
        }
    }
    private getArchitecture(): string {
        if (typeof navigator !== 'undefined') {
            const userAgent: string = navigator.userAgent.toLowerCase();
            if (userAgent.includes('win')) {
                if (userAgent.includes('x64') || userAgent.includes('amd64')) {
                    return 'x64';
                }
                if (userAgent.includes('x86') || userAgent.includes('wow64')) {
                    return 'x86';
                }
                if (userAgent.includes('arm64')) {
                    return 'ARM64';
                }
                if (userAgent.includes('arm')) {
                    return 'ARM';
                }
            }
            if (userAgent.includes('mac')) {
                if (userAgent.includes('intel')) {
                    return 'x64';
                }
                if (userAgent.includes('ppc')) {
                    return 'PowerPC';
                }
                if (userAgent.includes('apple silicon') || userAgent.includes('arm64')) {
                    return 'ARM64';
                }
            }
            if (userAgent.includes('linux')) {
                if (userAgent.includes('x86_64') || userAgent.includes('amd64')) {
                    return 'x64';
                }
                if (userAgent.includes('i686') || userAgent.includes('i386')) {
                    return 'x86';
                }
                if (userAgent.includes('aarch64') || userAgent.includes('arm64')) {
                    return 'ARM64';
                }
                if (userAgent.includes('armv')) {
                    return 'ARM';
                }
            }
        }
        return 'x64';
    }
    private getOperatingSystem(): string {
        if (typeof navigator !== 'undefined' && navigator.userAgent) {
            const userAgent: string = navigator.userAgent.toLowerCase();

            if (userAgent.includes('windows')) {
                return 'Windows';
            } else if (userAgent.includes('android')) {
                return 'Android';
            } else if (/iphone|ipad|ipod/.test(userAgent)) {
                return 'iOS';
            } else if (userAgent.includes('mac os x')) {
                return 'macOS';
            } else if (userAgent.includes('linux')) {
                return 'Linux';
            }
        }
        return 'Windows';
    }

    // Gets the runtime environment name.
    getEnvironment(): string {
        if (typeof window !== 'undefined' && window.location) {
            // Check if running from a local file (file:// protocol)
            if (window.location.protocol === 'file:') {
                return 'Development';
            }
            if (window.location.hostname) {
                const hostname: string = window.location.hostname.toLowerCase();
                if (hostname === 'localhost' || hostname === '127.0.0.1') {
                    return 'Development';
                }
                if (/(^|\.)dev(\.|$)/.test(hostname)) {
                    return 'Development';
                }
                if (/(^|\.)staging(\.|$)|(^|\.)stage(\.|$)/.test(hostname)) {
                    return 'Staging';
                }
                if (/(^|\.)qa(\.|$)|(^|\.)test(\.|$)|(^|\.)uat(\.|$)/.test(hostname)) {
                    return 'Testing';
                }
            }
        }
        return 'Production';
    }
}

// Represents a telemetry event generated by the SDK.
export interface TelemetryEvent {
    eventName: string;
    timestamp: Date;
    sessionId: string;
    machineName?: string;
    sdkName: string;
    sdkVersion: string;
    componentName?: string;
    featureName?: string;
    framework?: string;
    frameworkVersion?: string;
    platform?: string;
    environment?: string;
    priority?: string;
}

// Represents a batch of telemetry events ready for transmission.
export interface TelemetryBatch {
    schemaVersion: string;
    sdkVersion: string;
    sessionId: string;
    createdAt: Date;
    events: TelemetryEvent[];
}

// Generates a random identifier value.
export function randomUUID(): string {
    const hasCrypto: boolean = typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function';
    const hexDigits: string = '0123456789abcdef';
    let uuid: string = '';
    for (let i: number = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4';
        } else {
            if (hasCrypto) {
                const randomByte: number = crypto.getRandomValues(new Uint8Array(1))[0];
                if (i === 19) {
                    uuid += hexDigits[(randomByte & 0x03) | 0x08];
                } else {
                    uuid += hexDigits[randomByte & 0x0f];
                }
            } else {
                uuid += i;
            }
        }
    }
    return uuid.replace(/-/g, '');
}

function parseConnectionString(connectionString: string | undefined | null): {
    instrumentationKey: string;
    ingestionEndpoint: string;
} | null {
    if (!connectionString || connectionString.trim().length === 0) {
        return null;
    }

    try {
        let instrumentationKey: string = '';
        let ingestionEndpoint: string = '';
        connectionString = atob(connectionString);
        const parts: string[] = connectionString.split(';').map((p: string) => p.trim()).filter(Boolean);

        for (const part of parts) {
            const idx: number = part.indexOf('=');
            if (idx <= 0) {
                continue;
            }

            const key: string = part.substring(0, idx).trim();
            const value: string = part.substring(idx + 1).trim();

            if (key === 'InstrumentationKey') {
                instrumentationKey = value.replace(/-/g, '');
            } else if (key === 'IngestionEndpoint') {
                ingestionEndpoint = value;
            }
        }

        if (!ingestionEndpoint && instrumentationKey) {
            ingestionEndpoint = 'https://dc.services.visualstudio.com';
        }

        return instrumentationKey ? { instrumentationKey, ingestionEndpoint } : null;
    } catch {
        return null;
    }
}

// Delays execution for the specified number of milliseconds.
function delay(ms: number): Promise<void> {
    return new Promise((res: () => void) => setTimeout(res, ms));
}

// Represents the payload envelope used by Application Insights.
interface AiEnvelope {
    name: string;
    time: string;
    iKey: string;
    data: {
        baseType: 'EventData';
        baseData: {
            name: string;
            properties: Record<string, string>;
        };
    };
}

// Adds a property to the telemetry property bag if the value is not empty.
function addProp(target: Record<string, string>, key: string, value: unknown): void {
    if (value === null || value === undefined) {
        return;
    }
    const s: string = String(value).trim();
    if (s.length > 0) {
        target[key] = s;
    }
}

function getSessionDedupKey(evt: TelemetryEvent): string {
    return `${evt.eventName}|${evt.sdkName || ''}|${evt.componentName || ''}|${evt.featureName || ''}|${evt.sessionId}`;
}

function getDailyDedupKey(evt: TelemetryEvent): string {
    const y: number = evt.timestamp.getUTCFullYear();
    const month: number = evt.timestamp.getUTCMonth() + 1;
    const m: string = (month < 10 ? '0' : '') + month.toString();
    const day: number = evt.timestamp.getUTCDate();
    const d: string = (day < 10 ? '0' : '') + day.toString();
    return `${getSessionDedupKey(evt)}|${y}${m}${d}`;
}

// Combines multiple abort signals into a single signal.
function anySignal(signals: (AbortSignal | undefined)[]): AbortSignal | undefined {
    const valid: AbortSignal[] = signals.filter(Boolean) as AbortSignal[];
    if (valid.length === 0) {
        return undefined;
    }
    const controller: AbortController = new AbortController();
    for (const s of valid) {
        if (s.aborted) {
            controller.abort();
            return controller.signal;
        }
        s.addEventListener('abort', () => controller.abort(), { once: true });
    }
    return controller.signal;
}

// Defines the contract for sending telemetry data.
interface ITelemetrySender {
    sendAsync(batch: TelemetryBatch, signal?: AbortSignal): Promise<void>;
}


// Sends telemetry to Application Insights over HTTP.
export class HttpTelemetrySender implements ITelemetrySender {
    private readonly options: TelemetryOptions;
    private readonly requestUrl: string;
    private readonly instrumentationKey: string;

    
    // Initializes a new instance of the <see cref="HttpTelemetrySender"/> class.
    constructor(options: TelemetryOptions) {
        this.options = options;

        let endpoint: string = options.endpoint || 'https://dc.services.visualstudio.com';
        let ikey: string = '';

        if (options && options.connectionString && options.connectionString.trim().length > 0) {
            const parse: { instrumentationKey: string; ingestionEndpoint: string } | null = parseConnectionString(options.connectionString);
            if (parse) {
                endpoint = parse.ingestionEndpoint || endpoint;
                ikey = parse.instrumentationKey || '';
            }
        }

        this.requestUrl = `${endpoint.replace(/\/$/, '')}/v2/track`;
        this.instrumentationKey = ikey;
    }

    
    // Sends the specified telemetry batch.
    async sendAsync(batch: TelemetryBatch, signal?: AbortSignal): Promise<void> {
        if (!batch || !batch.events || batch.events.length === 0) {
            return;
        }
        const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined';
        if (!isBrowser) {
            return;
        }
        const aiPayload: AiEnvelope[] = this.createApplicationInsightsPayload(batch);
        const json: string = JSON.stringify(aiPayload);
        const encoder: TextEncoder = new TextEncoder();
        const body: Uint8Array = encoder.encode(json);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        const controller: AbortController = new AbortController();
        const timeoutValue: number = Math.max(1, this.options.requestTimeout || 10000);
        const timeout: ReturnType<typeof setTimeout> = setTimeout((): void => { controller.abort(); }, timeoutValue);
        const combined: AbortSignal | undefined = anySignal([controller.signal, signal]);

        try {
            const res: Response = await fetch(this.requestUrl, {
                method: 'POST',
                headers,
                body,
                signal: combined,
                credentials: 'omit'
            } as RequestInit);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }
        }
        catch {
            // Ignore network failures
            return;
        }
        finally {
            clearTimeout(timeout);
        }
    }

    
    // Creates the Application Insights payload for the specified batch.
    createApplicationInsightsPayload(batch: TelemetryBatch): AiEnvelope[] {
        const items: AiEnvelope[] = [];
        for (const ev of batch.events) {
            items.push(this.createApplicationInsightsEvent(ev, batch));
        }
        return items;
    }

    createApplicationInsightsEvent(ev: TelemetryEvent, _batch: TelemetryBatch): AiEnvelope {
        const properties: Record<string, string> = {};
        addProp(properties, 'event.name', ev.eventName);
        addProp(properties, 'component.name', ev.componentName);
        addProp(properties, 'feature.name', ev.featureName);
        addProp(properties, 'session.id', ev.sessionId);
        addProp(properties, 'machine.name', ev.machineName || TelemetryClient.machineName);
        const opts: TelemetryOptions = this.options;
        addProp(properties, 'sdk.name', ev.sdkName || opts.sdkName);
        addProp(properties, 'sdk.version', ev.sdkVersion || opts.sdkVersion);
        addProp(properties, 'framework', ev.framework || opts.framework);
        addProp(properties, 'framework.version', ev.frameworkVersion || opts.frameworkVersion);
        addProp(properties, 'platform_name', ev.platform || opts.platform);
        addProp(properties, 'os', opts.operatingSystem);
        addProp(properties, 'architecture', opts.architecture);

        let timeIso: string;
        const ts: Date | string | number = ev.timestamp;
        if (ts instanceof Date) {
            timeIso = ts.toISOString();
        } else if (typeof ts === 'string') {
            timeIso = new Date(ts).toISOString();
        } else if (typeof ts === 'number') {
            timeIso = new Date(ts).toISOString();
        } else {
            timeIso = new Date().toISOString();
        }

        const iKey: string = this.instrumentationKey || '';

        return {
            name: 'Microsoft.ApplicationInsights.Event',
            time: timeIso,
            iKey,
            data: {
                baseType: 'EventData',
                baseData: {
                    name: String(ev.eventName || 'Event'),
                    properties
                }
            }
        };
    }
}


// Collects, deduplicates, batches, and forwards telemetry events.
export class TelemetryClient {
    readonly options: TelemetryOptions;
    private readonly sender: ITelemetrySender;
    private readonly queue: TelemetryEvent[] = [];
    private readonly sessionDedup: Map<string, number> = new Map<string, number>();
    private readonly dailyDedup: Map<string, number> = new Map<string, number>();
    private timer: ReturnType<typeof setInterval> | null = null;
    private cleanupTimer: ReturnType<typeof setInterval> | null = null;
    private static sessionId: string = '';
    static machineName: string = '';
    private isFlushing: boolean = false;
    private disposed: boolean = false;
    private readonly maxDedupSize: number = 500;
    private readonly dedupCleanupThreshold: number = 0.8;
    constructor(options: TelemetryOptions) {
        this.options = options;
        this.sender = new HttpTelemetrySender(options);
        // Generate session and machine IDs synchronously upfront
        TelemetryClient.sessionId = this.generateSessionId();
        TelemetryClient.machineName = this.generateMachineName();
        if (this.options.enabled) {
            this.timer = setInterval(() => {
                this.flushAsync().catch(() => { /* ignore */ });
            }, this.options.batchInterval);
            this.cleanupTimer = setInterval(() => {
                this.cleanupStaleKeys();
            }, 5 * 60 * 1000);
        }
    }
    trackComponent(componentName: string, componentSdkName: string): void {
        if (!this.shouldCollect()) {
            return;
        }
        const name: string = componentName;
        const evt: TelemetryEvent = {
            eventName: 'component_initialized',
            timestamp: new Date(),
            sessionId: TelemetryClient.sessionId,
            machineName: TelemetryClient.machineName,
            sdkName: componentSdkName,
            sdkVersion: this.options.sdkVersion,
            componentName: name,
            featureName: 'Init',
            framework: this.options.framework,
            frameworkVersion: this.options.frameworkVersion,
            platform: this.options.platform,
            environment: this.options.environmentName,
            priority: 'Normal'
        };
        this.enqueue(evt);
    }
    trackFeature(featureName: string, componentName: string, featureSdkName: string): void {
        if (!this.shouldCollect()) {
            return;
        }
        const name: string = featureName;
        const compname: string = componentName;
        const evt: TelemetryEvent = {
            eventName: 'feature_used',
            timestamp: new Date(),
            sessionId: TelemetryClient.sessionId,
            machineName: TelemetryClient.machineName,
            sdkName: featureSdkName,
            sdkVersion: this.options.sdkVersion,
            featureName: name,
            componentName: compname,
            framework: this.options.framework,
            frameworkVersion: this.options.frameworkVersion,
            platform: this.options.platform,
            environment: this.options.environmentName,
            priority: 'Normal'
        };
        this.enqueue(evt);
    }

    async flushAsync(): Promise<void> {
        if (this.isFlushing || this.disposed) {
            return;
        }
        if (this.queue.length === 0) {
            return;
        }
        this.isFlushing = true;
        try {
            while (this.queue.length > 0) {
                const take: number = Math.min(this.options.batchSize, this.queue.length);
                const events: TelemetryEvent[] = this.queue.splice(0, take);
                const batch: TelemetryBatch = {
                    schemaVersion: '1.0',
                    sdkVersion: this.options.sdkVersion,
                    sessionId: TelemetryClient.sessionId,
                    createdAt: new Date(),
                    events
                };
                let attempt: number = 0;
                const max: number = Math.max(0, this.options.maxRetries);
                while (attempt <= max) {
                    try {
                        await this.sender.sendAsync(batch);
                        break;
                    } catch (err) {
                        if (attempt >= max) {
                            throw err;
                        }
                        const backoff: number = Math.min(30_000, 2 ** attempt * 500);
                        await delay(backoff);
                        attempt++;
                    }
                }
            }
        } finally {
            this.isFlushing = false;
        }
    }
    dispose(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        this.queue.length = 0;
    }
    private shouldCollect(): boolean {
        if (!this.options.enabled || this.disposed) {
            return false;
        }
        const env: string = this.options.environmentName.toLowerCase() || '';
        if (env === 'ci') {
            return false;
        }
        if (env === 'testing') {
            return false;
        }
        if (this.options.productionNoOpByDefault && env === 'production') {
            return false;
        }
        return true;
    }
    private hashId(value: string): string {
        // FNV-1a 32-bit hash, expanded to 45 characters via base64 of derived bytes
        const hashBytes: Uint8Array = new Uint8Array(34);
        let hash: number = 0x811c9dc5;
        const source: string = value && value.length > 0 ? value : 'unknown';
        for (let i: number = 0; i < hashBytes.length; i++) {
            const charCode: number = source.charCodeAt(i % source.length);
            hash ^= charCode + i;
            hash = Math.imul(hash, 16777619);
            hashBytes[i] = hash & 0xff; // eslint-disable-line
            hash >>>= 8;
        }
        let binary: string = '';
        for (let i: number = 0; i < hashBytes.length; i++) {
            binary += String.fromCharCode(hashBytes[i]); // eslint-disable-line
        }
        const encoded: string = btoa(binary).replace(/=+$/g, '');
        if (encoded.length >= 45) {
            return encoded.substring(0, 45);
        }
        return (encoded + encoded).substring(0, 45);
    }
    private generateMachineName(): string {
        if (TelemetryClient.machineName) {
            return TelemetryClient.machineName;
        }
        const storageKey: string = 'telemetry_machine_id';
        try {
            const storedId: string | null | undefined = localStorage && localStorage.getItem(storageKey);
            if (storedId) {
                return storedId;
            }
        } catch {
            /* ignore */
        }
        // Step 2: Generate NEW unique ID (signature + random UUID + timestamp)
        const randomId: string = randomUUID();
        const machineId: string = this.hashId(randomId);
        try {
            localStorage.setItem(storageKey, machineId);
        } catch {
        }
        return machineId;
    }
    private generateSessionId(): string {
        if (TelemetryClient.sessionId) {
            return TelemetryClient.sessionId;
        }
        const key: string = 'telemetry_session_id';
        try {
            let sessionId: string | null | undefined = sessionStorage && sessionStorage.getItem(key);
            if (sessionId) {
                return sessionId;
            }
        } catch {
            // sessionStorage may throw in private mode / sandboxed iframes
        }
        const guid: string = randomUUID();
        const sessionId: string = this.hashId(guid);
        try {
            sessionStorage.setItem(key, sessionId);
        } catch {
            // sessionStorage may throw in private mode / sandboxed iframes
        }
        return sessionId;
    }
    private enqueue(evt: TelemetryEvent): void {
        if (this.isDuplicate(evt)) {
            return;
        }
        if (this.queue.length >= this.options.maxQueueSize) {
            this.queue.shift();
        }
        this.queue.push(evt);
        if (this.queue.length >= this.options.batchSize) {
            this.flushAsync().catch(() => {
                /* ignore */
            });
        }
    }
    private isDuplicate(evt: TelemetryEvent): boolean {
        const sessionKey: string = getSessionDedupKey(evt);
        const dailyKey: string = getDailyDedupKey(evt);
        const now: number = Date.now();
        if (!this.sessionDedup.has(sessionKey)) {
            this.sessionDedup.set(sessionKey, now);
            this.dailyDedup.set(dailyKey, now);
            this.enforceMaxSize(this.sessionDedup);
            this.enforceMaxSize(this.dailyDedup);
            return false;
        }
        if (this.dailyDedup.has(dailyKey)) {
            return true;
        }
        this.dailyDedup.set(dailyKey, now);
        this.enforceMaxSize(this.dailyDedup);
        return false;
    }
    private enforceMaxSize(dedupMap: Map<string, number>): void {
        const maxSize: number = this.maxDedupSize;
        const threshold: number = Math.floor(maxSize * this.dedupCleanupThreshold);
        if (dedupMap.size >= threshold) {
            const toRemove: number = Math.ceil(maxSize * 0.2);
            const entries: Array<[string, number]> = Array.from(dedupMap.entries());
            entries.sort((a, b) => a[1] - b[1]); // Sort by timestamp
            for (let i = 0; i < toRemove && i < entries.length; i++) {
                dedupMap.delete(entries[i][0]);
            }
        }
    }
    private cleanupStaleKeys(): void {
        const now: number = Date.now();
        const staleThreshold: number = 1 * 60 * 60 * 1000;
        try {
            const sessionEntries: Array<[string, number]> = Array.from(this.sessionDedup.entries());
            for (const [key, timestamp] of sessionEntries) {
                if (now - timestamp > staleThreshold) {
                    this.sessionDedup.delete(key);
                }
            }
            const dailyEntries: Array<[string, number]> = Array.from(this.dailyDedup.entries());
            for (const [key, timestamp] of dailyEntries) {
                if (now - timestamp > staleThreshold) {
                    this.dailyDedup.delete(key);
                }
            }
        } catch {

        }
    }

}
export default Telemetry;
