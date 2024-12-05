import { catchError, shareReplay } from 'rxjs';

import type { Criterion } from '../types/types';
import { toObservable } from './toObservable';

/**
 * Subscribes to the criterion and logs the value
 * @param {string} name
 * @returns {Function(criterion: Criterion): Criterion}
 */
export const debugCriterion =
  (name: string) => (criterion: Criterion): Criterion => {
      toObservable(criterion())
          .pipe(
              catchError((error, caught) => {
                  console.error(name, error);

                  return caught;
              }),
              shareReplay()
          )
          .subscribe((result: unknown) => console.debug(name, result));

      return criterion;
  };
