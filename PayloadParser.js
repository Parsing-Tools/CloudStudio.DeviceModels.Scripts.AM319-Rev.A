function parseUplink(device, payload)
{
    var payloadb = payload.asBytes();
    var decoded = Decoder(payloadb, payload.port)
    env.log(decoded);  

    // Store humidity
    var e = device.endpoints.byType(endpointType.humiditySensor);
    if (e != null)
        e.updateHumiditySensorStatus(decoded.humidity);

    // Store temperature
    e = device.endpoints.byType(endpointType.temperatureSensor);
    if (e != null)
        e.updateTemperatureSensorStatus(decoded.temperature);

    // Store CO2
    e = device.endpoints.byType(endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.carbonDioxide);
    if (e != null)
        e.updatePpmConcentrationSensorStatus(decoded.co2);
    
    // Store PIR
    e = device.endpoints.byType(endpointType.iasSensor);
    if (e != null)
        e.updateIASSensorStatus(decoded.pir);
    
    // Store Light Level
    e = device.endpoints.byType(endpointType.lightSensor);
    if (e != null)
        e.updateLightSensorStatus(decoded.illumination);

    // Store TVOC
    e = device.endpoints.byType(endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.voc);
    if (e != null)
        e.updatePpmConcentrationSensorStatus(decoded.tvoc);

    // Store Pressure
    e = device.endpoints.byType(endpointType.pressureSensor);
    if (e != null)
        e.updatePressureSensorStatus(decoded.pressure);

    // Store PM2_5
    e = device.endpoints.byAddress("8");
    if (e != null)
        e.updateMvConcentrationSensorStatus(decoded.pm2_5);

    // Store PM10
    e = device.endpoints.byAddress("9");
    if (e != null)
        e.updateMvConcentrationSensorStatus(decoded.pm10);
    
    // Store O3
    e = device.endpoints.byType(endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.ozone);
    if (e != null)
        e.updatePpmConcentrationSensorStatus(decoded.o3);
    
    
    // Store battery
    if (decoded.battery != null) {
            	device.updateDeviceBattery({ percentage: decoded.battery });
    
    }

}

/*
**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2021 Milesight IoT
 * 
 * @product AM307 / AM319
 */
 function Decoder(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // TEMPERATURE
        else if (channel_id === 0x03 && channel_type === 0x67) {
            // ℃
            decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

            // ℉
            // decoded.temperature = readInt16LE(bytes.slice(i, i + 2)) / 10 * 1.8 + 32;
            // i +=2;
        }
        // HUMIDITY
        else if (channel_id === 0x04 && channel_type === 0x68) {
            decoded.humidity = bytes[i] / 2;
            i += 1;
        }
        // PIR
        else if (channel_id === 0x05 && channel_type === 0x00) {
            decoded.pir = bytes[i] === 1 ? 2 : 1;
            i += 1;
        }
        // LIGHT
        else if (channel_id === 0x06 && channel_type === 0xCB) {
            decoded.illumination = bytes[i];
            i += 1;
        }
        // CO2
        else if (channel_id === 0x07 && channel_type === 0x7D) {
            decoded.co2 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // TVOC
        else if (channel_id === 0x08 && channel_type === 0x7D) {
            decoded.tvoc = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PRESSURE
        else if (channel_id === 0x09 && channel_type === 0x73) {
            decoded.pressure = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
        // HCHO
        else if (channel_id === 0x0A && channel_type === 0x7D) {
            decoded.hcho = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // PM2.5
        else if (channel_id === 0x0B && channel_type === 0x7D) {
            decoded.pm2_5 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // PM10
        else if (channel_id === 0x0C && channel_type === 0x7D) {
            decoded.pm10 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // O3
        else if (channel_id === 0x0D && channel_type === 0x7D) {
            decoded.o3 = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }
        // BEEP
        else if (channel_id === 0x0E && channel_type === 0x01) {
            decoded.beep = bytes[i] === 1 ? "yes" : "no";
            i += 1;
        } else {
            break;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

/*exports.Decoder = Decoder;

function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.illumination != null) {
        result.illuminance = { unitId: "lx", record: input.message.illumination};
    }
    if (input.message.co2 != null) {
        result.co2Level = { unitId: "ppm", record: input.message.co2};
    }
    if (input.message.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperature, nature: "air"};
    }
    if (input.message.humidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.humidity, nature: "air"};
    }
    if (input.message.pressure != null) {
        result.pressure = { unitId: "hPa", record: input.message.pressure, nature: "air"};
    }
    return result;
}
exports.extractPoints = extractPoints;*/