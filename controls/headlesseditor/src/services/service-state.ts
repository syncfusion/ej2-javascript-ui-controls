/**
 * ServiceState — tracks the lifecycle phase of a managed service.
 *
 * Valid transitions:
 *   Uninitialized → Initializing → Running → Disposing → Disposed
 *
 * @hidden
 */
export enum ServiceState {
    Uninitialized = 'Uninitialized',
    Initializing = 'Initializing',
    Running = 'Running',
    Disposing = 'Disposing',
    Disposed = 'Disposed',
}
