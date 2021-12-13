import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import Typography from '@mui/material/Typography';
import { ViewerTopRepositoriesQuery } from './__generated__/ViewerTopRepositoriesQuery.graphql';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import LastDefaultBranchBuildMiniRow from '../../components/builds/LastDefaultBranchBuildMiniRow';

interface Props {
  className?: string;
}

export default function ViewerTopRepositories(props: Props) {
  return (
    <QueryRenderer<ViewerTopRepositoriesQuery>
      environment={environment}
      query={graphql`
        query ViewerTopRepositoriesQuery {
          viewer {
            topActiveRepositories {
              id
              ...LastDefaultBranchBuildMiniRow_repository
            }
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.viewer) {
          return (
            <div style={{ margin: '6px' }}>
              <Typography variant="subtitle1">Please sign in to see your active repositories!</Typography>
            </div>
          );
        }
        let repositories = props.viewer.topActiveRepositories;
        return (
          <Table style={{ tableLayout: 'auto' }}>
            <TableBody>
              {repositories.map(repo => (
                <LastDefaultBranchBuildMiniRow key={repo.id} repository={repo} />
              ))}
            </TableBody>
          </Table>
        );
      }}
    />
  );
}
