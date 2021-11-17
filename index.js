// Either pass in a list of refs to watch, or an object, whose keys are the name, and the values are a function which returns the element to watch like: { container: component => component.refs.parent.el }. this.$refs will be passed to the function as refs.
// if container is passed as a string, the component will have 4 new pieces of data kept in sync with the dom: this.containerWidth, this.containerHeight, thisContainerX and this.containerY.

export default function (...args) {
  const refKeys = determineRefKeys(args);

  return {
    data() {
      const obj = {};

      for (const refKey of refKeys) {
        obj[observerKey(refKey)] = null;
        obj[widthKey(refKey)] = 0;
        obj[heightKey(refKey)] = 0;
        obj[xKey(refKey)] = 0;
        obj[yKey(refKey)] = 0;
      }

      return obj;
    },

    methods: {
      setDimensions(refKey) {
        const rect = this.elFromRefKey(refKey).getBoundingClientRect();

        this[widthKey(refKey)] = rect.width;
        this[heightKey(refKey)] = rect.height;
        this[xKey(refKey)] = rect.x;
        this[yKey(refKey)] = rect.y;
      },

      elFromRefKey(refKey) {
        const el = isObjectArgs(args)
          ? args[0][refKey](this)
          : this.$refs[refKey];

        return el.$el || el; // if its a vuecomponent ref, get the actual element, otherwise its a normal element ref so carry on
      },
    },

    mounted() {
      this.$nextTick(() => {
        for (const refKey of refKeys) {
          this[observerKey(refKey)] = new ResizeObserver(
            this.setDimensions.bind(this, refKey)
          );
          const el = this.elFromRefKey(refKey);

          if (el) {
            this[observerKey(refKey)].observe(el);
            this.setDimensions(refKey);
          } else {
            throw new Error(
              `computedDimensions mixin could not find a ref element with key: ${refKey}`
            );
          }
        }
      });
    },

    beforeDestroy() {
      for (const refKey of refKeys) {
        this[observerKey(refKey)].disconnect();
      }
    },
  };
}

function determineRefKeys(args) {
  if (isObjectArgs(args)) {
    return Object.keys(args[0]);
  } else {
    return args;
  }
}

function isObjectArgs(args) {
  return args.length === 1 && typeof args[0] === "object";
}

function observerKey(ref) {
  return `${ref}ComputedDimensionsObserver`;
}

function widthKey(ref) {
  return `${ref}Width`;
}

function heightKey(ref) {
  return `${ref}Height`;
}

function xKey(ref) {
  return `${ref}X`;
}

function yKey(ref) {
  return `${ref}Y`;
}
