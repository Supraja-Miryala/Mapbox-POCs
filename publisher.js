const amqp = require('amqplib/callback_api');

const rabbitUrl = 'amqp://localhost';
var i=0;
var ind=0;

sendRabbitMQ("geoQueue");

const timer = ms => new Promise(res => setTimeout(res, ms));

function sendRabbitMQ(queueName) {
    amqp.connect(rabbitUrl, async function (error0, connection) {
        if (error0) {
            throw error0;
        }
       
        //Connecting after few attempts 
        console.log("=======> Trying for connection setup - 1st trial");
        await timer(5000).then(async () => {
            console.log('\n=======> Trying for connection setup  - 2nd trial');
            await timer(4000).then(() => {}). catch(() => {
                console.log('\npublisher connection ERROR!');
            });                  
        }). catch(() => {
            console.log('\npublisher connection ERROR!');
        });

        connection.createChannel(async function (error1, channel) {
            console.log("\n=======> connection is established....")
            if (error1) {
                throw error1;
            }

            var queue = queueName;

            channel.assertQueue(queue, {
                // durable: true,
                // autoDelete: true
            });

            for(let j=0;j<7;j+=2){
                await timer(1000*j).then(() => {
                    ind++;
                    var end = 50+i;
                    for(i=i; i<=end; i++){
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                            latitude: i,
                            longitude: i
                            })),
                            {
                                // deliveryMode: 2
                            }
                        );
                        console.log(" [x] Sent (round-%d) - %s", ind, { latitude: i, longitude: i});
                    }  
                }). catch(() => {
                    console.log('\npublisher connection ERROR!');
                });
            }

            // connection.close();
            // for(; i<=50; i++){
            //     channel.sendToQueue(queue, Buffer.from(JSON.stringify({
            //         latitude: i,//++lat,
            //         longitude: i//++long
            //         }))
            //     );
            //     console.log(" [x] Sent %s", { latitude: i, longitude: i});
            // }            
        });
        connection.on('close',function () {
           
        });
    });
}
