import {AutomergeUrl} from "@automerge/automerge-repo";
import * as model from "./model";
import {useDocument} from "@automerge/automerge-repo-react-hooks";

import Poll from "./Poll";

function App(props: {
  docUrl: AutomergeUrl,
  setup: model.Setup,
  localState: model.LocalState
}) {
  const [doc, changeDoc] = useDocument<model.SharedState>(props.docUrl);

  if (doc === undefined) {
    return <div>
      The document for the {props.docUrl} could not be found.
    </div>
  }

  return (
    <Poll doc={doc} changeDoc={changeDoc}
          setup={props.setup}
          localState={props.localState}
    />
  )
}

export default App;
