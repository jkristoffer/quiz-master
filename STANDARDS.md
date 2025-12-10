# BrainSpark Development Standards

## 1. Core Philosophy
- **Universal Code**: Code must run on Web (primary) and Native (secondary) without modification.
- **Web First**: Launching as a PWA/Web App immediately.
- **MVP Lean**: Functionality > Flash. Simple patterns.

## 2. Tech Stack (STRICT)
- **Framework**: React Native (Expo SDK 50+)
- **Routing**: Expo Router (File-based routing)
- **Styling**: `StyleSheet` ONLY. No CSS files, no Tailwind/NativeWind.
- **Icons**: `lucide-react-native`
- **Fonts**: `expo-font` (Google Fonts)
- **State**: React Context API
- **Storage**: `AsyncStorage`

## 3. "Universal Code" Rules

### A. NO HTML Tags
- 🚫 NEVER use `<div>`, `<span>`, `<img>`, `<p>`
- ✅ ALWAYS use `<View>`, `<Text>`, `<Image>`, `<Pressable>`

### B. Responsive Layout Strategy
- **Web**: Content must be constrained to avoid "stretched" mobile UI.
- **Mobile**: Content takes full width.
- **Component**: Use the `ScreenWrapper` component for every page.
  ```typescript
  // Constraint logic
  maxWidth: 1024, // or 600 for tighter focus
  alignSelf: 'center',
  width: '100%'
  ```

### C. Asset Management
- Use `require('./path/to/image.png')` for local images.
- Place assets in `assets/` directory.

### D. Navigation
- Use `expo-router` stack navigation.
- Avoid complex nested navigators for the MVP.

## 4. Code Style & Conventions
- **TypeScript**: Strict mode enabled.
- **Imports**: Clean, grouped imports.
- **File Structure**:
  - `app/` -> Routes
  - `components/` -> Reusable UI
  - `constants/` -> Colors, Strings, Config
  - `hooks/` -> Custom Logic
  - `utils/` -> Helpers
