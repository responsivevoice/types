<p align="center">
  <img src="https://cdn.responsivevoice.org/assets/logo-128.svg" width="128" height="128" alt="ResponsiveVoice logo">
</p>

<h1 align="center">@responsivevoice/types</h1>

<p align="center">
  <a href="https://github.com/responsivevoice/types/actions/workflows/ci.yml"><img src="https://github.com/responsivevoice/types/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
</p>

<p align="center">
  Shared TypeScript type definitions for the ResponsiveVoice text-to-speech ecosystem.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@responsivevoice/types"><img src="https://img.shields.io/npm/v/@responsivevoice/types.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@responsivevoice/types"><img src="https://img.shields.io/npm/dm/@responsivevoice/types.svg" alt="npm downloads"></a>
  <a href="https://github.com/responsivevoice/types"><img src="https://img.shields.io/badge/GitHub-types-181717?logo=github&logoColor=white" alt="GitHub"></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
</p>

<p align="center">
  <a href="https://docs.responsivevoice.org/api/types/">Documentation</a>
</p>

---

## Installation

```bash
npm install @responsivevoice/types
# or
pnpm add @responsivevoice/types
# or
yarn add @responsivevoice/types
```

## Usage

```typescript
import type {
  Voice,
  SystemVoice,
  VoiceCollection,
  SynthesizeRequest,
  SynthesizeResponse,
  ResponsiveVoiceConfig,
  RVEventType,
  RVEventCallback,
  TTSService,
  AudioFormat,
  VoiceGender,
} from '@responsivevoice/types';

// Example: Define a synthesize request
const request: SynthesizeRequest = {
  text: 'Hello, world!',
  lang: 'en-US',
  gender: 'female',
  pitch: 0.5,
  rate: 0.5,
  volume: 1.0,
  format: 'mp3',
};

// Example: Configure the client
const config: ResponsiveVoiceConfig = {
  apiKey: 'your-api-key',
  baseUrl: 'https://texttospeech.responsivevoice.org/v2',
  timeout: 30000,
  retryAttempts: 3,
};
```

## Available Types

### Core Types

- `VoiceGender` - Voice gender ('male' | 'female')
- `VoiceGenderShort` - Short gender identifier ('f' | 'm')
- `TTSService` - TTS service identifier
- `AudioFormat` - Audio output format ('mp3' | 'ogg' | 'wav')

### Voice Types

- `Voice` - High-level ResponsiveVoice voice definition
- `SystemVoice` - Low-level system voice mapping
- `VoiceCollection` - Complete voice collection
- `VoiceQuery` - Voice filtering options

### API Types

- `SynthesizeRequest` - TTS synthesis request payload
- `SynthesizeResponse` - Synthesis response with audio data
- `AudioResponse` - Audio response with playback URL
- `ErrorResponse` - API error response structure

### Event Types

- `RVEventType` - Event type union
- `RVEvent` - Event payload
- `RVEventCallback` - Event callback function

### Configuration Types

- `ResponsiveVoiceConfig` - Client configuration
- `SpeakParams` - Speech parameters

## License

MIT

---

**Other language SDKs:** [Python](https://github.com/responsivevoice/sdk-python) · [Go](https://github.com/responsivevoice/sdk-go) · [PHP](https://github.com/responsivevoice/sdk-php) · [Java](https://github.com/responsivevoice/sdk-java)
