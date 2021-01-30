//enter the influx db link 
const Influx = require('influx');
const influx = new Influx.InfluxDB('http://user:password@host:8086/database')


const modbus = require('modbus')
const device = modbus(ipAddress,port,unitId)

 

let holdingRegisters;//holds date from the modbus


//get data from the registers

setInterval(function(){//this function reads registers every 2 mins puts them in holdingRegister variable
device.readHoldingRegisters(0, 10).then(function (resp) {
    console.log(resp.response._body.valuesAsArray)
    holdingRegisters = resp.response._body.valuesAsArray; 
    
  }).catch(function () {
      
    console.error(require('util').inspect(arguments, {
      depth: null
  }))
     
  })}, 120000);
 




//send the data to influxdb
influx.writePoints([
    {
      measurement: 'tide',
      
      
      
      tags: {
        unit: locationObj.rawtide.tideInfo[0].units,
        location: locationObj.rawtide.tideInfo[0].tideSite,
      
        },
      
      
      fields: { height: tidePoint.height },
      timestamp: tidePoint.epoch,
    
    }
  ]

  
  ,{
    database: 'ocean_tides',
    precision: 's',

  })
  .catch(error => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  });