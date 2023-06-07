import React from 'react';

import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import OwnerSettings from '../../components/settings/OwnerSettings';
import { OwnerSettingsRendererQuery } from './__generated__/OwnerSettingsRendererQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotFound from '../NotFound';

function OwnerSettingsRendererFor(platform: string, name: string) {
  const response = useLazyLoadQuery<OwnerSettingsRendererQuery>(
    graphql`
      query OwnerSettingsRendererQuery($platform: String!, $name: String!) {
        ownerInfoByName(platform: $platform, name: $name) {
          ...OwnerSettings_info
          ...AppBreadcrumbs_info
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { platform, name },
  );

  return (
    <>
      <AppBreadcrumbs
        info={response.ownerInfoByName}
        viewer={response.viewer}
        extraCrumbs={[
          {
            name: 'Account Settings',
            Icon: ManageAccountsIcon,
          },
        ]}
      />
      <OwnerSettings info={response.ownerInfoByName} />
    </>
  );
}
export default function OwnerSettingsRenderer() {
  let { platform, name } = useParams();

  if (!platform || !name) {
    return <NotFound />;
  }

  return OwnerSettingsRendererFor(platform, name);
}
