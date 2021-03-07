const app = require('../../src/app');

describe('\'signup\' service', () => {
  it('registered the service', () => {
    const service = app.service('signup');
    expect(service).toBeTruthy();
  });
});
