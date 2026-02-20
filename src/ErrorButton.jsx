import * as Sentry from "@sentry/react";
// Add this button component to your app to test Sentry's error tracking
export default function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error("This is your second error!");
      }}
    >
      Break the world
    </button>
  );
}
