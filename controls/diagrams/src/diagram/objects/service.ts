
/**
 * ServiceLocator
 *
 * @hidden
 */
export class ServiceLocator {

    private services: { [x: string]: Object } = {};

    public register<T>(name: string, type: T): void {
        this.services[name] = type;
    }

    public getService<T>(name: string): T {
        return <T>this.services[name];
    }
}
