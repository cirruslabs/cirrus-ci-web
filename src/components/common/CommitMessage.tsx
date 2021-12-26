import { Link, Typography } from '@mui/material';
import { BuildDetails_build } from '../builds/__generated__/BuildDetails_build.graphql';
import { TaskDetails_task } from '../tasks/__generated__/TaskDetails_task.graphql';

interface Props {
  task?: TaskDetails_task;
  build?: BuildDetails_build;
}

function CommitMessage(props: Props) {
  const { task, build } = props;

  let repository;
  let branch;
  let changeIdInRepo;
  let changeMessageTitle;

  if (task) {
    repository = task.repository;
    branch = task.build.branch;
    changeIdInRepo = task.build.changeIdInRepo;
    changeMessageTitle = task.build.changeMessageTitle;
  } else if (build) {
    repository = build.repository;
    branch = build.branch;
    changeIdInRepo = build.changeIdInRepo;
    changeMessageTitle = build.changeMessageTitle;
  }

  const repoUrl = repository.cloneUrl.slice(0, -4);
  const branchUrl = branch.startsWith('pull/') ? `${repoUrl}/${branch}` : `${repoUrl}/tree/${branch}`;
  const commitUrl = repoUrl + '/commit/' + changeIdInRepo;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {changeMessageTitle}
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
