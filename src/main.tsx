import React from 'react'
import ReactDOM from 'react-dom/client'
import QRCode from "react-qr-code";

import {isValidAutomergeUrl, Repo, RepoConfig} from '@automerge/automerge-repo'
import {BrowserWebSocketClientAdapter} from '@automerge/automerge-repo-network-websocket'
import {IndexedDBStorageAdapter} from "@automerge/automerge-repo-storage-indexeddb"
import {RepoContext} from '@automerge/automerge-repo-react-hooks'

import Poll from './Poll.tsx'
import * as model from './model'

import './index.css'

const repoConfig: RepoConfig = {
  network: [new BrowserWebSocketClientAdapter(
    "wss://sync.automerge.org"
  )],
  storage: new IndexedDBStorageAdapter(),
}

const repo = new Repo(repoConfig)

const setup = model.defaultSetup()

const rootDocUrl = `${document.location.hash.substring(1)}`
let handle
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl)
} else {
  handle = repo.create<model.State>(model.newState(setup))
}
const docUrl = document.location.hash = handle.url

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <QRCode value={docUrl} />
      <div style={{padding: "2em"}} />

      <Poll docUrl={docUrl} setup={model.defaultSetup()}
            myVotes={model.newMyVotes(setup)}/>
    </RepoContext.Provider>
  </React.StrictMode>,
)
