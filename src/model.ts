import * as an from '@automerge/automerge/next'

// NOTE (mristin):
// This typing trick to represent plain JavaScript objects as dictionaries
// has been taken from:
// https://gist.github.com/ianmstew/2b60f54fc605f81bf53a46d6b6bc9868
type notUndefined = string | number | boolean | symbol | object;

export interface Dictionary<T extends notUndefined = notUndefined> {
  [key: string]: T | undefined;
}

export type Document = an.Doc<State>;

export type ChangeDoc = (
  changeFn: an.ChangeFn<State>,
  options?: an.ChangeOptions<State> | undefined
) => void;

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
      "Clarity / well-structured",
      "Readability",
      "Conciseness",
      "Demonstrated testability",
      "Demonstrated evolvability",
      "Levels of abstraction: ADTs and/or UML class diagrams",
      "Levels of abstraction: Pseudocode",
      "Levels of abstraction: UML state machine(s)",
      "Levels of abstraction: UML sequence diagram(s)",
      "Completeness & correctness: Data structures",
      "Completeness & correctness: Behavior and logic",
      "Completeness & correctness: Quality of contracts and assertions"
    ],
    [
      "insufficient",
      "barely ok",
      "ok",
      "good"
    ]
  )
}


export interface State {
  votes: Dictionary<Dictionary<an.Counter>>;
}

export function newState(setup: Setup): State {
  const votes = {}

  for (const question of setup.questions) {
    const grading = {}

    for (const grades of setup.grades) {
      grading[grades] = new an.Counter();
    }

    votes[question] = grading;
  }

  return {votes: votes}
}

export class MyVotes {
  constructor(public votes: Dictionary<string | null>) {
    // Intentionally empty.
  }
}

export function newMyVotes(setup: Setup) {
  const votes = {}
  for (const question of setup.questions) {
    votes[question] = null;
  }

  return new MyVotes(votes)
}