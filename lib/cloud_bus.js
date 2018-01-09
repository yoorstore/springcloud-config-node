/**
 * Created by clude on 1/8/18.
 */
//http://127.0.0.1:8081/manager/bus/refresh?destination=nodeservice:**

const amqp = require('amqplib');
const shortid = require('js-shortid');
const configLoader = require('./config_load');

const bindBus = async function(options, callback) {
  const defaultBusOpts = {
    url: {
      hostname: '192.168.0.232',
      port: 5672,
      username: 'ms_config',
      password: 'password2018go',
      vhost: '/vconfig-dev'
    },
    service: 'nodeservice',
    exchange: 'springCloudBus',
    routeKey: '#'
  };

  const uuid = shortid.uuid();
  const busOpts = Object.assign({}, defaultBusOpts, options.bus);

  const serviceName = busOpts.service;
  const exchange = busOpts.exchange;
  const queueName = `${busOpts.exchange}.${serviceName}.${uuid}`;
  const routeKey = busOpts.routeKey;

  const conn = await amqp.connect(busOpts.url);
  process.once('SIGN',function(){
    conn.close();
  });

  const ch = await conn.createChannel();
  await ch.assertQueue(queueName, {durable:false, autoDelete: true});
  await ch.bindQueue(queueName, exchange, routeKey);
  ch.consume(queueName,function(msg){
    // console.log("[x] Received '%s'",msg.content.toString());
    const msgJson = JSON.parse(msg.content.toString());
    if(msgJson.destinationService.indexOf(serviceName) >= 0) {
      configLoader.load(options, callback);
    }

  },{noAck:true});

}

module.exports = {
  watch: bindBus
}
