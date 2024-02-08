/* eslint-disable @typescript-eslint/no-explicit-any */
import {get, writable} from 'svelte/store';

type Validator<T, F> = (value: T, form: F) => string | undefined;
type AsyncValidator<T, F> = (value: T, form: F) => Promise<string | void>;

type FormOptions<T> = {
  data: T;
  validations?: {[key in keyof Partial<T>]: Validator<T[key], T>};
  asyncValidations?: {[key in keyof Partial<T>]: AsyncValidator<T[key], T>};
};

type Errors<T> = {[key in keyof Partial<T>]: string};

export function createForm<T>(options: FormOptions<T>) {
  const {data, asyncValidations, validations} = options;
  const loading = writable(false);
  const formData = writable<T>(data);
  const errors = writable<Errors<T>>({} as Errors<T>);
  const valid = writable<boolean>(false);

  const resetForm = () => {
    formData.set(data);
    errors.set({} as Errors<T>);
    valid.set(true);
    loading.set(false);
  };

  const validateForm = () => {
    if (!validations || Object.keys(validations).length === 0) return;

    let isValid = true;
    const _errors: any = {};

    for (const key of Object.keys(validations)) {
      const validator = (validations as any)[key];
      const errorMessage = validator((get(formData) as any)[key], formData);
      if (errorMessage) {
        isValid = false;
        _errors[key] = errorMessage;
      }
    }

    errors.set(_errors);
    valid.set(isValid);

    return isValid;
  };

  const validateFormAsync = async () => {
    if (!asyncValidations || Object.keys(asyncValidations).length == 0)
      return true;

    loading.set(true);

    let isValid = true;
    const _errors: any = {};

    for await (const key of Object.keys(asyncValidations)) {
      const validator = (asyncValidations as any)[key];

      let errorMessage: string | null = null;
      try {
        errorMessage = await validator((get(formData) as any)[key], formData);
      } catch (error) {
        errorMessage = `An exception occurred while the validator [${key}] was running`;
      }

      if (errorMessage) {
        isValid = false;
        _errors[key] = errorMessage;
      }
    }

    errors.set(_errors);
    valid.set(isValid);
    loading.set(false);

    return isValid;
  };

  const validateInput = (field: keyof T) => {
    if (!validations || Object.keys(validations).length == 0) return true;

    const validator = (validations as any)[field];
    if (!validator) return true;

    const errorMessage = validator((get(formData) as any)[field], formData);

    if (errorMessage) {
      errors.update(err => ({...err, [field]: errorMessage}));
    }

    return errorMessage ? false : true;
  };

  const validateInputAsync = async (field: keyof T) => {
    if (!asyncValidations || Object.keys(asyncValidations).length == 0)
      return true;
    const validator = (asyncValidations as any)[field];
    if (!validator) return true;

    let errorMessage: string | null = null;
    try {
      errorMessage = await validator((get(formData) as any)[field], formData);
    } catch (error) {
      errorMessage = `An exception occurred while the validator [${field as string}] was running`;
    }

    if (errorMessage) {
      errors.update(err => ({...err, [field]: errorMessage}));
    }

    return errorMessage ? false : true;
  };

  return {
    loading,
    formData,
    errors,
    resetForm,
    validateForm,
    validateFormAsync,
    validateInput,
    validateInputAsync
  };
}
