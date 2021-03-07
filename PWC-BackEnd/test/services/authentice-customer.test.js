const app = require('../../src/app');

describe('\'authentice-customer\' service', () => {
  it('registered the service', () => {
    const service = app.service('authentice-customer');
    expect(service).toBeTruthy();
  });
});
