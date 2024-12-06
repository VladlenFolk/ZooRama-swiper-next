export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
    let lastFunc: ReturnType<typeof setTimeout> | null = null;
    let lastRan: number | null = null;
  
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const context = this; // Сохраняем контекст вызова
      const now = Date.now();
  
      if (!lastRan) {
        func.apply(context, args); // Вызываем функцию сразу
        lastRan = now;
      } else {
        if (lastFunc) clearTimeout(lastFunc); // Убираем предыдущий таймер
        lastFunc = setTimeout(() => {
          if (lastRan && now - lastRan >= limit) {
            func.apply(context, args);
            lastRan = now;
          }
        }, limit - (now - (lastRan || 0)));
      }
    };
  }
  