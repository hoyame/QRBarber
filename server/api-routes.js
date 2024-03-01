let router = require('express').Router();
const IP = require('ip');

let listUsers = []; // impossible de l'inclure dans la classe avec les fonctions d'une list(push, find, findIndex, ...)
let queue = {
    time: 0,
    uuids: []
}

class Users {
    constructor() {}

    static create(uuid, agent, plateform) {
        listUsers.push({
            uuid: uuid,
            agent: agent,
            plateform: plateform
        })

        return console.log('HDevelopment:RegisterUser', uuid);
    } 

    static ifExists(uuid) {
        return listUsers.findIndex(element => element.uuid === uuid);
    }

    static addInQueue(uuid) {
        if (queue.uuids[queue.uuids.findIndex(element => element.uuid === uuid)]) return;
        if (this.ifExists(uuid) == -1) return;

        queue.uuids.push({
            uuid: uuid,
            place: queue.uuids.length + 1,
            time: queue.time + 30
        });
        queue.time += 30;

        console.log(queue)
        return console.log('HDevelopment:AddInQueue', uuid);
    }

    static userInQueue(uuid) {
        return queue.uuids[queue.uuids.findIndex(element => element.uuid === uuid)]
    }

    static getUserQueueDataWithUUID(uuid) {
        return queue.uuids.find(element => element.uuid === uuid)
    }

    static getTimeWithUUID(uuid) {
        if (!this.userInQueue(uuid)) return; 

        const user = this.userInQueue(uuid);
        const time = user.time;

        return time;
    }

    static queueTime () {
        return queue.time;
    }
}

router.get('/', function (req, res) {
    res.json({
        status: 'HDevelopment:Good',
        message: 'Welcome',
    });
});

router.post('/register', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    const userAgent = req.headers['user-agent'];
    const userPlatform = req.headers['sec-ch-ua-platform'];
    const userUUID = req.body.uuid;

    if (Users.ifExists(userUUID) !== -1) return;
    Users.create(userUUID, userAgent, userPlatform);
});

router.post('/addInQueue', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    const userUUID = req.body.uuid;

    if (Users.ifExists(userUUID) == -1) return;

    Users.addInQueue(userUUID)
});


router.get('/getTime', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    const uuid = req.query.uuid

    if (Users.userInQueue(uuid)) {
        res.json({
            status: 'HDevelopment:Good',
            message: Users.getTimeWithUUID(uuid),
            data: Users.getUserQueueDataWithUUID(uuid)
        });
    } else {   
        res.json({
            status: 'HDevelopment:Good',
            message: Users.queueTime(),
        });
    }
});

module.exports = router;

// fonction qui retire minute par minute dans la file d'attente, ça aussi je sais que c'est pas l'ideal mais bon sa fait l'affaire, sa sera retravaillée si le projet est utilisée
setInterval(() => {
    if (queue.uuids.length < 0) return;
    
    for (let i = -1; i <= queue.uuids.length; i++) {
        if (queue.uuids[i]) {
            queue.time = queue.time - 1;
            queue.uuids[i].time = queue.uuids[i].time - 1
        }
    }
    
    console.log(queue);
}, 60000)