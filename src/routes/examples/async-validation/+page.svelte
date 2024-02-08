<script lang="ts">
	import { createForm } from '$lib/index.js';
	import { get } from 'svelte/store';

	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

	let onSubmit = async (event: Event) => {
		event.preventDefault();
		if (!validateForm()) return;
		if (!(await validateFormAsync())) return;

		loading.set(true);

		setTimeout(() => {
			alert(JSON.stringify(get(formData)));
			loading.set(true);
			resetForm();
		}, 1000);
	};
</script>

<h1 class="text-3xl font-bold mb-4">Async Validations</h1>

<p class="mb-3">
	An async validation is a validation that needs to be checked in an external service, form example
	a backend, that could be delay some time. For example, checking if an email
</p>

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
			on:blur={() => {
				validateInput('email');
				validateInputAsync('email');
			}}
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
