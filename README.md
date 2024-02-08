# Svelte Form Ease

Svelte Form Ease is the simplest form manager that will help you maintain a clean and tidy state of your forms and their validations.

## Examples

Check the usage examples in [Svelte Form Ease Examples](https://github.com/FernandoAcTr/svelte-form-ease/tree/main/src/routes/examples)

## Basic Usage  

All you have to do is call the `createForm()` function, give it some initial data, which will correspond to the fields of your form, and get a bunch of writables that you can use to manage the state of your inputs.

```TSX
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

let { formData, validateForm, errors, resetForm, loading } = createForm({
    data: {
      email: '',
      password: '',
      name: '',
      check: false,
    },
})
<form>
  <div>
    <label>Name</label>
    <input type='text' bind:value={$formData.name} />
  </div>
  <div>
    <label>Email address</label>
    <input type='email' bind:value={$formData.email} />
  </div>
  <div>
    <label>Password</label>
    <input type='password' bind:value={$formData.password}/>
  </div>
  <div>
    <input type='checkbox' bind:checked={$formData.check} />
    <label>I accept the Privacy Policy</label>
  </div>
  <button type='submit' disabled={isLoading}>
    Submit
  </button>
</form>
```

## Validations

To create validations, pass a second argument to `createForm()` called validations.
A validator function must be passed for each property that you want to validate, which may or may not return an error message. If an error message is returned, it will be taken as a failed validation and the errors can be recovered in the errors object provided by the hook.
To execute the validations you must call the `validateForm()` function, also provided by the hook, for example in the submit handler.

```TSX
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

let { formData, validateForm, errors, resetForm, loading } = createForm({
    data: {
        email: '',
        password: '',
        name: '',
        check: false
    },
    validations: {
        email: (value) => {
            if (!value) return 'Please enter an email';
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                return 'Please enter a valid email';
        },
        name: (value) => {
            if (!value) return 'Please enter your name';
        },
        password: (value) => {
            if (!value) return 'Please enter a password';
        },
        check: (value) => {
            if (!value) return 'Please accept the privacy policies';
        }
    }
});

const onSubmit = (e: Event) => {
  e.preventDefault()
  if (!validateForm()) return

  //Here formData contains valid data
}

<form on:submit={onSubmit} novalidate>
	<div class="mb-3">
		<label for="exampleInputEmail1" class="form-label">Name</label>
		<input type="text" class="form-control" id="exampleInputEmail1" bind:value={$formData.name} />
		{#if $errors?.name}
			<p class="invalid-feedback d-block">
				{$errors.name}
			</p>
		{/if}
	</div>
	<div class="mb-3">
		<label for="exampleInputEmail1" class="form-label">Email address</label>
		<input type="email" class="form-control" id="exampleInputEmail1" bind:value={$formData.email} />
		{#if $errors?.email}
			<p class="invalid-feedback d-block">
				{$errors.email}
			</p>
		{/if}
	</div>
	<div class="mb-3">
		<label for="exampleInputPassword1" class="form-label">Password</label>
		<input
			type="password"
			class="form-control"
			id="exampleInputPassword1"
			bind:value={$formData.password}
		/>
		{#if $errors?.password}
			<p class="invalid-feedback d-block">
				{$errors.password}
			</p>
		{/if}
	</div>
	<div class="mb-3 form-check">
		<input
			type="checkbox"
			class="form-check-input"
			id="exampleCheck1"
			bind:checked={$formData.check}
		/>
		<label class="form-check-label" for="exampleCheck1">I accept the Privacy Policy</label>
		{#if $errors?.check}
			<p class="invalid-feedback d-block">
				{$errors.check}
			</p>
		{/if}
	</div>
	<button type="submit" class="btn btn-primary" disabled={$loading}> Submit </button>
</form>

```

## Async validations

Sometimes you will need asynchronous validations, for example to check in the backend if an email is already registered or not.
For this type of case you can use the property called `asyncValidations` of the `createForm()` hook, which works exactly the same as validations but they must return a string promise instead of a string, since they must be async functions.
There is also its counterpart `validateFormAsync`, a function that will execute all asynchronous validators and update the error messages corresponding to their validator function.

```TSX
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

let {
    formData,
    validateForm,
    validateFormAsync,
    errors,
    resetForm,
    loading,
    validateInput,
    validateInputAsync
} = createForm({
    data: {
        email: '',
        password: '',
        name: '',
        check: false
    },
    validations: {
        email: (value: string) => {
            if (!value) return 'Please enter an email';
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/.test(value))
                return 'Please enter a valid email';
        },
        name: (value: string) => {
            if (!value) return 'Please enter your name';
        },
        password: (value: string) => {
            if (!value) return 'Please enter a password';
        },
        check: (value: boolean) => {
            if (!value) return 'Please enter accept the privacy policies';
        }
    },
    asyncValidations: {
        email: async (_value: string) => {
            // Checking in backend if email already exists
            await sleep(1000);
            if (Math.random() < 0.5) return 'This email is already taken';
        }
    }
});

const onSubmit = async (e: Event) => {
  e.preventDefault()
  if (!validateForm()) return
  if (!(await validateFormAsync())) return //<- Check here the async validation after sync validation

  //Here formData contains valid data
}
```

## Hot validations

All validations are executed manually (usually before processing the data in the submit method), but it can also be executed on the fly, once the user has left an input.
For this we use the `validateInput()` or `validateInputAsync()` functions, in case there is an asynchronous validation for that field.

```TSX
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

let { formData, validateForm, errors, resetForm, loading, validateInput } = createForm({
    data: {
        email: '',
        password: '',
        name: '',
        check: false
    },
    validations: {
        email: (value) => {
            if (!value) return 'Please enter an email';
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                return 'Please enter a valid email';
        },
        name: (value) => {
            if (!value) return 'Please enter your name';
        },
        password: (value) => {
            if (!value) return 'Please enter a password';
        },
        check: (value) => {
            if (!value) return 'Please accept the privacy policies';
        }
    }
});
  
<form on:submit={onSubmit} novalidate>
	<div class="mb-3">
		<label for="exampleInputEmail2" class="form-label">Name</label>
		<input
			type="text"
			class="form-control"
			id="exampleInputEmail2"
			bind:value={$formData.name}
			on:blur={() => validateInput('name')}
		/>
		{#if $errors?.name}
			<p class="invalid-feedback d-block">
				{$errors.name}
			</p>
		{/if}
	</div>
	<div class="mb-3">
		<label for="exampleInputEmail2" class="form-label">Email address</label>
		<input
			type="email"
			class="form-control"
			id="exampleInputEmail2"
			bind:value={$formData.email}
			on:blur={() => validateInput('email')}
		/>
		{#if $errors?.email}
			<p class="invalid-feedback d-block">
				{$errors.email}
			</p>
		{/if}
	</div>
	<div class="mb-3">
		<label for="exampleInputPassword2" class="form-label">Password</label>
		<input
			type="password"
			class="form-control"
			id="exampleInputPassword2"
			bind:value={$formData.password}
			on:blur={() => validateInput('password')}
		/>
		{#if $errors?.password}
			<p class="invalid-feedback d-block">
				{$errors.password}
			</p>
		{/if}
	</div>
	<div class="mb-3 form-check">
		<input
			type="checkbox"
			class="form-check-input"
			id="exampleCheck2"
			bind:checked={$formData.check}
			on:blur={() => validateInput('check')}
		/>
		<label class="form-check-label" for="exampleCheck2"> I accept the Privacy Policy </label>
		{#if $errors?.check}
			<p class="invalid-feedback d-block">
				{$errors.check}
			</p>
		{/if}
	</div>
	<button type="submit" class="btn btn-primary" disabled={$loading}> Submit </button>
</form>
```

## Reset form state

You can reset the form via the `resetForm()` method provided by the `createForm()` hook. Only run it once you have used the entered data.
All your inputs will need to be controlled by their value property.

```TSX
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

let { formData, validateForm, errors, resetForm, loading, validateInput } = createForm({
  ...
})

const onSubmit = async (e: Event) => {
  e.preventDefault()
  if (!validateForm()) return
  if (!(await validateFormAsync())) return

  //Process data ...

  resetForm()
}
```

## Loading state

The function provides a writable called `loading` which you can subscribe or use it directly in you template with autosubsrcribe ($).
These are useful in case you want to make an asynchronous process, for example an ajax call with the form data and you need to reflect the wait in the UI, for example disable the submit button or show a spinner.

```TSX
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

const { 
    formData,
    validateForm,
    validateFormAsync,
    errors,
    resetForm,
    loading,
    validateInput,
    validateInputAsync
} = createForm({
   ...
})

let onSubmit = (event: Event) => {
    event.preventDefault();

    if (!validateForm()) return;

    loading.set(true); //<- Start loading

    setTimeout(() => {
        alert(JSON.stringify(get(formData)));
        loading.set(true); //<- Stop loading
        resetForm();
    }, 1000);
};
<form>
   {/* ...inputs */}

   <button type='submit' disabled={$loading}>
        Submit
   </button>
</form>
```

## Form component

Svelte Form Ease provides an optional component called Form, which receives an asynchronous `onSubmit` callback and will perform validations automatically before the callback, as well as set the loading state to true until the callback has been resolved. you need to pass the rest of the hook properties that you don't use where you are using the form. If you use Form component, you don't need to call e.preventDefault().
If you want to reset the form after submitting it, you can use resetAfterSubmit prop of Form component.  

This is completely optional, but it can save you a few lines of code.

```TSX
import { createForm, Form } from 'svelte-form-ease';
import { get } from 'svelte/store';

//Check how to extract all other properties inside ...form
let { formData, errors, validateInput, validateInputAsync, loading, ...form } = createForm({
  ...
})

//Check how to relate a Form component with the function createForm with "form" prop
<Form {onSubmit} form={{ ...form, loading }} resetAfterSubmit>
	<div class="mb-3">
		<label for="exampleInputEmail2" class="form-label">Name</label>
		<input
			type="text"
			class="form-control"
			id="exampleInputEmail2"
			bind:value={$formData.name}
			on:blur={() => validateInput('name')}
		/>
		{#if $errors?.name}
			<p class="invalid-feedback d-block">
				{$errors.name}
			</p>
		{/if}
	</div>
	[...]
	<button type="submit" class="btn btn-primary" disabled={$loading}> Submit </button>
</Form>
```

## Built in validators

Svelte Form Ease comes with pre-built validators with which you can validate common use cases for:
- strings
- numbers
- booleans
- dates 
- objects
- arrays 
  
For example you can rewrite this:
```TS
import { createForm } from 'svelte-form-ease';
import { get } from 'svelte/store';

let { formData, validateForm, errors, resetForm, loading } = createForm({
    data: {
        email: '',
        password: '',
        name: '',
        check: false
    },
    validations: {
        email: (value) => {
            if (!value) return 'Please enter an email';
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                return 'Please enter a valid email';
        },
        name: (value) => {
            if (!value) return 'Please enter your name';
        },
        password: (value) => {
            if (!value) return 'Please enter a password';
        },
        check: (value) => {
            if (!value) return 'Please accept the privacy policies';
        }
    }
});
```
like this

```TS
import { createForm, string, boolean } from 'svelte-form-ease'

let { formData, validateForm, errors, resetForm, loading } = createForm({
    data: {
        email: '',
        password: '',
        name: '',
        check: false
    },
    validations: {
        email: (value) => string(value).required('Please enter an email').email().validate(),
        name: (value) => string(value).required().name().validate(),
        password: (value) => string(value).required().min(4).max(8).validate(),
        check: (value) =>
            boolean(value).required().isTrue('Please accept the privacy policies').validate()
    }
});
```

All you have to do is start a validation string with the data type you need to validate, for example string(), number(), boolean(), object() or date() and pass the validated value as an argument.

```TS
validations: {
   email: (value) => string(value)...,
},
```

You can then continue the chain with as many validations as you require. At the end you must finalize the chain by calling the validate() method.

```TS
validations: {
   email: (value) => string(value).required().email().min(5).max(20).validate(),
},
```

Each validator has a predefined error message, but you can pass a custom message as the last argument to each validator.

```TS
validations: {
   email: (value) => string(value).required("Please enter an email").email("Please enter a valid email").min(5, "Al least 5 chars").max(20, "Less than 20 chars").validate(),
},
```

### Combine built in validators and custom validations

You can use the predefined validators and still do more specific validations, for example.

```TS
validations: {
      email: (value) => string(value).required('Please enter an email').email().validate(),
      name: (value) => string(value).required().name().validate(),
      password: (value) => {
        const error = string(value).required().min(4).max(8).validate()
        if (error) return error
        if(value.includes('.')) return '. is forbidden'
      },
      check: (value) => boolean(value).required().isTrue('Please accept the privacy policies').validate(),
}
```

## Related packages

Check the related package for React [React Form Ease](https://www.npmjs.com/package/react-form-ease)