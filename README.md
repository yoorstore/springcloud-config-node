# springcloud-config-node
=====================================

Requires: NodeJS 4+

Feature requests are welcome.

Summary
-------
Thanks to project [cloud-config-client](https://github.com/victorherraiz/cloud-config-client), the core code is based on that project.


Usage
-----

```js
const client = require("springcloud-config-node");
client.load({
    application: "node-service"
}).then((config) => {
    // Look for a key
    const value1 = config.get("this.is.a.key");

    // Using a prefix, this is equivalent to .get("this.is.another.key");
    const value2 = config.get("this.is", "another.key");
    
    // look for whole configuration properties (json format)
    const json = config.propertiesJson;
    
});

```

### `load` function

[Load implementation](./index.js)

#### Parameters

* options - `Object`, mandatory:
    * endpoint `string`, optional, default=`http://localhost:8888`: Config server URL.
    * rejectUnauthorized - `boolean`, optional, default = `true`: if `false` accepts self-signed certificates
    * application - `string`, **deprecated, use name**: Load configuration for this application.
    * name - `string`, mandatory: Load the configuration with this name.
    * profiles `string[]`, optional, default=`["default"]`: Load profiles.
    * label - `string`, optional: Load environment.
    * auth - `Object`, optional: Basic Authentication for access config server (e.g.: `{ user: "username", pass: "password"}`). 
    _endpoint_ accepts also basic auth (e.g. `http://user:pass@localhost:8888`).
        * user - `string`, mandatory
        * pass - `string`, mandatory
    * bus - `Object`, optional: Spring cloud bus configuration e.g: 
      ``` 
      {
        enable: true,
        url: {
          hostname: '127.0.0.1',
          port: 5672,
          username: 'rabbitmq_user',
          password: 'rabbitmq_password',
          vhost: '/'
        },
        service: 'node-service',
        exchange: 'springCloudBus',
        routeKey: '#'
      }
      ```
* callback - `function(error: Error, config: Config)`, optional: node style callback. If missing, the method will return a promise.

```js
// sample options
// bus feature disabled
const options = {
  endpoint: 'http://localhost:8081',
  application: "node-service",
  profiles:['dev']
}

// or bus feature enabled
const options = {
  endpoint: 'http://localhost:8081',
  application: "node-service",
  profiles:['dev']
  bus: {
    enable: true,
    url: {
      hostname: '127.0.0.1',
      port: 5672,
      username: 'rabbitmq_user',
      password: 'rabbitmq_password',
      vhost: '/'
    },
    service: 'node-service',
    exchange: 'springCloudBus',
    routeKey: '#'
  }
}
 
const cbLoad = (err, config) => { ... }
const cbRefresh = (err, config) => { ... }
client.load(options, cbLoad, cbRefresh);

```
### `Spring Cloud Bus` Config
``` yml
# spring cloud prefix should be node_service, eg:
node_service:
  bus: {
    enable: true,
    url: {
      hostname: '127.0.0.1',
      port: 5672,
      username: 'rabbitmq_user',
      password: 'rabbitmq_password',
      vhost: '/'
    },
    service: 'node-service',
    exchange: 'springCloudBus',
    routeKey: '#'
  }

```


### `Config` object

[Config class implementation](./lib/config.js)

#### Properties

* `raw`: Spring raw response data.
* `properties`: computed properties as per Spring specification:
  > Property keys in more specifically named files override those in application.properties or application.yml.
* `propertiesJson`: json formatted configuration base on the computed properties.

#### Methods

* `get(...parts)`: Retrieve a value at a given path or undefined. Multiple parameters can be used to calculate the key.
    * parts - `string`, variable, mandatory:
* `forEach(callback, includeOverridden)`: Iterate over every key/value in the config.
    * callback - `function(key: string, value: string)`, mandatory: iteration callback.
    * includeOverridden - `boolean`, optional, default=`false`: if true, include overridden keys.
* `toString(spaces): string`: Return a string representation of `raw` property.
    * spaces - `number`, optional: spaces to use in format.

```js
config.get("this.is.a.key");
config.get("this.is", "a.key");
config.get("this", "is", "a", "key");

config.forEach((key, value) => console.log(key + ":" + value));
```


References
----------

* [Spring Cloud Config](http://cloud.spring.io/spring-cloud-config/)
* [cloud-config-client](https://github.com/victorherraiz/cloud-config-client)
