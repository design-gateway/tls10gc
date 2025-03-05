const fs = require('fs');
const os = require('os');
const formidable = require('formidable');
const path = require('path');

const BUFF_SIZE = 1073741824;
const MAX_SIZE  = 1000000000;

const process = require('process');

var DataPatt = Buffer.alloc(BUFF_SIZE);

const getDurationInNanoseconds = (start) => {
    const 	NS_PER_SEC 	= 1e9
    const 	diff 		= process.hrtime(start)
    return (diff[0] * NS_PER_SEC + diff[1])
}

// File Upload Directory
const UPLOAD_DIR = 'uploads/';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR); // Create uploads directory if not exists
}

//---------------------------------------------------------------------------
// Server Setup			   
var securePort 	= 60001;
var net_int = os.networkInterfaces();
var address;
var family;

console.log("--------------------------------------------------");
console.log("Server's IP Address :");
    
for (var key in net_int) {
	console.log("\n" + key);
	var net_infos=net_int[key];
  
	net_infos.forEach(element => {
	for (var attr in element)
	{
		if ( attr=='address' )
			address = element[attr];
		if ( attr=='family' )
			family = element[attr];
	}
	if ( family=='IPv4')
		console.log("\t" + address);
  });  
}

console.log("");
console.log("Port number : "+securePort);

console.log("--------------------------------------------------");

//=====================================================================

