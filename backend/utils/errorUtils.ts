export const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Unknown error occurred.";
};
