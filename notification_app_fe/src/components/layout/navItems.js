import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export const mainNavItems = [
  { label: "Overview", href: "/", icon: DashboardOutlinedIcon },
  { label: "All Notifications", href: "/notifications", icon: NotificationsOutlinedIcon },
  { label: "Priority Inbox", href: "/priority-inbox", icon: InboxOutlinedIcon },
  { label: "Events", href: "/notifications?type=Event", icon: EventOutlinedIcon },
  { label: "Placements", href: "/notifications?type=Placement", icon: WorkOutlineIcon },
  { label: "Results", href: "/notifications?type=Result", icon: EmojiEventsOutlinedIcon },
];

export const bottomNavItems = [
  { label: "Settings", href: "/settings", icon: SettingsOutlinedIcon },
  { label: "Help & Support", href: "/help", icon: HelpOutlineIcon },
];
