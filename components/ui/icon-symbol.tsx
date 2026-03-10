// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols → Material Icons mapping for Tournament Hub
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "trophy.fill": "emoji-events",
  "person.fill": "person",
  "person.2.fill": "group",
  "magnifyingglass": "search",
  "bell.fill": "notifications",
  "gearshape.fill": "settings",
  "chart.bar.fill": "bar-chart",
  "list.bullet": "list",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "checkmark.seal.fill": "verified",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  // Sports
  "football.fill": "sports-football",
  "sportscourt.fill": "sports",
  "flag.fill": "flag",
  "flag.checkered": "flag",
  "star.fill": "star",
  "star": "star-border",
  "flame.fill": "local-fire-department",
  "bolt.fill": "bolt",
  // Actions
  "square.and.arrow.up": "share",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "bubble.left.fill": "chat-bubble",
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
  "video.fill": "videocam",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "pencil": "edit",
  "trash.fill": "delete",
  "doc.fill": "description",
  "doc.text.fill": "article",
  "qrcode": "qr-code",
  "qrcode.viewfinder": "qr-code-scanner",
  "creditcard.fill": "credit-card",
  "dollarsign.circle.fill": "attach-money",
  "lock.fill": "lock",
  "shield.fill": "shield",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "arrow.clockwise": "refresh",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "ellipsis": "more-horiz",
  "ellipsis.circle": "more-horiz",
  "map.fill": "map",
  "location.fill": "location-on",
  "calendar": "calendar-today",
  "clock.fill": "access-time",
  "person.badge.plus": "person-add",
  "person.crop.circle.fill": "account-circle",
  "envelope.fill": "email",
  "phone.fill": "phone",
  "link": "link",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "slider.horizontal.3": "tune",
  "arrow.up.arrow.down": "swap-vert",
  "crown.fill": "workspace-premium",
  "medal.fill": "military-tech",
  "number": "tag",
  "rectangle.grid.2x2": "grid-view",
  "rectangle.stack.fill": "layers",
  "chart.line.uptrend.xyaxis": "trending-up",
  "building.2.fill": "business",
  "figure.run": "directions-run",
  "figure.american.football": "sports-football",
  "arrow.uturn.left": "undo",
  "checkmark.shield.fill": "verified-user",
  "checkmark.circle": "check-circle-outline",
  "xmark.circle": "cancel",
  "photo.on.rectangle": "perm-media",
  "bubble.left": "chat-bubble-outline",
  "hand.thumbsup.fill": "thumb-up",
  "hand.thumbsdown.fill": "thumb-down",
  "sportscourt": "sports",
  "person.3.fill": "groups",
  "building.columns.fill": "account-balance",
  "chart.pie.fill": "pie-chart",
  "square.and.pencil": "edit-note",
  "doc.badge.plus": "note-add",
  "tray.full.fill": "inbox",
  "bell.badge.fill": "notification-important",
  "checkmark.rectangle.fill": "check-box",
  "rectangle.and.pencil.and.ellipsis": "rate-review",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
