import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom'
import { Box, ComponentsProvider } from '@looker/components'
import AppContext from './AppContext'
import { createTheme, startsWithDark } from './theme'
import { Boards } from './Boards'
import { BoardPage } from './BoardPage'
import { ExtensionContext, ExtensionContextData } from '@looker/extension-sdk-react'
import qs from 'query-string';
import { ITheme } from '@looker/sdk/lib/sdk/3.1/models'
import { find, sortBy } from 'lodash'

export const Main: React.FC = ({
  route,
  routeState,
}: any) => {
  let history = useHistory();
  let location = useLocation();

  const [current_theme, setCurrentTheme] = useState<ITheme>()
  const [all_themes, setAllThemes] = useState<ITheme[]>()
  const [filters, setFilters] = useState(qs.parse(location.search));
  const [ready, setReady] = useState(false);

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.core40SDK

  useEffect(() => {
    if (filters) {
      history.push({
        pathname: location.pathname,
        search: qs.stringify(filters)
      })
    }
  }, [filters])

  useEffect(()=>{
    getTheme();
  },[])

  useEffect(()=>{
    if (current_theme) {
      setThemeStorage();
    }
  },[current_theme])

  const getTheme = async () => {
    let themes: ITheme[] = [{id: 0, name:"dark"},{id: 0, name:"default"}];
    let default_theme: ITheme = {id: 0, name:"default"};
    try {
      themes = await sdk.ok(sdk.all_themes('id,name,settings'))
      default_theme = await sdk.ok(sdk.default_theme())
    } catch(e) {
      console.warn('Could not find Themes, do you have the license feature?')
    }
    const value = await extensionSDK.localStorageGetItem('theme')
    // @ts-ignore
    const found_theme: ITheme = find(themes, {name: value})
    
    if (found_theme) {
      setCurrentTheme(found_theme)
    } else {
      setCurrentTheme(default_theme)
    }
    
    if (themes.length > 1) {
      const firstDark = find(sortBy(themes, ['id']), o=>{
        return startsWithDark(o.name!)
      })
      // @ts-ignore
      setAllThemes([firstDark || themes[0], default_theme])
    } else {
      setAllThemes(themes)
    }
    setReady(true)
  }

  const setThemeStorage = async () => {
    await extensionSDK.localStorageSetItem('theme', current_theme.name||'default')
  }
  if ( ready ) {
    return (
      <AppContext.Provider value={{
        setCurrentTheme,
        filters, setFilters,
        current_theme, all_themes
      }}>
        <ComponentsProvider key={current_theme.name} theme={createTheme(current_theme)}>
          <Box backgroundColor="background">
            <Switch>
              <Route path='/boards/:board_id/:content_type/:content_id'>
                <BoardPage />
              </Route>
              <Route>
                <Boards />
              </Route>
              <Redirect to='/' />
            </Switch>
          </Box>
        </ComponentsProvider>
      </AppContext.Provider>
    )
  } else {
    return <></>
  }

}