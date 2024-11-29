import { Feature, isFeatureEnabled } from './feature-flags';

const isFeatureEnabled$ = isFeatureEnabled(Feature.ExampleFeature);

isFeatureEnabled$.subscribe({
    next: (isEnabled) => console.log('$ Emission - Feature enabled?', isEnabled),
    error: (error) => console.error('$ Error', error),
    complete: () => console.log('$ Done')
});
