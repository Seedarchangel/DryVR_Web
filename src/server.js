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
    var file = req.body.jsonContent
    var pyModel = req.body.pythonBlob
	var spawn = require('child_process').spawn;
    const hash = Math.floor(Math.random() * (1000000 - 0 + 1)) + 0;
    //const hash = Math.random().toString()
    //console.log(hash)
    console.log(hash)
    var modified = JSON.parse(file)
    modified["directory"]='examples/model'+hash
    file = JSON.stringify(modified,null, 5)
    initText = "from "+ "model"+hash+" import *"//from ball_ode import *
    fs.writeFile('./DryVR_0.2/input/webinput/data'+hash+'.json', file, 'utf8', function readFileCallback(err, data){
    if (err){
        io.sockets.emit({verifyHash:req.body.verifyHash, output:err})
        console.log(err);
    } else {
        fs.mkdirSync("./DryVR_0.2/examples/model"+hash)
        fs.writeFile('./DryVR_0.2/examples/model'+hash+"/"+"__init__.py", initText, 'utf8') //TODO Convert to Promises later
        fs.writeFile('./DryVR_0.2/examples/model'+hash+"/model"+hash+".py", pyModel, 'utf8', function readFileCallback(err, data){
            if (err){
            io.sockets.emit({verifyHash:req.body.verifyHash, output:err})
            console.log(err);
    } 
             else {
                 var prc = spawn('python',  ['./DryVR_0.2/main.py', './DryVR_0.2/input/webinput/data'+hash+'.json']);
                 //console.log("simulation started")
                 prc.stdout.on('data', (data) => {
                 console.log("Simulation Success")
                 var str = data.toString('utf8'), lines = str.split(/(\r?\n)/g)
                 var lineByLine = ""
                 for (var i=0; i<lines.length; i++) {
                    lineByLine = lineByLine+lines[i]+"\n"
                 }
                 console.log(lineByLine)
                 io.sockets.emit("foo", {verifyHash:req.body.verifyHash, output: lineByLine+"\n"});
                 
                 prc.stderr.on('data', (data) => {
                 console.log("errors")
                 io.sockets.emit("foo", {verifyHash:req.body.verifyHash, output: data.toString('utf8')+"\n"})
                 console.log(`stderr: ${data}`);
                    //console.log(typeof(data)) 
                });
                 prc.on('close', (code) => {
                 console.log(`child process exited with code ${code}`);
                 })

/*
        prc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
       })
*/


    })
             }
        })
        //console.log("Success!")
        //var prc = spawn('python',  ['./DryVR_0.2/main.py', './DryVR_0.2/input/webinput/data'+hash+'.json']);
    
       /* prc.stdout.on('data', (data) => {
        var str = data.toString('utf8'), lines = str.split(/(\r?\n)/g)
        var lineByLine = ""
        for (var i=0; i<lines.length; i++) {
            lineByLine = lineByLine+lines[i]+"\n"
        }
        console.log(lineByLine)
        io.sockets.emit("foo", {verifyHash:req.body.verifyHash, output: lineByLine+"\n"});


    });*/
/*
        prc.stderr.on('data', (data) => {
        io.sockets.emit("foo", {verifyHash:req.body.verifyHash, output: data.toString('utf8')+"\n"})
        console.log(`stderr: ${data}`);
        //console.log(typeof(data)) 
       });
*/
/*
        prc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
       })
*/
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