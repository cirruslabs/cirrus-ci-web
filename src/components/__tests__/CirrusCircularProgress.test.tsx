import React from 'react';
import CirrusCircularProgress from '../common/CirrusCircularProgress';
import renderer from 'react-test-renderer';
import { RecoilRoot } from 'recoil';

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
