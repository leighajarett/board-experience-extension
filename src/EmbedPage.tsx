import React, { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { EmbedDashboard } from './EmbedDashboard';
import { LookMain } from './EmbedLook';

export function EmbedPage( ) {
  
  useEffect(()=>{
    getBoards();
  },[])

  const getBoards = () => {

  }
  let {content_type }: any = useParams<any>();

  if (content_type === 'looks') {
    return <LookMain/>
  } else if ( content_type.startsWith('dashboards') ) {
    return <EmbedDashboard next={(content_type.endsWith('next'))} />
  } else {
    return <>uh oh! bad url</>
  }
}