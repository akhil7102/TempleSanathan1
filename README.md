# Temple Sanathan - Android App

A React Native mobile application for discovering sacred temples across Telangana and Andhra Pradesh.

## Features

- 🏛️ Browse temples by category (Ancient, Hill, River, Modern)
- 🔍 Search temples by name, deity, or location
- 🗺️ Interactive map with temple locations
- 📱 Native Android experience with smooth navigation
- 🌐 Bilingual support (English & Telugu)
- 📍 Location-based temple discovery
- ⭐ Bookmark favorite temples
- 📝 Submit new temple suggestions

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Expo Go app (for testing on device)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your Supabase and Google Maps API keys.

3. Start the development server:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

### Building for Production

1. Build the app:
```bash
expo build:android
```

2. Follow Expo's deployment guide for publishing to Google Play Store.

## Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation
├── index.tsx            # Home screen
├── search.tsx           # Search temples
├── map.tsx              # Map view
├── settings.tsx         # Settings screen
├── auth.tsx             # Authentication
├── temple/[id].tsx      # Temple details
└── ...

data/
└── temples.ts           # Temple data structure

lib/
└── supabase.ts          # Supabase client configuration
```

## Configuration

### Supabase Setup

1. Create a Supabase project
2. Set up the database schema (see migration files)
3. Add your Supabase URL and anon key to `.env`

### Google Maps Setup

1. Get a Google Maps API key
2. Enable Maps SDK for Android
3. Add the API key to `.env`

## Development

- Use `npm start` to start the Expo development server
- Scan the QR code with Expo Go app to test on device
- Use Android Studio emulator for testing
- Hot reload is enabled for faster development

## Deployment

The app can be deployed to:
- Google Play Store (Android)
- Expo Application Services (EAS)
- Direct APK distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Android devices
5. Submit a pull request

## License

This project is licensed under the MIT License.