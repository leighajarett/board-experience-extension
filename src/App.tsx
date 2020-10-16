import React, { useState } from 'react'
import { Main } from './Main'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'

export const App: React.FC<{}> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    setRoute(route)
    setRouteState(routeState)
  }

  return (
    <ExtensionProvider onRouteChange={onRouteChange}>
      
      <Main 
        // @ts-ignore
        route={route} 
        routeState={routeState} 
      />
    </ExtensionProvider>
  )
})
