import {
  FaGlobe, FaMobileAlt, FaPhone, FaPaintBrush, FaShareAlt, FaImage,
  FaBrush, FaSearch, FaWrench, FaRocket, FaBriefcase, FaHeartbeat,
  FaGraduationCap, FaHome, FaUtensils, FaShoppingCart, FaComment,
  FaGem, FaBullseye, FaEye, FaChartLine, FaShieldAlt, FaServer,
  FaNodeJs, FaAws, FaStripe, FaCloud, FaDumbbell
} from "react-icons/fa";
import {
  SiNextdotjs, SiExpress, SiMongodb, SiPostgresql, SiTailwindcss,
  SiFramer, SiReact, SiCloudflare, SiVite, SiReactrouter, SiRedux,
  SiJsonwebtokens, SiMysql, SiSupabase, SiFigma, SiVercel, SiCloudinary,
  SiRazorpay, SiWhatsapp
} from "react-icons/si";
import { HiSparkles, HiBuildingOffice } from "react-icons/hi2";
import { MdFactory, MdSpa } from "react-icons/md";
import {
  FaCode, FaMobileScreenButton, FaMicrochip, FaCube, FaPenNib,
  FaBolt, FaHeadset, FaUsers, FaLayerGroup, FaBullhorn
} from "react-icons/fa6";

const icons = {
  globe: FaGlobe,
  phone: FaMobileAlt,
  call: FaPhone,
  palette: FaPaintBrush,
  share: FaShareAlt,
  image: FaImage,
  brush: FaBrush,
  search: FaSearch,
  wrench: FaWrench,
  rocket: FaRocket,
  briefcase: FaBriefcase,
  tower: HiBuildingOffice,
  heart: FaHeartbeat,
  graduation: FaGraduationCap,
  home: FaHome,
  utensils: FaUtensils,
  sparkle: HiSparkles,
  dumbbell: FaDumbbell,
  factory: MdFactory,
  cart: FaShoppingCart,
  globeamericas: FaGlobe,
  diamond: FaGem,
  target: FaBullseye,
  eye: FaEye,
  chart: FaChartLine,
  shield: FaShieldAlt,
  spa: MdSpa,
  react: SiReact,
  next: SiNextdotjs,
  node: FaNodeJs,
  express: SiExpress,
  mongo: SiMongodb,
  postgres: SiPostgresql,
  tailwind: SiTailwindcss,
  motion: SiFramer,
  gsap: SiCloudflare,
  aws: FaAws,
  stripe: FaStripe,
  cloud: FaCloud,
  server: FaServer,
  code: FaCode,
  mobile: FaMobileScreenButton,
  ai: FaMicrochip,
  cube: FaCube,
  pen: FaPenNib,
  bolt: FaBolt,
  headset: FaHeadset,
  team: FaUsers,
  services: FaLayerGroup,
  marketing: FaBullhorn,
  chat: FaComment,
  vite: SiVite,
  reactrouter: SiReactrouter,
  redux: SiRedux,
  jwt: SiJsonwebtokens,
  mysql: SiMysql,
  supabase: SiSupabase,
  figma: SiFigma,
  vercel: SiVercel,
  cloudinary: SiCloudinary,
  razorpay: SiRazorpay,
  whatsapp: SiWhatsapp
};

export function Icon({ name, className = "", ...props }) {
  const Cmp = icons[name] || FaGlobe;
  return <Cmp className={className} {...props} />;
}