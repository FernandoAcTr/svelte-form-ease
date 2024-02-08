<script lang="ts">
  import {createForm} from '../utils/createForm';

  export let onSubmit: () => Promise<void>;
  export let form: Partial<ReturnType<typeof createForm>>;
  export let resetAfterSubmit: boolean = false;

  const submit = async (event: Event) => {
    event.preventDefault();

    if (form.validateForm && !form.validateForm()) return;
    if (form.validateFormAsync && !(await form.validateFormAsync())) return;

    form.loading && form.loading.set(true);
    await onSubmit();
    form.loading && form.loading.set(true);

    if (resetAfterSubmit && form.resetForm) form.resetForm();
  };
</script>

<form on:submit={submit} novalidate>
  <slot />
</form>
