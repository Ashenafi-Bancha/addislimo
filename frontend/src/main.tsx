import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/app/App'
import { RouterProvider } from '@/app/router'
import '@/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </React.StrictMode>,
)
