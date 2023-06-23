import React from 'react';
import renderer from 'react-test-renderer';

import { RecoilRoot } from 'recoil';

import CirrusCircularProgress from 'components/common/CirrusCircularProgress';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <RecoilRoot>
        <CirrusCircularProgress />
      </RecoilRoot>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
