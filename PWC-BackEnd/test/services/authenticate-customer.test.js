const app = require('../../src/app');

describe('\'authenticate-customer\' service', () => {
  it('registered the service', () => {
    const service = app.service('authenticate-customer');
    expect(service).toBeTruthy();
  });
});
