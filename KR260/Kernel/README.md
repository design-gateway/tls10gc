### Kernel Component for TLS10GC-IP Demo on KR260

This reference design uses the **5.15.0-1027-xilinx-zynqmp** kernel image, based on **Ubuntu Desktop 22.04 LTS**  
(*iot-limerick-kria-classic-desktop-2204-20240304-165.img*).  

For the original image, please refer to:
- [Ubuntu on AMD (Kria K26)](https://ubuntu.com/download/amd#kria-k26)  
- [Xilinx Wiki - Kria SOMs Starter Kits](https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1641152513/Kria+SOMs+Starter+Kits#Ubuntu-LTS)  

To enable communication between hardware and user-space software while minimizing development time for additional device drivers, this reference design utilizes **`/dev/mem`** and **`/dev/udmabuf`** in the kernel space.

- **`/dev/mem`**  
  Provides direct access to the system’s physical memory, commonly used for interacting with hardware registers in custom RTL designs implemented on the FPGA.

- **`/dev/udmabuf`**  
  A Linux device driver that allocates contiguous memory blocks as DMA buffers, making them accessible from user space.

This reference design implements **`/dev/udmabuf` v4.8.2**, based on a forked version available in this repository.
