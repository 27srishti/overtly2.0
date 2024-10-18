import React from 'react'

import { canOpenDropbox } from 'react-cloud-chooser'

const DtopboxBtn = ({ openDropbox, isDropboxLoading }) => (
  <button onClick={openDropbox}>
    Dropbox
    {isDropboxLoading && <span>...</span>}
  </button>
)
const DropboxOpenBtn = canOpenDropbox(DtopboxBtn)

export default function DropboxExample(props) { // Fixed function declaration
  return (
    <DropboxOpenBtn
      appKey="j101w30xs3ehgyo"
      linkType='direct'
      success={console.log}
      extensions='.pdf,.jpg'
    />
  )
}