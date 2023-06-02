import { useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import GitHub from '@mui/icons-material/GitHub';
import Settings from '@mui/icons-material/Settings';

const mui = {
  makeStyles,
  useTheme,

  Avatar,
  Box,
  Card,
  CardActionArea,
  Divider,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,

  icons: {
    GitHub,
    Settings,
  },
};

export default mui;
