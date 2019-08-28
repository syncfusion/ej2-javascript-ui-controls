/**
 * Worker task.
 */
export function executeTaskAsync (
    context: Object, taskFn: Function | { [key: string]: Function | string[] }, callbackFn: Function,
    data?: Object[], preventCallback?: boolean): WorkerHelper {
    return new WorkerHelper(context, taskFn, callbackFn, data, preventCallback);
}

/**
 * @hidden
 * The `WorkerHelper` module is used to perform multiple actions using Web Worker asynchronously.
 */
class WorkerHelper {
    private context: Object;
    private worker: Worker;
    private workerTask: Function | { [key: string]: Function | string[] };
    private defaultListener: Function;
    private workerData: Object[];
    private preventCallback: boolean =  false;
    private workerUrl: string;

    /**
     * Constructor for WorkerHelper module in Workbook library.
     * @private
     */
    constructor (
        context: Object, task: Function | { [key: string]: Function | string[] }, defaultListener: Function,
        taskData?: Object[], preventCallback?: boolean) {
        this.context = context;
        this.workerTask = task;
        this.defaultListener = defaultListener;
        this.workerData = taskData;
        if (preventCallback) { this.preventCallback = true; }
        this.initWorker();
    }

    /**
     * To terminate the worker task.
     * @private
     */
    public terminate(): void {
        this.worker.terminate();
        URL.revokeObjectURL(this.workerUrl);
    }

    /**
     * To initiate the worker.
     * @private
     */
    private initWorker(): void {
        let taskBlob: Blob = new Blob([this.getFnCode()], { type: 'text/javascript' });
        this.workerUrl = URL.createObjectURL(taskBlob);
        this.worker = new Worker(this.workerUrl);
        this.worker.onmessage = this.messageFromWorker.bind(this);
        this.worker.onerror = this.onError.bind(this);
        this.worker.postMessage(this.workerData);
    }

    /**
     * Method for getting response from worker.
     * @private
     */
    private messageFromWorker(args: MessageEvent): void {
        this.terminate();
        this.defaultListener.apply(this.context, [args.data]);
    }

    /**
     * Method for getting error message from worker if failed.
     * @private
     */
    private onError(args: ErrorEvent): void {
        this.terminate();
        throw args.message || args;
    }

    /**
     * Construct function code for worker.
     * @private
     */
    private getFnCode(): string {
        let workerCode: string = '';
        let i: number;
        let keys: string[];
        if (typeof this.workerTask === 'function') {
            workerCode += ('self.workerTask = ' + this.workerTask.toString() + '; \n');
        } else {
            if (typeof this.workerTask === 'object') {
                keys = Object.keys(this.workerTask);
                for (i = 0; i < keys.length; i++) {
                    workerCode += ((i === 0 ? 'self.workerTask' : keys[i]) + '=' + this.workerTask[keys[i]].toString() + '; \n');
                }
            }
        }
        workerCode += 'self.onmessage = ' +
        (this.preventCallback ? this.getMessageFn.toString() : this.getCallbackMessageFn.toString()) + '; \n';
        return workerCode;
    }

    /**
     * Get default worker task with callback.
     * @private
     */
    private getCallbackMessageFn(args: MessageEvent): void {
        (postMessage as Function)((this.workerTask as Function)(...args.data));
    }

    /**
     * Get default worker task without callback.
     * @private
     */
    private getMessageFn(args: MessageEvent): void {
        (this.workerTask as Function)(...args.data);
    }
}