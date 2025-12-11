📱 Product Requirements Document (PRD)
Project Name: BrainSpark (Web-First MVP) Version: 1.1 Target Platform: Web (Primary) -> iOS/Android (Secondary/Future) Tech Stack: React Native (Expo) + TypeScript

1. Executive Summary
   BrainSpark is an interactive logic puzzle game for children aged 8–10. Strategic Pivot: We will launch immediately as a Web App to allow for instant sharing, testing, and feedback. However, the code will be built using a "Universal Architecture" (React Native), ensuring that converting it to a native iOS/Android app in the future requires near-zero code rewriting.

2. Technical Architecture (The "Universal" Stack)
   This section is critical for the AI Agent to understand.

Framework: Expo (React Native).

Routing: Expo Router (File-based routing, works like Next.js for web).

Language: TypeScript (Strict Mode).

Styling: StyleSheet.create or NativeWind (Tailwind for React Native). NO CSS files.

Components: Strict adherence to Native Components (<View>, <Text>, <Pressable>). NO HTML tags (<div>, <img>).

State Management: React Context API.

Data Persistence: AsyncStorage (Uses LocalStorage on Web, Native Storage on Mobile).

3. Target Audience
   Primary User: Children (8–10 years old). They engage with "juicy" feedback and clear progression.

Secondary User: Parents. They value the "no setup" aspect of a web link and the educational value.

4. Core Features (Functional Requirements)
   A. The "Universal" UI Layout

Responsive Wrapper: A master ScreenWrapper component must be used.

On Mobile: Full width/height.

On Desktop/Tablet: Constrained width (max-width: 480px) and centered, floating in the middle of the screen (mimicking a phone interface) to prevent "stretching."

B. The Quiz Engine

Multiple Choice: Text-based questions with 3-4 options.

Numeric Input: A custom on-screen keypad (do not rely on the device keyboard to keep the UI consistent).

Visual Selection: Tapping specific quadrants of an image.

C. Gamification & Progression

World Map: A scrolling level selector (e.g., "Jungle World," "Space World").

Unlocking: World 2 remains locked until 8/10 stars are collected in World 1.

Star System: Performance-based rating (3 stars for 1st try).

D. The Hint System

Logic: A "Lightbulb" icon present on every question.

Action: Triggers a specific hint text or hides 1 wrong answer.

Cost: Cooldown timer (5 seconds) to prevent spamming.

5. Non-Functional Requirements
   Privacy (COPPA): No user accounts. No cookies tracking personal data. All progress is saved locally to the browser's storage.

Performance: The Web App must load in under 2 seconds on 4G networks.

PWA (Progressive Web App): The web app must be installable (add to home screen) and capable of running offline if possible.

6. Development Phases (AI Agent Roadmap)
   Phase 1: The "Universal" Skeleton

Setup Expo + Expo Router.

Create the ScreenWrapper to handle Desktop vs. Mobile layout.

Define the global Theme (Colors, Fonts).

Phase 2: The Logic Engine

Build the reusable QuestionCard component.

Implement the "Answer Checking" logic.

Create the ResultModal (Success/Failure popups).

Phase 3: Content & Polish

Inject the JSON list of logic puzzles (Word Riddles, Math Patterns).

Build the WorldMap screen with locking logic.

Add animations (confetti, button presses).

7. Monetization Strategy (Revised)
   Web MVP: Free to play (focus on user acquisition and feedback).

Native App (Future): Freemium model (World 1 Free, $2.99 IAP for full game).
