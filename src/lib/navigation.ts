type NavigateOptions = {
  to: string;
  replace?: boolean;
};

type NavigatorFn = (options: NavigateOptions) => void;

let navigateFn: NavigatorFn | null = null;

export const setNavigator = (fn: NavigatorFn) => {
  navigateFn = fn;
};

export const navigateTo = (to: string, replace: boolean = true) => {
  if (navigateFn) {
    navigateFn({ to, replace });
  } else {
    // Fallback if navigator not set yet
    window.location.hash = to;
  }
};
