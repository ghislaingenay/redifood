import { AppleOutlined, AreaChartOutlined, HomeOutlined, PauseOutlined, SettingOutlined } from "@ant-design/icons";
import { ENavList } from "@interfaces/nav.interface";

export const navRoutes = [
  { key: ENavList.HOME, icon: <HomeOutlined />, label: ENavList.HOME_LABEL },
  { key: ENavList.FOOD, icon: <AppleOutlined />, label: ENavList.FOOD_LABEL },
  { key: ENavList.ANALYTICS, icon: <AreaChartOutlined />, label: ENavList.ANALYTICS_LABEL },
  { key: ENavList.SETTINGS, icon: <SettingOutlined />, label: ENavList.SETTINGS_LABEL },
  { key: ENavList.ABOUT_US, icon: <PauseOutlined />, label: ENavList.ABOUT_US_LABEL },
];
