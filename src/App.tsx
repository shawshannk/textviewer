import './index.css'
import { Layout } from '@/components/layout/Layout'
import { DropZone } from '@/components/dropzone/DropZone'
import { PasteArea } from '@/components/dropzone/PasteArea'
import { OutputPanel } from '@/components/viewer/OutputPanel'

export default function App() {
  return (
    <Layout>
      <DropZone />
      <PasteArea />
      <OutputPanel />
    </Layout>
  )
}
