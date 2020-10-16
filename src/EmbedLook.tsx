import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import {  ExtensionContext } from '@looker/extension-sdk-react'
import { useParams } from 'react-router-dom'
import {  Flex, FlexItem } from '@looker/components';
import styled from 'styled-components'
import { IQuery } from '@looker/sdk/lib/sdk/4.0/models'
import AppContext from './AppContext';

export function LookMain() {
  const [query, setQuery] = useState<IQuery | undefined>();
  const { content_id } = useParams<any>();
  const extensionContext = useContext(ExtensionContext)
  const sdk = extensionContext.core40SDK

  useEffect(()=>{
    if (content_id) {
      getLook();
    }
  },[content_id])

  const getLook = async () => {
    const l = await sdk.ok(sdk.look(content_id))
    setQuery(l.query)
  }

  return (
    <Flex 
      flexDirection="column"
      height="95vh"
      p="large"
    >
      <FlexItem height="50%">
        <LookEmbed setQuery={setQuery} query_id={ (query)?query.id:0 }/>
      </FlexItem>
      <FlexItem height="50%">
        {query && <LookTable query={query}/>}
      </FlexItem>
    </Flex>
  );
}

function LookEmbed( { query_id, setQuery }: any) {
  const [look, setLook] = useState<any>()
  const { content_id } = useParams<any>();
  const extensionContext = useContext(ExtensionContext)
  const sdk = extensionContext.core40SDK
  const {current_theme} = useContext(AppContext)

  const handlePageChange = async (event: any) => {
    const url = new URL(event.page.absoluteUrl)
    const qid = url.searchParams.get('qid')
    if (qid) {
      const q = await sdk.ok(sdk.query_for_slug(qid))
      if (query_id != q.id) {
        setQuery(q)
        if (look) {
          look.run();
        }
      }
    }
  }

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && content_id) {    
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createLookWithId(content_id)
        .appendTo(el)
        .on('page:changed', handlePageChange)
        .withTheme(current_theme.name)
        .build()
        .connect()
        .then(setLook)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [content_id])

  return (
    <EmbedContainer
      ref={embedCtrRef}
    ></EmbedContainer>
  );
}

function LookTable( {query}: any) {
  const extensionContext = useContext(ExtensionContext)
  const {current_theme} = useContext(AppContext)

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && query) {    
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      const search = {
        qid: query.client_id,
        vis: JSON.stringify({
          type: 'looker_grid',  
          table_theme: "transparent"
        }),
        sdk: '2',
        embed_domain: hostUrl,
        sandboxed_host: true
      }
      const params = Object.keys(search).map(function(k) {
        // @ts-ignore
        return encodeURIComponent(k) + '=' + encodeURIComponent(search[k])
      }).join('&')
      
      LookerEmbedSDK.createLookWithUrl(`${hostUrl}/embed/query/${query.model}/${query.view}?${params}`)
        .appendTo(el)
        .withTheme(current_theme.name)
        .build()
        .connect()
        .then(console.log)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [query])

  return (
    <EmbedContainer
      ref={embedCtrRef}
    ></EmbedContainer>
  );
}

export const EmbedContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  & > iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`