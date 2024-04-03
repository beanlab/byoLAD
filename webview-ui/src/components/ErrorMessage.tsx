import React from "react";

interface ErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
  return (
    <div className="error-message-container">
      <i className="codicon codicon-warning warning-error-icon"></i>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorMessage;
