import { buildStatusColor, taskStatusColor, faviconColor } from '../colors';
import { createLinkToRepository } from '../github';
import { cirrusColors } from '../../cirrusTheme';
import { hasWritePermissions } from '../permissions';

describe('utils/colors tests', () => {
  it('gets the correct build status color', () => {
    expect(buildStatusColor('ABORTED')).toBe(cirrusColors.lightFailure);
  });

  it('gets the correct task status color', () => {
    expect(taskStatusColor('FAILED')).toBe(cirrusColors.failure);
  });

  it('gets the correct favicon color', () => {
    expect(faviconColor('EXECUTING')).toBe(cirrusColors.executing);
  });
});

describe('utils/github tests', () => {
  it('can create a link to nodejs', () => {
    expect(createLinkToRepository({ owner: 'nodejs', name: 'node' })).toBe('https://github.com/nodejs/node');
  });
});

describe('utils/permissions tests', () => {
  it('can correctly assume if a user has write access', () => {
    expect(hasWritePermissions('ADMIN')).toBe(true);
  });
});
