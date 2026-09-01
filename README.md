# AquaGuard - Predictive Flood Defense Dashboard

AquaGuard is an IoT-driven, machine learning-powered flood defense system. This repository contains the Next.js frontend dashboard, which provides real-time monitoring of water levels, gate statuses, and an emergency predictive countdown.

## Features
* **Real-Time Telemetry:** Live subscriptions to Firebase Realtime Database for instant updates from ESP32 hardware sensors.
* **Dynamic Emergency UI:** Conditionally renders a high-visibility, pulsing countdown timer strictly during `WARNING` or `CRITICAL` states.
* **Gate Status Monitoring:** Tracks the physical state of the automated servo flood gates.

## Tech Stack
* **Framework:** Next.js / React
* **Styling:** Tailwind CSS
* **Database Integration:** Firebase Admin / Firebase Client SDK

## Local Development Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install