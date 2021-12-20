type Observer<T> = { next: (value: T) => void; complete: () => void };

class SafeSubscriber<T> implements Observer<T> {
  closed = false;
  /**
   *
   */
  constructor(private destination: Observer<T>) {}

  next(val: T) {
    if (!this.closed) {
      this.destination.next(val);
    }
  }

  complete() {
    if (!this.closed) {
      this.destination.complete();
      this.closed = true;
    }
  }
}

class Observable<T> {
  constructor(private subscribeFn: (observer: Observer<T>) => void) {
    console.log(subscribeFn);
  }

  subscribe(observer: Observer<T>) {
    const subscriber = new SafeSubscriber<T>(observer);
    //this.subscribeFn(observer);
    this.subscribeFn(subscriber);
    return {
      unsubscribe: () => {
        subscriber.closed = true;
      }
    };
  }
}

const timer$ = new Observable((obs: Observer<any>) => {
  setInterval(function (val: any) {
    obs.next(val);
  }, 1000);
});

const subscription = timer$.subscribe({
  next: () => {
    console.log("tick");
  },
  complete: () => {}
});

setTimeout(() => {
  subscription.unsubscribe();
}, 5000);
