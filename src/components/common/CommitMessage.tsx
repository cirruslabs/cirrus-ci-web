import { Link, Typography } from '@mui/material';

interface CommitTitleProps {
  changeMessageTitle: string;
}

export function CommitTitle(props: CommitTitleProps) {
  const { changeMessageTitle } = props;

  const bits = changeMessageTitle.split('`');
  let renderedTitle: JSX.Element[] = [];

  if (bits.length % 2) {
    let state = 0;

    for (let bit of bits) {
      if (state) {
        renderedTitle.push(<code>{bit}</code>);
      } else {
        renderedTitle.push(<>{bit}</>);
      }

      state ^= 1;
    }
  } else {
    renderedTitle.push(<>{bits[0]}</>);

    for (let bit of bits.slice(1, bits.length)) {
      renderedTitle.push(<>`{bit}</>);
    }
  }

  return <>{renderedTitle}</>;
}

interface CommitMessageProps extends CommitTitleProps {
  cloneUrl: string;
  branch: string;
  changeIdInRepo: string;
}

export default function CommitMessage(props: CommitMessageProps) {
  const { cloneUrl, branch, changeIdInRepo, changeMessageTitle } = props;

  const repoUrl = cloneUrl.slice(0, -4);
  const branchUrl = branch.startsWith('pull/') ? `${repoUrl}/${branch}` : `${repoUrl}/tree/${branch}`;
  const commitUrl = repoUrl + '/commit/' + changeIdInRepo;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        <CommitTitle changeMessageTitle={changeMessageTitle} />
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Commit{' '}
        <Link href={commitUrl} color="inherit" target="_blank" rel="noopener noreferrer">
          {changeIdInRepo.substr(0, 7)}
        </Link>{' '}
        on branch{' '}
        <Link href={branchUrl} color="inherit" target="_blank" rel="noopener noreferrer">
          {branch}
        </Link>
        .
      </Typography>
    </>
  );
}
