const app = require('../../src/app');

describe('\'authenticate-admin\' service', () => {
  it('registered the service', () => {
    const service = app.service('authenticate-admin');
    expect(service).toBeTruthy();
  });
});
