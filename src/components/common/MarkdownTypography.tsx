import { Typography, TypographyProps } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface MarkdownTypographyProps extends TypographyProps {
  text: string;
}

const MarkdownTypography = (props: MarkdownTypographyProps) => {
  const { text, ...otherProps } = props;

  return (
    <ReactMarkdown
      children={text}
      components={{
        p: el => <Typography {...otherProps} children={el.children} />,
      }}
    />
  );
};

export default MarkdownTypography;
