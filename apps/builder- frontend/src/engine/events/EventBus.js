export class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, handler) {
    (this.events[event] ||= []).push(handler);
  }

  emit(event, payload) {
    (this.events[event] || []).forEach(fn => fn(payload));
  }
}
