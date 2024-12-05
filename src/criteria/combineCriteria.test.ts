import { of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import type { Criteria } from '../types/types';
import { takeValues } from '../utils/takeValues';
import { combineCriteria } from './combineCriteria';
import { isEveryCriterionTrue } from './isEveryCriterionTrue';
import { isSomeCriterionTrue } from './isSomeCriterionTrue';

describe('combineCriteria', () => {
    const criteria: Criteria = [() => of(true), () => of(false), () => of(true)];

    it('should return false when using the default map function', async () => {
        const expectedResult = false;
        const [result] = await takeValues(combineCriteria()(criteria));

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return true for a complicated criteria', async () => {
        const expectedResult = true;

        const [result] = await takeValues(
            combineCriteria()([
                isSomeCriterionTrue([() => of(true), () => of(false), () => of(false)]),
                isEveryCriterionTrue([() => of(true), () => of(true), () => of(true)]),
                isSomeCriterionTrue([isEveryCriterionTrue([() => of(true)]), () => of(false), () => of(false)])
            ])
        );

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return true for a criteria that combines sync and async criterion', async () => {
        const expectedResult = true;

        const [result] = await takeValues(
            combineCriteria()([
                isSomeCriterionTrue([() => of(true), () => of(false), () => false]),
                isEveryCriterionTrue([() => true, () => of(true), () => true]),
                isSomeCriterionTrue([isEveryCriterionTrue([() => of(true)]), () => false, () => false])
            ])
        );

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return false for a sync criteria', async () => {
        const expectedResult = false;

        const [result] = await takeValues(
            combineCriteria()([() => true, isEveryCriterionTrue([() => false, () => true])])
        );

        expect(result).toStrictEqual(expectedResult);
    });

    it('should throw an error if a criterion errors', async () => {
        const expectedError = new Error('Failed');

        try {
            await takeValues(combineCriteria()([...criteria, () => throwError(() => expectedError)]));
        } catch (error) {
            expect(error).toStrictEqual(expectedError);
        }
    });
});
