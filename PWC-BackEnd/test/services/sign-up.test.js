const app = require('../../src/app');

describe('\'signUp\' service', () => {
  it('registered the service', () => {
    const service = app.service('sign-up');
    expect(service).toBeTruthy();
  });
});
