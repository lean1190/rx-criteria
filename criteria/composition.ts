import { combineLatest, map, Observable } from 'rxjs'
import { defaultTransformFunction, isTrue, toAsync } from '../utils/utils'

import type { AsyncCriteriaCompositionFunction, AsyncCriterion, Criteria, Criterion, TransformFunction } from '../types/types'

/**
 * Combines a set of criteria into one observable
 * @param {Criteria} criteria
 * @returns {Observable<boolean>}
 */
export const combineCriteria =
  (transformFunction: TransformFunction = defaultTransformFunction): AsyncCriteriaCompositionFunction =>
  (criteria: Criteria): Observable<boolean> =>
    combineLatest(criteria.map(criterion => toAsync(criterion()))).pipe(map(transformFunction))

/**
 * Returns true if every criterion is true
 * @param {Criteria} criteria
 * @returns {Observable<boolean>}
 */
export const isEveryAsyncCriterionTrue =
  (criteria: Criteria): AsyncCriterion =>
  () =>
    combineCriteria(values => values.every(isTrue))(criteria)

/**
 * Returns true if any criterion is true
 * @param {Criteria} criteria
 * @returns {Observable<boolean>}
 */
export const isSomeAsyncCriterionTrue =
  (criteria: Criteria): AsyncCriterion =>
  () =>
    combineCriteria(values => values.some(isTrue))(criteria)

/**
 * Returns true if the criterion is false
 * @param {Criterion} criterion
 * @returns {Observable<boolean>}
 */
export const isNotAsyncCriterion =
  (criterion: Criterion): AsyncCriterion =>
  () =>
    toAsync(criterion()).pipe(map(value => !value))
