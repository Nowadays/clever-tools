'use strict';

const expect = require('chai').expect;
const { findApp } = require('../src/models/app_configuration');

describe('app_configuration.findApp()', () => {

  it('should error when no apps are listed', () => {
    const config = {
      apps: [],
    };
    expect(() => findApp(config))
      .to.throw('There are no applications linked');
  });

  it('should find the only one app that is listed', () => {
    const config = {
      apps: [{ app_id: 'app_uuid-one', alias: 'one' }],
    };
    expect(findApp(config)).to.have.property('app_id', 'app_uuid-one');
  });

  it('should error when multiple apps are listed (and no alias provided)', () => {
    const config = {
      apps: [
        { app_id: 'app_uuid-one', alias: 'one' },
        { app_id: 'app_uuid-two', alias: 'two' },
      ],
    };
    expect(() => findApp(config))
      .to.throw('Several applications are linked');
  });

  it('should find app with alias', () => {
    const config = {
      apps: [
        { app_id: 'app_uuid-one', alias: 'one' },
        { app_id: 'app_uuid-two', alias: 'two' },
      ],
    };
    expect(findApp(config, 'two')).to.have.property('app_id', 'app_uuid-two');
  });

  it('should find app with alias (and ignore default)', () => {
    const config = {
      default: 'three',
      apps: [
        { app_id: 'app_uuid-one', alias: 'one' },
        { app_id: 'app_uuid-two', alias: 'two' },
        { app_id: 'app_uuid-three', alias: 'three' },
      ],
    };
    expect(findApp(config, 'two')).to.have.property('app_id', 'app_uuid-two');
  });

  it('should error when alias cannot be found', () => {
    const config = {
      apps: [
        { app_id: 'app_uuid-one', alias: 'one' },
        { app_id: 'app_uuid-two', alias: 'two' },
      ],
    };
    expect(() => findApp(config, 'unknown'))
      .to.throw('There are no applications matching');
  });

  it('should error when alias cannot be found (because not apps)', () => {
    const config = {
      apps: [],
    };
    expect(() => findApp(config, 'unknown'))
      .to.throw('There are no applications linked');
  });

  it('should error when two apps have the same alias', () => {
    const config = {
      apps: [
        { app_id: 'app_uuid-one', alias: 'foobar' },
        { app_id: 'app_uuid-two', alias: 'foobar' },
      ],
    };
    expect(() => findApp(config, 'foobar'))
      .to.throw('There are several applications matching alias ');
  });

  it('should find app with default', () => {
    const config = {
      'default': 'app_uuid-two',
      apps: [
        { app_id: 'app_uuid-one', alias: 'one' },
        { app_id: 'app_uuid-two', alias: 'two' },
      ],
    };
    expect(findApp(config, 'two')).to.have.property('app_id', 'app_uuid-two');
  });

  it('should error when default cannot be found', () => {
    const config = {
      default: 'unknown',
      apps: [
        { app_id: 'app_uuid-one', alias: 'one' },
        { app_id: 'app_uuid-two', alias: 'two' },
      ],
    };
    expect(() => findApp(config))
      .to.throw('The default application is not listed anymore');
  });
});

