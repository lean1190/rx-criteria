import { Observable } from 'rxjs';

export type TransformFunction = (values: boolean[]) => boolean
export type SyncCriterion = () => boolean
export type AsyncCriterion = () => Observable<boolean>
export type Criterion = AsyncCriterion | SyncCriterion
export type Criteria = Criterion[]
export type AsyncCriteriaCompositionFunction = (criteria: Criteria) => Observable<boolean>
