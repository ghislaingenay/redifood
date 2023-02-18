import { AreaChartOutlined, HomeOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { faAddressCard, faHamburger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const fontSizeIcons = { fontSize: "1rem" };
export const navRoutes = [
  // key === link
  { key: "/", icon: <HomeOutlined style={fontSizeIcons} />, label: "HOME" },
  { key: "/food", icon: <FontAwesomeIcon icon={faHamburger} style={fontSizeIcons} />, label: "FOOD" },
  { key: "/history", icon: <AreaChartOutlined style={fontSizeIcons} />, label: "HISTORY" },
  { key: "/settings", icon: <SettingOutlined style={fontSizeIcons} />, label: "SETTINGS" },
  { key: "/about-us", icon: <FontAwesomeIcon icon={faAddressCard} style={fontSizeIcons} />, label: "ABOUT US" },
  { key: "/signout", icon: <LogoutOutlined style={fontSizeIcons} />, label: "SIGNOUT" },
];
