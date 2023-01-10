import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import OwnerSettings from '../../components/settings/OwnerSettings';
import { OwnerSettingsRendererQuery } from './__generated__/OwnerSettingsRendererQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function OwnerSettingsRenderer(): JSX.Element {
  let { platform, name } = useParams();
  return (
    <QueryRenderer<OwnerSettingsRendererQuery>
      environment={environment}
      variables={{ platform, name }}
      query={graphql`
        query OwnerSettingsRendererQuery($platform: String!, $name: String!) {
          ownerInfoByName(platform: $platform, name: $name) {
            ...OwnerSettings_info
            ...AppBreadcrumbs_info
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
        return (
          <>
            <AppBreadcrumbs
              info={props.ownerInfoByName}
              viewer={props.viewer}
              extraCrumbs={[
                {
                  name: 'Account Settings',
                  Icon: ManageAccountsIcon,
                },
              ]}
            />
            <OwnerSettings info={props.ownerInfoByName} />
          </>
        );
      }}
    />
  );
}
