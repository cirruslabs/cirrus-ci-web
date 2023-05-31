import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardActionArea from '@mui/material/CardActionArea';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Settings from '@mui/icons-material/Settings';
import GitHub from '@mui/icons-material/GitHub';

const mui = {
  useTheme,
  makeStyles,

  Stack,
  Card,
  Divider,
  CardActionArea,
  Link,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Typography,

  icons: {
    Settings,
    GitHub,
  },
};

export default mui;
