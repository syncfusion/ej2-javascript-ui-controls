import { Workbook } from '../base/workbook';

/**
 * Worker task.
 *
 * @param {Object} context - Specify the context.
 * @param {Function | Object} taskFn - Specify the task.
 * @param {Function} callbackFn - Specify the callbackFn.
 * @param {Object[]} data - Specify the data.
 * @param {boolean} preventCallback - Specify the preventCallback.
 * @param {Workbook} parent - Specify the Workbook instance.
 * @returns {WorkerHelper} - Worker task.
 */
export function executeTaskAsync(
    context: Object, taskFn: Function | { [key: string]: Function | string[] }, callbackFn: Function,
    data?: Object[], preventCallback?: boolean, parent?: Workbook): WorkerHelper {
    return new WorkerHelper(context, taskFn, callbackFn, data, preventCallback, parent);
}

/**
 * @hidden
 *
 * The `WorkerHelper` module is used to perform multiple actions using Web Worker asynchronously.
 */
class WorkerHelper {
    private context: Object;
    private worker: Worker;
    private workerTask: Function | { [key: string]: Function | string[] };
    private defaultListener: Function;
    private workerData: Object[];
    private preventCallback: boolean = false;
    private workerUrl: string;
    private parent: Workbook;

    /**
     * Constructor for WorkerHelper module in Workbook library.
     *
     * @private
     * @param {Object} context - Specify the context.
     * @param {Function | Object} task - Specify the task.
     * @param {Function} defaultListener - Specify the defaultListener.
     * @param {Object[]} taskData - Specify the taskData.
     * @param {boolean} preventCallback - Specify the preventCallback.
     * @param {Workbook} parent - Specify the Workbook instance.
     */
    constructor(
        context: Object, task: Function | { [key: string]: Function | string[] }, defaultListener: Function,
        taskData?: Object[], preventCallback?: boolean, parent?: Workbook) {
        this.context = context;
        this.workerTask = task;
        this.defaultListener = defaultListener;
        this.workerData = taskData;
        this.parent = parent;
        if (preventCallback) { this.preventCallback = true; }
        this.initWorker();
    }

    /**
     * To terminate the worker task.
     *
     * @private
     * @returns {void} - To terminate the worker task.
     */
    public terminate(): void {
        this.worker.terminate();
        URL.revokeObjectURL(this.workerUrl);
    }

    /**
     * To initiate the worker.
     *
     * @private
     * @returns {void} - To initiate the worker.
     */
    private initWorker(): void {
        const taskBlob: Blob = new Blob([this.getFnCode()], { type: 'text/javascript' });
        this.workerUrl = URL.createObjectURL(taskBlob);
        this.worker = new Worker(this.workerUrl);
        this.worker.onmessage = this.messageFromWorker.bind(this);
        this.worker.onerror = this.onError.bind(this);
        if (!this.parent.isVue) {
            this.worker.postMessage(this.workerData);
        } else {
            const clonedData: Object[] = JSON.parse(JSON.stringify(this.workerData));
            this.worker.postMessage(clonedData);
        }
    }

    /**
     * Method for getting response from worker.
     *
     * @param {MessageEvent} args - Specify the args.
     * @returns {void} - Method for getting response from worker.
     * @private
     */
    private messageFromWorker(args: MessageEvent): void {
        this.terminate();
        this.defaultListener.apply(this.context, [args.data]);
    }

    /**
     * Method for getting error message from worker if failed.
     *
     * @param {ErrorEvent} args - Specify the args.
     * @returns {void} - Method for getting error message from worker if failed.
     * @private
     */
    private onError(args: ErrorEvent): void {
        this.terminate();
        if (args.message && args.message.includes('FormData')) {
            this.defaultListener.apply(this.context, [{ isFormDataError: true }]);
        } else {
            throw args.message || args;
        }
    }

    /**
     * Construct function code for worker.
     *
     * @private
     * @returns {string} -  Construct function code for worker.
     */
    private getFnCode(): string {
        let workerCode: string = '';
        let i: number;
        let keys: string[];
        let workerFunction: string = '';
        let isHaveFunction: boolean = false;
        if (typeof this.workerTask === 'function') {
            if (this.workerTask.toString().indexOf('function') < 0) {
                workerFunction = 'function ' + this.workerTask.toString();
            } else {
                workerFunction = this.workerTask.toString();
                isHaveFunction = true;
            }
            workerCode += ('self.workerTask = ' + workerFunction + '; \n');
        } else {
            if (typeof this.workerTask === 'object') {
                keys = Object.keys(this.workerTask);
                for (i = 0; i < keys.length; i++) {
                    if (this.workerTask[keys[i as number]].toString().indexOf('function') < 0) {
                        workerFunction = 'function ' + this.workerTask[keys[i as number]].toString();
                    } else {
                        workerFunction = this.workerTask[keys[i as number]].toString();
                        isHaveFunction = true;
                    }
                    workerCode += ((i === 0 ? 'self.workerTask' : keys[i as number]) + '= ' + workerFunction + '; \n');
                }
            }
        }
        workerCode += 'self.onmessage = ' + (isHaveFunction ? '' : ' function ') +
            (this.preventCallback ? this.getMessageFn.toString() : this.getCallbackMessageFn.toString()) + '; \n';
        return workerCode;
    }

    /**
     * Get default worker task with callback.
     *
     * @private
     * @param {MessageEvent} args - Specify the args.
     * @returns {void} - Get default worker task without callback.
     */
    private getCallbackMessageFn(args: MessageEvent): void {
        (postMessage as Function)((this.workerTask as Function)(...args.data));
    }

    /**
     * Get default worker task without callback.
     *
     * @private
     * @param {MessageEvent} args - Specify the args.
     * @returns {void} - Get default worker task without callback.
     */
    private getMessageFn(args: MessageEvent): void {
        (this.workerTask as Function)(...args.data);
    }
}
