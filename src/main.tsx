import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './app/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Wrap your App in the Provider and pass the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
