import { delay, Observable, of, startWith } from 'rxjs'
import { isEveryCriterionTrue, isNotCriterion, isSomeCriterionTrue, type Criteria } from '../../src'

export type FeatureFlags = { [key in Feature]: Criteria }

// 1. Add your new feature here
export enum Feature {
    ExampleFeature = 'exampleFeature'
}

// 2. Add the criteria for the new feature
const featureFlags: FeatureFlags = {
    [Feature.ExampleFeature]: [
        isEveryCriterionTrue([
            isSomeCriterionTrue([
                () => of(false),
                () => false,
                () => of(true).pipe(delay(2000), startWith(false))
            ]),
            isEveryCriterionTrue([
                () => of(true),
                isNotCriterion(() => false),
                () => true
            ])
        ])
    ]
}

// 3. Use the function to evaluate if the feature is enabled
export const isFeatureEnabled = (feature: Feature): Observable<boolean> => isEveryCriterionTrue(featureFlags[feature])()
