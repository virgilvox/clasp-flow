<script setup lang="ts">
</script>

<template>
  <div class="control-panel-view">
    <div class="panel-placeholder">
      <h2>Control Panel</h2>
      <p>Exposed controls from nodes will appear here</p>
      <p class="hint">Mark controls as "exposable" in node definitions to add them to this panel</p>
    </div>
  </div>
</template>

<style scoped>
.control-panel-view {
  width: 100%;
  height: 100%;
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-placeholder {
  text-align: center;
  color: var(--color-neutral-500);
}

.panel-placeholder h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-4);
  color: var(--color-neutral-700);
}

.panel-placeholder p {
  margin-bottom: var(--space-2);
}

.hint {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
}
</style>
