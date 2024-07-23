import { useSortable } from '@dnd-kit/sortable'
import { Attachment, Comment, Group } from '@mui/icons-material'
import {
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import theme from '~/theme'

function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { ...card } })

  const dndKitColumnStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  }
  const shouldShowCard = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    )
  }

  // return (
  //   <MuiCard
  //     sx={{
  //       cursor: 'pointer',
  //       boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
  //       overflow: 'unset'
  //     }}
  //   >
  //     <CardContent
  //       sx={{ p: 1.5, '&:last-child': { p: 1.5 }, overflow: 'unset' }}
  //     >
  //       <Typography>Card 01</Typography>
  //     </CardContent>
  //   </MuiCard>
  // )

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitColumnStyle}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceHolder ? 'none' : 'block',
        padding: card?.FE_PlaceHolder ? '0px' : 'auto',
        border: '1px solid transparent',
        '&:hover': {
          borderColor: (theme) => theme.palette.primary.main
        }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ overflow: 'unset', p: '16px !important' }}>
        <Typography>{card?.title}</Typography>
      </CardContent>

      {shouldShowCard() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds.length && (
            <Button size="small" startIcon={<Group />}>
              {card?.memberIds.length}
            </Button>
          )}
          {!!card?.comments.length && (
            <Button size="small" startIcon={<Comment />}>
              {card?.comments.length}
            </Button>
          )}
          {!!card?.attachments.length && (
            <Button size="small" startIcon={<Attachment />}>
              {card?.attachments.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}
export default Card
