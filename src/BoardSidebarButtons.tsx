import React, { useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Space, Box, IconButton } from '@looker/components';
import AppContext from './AppContext';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { startsWithDark } from './theme';

export function BoardSidebarButtons( ) {
  
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const {extensionSDK} = extensionContext
  const { current_theme, all_themes, setCurrentTheme } = useContext(AppContext)
  const { content_type, content_id } = useParams<any>()
  let location = useLocation();
  let history = useHistory();
  useEffect(()=>{
    
  },[])
  
  const dark_mode = startsWithDark(current_theme.name!)

  const handleDarkClick = () => {
    if (dark_mode) {
      setCurrentTheme(all_themes[1])
    } else {
      setCurrentTheme(all_themes[0])
    }
  }

  const handleJump = () => {
    extensionSDK.openBrowserWindow(`/${content_type}/${content_id}${location.search}`, '_blank')
  }
  return (
    <Box>
      <Space evenly>
        <IconButton 
          icon="Return" 
          label="Choose a board"
          onClick={()=>history.push('/')}
        />
        <IconButton 
          icon={(dark_mode)?"Visibility":"VisibilityOutline"} 
          label={(dark_mode)?"Turn off dark mode":"Turn on dark mode"}
          onClick={handleDarkClick} 
        />
        <IconButton 
          icon="ShareAlt" 
          label="Jump to Looker" 
          onClick={handleJump}
        />
      </Space>
    </Box>
  );
}