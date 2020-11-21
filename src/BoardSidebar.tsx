import React, { useContext } from 'react';
import {Flex, Heading, MenuGroup, MenuItem, MenuList } from '@looker/components';
import styled from 'styled-components'
import { keyBy } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from './AppContext';
import qs from 'query-string'
import { BoardSidebarButtons } from './BoardSidebarButtons';
import { ExtensionContext } from '@looker/extension-sdk-react';

export function BoardSidebar( { board }: any ) {
  let history = useHistory();
  let {board_id, content_type, content_id }: any = useParams<any>();
  let { filters } = useContext(AppContext)
  let {  extensionSDK } = useContext(ExtensionContext)

  const handleClick = (board_item: any) => {
    extensionSDK.track('click', JSON.stringify({board_id, url: board_item.url}))
    history.push({
      pathname: `/boards/${board_id}${board_item.url}`,
      search: qs.stringify(filters)
    })
  }

  const board_sections = keyBy(board.board_sections, 'id' )
  const Section = board.section_order.map((id: number)=>{
    const section_items = keyBy(board_sections[id].board_items, 'id')
    return (
        <StyledMenuGroup 
          key={`section::${id}`} label={board_sections[id].title}
        >
          {board_sections[id].item_order.map((item_id: number)=>{
            return (
                <MenuItem
                  key={`item::${item_id}`}
                  current={(section_items[item_id].url === `/${content_type}/${content_id}`)}
                  onClick={()=>{handleClick(section_items[item_id])}}
                >{section_items[item_id].title}</MenuItem>
            );
          })}
        </StyledMenuGroup>
    )
  })
  return <>
  <Heading mb="small">{board.title}</Heading>
  <Flex 
    height="92vh"
    flexDirection="column" 
    justifyContent="space-between"
  >
    <MenuList>{Section}</MenuList>
    <BoardSidebarButtons />
  </Flex>
  </>
}
// @ts-ignore
const StyledMenuGroup = styled(MenuGroup)`
  list-style: none;
`