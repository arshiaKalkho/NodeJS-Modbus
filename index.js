//enter the influx db link 
const Influx = require('influx');
const client = new Influx.InfluxDB({
// this function connects to the DB and cretes a custom schema
  
  database: 'seneca',
  host: '104.232.201.4',
  port: 3000,
  username: 'volpowadmin',
  password: '<9AkR&2}​​​​​​​​BDUC;Rqu',
  schema: [
    {
      measurement: 'perf',
      fields: {//custom schema
        
        C_SunSpec_DID   : Influx.FieldType.FLOAT, 
        C_SunSpec_Length: Influx.FieldType.FLOAT,
        I_AC_Current    : Influx.FieldType.FLOAT,
        I_AC_CurrentA   : Influx.FieldType.FLOAT,
        I_AC_CurrentB   : Influx.FieldType.FLOAT,
        I_AC_CurrentC   : Influx.FieldType.FLOAT,
        I_AC_Current_SF : Influx.FieldType.FLOAT,
        I_AC_VoltageAB  : Influx.FieldType.FLOAT,
        I_AC_VoltageBC  : Influx.FieldType.FLOAT,
        I_AC_VoltageCA  : Influx.FieldType.FLOAT,
        I_AC_VoltageAN  : Influx.FieldType.FLOAT,
        I_AC_VoltageBN  : Influx.FieldType.FLOAT,
        I_AC_VoltageCN  : Influx.FieldType.FLOAT,
        I_AC_Voltage_SF : Influx.FieldType.FLOAT,
        I_AC_Power      : Influx.FieldType.FLOAT,
        I_AC_Power_SF   : Influx.FieldType.FLOAT,
        I_AC_Frequency  : Influx.FieldType.FLOAT,
        I_AC_Frequency_SF: Influx.FieldType.FLOAT,
        I_AC_VA         : Influx.FieldType.FLOAT,
        I_AC_VA_SF      : Influx.FieldType.FLOAT,
        I_AC_VAR        : Influx.FieldType.FLOAT,
        I_AC_VAR_SF     : Influx.FieldType.FLOAT,
        I_AC_PF         : Influx.FieldType.FLOAT,
        I_AC_PF_SF      : Influx.FieldType.FLOAT,
        I_AC_Energy_WH  : Influx.FieldType.FLOAT,
        I_AC_Energy_WH_SF: Influx.FieldType.FLOAT,
        I_DC_Current    : Influx.FieldType.FLOAT,
        I_DC_Current_SF : Influx.FieldType.FLOAT,
        I_DC_Voltage    : Influx.FieldType.FLOAT,
        I_DC_Voltage_SF : Influx.FieldType.FLOAT,
        I_DC_Power      : Influx.FieldType.FLOAT,
        I_DC_Power_SF   : Influx.FieldType.FLOAT,
        I_Temp_Sink     : Influx.FieldType.FLOAT,
        I_Temp_SF       : Influx.FieldType.FLOAT,
        I_Status        : Influx.FieldType.FLOAT,
        I_Status_Vendor : Influx.FieldType.FLOAT,

        
      },//, added
      tags: [
        'hostname'
      ]
    }
  ]
})


const modbus = require('modbus')
const device = modbus(ipAddress,port,unitId)

 

let holdingRegisters = {};//holds date from the modbus

 

//get data from the registers

setInterval(function(){//this function reads registers every 2 mins puts them in holdingRegister variable
device.readHoldingRegisters(40069 , 40108).then(function (resp) {
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