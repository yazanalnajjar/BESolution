const app = require('../../src/app');

describe('\'complaint\' service', () => {
  it('registered the service', () => {
    const service = app.service('complaint');
    expect(service).toBeTruthy();
  });
});
