import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm Column theo CardId, vào oderColumn, duyệt với mỗi column thì map các card trong nó và trả về một mảng gồm id các card với điều kiện mảng đó include cardId đã chuyền vào
  const findColumnByCardId = (cardId) =>
    orderColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    )

  const moveCardBetweenDifferentColumn = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

        if (isEmpty(nextActiveColumns.cards)) {
          nextActiveColumns.cards = [generatePlaceHolderCard(nextActiveColumns)]
        }

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

        // Xoa card fake di neu no ton tai
        nextOverColumns.cards = nextOverColumns.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )

        nextOverColumns.cardOrderIds = nextOverColumns.cards.map(
          (card) => card._id
        )
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_FRAG_ITEM_TYPE.CARD
        : ACTIVE_FRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetweenDifferentColumn(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) return

    if (activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId và activeDraggingCardData lưu id và data của card đang kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDragItemId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumn(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // console.log('Cung column')
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )

        // Sap xep card
        const dndOrderCard = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )

        setOrderColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find((c) => c._id == overColumn._id)

          targetColumn.cards = dndOrderCard
          targetColumn.cardOrderIds = dndOrderCard.map((c) => c._id)

          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderColumns.findIndex((c) => c._id == active.id)
        const newColumnIndex = orderColumns.findIndex((c) => c._id == over.id)
        const dndOrderColumns = arrayMove(
          orderColumns,
          oldColumnIndex,
          newColumnIndex
        )
        // const dndOrderColumnIds = dndOrderColumns.map((c) => c?._id)
        setOrderColumns(dndOrderColumns)
      }
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_FRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerCollisions = pointerWithin(args)

      if (!pointerCollisions?.length) return

      // Collision detection algorithms return an array of collisions
      // eslint-disable-next-line no-extra-boolean-cast
      // const intersections =
      //   !!pointerCollisions?.length > 0
      //     ? pointerCollisions
      //     : rectIntersection(args)

      let overId = getFirstCollision(pointerCollisions, 'id')

      if (overId) {
        const checkColumn = orderColumns.find((c) => c._id === overId)
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (c) => c.id !== overId && checkColumn?.cardOrderIds.includes(c.id)
            )
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType]
  )

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
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
