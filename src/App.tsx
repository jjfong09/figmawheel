import { Analytics } from '@vercel/analytics/react'
import { SpinningWheelApp } from './SpinningWheelApp'

function App() {
  return (
    <>
      <SpinningWheelApp />
      <Analytics />
    </>
  )
}

export default App
