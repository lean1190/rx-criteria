import { of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import type { Criteria } from '../types/types';
import { takeValues } from '../utils/takeValues';
import { isEveryCriterionTrue } from './isEveryCriterionTrue';


describe('isEveryCriterionTrue', () => {
    const criteria: Criteria = [() => of(true), () => of(false), () => of(true)];

    it('should return true if every criterion is true', async () => {
        const expectedResult = true;
        const [result] = await takeValues(isEveryCriterionTrue([() => of(true), () => of(true), () => of(true)])());

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return false if one criterion is false', async () => {
        const expectedResult = false;
        const [result] = await takeValues(isEveryCriterionTrue([() => of(true), () => of(false), () => of(true)])());

        expect(result).toStrictEqual(expectedResult);
    });

    it('should throw an error if a criterion errors', async () => {
        const expectedError = new Error('Failed');

        try {
            await takeValues(isEveryCriterionTrue([...criteria, () => throwError(() => expectedError)])());
        } catch (error) {
            expect(error).toStrictEqual(expectedError);
        }
    });
});
