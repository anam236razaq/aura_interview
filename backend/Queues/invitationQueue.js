const Queue = require('bull');

const invitationQueue = new Queue('invitationQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
})

module.exports = invitationQueue;