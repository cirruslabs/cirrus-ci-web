import React from 'react';
import CopyPasteField from '../common/CopyPasteField';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<CopyPasteField name="my copy-paste field" value={'hello world'} />).toJSON();
  expect(tree).toMatchSnapshot();
});
