import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as ReduxProvide } from 'react-redux'

import App from './src/index'
import store from "./src/redux/store";

export default () => {
  return (
    <ReduxProvide store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </ReduxProvide>
  )
}
