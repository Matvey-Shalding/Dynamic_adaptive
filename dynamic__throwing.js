const storage = new Map();
const attribute = "data-da";
const elements = document.querySelectorAll(`[${attribute}]`);
export function formingData() {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    let [destination, breakpoint, index, type] = element
      .getAttribute(attribute)
      .split(",");
    type = type === undefined ? (type = "max") : type;
    if (type) {
      if (type !== "max" && type !== "min") {
        throw new Error("Invalid type");
      } else {
        type = "max";
      }
    }
    storage.set(element, {
      destination: destination,
      breakpoint: `(${type}-width: ${breakpoint}px)`,
      indexForDestination: index,
      parent: element.parentElement,
    });
    storage.get(element).indexInParent = Array.from(
      storage.get(element).parent.children
    ).findIndex((child) => {
      return child.getAttribute("class") === element.getAttribute("class");
    });
  }
}
export const dynamicThrowing = () => {
  function mainAdaptive() {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const data = storage.get(element);
      if (window.matchMedia(data.breakpoint).matches) {
        element.classList.add("_dynamic-adapted");
        const dest = document.querySelector(data.destination);
        let position;
        if (
          typeof Number(data.indexForDestination) === "number" &&
          Number(data.indexForDestination) - 1 < dest.children.length
        ) {
          position = [...dest.children].find((item, index) => index === Number(data.indexForDestination));
        } else {
          if (data.indexForDestination === "first") {
            position = dest.firstChild;
          } else if (
            data.indexForDestination === "last" ||
            data.indexForDestination - 1 >= dest.children.length
          ) {
            position = null;
          } else throw new Error("Invalid index of destination");
        }
        dest.insertBefore(element, position);
      } else {
        if (element.classList.contains("_dynamic-adapted")) {
          element.classList.remove("_dynamic-adapted");
          const position = [...data.parent.children].find(
            (item, index) => index === data.indexInParent
          );
          data.parent.insertBefore(element, position);
        }
      }
    }
  }
  mainAdaptive();
};
export const dataChange = () => {
  const attribute_change = 'data-change'
  const elements = document.querySelectorAll(`[${attribute_change}]`)
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    const type = element.getAttribute(attribute).split(',')[3]
    const prevValue = element.getAttribute(attribute)
    const value = element.getAttribute(attribute_change)
    const mediaRequest = value.split(',').splice(1,Infinity)
    let media
    if(type) {
      media = window.matchMedia(`(${type}-width: ${mediaRequest}px)`).matches
    } else {
      media = window.matchMedia(`(max-width: ${mediaRequest}px)`).matches
    }
    if(media) {
      if(!element.classList.contains('dynamic_changed')) {
        element.classList.add('dynamic_changed')
        element.setAttribute(attribute,value.split(','))
        element.setAttribute(attribute_change,`${mediaRequest},${prevValue}`)
      }
    } else {
      if(element.classList.contains('dynamic_changed')) {
        element.classList.remove('dynamic_changed')
        element.setAttribute(attribute,prevValue)
        element.setAttribute(attribute_change,value)
      }
    }
  }
}