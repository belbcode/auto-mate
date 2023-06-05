import autoLogo from './assets/auto-mate.svg'
import "./watchfile"
import './App.css'

function App() {

  const contentScriptAction = () => {
    return null
  }
  return (
    <>
      <h1>Auto-Mate</h1>
      <div className="card">
        <button onClick={contentScriptAction}>
          Record
        </button>
        <p>
          Press <code>Record</code> and replay your actions.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the logo and become a contributer! Maybe contribute a better logo!
      </p>
      <div>
        <a href="https://github.com/belbcode" target="_blank">
          <img src={autoLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
    </>
  )
}

export default App
