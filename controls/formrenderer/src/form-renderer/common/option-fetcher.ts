import { DataManager, Query, UrlAdaptor, WebApiAdaptor, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { FormNode } from '../form-renderer/types/form-schema';
import { resolveFieldBinding, getAdaptorInstance, extractDataFromPath } from './utils';

/**
 * @private
 */
export class OptionFetcher {
    /**
     * Fetch option data via `DataManager` + `Query`, supporting
     * search/sort/filter/paging/queryParams, with `resolveFieldBinding`
     * used to resolve `{field}` references in search keys and filter
     * values, and `extractDataFromPath` used to project the result.
     *
     * Mirrors `useFetchOptions` (utils.tsx lines 359–471).
     *
     * @param componentOptions - Options config (array fallback handled by
     *   caller; this method only handles `type==='url'` objects).
     * @param componentId - Id of the requesting component (for stale
     *   avoidance by the caller). Not used internally beyond tagging.
     * @param formValues - Current form values (id-keyed) used to resolve
     *   `{field}` references when `components` is provided.
     * @param components - Schema components used to map name-keyed context
     *   from id-keyed `formValues`.
     * @returns Promise resolving to the option array (or empty array on
     *   error / non-url config). Never rejects — errors are caught and return `[]`.
     */
    public static fetch(
        componentOptions: any,
        componentId: string,
        formValues?: Record<string, any>,
        components?: FormNode[]
    ): Promise<{ id: string; options: string[] }> {
        const isUrlType =
            componentOptions &&
            typeof componentOptions === 'object' &&
            !Array.isArray(componentOptions) &&
            componentOptions.type === 'url' &&
            componentOptions.url;

        if (!isUrlType) {
            return Promise.resolve({ id: componentId, options: [] });
        }

        const urlConfig: any = componentOptions;

        return new Promise<{ id: string; options: string[] }>((resolve) => {
            try {
                const headers: Record<string, string> = {};

                if (urlConfig.headers && Array.isArray(urlConfig.headers)) {
                    urlConfig.headers.forEach((h: any) => {
                        if (h.key && h.key.trim()) {
                            headers[h.key] = h.value;
                        }
                    });
                }

                // Create DataManager with selected adaptor
                const dataManager = new DataManager({
                    url: urlConfig.url,
                    adaptor: getAdaptorInstance(urlConfig.adaptorType),
                    headers: Object.keys(headers).length ? headers : undefined
                } as any);

                // Build Query (dynamic support)
                let query: Query = new Query();

                if (urlConfig.search && urlConfig.search.enabled && urlConfig.search.fields && urlConfig.search.fields.length > 0) {
                    const searchKey: string = urlConfig.search.key || 'search';
                    // Resolve field bindings in search value
                    const resolvedSearchValue: any = formValues
                        ? resolveFieldBinding(searchKey, formValues, components)
                        : /[{}]/.test(searchKey) ? '' : searchKey;

                    query = query.search(resolvedSearchValue, urlConfig.search.fields);
                }

                // Apply sort query
                if (urlConfig.sort && urlConfig.sort.enabled && urlConfig.sort.field) {
                    const sortDirection: 'descending' | 'ascending' =
                        urlConfig.sort.direction === 'descending' ? 'descending' : 'ascending';
                    query = query.sortBy(urlConfig.sort.field, sortDirection);
                }

                // Apply filter queries with field binding resolution
                if (urlConfig.filters && Array.isArray(urlConfig.filters) && urlConfig.filters.length > 0) {
                    urlConfig.filters.forEach((f: any) => {
                        if (f.field && f.operator && f.value !== undefined && f.value !== '') {
                            const resolvedFilterValue: any = formValues
                                ? resolveFieldBinding(f.value, formValues, components)
                                : /[{}]/.test(f.value) ? '' : f.value;
                            if (resolvedFilterValue !== '') {
                                query = query.where(f.field, f.operator, resolvedFilterValue);
                            }
                        }
                    });
                }

                // Add params (query string)
                if (urlConfig.queryParams) {
                    Object.keys(urlConfig.queryParams).forEach((key: string) => {
                        query = query.addParams(key, urlConfig.queryParams[key as string]);
                    });
                }

                // Paging
                if (urlConfig.skip) { query = query.skip(urlConfig.skip); }
                if (urlConfig.take) { query = query.take(urlConfig.take); }

                const timeoutMs: number = 15000;
                let timedOut: boolean = false;
                const timeoutHandle: any = setTimeout(() => {
                    timedOut = true;
                    resolve({ id: componentId, options: [] });
                }, timeoutMs);

                dataManager.executeQuery(query).then((res: any) => {
                    if (timedOut) { return; }
                    clearTimeout(timeoutHandle);

                    let data: any = res.result;

                    if (urlConfig.dataPath) {
                        data = extractDataFromPath(data, urlConfig.dataPath);
                    }

                    let options: string[];
                    if (Array.isArray(data)) {
                        options = data;
                    } else if (typeof data === 'string') {
                        options = [data];
                    } else {
                        options = [];
                    }
                    resolve({ id: componentId, options });
                }).catch((err: any) => {
                    if (timedOut) { return; }
                    clearTimeout(timeoutHandle);
                    // console.error('Fetch error:', err);
                    resolve({ id: componentId, options: [] });
                });
            } catch (err) {
                // console.error('Setup error:', err);
                resolve({ id: componentId, options: [] });
            }
        });
    }
}

export default OptionFetcher;
