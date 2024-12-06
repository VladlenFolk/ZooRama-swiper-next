export function throttle(
    func: (...args: any[]) => void,
    limit: number,
    options: { trailing?: boolean } = {}
  ) {
    let lastFunc: ReturnType<typeof setTimeout> | null = null;
    let lastRan: number | null = null;
  
    return function (this: any, ...args: any[]) {
      const context = this;
      const now = Date.now();
  
      if (!lastRan) {
        func.apply(context, args);
        lastRan = now;
      } else {
        if (now - lastRan >= limit) {
          func.apply(context, args);
          lastRan = now;
        } else if (options.trailing) {
          clearTimeout(lastFunc!);
          lastFunc = setTimeout(() => {
            func.apply(context, args);
            lastRan = Date.now();
          }, limit - (now - lastRan));
        }
      }
    };
  }
  