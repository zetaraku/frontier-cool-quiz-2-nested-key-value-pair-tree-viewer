<script setup lang="ts">
import * as Vue from 'vue';
import { Icon } from '@iconify/vue';
import { pathSymbol, valueSymbol } from '@/symbol';
import { type TreeObject, type ForceFoldingType } from '@/utils';

const props = defineProps<{
  node: TreeObject;
  forceFolding?: ForceFoldingType;
}>();

const foldedKeys = Vue.reactive(new Set<string>());

function toggleFolding(k: string) {
  if (!foldedKeys.has(k)) {
    foldedKeys.add(k);
  } else {
    foldedKeys.delete(k);
  }
}

function getFoldingIcon(k: string, v: TreeObject) {
  // a "leaf node"
  if (Object.keys(v).length === 0) return 'mdi:information-box-outline';

  return foldedKeys.has(k) ? 'mdi:plus-box' : 'mdi:minus-box';
}

Vue.watch(() => props.forceFolding, (force) => {
  // fold all
  if (force === 'fold') {
    for (const key of Object.keys(props.node)) {
      foldedKeys.add(key);
    }
  }

  // unfold all
  if (force === 'unfold') {
    foldedKeys.clear();
  }
});
</script>

<template lang="pug">

ul

  li(v-for="[k, v] in Object.entries(node)")

    label.text-gray-300.cursor-pointer.select-none(
      @click="toggleFolding(k);"
    )

      //- folding icon
      Icon.inline.mr-2(:icon="getFoldingIcon(k, v)")

      //- key
      span.font-mono.font-bold(:title="v[pathSymbol]") {{ k }}

      //- ":"
      span.font-mono(v-if="v[valueSymbol] !== undefined") {{ ': ' }}

    //- node value
    span.font-mono.text-blue-400(v-if="v[valueSymbol] !== undefined") {{ v[valueSymbol] }}

    //- child nodes
    KVTree.pl-8(
      v-show="!foldedKeys.has(k)"
      :node="v"
      :forceFolding="forceFolding"
    )

</template>
