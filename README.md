# [Rx Criteria](https://www.npmjs.com/package/rx-criteria)

RxJs boolean conditions with ease.
```
npm i rx-criteria
```

## The idea
When working with configurations, Observables composition can be messy.

This library aims to provide a simple and semantic interface to compose asynchronous boolean conditions using Observables.

### The Criterion
A Criterion is the fundamental piece of this library, and it is a function with no arguments that returns a boolean, or a boolean Observable. Simple.
```typescript
export type SyncCriterion = () => boolean
export type AsyncCriterion = () => Observable<boolean>
export type Criterion = AsyncCriterion | SyncCriterion
```

### How to use it
<i>You can find a complete example to build a Feature Flags system in [the "examples" folder](https://github.com/lean1190/rx-criteria/tree/main/examples/feature-flags).</i>

With this library we can compose functions with ease.

You can use the generic function `combineCriteria` to create a custom criteria combination, or use expressive functions like `isEveryCriterionTrue`.

```typescript
const complexCriteria = isEveryCriterionTrue([
    isSomeCriterionTrue([
        () => of(false),
        () => false,
        () => of(true).pipe(delay(2000), startWith(false))
    ]),
    isEveryCriterionTrue([
        () => of(true),
        () => true,
        () => true
    ])
])
```

## Peer Dependencies
- RxJs 7

## Author
[Lean Vilas](https://github.com/lean1190)

Comments? [Contact me on LinkedIn](https://www.linkedin.com/in/leanvilas/)

## Licence
Apache License 2.0
