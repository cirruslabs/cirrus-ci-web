import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import OwnerSettings from '../../components/settings/OwnerSettings';
import { OwnerSettingsRendererQuery } from './__generated__/OwnerSettingsRendererQuery.graphql';
import { useParams } from 'react-router-dom';

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
          }
          viewer {
            ...OwnerSettings_viewer
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        return <OwnerSettings viewer={props.viewer} info={props.ownerInfoByName} />;
      }}
    />
  );
}
