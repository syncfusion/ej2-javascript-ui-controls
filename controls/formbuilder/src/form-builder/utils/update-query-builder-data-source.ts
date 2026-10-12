/** @private */
export type Unsubscribe = () => void;
/** @private */
export type FieldsGetter = () => any[] | undefined;
/** @private */
export type FieldsCallback = (fields: any[]) => void;

/** @private */
export function updateQueryBuilderDataSource(getFields: FieldsGetter, onChange: FieldsCallback, options?: { pollMs?: number }): Unsubscribe {
    const pollMs: number = (options && options.pollMs) || 150;
    let lastSnapshot: string | null = null;
    let stopped = false;

    function snapshot(arr: any[] | undefined): string {
        if (!arr) { return ''; }
        try { return JSON.stringify(arr.map((f: any) => f && f.id ? f.id : f)); } catch { return String(arr.length); }
    }

    function checkOnce() {
        if (stopped) { return; }
        try {
            const cur = getFields();
            const s = snapshot(cur);
            if (s !== lastSnapshot) {
                lastSnapshot = s;
                try { onChange((cur || []).slice()); } catch { /* swallow consumer error */ }
            }
        } catch { /* ignore getter errors */ }
    }

    // Initialize snapshot and start polling
    try { lastSnapshot = snapshot(getFields()); } catch { lastSnapshot = null; }
    const id = setInterval(checkOnce, pollMs);

    return function unsubscribe() {
        if (stopped) { return; }
        stopped = true;
        try { clearInterval(id as any); } catch { /* */ }
    };
}

export default updateQueryBuilderDataSource;
