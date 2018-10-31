import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * ServiceLocator
 * @hidden
 */
export class ServiceLocator {

    private services: { [x: string]: Object } = {};

    public register<T>(name: string, type: T): void {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    }

    public getService<T>(name: string): T {
        if (isNullOrUndefined(this.services[name])) {
            throw `The service ${name} is not registered`;
        }

        return <T>this.services[name];
    }
}