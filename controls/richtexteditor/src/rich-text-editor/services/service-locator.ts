import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * ServiceLocator
 *
 * @hidden
 * @deprecated
 */
export class ServiceLocator {

    private services: { [x: string]: Object } = {};

    /* eslint-disable */
    /**
     * register method
     *
     * @param {string} name - specifies the name.
     * @param {T} type - specifies the type.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    /* eslint-enable */
    public register<T>(name: string, type: T): void {
        if (isNullOrUndefined(this.services[`${name}`])) {
            this.services[`${name}`] = type;
        }
    }

    /**
     * getService method
     *
     * @param {string} name - specifies the name.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getService<T>(name: string): T {
        if (isNullOrUndefined(this.services[`${name}`])) {
            // eslint-disable-next-line
            throw `The service ${name} is not registered`;
        }

        return <T>this.services[`${name}`];
    }

    public destroy(): void {
        this.services = {};
    }
}
