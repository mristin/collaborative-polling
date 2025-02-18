import * as react from 'react';

import * as model from './model'

function Question(
  props: {
    doc: model.Document;
    changeDoc: model.ChangeDoc;
    setup: model.Setup;
    question: string;
    vote: string|null;
    onVoteChange: (vote: string|null) => void
  }
) {
  const id = react.useId();

  return (
    <div>
      <h1>{props.question}</h1>

      <div>
        {
          props.setup.grades.map(
            (grade, index) => <div key={index}>
              <input
                type="radio"
                name={id}
                value={grade}
                checked={props.vote === grade}
                onChange={
                  (evt) =>
                    props.onVoteChange(evt.target.value)
                }
              />
              <span>{grade}</span>
            </div>
          )
        }
      </div>
      <div>
        {
          props.setup.grades.map(
            (grade, index) => <div key={index}>
              {grade}: {props.doc.votes[props.question][grade].value}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Question