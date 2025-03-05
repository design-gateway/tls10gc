# Node.js Server

This demonstration includes a sample **Node.js** server that listens on **port 60001** for **HTTPS connections**.  

## Repository Structure  :

```
├── log
│ ├── Example HTML page
│ ├── submit.html # Allows a client to upload data to the server, which is then saved in the "uploads" folder.
│ └── testSpeed.html # Enables a client to upload data for performance testing.
├── node_modules # Node.js dependencies
├── uploads # Folder for storing files uploaded from the client
├── certificate.pem # Sample server certificate
└── key.pem # Sample RSA key
```
User can excuted Node.js server by running:
```bash
node serverDemo.js
```