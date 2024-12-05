import type { TransformFunction } from '../types/types';
import { isTrue } from './isTrue';

/**
 * Returns true if every value is true
 * @param {boolean[]} values
 * @returns {boolean}
 */
export const defaultTransformFunction: TransformFunction = (values) => values.every(isTrue);
