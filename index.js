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

 * @param callback
 */
const loadWithWatch = (options, callback) => {
  configLoader.load(options, (err, conf) => {
    if(err) return callback(err);

    const confJson = conf.propertiesJson;
    if(confJson.configbus && confJson.configbus.enable) {
      options.bus = Object.assign({}, options.bus, confJson.configbus);;
      cloudBus.watch(options, callback)
    }

    callback(null, conf);
  })
}

module.exports = {
  /**
   * Retrieve properties from Spring Cloud config service
   *
   * @param {module:CloudConfigClient~Options} options - spring client configuration options
   * @param {module:CloudConfigClient~loadCallback} [callback] - load callback
   * @returns {Promise<module:Config~Config, Error>|void} promise handler or void if callback was not defined
   *
   * @since 1.0.0
   */
  load: loadWithWatch,
  watch: cloudBus.watch
};