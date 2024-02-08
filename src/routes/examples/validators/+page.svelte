<script lang="ts">
	import { get } from 'svelte/store';
	import { createForm } from '$lib/index.js';
	import { boolean, string } from '$lib/validators/index.js';

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
</script>

<h1 class="text-3xl font-bold mb-4">Using Validators</h1>

<p class="mb-3">
	The library includes a set of built-in validators that you can use to validate your form fields
	very easy.
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
</form>
