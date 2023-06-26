import ReactMarkdown from 'react-markdown';

import { Link, Typography, TypographyProps } from '@mui/material';

interface MarkdownTypographyProps extends TypographyProps {
  text: string;
}

const MarkdownTypography = (props: MarkdownTypographyProps) => {
  const { text, ...otherProps } = props;

  return (
    <>
      {text.split('\n').map(line => {
        return <MarkdownTypographyLine key={line} text={line} {...otherProps} />;
      })}
    </>
  );
};

const MarkdownTypographyLine = (props: MarkdownTypographyProps) => {
  const { text, ...otherProps } = props;

  return (
    <ReactMarkdown
      children={text}
      components={{
        a: ({ ...props }) => {
          // eslint-disable-next-line
          if (props.href === 'javascript:void(0)') {
            // workaround https://github.com/cirruslabs/cirrus-ci-web/issues/421
            // when <> with any :: inside treated as a link
            return <>{'<' + props.children[0] + '>'}</>;
          }
          return <Link {...props} color="inherit" />;
        },
        p: el => <Typography {...otherProps} children={el.children} />,
      }}
    />
  );
};

export default MarkdownTypography;
