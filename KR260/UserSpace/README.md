### User Space Components for TLS10GC-IP Demo on KR260  

The user space includes the **OpenSSL** library and the **Lynx** web browser.  

- **OpenSSL**  
  The OpenSSL library has been modified to work with **TLS10GC-IP**, offloading encryption and decryption tasks. It is based on OpenSSL **version 3.3.1**.  
  - Original OpenSSL source: [OpenSSL 3.3.1](https://github.com/openssl/openssl/tree/openssl-3.3.1)  

- **Lynx**  
  The Lynx web browser has been modified to interface with **TOE10GLL-IP** for TCP connections. It is based on Lynx **snapshots version v2-9-2**.  
  - Original Lynx source: [Lynx v2-9-2](https://github.com/ThomasDickey/lynx-snapshots/tree/v2-9-2)  

Note: Before running the script, ensure it has executable permissions. 