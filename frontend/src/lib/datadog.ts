import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

/**
 * Initialize Datadog monitoring for the frontend
 * This should be called as early as possible in your application
 */
export function initializeDatadog() {
  const applicationId = import.meta.env.VITE_DATADOG_APPLICATION_ID;
  const clientToken = import.meta.env.VITE_DATADOG_CLIENT_TOKEN;
  const datadogSite = import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com';
  const env = import.meta.env.MODE;
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

  // Initialize Datadog RUM (Real User Monitoring)
  if (applicationId && clientToken) {
    datadogRum.init({
      applicationId,
      clientToken,
      site: datadogSite,
      service: 'portfolio-frontend',
      env,
      version,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
      allowedTracingOrigins: [
        /https:\/\/portfolio-backend\.onrender\.com/,
        /http:\/\/localhost:3000/,
      ],
    });

    // Start RUM session
    datadogRum.startSessionReplayRecording();

    console.log('Datadog RUM initialized successfully');
  } else {
    console.warn('Datadog RUM not initialized: Missing applicationId or clientToken');
  }

  // Initialize Datadog Logs
  if (clientToken) {
    datadogLogs.init({
      clientToken,
      site: datadogSite,
      service: 'portfolio-frontend',
      env,
      version,
      sessionSampleRate: 100,
      forwardErrorsToLogs: true,
      forwardConsoleLogs: 'all',
    });

    console.log('Datadog Logs initialized successfully');
  }
}

/**
 * Log a custom event to Datadog
 */
export function logCustomEvent(eventName: string, eventData?: Record<string, any>) {
  datadogLogs.logger.info(`Portfolio Event: ${eventName}`, {
    event_name: eventName,
    timestamp: new Date().toISOString(),
    ...eventData,
  });
}

/**
 * Track a page view in Datadog RUM
 */
export function trackPageView(pageName: string, pageData?: Record<string, any>) {
  datadogRum.addAction(pageName, pageData || {});
  datadogLogs.logger.info(`Page viewed: ${pageName}`, {
    page: pageName,
    timestamp: new Date().toISOString(),
    ...pageData,
  });
}

/**
 * Track a user action in Datadog RUM
 */
export function trackUserAction(actionName: string, actionData?: Record<string, any>) {
  datadogRum.addAction(actionName, actionData || {});
  logCustomEvent(`User Action: ${actionName}`, actionData);
}

/**
 * Track an error in Datadog
 */
export function trackError(error: Error, context?: Record<string, any>) {
  datadogRum.addError(error, context);
  datadogLogs.logger.error(`Error: ${error.message}`, {
    error_message: error.message,
    error_stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

/**
 * Track API calls in Datadog
 */
export function trackAPICall(
  method: string,
  url: string,
  status: number,
  duration: number,
  additionalData?: Record<string, any>
) {
  datadogRum.addAction(`API ${method}`, {
    method,
    url,
    status,
    duration_ms: duration,
    ...additionalData,
  });

  logCustomEvent(`API ${method}`, {
    method,
    url,
    status,
    duration_ms: duration,
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
}

/**
 * Set user information in Datadog
 */
export function setUserInfo(userId: string, userName?: string, userEmail?: string) {
  datadogRum.setUserAction({
    id: userId,
    name: userName,
    email: userEmail,
  });

  datadogLogs.setUserAction({
    id: userId,
    name: userName,
    email: userEmail,
  });
}

/**
 * Add context to all future logs and actions
 */
export function addGlobalContext(contextKey: string, contextValue: any) {
  datadogRum.addUserAction(contextKey, { [contextKey]: contextValue });
  datadogLogs.addLoggerGlobalContext(contextKey, contextValue);
}

export { datadogRum, datadogLogs };
