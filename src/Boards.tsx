import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { doDefaultActionListSort, ActionList, ActionListItemColumn, ActionListItem, Heading, Box } from '@looker/components';
import { IBoard } from '@looker/sdk/lib/sdk/4.0/models';
import { useHistory } from 'react-router-dom';
import { filter, keyBy } from 'lodash';

export function Boards( ) {
  let history = useHistory(); 
  const [boards, setBoards] = useState< IBoard[] | any >([])
  const [columns, setColumns] = useState<any>([
    {
      canSort: true,
      id: 'id',
      primaryKey: true,
      title: 'ID',
      type: 'number',
      sortDirection: 'asc',
      widthPercent: 20,
    },
    {
      canSort: true,
      id: 'title',
      title: 'Title',
      type: 'string',
      widthPercent: 30,
    },
    {
      canSort: false,
      id: 'description',
      title: 'Description',
      type: 'string',
      widthPercent: 50,
    }
  ])
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const sdk = extensionContext.core40SDK;

  const onSort = (id: string, sortDirection: "asc" | "desc") => {
    const {
      columns: sortedColumns,
      data: sortedData,
    } = doDefaultActionListSort(boards, columns, id, sortDirection)
    setBoards(sortedData)
    setColumns(sortedColumns)
  }

  const handleClick = (board: IBoard) => {
    let first_content: any = {}
    if (board?.board_sections?.length && board.board_sections[0].board_items?.length) {
      const board_sections = keyBy(board.board_sections, 'id' )
      const first_section = board_sections[board!.section_order![0]]
      const section_items = keyBy(first_section.board_items, 'id')
      const first_item = section_items[first_section!.item_order![0]]
      first_content = first_item
    }
    if ( first_content?.url && board?.id ) {
      history.push(`/boards/${board.id}${first_content.url}`)
    }
  }

  let items = <></>;
  if (boards?.length) {
    items = boards.map((board: IBoard) => {
      return (
        <ActionListItem
          id={`${board.id}`}
          key={board.id}
          onClick={() => handleClick(board)}
        >
          <ActionListItemColumn>{board.id}</ActionListItemColumn>
          <ActionListItemColumn>{board.title}</ActionListItemColumn>
          <ActionListItemColumn>{board.description}</ActionListItemColumn>
        </ActionListItem>
      )
    })
  } 


  useEffect(()=>{
    getBoards();
  },[])

  const getBoards = async () => {
    const b = await sdk.ok(sdk.all_boards('id,title,description,section_order,board_sections(id,item_order,board_items(id,url))'))
    setBoards(filter(b, o=>{
      return (o?.board_sections?.length && o?.board_sections[0].board_items?.length )
    }))
  }
  if ( boards?.length ) {
    return (
      <Box p="large">
        <Heading>Select a Board</Heading>
        <ActionList onSort={onSort} columns={columns}>
          {items}
        </ActionList>
      </Box>
    )
  } else {
    return <></>
  }
}
