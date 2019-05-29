import { ValidationError } from "yup";

const formatYupError = (err: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = [];
  err.inner.forEach(e => {
    errors.push({
      path: e.path || 'unknown',
      message: e.message || 'unknown msg'
    });
  });

  return errors;
};

export default formatYupError;