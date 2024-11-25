import { describe, beforeEach, it, vitest, type MockInstance, expect } from 'vitest';
import { of, throwError } from 'rxjs'
import { debugCriterion, takeValues } from './utils'
import { combineCriteria, isEveryAsyncCriterionTrue } from '../criteria/composition'

declare const global: {
  console: { debug: () => void, error: () => void };
};

describe('utils', () => {
  describe('debugCriterion', () => {
    let consoleDebugSpy: MockInstance;
    let consoleErrorSpy: MockInstance;

    beforeEach(() => {
      vitest.clearAllMocks();

      consoleDebugSpy = vitest.spyOn(global.console, 'debug').mockImplementation(() => {})
      consoleErrorSpy = vitest.spyOn(global.console, 'error').mockImplementation(() => {})
    })

    it('should log a console.debug with the name and the result', async () => {
      await takeValues(
        combineCriteria()([
          debugCriterion('Async')(() => of(true)),
          debugCriterion('Sync')(() => false),
          debugCriterion('Is every')(isEveryAsyncCriterionTrue([debugCriterion('In every item')(() => of(true))]))
        ])
      )

      expect(consoleDebugSpy).toHaveBeenCalledTimes(4)
      expect(consoleDebugSpy).toHaveBeenCalledWith('Async', true)
      expect(consoleDebugSpy).toHaveBeenCalledWith('Sync', false)
      expect(consoleDebugSpy).toHaveBeenCalledWith('Is every', true)
      expect(consoleDebugSpy).toHaveBeenCalledWith('In every item', true)
    })

    it('should log a console.error with the name and the result if a criterion errors', async () => {
      const expectedError = new Error('Failed')

      try {
        await takeValues(
          combineCriteria()([
            debugCriterion('Async')(() => throwError(() => expectedError)),
            debugCriterion('Sync')(() => false),
            debugCriterion('Is every')(isEveryAsyncCriterionTrue([debugCriterion('In every item')(() => of(true))]))
          ])
        )
      } catch (error) {
        expect(error).toStrictEqual(expectedError)
        expect(consoleDebugSpy).toHaveBeenCalledTimes(3)
        expect(consoleErrorSpy).toHaveBeenCalledWith('Async', expectedError)
      }
    })
  })
})
