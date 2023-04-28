import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./components/Root.tsx";
import "rsuite/dist/rsuite.min.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <Root />
  </React.StrictMode>,
)
