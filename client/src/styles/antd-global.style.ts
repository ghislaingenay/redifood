import { GREEN_A, GREY, LIGHT_GREY, ORANGE_DARK, PURPLE, RED } from "../constants";
import { hexToRgba } from "../functions/global.fn";

const rcBg = 0.2;
const rcBorder = 0.35;
const rcHover = 0.5;
const rcNormal = 0.7;
const rcActive = 1;

const PrimaryColor = ORANGE_DARK;

export const tokenProvider = {
  // SeedToken
  borderRadius: 6,
  colorBgBase: "#fff",

  colorPrimary: hexToRgba(PrimaryColor, rcNormal),
  colorPrimaryActive: hexToRgba(GREY, rcActive),
  colorPrimaryBg: hexToRgba(GREY, rcBg),
  colorPrimaryBgHover: hexToRgba(GREY, rcBg),
  colorPrimaryBorder: hexToRgba(PrimaryColor, rcBg),
  colorPrimaryBorderHover: hexToRgba(GREY, rcBorder),
  // colorPrimaryText: hexToRgba(PrimaryColor, rcNormal),
  // colorPrimaryTextActive: hexToRgba(PrimaryColor, rcActive),
  // colorPrimaryTextHover: hexToRgba(PrimaryColor, rcHover),

  colorPrimaryHover: hexToRgba(LIGHT_GREY, rcNormal),
  // colorPrimary: "#1890ff",
  colorError: RED,
  colorInfo: GREY,
  colorSuccess: GREEN_A,
  colorWarning: PURPLE,
  colorBorder: LIGHT_GREY,
  colorTextBase: "#000",
  controlHeight: 32, // height of basics controls such as buttons and input boxes
  fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  // fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: 14,
  // MapToken
  borderRadiusLG: 8,
  borderRadiusSM: 4,
  borderRadiusXS: 4,
  colorBgContainer: "#ffffff",
  colorBgElevated: "#ffffff",
  colorBgLayout: "#f5f5f5",
  colorBgMask: "rgba(0, 0, 0, 0.45)", //The background color of the mask,
  //used to cover the content below the mask, Modal, Drawer and other components use this token
  colorBgSpotlight: "rgba(0, 0, 0, 0.85)",
  colorBorderBase: "#d9d9d9", // Default border color, used to separate different elements, such as: form separator, card separator, etc.
  colorBorderSecondary: "#f0f0f0",
};
