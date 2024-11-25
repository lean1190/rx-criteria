import { describe, beforeEach, it, vitest, type MockInstance, expect } from 'vitest';
import { of, throwError } from 'rxjs'
import { takeValues } from '../utils/utils'
import { combineCriteria, isEveryAsyncCriterionTrue, isSomeAsyncCriterionTrue, isNotAsyncCriterion } from './composition'
import type { Criteria } from '../types/types'

describe('composition async criteria', () => {
  const criteria: Criteria = [() => of(true), () => of(false), () => of(true)]

  describe('combineCriteria', () => {
    it('should return false when using the default map function', async () => {
      const expectedResult = false
      const [result] = await takeValues(combineCriteria()(criteria))

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true for a complicated criteria', async () => {
      const expectedResult = true

      const [result] = await takeValues(
        combineCriteria()([
          isSomeAsyncCriterionTrue([() => of(true), () => of(false), () => of(false)]),
          isEveryAsyncCriterionTrue([() => of(true), () => of(true), () => of(true)]),
          isSomeAsyncCriterionTrue([isEveryAsyncCriterionTrue([() => of(true)]), () => of(false), () => of(false)])
        ])
      )

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true for a criteria that combines sync and async criterion', async () => {
      const expectedResult = true

      const [result] = await takeValues(
        combineCriteria()([
          isSomeAsyncCriterionTrue([() => of(true), () => of(false), () => false]),
          isEveryAsyncCriterionTrue([() => true, () => of(true), () => true]),
          isSomeAsyncCriterionTrue([isEveryAsyncCriterionTrue([() => of(true)]), () => false, () => false])
        ])
      )

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false for a sync criteria', async () => {
      const expectedResult = false

      const [result] = await takeValues(
        combineCriteria()([() => true, isEveryAsyncCriterionTrue([() => false, () => true])])
      )

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if a criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(combineCriteria()([...criteria, () => throwError(() => expectedError)]))
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })

  describe('isEveryAsyncCriterionTrue', () => {
    it('should return true if every criterion is true', async () => {
      const expectedResult = true
      const [result] = await takeValues(isEveryAsyncCriterionTrue([() => of(true), () => of(true), () => of(true)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if one criterion is false', async () => {
      const expectedResult = false
      const [result] = await takeValues(isEveryAsyncCriterionTrue([() => of(true), () => of(false), () => of(true)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if a criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(isEveryAsyncCriterionTrue([...criteria, () => throwError(() => expectedError)])())
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })

  describe('isSomeAsyncCriterionTrue', () => {
    it('should return true if every criterion is true', async () => {
      const expectedResult = true
      const [result] = await takeValues(isSomeAsyncCriterionTrue([() => of(true), () => of(true), () => of(true)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true if one criterion is true', async () => {
      const expectedResult = true
      const [result] = await takeValues(isSomeAsyncCriterionTrue([() => of(true), () => of(false), () => of(false)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if every criterion is false', async () => {
      const expectedResult = false
      const [result] = await takeValues(isSomeAsyncCriterionTrue([() => of(false), () => of(false), () => of(false)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if a criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(isSomeAsyncCriterionTrue([...criteria, () => throwError(() => expectedError)])())
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })

  describe('isNotAsyncCriterion', () => {
    it('should return true if the async criterion is false', async () => {
      const expectedResult = true
      const [result] = await takeValues(isNotAsyncCriterion(() => of(false))())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if the async criterion is true', async () => {
      const expectedResult = false
      const [result] = await takeValues(isNotAsyncCriterion(() => of(true))())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true if the sync criterion is false', async () => {
      const expectedResult = true
      const [result] = await takeValues(isNotAsyncCriterion(() => false)())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if the sync criterion is true', async () => {
      const expectedResult = false
      const [result] = await takeValues(isNotAsyncCriterion(() => true)())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if the criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(isNotAsyncCriterion(() => throwError(() => expectedError))())
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })
})