const requestListener = function (req, res) {
	
	var arg	= req.url.split('/')
	var len = parseInt(arg[3]);	
	var data = DataPatt;
	var current = 0;
	
	res.setHeader('Connection', 'close')
	
	function WrBuff() {		
		if (current < blockCnt)
		{
			data = DataPatt;
			canContinue = res.write(data);
		}else if ( current == blockCnt ){
			data = DataPatt.slice(0,lastBlockCnt);
			canContinue = res.end(data);
		}else
		{
			return
		}	
		
		current += 1;
		// wait until stream drains to continue
		if (!canContinue)
			res.once('drain', WrBuff);
		else
			WrBuff();
	}
	
	if ( (arg[1]=='submit') ){
		var j = 0;
		var datalen = 0;
		var begin = process.hrtime()
		let diff = getDurationInNanoseconds (begin)

		// Handle File Upload and Save
		console.log("Receiving file upload...");
		begin = process.hrtime()
		const form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, 'uploads'); // Directory to save files
        form.keepExtensions = true; // Retain file extensions

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error:', err.message);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('File upload failed.');
            }
			let diff = getDurationInNanoseconds (begin)
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`File successfully save to ${files.file[0].newFilename}`);
			console.log(`File successfully uploaded to ${files.file[0].newFilename}`);

			// Calculate transfer speed (in Mbps)
			const fileSizeBytes = files.file[0].size; // File size in bytes
			const transferSpeedMbps = ((fileSizeBytes*8/diff)*1000); // Speed in Mbps

			console.log("\n"+'Received data length = %d byte(s).',fileSizeBytes)
			console.log(`Transferring speed: ${((fileSizeBytes*8/diff)).toPrecision(3)} Gbps.`);					
			console.log("----------");	  

		});


	} else if (arg[1]=='download'){
		var BufOffset = 0;
		if (   ((arg[2]=='b0') || (arg[2]=='b1') || (arg[2]=='t0') || (arg[2]=='t1')) 
			&& (!isNaN(len)) 
			&& (len<=MAX_SIZE)
			&& len>=0 )
		{
			var blockCnt 	= 0;
			var lastBlockCnt= 0;
			var prepareSize	= 0;
			var j = 0;
			
			if (len>BUFF_SIZE)
			{
				blockCnt = parseInt( len/BUFF_SIZE );
				lastBlockCnt = len % BUFF_SIZE;
			}else{
				blockCnt = 0;
				lastBlockCnt = len;
			}
			
			if (blockCnt==0)
				prepareSize = lastBlockCnt;
			else
				prepareSize = BUFF_SIZE;
					
			if (arg[2]=='b1'){
				
				for (var i = 0; i < prepareSize; i++)
				{
					j = i%256;
					BufOffset = DataPatt.writeUInt8(j, BufOffset, 1);
				}
				current=0;
				res.writeHead(200, { 'Content-Type': 'application/octet-stream' });				
				WrBuff();
				console.log("Increasing binary pattern " + len + " byte(s) is downloaded !\n----------");
				
			}else if (arg[2]=='t1'){
				for (var i = 0; i < prepareSize; i++)
				{
					j = (i%64) + 33;
					BufOffset = DataPatt.writeUInt8(j, BufOffset, 1);
				}
				current=0;
				res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
				WrBuff();
				console.log("Increasing text pattern " + len + " byte(s) is downloaded !\n----------");
				
			}else if (arg[2]=='b0'){
				for (var i = 0; i < prepareSize; i++)
				{
					j = 255-(i%256);
					BufOffset = DataPatt.writeUInt8(j, BufOffset, 1);
				}
				current=0;
				res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
				WrBuff();
				console.log("Decreasing binary pattern " + len + " byte(s) is downloaded !\n----------");
			}else { 		//(arg[2]=='t0'){
				for (var i = 0; i < prepareSize; i++)
				{
					j = 96 - (i%64);
					BufOffset = DataPatt.writeUInt8(j, BufOffset, 1);
				}
				current=0;
				res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
				WrBuff();
				console.log("Decreasing text pattern " + len + " byte(s) is downloaded !\n----------");
			}
		}else if ( arg[2]=='log'){
			var pathFile = "./log/" + arg[3]
			console.log( pathFile + " is downloaded !\n----------");
			try {
				if (fs.existsSync(pathFile)) {
					res.writeHead(200, { 'Content-Type': 'text/html' });
					fs.createReadStream(pathFile).pipe(res)
					return
				} else {
					res.writeHead(404);
					res.end('Contents you are looking are Not Found!!');
					return
				}
			} catch(err) {
				console.error(err)
			}
		}else{
			res.writeHead(404);
			res.write('Cannot GET '+ req.url );
			if ( len>MAX_SIZE )
				res.write('\nData length reaches a limit!\nPlease, download data less than 1 GByte.');
			res.end()
		}		
	} else if (arg[1]=='upload'){
		var j = 0;
		var datalen = 0;
		var begin = process.hrtime()
		
		if (arg[2]=='menu')
		{
			fs.readFile("uploadMenu.html", function (error, pgResp) {
				if (error) {
					res.writeHead(404);
					res.end('uploadMenu.html is Not Found.');
				} else {
					res.writeHead(200, { 'Content-Type': 'text/html' });
					res.end(pgResp);
				}
			});
		}
		
		req.on('data', function (data) {
			if ( (arg[2]=='b0') || (arg[2]=='b1') || (arg[2]=='t0') || (arg[2]=='t1') ){
				j = j+1;
				
				if (j==1){
					datalen = 0;
					begin = process.hrtime()
				}
				datalen = datalen + data.length;
		
				if( arg[3]<16384 )
				{
					if ( (arg[2]=='t0') || (arg[2]=='t1') )
						console.log('%s', data);
					else
						console.log('%s', data.toString('hex'));
				}
				let diff = getDurationInNanoseconds (begin)
				if (datalen>=Number(arg[3])){
					if (arg[3]>=16384)
						console.log('Data Length is too large, Show only Transferring speed.');
		
					console.log("\n"+'Received data length = %d byte(s).',datalen)
					console.log(`Transferring speed: ${((datalen*8/diff)*1000).toPrecision(3)} Mbps.`);					
					console.log("----------");	  
				}				
			}

			j = j+1;
				
			if (j==1){
				datalen = 0;
				begin = process.hrtime()
			}
			datalen = datalen + data.length;
			diff = getDurationInNanoseconds (begin)

		});

		req.on('end', () => {
			res.end(`File successfully uploaded`);
			console.log("\n"+'Received data length = %d byte(s).',datalen)
			console.log(`Transferring speed: ${((datalen*8/diff)).toPrecision(3)} Gbps.`);
			console.log("----------");
		});

	}else{
		res.writeHead(404);
		res.end('Cannot GET '+req.url);
		res.end();
	}
}

//=====================================================================

const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('certificate.pem')
}

const https = require('https')
var httpsObj = https.createServer(options, requestListener).listen(securePort)

//=====================================================================

