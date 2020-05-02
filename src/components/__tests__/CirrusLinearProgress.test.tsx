import React from 'react';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<CirrusLinearProgress />).toJSON();
  expect(tree).toMatchSnapshot();
});
