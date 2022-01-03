import { Typography, TypographyProps } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface MarkdownTypographyProps extends TypographyProps {
  text: string;
}

const MarkdownTypography = (props: MarkdownTypographyProps) => {
  const { text, ...otherProps } = props;

  return (
    <ReactMarkdown
      source={text}
      renderers={{
        paragraph: ({ children }) => <Typography {...otherProps}>{children}</Typography>,
      }}
    />
  );
};

export default MarkdownTypography;
