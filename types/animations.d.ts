// Global JSX type augmentation for custom data attributes used by AnimationOrchestrator
declare namespace React {
  interface HTMLAttributes<T> {
    "data-reveal"?: string | boolean;
    "data-reveal-delay"?: string;
  }
}
