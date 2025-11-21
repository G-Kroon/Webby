export class ResponsiveEngine {
  constructor() {
    this.breakpoints = {
      desktop: {},
      tablet: {},
      mobile: {},
    };
    this.current = "desktop";
  }

  setBreakpoint(bp) {
    this.current = bp;
  }

  apply(node, styleObj) {
    if (!this.breakpoints[this.current][node.id])
      this.breakpoints[this.current][node.id] = {};

    Object.assign(this.breakpoints[this.current][node.id], styleObj);
  }
}
