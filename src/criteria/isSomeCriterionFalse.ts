import type { AsyncCriterion, Criteria } from '../types/types';
import { isFalse } from '../utils/isFalse';
import { combineCriteria } from './combineCriteria';

/**
 * Returns true if any criterion is false
 * @param {Criteria} criteria
 * @returns {Function(): Observable<boolean>}
 */
export const isSomeCriterionFalse =
  (criteria: Criteria): AsyncCriterion => () => combineCriteria((values) => values.some(isFalse))(criteria);
