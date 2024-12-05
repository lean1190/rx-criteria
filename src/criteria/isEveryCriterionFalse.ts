import type { AsyncCriterion, Criteria } from '../types/types';
import { isFalse } from '../utils/isFalse';
import { combineCriteria } from './combineCriteria';

/**
 * Returns true if every criterion is false
 * @param {Criteria} criteria
 * @returns {Function(): Observable<boolean>}
 */
export const isEveryCriterionFalse =
  (criteria: Criteria): AsyncCriterion => () => combineCriteria((values) => values.every(isFalse))(criteria);
