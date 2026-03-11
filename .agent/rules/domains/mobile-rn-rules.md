# mobile-rn Domain Rules

## Activation Condition

"react-native" dependency present in package.json.

## Architecture Assumption

React Native 0.76+ → New Architecture DEFAULT.
Do not enable old architecture (bridge) in new projects.

## Expo vs Bare

- Expo (managed): first choice for new projects
- Bare workflow: if mandatory native module required

## Primary Agent

mobile-developer

## Styling

- StyleSheet API (default) or NativeWind
- Inline style: FORBIDDEN (re-render performance)

## Platform Differences

- Minimize Platform.OS usage — cross-platform first
- SafeAreaView: mandatory on every screen

## Test

Jest + React Native Testing Library
