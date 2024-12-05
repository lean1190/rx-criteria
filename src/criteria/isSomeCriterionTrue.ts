import type { AsyncCriterion, Criteria } from '../types/types';
import { isTrue } from '../utils/isTrue';
import { combineCriteria } from './combineCriteria';

/**
 * Returns true if any criterion is true
 * @param {Criteria} criteria
 * @returns {Function(): Observable<boolean>}
 */
export const isSomeCriterionTrue =
  (criteria: Criteria): AsyncCriterion => () => combineCriteria((values) => values.some(isTrue))(criteria);