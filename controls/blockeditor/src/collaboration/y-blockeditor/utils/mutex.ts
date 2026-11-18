/**
 * Creates a mutex that prevents concurrent execution
 *
 * @returns {Function} Mutex function that executes callbacks sequentially
 * @hidden
 */
export function createMutex(): <T>(callback: () => T) => T | void {
    let locked: boolean = false;

    return <T>(callback: () => T): T | void => {
        if (locked) {
            return;
        }
        locked = true;
        try {
            return callback();
        } finally {
            locked = false;
        }
    };
}

/**
 * Creates a throttled version of a function that executes at most once per interval
 *
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle interval in milliseconds
 * @returns {Function} Throttled function
 * @hidden
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    let lastArgs: Parameters<T> | null = null;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                if (lastArgs !== null) {
                    func(...lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };
}
