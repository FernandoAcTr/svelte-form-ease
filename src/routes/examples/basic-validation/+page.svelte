<script lang="ts">
	import { createForm } from '$lib/index.js';
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

	let onSubmit = (event: Event) => {
		event.preventDefault();

		if (!validateForm()) return;

		loading.set(true);

		setTimeout(() => {
			alert(JSON.stringify(get(formData)));
			loading.set(true);
			resetForm();
		}, 1000);
	};

	const reset = () => {
		resetForm();
	};
</script>

<h1 class="text-3xl font-bold mb-4">Basic Usage</h1>

<p class="mb-3">
	This is the simplest way to use this library. You can use the <code>createForm</code> function to
	get a bunch of utilities to manage your form. You can use the <code>formData</code> store to get
	the current value of the form, the <code>validateForm</code> function to validate the form, the
	<code>errors</code>
	store to get the current errors of the form, the <code>resetForm</code> function to reset the form
	and the <code>loading</code> store to manage the loading state of the form.
</p>

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
	<button type="button" class="btn btn-primary" on:click={reset}> Reset </button>
</form>
