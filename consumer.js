var amqp = require('amqplib/callback_api');

const timer = ms => new Promise(res => setTimeout(res, ms));

var ind = 0;

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(async function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'geoQueue';

        channel.assertQueue(queue, {
            // durable: true,
            // autoDelete: true
        });

        console.log(" [*] Connected to Channel");
        console.log(" [*] Waiting for geoData in %s. To exit press CTRL+C", queue);

        // for(let j=1;j<5;j+=2){
            // await timer(18000).then(() => {
                ind++;
                channel.consume(queue, async function (data) {
                    await timer(18000).then(() => {
                        geoData = JSON.parse(data.content.toString());
                        console.log(" [x] Received - geoData:", geoData );
                    }). catch(() => {
                        console.log('\npublisher connection ERROR!');
                    });
                    // channel.ack(data);
                }, {
                    noAck: true
                });
            
        // }

        // setInterval(() => {
        //     channel.consume(queue, function (data) {
        //         geoData = JSON.parse(data.content.toString());
        //         console.log(" [x] Received geoData:",geoData );
        //     }, {
        //         noAck: true
        //     });
        // }, 5000);
    });
});



