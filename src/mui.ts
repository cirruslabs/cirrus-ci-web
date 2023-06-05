import { useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import Book from '@mui/icons-material/Book';
import Close from '@mui/icons-material/Close';
import Commit from '@mui/icons-material/Commit';
import GitHub from '@mui/icons-material/GitHub';
import Question from '@mui/icons-material/HelpOutlineOutlined';
import Info from '@mui/icons-material/Info';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Menu from '@mui/icons-material/Menu';
import Settings from '@mui/icons-material/Settings';

import { grey } from '@mui/material/colors';

const mui = {
  makeStyles,
  useTheme,
  useMediaQuery,

  AppBar,
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Tooltip,
  Typography,

  icons: {
    Book,
    Close,
    Commit,
    GitHub,
    Info,
    InfoOutlined,
    Menu,
    Question,
    Settings,
  },

  colors: {
    grey,
  },
};

export default mui;
