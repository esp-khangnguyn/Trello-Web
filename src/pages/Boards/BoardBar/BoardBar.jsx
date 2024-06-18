import DashboardIcon from '@mui/icons-material/Dashboard'
import { Box, Button, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Chip from '@mui/material/Chip'
import { capitalizeFirstLetter } from '~/utils/formatters'

import {
  AddToDrive,
  Bolt,
  FilterList,
  PersonAdd,
  VpnLock
} from '@mui/icons-material'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode == 'dark' ? '#34495e' : '#1976d2',
        borderBottom: '1px solid #00bfa5'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLock />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDrive />}
          label="add-to-drive"
          clickable
        />
        <Chip sx={MENU_STYLES} icon={<Bolt />} label="automation" clickable />
        <Chip sx={MENU_STYLES} icon={<FilterList />} label="filter" clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAdd />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiSvgIcon-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        >
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Khang Nguyen">
            <Avatar alt="Khangdev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
