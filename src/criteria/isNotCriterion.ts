import { map } from 'rxjs';

import type { AsyncCriterion, Criterion } from '../types/types';
import { toObservable } from '../utils/toObservable';

/**
 * Returns true if the criterion is false
 * @param {Criterion} criterion
 * @returns {Function(): Observable<boolean>}
 */
export const isNotCriterion =
  (criterion: Criterion): AsyncCriterion => () => toObservable(criterion()).pipe(map((value) => !value));
