/**
 * Created by clude on 1/8/18.
 */
"use strict";

/**
 * @module CloudConfigClient
 */

const configLoader = require("./lib/config_load");
const cloudBus = require("./lib/cloud_bus");

/**
 * @param options
 * {
    application: "node-service",
    profiles:['dev'],
    bus: {
      url: {
        hostname: '192.168.0.100',
        port: 5672,
        username: 'mq_user',
        password: 'mq_pass',
        vhost: '/vconfig'
      },
      service: 'node-service',
      exchange: 'springCloudBus',
      routeKey: '#'
    }
  }

 * @param onLoad
 * @param onRefresh
 */

const noop = (err, data) => {};

class SpringCloudConfig {
  load(options, onLoad, onRefresh) {
    const self = this;
    const _onLoad = onLoad || noop;
    const _onRefresh = onRefresh || noop;
    configLoader.load(options, (err, conf) => {
      if(err) return _onLoad(err);

      const confJson = conf.propertiesJson;
      if(confJson.configbus && confJson.configbus.enable) {
        options.bus = Object.assign({}, options.bus, confJson.configbus);;
        cloudBus.watch(options, _onRefresh)
      }

      _onLoad(null, conf);
    })
  }
}

module.exports = new SpringCloudConfig();