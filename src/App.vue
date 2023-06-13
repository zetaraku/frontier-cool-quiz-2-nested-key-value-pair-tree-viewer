<script setup lang="ts">
import * as Vue from 'vue';
import { Icon } from '@iconify/vue';

const kvPairs = Vue.ref<{ key: string, value: unknown }[]>([
  { key: 'nav.header.creator', value: '3D Fabric Creator' },
  { key: 'nav.icon', value: 'Icon name' },
  { key: 'nav.header.product', value: 'Product' },
  { key: 'common.feature.experience', value: 'Try It Now!' },
  { key: 'common.feature.chooseFabric', value: 'Choose Fabric' },
]);

const resultObject = Vue.computed(() => {
  const result = {} as any;

  for (const kvPair of kvPairs.value) {
    if (kvPair.key === '') continue;

    let node = result;

    // make nested objects along the key path
    for (const subKey of kvPair.key.split('.')) {
      if (subKey === '$value') throw new Error('$value is a reserved key!');

      node = (node[subKey] ??= {});
    }

    // set the node value
    node.$value = kvPair.value;
  }

  return result;
});
</script>

<template lang="pug">

.container.flex.flex-col.min-h-screen.py-8.mx-auto

  header

    h1.font-bold.text-2xl.mb-3
      | Nested Key-Value Pair Tree Viewer

  main.flex-1.flex.gap-8

    //- left panel
    section.flex-1.border.border-slate-500.p-4

      //- toolbar
      div.flex.flex-row.gap-4.justify-end.py-2.mb-4

        //- add button
        button.inline-flex.items-center.gap-2.font-semibold.text-lg.text-slate-800.bg-slate-200.px-3.py-2(
          @click="kvPairs.push({ key: '', value: '' });"
        )
          Icon.inline(icon="mdi:plus")
          | Add New Pair

      //- key-value pairs
      ul.flex.flex-col.gap-4

        //- rows
        li.flex.flex-row.gap-4(
          v-for="(kvPair, index) in kvPairs"
        )

          //- key input
          input.flex-1.font-mono.text-slate-200.bg-slate-900.border.border-slate-500.px-2.py-1(
            :value="kvPair.key"
            placeholder="Key"
            @input="kvPair.key = $event.target.value;"
          )

          //- value input
          input.flex-1.font-mono.text-slate-200.bg-slate-900.border.border-slate-500.px-2.py-1(
            :value="kvPair.value"
            placeholder="Value"
            @input="kvPair.value = $event.target.value;"
          )

          //- remove button
          button.inline-grid.place-items-center.text-lg.text-slate-800.bg-slate-300.aspect-square(
            @click="kvPairs.splice(index, 1);"
          )
            Icon.inline(icon="mdi:minus")

    //- right panel
    section.flex-1.border.border-slate-500.p-4.overflow-x-scroll

      pre
        | {{ JSON.stringify(resultObject, null, '\t') }}

</template>

<style>
body {
  @apply text-slate-200 bg-slate-900 overflow-y-scroll;
}
</style>
