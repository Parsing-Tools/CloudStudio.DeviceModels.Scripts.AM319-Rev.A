function getConfiguration(config) 
{ 
	config.addressLabel = {en: "DevEUI", es: "DevEUI"};
}

function getEndpoints(deviceAddress, endpoints)
{
  endpoints.addEndpoint("1", "Humidity sensor", endpointType.humiditySensor);
  endpoints.addEndpoint("2", "Temperature sensor", endpointType.temperatureSensor);
  endpoints.addEndpoint("3", "CO₂ sensor", endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.carbonDioxide);
  endpoints.addEndpoint("4", "PIR sensor", endpointType.iasSensor);
  endpoints.addEndpoint("5", "Light Level sensor", endpointType.lightSensor);
  endpoints.addEndpoint("6", "TVOC sensor", endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.voc);
  endpoints.addEndpoint("7", "Pressure sensor", endpointType.pressureSensor);
  endpoints.addEndpoint("8", "PM2_5 sensor", endpointType.mvConcentrationSensor, mvConcentrationSensorSubType.pm2_5);
  endpoints.addEndpoint("9", "PM10 sensor", endpointType.mvConcentrationSensor, mvConcentrationSensorSubType.pm10);
  endpoints.addEndpoint("10", "O3 sensor", endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.ozone);

}

function validateDeviceAddress(address, result)
{
  if (address.length != 16) {
    result.ok = false;
    result.errorMessage = {
      en: "The address must be 16 characters long.", 
      es: "La dirección debe tener exactamente 16 caracteres."
    };
  }
}

function updateDeviceUIRules(device, rules)
{
  rules.canCreateEndpoints = true;
}