/**
 * ServiceLocator
 *
 * Lightweight service registry shared by the Workflow Designer shell and its
 * rendering submodules, mirroring the Diagram component's service pattern.
 * The main component registers its services (localization) once in
 * `preRender`; submodules resolve them through `getService` instead of each
 * constructing their own instances or carrying duplicate fallback defaults.
 *
 * @hidden
 */
export class ServiceLocator {

    private services: { [x: string]: Object } = {};

    public register<T>(name: string, type: T): void {
        this.services[`${name}`] = type;
    }

    public getService<T>(name: string): T {
        return <T>this.services[`${name}`];
    }
}
