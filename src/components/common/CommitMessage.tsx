import { Link, Typography } from '@mui/material';

interface Props {
  cloneUrl: string;
  branch: string;
  changeIdInRepo: string;
  changeMessageTitle: string;
}

function CommitMessage(props: Props) {
  const { cloneUrl, branch, changeIdInRepo, changeMessageTitle } = props;

  const repoUrl = cloneUrl.slice(0, -4);
  const branchUrl = branch.startsWith('pull/') ? `${repoUrl}/${branch}` : `${repoUrl}/tree/${branch}`;
  const commitUrl = repoUrl + '/commit/' + changeIdInRepo;

  const bits = changeMessageTitle.split('`');
  let renderedTitle: JSX.Element[] = [<>{bits[0]}</>];

  if (bits.length > 1) {
    let state = 0;

    for (let bit of bits.slice(1, bits.length)) {
      if (state) {
        renderedTitle.push(<>{bit}</>);
      } else {
        renderedTitle.push(<code>{bit}</code>);
      }

      state ^= 1;
    }
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {renderedTitle}
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

export default CommitMessage;
