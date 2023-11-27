import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Plot from "react-plotly.js";
import { supabase } from "../supabaseClient";

const Forecasting = () => {
  const [temperaturePrediction, setTemperaturePrediction] = useState(null);
  const [humidityPrediction, setHumidityPrediction] = useState(null);
  const [temperatureDataPlot, setTemperatureDataPlot] = useState([]);
  const [humidityDataPlot, setHumidityDataPlot] = useState([]);

  const predictData = async () => {
    try {
      const { data: temperatureData, error: tempError } = await supabase
        .from("measumerent")
        .select("temperature")
        .order("created_at", { ascending: false })
        .limit(100);

      const { data: humidityData, error: humError } = await supabase
        .from("measumerent")
        .select("humidity")
        .order("created_at", { ascending: false })
        .limit(100);

      if (tempError || humError) {
        throw tempError || humError;
      }

      const combinedData = temperatureData.map((temp, index) => ({
        temperature: temp.temperature,
        humidity: humidityData[index].humidity
      }));

      const inputData = combinedData.map(row => [row.temperature, row.humidity]);
      const xs = tf.tensor2d(inputData, [combinedData.length, 2]);
      const ys = tf.tensor2d(inputData, [combinedData.length, 2]);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 8, inputShape: [2], activation: 'relu' }));
      model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 2 }));

      model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

      await model.fit(xs, ys, { epochs: 500, batchSize: 32 });

      const lastTemperatureData = temperatureData[temperatureData.length - 1];
      const lastHumidityData = humidityData[humidityData.length - 1];
      const predictionInput = tf.tensor2d([[lastTemperatureData.temperature, lastHumidityData.humidity]]);
      const predictions = model.predict(predictionInput);

      const [temperaturePred, humidityPred] = predictions.arraySync()[0];

      
      const temperaturePlot = temperatureData.map(temp => temp.temperature);
      const humidityPlot = humidityData.map(hum => hum.humidity);

      return { temperaturePred, humidityPred, temperaturePlot, humidityPlot };
    } catch (error) {
      console.error("Error predicting:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const predictionResults = await predictData();
        setTemperaturePrediction(predictionResults.temperaturePred);
        setHumidityPrediction(predictionResults.humidityPred);
        setTemperatureDataPlot(predictionResults.temperaturePlot);
        setHumidityDataPlot(predictionResults.humidityPlot);
      } catch (error) {
        console.error("Error fetching and predicting data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePrediction = () => {
    predictData()
      .then(predictionResults => {
        setTemperaturePrediction(predictionResults.temperaturePred);
        setHumidityPrediction(predictionResults.humidityPred);
        setTemperatureDataPlot(predictionResults.temperaturePlot);
        setHumidityDataPlot(predictionResults.humidityPlot);
      })
      .catch(error => {
        console.error("Error predicting:", error);
      });
  };

  return (
    <div>
      <div>
        <h2>Pronóstico de Temperatura y Humedad</h2>
        {temperaturePrediction !== null && humidityPrediction !== null && (
          <div>
            <p>Predicción de Temperatura: {temperaturePrediction} °C</p>
            <p>Predicción de Humedad: {humidityPrediction} %</p>
          </div>
        )}
        <button onClick={handlePrediction}>Realizar Predicción</button>
        {temperatureDataPlot.length > 0 && humidityDataPlot.length > 0 && (
          <div>
            <h3>Gráficos</h3>
            <Plot
              data={[
                {
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Temperatura',
                  x: temperatureDataPlot.map((_, index) => index),
                  y: temperatureDataPlot,
                },
              ]}
              layout={{ width: 600, height: 400, title: 'Datos de Temperatura' }}
            />
            <Plot
              data={[
                {
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Humedad',
                  x: humidityDataPlot.map((_, index) => index),
                  y: humidityDataPlot,
                },
              ]}
              layout={{ width: 600, height: 400, title: 'Datos de Humedad' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasting;
