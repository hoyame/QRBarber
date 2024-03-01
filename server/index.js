let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let apiRoutes = require("./api-routes")
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

app.get('/', (req, res) => res.send('wev'));
app.use('/api', apiRoutes)

app.listen(port, function () {
    console.log("Running api template on port " + port);
});
