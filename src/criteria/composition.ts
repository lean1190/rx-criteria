import { combineLatest, map, Observable } from 'rxjs'
import { defaultTransformFunction, isTrue, toObservable } from '../utils/utils'

import type { AsyncCriteriaCompositionFunction, AsyncCriterion, Criteria, Criterion, TransformFunction } from '../types/types'

/**
 * Combines a set of criteria into one observable
 * @param {TransformFunction} transformFunction
 * @returns {Function(criteria: Criteria): Observable<boolean>}
 */
export const combineCriteria =
  (transformFunction: TransformFunction = defaultTransformFunction): AsyncCriteriaCompositionFunction =>
  (criteria: Criteria): Observable<boolean> =>
    combineLatest(criteria.map(criterion => toObservable(criterion()))).pipe(map(transformFunction))

/**
 * Returns true if every criterion is true
 * @param {Criteria} criteria
 * @returns {Function(): Observable<boolean>}
 */
export const isEveryCriterionTrue =
  (criteria: Criteria): AsyncCriterion =>
  () =>
    combineCriteria(values => values.every(isTrue))(criteria)

/**
 * Returns true if any criterion is true
 * @param {Criteria} criteria
 * @returns {Function(): Observable<boolean>}
 */
export const isSomeCriterionTrue =
  (criteria: Criteria): AsyncCriterion =>
  () =>
    combineCriteria(values => values.some(isTrue))(criteria)

/**
 * Returns true if the criterion is false
 * @param {Criterion} criterion
 * @returns {Function(): Observable<boolean>}
 */
export const isNotCriterion =
  (criterion: Criterion): AsyncCriterion =>
  () =>
    toObservable(criterion()).pipe(map(value => !value))
