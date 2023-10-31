import AccountTree from '@mui/icons-material/AccountTree';
import AddCircle from '@mui/icons-material/AddCircle';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Book from '@mui/icons-material/Book';
import BugReport from '@mui/icons-material/BugReport';
import Cancel from '@mui/icons-material/Cancel';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Commit from '@mui/icons-material/Commit';
import Dehaze from '@mui/icons-material/Dehaze';
import Delete from '@mui/icons-material/Delete';
import DirectionsRun from '@mui/icons-material/DirectionsRun';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import Functions from '@mui/icons-material/Functions';
import GetApp from '@mui/icons-material/GetApp';
import GitHub from '@mui/icons-material/GitHub';
import Question from '@mui/icons-material/HelpOutlineOutlined';
import Info from '@mui/icons-material/Info';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import LayersClear from '@mui/icons-material/LayersClear';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import PlayCircleFilled from '@mui/icons-material/PlayCircleFilled';
import Refresh from '@mui/icons-material/Refresh';
import Settings from '@mui/icons-material/Settings';
import Timeline from '@mui/icons-material/Timeline';
import ViewList from '@mui/icons-material/ViewList';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {FormGroup, useTheme} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import grey from '@mui/material/colors/grey';
import orange from '@mui/material/colors/orange';
import { createTheme } from '@mui/material/styles';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import { withStyles } from '@mui/styles';

const mui = {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  ClickAwayListener,
  Collapse,
  Container,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Grow,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
  Stack,
  Switch,
  Tab,
  TabContext,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TabList,
  TabPanel,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,

  icons: {
    AccountTree,
    AddCircle,
    ArchiveOutlined,
    ArrowBack,
    ArrowDropDown,
    AttachMoney,
    Book,
    BugReport,
    Cancel,
    Check,
    Close,
    Commit,
    Dehaze,
    Delete,
    DirectionsRun,
    ExpandMore,
    Folder,
    FolderOpen,
    Functions,
    GetApp,
    GitHub,
    Info,
    InfoOutlined,
    InsertDriveFile,
    LayersClear,
    ListItem,
    ManageAccounts,
    Menu: MenuIcon,
    OpenInNewOutlined,
    PlayCircleFilled,
    Question,
    Refresh,
    Settings,
    Timeline,
    ViewList,
  },

  colors: {
    grey,
    orange,
  },
};

export default mui;
