<script setup lang="ts">
/**
 * ProtocolFormFields
 *
 * Dynamically renders form controls based on a connection type definition's configControls.
 */

import { computed } from 'vue'
import type { ControlDefinition } from '@/stores/nodes'

// Extended control definition for connection forms with conditional visibility
interface ConnectionFormControl extends Omit<ControlDefinition, 'props'> {
  props?: {
    type?: string
    placeholder?: string
    min?: number
    max?: number
    step?: number
    rows?: number
    options?: Array<{ value: string | number; label: string }>
  }
  showIf?: {
    field: string
    value?: unknown
    values?: unknown[]
  }
}

const props = defineProps<{
  /** Control definitions from the connection type */
  controls: ConnectionFormControl[]
  /** Current form values */
  values: Record<string, unknown>
}>()

const emit = defineEmits<{
  (e: 'update:values', values: Record<string, unknown>): void
}>()

function updateValue(controlId: string, value: unknown) {
  emit('update:values', {
    ...props.values,
    [controlId]: value,
  })
}

function getValue(control: ConnectionFormControl) {
  return props.values[control.id] ?? control.default
}

const visibleControls = computed(() => {
  return props.controls.filter((control) => {
    // Check visibility conditions if defined
    if (control.showIf) {
      const conditionValue = props.values[control.showIf.field]
      if (Array.isArray(control.showIf.values)) {
        return control.showIf.values.includes(conditionValue)
      }
      return conditionValue === control.showIf.value
    }
    return true
  })
})
</script>

<template>
  <div class="form-fields">
    <div
      v-for="control in visibleControls"
      :key="control.id"
      class="form-field"
    >
      <label
        :for="`field-${control.id}`"
        class="field-label"
      >
        {{ control.label }}
      </label>

      <!-- Text input -->
      <template v-if="control.type === 'text'">
        <input
          :id="`field-${control.id}`"
          :type="control.props?.type || 'text'"
          :value="getValue(control)"
          :placeholder="control.props?.placeholder"
          class="field-input"
          @input="(e) => updateValue(control.id, (e.target as HTMLInputElement).value)"
        >
      </template>

      <!-- Number input -->
      <template v-else-if="control.type === 'number'">
        <input
          :id="`field-${control.id}`"
          type="number"
          :value="getValue(control)"
          :min="control.props?.min"
          :max="control.props?.max"
          :step="control.props?.step || 1"
          class="field-input"
          @input="(e) => updateValue(control.id, Number((e.target as HTMLInputElement).value))"
        >
      </template>

      <!-- Checkbox -->
      <template v-else-if="control.type === 'checkbox'">
        <div class="checkbox-wrapper">
          <input
            :id="`field-${control.id}`"
            type="checkbox"
            :checked="Boolean(getValue(control))"
            class="field-checkbox"
            @change="(e) => updateValue(control.id, (e.target as HTMLInputElement).checked)"
          >
          <span
            v-if="control.description"
            class="checkbox-description"
          >
            {{ control.description }}
          </span>
        </div>
      </template>

      <!-- Select -->
      <template v-else-if="control.type === 'select'">
        <select
          :id="`field-${control.id}`"
          :value="getValue(control)"
          class="field-select"
          @change="(e) => updateValue(control.id, (e.target as HTMLSelectElement).value)"
        >
          <option
            v-for="option in control.props?.options || []"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </template>

      <!-- Textarea -->
      <template v-else-if="control.type === 'textarea'">
        <textarea
          :id="`field-${control.id}`"
          :value="getValue(control) as string"
          :rows="control.props?.rows || 3"
          :placeholder="control.props?.placeholder"
          class="field-textarea"
          @input="(e) => updateValue(control.id, (e.target as HTMLTextAreaElement).value)"
        />
      </template>

      <!-- Description (if not checkbox) -->
      <span
        v-if="control.description && control.type !== 'checkbox'"
        class="field-description"
      >
        {{ control.description }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-neutral-700);
}

.field-input,
.field-select,
.field-textarea {
  padding: var(--space-2) var(--space-3);
  background: white;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  font-family: var(--font-mono);
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: var(--color-neutral-400);
}

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-2) center;
  padding-right: var(--space-8);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-description {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.field-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary-500);
  cursor: pointer;
}

.checkbox-description {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}
</style>
