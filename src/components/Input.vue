<template>
    <div class="mb-3">
        <label :for="id" class="form-label">{{ label }}</label>
        <input
            :id="id"
            :type="type"
            class="form-control"
            :class="{'is-invalid' : help}"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <span v-if="help" class="invalid-feedback">{{ help }}</span>
    </div>
</template>

<script>
export default {
    emits: ['update:modelValue'],
    name: 'InputText',
    props: {
        label: String,
        id: String,
        help: String,
        modelValue: String,
        type: {
            type: String,
            default: 'text'
        }
    },
}
</script>