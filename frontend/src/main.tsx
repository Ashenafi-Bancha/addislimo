import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/app/App'
import { RouterProvider } from '@/app/router'
import '@/styles/index.css'

/**
 * Marks the document as able to animate. Scroll reveals hide themselves only
 * under this class, so if the bundle fails to load or is blocked, the page
 * still renders every section rather than a column of blank space.
 */
document.documentElement.classList.add('motion-ready')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </React.StrictMode>,
)
