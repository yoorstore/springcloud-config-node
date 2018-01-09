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

const NODE_SERVICE_CONFIG_KEY = "node_service";
const NODE_SERVICE_CONFIG_BUS_KEY = "bus";

const noop = (err, data) => {};

class SpringCloudConfig {
  load(options, onLoad, onRefresh) {
    const self = this;
    const _onLoad = onLoad || noop;
    const _onRefresh = onRefresh || noop;
    configLoader.load(options, (err, conf) => {
      if(err) return _onLoad(err);

      const confJson = conf.propertiesJson;
      const confBusOpt = confJson && confJson[NODE_SERVICE_CONFIG_KEY] && confJson[NODE_SERVICE_CONFIG_KEY][NODE_SERVICE_CONFIG_BUS_KEY];
      const busOpt =  Object.assign({}, options.bus, confBusOpt);
      if(busOpt && busOpt.enable) {
        options.bus = busOpt;
        cloudBus.watch(options, _onRefresh)
      }

      _onLoad(null, conf);
    })
  }
}

module.exports = new SpringCloudConfig();