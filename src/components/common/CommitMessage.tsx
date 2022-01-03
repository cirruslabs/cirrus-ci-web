import { Link, Typography } from '@mui/material';
import MarkdownTypography from './MarkdownTypography';

interface CommitMessageProps {
  changeMessageTitle: string;
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
      <MarkdownTypography text={changeMessageTitle} variant="h6" gutterBottom={true} />
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
