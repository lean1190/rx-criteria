import { of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { takeValues } from '../utils/takeValues';
import { isNotCriterion } from './isNotCriterion';

describe('isNotCriterion', () => {
    it('should return true if the async criterion is false', async () => {
        const expectedResult = true;
        const [result] = await takeValues(isNotCriterion(() => of(false))());

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return false if the async criterion is true', async () => {
        const expectedResult = false;
        const [result] = await takeValues(isNotCriterion(() => of(true))());

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return true if the sync criterion is false', async () => {
        const expectedResult = true;
        const [result] = await takeValues(isNotCriterion(() => false)());

        expect(result).toStrictEqual(expectedResult);
    });

    it('should return false if the sync criterion is true', async () => {
        const expectedResult = false;
        const [result] = await takeValues(isNotCriterion(() => true)());

        expect(result).toStrictEqual(expectedResult);
    });

    it('should throw an error if the criterion errors', async () => {
        const expectedError = new Error('Failed');

        try {
            await takeValues(isNotCriterion(() => throwError(() => expectedError))());
        } catch (error) {
            expect(error).toStrictEqual(expectedError);
        }
    });
});
