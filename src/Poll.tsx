import * as assert from './assert'
import * as model from './model'

import './Poll.css'

import Question from './Question'

function Poll(props: {
  doc: model.Document
  changeDoc: model.ChangeDoc
  setup: model.Setup
  localState: model.LocalState
}) {
  if (props.doc.resetId.value !== props.localState.lastObservedResetId) {
    for (const question of props.setup.questions) {
      props.localState.votes[question] = null
    }
    props.localState.lastObservedResetId = props.doc.resetId.value
  }

  return (
    <>
      <div style={{ width: '100%', textAlign: 'right' }}>
        <button
          onClick={() => {
            props.changeDoc((doc) => {
              for (const question of props.setup.questions) {
                for (const grade of props.setup.grades) {
                  assert.isDefined(doc.votes[question])
                  assert.isDefined(doc.votes[question][grade])

                  const counter = doc.votes[question][grade]

                  // Be robust to subtle sub-zero racing conditions.
                  if (counter.value < 0) {
                    counter.increment(-counter.value)
                  } else {
                    counter.decrement(counter.value)
                  }
                }
              }

              doc.resetId.increment(1)
            })
          }}
        >
          Reset
        </button>
      </div>

      {props.setup.questions.map((question: string, index: number) => (
        <Question
          doc={props.doc}
          changeDoc={props.changeDoc}
          setup={props.setup}
          question={question}
          vote={props.localState.votes[question]!}
          onVoteChange={(grade) => {
            const prevGrade = props.localState.votes[question]!

            if (grade == prevGrade) {
              return
            }

            props.changeDoc((doc) => {
              if (prevGrade !== null) {
                doc.votes[question]![prevGrade]!.decrement(1)
              }

              props.localState.votes[question] = grade

              if (grade !== null) {
                doc.votes[question]![grade]!.increment(1)
              }
            })
          }}
          key={index}
        />
      ))}
    </>
  )
}

export default Poll
