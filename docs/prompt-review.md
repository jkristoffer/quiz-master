Below are targeted improvements, not rewrites.

⸻

1. “Lucide-React-Native” is Web-compatible but needs explicit import rules

Lucide RN icons work on Expo Web, but only when imported from:

import { IconName } from "lucide-react-native";

To avoid assistant confusion, add one line:

Suggested addition (under Tech Stack):

Icons must be imported only from lucide-react-native (never lucide-react).

⸻

2. Add rule for Images (RN universal image paths)

Expo Web sometimes breaks if paths are dynamic.

Add:

Use require() for static images. For remote URLs, ensure universal formatting.

⸻

3. Add a rule for file naming conventions in Expo Router

AI sometimes misnames files.

Add:

Use Expo Router conventions:
	•	Screens go in app/
	•	Index screens use index.tsx
	•	Nested routes use folders (app/quiz/[id].tsx)

⸻

4. Add explicit rule for animation library (optional but helpful)

Kids’ games feel dead without animation.

You mention feedback, but not the tool.

Add:

For micro-animations, use Animated API or Reanimated (if needed). Avoid web-only animation libraries.

⸻

5. Clarify AsyncStorage availability

AsyncStorage is not enabled on web unless using fallback polyfills.

To avoid AI getting stuck:

Add:

On Web, AsyncStorage fallback is acceptable (Expo provides WebStorage fallback).

⸻

6. Tighten “Container for Web” rule

Right now it’s conceptual; better to specify how.

Add:

The container should apply:
	•	maxWidth: 480–600
	•	alignSelf: 'center' on web only
via Platform.select()

This ensures consistent results.

⸻

7. Add a “Prohibited” section for clarity

This ensures the AI never drifts.

Recommended:

Prohibited:
	•	Tailwind or NativeWind
	•	Zustand/Redux
	•	Expo WebView for core screens
	•	Raw HTML embedded in JSX

⸻

🧽 Micro-polish suggestions
	•	Add “No external quiz engines or AI problem generators — all logic must be in our codebase.”
	•	Add “Keep all components inside /components folder with index barrel files” to enforce organizational consistency.
	•	Add Must optimize for 60fps interactions since it’s a kids game.

⸻