export type Unsubscribe = () => void;
type Listener = () => void;

/**
 * 인탭 pub/sub + 크로스탭(storage 이벤트) 동기화 버스.
 * localStorage 폴백 어댑터의 "실시간" 흉내에 쓴다.
 * - emit(): 같은 탭의 모든 리스너 즉시 통지.
 * - subscribe(): 같은 탭 리스너 + 다른 탭의 `storage` 이벤트(같은 key) 둘 다 구독.
 * (storage 이벤트는 *다른* 탭에서만 발화하므로 인탭 통지는 emit 으로 직접 한다.)
 */
export function createEventBus(channel: string) {
  const listeners = new Set<Listener>();

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: Listener): Unsubscribe {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === channel) listener();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
    }
    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", onStorage);
      }
    };
  }

  return { emit, subscribe };
}

export type EventBus = ReturnType<typeof createEventBus>;
