import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import RepositorySettingsPage from '../../components/repositories/RepositorySettingsPage';
import NotFound from '../NotFound';
import { RepositorySettingsQuery } from './__generated__/RepositorySettingsQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function RepositorySettings(): JSX.Element {
  let { repositoryId } = useParams();
  return (
    <QueryRenderer<RepositorySettingsQuery>
      environment={environment}
      variables={{ repositoryId }}
      query={graphql`
        query RepositorySettingsQuery($repositoryId: ID!) {
          repository(id: $repositoryId) {
            ...AppBreadcrumbs_repository
            ...RepositorySettingsPage_repository
          }
          viewer {
            ...AppBreadcrumbs_viewer
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.repository) {
          return <NotFound message={error} />;
        }
        return (
          <>
            <AppBreadcrumbs
              repository={props.repository}
              viewer={props.viewer}
              extraCrumbs={[
                {
                  name: 'Repository Settings',
                  Icon: SettingsOutlinedIcon,
                },
              ]}
            />
            <RepositorySettingsPage repository={props.repository} />
          </>
        );
      }}
    />
  );
}
