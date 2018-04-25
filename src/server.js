const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
var cors = require('cors');
const fs = require('fs')
const app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


io.on('connection', function(socket){
    console.log("connect socket from DryVR front-end")
})

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get("/", function(req, res, next) {
    return res.send('pong');
});

app.post('/api/verify', function(req, res) {
	// the json input will be send here
	// the info will be stored in req.body
	// parse the req.body and construct the input file for dryvr
    //console.log(req.body.jsonContent)
    var file = req.body.jsonContent

	var spawn = require('child_process').spawn;
    const hash = Math.random().toString()
    fs.writeFile('./DryVR_0.2/input/webinput/data'+hash+'.json', file, 'utf8', function readFileCallback(err, data){
    if (err){
        io.sockets.emit({verifyHash:req.body.verifyHash, output:err})
        console.log(err);
    } else {
        console.log("Success!")
        var prc = spawn('python',  ['./DryVR_0.2/main.py', './DryVR_0.2/input/webinput/data'+hash+'.json']);
        
        prc.stdout.on('data', (data) => {
        io.sockets.emit("foo", {verifyHash:req.body.verifyHash, output: JSON.stringify(data)});
        //console.log(`stdout: ${data}`);  
        console.log(typeof(data)) 
    });

        prc.stderr.on('data', (data) => {
        io.sockets.emit("foo", {verifyHash:req.body.verifyHash, output: JSON.stringify(data)})
        //console.log(`stderr: ${data}`);
        console.log(typeof(data)) 
       });

        prc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
       })

    }
    });

	// start dryvr using following code, but feed with the input file you just constructed

  	// var prc = spawn('python',  ['main.py', 'input/daginput/input_autopassingSafe.json']);
    // prc.stdout.on('data', (data) => {
    //   io.sockets.emit("dryvrret", data);
    //   console.log(`stdout: ${data}`);
    // });

    // prc.stderr.on('data', (data) => {
    //   console.log(`stderr: ${data}`);
    // });

    // prc.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });
    /*ret = {

        verifyHash:req.body.verifyHash,
        output:"output from socketIO"
    }
    io.sockets.emit("foo", ret);*/
	res.send("I got the json file wow")

})


server.listen(process.env.PORT || 8080);