# Vue Computed Dimensions

This library provides a mixin which allows component HTML dimensions (width, height, x and y positions) to be used in computed properties of Vue components.

```
yarn add vue-computed-dimensions
```

or

```
npm install vue-computed-dimensions
```

# Examples

```vue
<template>
  <div ref="wrapper">
    ...

    <div ref="other">...</div>
  </div>
</template>

<script>
import computedDimensions from "vue-computed-dimensions";

export default {
  // computedDimensions accepts a list of refs to use.
  // each ref provided will produce 4 computed properties
  // in this example we will have wrapperWidth wrapperHeight wrapperX and wrapperY. As well as otherWidth, otherHeight, otherX, and otherY.
  // these can then be used in other computed properties to base reactivity on the rendered dimensions of an element
  mixins: [computedDimensions("wrapper", "other")],
};
</script>
```
