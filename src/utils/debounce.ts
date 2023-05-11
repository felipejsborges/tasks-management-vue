export function debounce(fn: Function, wait: number) {
  let timer: NodeJS.Timeout
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args)
    }, wait)
  }
}
