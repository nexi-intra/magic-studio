import React from 'react'
import LayoutThreeRowsLeftPanelAndResults from './layout-three-rows-left-panel-and-results'
import { Popover, PopoverContent } from './ui/popover'
import { LayoutTemplateIcon } from 'lucide-react'
import { Button } from './ui/button'
import { PopoverTrigger } from '@radix-ui/react-popover'
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

export default function TemplateEditor() {
  const leftPanel = <div >
    <MonacoEditor className='p-10 bg-green-500'
      // value={yamlText}
      height="100vh"
      language="yaml"
      onChange={(value) => {
        // setyamlText(value!);
      }}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  </div>
  const rightPanel = <div className='p-10 bg-green-500'>
    <MonacoEditor
      // value={yamlText}
      height="100vh"
      language="yaml"
      onChange={(value) => {
        // setyamlText(value!);
      }}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  </div>

  const resultPanel = <div className='p-10 bg-green-500'></div>
  const loggingPanel = <div className='p-10 bg-green-500'></div>
  return (

    <LayoutThreeRowsLeftPanelAndResults
      leftPanel={leftPanel} rightPanel={rightPanel} resultPanel={resultPanel} loggingPanel={loggingPanel}>

    </LayoutThreeRowsLeftPanelAndResults>

  )
}


export function TemplateEditorButton(props: { className?: string }) {
  const { className } = props
  return (
    <Dialog   >
      <DialogTrigger>
        <Button >
          <LayoutTemplateIcon className={className!} />
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[90vw] h-4/6' >
        <div >
          <TemplateEditor />
        </div>
      </DialogContent>

    </Dialog>
  )
}
