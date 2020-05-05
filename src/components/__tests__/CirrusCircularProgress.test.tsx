import React from 'react';
import CirrusCircularProgress from '../common/CirrusCircularProgress';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<CirrusCircularProgress />).toJSON();
  expect(tree).toMatchSnapshot();
});
