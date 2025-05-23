<script lang="ts" module>
  import type { SvelteHTMLElements } from "svelte/elements";
  import { cn } from "../../lib/cn";

    type ButtonProps = {
        text?: string;
        onclick: () => void;
        disabled?: boolean;
        children: SvelteHTMLElements["innerHTML"];
        className?: string;
    };
</script>

<script lang="ts">
    let { text, onclick, disabled, className = '', children }: ButtonProps = $props();
</script>

<button class={cn(className)} {onclick} {disabled}>
    {#if text}
        {text}
    {/if}
    {#if children}
        {#if typeof children === 'function'}
            {@html children()}
        {:else}
            {@html children}
        {/if}
    {/if}
</button>