// Re-export the shared AudioPlayer component for use within listening screens.
// Architecture.md lists AudioPlayer under both src/components/inputs/ (shared)
// and src/screens/listening/ (screen-level). The screen-level file re-exports
// the component so both import paths resolve correctly.
export { AudioPlayer } from '../../components/inputs/AudioPlayer'
