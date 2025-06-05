import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';
import { PAGES } from '../constants/pages.constants';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface ISidebarList {
  id: number;
  icon: OverridableComponent<SvgIconTypeMap>;
  label: string;
  url: string;
}

export const sidebarList: ISidebarList[] = [
  {
    id: 1,
    icon: HomeOutlinedIcon,
    label: 'Головна',
    url: PAGES.HOME,
  },
  {
    id: 2,
    icon: PeopleOutlinedIcon,
    label: 'Друзі',
    url: PAGES.FRIENDS,
  },
  {
    id: 3,
    icon: NotificationsNoneIcon,
    label: 'Повідомлення',
    url: PAGES.NOTIFICATIONS,
  },
  {
    id: 4,
    icon: ChatBubbleOutlineIcon,
    label: 'Чати',
    url: PAGES.CHATS,
  },
  {
    id: 5,
    icon: SearchIcon,
    label: 'Пошук',
    url: PAGES.SEARCH,
  },
  {
    id: 6,
    icon: PersonOutlineIcon,
    label: 'Профіль',
    url: PAGES.PROFILE,
  },
  {
    id: 7,
    icon: ExitToAppIcon,
    label: 'Вихід',
    url: PAGES.LOGIN,
  },
];
