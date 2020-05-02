import React from 'react';
import NotFound from '../NotFound';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<NotFound />).toJSON();
  expect(tree).toMatchSnapshot();
});
