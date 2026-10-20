// Subpath import (not the package root) so Metro only bundles FontAwesome6's font
// files instead of all 20 icon families @expo/vector-icons ships (~3MB+ of waste).
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { colors } from "../theme/colors";

// Thin wrapper so call sites don't repeat the FA6 "style" boolean-prop pattern
// (<FontAwesome6 name="trash" solid />). Mirrors react-icons/fa + fa6 used on the web admin.
export default function Icon({ name, size = 16, color = colors.ink, variant = "solid" }) {
  return <FontAwesome6 name={name} size={size} color={color} {...{ [variant]: true }} />;
}
