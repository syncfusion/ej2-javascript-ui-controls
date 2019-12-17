import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * ServiceLocator
 * @hidden
 * @deprecated
 */
export class ServiceLocator {

    private services: { [x: string]: Object } = {};

    /**
     * register method
     * @hidden
     * @deprecated
     */
    public register<T>(name: string, type: T): void {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    }

    /**
     * getService method
     * @hidden
     * @deprecated
     */
    public getService<T>(name: string): T {
        if (isNullOrUndefined(this.services[name])) {
            throw `The service ${name} is not registered`;
        }

        return <T>this.services[name];
    }
}