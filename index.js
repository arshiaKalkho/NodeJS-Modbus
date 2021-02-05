//enter the influx db link 
const Influx = require('influx');
const client = new Influx.InfluxDB({
// this function connects to the DB and cretes a custom schema
  
  database: '',
  host: '',
  port: 8086,
  username: '',
  password: '',
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
        'seneca'                    //not sure
      ]
    }
  ]
})


const modbus = require('modbus')                                      ///////////////
const device = modbus()                          /////////////// fill
                                                                      

 

let holdingRegisters = {};//holds date from the modbus

 

//get data from the registers

setInterval(function(){//this function reads registers every 2 mins puts them in holdingRegister variable
device.readHoldingRegisters(69 , 108).then(function (resp) {
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
      measurement: 'perf',
      tags: {
        /*unit: locationObj.rawtide.tideInfo[0].units,
        location: locationObj.rawtide.tideInfo[0].tideSite,*/

      },      
      fields: {     // filling the data into the data base schema
        C_SunSpec_DID   : holdingRegisters[0], // assigning value to the each field from the array holdingRegisters ||
        C_SunSpec_Length: holdingRegisters[1],                                    //                                \/
        I_AC_Current    : holdingRegisters[2],                                                              
        I_AC_CurrentA   : holdingRegisters[3],                                                              
        I_AC_CurrentB   : holdingRegisters[4],
        I_AC_CurrentC   : holdingRegisters[5],
        I_AC_Current_SF : holdingRegisters[6],
        I_AC_VoltageAB  : holdingRegisters[7],
        I_AC_VoltageBC  : holdingRegisters[8],
        I_AC_VoltageCA  : holdingRegisters[9],
        I_AC_VoltageAN  : holdingRegisters[10],
        I_AC_VoltageBN  : holdingRegisters[11],
        I_AC_VoltageCN  : holdingRegisters[12],
        I_AC_Voltage_SF : holdingRegisters[13],
        I_AC_Power      : holdingRegisters[14],
        I_AC_Power_SF   : holdingRegisters[15],
        I_AC_Frequency  : holdingRegisters[16],
        I_AC_Frequency_SF: holdingRegisters[17],
        I_AC_VA         : holdingRegisters[18],
        I_AC_VA_SF      : holdingRegisters[19],
        I_AC_VAR        : holdingRegisters[20],
        I_AC_VAR_SF     : holdingRegisters[21],
        I_AC_PF         : holdingRegisters[22],
        I_AC_PF_SF      : holdingRegisters[23],
        I_AC_Energy_WH  : holdingRegisters[24],
        I_AC_Energy_WH_SF: holdingRegisters[25],
        I_DC_Current    : holdingRegisters[26],
        I_DC_Current_SF : holdingRegisters[27],
        I_DC_Voltage    : holdingRegisters[28],
        I_DC_Voltage_SF : holdingRegisters[29],
        I_DC_Power      : holdingRegisters[30],
        I_DC_Power_SF   : holdingRegisters[31],
        I_Temp_Sink     : holdingRegisters[32],
        I_Temp_SF       : holdingRegisters[33],
        I_Status        : holdingRegisters[34],
        I_Status_Vendor : holdingRegisters[35],


      },
      timestamp: new Date.now(),// add a time stamp 
    
    }
 ],{
    database: 'seneca',                     //might wanna change this name
    precision: 's',
  })
  .catch(error => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  });
