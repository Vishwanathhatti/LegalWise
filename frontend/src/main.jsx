import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'


const persistor = persistStore(store)
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
    <Toaster position='top-right' duration={2000} richColors />
  </PersistGate>
  </Provider>
  </BrowserRouter>
  </StrictMode>
  ,
)
