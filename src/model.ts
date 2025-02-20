import * as an from '@automerge/automerge/next'

// NOTE (mristin):
// This typing trick to represent plain JavaScript objects as dictionaries
// has been taken from:
// https://gist.github.com/ianmstew/2b60f54fc605f81bf53a46d6b6bc9868
type notUndefined = string | number | boolean | symbol | object | null

export interface Dictionary<T extends notUndefined = notUndefined> {
  [key: string]: T | undefined
}

export type Document = an.Doc<SharedState>

export type ChangeDoc = (
  changeFn: an.ChangeFn<SharedState>,
  options?: an.ChangeOptions<SharedState> | undefined
) => void

export class Setup {
  constructor(
    public questions: Array<string>,
    public grades: Array<string>
  ) {
    // Intentionally empty.
  }
}

export function defaultSetup() {
  return new Setup(
    [
      'Clarity / well-structured',
      'Readability',
      'Conciseness',
      'Demonstrated testability',
      'Demonstrated evolvability',
      'Levels of abstraction: ADTs and/or UML class diagrams',
      'Levels of abstraction: Pseudocode',
      'Levels of abstraction: UML state machine(s)',
      'Levels of abstraction: UML sequence diagram(s)',
      'Completeness & correctness: Data structures',
      'Completeness & correctness: Behavior and logic',
      'Completeness & correctness: Quality of contracts and assertions',
    ],
    ['insufficient', 'barely ok', 'ok', 'good']
  )
}

export interface SharedState {
  votes: Dictionary<Dictionary<an.Counter>>
  resetId: an.Counter
}

export function newSharedState(setup: Setup): SharedState {
  const votes: Dictionary<Dictionary<an.Counter>> = {}

  for (const question of setup.questions) {
    const grading: Dictionary<an.Counter> = {}

    for (const grades of setup.grades) {
      grading[grades] = new an.Counter()
    }

    votes[question] = grading
  }

  return { votes: votes, resetId: new an.Counter() }
}

export class LocalState {
  constructor(
    public votes: Dictionary<string | null>,
    public lastObservedResetId: number | null
  ) {
    // Intentionally empty.
  }
}

export function newLocalState(setup: Setup) {
  const votes: Dictionary<string | null> = {}

  for (const question of setup.questions) {
    votes[question] = null
  }

  return new LocalState(votes, null)
}
