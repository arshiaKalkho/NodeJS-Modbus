//enter the influx db link /////////////////////////////////
const Influx = require('influx');
const client = new Influx.InfluxDB({
  database: 'my_db',
  host: 'localhost',
  port: 8086,
  username: 'connor',
  password: 'pa$$w0rd',
  schema: [
    {
      measurement: 'perf',
      fields: {
        memory_usage: Influx.FieldType.INTEGER,
        cpu_usage: Influx.FieldType.FLOAT,
        is_online: Influx.FieldType.BOOLEAN
      },//, added
      tags: [
        'hostname'
      ]
    }
  ]
})


const modbus = require('modbus')
const device = modbus(ipAddress,port,unitId)

 

let holdingRegisters;//holds date from the modbus


//get data from the registers

setInterval(function(){//this function reads registers every 2 mins puts them in holdingRegister variable
device.readHoldingRegisters(40069 , 40109).then(function (resp) {
    //registers 40069 - 40109 are being read
    holdingRegisters = resp.response._body.valuesAsArray; 
    
  }).catch(function () {
      
    console.error(require('util').inspect(arguments, {
      depth: null
  }))
     
  })}, 120000);//2min intervals
 




//send the data to influxdb
client.writePoints([
    {
      measurement: 'tide',
      
      
      
      tags: {
        unit: locationObj.rawtide.tideInfo[0].units,
        location: locationObj.rawtide.tideInfo[0].tideSite,
        
        },
      
      
      fields: { height: tidePoint.height },
      timestamp: tidePoint.epoch,
    
    }
 ],{
    database: 'ocean_tides',
    precision: 's',
  })
  .catch(error => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  });