import { Observable, of } from 'rxjs';

/**
 * Returns the value wrapped into an Observable
 * If the value is already an Observable, returns the value
 * @param {boolean | Observable<boolean>} value
 * @returns {Observable<boolean>}
 */
export const toObservable = (value: boolean | Observable<boolean>): Observable<boolean> => (value instanceof Observable ? value : of(value));
