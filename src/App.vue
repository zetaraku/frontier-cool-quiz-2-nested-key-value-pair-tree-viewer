<script setup lang="ts">
import * as Vue from 'vue';
import { Icon } from '@iconify/vue';
import ActionButton from '@/components/ActionButton.vue';
import KVTree from '@/components/KVTree.vue';
import { kvPairsToTreeObject, jsonToKvPairs, type KVPair, type ForceFoldingType } from '@/utils';

const kvPairs = Vue.ref<KVPair[]>([
  { key: 'nav.header.creator', value: '3D Fabric Creator' },
  { key: 'nav.icon', value: 'Icon name' },
  { key: 'nav.header.product', value: 'Product' },
  { key: 'common.feature.experience', value: 'Try It Now!' },
  { key: 'common.feature.chooseFabric', value: 'Choose Fabric' },
]);

const treeObject = Vue.computed(() => kvPairsToTreeObject(kvPairs.value));

const forceFolding = Vue.ref<ForceFoldingType>(null);

function clearAllPairs() {
  kvPairs.value.length = 0;
}

function loadFromJSON() {
  const jsonText = window.prompt();

  if (jsonText === null) return;

  try {
    kvPairs.value = jsonToKvPairs(jsonText);
  } catch (err) {
    window.alert(err);
  }
}

function addNewPair() {
  kvPairs.value.push({ key: '', value: '' });
}

function removePairAt(index: number) {
  kvPairs.value.splice(index, 1);
}

async function setFolding(folding: ForceFoldingType) {
  forceFolding.value = folding;

  await Vue.nextTick();

  forceFolding.value = null;
}

function getEventTargetValue(event: Event) {
  return (event.target as HTMLInputElement).value;
}
</script>

<template lang="pug">

.container.flex.flex-col.min-h-screen.p-8.mx-auto

  header

    h1.font-bold.text-2xl.mb-3
      | Nested Key-Value Pair Tree Viewer

  main.flex-1.grid.grid-cols-1.xl_grid-cols-2.gap-8

    //- left panel
    section.flex-1.flex.flex-col.border.border-slate-500.p-4

      //- toolbar
      div.flex.flex-row.gap-4.justify-end.py-2.mb-4

        //- "Clear All" button
        ActionButton(
          icon="mdi:trash-can"
          @click="clearAllPairs"
        ) Clear All

        //- "Load JSON" button
        ActionButton(
          icon="mdi:code-json"
          @click="loadFromJSON"
        ) Load JSON

        //- "Add New Pair" button
        ActionButton(
          icon="mdi:plus"
          @click="addNewPair"
        ) Add New Pair

      //- key-value pairs
      div.flex-1.whitespace-nowrap.overflow-auto

        ul.flex.flex-col.gap-4

          li.flex.flex-row.gap-4(
            v-for="(kvPair, index) in kvPairs"
          )

            //- key input
            input.flex-1.font-mono.text-slate-200.bg-slate-900.border.border-slate-500.px-2.py-1(
              :value="kvPair.key"
              placeholder="Key"
              @input="kvPair.key = getEventTargetValue($event);"
            )

            //- value input
            input.flex-1.font-mono.text-slate-200.bg-slate-900.border.border-slate-500.px-2.py-1(
              :value="kvPair.value"
              placeholder="Value"
              @input="kvPair.value = getEventTargetValue($event);"
            )

            //- remove button
            button.inline-grid.place-items-center.text-lg.text-slate-800.bg-slate-300.p-2(
              @click="removePairAt(index);"
            )
              Icon.inline(icon="mdi:trash-can-outline")

    //- right panel
    section.flex-1.flex.flex-col.border.border-slate-500.p-4

      //- toolbar
      div.flex.flex-row.gap-4.justify-end.py-2.mb-4

        //- "Fold All" button
        ActionButton(
          icon="mdi:plus-box-multiple-outline"
          @click="setFolding('fold');"
        ) Fold All

        //- "Unfold All" button
        ActionButton(
          icon="mdi:minus-box-multiple-outline"
          @click="setFolding('unfold');"
        ) Unfold All

      //- key-value pairs tree
      div.flex-1.whitespace-nowrap.overflow-auto

        KVTree.text-lg(
          :node="treeObject"
          :forceFolding="forceFolding"
        )

</template>

<style>
body {
  @apply text-slate-200 bg-slate-900 overflow-y-scroll;
}
</style>
