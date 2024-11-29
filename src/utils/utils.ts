import type { AsyncCriterion, TransformFunction, SyncCriterion } from '../types/types'
import { catchError, lastValueFrom, Observable, of, shareReplay, take, toArray } from 'rxjs'

/**
 * Returns true if the value is truthy
 * @param {T} value
 * @returns {boolean}
 */
export const isTrue = <T>(value: T) => !!value

/**
 * Returns true if every value is true
 * @param {boolean[]} values
 * @returns {boolean}
 */
export const defaultTransformFunction: TransformFunction = values => values.every(isTrue)

/**
 * Returns the value wrapped into an Observable
 * If the value is already an Observable, returns the value
 * @param {boolean | Observable<boolean>} value
 * @returns {Observable<boolean>}
 */
export const toObservable = (value: boolean | Observable<boolean>): Observable<boolean> =>
  value instanceof Observable ? value : of(value)

/**
 * Returns a Promise with a determined amount of emissions from an Observable
 * @param {Observable<T>} observable 
 * @param {number} count
 * @returns {Promise<T[]>}
 */
export const takeValues = <T>(observable: Observable<T>, count: number = 1): Promise<T[]> => {
  return lastValueFrom(observable.pipe(take(count), toArray()));
}

/**
 * Subscribes to the criterion and logs the value
 * @param {string} name
 * @returns {Function(criterion: AsyncCriterion | SyncCriterion): AsyncCriterion | SyncCriterion}
 */
export const debugCriterion =
  (name: string) =>
  (criterion: AsyncCriterion | SyncCriterion): AsyncCriterion | SyncCriterion => {
    toObservable(criterion())
      .pipe(
        catchError((error, caught) => {
          console.error(name, error)
          return caught
        }),
        shareReplay()
      )
      .subscribe(result => console.debug(name, result))
    return criterion
  }
