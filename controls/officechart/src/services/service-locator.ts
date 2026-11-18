/**
 * Lightweight DI/service locator for chart services.
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';

export class ServiceLocator {
    private services: Map<string, Object> = new Map<string, Object>();

    /**
     * Registers a service instance by name.
     *
     * @param {string} serviceName - Unique service string id.
     * @param {any} serviceInstance - Service instance to register.
     * @returns {void}
     */
    public register<T>(serviceName: string, serviceInstance: T): void {
        if (!this.services.has(serviceName)) {
            this.services.set(serviceName, serviceInstance as unknown as Object);
        }
    }

    /**
     * Gets a registered service by name.
     *
     * @param {string} serviceName - Unique service string id.
     * @returns {any} Service instance.
     */
    public getService<T>(serviceName: string): T {
        const service: Object = this.services.get(serviceName);
        if (isNullOrUndefined(service)) {
            throw new Error('The service ' + serviceName + ' is not registered');
        }
        return service as unknown as T;
    }
}
