import '@picocss/pico/css/pico.min.css'
import {useDocument} from '@automerge/automerge-repo-react-hooks'
import type {AutomergeUrl} from '@automerge/automerge-repo'

import * as model from './model'

import './Poll.css'

import Question from "./Question";

function Poll(props: {
  docUrl: AutomergeUrl,
  setup: model.Setup,
  myVotes: model.MyVotes
}) {
  const [doc, changeDoc] = useDocument<model.State>(props.docUrl);

  if (doc === undefined) {
    return <div>
      The document for the {props.docUrl} could not be found.
    </div>
  }

  return (
    <>
      <div>
        <button onClick={(evt) => {
          changeDoc(doc => {
            for (const question of props.setup.questions) {
              for (const grade of props.setup.grades) {
                const counter = doc.votes[question][grade];

                // Be robust to subtle sub-zero racing conditions.
                if (counter.value < 0) {
                  counter.increment(-counter.value)
                } else {
                  counter.decrement(counter.value)
                }
              }

              props.myVotes.votes[question] = null;
            }
          })
        }
        }>Reset
        </button>
      </div>

      {
        props.setup.questions.map(
          (question: string, index: number) =>
            <Question
              doc={doc} changeDoc={changeDoc} setup={props.setup}
              question={question}
              vote={props.myVotes.votes[question]}
              onVoteChange={
                (grade) => {
                  const prevGrade = props.myVotes.votes[question];

                  if (grade == prevGrade) {
                    return;
                  }

                  changeDoc(aDoc => {
                    if (prevGrade !== null) {
                      aDoc.votes[question][prevGrade].decrement(1);
                    }

                    props.myVotes.votes[question] = grade;
                    aDoc.votes[question][grade].increment(1);
                  })
                }
              }
              key={index}
            />
        )
      }
    </>
  )
}

export default Poll
