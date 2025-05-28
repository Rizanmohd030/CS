const SerialPort = require('serialport');
const { attendanceController } = require('../controllers');
const logger = require('../utils/logger');

let rfidService = null;

const initializeRFIDService = () => {
  try {
    const portPath = process.env.RFID_PORT || '/dev/ttyUSB0';
    const port = new SerialPort(portPath, { baudRate: 9600 });
    
    port.on('open', () => {
      logger.info(`RFID reader connected on ${portPath}`);
      rfidService = port;
    });
    
    port.on('error', (err) => {
      logger.error('RFID port error', { error: err.message });
    });
    
    // Add your RFID parsing logic here
    
  } catch (err) {
    logger.error('RFID service initialization failed', { error: err.message });
  }
};

module.exports = { initializeRFIDService };