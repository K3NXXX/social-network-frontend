import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';

import type { SvgIconTypeMap } from '@mui/material';
import type { OverridableComponent } from '@mui/material/OverridableComponent';

import { PAGES } from '../constants/pages.constants';

interface ISidebarList {
  id: number;
  icon: OverridableComponent<SvgIconTypeMap>;
  labelKey: string;
  url?: string;
}

export const sidebarList: ISidebarList[] = [
  {
    id: 1,
    icon: HomeOutlinedIcon,
    labelKey: 'sidebar.home',
    url: PAGES.HOME,
  },
  {
    id: 3,
    icon: NotificationsNoneIcon,
    labelKey: 'sidebar.notifications',
    url: PAGES.NOTIFICATIONS,
  },
  {
    id: 4,
    icon: ChatBubbleOutlineIcon,
    labelKey: 'sidebar.chats',
    url: PAGES.CHATS,
  },
  {
    id: 5,
    icon: SearchIcon,
    labelKey: 'sidebar.search',
    url: PAGES.SEARCH,
  },
  {
    id: 6,
    icon: PersonOutlineIcon,
    labelKey: 'sidebar.profile',
    url: PAGES.PROFILE,
  },
  {
    id: 7,
    icon: LanguageIcon,
    labelKey: 'sidebar.changeLanguage',
  },
  {
    id: 8,
    icon: ExitToAppIcon,
    labelKey: 'sidebar.logout',
    url: PAGES.LOGIN,
  },
];
