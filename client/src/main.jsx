import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import UserProvider from "./ContextApi/UserProvider.jsx"
// import { ClerkProvider } from '@clerk/clerk-react'

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// if(!PUBLISHABLE_KEY){
//   throw new Error(`Missing Clerk Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file' `)
// }
createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY}> */}

      <UserProvider>
        <App />
      </UserProvider>
    {/* </ClerkProvider> */}
  </BrowserRouter>

)
