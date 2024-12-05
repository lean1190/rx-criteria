import { combineLatest, map, Observable } from 'rxjs';

import type { AsyncCriteriaCompositionFunction, Criteria, TransformFunction } from '../types/types';
import { defaultTransformFunction } from '../utils/defaultTransformFunction';
import { toObservable } from '../utils/toObservable';

/**
 * Combines a set of criteria into one long-lived observable
 * @param {TransformFunction} transformFunction
 * @returns {Function(criteria: Criteria): Observable<boolean>}
 */
export const combineCriteria =
  (transformFunction: TransformFunction = defaultTransformFunction): AsyncCriteriaCompositionFunction => (criteria: Criteria): Observable<boolean> => combineLatest(criteria.map((criterion) => toObservable(criterion()))).pipe(map(transformFunction));
