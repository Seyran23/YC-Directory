import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://96228e12639025004d45a662534d664f@o4508969267167232.ingest.de.sentry.io/4508969271885904",
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
});