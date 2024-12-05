import type { AsyncCriterion, Criteria } from '../types/types';
import { isTrue } from '../utils/isTrue';
import { combineCriteria } from './combineCriteria';

/**
 * Returns true if every criterion is true
 * @param {Criteria} criteria
 * @returns {Function(): Observable<boolean>}
 */
export const isEveryCriterionTrue =
  (criteria: Criteria): AsyncCriterion => () => combineCriteria((values) => values.every(isTrue))(criteria);
