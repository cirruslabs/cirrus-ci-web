import React from 'react';
import WelcomePage from '../Home/WelcomePage';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<WelcomePage />).toJSON();
  expect(tree).toMatchSnapshot();
});
