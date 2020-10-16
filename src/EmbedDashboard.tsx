
import React, { useCallback, useContext, useEffect } from 'react'
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import AppContext from './AppContext'

export const EmbedDashboard: React.FC<any> = ({ next }) => {
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext;
  const { current_theme, filters, setFilters } = useContext(AppContext)

  const {content_id} = useParams<any>();

  const canceller = (event: any) => {
    const is_look_or_dashboard = (['look','dashboard'].indexOf(event.link_type) > -1);
    const is_dashboard_next = ( event.url.startsWith('/embed/dashboards-next/') || event.url.startsWith('/dashboards-next/') )
    if ( is_dashboard_next || is_look_or_dashboard ) {
      extensionSDK.openBrowserWindow(event.url.replace('/embed/','/'),'_blank')
    }
    return { cancel: !event.modal }
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(content_id)
        if (next) {
          db.withNext();
        }
        db.appendTo(el)
          .withTheme(current_theme.name)
          .withFilters(filters)
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
          .on('dashboard:filters:changed', filtersUpdated)
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error: Error) => {
            console.error('Connection error', error)
          })
      }
    },
    [next, content_id, current_theme]
  )

  useEffect(()=>{
    if (dashboard) {
      dashboard.run();
    }
  }, [filters])

  const filtersUpdated = (event: any) => {
    setFilters((event?.dashboard?.dashboard_filters) ? {...filters, ...event.dashboard.dashboard_filters} : filters)
  }

  return (
    <>
      <EmbedContainer ref={embedCtrRef} />
    </>
  )
}


export const EmbedContainer = styled.div`
  width: 100%;
  height: 95vh;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`