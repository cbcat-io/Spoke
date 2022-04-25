export default function eventToMessage(event) {
  if (!event) return "";
  if (event.message) return event.message;
  const target = event.target;
  if (target) {
    if (event.target.error && event.target.error.message) return target.error.message;
    if (event.target.src) return `No s'ha pogut carregar "${target.src}"`;
    if (target instanceof XMLHttpRequest) {
      return `Error de xarxa: ${target.status || "Estat Desconegut."} ${target.statusText ||
        "Error Desconegut. Possiblement error CORS"}`;
    }

    return `Error desconegut a ${target}.`;
  }
  return `Error desconegut: "${JSON.stringify(event)}"`;
}

// Base error class to be used for all custom errors.
export class BaseError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

// Override the message of an error but append the existing stack trace.
export class RethrownError extends BaseError {
  constructor(message, error) {
    super(`${message}:\n  Causa:\n    ${eventToMessage(error).replace(/\n/g, "\n    ")}`);
    this.originalError = error;
    this.stack += "\n" + error.stack;
  }
}

// Output messages for multiple errors.
//
// Example: new MultiError("Error loading project", errors);
// Output:
//  Error loading project:
//
//  2 Errors:
//    Model "Example Model" could not be loaded:
//      Cause:
//        Network Error: Unknown error. Possibly caused by improper CORS headers.
//    Image "Example Image" could not be loaded.
//      Network Error: 404 Page not found.
export class MultiError extends BaseError {
  constructor(message, errors) {
    let finalMessage = `${message}:\n\n${errors.length} Error${errors.length > 1 ? "s" : ""}:`;

    for (const error of errors) {
      const errorMessage = error.message ? error.message.replace(/\n/g, "\n  ") : "Error Desconegut";
      finalMessage += "\n  " + errorMessage;
    }

    super(finalMessage);
  }
}
