import { useLayoutEffect, useRef } from 'react';
import { mount } from 'svelte';

export const svelteHoc = (SvelteComponent: any) => {
  return (props: any) => {
    const svelteRef = useRef<HTMLDivElement>(null);
    const componentRef = useRef<any>(null);
    const initialRenderRef = useRef(true);

    // We only mount once and never remount
    useLayoutEffect(() => {
      if (!svelteRef.current) return;

      // Clear the target element before mounting to handle StrictMode double mounting
      if (svelteRef.current.firstChild) {
        svelteRef.current.innerHTML = '';
      }

      // Create a new props object that will be updated
      // Svelte 5 components will re-render when these objects are modified
      const mutableProps = { ...props };

      // Mount the Svelte 5 component with the mutable props reference
      componentRef.current = mount(SvelteComponent, {
        target: svelteRef.current,
        props: mutableProps,
      });

      // Store the mutable props for future updates
      componentRef.current.props = mutableProps;

      // Cleanup on unmount
      return () => {
        componentRef.current = null;
      };
    }, []);

    // Handle prop changes without remounting
    useLayoutEffect(() => {
      // Skip the initial render since we already passed props
      if (initialRenderRef.current) {
        initialRenderRef.current = false;
        return;
      }

      // Skip if component isn't mounted yet
      if (!componentRef.current || !componentRef.current.props) return;

      // Update all props directly in the mutable object
      // This takes advantage of Svelte 5's reactivity system
      const mutableProps = componentRef.current.props;

      // First, remove any props that no longer exist
      Object.keys(mutableProps).forEach(key => {
        if (!(key in props)) {
          delete mutableProps[key];
        }
      });

      // Then update or add all current props
      Object.keys(props).forEach(key => {
        mutableProps[key] = props[key];
      });
    }, [props]);

    return <div ref={svelteRef} />;
  };
};
