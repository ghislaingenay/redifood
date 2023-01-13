import {
  AppleOutlined,
  AreaChartOutlined,
  HomeOutlined,
  LogoutOutlined,
  PauseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ENavList } from "@interfaces/nav.interface";

const fontSizeIcons = { fontSize: "1rem" };
export const navRoutes = [
  { key: ENavList.HOME, icon: <HomeOutlined style={fontSizeIcons} />, label: ENavList.HOME_LABEL },
  { key: ENavList.FOOD, icon: <AppleOutlined style={fontSizeIcons} />, label: ENavList.FOOD_LABEL },
  { key: ENavList.ANALYTICS, icon: <AreaChartOutlined style={fontSizeIcons} />, label: ENavList.ANALYTICS_LABEL },
  { key: ENavList.SETTINGS, icon: <SettingOutlined style={fontSizeIcons} />, label: ENavList.SETTINGS_LABEL },
  { key: ENavList.ABOUT_US, icon: <PauseOutlined style={fontSizeIcons} />, label: ENavList.ABOUT_US_LABEL },
  { key: ENavList.SIGNOUT, icon: <LogoutOutlined style={fontSizeIcons} />, label: ENavList.SIGNOUT_LABEL },
];
