import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_FRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_FRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_FRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderColumns, setOrderColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm Column theo CardId, vào oderColumn, duyệt với mỗi column thì map các card trong nó và trả về một mảng gồm id các card với điều kiện mảng đó include cardId đã chuyền vào
  const findColumnByCardId = (cardId) =>
    orderColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    )

  const findCardByCardId = (cardId) =>
    orderColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    )

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_FRAG_ITEM_TYPE.CARD
        : ACTIVE_FRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    // console.log('Drag over: ', event)
    if (activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    if (!active || !over) return
    // activeDraggingCardId và activeDraggingCardData lưu id và data của card đang kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // Column giống nhau thì không xử lý
    if (!activeColumn || !overColumn) return
    // Column khác nhau thì xử lí
    if (activeColumn._id !== overColumn._id) {
      console.log('code vào đây')
      setOrderColumns((prevColumns) => {
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        )
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        let newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumns = nextColumns.find(
          (column) => column._id === activeColumn._id
        )
        const nextOverColumns = nextColumns.find(
          (column) => column._id === overColumn._id
        )
        if (nextActiveColumns) {
          nextActiveColumns.cards = nextActiveColumns.cards.filter(
            (card) => card._id !== activeDraggingCardId
          )
          nextActiveColumns.cardOrderIds = nextActiveColumns.cards.map(
            (card) => card._id
          )
        }
        if (nextOverColumns) {
          nextOverColumns.cards = nextOverColumns.cards.filter(
            (card) => card._id !== activeDraggingCardId
          )
          // kiem tra cái card kéo có đango ở columns target hay chưa, có thì xóa đi
          nextOverColumns.cards = nextOverColumns.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          )
          nextOverColumns.cardOrderIds = nextOverColumns.cards.map(
            (card) => card._id
          )
        }
        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    console.log('there :', event)

    if (activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.CARD) {
      // console.log('handling')
      return
    }

    if (activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldIndex = orderColumns.findIndex((c) => c._id == active.id)
        const newIndex = orderColumns.findIndex((c) => c._id == over.id)
        const dndOrderColumns = arrayMove(orderColumns, oldIndex, newIndex)
        // const dndOrderColumnIds = dndOrderColumns.map((c) => c?._id)
        setOrderColumns(dndOrderColumns)
      }
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5px'
        }
      }
    })
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
    >
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          display: 'flex',
          p: '10px 0',
          bgcolor: (theme) =>
            theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'
        }}
      >
        <ListColumns columns={orderColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
