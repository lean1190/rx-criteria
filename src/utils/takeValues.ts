import { lastValueFrom, Observable, take, toArray } from 'rxjs';

/**
 * Returns a Promise with a determined amount of emissions from an Observable
 * @param {Observable<T>} observable
 * @param {number} count
 * @returns {Promise<T[]>}
 */
export const takeValues = <T>(observable: Observable<T>, count: number = 1): Promise<T[]> => lastValueFrom(observable.pipe(take(count), toArray()));
