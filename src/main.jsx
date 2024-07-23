import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import { CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <ConfirmProvider
      defaultOptions={{
        dialogProps: {
          maxWidth: 'xs'
        },
        allowClose: false,
        confirmationButtonProps: {
          color: 'secondary',
          variant: 'outlined'
        },
        cancellationButtonProps: {
          color: 'inherit'
        }
      }}
    >
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </ConfirmProvider>
  </CssVarsProvider>
  //     <React.StrictMode>
  // </React.StrictMode>
)
