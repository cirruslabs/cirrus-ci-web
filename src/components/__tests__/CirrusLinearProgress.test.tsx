import React from 'react';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import renderer from 'react-test-renderer';
import { RecoilRoot } from 'recoil';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <RecoilRoot>
        <CirrusLinearProgress />
      </RecoilRoot>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
