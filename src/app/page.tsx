"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


interface coinLogos {
  [key: string]: string;
}

const coinLogos: coinLogos = {
  SOLUSDT: "/SOLUSDT.png",
  BTCUSDT: "/BTCUSDT.png",
  ETHUSDT: "/ETHUSDT.png",
  BNBUSDT: "/BNBUSDT.png",
  ADAUSDT: "/ADAUSDT.png",
  XRPUSDT: "/XRPUSDT.png"
};

const symbols = ["SOLUSDT", "BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT"];

interface CryptoData {
  open?: string;
  high?: string;
  low?: string;
  close?: string;
  volume?: string;
  timestamp?: number;
  isClosed?: boolean;
}

export default function Home() {
  const [cryptoData, setCryptoData] = useState<{ [key: string]: CryptoData }>({});

  console.log("CryptoData:::", cryptoData)
  const [sockets, setSockets] = useState<{ [key: string]: WebSocket }>({});

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newClose = parseFloat(data.close);

        setCryptoData((prevData) => {
          const prevClose = prevData[data.symbol]?.close ?? newClose;

          return {
            ...prevData,
            [data.symbol]: {
              open: parseFloat(data.open),
              high: parseFloat(data.high),
              low: parseFloat(data.low),
              close: newClose,
              volume: parseFloat(data.volume),
              timestamp: data.timestamp,
              prevClose,
            },
          };
        });
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed, reconnecting in 10 seconds...");
      setTimeout(() => {
        setCryptoData({}); // Reset data to avoid stale values
        window.location.reload(); // Force reconnect
      }, 10000);
    };

    return () => socket.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Live Crypto OHLC Data 📊</h1>

      {/* Crypto Table */}
      <div className="w-full max-w-5xl bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
            <tr>
              <th className="p-4">Icon</th>
              <th className="p-4">Coin</th>
              <th className="p-4">Open</th>
              <th className="p-4">High</th>
              <th className="p-4">Low</th>
              <th className="p-4">Close</th>
              <th className="p-4">Volume</th>
              <th className="p-4">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((symbol) => {
              const data = cryptoData[symbol];

              return (
                <tr key={symbol} className="border-b border-gray-700 text-center">
                  <td className="p-4">
                    {/* Placeholder for icon */}
                    <div className="w-10 h-10 bg-gray-600 rounded-full mx-auto">
                      <Image src={coinLogos[symbol]} alt={symbol} width={40} height={40} />
                    </div>
                  </td>
                  <td className="p-4 font-bold">{symbol}</td>
                  <td className="p-4">{data?.open || "Loading..."}</td>
                  <td className="p-4">{data?.high || "Loading..."}</td>
                  <td className="p-4">{data?.low || "Loading..."}</td>
                  <td className="p-4">{data?.close || "Loading..."}</td>
                  <td className="p-4">{data?.volume || "N/A"}</td>
                  <td className="p-4 text-sm">
                    {data?.timestamp
                      ? new Date(data.timestamp).toLocaleTimeString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}