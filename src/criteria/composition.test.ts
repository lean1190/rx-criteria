import { describe, it, expect } from 'vitest';
import { of, throwError } from 'rxjs'
import { takeValues } from '../utils/utils'
import { combineCriteria, isEveryCriterionTrue, isSomeCriterionTrue, isNotCriterion } from './composition'
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
          isSomeCriterionTrue([() => of(true), () => of(false), () => of(false)]),
          isEveryCriterionTrue([() => of(true), () => of(true), () => of(true)]),
          isSomeCriterionTrue([isEveryCriterionTrue([() => of(true)]), () => of(false), () => of(false)])
        ])
      )

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true for a criteria that combines sync and async criterion', async () => {
      const expectedResult = true

      const [result] = await takeValues(
        combineCriteria()([
          isSomeCriterionTrue([() => of(true), () => of(false), () => false]),
          isEveryCriterionTrue([() => true, () => of(true), () => true]),
          isSomeCriterionTrue([isEveryCriterionTrue([() => of(true)]), () => false, () => false])
        ])
      )

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false for a sync criteria', async () => {
      const expectedResult = false

      const [result] = await takeValues(
        combineCriteria()([() => true, isEveryCriterionTrue([() => false, () => true])])
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

  describe('isEveryCriterionTrue', () => {
    it('should return true if every criterion is true', async () => {
      const expectedResult = true
      const [result] = await takeValues(isEveryCriterionTrue([() => of(true), () => of(true), () => of(true)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if one criterion is false', async () => {
      const expectedResult = false
      const [result] = await takeValues(isEveryCriterionTrue([() => of(true), () => of(false), () => of(true)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if a criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(isEveryCriterionTrue([...criteria, () => throwError(() => expectedError)])())
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })

  describe('isSomeCriterionTrue', () => {
    it('should return true if every criterion is true', async () => {
      const expectedResult = true
      const [result] = await takeValues(isSomeCriterionTrue([() => of(true), () => of(true), () => of(true)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true if one criterion is true', async () => {
      const expectedResult = true
      const [result] = await takeValues(isSomeCriterionTrue([() => of(true), () => of(false), () => of(false)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if every criterion is false', async () => {
      const expectedResult = false
      const [result] = await takeValues(isSomeCriterionTrue([() => of(false), () => of(false), () => of(false)])())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if a criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(isSomeCriterionTrue([...criteria, () => throwError(() => expectedError)])())
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })

  describe('isNotCriterion', () => {
    it('should return true if the async criterion is false', async () => {
      const expectedResult = true
      const [result] = await takeValues(isNotCriterion(() => of(false))())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if the async criterion is true', async () => {
      const expectedResult = false
      const [result] = await takeValues(isNotCriterion(() => of(true))())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return true if the sync criterion is false', async () => {
      const expectedResult = true
      const [result] = await takeValues(isNotCriterion(() => false)())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return false if the sync criterion is true', async () => {
      const expectedResult = false
      const [result] = await takeValues(isNotCriterion(() => true)())

      expect(result).toStrictEqual(expectedResult)
    })

    it('should throw an error if the criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(isNotCriterion(() => throwError(() => expectedError))())
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
      }
    })
  })
})
