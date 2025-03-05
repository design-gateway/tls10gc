# TLS10GC-IP Reference Design

## Overview  
**TLS10GC-IP** is an IP core designed to establish secure connections with TLS1.3 protocol over a network. More details about this IP can be found in the [Design Gateway's website](https://dgway.com/en/amd/tls-ip.html).  

Design Gateway provides reference designs to demonstrate how **TLS10GC-IP** can accelerate data transfer speeds on real hardware. This repository contains resources for the demonstration.  

## Repository Structure
```
├── server     # Example Node.js server for the demonstration  
└── KR260      # Accelerating TLS connections for Lynx web browser and OpenSSL using TLS10GC-IP on KR260  
    ├── Hardware    # Directory containing the encrypted IP file  
    ├── Kernel      # Device driver for interfacing between hardware and user-space software  
    └── UserSpace   # Modified Lynx and OpenSSL with TLS10GC-IP support
```