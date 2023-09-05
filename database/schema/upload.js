module.exports = {
  type: "object",
  properties: {
    timestamp: {
      type:"string", 
    },
    temperature: {
      type: "number",
    },
    rainfall: {
      type: "number",
    },
    humidity: {
      type: "number",
    },
    wind_speed: {
      type: "string",
    },
    visibility: {
      type: "string",
    },
  },
  required: [
    "timestamp",
    "temperature",
    "rainfall",
    "humidity",
    "wind_speed",
    "visibility",
  ],
  additionalProperties: false,
};